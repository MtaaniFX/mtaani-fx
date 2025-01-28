import httpx
import base64
from base64 import b64encode
import os
from dotenv import load_dotenv
from datetime import datetime
from fastapi import APIRouter, Request

router = APIRouter()

load_dotenv()



# SMS_URL = os.getenv("DARAJA_SMS")
PASSKEY = os.getenv("PASSKEY")
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
OAUTH_URL=os.getenv("OAUTH_URL")
SHORTCODE = os.getenv("SHORT_CODE")  # Till or Paybill number


# once payment is done, you will get a json object here with the values
@router.post("/stk/callback")
def handle_stk_callback(request: Request):
    data =  request.json()

    # this data needs to be stored to database
    print("hers is stk/callback data\n\n\n\n\n\n", data)

# retrieves an OAuth token from Safaricom's Sandbox API
# it encodes the CONSUMER_KEY and CONSUMER_SECRET in base64 to authenticate the API request
async def get_bearer_token() -> str:
    authentication_string = f"{CONSUMER_KEY}:{CONSUMER_SECRET}".encode("utf-8")
    encoded_auth = base64.b64encode(authentication_string).decode("utf-8")

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

    print("request",request)

    data = await request.json()

    # this data comes from frontend, enter user and amount
    amount = data.get("amount")
    phone_number = data.get("phone_number")
    token = await get_bearer_token()

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    STK_RESULT_CALLBACK = os.getenv("STK_RESULT_CALLBACK")
    print("\n\n\n\n",STK_RESULT_CALLBACK,token)
    SHORT_CODE = os.getenv("SHORT_CODE")

    payload = {
        "BusinessShortCode": SHORT_CODE,
        "Password": stk_password(),
        "Timestamp": get_timestamp(),
        "TransactionType": "CustomerPayBillOnline",
        "Amount": str(amount),
        "PartyA": phone_number,  # Sender's phone number
        "PartyB": SHORT_CODE,  # Business shortcode
        "PhoneNumber": phone_number,
        "CallBackURL": STK_RESULT_CALLBACK,  # Ensure this is active to receive responses from the API
        "AccountReference": "test",
        "TransactionDesc": "test"
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            headers=headers,
            json=payload
        )
        # response.raise_for_status()
        print("json response>>>",response.json())
        return response.json()


# generate stk password
def stk_password():
    """Generate encrypted password using shortcode and passkey"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
    data = f"{SHORTCODE}{PASSKEY}{timestamp}"
    return base64.b64encode(data.encode()).decode()

def get_timestamp():
    return datetime.now().strftime("%Y%m%d%H%M%S")



# async def main():
#     # await notify_user("25471556479", Decimal("1000.00"),Decimal("5000.000"))
#     await stk(Decimal("1"),"254715576479")

# if __name__ == "__main__":
#     asyncio.run(main())