from pydantic import BaseModel, Field

class AdminPersonCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Full name of the user")
    email: str = Field(..., pattern=r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", description="Valid email address")
    password: str = Field(..., min_length=6, max_length=50, description="Password must be at least 6 characters")
    role: str = Field(..., pattern="^(student|doctor|admin)$", description="Role must be student, doctor, or admin")
    plan: str = Field(..., pattern="^(basic|standard|premium)$", description="Plan must be basic, standard, or premium")

class AdminPersonResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    plan: str
    created_at: str

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm(cls, obj):
        return cls(
            id=obj.id,
            name=obj.name,
            email=obj.email,
            role=obj.role,
            plan=obj.plan,
            created_at=obj.created_at.strftime("%Y-%m-%d") if obj.created_at else "Unknown"
        )

