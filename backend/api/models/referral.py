from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

Base = declarative_base()

class Referral(Base):
    __tablename__ = "referrals"
    
    id = Column(Integer, primary_key=True, index=True)
    referrer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    referred_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    bonus_amount = Column(Float, default=0.0)
    is_paid = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    
    # Relationships
    referrer = relationship("User", foreign_keys=[referrer_id], backref="referrals_given")
    referred = relationship("User", foreign_keys=[referred_id], backref="referrals_received")
    
    def __repr__(self):
        return f"<Referral(referrer={self.referrer_id}, referred={self.referred_id}, bonus={self.bonus_amount})>"
