from pydantic import BaseModel, EmailStr
from decimal import Decimal

# Client data when signing in
class UserSignup(BaseModel):
    email: EmailStr # this Pydantic type will automatically validate email, it will raise an error
    password: str
    first_name: str
    last_name: str
    id_number: str
    phone_number: str
    is_verified: bool
    # balance: str

# Client data when login in
class UserLogin(BaseModel):
    email: str
    password: str

# # Deposit model
# class DepositRequest(BaseModel):
#     user_id: str
#     amount: Decimal
#     phone_number: str