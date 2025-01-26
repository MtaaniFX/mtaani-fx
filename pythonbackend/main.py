from fastapi import FastAPI
from starlette import status

from b2c import router as b2c_router
from models import UserSignup, UserLogin
from supabase_client import *
import bcrypt
from admin import router as admin_router

app = FastAPI()

# Include the B2C routes
app.include_router(b2c_router)

# Include the admin router
app.include_router(admin_router)

@app.post("/signup/")
async def signup(user: UserSignup):
    if get_user_by_email(user.email):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    user.first_name = user.first_name.strip()
    user.last_name = user.last_name.strip()
    user.id_number = user.id_number.strip()

    # Hash the password before saving
    hashed_password = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()

    response = save_user(
        user.email, hashed_password, user.first_name, user.last_name, user.phone_number, user.id_number, True
    )

    print("Signup response>>", response)

    if not response:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error check your credentials and try again"
        )

    return {"message": "User registration success"}

@app.post("/login/")
async def login(user: UserLogin):
    # Check if user exists in the database
    valid_user = get_user_by_email(user.email)

    if not valid_user:
        # Use the same error message for email and password for security purposes
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email or password")

    # Verify the password
    if not bcrypt.checkpw(user.password.encode(), valid_user["password"].encode()):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid email or password")

    return {"message": "Login successful", "user": valid_user["first_name"]}
