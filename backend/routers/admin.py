from fastapi import APIRouter, HTTPException

router = APIRouter()

@router.get("/api/admin/dashboard-stats")
def get_admin_dashboard_stats():
    from db.database import SessionLocal
    db = SessionLocal()
    try:
        from sqlalchemy import func
        from models.patient import PatientDB, ConsultationHistoryDB
        
        # Basic stats
        total_patients = db.query(PatientDB).count()
        total_consultations = db.query(ConsultationHistoryDB).count()
        
        # Recent patients
        recent_patients = db.query(PatientDB).order_by(PatientDB.created_at.desc()).limit(5).all()
        recent_users_list = []
        for p in recent_patients:
            recent_users_list.append({
                "id": p.id,
                "name": p.name,
                "email": f"{p.name.lower().replace(' ', '')}@patient.local",
                "role": "Patient",
                "date": p.created_at.strftime("%Y-%m-%d %H:%M:%S") if p.created_at else "Unknown"
            })
            
        # Consultations per patient for Graph
        consultations_per_patient = db.query(
            PatientDB.name, 
            func.count(ConsultationHistoryDB.id).label('consultation_count')
        ).outerjoin(ConsultationHistoryDB).group_by(PatientDB.id).all()
        
        graph_data = [
            {"patientName": row[0], "consultations": row[1]}
            for row in consultations_per_patient
        ]
        
        return {
            "stats": {
                "totalUsers": total_patients,
                "activeChats": total_consultations,
                "subscriptions": 0
            },
            "recentUsers": recent_users_list,
            "graphData": graph_data
        }
    except Exception as e:
        print(f"❌ [ERROR] Admin stats error: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch admin stats")
    finally:
        db.close()
