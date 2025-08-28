from fastapi import APIRouter

router = APIRouter()

@router.get("/status")
def auth_status():
    return {"success": True, "message": "Auth module placeholder"}


