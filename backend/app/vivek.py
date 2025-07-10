from fastapi import FastAPI, Response, status,HTTPException,Depends,APIRouter, File, UploadFile,Form
from fastapi.params import Body
from random import randrange
from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import time
from . import models,schemas
from app.models import *

from sqlalchemy.orm import Session
from .database import engine,SessionLocal,get_db
from passlib.context import CryptContext
import os
import shutil
import random
from fastapi.middleware.cors import CORSMiddleware

from .auth import create_access_token


import time
import psycopg2
from psycopg2.extras import RealDictCursor
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import engine

# Ensure models are created in the correct DB
models.Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI()

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or use frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: For legacy/manual psycopg2 connection checking
while True:
    try:
        conn = psycopg2.connect(
            host='localhost',
            database='DRML',  # ✅ Must match the SQLAlchemy DB
            user='postgres',
            password='Vivekreddy@123',
            cursor_factory=RealDictCursor
        )
        cursor = conn.cursor()
        print('✅ Connected to PostgreSQL Database (DRML)')
        break
    except Exception as error:
        print("❌ Failed to connect to PostgreSQL")
        print('Error message:', error)
        time.sleep(2)


@app.get("/")
async def root():
    return {"message": "Hello World"}


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    

    hashed_password = pwd_context.hash(user.password)
    new_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not pwd_context.verify(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(data={"sub": db_user.email})
    return {"message": "Login successful","access_token": token, "token_type": "bearer", "user_id": db_user.id}





from .auth import get_current_user
import sys
import torch
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from backend.preprocessing.alzhaimer import  load_model as model_azhaimer, predict as predict_alzhaimer
UPLOAD_DIR = "uploaded_mri"
os.makedirs(UPLOAD_DIR, exist_ok=True)
import json

from backend.report.alzhaimer import  generate_alzhaimer_report

@app.post("/upload-mri")
async def upload_mri(
    file: UploadFile = File(...),
    additional_info: str = Form(...),  # JSON string from frontend
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print("🧑 User:", current_user.email)

    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

    filename = file.filename
    file_path = os.path.join(UPLOAD_DIR, filename)

    if db.query(models.AlzheimerScan).filter(models.AlzheimerScan.filename == filename).first():
        raise HTTPException(status_code=400, detail="This MRI scan has already been uploaded.")

    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Load model
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    model_path = os.path.join(BASE_DIR, "models", "dementia_classifier.pth")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model_azhaimer(model_path, device)

    # Parse image & predict
    file.file.seek(0)
    image_bytes = await file.read()
    pred_label, pred_class, prob = predict_alzhaimer(image_bytes, model, device)
    confidence = float(prob[pred_label]) * 100

    # Parse JSON-formatted patient info
    try:
        patient_data = json.loads(additional_info)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON in additional_info")

    # Generate report
    report = await generate_alzhaimer_report(image_bytes, patient_data)
    print("📝 Report generated")
    patient_data = {
    "patient_name": patient_data["patientName"],
    "age": patient_data["age"],
    "gender": patient_data["gender"],
    "hospital_name": patient_data["hospitalName"],
    "family_history": patient_data.get("familyHistory"),
    "current_medications": patient_data.get("currentMedications"),
    "cognitive_symptoms": patient_data.get("cognitiveSymptoms"),
    "smoking_status": patient_data.get("smokingStatus"),
    "alcohol_consumption": patient_data.get("alcoholConsumption"),
    "exercise_habits": patient_data.get("exerciseHabits"),
    "education_level": patient_data.get("educationLevel"),
    "living_arrangement": patient_data.get("livingArrangement"),
}


    # Create DB object
    scan = models.AlzheimerScan(
        filename=filename,
        file_path=file_path,
        prediction=pred_class,
        confidence=round(confidence, 2),
        report=report,
        user_id=current_user.id,
        **patient_data  # Unpack patient info into columns
    )

    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {
        "message": "MRI scan uploaded successfully",
        "id": scan.id,
        "prediction": scan.prediction,
        "confidence": scan.confidence,
        "report": scan.report
    }







from backend.preprocessing.brain import load_model, predict
from backend.report.brain import  generate_brain_report
from .auth import get_current_user 
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
mri_UPLOAD_DIR = os.path.join(BASE_DIR, "uploaded_brain_mri")
os.makedirs(mri_UPLOAD_DIR, exist_ok=True)

@app.post("/upload-brain-mri")
async def upload_brain_mri(
    file: UploadFile = File(...),
    additional_info: str = Form(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    filename = file.filename
    file_path = os.path.join(mri_UPLOAD_DIR, filename)

    if db.query(models.BrainScanReport).filter(models.BrainScanReport.filename == filename).first():
        raise HTTPException(status_code=400, detail="File already uploaded")

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    model_path = os.path.join(BASE_DIR, "models", "brain.h5")
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Model file not found")

    model = load_model(model_path)
    file.file.seek(0)
    image_bytes = file.file.read()
    pred_index, pred_class, prob = predict(image_bytes, model)

    # Parse JSON string into dict
    try:
        info = json.loads(additional_info)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid patient info JSON")

    # Map camelCase to snake_case manually
    patient_data = {
        "patient_name": info.get("patientName"),
        "age": int(info.get("age")),
        "gender": info.get("gender"),
        "hospital_name": info.get("hospitalName"),
        "family_history": info.get("familyHistoryBrainTumor"),
        "previous_cancer": info.get("previousCancerHistory"),
        "radiation_exp": info.get("radiationExposure"),
        "occupational_exp": info.get("occupationalExposure"),
        "smoking_status": info.get("smokingStatus"),
        "alcohol_use": info.get("alcoholConsumption"),
        "symptoms": info.get("neurologicalSymptoms"),
        "medications": info.get("currentMedications"),
    }

    report = await generate_brain_report(image_bytes, patient_data)

    # Save to database
    scan = models.BrainScanReport(
        filename=filename,
        file_path=file_path,
        user_id=current_user.id,
        tumor_type=pred_class,
        confidence=round(prob[pred_index] * 100, 2),
        report=report,
        **patient_data
    )

    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {
        "message": "Upload successful",
        "id": scan.id,
        "tumor_type": pred_class,
        "confidence": round(prob[pred_index] * 100, 2),
        "report": report
    }





from backend.report.heart import  generate_heart_report

from backend.preprocessing.heart import load_model as l, prepare_input 
heart_model = l()
from app.schemas import HeartPayload

@app.post("/predict-heart", response_model=dict)
async def predict_heart(
    payload: HeartPayload,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        print(f"User: {current_user.email}")

        # Extract input
        input_data = payload.input_data.dict()
        extended = payload.additional_info.dict()

        # Preprocess and predict
        input_df = prepare_input(input_data)
        prediction = heart_model.predict(input_df)[0]
        probability = heart_model.predict_proba(input_df)[0][1]

        result = "Positive" if prediction == 1 else "Negative"
        confidence = float(round(probability * 100, 2))

        # Generate report
        report = await generate_heart_report(input_data, extended)

        # Save to DB
        record = models.HeartScanReport(
            user_id=current_user.id,
            **input_data,  # core input fields
            patient_name=extended.get("patientName"),
            hospital_name=extended.get("hospitalName"),
            family_history=extended.get("familyHistory"),
            smoking_status=extended.get("smokingStatus"),
            alcohol_consumption=extended.get("alcoholConsumption"),
            exercise_habits=extended.get("exerciseHabits"),
            dietary_habits=extended.get("dietaryHabits"),
            stress_levels=extended.get("stressLevels"),
            current_medications=extended.get("currentMedications"),
            symptoms=extended.get("symptoms"),
            occupational_hazards=extended.get("occupationalHazards"),
            sleep_quality=extended.get("sleepQuality"),
            result=result,
            confidence=confidence,
            report=report
        )

        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            "message": "Prediction successful",
            "result": result,
            "confidence": confidence,
            "report": report,
            "record_id": record.id
        }

    except Exception as e:
        print("❌ Prediction Error:", str(e))
        raise HTTPException(status_code=500, detail="Prediction failed: " + str(e))



from backend.report.kidney import  generate_kidney_report
from numpy import float32, int64
from backend.preprocessing.kidney import predict_kidney_disease 
@app.post("/predict-kidney")
async def predict_kidney(input: schemas.KidneyScanRequest, db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    print(current_user)
    form_data_dict = input.formData.dict()
    additional_info_dict=input.additionalInfo.dict()

    result=predict_kidney_disease(form_data_dict)
    report = await generate_kidney_report(form_data_dict,additional_info_dict)
    print(report)


    from app.models import KidneyScan  # adjust path if needed

# Create a new KidneyScan ORM object
    scan = KidneyScan(
        age=form_data_dict["age"],
        blood_pressure=form_data_dict["blood_pressure"],
        specific_gravity=form_data_dict["specific_gravity"],
        albumin=form_data_dict["albumin"],
        sugar=form_data_dict["sugar"],
        red_blood_cells=form_data_dict["red_blood_cells"],
        pus_cell=form_data_dict["pus_cell"],
        pus_cell_clumps=form_data_dict["pus_cell_clumps"],
        bacteria=form_data_dict["bacteria"],
        blood_glucose_random=form_data_dict["blood_glucose_random"],
        blood_urea=form_data_dict["blood_urea"],
        serum_creatinine=form_data_dict["serum_creatinine"],
        sodium=form_data_dict["sodium"],
        potassium=form_data_dict["potassium"],
        haemoglobin=form_data_dict["haemoglobin"],
        packed_cell_volume=str(form_data_dict["packed_cell_volume"]),
        white_blood_cell_count=str(form_data_dict["white_blood_cell_count"]),
        red_blood_cell_count=str(form_data_dict["red_blood_cell_count"]),
        hypertension=form_data_dict["hypertension"],
        diabetes_mellitus=form_data_dict["diabetes_mellitus"],
        coronary_artery_disease=form_data_dict["coronary_artery_disease"],
        appetite=form_data_dict["appetite"],
        peda_edema=form_data_dict["peda_edema"],
        aanemia=form_data_dict["aanemia"],

    # Additional Info
        patient_name=additional_info_dict["patientName"],
        hospital_name=additional_info_dict["hospitalName"],
        family_history=additional_info_dict["familyHistory"],
        symptoms=additional_info_dict["symptoms"],
        medications=additional_info_dict["medications"],
        duration=additional_info_dict["duration"],
        smoking_status=additional_info_dict["smokingStatus"],
        alcohol_consumption=additional_info_dict["alcoholConsumption"],
        dietary_habits=additional_info_dict["dietaryHabits"],
        fluid_intake=additional_info_dict["fluidIntake"],
        exercise_habits=additional_info_dict["exerciseHabits"],

    # Output
        result=result["prediction"],
        confidence = float(result["confidence"]),


    # Foreign key and timestamp
        user_id=current_user.id
    )

# Add to DB session
    db.add(scan)
    db.commit()
    db.refresh(scan)  

    clean_result = {
    "prediction": int(result["prediction"]) if isinstance(result["prediction"], (int64, int)) else result["prediction"],
    "confidence": float(result["confidence"]) if isinstance(result["confidence"], (float32, float)) else result["confidence"],
    "message": "Prediction successful",
    "report": report
}
    return clean_result



@app.get("/history", response_model=list[schemas.PredictionResult])
def get_user_predictions(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    user_id = current_user.id

    history = []

    # Kidney Predictions
    kidney_scans = db.query(models.KidneyScan).filter(models.KidneyScan.user_id == user_id).all()
    for scan in kidney_scans:
        history.append({
            "id": scan.id,
            "disease_type": "kidney_disease",
            "prediction_result": {"result": scan.result},
            "confidence_score": scan.confidence,
            "created_at": scan.created_at,
            "image_url": None
        })

    # Heart Predictions
    heart_scans = db.query(models.HeartScan).filter(models.HeartScan.user_id == user_id).all()
    for scan in heart_scans:
        history.append({
            "id": scan.id,
            "disease_type": "heart_disease",
            "prediction_result": {"result": scan.result},
            "confidence_score": scan.confidence,
            "created_at": scan.created_at,
            "image_url": None
        })

    # Brain Tumor Predictions
    brain_scans = db.query(models.BrainScan).filter(models.BrainScan.user_id == user_id).all()
    for scan in brain_scans:
        history.append({
            "id": scan.id,
            "disease_type": "brain_tumor",
            "prediction_result": {"result": scan.tumor_type},
            "confidence_score": scan.confidence,
            "created_at": scan.uploaded_at,
            "image_url": scan.file_path
        })

    # Alzheimer Predictions
    mri_scans = db.query(models.MRIScan).filter(models.MRIScan.user_id == user_id).all()
    for scan in mri_scans:
        history.append({
            "id": scan.id,
            "disease_type": "alzheimer",
            "prediction_result": {"result": scan.prediction},
            "confidence_score": scan.confidence,
            "created_at": scan.uploaded_at,
            "image_url": scan.file_path
        })

    # Sort all by date descending
    history.sort(key=lambda x: x['created_at'], reverse=True)
    print(history)
    return history


