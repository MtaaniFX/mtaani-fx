from fastapi import FastAPI
from starlette import status
import requests
from b2c import router as b2c_router
from models import UserSignup, UserLogin
from supabase_client import *
import bcrypt
from admin import router as admin_router
from c2b import router as c2b_router
from daraja_utils import router as stk_router

app = FastAPI()

# Include the B2C routes
app.include_router(b2c_router)

# Include the admin router
app.include_router(admin_router)

# Include C2B routes
app.include_router(c2b_router)


# Include stk routes
app.include_router(stk_router)