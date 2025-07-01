from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv
from pathlib import Path

# Get path to agents/.env
env_path = Path(__file__).resolve().parents[1] / ".env"
# Load local agents/.env
load_dotenv(dotenv_path=env_path)


SQLALCHEMY_DATABSAE_URL = os.getenv("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABSAE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

print("Using DB URL:", os.getenv("DATABASE_URL"))


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
