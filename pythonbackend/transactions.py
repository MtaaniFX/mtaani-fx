from fastapi import APIRouter, HTTPException, Request,status
from pydantic import BaseModel
from decimal import Decimal
from daraja_utils import stk
from pythonbackend.supabase_client import get_user_by_phone
from supabase_client import log_transaction, update_user_balance, supabase
router = APIRouter()


class DepositRequest(BaseModel):
    user_id: str
    amount: Decimal
    phone_number: str

@router.post("/deposit")
async def deposit(deposit_request: DepositRequest):
    print("hit")

    amount = deposit_request.amount
    if amount <= 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Deposit amount must be between 10,000 to 100,000")

    user_id = deposit_request.user_id

    if amount < Decimal('10000') or amount > Decimal('100000'):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Deposit amount must be between 10,000 to 100,000")

    user_data = get_user_by_phone(deposit_request.phone_number)

    if not user_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    resp = await stk(amount,user_data["phone_number"])

    print("resp from stk",resp)
    new_balance = Decimal(user_data["balance"]) + amount

    # log the transaction as deposit
    await log_transaction(user_id, amount,transaction_type="Deposit")

    # update user balance from the database
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
    Status = callback_data["ResultDesc"]

    status_code = callback_data["ResultCode"]
    if int(status_code) != 0:
        print(Status,status_code,receipt_number,phone_number)
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
