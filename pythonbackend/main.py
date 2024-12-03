from fastapi import APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

router = APIRouter()

# allow requests from frontend
router.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import APIRouter, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import bcrypt
# from decimal import Decimal
from supabase_client import *
# from daraja_utils import stk
# from requests import Request
from models import UserSignup, UserLogin

router = APIRouter()

@router.post("/signup/")
async def signup(user: UserSignup):
    if get_user_by_email(user.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="email already exists")
    

    user.first_name = user.first_name.strip()
    user.last_name = user.last_name.strip()
    user.id_number = user.id_number.strip()

    # hash the password before saving
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()

    response = save_user(user.email, hashed_password,
                         user.first_name,
                         user.last_name,
                         user.phone_number,
                         user.id_number,
                         True )
        
    print("signup response>>",response)

    if not response:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="error check your credentials and try again")

    return {"message", "User registration success"}

@router.post("/login/")
async def login(user: UserLogin):

    # when user signs up, get his email
    valid_user = get_user_by_email(user.email)

    # check if user is in the database
    if not valid_user:
        # use the same error message for email and password for security purposes
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email or password")

    # check password
    if not bcrypt.checkpw(user.password.encode(), valid_user['password'].encode()):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email or password")

    return {"message": "Login successful", "user":valid_user['first_name']}

