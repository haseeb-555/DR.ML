from fastapi import (
    FastAPI,
    Response,
    status,
    HTTPException,
    Depends,
    APIRouter,
    File,
    UploadFile,
)
from fastapi.params import Body
from random import randrange
from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
import time
from . import models, schemas
from app.models import HeartScan, KidneyScan, BrainScan, MRIScan, User

from sqlalchemy.orm import Session
from .database import engine, SessionLocal, get_db
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

UPLOAD_DIR = "uploaded_mri"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# while True:
#     try:
#         conn = psycopg2.connect(host='localhost',database='fastapi',user='postgres',password='Vivekreddy@123',cursor_factory=RealDictCursor)
#         cursor=conn.cursor()
#         print('connected to database ')
#         break
#     except Exception as error:
#         print("failed to connect database")
#         print('error message : ',error)
#         time.sleep(2)


my_posts = [
    {"title": "title1", "content": "content1", "id": 1},
    {"title": "title2", "content": "content2", "id": 2},
]


def find_post(id):
    for p in my_posts:
        if p["id"] == id:
            return p


def find_index_post(id):
    for i, p in enumerate(my_posts):
        if p["id"] == id:
            return i


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
        email=user.email, full_name=user.full_name, hashed_password=hashed_password
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
    return {
        "message": "Login successful",
        "access_token": token,
        "token_type": "bearer",
        "user_id": db_user.id,
    }


from .auth import get_current_user


@app.post("/upload-mri")
def upload_mri(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    print(current_user)
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Invalid file type")

    filename = file.filename
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Duplicate check
    existing = (
        db.query(models.MRIScan).filter(models.MRIScan.filename == filename).first()
    )
    if existing:
        raise HTTPException(
            status_code=400, detail="This MRI scan has already been uploaded"
        )

    # Save file to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Placeholder prediction
    prediction = "Mild Dementia"
    confidence = 92.0

    # Save record to DB
    new_scan = models.MRIScan(
        filename=filename,
        file_path=file_path,
        prediction=prediction,
        confidence=confidence,
        user_id=current_user.id,
    )
    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)

    return {
        "message": "MRI scan uploaded successfully",
        "id": new_scan.id,
        "prediction": prediction,
        "confidence": confidence,
    }


UPLOAD_DIR = "uploaded_brain_mri"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload-brain-mri")
def upload_brain_mri(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    print(current_user)
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are allowed")

    filename = file.filename
    file_path = os.path.join(UPLOAD_DIR, filename)

    # Duplicate check
    if db.query(models.BrainScan).filter(models.BrainScan.filename == filename).first():
        raise HTTPException(status_code=400, detail="File already uploaded")

    # Save image
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Simulate prediction
    tumor_classes = ["No Tumor", "Glioma", "Meningioma", "Pituitary"]
    tumor_type = random.choice(tumor_classes)
    confidence = round(random.uniform(85, 99), 2)

    # Save to DB
    scan = models.BrainScan(
        filename=filename,
        file_path=file_path,
        tumor_type=tumor_type,
        confidence=confidence,
        user_id=current_user.id,
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {
        "message": "Upload successful",
        "id": scan.id,
        "tumor_type": tumor_type,
        "confidence": confidence,
    }


@app.post("/predict-heart", response_model=dict)
def predict_heart(
    input: schemas.HeartScanInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    print(current_user)
    data = input.dict()
    # Dummy prediction logic (to replace with real ML)
    result = random.choice(["Positive", "Negative"])
    confidence = round(random.uniform(75, 95), 2)

    # Save to database
    scan = models.HeartScan(
        **data, result=result, confidence=confidence, user_id=current_user.id
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {
        "message": "Prediction saved",
        "id": scan.id,
        "result": result,
        "confidence": confidence,
    }


@app.post("/predict-kidney")
def predict_kidney(
    input: schemas.KidneyScanInput,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    print(current_user)
    data = input.dict()

    # Simulated prediction (replace with ML model)
    result = random.choice(["CKD", "Not CKD"])
    confidence = round(random.uniform(80, 99), 2)
    scan = models.KidneyScan(
        **data, result=result, confidence=confidence, user_id=current_user.id
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    return {
        "message": "Kidney scan prediction saved",
        "id": scan.id,
        "result": result,
        "confidence": confidence,
    }


@app.get("/history", response_model=list[schemas.PredictionResult])
def get_user_predictions(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    user_id = current_user.id

    history = []

    # Kidney Predictions
    kidney_scans = (
        db.query(models.KidneyScan).filter(models.KidneyScan.user_id == user_id).all()
    )
    for scan in kidney_scans:
        history.append(
            {
                "id": scan.id,
                "disease_type": "kidney_disease",
                "prediction_result": {"result": scan.result},
                "confidence_score": scan.confidence,
                "created_at": scan.created_at,
                "image_url": None,
            }
        )

    # Heart Predictions
    heart_scans = (
        db.query(models.HeartScan).filter(models.HeartScan.user_id == user_id).all()
    )
    for scan in heart_scans:
        history.append(
            {
                "id": scan.id,
                "disease_type": "heart_disease",
                "prediction_result": {"result": scan.result},
                "confidence_score": scan.confidence,
                "created_at": scan.created_at,
                "image_url": None,
            }
        )

    # Brain Tumor Predictions
    brain_scans = (
        db.query(models.BrainScan).filter(models.BrainScan.user_id == user_id).all()
    )
    for scan in brain_scans:
        history.append(
            {
                "id": scan.id,
                "disease_type": "brain_tumor",
                "prediction_result": {"result": scan.tumor_type},
                "confidence_score": scan.confidence,
                "created_at": scan.uploaded_at,
                "image_url": scan.file_path,
            }
        )

    # Alzheimer Predictions
    mri_scans = db.query(models.MRIScan).filter(models.MRIScan.user_id == user_id).all()
    for scan in mri_scans:
        history.append(
            {
                "id": scan.id,
                "disease_type": "alzheimer",
                "prediction_result": {"result": scan.prediction},
                "confidence_score": scan.confidence,
                "created_at": scan.uploaded_at,
                "image_url": scan.file_path,
            }
        )

    # Sort all by date descending
    history.sort(key=lambda x: x["created_at"], reverse=True)
    print(history)
    return history


@app.get("/post", response_model=list[schemas.Post])
def posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).all()

    return posts


@app.post("/posts", status_code=status.HTTP_201_CREATED, response_model=schemas.Post)
def create_posts(post: schemas.createpost, db: Session = Depends(get_db)):
    new_post = models.Post(**post.dict())
    db.add(new_post)
    db.commit()
    db.refresh(new_post)

    return new_post


@app.get("/posts/{id}", response_model=schemas.Post)
def get_post(id: int, response: Response, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == id).first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"post of id : {id} not found"
        )

    return post


@app.delete("/posts/{id}", response_model=schemas.Post)
def delete_post(id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == id).first()
    if not post:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
    db.delete(post)
    db.commit()
    return post


@app.get("/sqlalchemy")
def test_posts(db: Session = Depends(get_db)):
    posts = db.query(models.Post).all()
    print(posts)
    return ("data", posts)


@app.put("/posts/{id}", response_model=schemas.Post)
def update_post(id: int, post_data: schemas.createpost, db: Session = Depends(get_db)):
    post_query = db.query(models.Post).filter(models.Post.id == id)
    post = post_query.first()

    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"Post with id {id} not found"
        )

    post_query.update(post_data.dict(), synchronize_session=False)
    db.commit()

    return post_query.first()
