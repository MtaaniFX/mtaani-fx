from fastapi import APIRouter
from supabase_client import supabase

router = APIRouter()

# This endpoint will fetch all the payments from the database,
# which can then be displayed in the admin section of your frontend.
@router.get("/payments")
async def get_payments():
    response = supabase.table("payments").select("*").execute()
    return response.data
