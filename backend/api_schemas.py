from pydantic import BaseModel, Field
from typing import List, Optional

class Message(BaseModel):
    role: str = Field(..., description="Role of the message sender (user or assistant)")
    content: str = Field(..., description="Content of the message")

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User's message")
    conversationHistory: Optional[List[Message]] = Field(default=[], description="Previous conversation messages")

class ChatResponse(BaseModel):
    success: bool
    response: Optional[str] = None
    data: Optional[dict] = None
    timestamp: str

class HealthResponse(BaseModel):
    status: str
    message: str
    timestamp: str

class FollowUpAnswer(BaseModel):
    question: str
    answer: str

class PatientProfile(BaseModel):
    name: Optional[str] = Field(default="")
    age: str = Field(..., min_length=1)
    gender: str = Field(..., min_length=1)
    maritalStatus: str = Field(..., min_length=1)
    symptoms: str = Field(..., min_length=1)
    disease: Optional[str] = ""
    followUpAnswers: Optional[List[FollowUpAnswer]] = []
    usedCustomDisease: Optional[bool] = False
    customDiseaseDetails: Optional[str] = ""

class MedicineRecommendation(BaseModel):
    name: str = Field(description="Name of the homeopathic medicine (e.g., 'Belladonna')")
    match_percentage: int = Field(description="Percentage score (e.g. 85) indicating how preferable this medicine is for the specific disease")
    dosage: str = Field(description="Recommended potency and dosage amount (e.g., '200C - 3 drops or 4 pills')")
    how_to_take: str = Field(description="Detailed instructions on how to take the medicine (e.g., 'Take with 1 spoon of water, 4 hours apart, empty stomach')")
    description: str = Field(description="Indications and brief reasoning (e.g., 'Violent throbbing headache...')")
    tags: List[str] = Field(description="List of 2-3 tags (e.g., ['Grade 3 - First choice', 'Acute', 'Vascular'])")

class ConsultationData(BaseModel):
    analysis: str = Field(description="Marez ko naam se address karen aur symptoms ka mukhtasar tajziya in Roman Urdu.")
    medicines: List[MedicineRecommendation] = Field(description="List of at least 4 recommended homeopathic remedies.")
    recommended_tests: Optional[List[str]] = Field(default=[], description="List of recommended medical or lab tests if applicable (in Roman Urdu/English). Leave empty if none required.")

class FollowUpQuestionsRequest(BaseModel):
    symptoms: Optional[str] = ""
    diseaseId: Optional[str] = None

class CommonDisease(BaseModel):
    id: str
    label: str

class CommonDiseasesResponse(BaseModel):
    success: bool
    diseases: List[CommonDisease]
    timestamp: str

class FollowUpQuestion(BaseModel):
    id: str
    question: str
    options: List[str]

class FollowUpQuestionsResponse(BaseModel):
    success: bool
    diseaseId: str
    disease: str
    questions: List[FollowUpQuestion]
    timestamp: str

class ConsultationRequest(BaseModel):
    patient: PatientProfile

class GeneratedQuestion(BaseModel):
    id: str = Field(description="Short ID for the question (e.g. 'duration', 'pain_type')")
    question: str = Field(description="The question in Roman Urdu")
    options: List[str] = Field(description="List of 3-4 possible multiple choice answers in Roman Urdu")

class GeneratedQuestionsData(BaseModel):
    questions: List[GeneratedQuestion] = Field(description="List of 3-4 follow-up questions to ask the patient about their specific condition")
