##### contains daraja implementation

### STK PUSH API
Used for initiating a payment request to a customer(mtaani user) via their phone.

### C2B Register URL API
Used to register the callbacks URL to receive payment notifications for a Pay bill or Till.

### Implementing C2B Register URL API in python with FastAPI
REQUIREMENTS
1. ACCESS TOKEN: - you need access token from daraja API. Using OAuth API to generate this token.
2. PUBLICLY ACCESSIBLE URL: tools like ngrok during development to expose your local server to the web/internet.

GENERATING ACCESS TOKEN

```python
import requests
from fastapi import FastAPI

app = FastAPI()

CONSUMER_KEY = "your_consumer_key"
CONSUMER_SECRET = "your_consumer_secret"

def generate_access_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate"
    auth = (CONSUMER_KEY, CONSUMER_SECRET)
    headers = {"Content-Type": "application/json"}
    params = {"grant_type": "client_credentials"}

    response = requests.get(url, auth=auth, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        raise Exception(f"Error generating access token: {response.text}")
```

REGISTER URL

```python
@app.post("/register-urls")
def register_urls():
    # call the generate access token here
    access_token = generate_access_token()
    url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    payload = {
        "ShortCode": "601426",  # Replace with your ShortCode for your paybill
        "ResponseType": "Completed",  # or "Cancelled"
        "ConfirmationURL": "https://your-public-url/confirmation", # use ngrok
        "ValidationURL": "https://your-public-url/validation" # use ngrok or local tunel
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()
```


### STEP 3: HANDLE VALIDATION AND CONFIRMATION
You will need two endpoints to handle validation and confirmation callbacks
```python
@app.post("/validation")
async def validation_callback(request: dict):
    # here you process the validation request
    # here is an example of a positive response
    return {
        "ResultCode":0,
        "ResultDesc":"Accepted"
    }

@app.post("/confirmation")
async def confirmation_callback(request: dict):
    print("payment received") # return this to frontend
    return {
        "ResultCode":0,
        "ResultDesc":"Success"
    }
```

### HOW TO SEND MONEY TO A PAYBILL C2B API
Since customers manually send money to paybill, the C2B api enables you to receive real-time notifications
about the payments

STEPS
1. Generate an access token: you will need access token to authenticate your requests.
   - need `ConsumerKey` and `ConsumerSecret`

2. Register Your URLs, use the register url api to set up the validation URL and confirmation url
   - validation url lets you validate payments before confirmation (optional)
   - confirmation url to receive payment details after successful transactions

3. Customer sends payment: Customer sends money to paybill using (MPESA APP, USSD or app).

4. Mpesa sends callbacks
    - Validation Request - sent to your `VALIDATIONURL` (if validation is enabled)
    - Confirmation Request - sent to your `CONFIRMATIONURL` with the transaction details
