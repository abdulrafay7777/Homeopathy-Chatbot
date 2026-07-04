from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from core.security import verify_password, create_access_token
from schemas.auth import LoginRequest, LoginResponse, GoogleLoginRequest, SignupRequest
from models.admin_person import AdminPersonDB
import uuid

router = APIRouter()

@router.post("/api/auth/signup", response_model=LoginResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    raise HTTPException(status_code=403, detail="Public signups are disabled. Please contact the administrator.")

@router.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(AdminPersonDB).filter(AdminPersonDB.email == request.email).first()
    
    if not user or not verify_password(request.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate token payload
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "name": user.name,
        "role": user.role
    }
    
    access_token = create_access_token(token_data)
    
    return {"access_token": access_token, "token_type": "bearer", "user": {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "plan": user.plan
    }}
