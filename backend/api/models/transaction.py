from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

Base = declarative_base()

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=True)
    transaction_type = Column(String(50), nullable=False)  # 'purchase', 'claim', 'deposit', 'withdraw', 'referral'
    amount = Column(Float, nullable=False)
    status = Column(String(50), default='pending')  # 'pending', 'completed', 'failed', 'cancelled'
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="transactions")
    package = relationship("Package", backref="transactions")
    
    def __repr__(self):
        return f"<Transaction(type={self.transaction_type}, amount={self.amount}, status={self.status})>"
