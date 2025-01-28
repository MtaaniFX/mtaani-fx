from fastapi import APIRouter, HTTPException, Request,status
from models import DepositRequest
from decimal import Decimal
from stk import stk
from dotenv import load_dotenv
import os
from supabase_client import get_user_by_id, log_transaction, update_user_balance, supabase


load_dotenv()
router = APIRouter()

MIN_AMOUNT = os.getenv("MIN_AMOUNT")
MAX_AMOUNT = os.getenv("MAX_AMOUN")

@router.post("/deposit/")
async def deposit(deposit_request: DepositRequest):

    if MAX_AMOUNT == None or MAX_AMOUNT == "":
        MAX_AMOUNT = 100000

    if MIN_AMOUNT == None or MIN_AMOUNT == "":
        MIN_AMOUNT == 10000

    amount = deposit_request.amount
    
    user_id = deposit_request.user_id

    # check if amount is in range
    if amount < Decimal(MIN_AMOUNT) or amount > Decimal(MAX_AMOUNT):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Deposit amount must be between 10,000 to 100,000")


    # check if user exists
    user = get_user_by_id(user_id)
    print("\n\n/deposit get_user_by_id",user)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    resp = await stk(amount,user["phone_number"])

    print("/deposit response from stk",resp)

    new_balance = Decimal(user["balance"]) + amount

    # log the transaction as deposit
    await log_transaction(user_id, amount,transaction_type="Deposit")


    # update user balance from the database
    await update_user_balance(user_id, new_balance)


    return {"message": "Deposit successful", "new_balance": new_balance}
