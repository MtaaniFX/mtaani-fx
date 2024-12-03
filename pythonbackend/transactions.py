# for deposit and callback routes

from fastapi import APIRouter, HTTPException, Request,status
from models import DepositRequest
from decimal import Decimal
from daraja_utils import stk
from supabase_client import get_user_by_id, log_transaction, update_user_balance, supabase
from utils.logger import log_transaction_to_file
router = APIRouter()

@router.post("/deposit/")
async def deposit(deposit_request: DepositRequest):

    amount = deposit_request.amount
    
    user_id = deposit_request.user_id

    # check if amount is in range
    if amount < Decimal('10000') or amount > Decimal('100000'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Deposit amount must be between 10,000 to 100,000")


    # check if user exists
    user = get_user_by_id(user_id)
    print("DEPOSIT>>>>",user)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    resp = stk(amount,user["phone_number"],user_id)


    log_file = "transactions.txt"
    log_transaction_to_file(resp,log_file)
    

    print(f"***********{resp}******************")
    # update balance
    new_balance = Decimal(user["balance"]) + amount

    # log the transaction
    await log_transaction(user_id, amount,transaction_type="Deposit")

    # TODO (1)
    # update user balance
    await update_user_balance(user_id, new_balance)

    # TODO (2)
    # send notification to phone
    # send notification to database

    return {"message": "Deposit successful", "new_balance": new_balance}


@router.post("/callback")
async def handle_callback(request: Request):
    body = await request.json()
    print("Body>>",body)
    callback_data = body["Body"]["stkCallback"]

    receipt_number = callback_data["CallbackMetadata"]["Item"][1]["Value"]
    phone_number = callback_data["CallbackMetadata"]["Item"][3]["Value"]


    # TODO
    # status indicating what happened example:
    # Request was cancelled by user
    # Successful
    status = callback_data["ResultDesc"]

    status_code = callback_data["ResultCode"]
    if int(status_code) != 0:
        print(status,status_code,receipt_number,phone_number)
        return {"message": "Transaction Failed"}

    # update the transaction based on the number
    response = supabase.table("transactions_mtaani").update({
        "status":"Completed",
        "mpesa_receipt_number": receipt_number,
    }).eq("phone_number", phone_number).eq("status", "Pending").execute()


    print("callback>>",response)
    if response.get("error"):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update transaction")
    

    return {"message": "Transaction completed"}
