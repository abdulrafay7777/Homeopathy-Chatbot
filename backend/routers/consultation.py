from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage, SystemMessage
from pydantic import BaseModel, Field
from typing import List

from api_schemas import (
    CommonDiseasesResponse, 
    FollowUpQuestionsRequest, 
    FollowUpQuestionsResponse,
    ConsultationRequest,
    ChatResponse,
    ConsultationData
)
from core.config import llm
from core.prompts import CONSULTATION_SYSTEM_PROMPT
from utils.helpers import get_pkt_now, build_consultation_prompt
from utils.exceptions import handle_llm_error
from disease_questions import get_common_diseases, get_disease_label
from services.db_service import save_consultation, get_all_consultations

router = APIRouter()

@router.get("/api/consultation/diseases", response_model=CommonDiseasesResponse)
async def common_diseases():
    """Return list of common diseases for patient MCQ selection."""
    return {
        "success": True,
        "diseases": get_common_diseases(),
        "timestamp": get_pkt_now().isoformat(),
    }


class GeneratedQuestion(BaseModel):
    id: str = Field(description="Short ID for the question (e.g. 'duration', 'pain_type')")
    question: str = Field(description="The question in Roman Urdu")
    options: List[str] = Field(description="List of 3-4 possible multiple choice answers in Roman Urdu")

class GeneratedQuestionsData(BaseModel):
    questions: List[GeneratedQuestion] = Field(description="List of 3-4 follow-up questions to ask the patient about their specific condition")

@router.post("/api/consultation/follow-up-questions", response_model=FollowUpQuestionsResponse)
async def follow_up_questions(request: FollowUpQuestionsRequest):
    """Dynamically generate MCQ follow-up questions using LLM based on selected disease or symptoms."""
    symptoms = (request.symptoms or "").strip()
    disease_id = request.diseaseId
    
    if not disease_id and not symptoms:
        raise HTTPException(status_code=400, detail="diseaseId or symptoms is required")
    
    # Determine the context string for the prompt
    context_str = symptoms
    disease_label = symptoms
    
    if disease_id and disease_id != "other":
        disease_label = get_disease_label(disease_id)
        context_str = f"Disease: {disease_label}"
        if symptoms and symptoms.lower() != disease_label.lower():
             context_str += f", Symptoms: {symptoms}"
    elif not context_str:
        context_str = f"Disease ID: {disease_id}"

    if llm:
        try:
            system_prompt = f"You are a homeopathic expert. The patient has reported: '{context_str}'. Generate exactly 4 highly relevant multiple-choice follow-up questions in Roman Urdu to ask the patient for an accurate homeopathic diagnosis. Ensure each question targets a specific symptom modality, sensation, or related condition."
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content="Generate the follow-up questions based on the schema.")
            ]
            structured_llm = llm.with_structured_output(GeneratedQuestionsData)
            result = await structured_llm.ainvoke(messages)
            
            return {
                "success": True,
                "diseaseId": disease_id or "custom",
                "disease": disease_label[:50] + "..." if len(disease_label) > 50 else disease_label,
                "questions": [q.model_dump() for q in result.questions],
                "timestamp": get_pkt_now().isoformat(),
            }
        except Exception as e:
            print(f"Dynamic question generation failed: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate dynamic questions.")
    
    raise HTTPException(status_code=500, detail="LLM is not configured.")


@router.post("/api/consultation", response_model=ChatResponse)
async def consultation(request: ConsultationRequest):
    """Generate homeopathic recommendation from patient profile and symptoms."""
    if llm is None:
        raise HTTPException(
            status_code=500,
            detail="AI service configuration error. Please contact administrator.",
        )

    try:
        messages = [
            SystemMessage(content=CONSULTATION_SYSTEM_PROMPT),
            HumanMessage(content=build_consultation_prompt(request.patient)),
        ]
        
        # Use LangChain's structured output
        structured_llm = llm.with_structured_output(ConsultationData)
        result = await structured_llm.ainvoke(messages)
        
        # Save to database
        try:
            patient_dict = request.patient.model_dump()
            ai_dict = result.model_dump()
            await save_consultation(patient_dict, ai_dict)
        except Exception as db_err:
            print(f"Failed to save consultation to DB: {db_err}")
        
        return {
            "success": True,
            "data": result.model_dump(),
            "timestamp": get_pkt_now().isoformat(),
        }
    except HTTPException:
        raise
    except Exception as e:
        return handle_llm_error(e)

@router.get("/api/consultations")
async def fetch_consultations():
    """Retrieve patient consultation history from the database."""
    consultations = await get_all_consultations()
    return {
        "success": True,
        "data": consultations,
        "timestamp": get_pkt_now().isoformat()
    }
