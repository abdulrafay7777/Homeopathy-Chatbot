from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from core.security import get_password_hash
from api.deps import require_admin

router = APIRouter()

from schemas.admin_person import AdminPersonCreate, AdminPersonResponse
from models.admin_person import AdminPersonDB
from core.state import state

@router.get("/api/admin/system-status")
def get_system_status(current_user: AdminPersonDB = Depends(require_admin)):
    return {"api_exhausted": state.api_quota_exhausted}

@router.post("/api/admin/clear-api-error")
def clear_api_error(current_user: AdminPersonDB = Depends(require_admin)):
    state.api_quota_exhausted = False
    return {"success": True}

@router.post("/api/admin/create-user", response_model=AdminPersonResponse)
def create_admin_user(user: AdminPersonCreate, db: Session = Depends(get_db), current_user: AdminPersonDB = Depends(require_admin)):
    # Check if user already exists
    existing_user = db.query(AdminPersonDB).filter(AdminPersonDB.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = AdminPersonDB(
        name=user.name,
        email=user.email,
        password_hash=hashed_password,
        role=user.role,
        subscription_start_date=user.subscription_start_date,
        subscription_end_date=user.subscription_end_date,
        is_active=user.is_active
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return AdminPersonResponse.from_orm(db_user)

from pydantic import BaseModel
from typing import Optional
from datetime import date

class AdminPersonUpdate(BaseModel):
    is_active: Optional[bool] = None
    subscription_start_date: Optional[date] = None
    subscription_end_date: Optional[date] = None

@router.put("/api/admin/users/{user_id}", response_model=AdminPersonResponse)
def update_admin_user(user_id: int, user_update: AdminPersonUpdate, db: Session = Depends(get_db), current_user: AdminPersonDB = Depends(require_admin)):
    db_user = db.query(AdminPersonDB).filter(AdminPersonDB.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_update.is_active is not None:
        db_user.is_active = user_update.is_active
    if user_update.subscription_start_date is not None:
        db_user.subscription_start_date = user_update.subscription_start_date
    if user_update.subscription_end_date is not None:
        db_user.subscription_end_date = user_update.subscription_end_date
        
    db.commit()
    db.refresh(db_user)
    return AdminPersonResponse.from_orm(db_user)

class AdminPersonPasswordUpdate(BaseModel):
    password: str

@router.put("/api/admin/users/{user_id}/password", response_model=AdminPersonResponse)
def update_user_password(user_id: int, payload: AdminPersonPasswordUpdate, db: Session = Depends(get_db), current_user: AdminPersonDB = Depends(require_admin)):
    db_user = db.query(AdminPersonDB).filter(AdminPersonDB.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    db_user.password_hash = get_password_hash(payload.password)
    db.commit()
    db.refresh(db_user)
    return AdminPersonResponse.from_orm(db_user)

from typing import List

@router.get("/api/admin/users", response_model=List[AdminPersonResponse])
def get_all_users(db: Session = Depends(get_db), current_user: AdminPersonDB = Depends(require_admin)):
    users = db.query(AdminPersonDB).order_by(AdminPersonDB.created_at.desc()).all()
    # Convert DB models to Pydantic models using from_orm to format created_at
    return [AdminPersonResponse.from_orm(user) for user in users]

@router.get("/api/admin/dashboard-stats")
def get_admin_dashboard_stats(current_user: AdminPersonDB = Depends(require_admin)):
    from db.database import SessionLocal
    db = SessionLocal()
    try:
        from sqlalchemy import func, or_
        from models.patient import PatientDB, ConsultationHistoryDB
        from models.admin_person import AdminPersonDB, get_pkt_now
        from datetime import date
        
        # Basic stats
        total_users = db.query(AdminPersonDB).filter(AdminPersonDB.role != 'admin').count()
        total_consultations = db.query(ConsultationHistoryDB).count()
        
        # Recent users
        recent_users = db.query(AdminPersonDB).filter(AdminPersonDB.role != 'admin').order_by(AdminPersonDB.created_at.desc()).limit(5).all()
        recent_users_list = []
        for p in recent_users:
            recent_users_list.append({
                "id": p.id,
                "name": p.name,
                "email": p.email,
                "role": "Doctor" if p.role == "patient" else p.role,
                "date": p.created_at.strftime("%Y-%m-%d %H:%M:%S") if p.created_at else "Unknown"
            })
            
        # Consultations per doctor for Graph
        today = get_pkt_now().date()
        # Filter out users whose subscription has ended
        consultations_per_doctor = db.query(
            AdminPersonDB.id,
            AdminPersonDB.name, 
            func.count(ConsultationHistoryDB.id).label('consultation_count')
        ).outerjoin(ConsultationHistoryDB, AdminPersonDB.id == ConsultationHistoryDB.admin_person_id)\
         .filter(AdminPersonDB.role != 'admin')\
         .filter(
             or_(
                 AdminPersonDB.subscription_end_date == None,
                 AdminPersonDB.subscription_end_date >= today
             )
         )\
         .group_by(AdminPersonDB.id, AdminPersonDB.name).all()
        
        graph_data = [
            {"patientName": f"{row[1]}", "consultations": row[2]}
            for row in consultations_per_doctor
        ]
        
        return {
            "stats": {
                "totalUsers": total_users,
                "activeChats": total_consultations,
                "subscriptions": 0
            },
            "recentUsers": recent_users_list,
            "graphData": graph_data
        }
    except Exception as e:
        print(f"[ERROR] Admin stats error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch admin stats")
    finally:
        db.close()
