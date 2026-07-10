from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from db.database import get_db
from core.security import verify_password, create_access_token, get_password_hash
from schemas.auth import LoginRequest, LoginResponse, GoogleLoginRequest, SignupRequest
from models.admin_person import AdminPersonDB
import uuid
import os
import shutil
from core.dependencies import get_current_user

router = APIRouter()

@router.post("/api/auth/signup", response_model=LoginResponse)
def signup(request: SignupRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(AdminPersonDB).filter(AdminPersonDB.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    # Create new user
    hashed_password = get_password_hash(request.password)
    new_user = AdminPersonDB(
        name=request.name,
        email=request.email,
        password_hash=hashed_password,
        role=request.role or "patient"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Generate token payload
    token_data = {
        "sub": str(new_user.id),
        "email": new_user.email,
        "name": new_user.name,
        "role": new_user.role
    }
    
    access_token = create_access_token(token_data)
    
    return {"access_token": access_token, "token_type": "bearer", "user": {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role,
        "profile_image": new_user.profile_image,
        "is_active": new_user.is_active,
        "subscription_start_date": None,
        "subscription_end_date": None
    }}

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
        "profile_image": user.profile_image,
        "is_active": user.is_active,
        "subscription_start_date": user.subscription_start_date.isoformat() if user.subscription_start_date else None,
        "subscription_end_date": user.subscription_end_date.isoformat() if user.subscription_end_date else None
    }}

@router.post("/api/auth/profile-picture")
async def upload_profile_picture(file: UploadFile = File(...), db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Validate file extension
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Only JPG, PNG and WEBP files are allowed")
    
    # Generate a secure random filename
    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join("uploads", "avatars", filename)
    
    # Save the file
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Update user in DB
    user_record = db.query(AdminPersonDB).filter(AdminPersonDB.id == current_user.id).first()
    if not user_record:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_record.profile_image = f"/uploads/avatars/{filename}"
    db.commit()
    db.refresh(user_record)
    
    return {
        "success": True,
        "profile_image": user_record.profile_image,
        "user": {
            "id": user_record.id,
            "name": user_record.name,
            "email": user_record.email,
            "role": user_record.role,
            "profile_image": user_record.profile_image,
            "is_active": user_record.is_active
        }
    }
