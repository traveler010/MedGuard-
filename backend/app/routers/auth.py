from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
)
from app.services.user_service import register_user, authenticate_user
from app.auth.jwt import create_access_token
from app.auth.dependencies import get_current_user, require_doctor, require_patient

router = APIRouter(prefix="/auth", tags=["Authentication & Roles"])

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new Doctor or Patient account",
    description="Registers a new user with secure bcrypt hashing and returns the created user profile without sensitive fields."
)
def register(user_in: UserRegisterRequest, db: Session = Depends(get_db)):
    try:
        user = register_user(db, user_in)
        return user
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )

@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    summary="Login and receive JWT access token",
    description="Authenticates user credentials and issues a signed JWT Bearer token."
)
def login(login_data: UserLoginRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # JWT payload containing user id, email, and role
    token_payload = {
        "sub": user.id,
        "email": user.email,
        "name": user.name,
        "role": user.role,
    }
    access_token = create_access_token(data=token_payload)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )

@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current authenticated user profile",
    description="Returns the profile information of the currently authenticated JWT Bearer user."
)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# Role-protected endpoints demonstrating strict doctor vs patient isolation:
@router.get(
    "/doctor/protected",
    status_code=status.HTTP_200_OK,
    summary="Doctor-only protected resource",
    description="Accessible ONLY to authenticated users with role='doctor'. Patients receive 403 Forbidden."
)
def doctor_only_resource(current_user: User = Depends(require_doctor)):
    return {
        "status": "success",
        "message": f"Doctor clinical clearance confirmed. Welcome, Dr. {current_user.name}.",
        "doctor_id": current_user.id,
        "role": current_user.role,
    }

@router.get(
    "/patient/protected",
    status_code=status.HTTP_200_OK,
    summary="Patient-only protected resource",
    description="Accessible ONLY to authenticated users with role='patient'. Doctors receive 403 Forbidden."
)
def patient_only_resource(current_user: User = Depends(require_patient)):
    return {
        "status": "success",
        "message": f"Patient clearance confirmed. Welcome, {current_user.name}.",
        "patient_id": current_user.id,
        "role": current_user.role,
    }
