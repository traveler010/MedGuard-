import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("medguard.database")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

def init_engine():
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+psycopg2://", 1)
    is_postgres = db_url.startswith("postgresql+psycopg2://") or db_url.startswith("postgresql://")

    eng = None
    if is_postgres:
        try:
            logger.info(f"Attempting connection to PostgreSQL at {db_url.split('@')[-1] if '@' in db_url else 'specified host'}...")
            eng = create_engine(
                db_url,
                pool_pre_ping=True,
                connect_args={"connect_timeout": 3}
            )
            with eng.connect() as conn:
                conn.execute(text("SELECT 1"))
            logger.info("[OK] Successfully connected to PostgreSQL database.")
        except Exception as e:
            logger.warning(f"PostgreSQL connection not reachable ({e}).")
            if settings.FALLBACK_TO_SQLITE:
                logger.info(f"Using SQLite database fallback at {settings.SQLITE_URL} for local verification.")
                eng = create_engine(
                    settings.SQLITE_URL,
                    connect_args={"check_same_thread": False}
                )
            else:
                raise e
    else:
        logger.info(f"Connecting to database at {db_url}")
        eng = create_engine(
            db_url,
            connect_args={"check_same_thread": False} if "sqlite" in db_url else {}
        )
    return eng

def ensure_schema_compatibility(eng):
    """Ensure newly added columns exist in development/SQLite environments without wiping data."""
    try:
        with eng.connect() as conn:
            # SQLite PRAGMA check
            consultation_cols = {row[1] for row in conn.execute(text("PRAGMA table_info(consultations)")).fetchall()}
            if consultation_cols:
                if "appointment_id" not in consultation_cols:
                    conn.execute(text("ALTER TABLE consultations ADD COLUMN appointment_id VARCHAR(36)"))
                if "started_at" not in consultation_cols:
                    conn.execute(text("ALTER TABLE consultations ADD COLUMN started_at TIMESTAMP"))
                if "last_activity_at" not in consultation_cols:
                    conn.execute(text("ALTER TABLE consultations ADD COLUMN last_activity_at TIMESTAMP"))
            
            # Check consultation_messages
            message_cols = {row[1] for row in conn.execute(text("PRAGMA table_info(consultation_messages)")).fetchall()}
            if message_cols:
                if "attachment_id" not in message_cols:
                    conn.execute(text("ALTER TABLE consultation_messages ADD COLUMN attachment_id VARCHAR(36)"))
                if "read_at" not in message_cols:
                    conn.execute(text("ALTER TABLE consultation_messages ADD COLUMN read_at TIMESTAMP"))

            # Check medication_logs
            med_cols = {row[1] for row in conn.execute(text("PRAGMA table_info(medication_logs)")).fetchall()}
            if med_cols:
                if "scheduled_date" not in med_cols:
                    conn.execute(text("ALTER TABLE medication_logs ADD COLUMN scheduled_date VARCHAR(20)"))
            conn.commit()
    except Exception as e:
        # Non-SQLite dialects or errors handled safely
        logger.debug(f"Schema compatibility check: {e}")

engine = init_engine()
ensure_schema_compatibility(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

