import httpx
import base64
from base64 import b64encode
from typing import Dict
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
async def stk(amount: Decimal, phone_number: str, user_id: int):
    token = await get_bearer_token()
    call_back = "https://83a9-41-72-200-10.ngrok-free.app"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": os.getenv("SHORT_CODE"),
        "Password": stk_password(),
        "Timestamp": get_timestamp(),
        "TransactionType": "CustomerPayBillOnline",
        "Amount": str(amount),
        "PartyA": phone_number,  # Sender's phone number
        "PartyB": os.getenv("SHORT_CODE"),  # Business shortcode
        "PhoneNumber": phone_number,
        "CallBackURL": call_back,  # Ensure this is active
        "AccountReference": "MtaaniFX",
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
    print("password=->>>",password)
    return b64encode(password.encode()).decode()

def get_timestamp():
    return datetime.now().strftime("%Y%m%d%H%M%S")


# sends an SMS message with the phone number and message body to the provided URL
# this function uses the token generated in the previous step for authorization
async def send_sms(phone: str, message: str) -> Dict:
    token = await get_bearer_token()
    sms_data = {
        "ShortCode": "12345", # needs a function to generate it
        "MSISDN": phone, # recipient to be sent
        "Message": message, # message to be sent to user
    }

    async with httpx.AsyncClient() as client:
        resp = await client.post(
            ANOTHER,
            json=sms_data,
            headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
        )
        resp.raise_for_status()
        return resp.json()

# sends a message containing the amount deposited and the new balance to the user
# async def notify_user(phone: str, amount: Decimal, balance: Decimal):
#     message = f"Your deposit of KSH {amount} was success. New Balance: KSH {balance}."
#     result =  await send_sms(phone,message)
#     print(f"sms sent: {result}")

async def main():
    # await notify_user("25471556479", Decimal("1000.00"),Decimal("5000.000"))
    await stk(Decimal("10000"),"254715576479",4)

if __name__ == "__main__":
    asyncio.run(main())