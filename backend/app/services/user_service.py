from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserRegisterRequest
from app.auth.password import hash_password, verify_password

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Retrieve user by normalized lowercase email."""
    return db.query(User).filter(User.email == email.strip().lower()).first()

def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    """Retrieve user by unique id."""
    return db.query(User).filter(User.id == user_id).first()

def register_user(db: Session, user_in: UserRegisterRequest) -> User:
    """Create a new user with hashed password and normalized email."""
    existing_user = get_user_by_email(db, user_in.email)
    if existing_user:
        raise ValueError("An account with this email address already exists.")

    hashed_pwd = hash_password(user_in.password)
    user = User(
        name=user_in.name.strip(),
        email=user_in.email.strip().lower(),
        hashed_password=hashed_pwd,
        role=user_in.role.value if hasattr(user_in.role, "value") else str(user_in.role),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, plain_password: str) -> Optional[User]:
    """Verify credentials and return User if valid, otherwise None."""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(plain_password, user.hashed_password):
        return None
    return user
