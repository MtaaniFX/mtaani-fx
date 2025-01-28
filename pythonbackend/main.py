from fastapi import FastAPI
from b2c import router as b2c_router
from supabase_client import *
from admin import router as admin_router
from c2b import router as c2b_router
from stk import router as stk_router
from check_ip import check_ip_middleware

app = FastAPI()

# add the middleware to the app
app.middleware('http')(check_ip_middleware)

# Include the B2C routes
app.include_router(b2c_router)

# Include the admin router
app.include_router(admin_router)

# Include C2B routes
app.include_router(c2b_router)

# Include stk routes
app.include_router(stk_router)