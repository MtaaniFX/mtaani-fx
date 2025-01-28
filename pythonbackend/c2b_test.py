import os
import requests
import base64
from dotenv import load_dotenv
from fastapi import APIRouter, Request
from daraja_utils import stk_password
router = APIRouter()

load_dotenv()

# Configuration (Replace with your details)
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
SHORTCODE = os.getenv("SHORT_CODE")  # Till or Paybill number
PASSKEY = os.getenv("PASSKEY") # Provided by Safaricom
STK_PUSH_URL = os.getenv("STK_PUSH_URL")
OAUTH_URL = os.getenv("OAUTH_URL")
C2B_RESULT_CALLBACK = os.getenv("C2B_RESULT_CALLBACK")


def get_access_token():
    try:
        credentials = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        headers = {'Authorization': f'Basic {encoded_credentials}'}

        response = requests.get(OAUTH_URL, headers=headers)
        response.raise_for_status()
        return response.json()['access_token']
    except Exception as e:
        print(f"Error getting access token: {e}")
        return None

@router.post("/c2b/result")
async def handle_result_callback(request: Request):
    data = await request.json()
    print("\ncallback received for c2b")
    print(data)
    print()

@router.post("/c2b/payment")
def stk_push(request: Request):
    phone_number = request.get("phone_number")
    amount = request.get("amount")
    account_reference = request.get("account_reference")
    description = request.get("description")


    access_token = get_access_token()
    if not access_token:
        return None

    password, timestamp = stk_password()

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",  # Or "CustomerBuyGoodsOnline"
        "Amount": amount,
        "PartyA": phone_number,
        "PartyB": SHORTCODE,
        "PhoneNumber": phone_number,
        "CallBackURL": C2B_RESULT_CALLBACK,
        "AccountReference": account_reference,
        "TransactionDesc": description
    }

    try:
        response = requests.post(STK_PUSH_URL, json=payload, headers=headers)
        response.raise_for_status()
        print("c2b->>>>",response.json())
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"STK Push request failed: {e}")
        return None


# if __name__ == "_main_":
#     # Example usage
#     phone_number = "254715576479"
#     amount = "1"
#     account_ref = "mtaanifx-2025"
#     description = "Deposit to mtaanifx"
#
#     response = stk_push(phone_number, amount, account_ref, description)
#
#     if response:
#         if response.get('ResponseCode') == '0':
#             print("STK Push initiated successfully!")
#             print(f"Checkout Request ID: {response.get('CheckoutRequestID')}")
#             print(f"Merchant Request ID: {response.get('MerchantRequestID')}")
#             print(f"Response: {json.dumps(response, indent=2)}")
#         else:
#             print("STK Push failed:")
#             print(json.dumps(response, indent=2))
#     else:
#         print("Failed to initiate STK Push")