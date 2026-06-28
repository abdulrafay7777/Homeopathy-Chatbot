from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

# --- Base and Response Schemas for Database ---

class FollowUpAnswer(BaseModel):
    question: str
    answer: str

class ConsultationBase(BaseModel):
    symptoms: str = Field(..., min_length=1)
    disease: Optional[str] = ""
    followUpAnswers: Optional[List[FollowUpAnswer]] = []
    usedCustomDisease: Optional[bool] = False
    customDiseaseDetails: Optional[str] = ""

class ConsultationCreate(ConsultationBase):
    pass

class ConsultationResponse(ConsultationBase):
    id: int
    patient_id: int
    created_at: datetime
    ai_analysis: Optional[str] = None
    ai_medicines: Optional[str] = None
    ai_advice: Optional[str] = None

    class Config:
        from_attributes = True

class PatientBase(BaseModel):
    name: str = Field(..., min_length=1)
    age: str = Field(..., min_length=1)
    gender: str = Field(..., min_length=1)
    maritalStatus: str = Field(..., min_length=1)

class PatientCreate(PatientBase):
    pass

class PatientResponse(PatientBase):
    id: int
    created_at: datetime
    consultations: List[ConsultationResponse] = []

    class Config:
        from_attributes = True
