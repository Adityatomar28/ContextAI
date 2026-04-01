from datetime import timedelta, datetime, timezone
import random
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.models.schemas import UserCreate, UserInDB, Token, VerifyOTPRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.services import email_service

router = APIRouter()

def generate_otp() -> str:
    return str(random.randint(100000, 999999))

@router.post("/signup", response_model=dict)
async def signup(*, db: AsyncSession = Depends(deps.get_db), user_in: UserCreate):
    result = await db.execute(select(User).filter(User.email == user_in.email))
    user = result.scalars().first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    otp = generate_otp()
    otp_expiry = datetime.now(timezone.utc) + timedelta(minutes=10)
    
    user = User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        is_verified=False,
        otp=otp,
        otp_expires_at=otp_expiry
    )
    db.add(user)
    await db.commit()
    
    # Send email
    email_service.send_verification_otp(user.email, otp)
    
    return {"message": "Verification OTP sent to email."}

@router.post("/verify-otp")
async def verify_otp(request: VerifyOTPRequest, db: AsyncSession = Depends(deps.get_db)):
    result = await db.execute(select(User).filter(User.email == request.email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.is_verified:
        return {"message": "Email is already verified"}
        
    if user.otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    if user.otp_expires_at and user.otp_expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP has expired")
        
    user.is_verified = True
    user.otp = None
    user.otp_expires_at = None
    
    db.add(user)
    await db.commit()
    return {"message": "Email successfully verified!"}

@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
):
    result = await db.execute(select(User).filter(User.email == form_data.username))
    user = result.scalars().first()
    
    if user is None or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
        
    if not user.is_verified:
        raise HTTPException(status_code=403, detail="Please verify your email address to log in.")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest, db: AsyncSession = Depends(deps.get_db)):
    result = await db.execute(select(User).filter(User.email == request.email))
    user = result.scalars().first()
    
    if not user:
        raise HTTPException(status_code=404, detail="This email is not registered in our system.")
        
    otp = generate_otp()
    user.otp = otp
    user.otp_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    db.add(user)
    await db.commit()
    
    success = email_service.send_password_reset_otp(user.email, otp)
    if not success:
        raise HTTPException(status_code=500, detail="Failed to send OTP email. Check backend logs.")
        
    return {"message": "A password reset code has been sent to your email."}

@router.post("/reset-password")
async def reset_password(request: ResetPasswordRequest, db: AsyncSession = Depends(deps.get_db)):
    result = await db.execute(select(User).filter(User.email == request.email))
    user = result.scalars().first()
    
    if not user or user.otp != request.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
        
    if user.otp_expires_at and user.otp_expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP has expired")
        
    user.hashed_password = security.get_password_hash(request.new_password)
    user.otp = None
    user.otp_expires_at = None
    db.add(user)
    await db.commit()
    
    return {"message": "Password successfully reset!"}

@router.get("/me", response_model=UserInDB)
async def read_users_me(current_user: User = Depends(deps.get_current_user)):
    return current_user

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

@router.post("/change-password")
async def change_password(
    data: PasswordChangeRequest,
    current_user: User = Depends(deps.get_current_user),
    db: AsyncSession = Depends(deps.get_db)
):
    if not security.verify_password(data.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
    
    current_user.hashed_password = security.get_password_hash(data.new_password)
    db.add(current_user)
    await db.commit()
    return {"msg": "Password updated successfully"}
