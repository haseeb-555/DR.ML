from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey, Text
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

    # Reverse Relationships
    alzheimerscans = relationship("AlzheimerScan", back_populates="user", cascade="all, delete")
    brain_reports = relationship("BrainScanReport", back_populates="user", cascade="all, delete")
    heart_reports = relationship("HeartScanReport", back_populates="user", cascade="all, delete")
    kidney_scans = relationship("KidneyScan", back_populates="user", cascade="all, delete")

    def __repr__(self):
        return f"<User id={self.id} full_name='{self.full_name}' email='{self.email}'>"


class AlzheimerScan(Base):
    __tablename__ = "alzheimerscan"

    id = Column(Integer, primary_key=True, index=True)

    # File Info
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    # Input Fields
    patient_name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    hospital_name = Column(String, nullable=False)
    family_history = Column(String)
    current_medications = Column(String)
    cognitive_symptoms = Column(Text)
    smoking_status = Column(String)
    alcohol_consumption = Column(String)
    exercise_habits = Column(String)
    education_level = Column(String)
    living_arrangement = Column(String)

    # Prediction Output
    prediction = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    report = Column(Text)

    # Metadata
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationship
    user = relationship("User", back_populates="alzheimerscans")  # ✅ correct

# models.py

class BrainScanReport(Base):
    __tablename__ = "brain_scan_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # File metadata
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)

    # Patient Info
    patient_name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    hospital_name = Column(String, nullable=False)

    # Medical History
    family_history = Column(String, nullable=True)
    previous_cancer = Column(String, nullable=True)
    radiation_exp = Column(String, nullable=True)
    occupational_exp = Column(String, nullable=True)
    smoking_status = Column(String, nullable=True)
    alcohol_use = Column(String, nullable=True)

    # Current Status
    symptoms = Column(Text, nullable=True)
    medications = Column(Text, nullable=True)

    # Prediction
    tumor_type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)

    # AI-generated Report
    report = Column(Text, nullable=False)

    # Timestamp
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    user = relationship("User", back_populates="brain_reports")



# models.py

class HeartScanReport(Base):
    __tablename__ = "heart_scan_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Core model inputs
    age = Column(Integer, nullable=False)
    sex = Column(Integer, nullable=False)
    cp = Column(Integer, nullable=False)
    trestbps = Column(Float, nullable=False)
    chol = Column(Float, nullable=False)
    fbs = Column(Integer, nullable=False)
    restecg = Column(Integer, nullable=False)
    thalach = Column(Float, nullable=False)
    exang = Column(Integer, nullable=False)
    oldpeak = Column(Float, nullable=False)
    slope = Column(Integer, nullable=False)
    ca = Column(Integer, nullable=False)
    thal = Column(Integer, nullable=False)

    # Extended info
    patient_name = Column(String, nullable=True)
    hospital_name = Column(String, nullable=True)
    family_history = Column(String, nullable=True)
    smoking_status = Column(String, nullable=True)
    alcohol_consumption = Column(String, nullable=True)
    exercise_habits = Column(String, nullable=True)
    dietary_habits = Column(String, nullable=True)
    stress_levels = Column(String, nullable=True)
    current_medications = Column(Text, nullable=True)
    symptoms = Column(Text, nullable=True)
    occupational_hazards = Column(Text, nullable=True)
    sleep_quality = Column(String, nullable=True)

    # Output
    result = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    report = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="heart_reports")




class KidneyScan(Base):
    __tablename__ = "kidney_scans"

    id = Column(Integer, primary_key=True, index=True)
    
    # INPUT FIELDS
    age = Column(Float)
    blood_pressure = Column(Float)
    specific_gravity = Column(Float)
    albumin = Column(Integer)
    sugar = Column(Integer)
    red_blood_cells = Column(String)
    pus_cell = Column(String)
    pus_cell_clumps = Column(String)
    bacteria = Column(String)
    blood_glucose_random = Column(Float)
    blood_urea = Column(Float)
    serum_creatinine = Column(Float)
    sodium = Column(Float)
    potassium = Column(Float)
    haemoglobin = Column(Float)
    packed_cell_volume = Column(String)
    white_blood_cell_count = Column(String)
    red_blood_cell_count = Column(String)
    hypertension = Column(String)
    diabetes_mellitus = Column(String)
    coronary_artery_disease = Column(String)
    appetite = Column(String)
    peda_edema = Column(String)
    aanemia = Column(String)

    # ADDITIONAL INFO
    patient_name = Column(String)
    hospital_name = Column(String)
    family_history = Column(String)
    symptoms = Column(String)
    medications = Column(String)
    duration = Column(String)
    smoking_status = Column(String)
    alcohol_consumption = Column(String)
    dietary_habits = Column(String)
    fluid_intake = Column(String)
    exercise_habits = Column(String)

    # OUTPUT
    result = Column(String)  # e.g., "CKD" or "Normal"
    confidence = Column(Float)

    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    user = relationship("User", back_populates="kidney_scans")


