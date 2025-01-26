import requests
import base64
import uuid
from datetime import datetime
import json
from fastapi import Request

CONSUMER_KEY = 'your_consumer_key'
CONSUMER_SECRET = 'your_consumer_secret'
SHORTCODE = 'your_b2c_shortcode'
INITIATOR_NAME = 'your_initiator_name'
SECURITY_CREDENTIAL = 'your_encrypted_security_credential'
B2C_URL = 'https://sandbox.safaricom.co.ke/mpesa/b2c/v3/paymentrequest'
OAUTH_URL = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials'


def get_access_token():
    """Generate OAuth access token"""
    try:
        credentials = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"
        encoded_credentials = base64.b64encode(credentials.encode()).decode()

        headers = {'Authorization': f'Basic {encoded_credentials}'}

        response = requests.get(OAUTH_URL, headers=headers, timeout=30)
        response.raise_for_status()
        return response.json()['access_token']
    except Exception as e:
        print(f"Access token error: {str(e)}")
        return None


def initiate_b2c_transaction(phone_number, amount, remarks, occasion):
    """Initiate B2C payment transaction"""
    access_token = get_access_token()
    if not access_token:
        return None

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    payload = {
        "OriginatorConversationID": str(uuid.uuid4()),
        "InitiatorName": INITIATOR_NAME,
        "SecurityCredential": SECURITY_CREDENTIAL,
        "CommandID": "BusinessPayment",
        "Amount": str(amount),
        "PartyA": SHORTCODE,
        "PartyB": phone_number,
        "Remarks": remarks,
        "QueueTimeOutURL": "https://yourdomain.com/b2c/queue",
        "ResultURL": "https://yourdomain.com/b2c/result",
        "Occassion": occasion
    }

    try:
        response = requests.post(B2C_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        print(response)
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Transaction failed: {str(e)}")
        return None


def handle_b2c_callback(request_data: Request):
    """Process B2C transaction results callback"""
    try:
        result = request_data.get('Result', {})
        result_code = result.get('ResultCode')
        conversation_id = result.get('ConversationID')
        originator_conversation_id = result.get('OriginatorConversationID')
        transaction_id = result.get('TransactionID')

        if result_code == 0:
            print("Payment Successful:")
            print(f"Transaction ID: {transaction_id}")
            print(f"Conversation ID: {conversation_id}")

            parameters = result.get('ResultParameters', {}).get('ResultParameter', [])
            for param in parameters:
                if param['Key'] == 'TransactionAmount':
                    amount = param['Value']
                    print(f"amount {amount}")
                elif param['Key'] == 'TransactionReceipt':
                    receipt = param['Value']
                    print(f"receipt {receipt}")
                elif param['Key'] == 'ReceiverPartyPublicName':
                    receiver = param['Value']
                    print(f"receiver {receiver}")
            return True
        else:
            error_desc = result.get('ResultDesc')
            print(f"Payment Failed [{result_code}]: {error_desc}")
            return False

    except Exception as e:
        print(f"Callback processing error: {str(e)}")
        return False


# if _name_ == "_main_":
#     # Example transaction
#     response = initiate_b2c_transaction(
#         phone_number="254712345678",
#         amount=1500,
#         remarks="Salary payment",
#         occasion="Monthly Salary"
#     )
#
#     if response:
#         if response.get('ResponseCode') == '0':
#             print("Request Accepted Successfully")
#             print(f"OriginatorConversationID: {response.get('OriginatorConversationID')}")
#             print(f"ConversationID: {response.get('ConversationID')}")
#         else:
#             print("Request Failed:")
#             print(json.dumps(response, indent=2))
#     else:
#         print("Failed to initiate transaction")


# @.route('/b2c/result', methods=['POST'])
# def b2c_callback():
#     try:
#         data = request.get_json()
#         success = handle_b2c_callback(data)
#         return jsonify({"status": "success" if success else "failed"}), 200
#     except Exception as e:
#         print(f"Callback error: {str(e)}")
#         return jsonify({"status": "error"}), 500
