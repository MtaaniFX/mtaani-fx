import requests
from fastapi import APIRouter, Request
from pydantic import BaseModel
from dotenv import load_dotenv
import os

load_dotenv()

SHORT_CODE = os.getenv("SHORT_CODE")
CONSUMER_KEY = os.getenv("CONSUMER_KEY")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET")
# this is where saf will send data after a successful transaction
C2B_CONFIRMATION = os.getenv("C2B_CONFIRMATION")
# this is where saf will send validation data before completing request
C2B_VALIDATION = os.getenv("C2B_VALIDATION")
C2B_REGISTER_URL = os.getenv("C2B_REGISTER_URL")

router = APIRouter()

# this is a one time request to register the urls
# once its registered dont call this function again, if in production
# if its a sandbox you can play with it
@router.get('/c2b/register')
def register_url():
    access_token = get_access_token()
    shortcode=SHORT_CODE
    validation_endpoint = C2B_VALIDATION

    confirmation_endpoint = C2B_CONFIRMATION

    response_json = register_c2b_urls(access_token,shortcode,validation_endpoint,confirmation_endpoint)
    

    print("\n\nresponsejson\n\n", response_json)
    #this is ResponseCode, 0 for success
    code = response_json.get("ResponseCode")

    # this is originator id, its unique
    # originator = response_json.get("OriginatorConversationID")

    # this is the status of request: success or failed
    # status = response_json.get("ResponseDescription")

    if int(code) == 0:
        print("registration success")
    return response_json

@router.post("/c2b/validation")
async def validation_handler(request: Request):
    data = await request.json()
    print("validation done",data)
    # validate the transaction here
    return {"ResultCode": 0, "ResultDesc": "Accepted"}


@router.post("/c2b/confirmation")
async def confirmation_handler(request: Request):
    data = await request.json()

    print("data got from c2b/confirmation",data)

    transaction_type = data.get("Pay Bill")
    transaction_id = data.get("TransID")
    transaction_time = data.get("TransTime")
    transaction_amount = data.get("TransAmount")

    short_code = data.get("BusinessShortCode")
    
    # this is the account number making payment
    account_number = data.get("BillRefNumber")
    
    # invoiceNumber is ignored

    # ThirdPartyTransID is what we get after validation has occurred, but am ignoring it

    # this is masked number of the user making the payment
    # masked means some digits have been hidden
    masked_number = data.get("MSISDN")

    first_name = data.get("FirstName")

    # middle name might be empty since most people have 2 names
    middle_name = data.get("MiddleName")

    last_name = data.get("LastName")

    # save this data to payment table in the database


    print("transaction from /confirmation received", data)

    # return this to safaricom
    return {"ResultCode":0, "ResultDesc": "Success"}

"""
c2b requires registering validation(optional) and confirmation url in order to send
payment information during a transaction.
you only need to register once, so find a way to call this function only once.

I made an endpoint that will be protected, only admin is allowed to send a get request to it
so that he can register the url. 
In production, this function needs only to be called once. we might remove it or make a script to 
run it separately. but for now send a get request to /register-urls
"""
def register_c2b_urls(access_token, shortcode, validation_url, confirmation_url):
    url = C2B_REGISTER_URL
    headers = {"Authorization": f"Bearer {access_token}"}
    payload = {
        "ShortCode": shortcode,
        "ResponseType": "Completed", # if mpesa cannot find our endpoint, cancel the request
        "ConfirmationURL": confirmation_url,
        "ValidationURL": validation_url,
    }
    response = requests.post(url, json=payload, headers=headers)
    return response.json()

# get the access token
def get_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    response = requests.get(url, auth=(CONSUMER_KEY, CONSUMER_SECRET))
    return response.json().get("access_token")
