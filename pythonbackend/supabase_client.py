from datetime import timedelta

import os
from dotenv import load_dotenv
from supabase import create_client, Client
from decimal import Decimal
from fastapi.exceptions import HTTPException
import re



# this function loads environment variables from a .env file into your environment
# making them accessible via os.getenv
load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
ACCESS_TOKEN = os.getenv("DARAJA_TOKEN")



# create a client instance, this will be used to interact with database
supabase: Client = create_client(SUPABASE_URL,SUPABASE_KEY)

def save_user(email: str, hashed_password: str, first_name: str, last_name: str,phone_number: str,id_number: str,is_verified: bool):
    response = supabase.table('mtaani_users').insert({
        'email': email,
        'password':hashed_password,
        'first_name':first_name,
        'last_name':last_name,
        'phone_number':phone_number,
        'id_number':id_number,
        'is_verified':is_verified,
    }).execute()
    return response


# fetch user detail using email
def get_user_by_email(email: str):
    resp = supabase.table('mtaani_users').select('*').eq('email',email).execute()
    print(">>>",resp)
    return resp.data[0] if resp.data else None


# two types of transaction status: completed and pending
def update_transaction(phone_number: str, receipt_number: str):
    try:
        # perform the update query
        response = supabase.table('transactions').update({
            "status": "Completed",
            "mpesa_receipt_number": receipt_number,
        }).eq("phone_number", phone_number).eq("status", "Pending").execute()

        print(response)
        if hasattr(response, "error"):
            print("Error updating transaction:",response.error)
        else:
            print("transaction updated successfully:",response.data)


    except Exception as e:
        print(f"an error occurred: {e}")
    

def get_user_by_id(user_id: int):
    """Fetch users from mtaani_users table by user_id."""
    response = supabase.table("mtaani_users").select("*").eq("id", user_id).single().execute()
    
    print("***********************",response)

    if response.data is None:
        raise HTTPException(status_code=500, detail="Error fetching user")

    return response.data




async def update_user_balance(user_id: int, new_balance: Decimal):
    """update the user's balance"""
    response = supabase.table("mtaani_users").update({"balance": str(new_balance)}).eq("id",user_id).execute()
    print(response)
    if not response:
        raise HTTPException(status_code=500, detail="Failed to update user balance")

# validate phone number
def validate_phone_number(number:str):
    valid = r"^(?:\+254|254|0)?7\d{8}$"
    return bool(re.match(valid, number))


async def log_transaction(user_id: int, amount: Decimal, transaction_type: str ,status: str = "Pending"):
    """Log the deposit as a new transaction"""
    transaction_data = {
        "user_id": user_id,
        "amount": str(amount),
        "status":status,
        "transaction_type":transaction_type,
    }

    response = supabase.table("transactions_mtaani").insert(transaction_data).execute()
    print("*******************>>>",response)
    if not response:
        raise HTTPException(status_code=500, detail="Failed to log transaction")
    