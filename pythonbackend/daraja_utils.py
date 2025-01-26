import httpx
import base64
from base64 import b64encode
import asyncio
from decimal import Decimal
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()
SMS_URL = os.getenv("DARAJA_SMS")
TOKEN_URL = os.getenv("DARAJA_ACCESS_TOKEN")
SHORT_CODE = os.getenv("SHORT_CODE")
ANOTHER=os.getenv("ANOTHER")
CALLBACK_URL = os.getenv("CALLBACK_URL")
B2C_RESULT_CALLBACK = os.getenv("B2C_RESULT_CALLBACK")
STK_RESULT_CALLBACK = os.getenv("STK_RESULT_CALLBACK")

# my keys
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")


# retrieves an OAuth token from Safaricom's Sandbox API
# it encodes the CONSUMER_KEY and CONSUMER_SECRET in base64 to authenticate the API request
async def get_bearer_token() -> str:
    authentication_string = f"{CONSUMER_KEY}:{CONSUMER_SECRET}".encode("utf-8")
    encoded_auth = base64.b64encode(authentication_string).decode("utf-8")

    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
            headers={"Authorization": f"Basic {encoded_auth}"}
        )
        resp.raise_for_status()
        return resp.json()["access_token"]


# initiate a stk push
async def stk(amount: Decimal, phone_number: str):
    token = await get_bearer_token()
    call_back = STK_RESULT_CALLBACK

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    print("\n\n\n\n",call_back,token)

    payload = {
        "BusinessShortCode": os.getenv("SHORT_CODE"),
        "Password": stk_password(),
        "Timestamp": get_timestamp(),
        "TransactionType": "CustomerPayBillOnline",
        "Amount": str(amount),
        "PartyA": phone_number,  # Sender's phone number
        "PartyB": os.getenv("SHORT_CODE"),  # Business shortcode
        "PhoneNumber": phone_number,
        "CallBackURL": call_back,  # Ensure this is active to receive responses from the API
        "AccountReference": "mtaanifx.com",
        "TransactionDesc": "Deposit"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            headers=headers,
            json=payload
        )
        response.raise_for_status()
        print("json response>>>",response.json())
        return response.json()


# generate stk password
def stk_password():
    shortcode = os.getenv("SHORT_CODE")
    passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"  # Your Daraja passkey
    timestamp = get_timestamp()
    password = f"{shortcode}{passkey}{timestamp}"
    print("function=stk_password()",password)
    return b64encode(password.encode()).decode()

def get_timestamp():
    return datetime.now().strftime("%Y%m%d%H%M%S")



async def main():
    await stk(Decimal("1"),"254715576479")

if __name__ == "__main__":
    asyncio.run(main())