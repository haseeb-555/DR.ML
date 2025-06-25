from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    published = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Relationships (optional, makes access easier)
    mri_scans = relationship("MRIScan", back_populates="user")
    brain_scans = relationship("BrainScan", back_populates="user")
    heart_scans = relationship("HeartScan", back_populates="user")
    kidney_scans = relationship("KidneyScan", back_populates="user")

    def __repr__(self):
        return f"<User id={self.id} full_name='{self.full_name}' email='{self.email}'>"


class MRIScan(Base):
    __tablename__ = "mri_scans"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    file_path = Column(String)
    prediction = Column(String)
    confidence = Column(Float)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="mri_scans")


class BrainScan(Base):
    __tablename__ = "brain_scans"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, unique=True, index=True)
    file_path = Column(String)
    tumor_type = Column(String)
    confidence = Column(Float)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="brain_scans")


class HeartScan(Base):
    __tablename__ = "heart_scans"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=False)
    sex = Column(Integer, nullable=False)
    cp = Column(Integer, nullable=False)
    trestbps = Column(Integer, nullable=False)
    chol = Column(Integer, nullable=False)
    fbs = Column(Integer, nullable=False)
    restecg = Column(Integer, nullable=False)
    thalach = Column(Integer, nullable=False)
    exang = Column(Integer, nullable=False)
    oldpeak = Column(Float, nullable=False)
    slope = Column(Integer, nullable=False)
    ca = Column(Integer, nullable=False)
    thal = Column(Integer, nullable=False)
    result = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="heart_scans")


class KidneyScan(Base):
    __tablename__ = "kidney_scans"

    id = Column(Integer, primary_key=True, index=True)
    age = Column(Integer, nullable=False)
    blood_pressure = Column(Integer, nullable=False)
    specific_gravity = Column(Float, nullable=False)
    albumin = Column(Integer, nullable=False)
    sugar = Column(Integer, nullable=False)
    red_blood_cells = Column(String, nullable=False)
    pus_cell = Column(String, nullable=False)
    pus_cell_clumps = Column(String, nullable=False)
    bacteria = Column(String, nullable=False)
    blood_glucose_random = Column(Integer, nullable=False)
    blood_urea = Column(Integer, nullable=False)
    serum_creatinine = Column(Float, nullable=False)
    sodium = Column(Integer, nullable=False)
    potassium = Column(Float, nullable=False)
    haemoglobin = Column(Float, nullable=False)
    packed_cell_volume = Column(Integer, nullable=False)
    white_blood_cell_count = Column(Integer, nullable=False)
    red_blood_cell_count = Column(Float, nullable=False)
    hypertension = Column(String, nullable=False)
    diabetes_mellitus = Column(String, nullable=False)
    coronary_artery_disease = Column(String, nullable=False)
    appetite = Column(String, nullable=False)
    peda_edema = Column(String, nullable=False)
    aanemia = Column(String, nullable=False)
    result = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="kidney_scans")
