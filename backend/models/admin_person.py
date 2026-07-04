from sqlalchemy import Column, Integer, String, DateTime
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
    role = Column(String(50), nullable=False, default="student")
    plan = Column(String(50), nullable=False, default="basic")
    created_at = Column(DateTime, default=get_pkt_now)
