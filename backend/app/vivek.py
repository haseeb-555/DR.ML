from fastapi import FastAPI, Response, status,HTTPException,Depends,APIRouter, File, UploadFile
from fastapi.params import Body
from random import randrange
from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import time
from . import models,schemas
from app.models import HeartScan, KidneyScan, BrainScan, MRIScan, User

from sqlalchemy.orm import Session
from .database import engine,SessionLocal,get_db
from passlib.context import CryptContext
import os
import shutil
import random
from fastapi.middleware.cors import CORSMiddleware

from .auth import create_access_token


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify: ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],  # allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # allow all headers (e.g., Content-Type, Authorization)
)



while True:
    try:
        conn = psycopg2.connect(host='localhost',database='fastapi',user='postgres',password='Vivekreddy@123',cursor_factory=RealDictCursor)
        cursor=conn.cursor()
        print('connected to database ')
        break
    except Exception as error:
        print("failed to connect database")
        print('error message : ',error)
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
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print("🧑 User:", current_user.email)

    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    filename = file.filename
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Duplicate file check
    if db.query(models.MRIScan).filter(models.MRIScan.filename == filename).first():
        raise HTTPException(status_code=400, detail="This MRI scan has already been uploaded")

    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Prepare model
    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    model_path = os.path.join(BASE_DIR, "models", "dementia_classifier.pth")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = model_azhaimer(model_path, device)

    # Predict
    file.file.seek(0)
    image_bytes = await file.read()
    pred_label, pred_class, prob = predict_alzhaimer(image_bytes, model, device)
    confidence = float(prob[pred_label]) * 100  # Ensure native float

    # Static patient info (for report)
    patient_data = {
        "patient_name": "John Doe",
        "age": 72,
        "gender": "male",
        "hospital_name": "Hope Medical Center",
        "family_history": "Alzheimer’s in maternal side",
        "cognitive_symptoms": "memory loss and confusion"
    }

    # Report generation
    report = await generate_alzhaimer_report(image_bytes, patient_data)
    print("📝 Report:", report)

    # Log to DB
    new_scan = models.MRIScan(
        filename=filename,
        file_path=file_path,
        prediction=pred_class,
        confidence=round(confidence, 2),
        user_id=current_user.id
    )
    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)

    # Return response
    return {
        "message": "MRI scan uploaded successfully",
        "id": new_scan.id,
        "prediction": pred_class,
        "confidence": round(confidence, 2),
        "report": report
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
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    print(current_user) 

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    filename = file.filename
    file_path = os.path.join(mri_UPLOAD_DIR, filename)

    # Duplicate check
    if db.query(models.BrainScan).filter(models.BrainScan.filename == filename).first():
        raise HTTPException(status_code=400, detail="File already uploaded")

    # Save image to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Load model
    model_path = os.path.join(BASE_DIR, "models", "brain.h5")
    if not os.path.exists(model_path):
        raise HTTPException(status_code=500, detail="Model file not found")

    model = load_model(model_path)

    # Read image bytes
    file.file.seek(0)
    image_bytes = file.file.read()

    # Predict
    pred_index, pred_class, prob = predict(image_bytes, model)

    print("Prediction:", pred_class)
    print("Confidence:", prob[pred_index])

    patient_data={
  "patient_name": "John Doe",
  "age": 72,
  "gender": "male",
  "hospital_name": "Hope Medical Center",
  "family_history": "Alzheimer’s in maternal side",
  "cognitive_symptoms": "memory loss and confusion"
}
    report=await generate_brain_report(image_bytes,patient_data)
    print(report)

    # Save to DB
    scan = models.BrainScan(
        filename=filename,
        file_path=file_path,
        tumor_type=pred_class,
        confidence=round(prob[pred_index] * 100, 2),
        user_id=current_user.id
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {
        "message": "Upload successful",
        "id": scan.id,
        "tumor_type": pred_class,
        "confidence": round(prob[pred_index] * 100, 2)
    }









from backend.report.heart import  generate_heart_report

from backend.preprocessing.heart import load_model as l, prepare_input 
heart_model = l()
@app.post("/predict-heart", response_model=dict)
async def predict_heart(
    input: schemas.HeartScanInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    try:
        print(f"User: {current_user.email}")

        # Prepare input
        input_data = input.dict()
        input_df = prepare_input(input_data)

        # Predict
        prediction = heart_model.predict(input_df)[0]
        probability = heart_model.predict_proba(input_df)[0][1]

        result = "Positive" if prediction == 1 else "Negative"
        confidence = round(probability * 100, 2)

        # Save to DB
        #scan = models.HeartScan(
        #    **input_data,
        #    result=result,
        #    confidence=confidence,
        #   user_id=current_user.id
        #)
        #db.add(scan)
        #db.commit()
        #db.refresh(scan)



        data={
        "patient_name": "John Doe",
        "hospital_name": "Hope Medical Center",

        }
        
        report = await generate_heart_report(input_data,data)
        print(report)

        print(prediction,result,confidence,probability)


        return {
            "message": "Prediction successful",
            "result": result,
            "confidence": confidence,
            "report":report
        }

    except Exception as e:
        print("❌ Prediction Error:", str(e))
        raise HTTPException(status_code=500, detail="Prediction failed: " + str(e))
    





from backend.report.kidney import  generate_kidney_report
from numpy import float32, int64
from backend.preprocessing.kidney import predict_kidney_disease 
@app.post("/predict-kidney")
async def predict_kidney(input: schemas.KidneyScanInput, db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    print(current_user)
    data = input.dict()
    result=predict_kidney_disease(data)

    # Simulated prediction (replace with ML model)
    #scan = models.KidneyScan(**data, result=result, confidence=confidence, user_id=current_user.id )
    #db.add(scan)
    #db.commit()
    #db.refresh(scan)
    data_additional={
        "patient_name": "John Doe",
        "hospital_name": "Hope Medical Center",

        }
    report = await generate_kidney_report(data,data_additional)
    print(report)
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


