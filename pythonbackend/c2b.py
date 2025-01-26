import requests
from fastapi import APIRouter, Request
from pydantic import BaseModel

from pythonbackend.daraja_utils import CONSUMER_KEY, CONSUMER_SECRET, SHORT_CODE

router = APIRouter()

@router.post("/register-urls")
async def register_urls():
    access_token = get_access_token()
    shortcode=SHORT_CODE
    validation_endpoint = "https://mydomain.com/validation"
    confirmation_endpoint = "https://mydomain.com/confirmation"
    response = register_c2b_urls(access_token,shortcode,validation_endpoint,confirmation_endpoint)


@router.post("/validation")
async def validation_handler(request: Request):
    data = await request.json()
    print("validation done",data)
    # validate the transaction here
    return {"ResultCode": 0, "ResultDesc": "Accepted"}

@router.post("/confirmation")
async def confirmation_handler(request: Request):
    data = await request.json()
    print("transaction from /confirmation received", data)
    return {"ResultCode":0, "ResultDesc": "Success"}


# get the access token
def get_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(url, auth=(CONSUMER_KEY, CONSUMER_SECRET))
    return response.json().get("access_token")

def register_c2b_urls(access_token, shortcode, validation_url, confirmation_url):
    url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"
    headers = {"Authorization": f"Bearer {access_token}"}
    payload = {
        "ShortCode": shortcode,
        "ResponseType": "Completed",
        "ConfirmationURL": confirmation_url,
        "ValidationURL": validation_url,
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()
