from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker


SQLALCHEMY_DATABSAE_URL  = "postgresql://postgres:Vivekreddy%40123@localhost:5432/DRML"

engine = create_engine(SQLALCHEMY_DATABSAE_URL)

SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base=declarative_base()
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
