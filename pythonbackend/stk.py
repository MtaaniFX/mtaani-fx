import httpx
from base64 import b64encode
import os
from dotenv import load_dotenv
from datetime import datetime
from fastapi import APIRouter, Request, HTTPException
from supabase_client import supabase

router = APIRouter()

load_dotenv()

PASSKEY = os.getenv("PASSKEY")
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
OAUTH_URL = os.getenv("OAUTH_URL")
SHORTCODE = os.getenv("SHORT_CODE") # Till or Paybill
DOMAIN_NAME = os.getenv("DOMAIN_NAME")


# once payment is done, you will get a json object here from safaricom
# this is same as c2b
@router.post("/stk/callback")
async def handle_stk_callback(request: Request):
    body =  await request.json()

    callback_data = body["Body"]["stkCallback"]
    status_code =  callback_data["ResultCode"]

    if int(status_code) != 0:
        return {"message":"failed"}
    

    amount =  callback_data["CallbackMetadata"]["Item"][0]["Value"]
    receipt_number = callback_data["CallbackMetadata"]["Item"][1]["Value"]
    phone_number =  callback_data["CallbackMetadata"]["Item"][3]["Value"]
    result_description = callback_data["ResultDesc"]

    response = supabase.table("transactions_mtaani").update({
            "status":"Completed",
            "mpesa_receipt_number":receipt_number,
        }).eq("phone_number", phone_number).eq("status", "Pending").execute()
    
    if not response:
        raise HTTPException(status_code=500,detail="failed to log to database")
    
    return {"message" : "success"}


# retrieves an OAuth token from Safaricom's Sandbox API
# it encodes the CONSUMER_KEY and CONSUMER_SECRET in base64 to authenticate the API request
async def get_bearer_token() -> str:
    authentication_string = f"{CONSUMER_KEY}:{CONSUMER_SECRET}".encode("utf-8")
    encoded_auth = b64encode(authentication_string).decode("utf-8")

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
            headers={"Authorization": f"Basic {encoded_auth}"}
        )
        resp.raise_for_status()
        return resp.json()["access_token"]


# initiate a stk push
@router.post("/stk/payment")
async def stk(request: Request):
    # this data comes from frontend, enter user and amount
    data = await request.json()
    amount = data.get("amount")
    phone_number = data.get("phone_number")
    token = await get_bearer_token()
    STK_RESULT_CALLBACK = os.getenv("STK_RESULT_CALLBACK")
    SHORT_CODE = os.getenv("SHORT_CODE")
    password_stk = stk_password()
    timestamp = get_timestamp()
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    

    payload = {
        "BusinessShortCode": SHORT_CODE,
        "Password": password_stk,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": str(amount),
        "PartyA": phone_number,  # Sender's phone number
        "PartyB": SHORT_CODE,  # Business shortcode
        "PhoneNumber": phone_number,
        "CallBackURL": DOMAIN_NAME+STK_RESULT_CALLBACK,  # Ensure this is active to receive responses from the API
        "AccountReference": "test",
        "TransactionDesc": "test"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            headers=headers,
            json=payload
        )
        # print("json response>>>",response.json())
        return response.json()


# generate stk password
def stk_password():
    """Generate encrypted password using shortcode and passkey"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    data = f"{SHORTCODE}{PASSKEY}{timestamp}"
    return b64encode(data.encode()).decode()

def get_timestamp():
    return datetime.now().strftime("%Y%m%d%H%M%S")
