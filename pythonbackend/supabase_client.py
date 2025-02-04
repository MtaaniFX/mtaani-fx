import asyncio
import os
from dotenv import load_dotenv
from fastapi import APIRouter,status,HTTPException
from postgrest import APIError
from pydantic import BaseModel
from supabase import create_client, Client
from decimal import Decimal
import re

load_dotenv()
router = APIRouter()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
ACCESS_TOKEN = os.getenv("DARAJA_TOKEN")
supabase: Client = create_client(SUPABASE_URL,SUPABASE_KEY)

class UpdateAccountTypeRequest(BaseModel):
    user_id: str #uuid of user
    account_type: str # new account type (normal,locked,group)

# user updates his account here
@router.post('/update-account-type')
async def update_account_type(request: UpdateAccountTypeRequest):
    # validate the account type
    if request.account_type not in ["normal", "locked", "group"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="invalid account type: allowed (normal,locked,group)"
        )

    # update account type
    try:
        response = supabase.table('clients').update(
            {"account_type": request.account_type}
        ).eq("id", request.user_id).excute()

        # check if update was a success
        if not response.data:
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="user not found"
            )
        return {"message":"account type updated successfully", "data":response.data.get("account_type")}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="an error occurred try again later"
        )


def save_user(email: str, hashed_password: str, first_name: str, last_name: str,phone_number: str,id_number: str,):
    response = supabase.table('clients').insert({
        'email': email,
        'password':hashed_password,
        'full_name':first_name+last_name,
        'phone_number':phone_number,
        'id_number':id_number,
        'current_balance':Decimal(0),
    }).execute()
    return response


# fetch user detail using email
async def get_user_by_email(email: str):
    try:
        response = supabase.table('clients').select('*').eq('email',email).single().execute()
        print(response)
        if response.data.get('email') == email:
            print("emails match")
        else:
            print("something happened")
    except APIError as e:
        print(e.message)


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


# check if user with that phone number exists
async def get_user_by_phone(phone_number: str):
    # a dictionary will be returned containing details of user
    try:
        response = supabase.table('clients').select("*").eq("phone_number",phone_number).single().execute()
        print(type(response.data))
        if phone_number == response.data.get('phone_number'):
            print("numbers match")
            return True
    except APIError as e:
        if e.details.__contains__('The result contains 0 rows'):
            print("no such user")
            print(e)
            return False
        else:
            print("the user with that number does not exist")
            return False


async def get_current_balance(phone_number: str):
    try:
        response = supabase.table('clients').select('current_balance').eq("phone_number",phone_number).single().execute()
        print(response.data)
        current_balance = response.data.get("current_balance")
        print(current_balance)
        return str(current_balance)
    except APIError as e:
        print(e.message)


async def update_user_balance(phone_number, amount: Decimal):
    try:
        current_balance = await get_current_balance(phone_number)
        new_balance = Decimal(amount)+Decimal(current_balance)
        response = supabase.table("clients").update({"current_balance": str(new_balance)}).eq("phone_number",phone_number).execute()
        print(response)
    except APIError as e:
        print("failed to update balance")

# validate phone number
async def validate_phone_number(number:str):
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
    print("**************",response)
    if not response:
        raise HTTPException(status_code=500, detail="Failed to log transaction")



# # deduct user amount associated with a certain phone number
# async def deduct_amount()



async def main():
    await get_user_by_phone('254715576479')
    print("****************\n\n")
    await update_user_balance('254715576479',Decimal(10))
    # print(">>>>>>>")
    # await get_current_balance('254715576479')
    await get_user_by_email('rayjaymuiruri@gmail.com')

if __name__ == "__main__":
    asyncio.run(main())