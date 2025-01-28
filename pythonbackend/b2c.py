import uuid

from fastapi import APIRouter, Request , HTTPException
import requests
import os
from dotenv import load_dotenv
from datetime import datetime
from supabase_client import supabase

# Create a router
router = APIRouter()

# Load environment variables
load_dotenv()
# Environment variables
INITIATOR_NAME = os.getenv("INITIATOR_NAME")
B2C_TIMEOUT_CALLBACK = os.getenv("B2C_TIMEOUT_CALLBACK")
SECURITY_CREDENTIAL = os.getenv("SECURITY_CREDENTIAL")
B2C_RESULT_CALLBACK = os.getenv("B2C_RESULT_CALLBACK")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
B2C_URL = "https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest"
DOMAIN_NAME = os.getenv("DOMAIN_NAME")

# B2C payment endpoint
@router.post("/b2c/payment")
async def initiate_b2c_payment(request: Request):
    payload = await request.json()

    amount = payload.get("amount")
    phone = payload.get("phone_number")

    access_token = await get_access_token()

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}",
    }


    b2c_payload = {
        "OriginatorConversationID": generate_originator_id(),
        "InitiatorName": INITIATOR_NAME,
        "SecurityCredential": SECURITY_CREDENTIAL,
        "CommandID": "SalaryPayment",
        "Amount": amount,
        "PartyA": 600998,
        "PartyB": phone,
        "Remarks": "mtaani fx",
        "QueueTimeOutURL": DOMAIN_NAME+B2C_TIMEOUT_CALLBACK,
        "ResultURL": DOMAIN_NAME+B2C_RESULT_CALLBACK,
        "Occasion": "mtaani salary",
    }

    # Make the B2C request
    response = requests.post(B2C_URL, headers=headers, json=b2c_payload)
    saf_response = response.json()
    print("Safaricom Response:", saf_response)

    # Log the transaction in Supabase
    if response.status_code == 200:
        response_code = saf_response.get("ResponseCode")
        transaction_id = saf_response.get("TransactionID")

        payment_data = {
            "amount": amount,
            "phone_number": phone,
            "created_at": datetime.now().isoformat(),
            "status": "Pending" if response_code == "0" else "Failed",
            "transaction_id": transaction_id,
        }

        save_response = supabase.table("payments").insert(payment_data).execute()
        print("Database save response:", save_response)

        return {
            "status": "success",
            "payment_data": payment_data,
            "safaricom_response": saf_response,
        }
    else:
        raise HTTPException(
            status_code=response.status_code,
            detail={"status": "failed", "response": saf_response},
        )


# Callback for result notification
@router.post("/b2c/result")
async def handle_result_callback(request: Request):
    data = await request.json()
    result = data.get("Result")

    if result:
        result_code = result.get("ResultCode")
        transaction_id = result.get("TransactionID")
        receiver_info = result.get("ReceiverPartyPublicName", "").split('|')
        phone_number = receiver_info[0] if receiver_info else None
        amount = result.get("Amount", 0)

        # Update the payment in the database
        status = "Completed" if result_code == 0 else "Failed"
        supabase.table("payments").update({
            "status": status,
            "phone_number": phone_number,
            "amount": amount,
            "transaction_id":transaction_id,
        }).eq("transaction_id", transaction_id).execute()

    return {"status": "callback processed"}


# when the process takes to long some data is sent here by saf
@router.post("/b2c/queue")
async def handle_timeout_callback(request: Request):
    data = await request.json()
    print("\n\n\nRequest timed out while awaiting processing", data)
    return {"status": "success"}

def generate_originator_id():
    return str(uuid.uuid4())

async def get_access_token():
    url = f"https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(url, auth=(CONSUMER_KEY, CONSUMER_SECRET))
    response.raise_for_status()
    return response.json()["access_token"]

