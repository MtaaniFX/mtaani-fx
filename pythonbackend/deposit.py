from fastapi import APIRouter, Request,HTTPException,status
from supabase_client import get_user_by_phone
from typing import Dict
router = APIRouter()

@router.post('/deposit')
async def deposit(request: Request):
    try:
        body: Dict = await request.json()
        amount = body.get("amount")
        phone_number = body.get("phone")

        # validate required fields
        if not amount or not phone_number:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="amount and phone number required",
            )

        # check if user exist in database
        exists = await get_user_by_phone(phone_number)
        if not exists:
            raise HTTPException(status_code=404,detail='user with that phone number does not exist')
        # send stk push
        #     stk()
        return {"message":"deposit request initiated"}
    except HTTPException as http_error:
        raise http_error
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="try again later"
        )