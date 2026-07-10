import json
import asyncio
from datetime import datetime
from db.database import SessionLocal
from models.patient import PatientDB, ConsultationHistoryDB

def _save_consultation_sync(patient_data: dict, ai_response: dict, user_id: int = None):
    db = SessionLocal()
    try:
        # Create Patient
        patient = PatientDB(
            name=patient_data.get("name", "Unknown"),
            age=patient_data.get("age", ""),
            gender=patient_data.get("gender", ""),
            marital_status=patient_data.get("maritalStatus", "")
        )
        db.add(patient)
        db.commit()
        db.refresh(patient)

        # Serialize follow up answers
        follow_ups = patient_data.get("followUpAnswers", [])
        follow_ups_json = json.dumps([f if isinstance(f, dict) else dict(f) for f in follow_ups]) if follow_ups else "[]"
        
        # Serialize AI medicines
        ai_medicines = json.dumps(ai_response.get("medicines", []))

        consultation = ConsultationHistoryDB(
            patient_id=patient.id,
            symptoms=patient_data.get("symptoms", ""),
            disease=patient_data.get("disease", ""),
            follow_up_answers=follow_ups_json,
            used_custom_disease=patient_data.get("usedCustomDisease", False),
            custom_disease_details=patient_data.get("customDiseaseDetails", ""),
            ai_analysis=ai_response.get("analysis", ""),
            ai_medicines=ai_medicines,
            ai_advice=ai_response.get("advice", ""),
            admin_person_id=user_id
        )
        db.add(consultation)
        db.commit()
        return str(consultation.id)
    except Exception as e:
        db.rollback()
        print(f"Error saving consultation: {e}")
        return None
    finally:
        db.close()

async def save_consultation(patient_data: dict, ai_response: dict, user_id: int = None):
    return await asyncio.to_thread(_save_consultation_sync, patient_data, ai_response, user_id)

def _get_all_consultations_sync(user_id: int = None, role: str = None):
    db = SessionLocal()
    try:
        query = db.query(ConsultationHistoryDB)
        if role != 'admin' and user_id is not None:
            query = query.filter(ConsultationHistoryDB.admin_person_id == user_id)
        
        consultations = query.order_by(ConsultationHistoryDB.created_at.desc()).limit(100).all()
        result = []
        for c in consultations:
            patient = db.query(PatientDB).filter(PatientDB.id == c.patient_id).first()
            medicines = []
            if c.ai_medicines:
                try:
                    medicines = json.loads(c.ai_medicines)
                except:
                    pass
            
            result.append({
                "_id": str(c.id),
                "created_at": c.created_at.isoformat() if c.created_at else None,
                "patient": {
                    "name": patient.name if patient else "Unknown",
                    "age": patient.age if patient else "",
                    "gender": patient.gender if patient else "",
                    "symptoms": c.symptoms,
                    "disease": c.disease
                },
                "recommendation": {
                    "analysis": c.ai_analysis,
                    "medicines": medicines,
                    "advice": c.ai_advice
                }
            })
        return result
    except Exception as e:
        print(f"Error fetching consultations: {e}")
        return []
    finally:
        db.close()

async def get_all_consultations(user_id: int = None, role: str = None):
    return await asyncio.to_thread(_get_all_consultations_sync, user_id, role)

def _get_daily_consultation_count_sync(user_id: int) -> int:
    db = SessionLocal()
    try:
        from datetime import date
        from sqlalchemy import cast, Date
        today = date.today()
        count = db.query(ConsultationHistoryDB).filter(
            ConsultationHistoryDB.admin_person_id == user_id,
            cast(ConsultationHistoryDB.created_at, Date) == today
        ).count()
        return count
    except Exception as e:
        print(f"Error counting daily consultations: {e}")
        return 0
    finally:
        db.close()

async def get_daily_consultation_count(user_id: int) -> int:
    return await asyncio.to_thread(_get_daily_consultation_count_sync, user_id)
