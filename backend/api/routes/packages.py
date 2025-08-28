from fastapi import APIRouter

router = APIRouter()

@router.get("")
def list_packages():
    return {"success": True, "data": [], "message": "Packages placeholder"}


