from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List, Literal, Dict, Any

from bot.utils.db import get_db
from api.models.user import User

router = APIRouter()


def serialize_user(user: User) -> Dict[str, Any]:
    return {
        "id": user.id,
        "telegram_id": user.telegram_id,
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "balance": user.balance,
        "total_profit": user.total_profit,
        "referral_code": user.referral_code,
        "referred_by": user.referred_by,
        "referral_bonus": user.referral_bonus,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }


@router.get("")
def list_users(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    status: Optional[Literal["active", "inactive"]] = Query(None),
    min_balance: Optional[float] = Query(None),
    max_balance: Optional[float] = Query(None),
    sort_by: Optional[str] = Query(None),
    sort_order: Optional[Literal["asc", "desc"]] = Query("desc"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    query = db.query(User)

    if search:
        like = f"%{search}%"
        query = query.filter(
            (User.username.ilike(like))
            | (User.first_name.ilike(like))
            | (User.last_name.ilike(like))
            | (User.referral_code.ilike(like))
        )

    if status == "active":
        query = query.filter(User.is_active.is_(True))
    elif status == "inactive":
        query = query.filter(User.is_active.is_(False))

    if min_balance is not None:
        query = query.filter(User.balance >= min_balance)
    if max_balance is not None:
        query = query.filter(User.balance <= max_balance)

    if sort_by in {"username", "first_name", "last_name", "balance", "total_profit", "created_at"}:
        sort_column = getattr(User, sort_by)
        if sort_order == "desc":
            sort_column = sort_column.desc()
        query = query.order_by(sort_column)
    else:
        query = query.order_by(User.created_at.desc())

    total = query.count()
    items = query.offset((page - 1) * limit).limit(limit).all()

    return {
        "success": True,
        "data": [serialize_user(u) for u in items],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit,
        },
        "message": "Users retrieved successfully",
    }


@router.get("/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail={"success": False, "message": "User not found"})
    return {"success": True, "data": serialize_user(user), "message": "User retrieved successfully"}


@router.post("")
def create_user(payload: Dict[str, Any], db: Session = Depends(get_db)):
    required = ["telegram_id", "referral_code"]
    for field in required:
        if field not in payload:
            raise HTTPException(status_code=400, detail={"success": False, "message": f"Missing field: {field}"})

    if db.query(User).filter(User.telegram_id == payload["telegram_id"]).first():
        raise HTTPException(status_code=409, detail={"success": False, "message": "telegram_id already exists"})
    if db.query(User).filter(User.referral_code == payload["referral_code"]).first():
        raise HTTPException(status_code=409, detail={"success": False, "message": "referral_code already exists"})

    user = User(
        telegram_id=payload["telegram_id"],
        username=payload.get("username"),
        first_name=payload.get("first_name"),
        last_name=payload.get("last_name"),
        balance=payload.get("balance", 0.0),
        total_profit=payload.get("total_profit", 0.0),
        referral_code=payload["referral_code"],
        referred_by=payload.get("referred_by"),
        referral_bonus=payload.get("referral_bonus", 0.0),
        is_active=payload.get("is_active", True),
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {"success": True, "data": serialize_user(user), "message": "User created successfully"}


@router.put("/{user_id}")
def update_user(user_id: int, payload: Dict[str, Any], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail={"success": False, "message": "User not found"})

    updatable_fields = [
        "username",
        "first_name",
        "last_name",
        "balance",
        "total_profit",
        "referral_code",
        "referred_by",
        "referral_bonus",
        "is_active",
    ]

    for field in updatable_fields:
        if field in payload:
            setattr(user, field, payload[field])

    db.commit()
    db.refresh(user)

    return {"success": True, "data": serialize_user(user), "message": "User updated successfully"}


@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail={"success": False, "message": "User not found"})

    db.delete(user)
    db.commit()

    return {"success": True, "data": None, "message": "User deleted successfully"}


@router.get("/stats")
def user_stats(db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active.is_(True)).count()
    inactive_users = db.query(User).filter(User.is_active.is_(False)).count()
    total_balance = float(db.query(User).with_entities((User.balance)).all() and sum(u.balance or 0 for u in db.query(User).all()) or 0.0)

    return {
        "success": True,
        "data": {
            "total_users": total_users,
            "active_users": active_users,
            "inactive_users": inactive_users,
            "total_balance": total_balance,
        },
        "message": "User statistics retrieved successfully",
    }


