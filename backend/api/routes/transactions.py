from fastapi import APIRouter

router = APIRouter()

@router.get("")
def list_transactions():
    return {"success": True, "data": [], "message": "Transactions placeholder"}


