from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import date

class AdminPersonCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name of the user")
    email: EmailStr = Field(description="Valid email address")
    password: str = Field(..., min_length=6, max_length=50, description="Password must be at least 6 characters")
    role: str = Field(..., pattern="^(patient|admin)$", description="Role must be patient or admin")
    subscription_start_date: Optional[date] = None
    subscription_end_date: Optional[date] = None
    is_active: bool = True

class AdminPersonResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    subscription_start_date: Optional[date]
    subscription_end_date: Optional[date]
    is_active: bool
    created_at: str

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            name=obj.name,
            email=obj.email,
            role=obj.role,
            subscription_start_date=obj.subscription_start_date,
            subscription_end_date=obj.subscription_end_date,
            is_active=obj.is_active,
            created_at=obj.created_at.strftime("%Y-%m-%d") if obj.created_at else "Unknown"
        )

