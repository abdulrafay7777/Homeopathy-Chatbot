from sqlalchemy import Column, Integer, String, DateTime, Date, Boolean
from datetime import datetime, timezone, timedelta
from db.database import Base

def get_pkt_now():
    return datetime.now(timezone(timedelta(hours=5)))

class AdminPersonDB(Base):
    __tablename__ = "admin_person"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="patient")
    subscription_start_date = Column(Date, nullable=True)
    subscription_end_date = Column(Date, nullable=True)
    profile_image = Column(String(255), nullable=True)
    is_active = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=get_pkt_now)
