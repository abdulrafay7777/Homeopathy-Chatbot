from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timezone, timedelta

def get_pkt_now():
    return datetime.now(timezone(timedelta(hours=5)))

from db.database import Base

class PatientDB(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    age = Column(String(20), nullable=False)
    gender = Column(String(20), nullable=False)
    marital_status = Column(String(50), nullable=False)
    created_at = Column(DateTime, default=get_pkt_now)

    # Establish one-to-many relationship with consultations
    consultations = relationship("ConsultationHistoryDB", back_populates="patient")

class ConsultationHistoryDB(Base):
    __tablename__ = "consultation_history"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    admin_person_id = Column(Integer, ForeignKey("admin_person.id"), nullable=True)
    symptoms = Column(Text, nullable=False)
    disease = Column(String(100), nullable=True)
    
    # Store JSON-like data as text or use JSON type if supported by DB
    follow_up_answers = Column(Text, nullable=True) 
    used_custom_disease = Column(Boolean, default=False)
    custom_disease_details = Column(Text, nullable=True)
    
    # AI Response details
    ai_analysis = Column(Text, nullable=True)
    ai_medicines = Column(Text, nullable=True)
    ai_advice = Column(Text, nullable=True)

    created_at = Column(DateTime, default=get_pkt_now)

    patient = relationship("PatientDB", back_populates="consultations")
