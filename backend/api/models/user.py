from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.sql import func
from bot.utils.db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String(255), nullable=True)
    first_name = Column(String(255), nullable=True)
    last_name = Column(String(255), nullable=True)
    balance = Column(Float, default=0.0)
    total_profit = Column(Float, default=0.0)
    referral_code = Column(String(10), unique=True, nullable=False)
    referred_by = Column(String(10), nullable=True)
    referral_bonus = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def __repr__(self):
        return f"<User(telegram_id={self.telegram_id}, username={self.username}, balance={self.balance})>"
