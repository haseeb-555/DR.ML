from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from pydantic import  EmailStr

class PostBase(BaseModel):
    title:str
    content:str
    published: bool=True


class createpost(PostBase):
    pass


class Post(PostBase):
    id:int
    created_at:datetime


    class Config:
        orm_mode=True



class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str


class HeartScanInput(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: int
    chol: int
    fbs: int
    restecg: int
    thalach: int
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int

from pydantic import BaseModel
from typing import Dict

class HeartPayload(BaseModel):
    input_data: Dict
    additional_info: Dict


class KidneyScanInput(BaseModel):
    age: int
    blood_pressure: int
    specific_gravity: float
    albumin: int
    sugar: int
    red_blood_cells: str
    pus_cell: str
    pus_cell_clumps: str
    bacteria: str
    blood_glucose_random: int
    blood_urea: int
    serum_creatinine: float
    sodium: int
    potassium: float
    haemoglobin: float
    packed_cell_volume: int
    white_blood_cell_count: int
    red_blood_cell_count: float
    hypertension: str
    diabetes_mellitus: str
    coronary_artery_disease: str
    appetite: str
    peda_edema: str
    aanemia: str



class PredictionResult(BaseModel):
    id: int
    disease_type: str
    prediction_result: Optional[dict]
    confidence_score: Optional[float]
    created_at: datetime
    image_url: Optional[str] = None

    class Config:
        orm_mode = True



# app/schemas.py

from pydantic import BaseModel
from typing import Optional, Dict


class HeartInputData(BaseModel):
    age: int
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: int
    thal: int


class HeartAdditionalInfo(BaseModel):
    patientName: Optional[str] = None
    hospitalName: Optional[str] = None
    familyHistory: Optional[str] = None
    smokingStatus: Optional[str] = None
    alcoholConsumption: Optional[str] = None
    exerciseHabits: Optional[str] = None
    dietaryHabits: Optional[str] = None
    stressLevels: Optional[str] = None
    currentMedications: Optional[str] = None
    symptoms: Optional[str] = None
    occupationalHazards: Optional[str] = None
    sleepQuality: Optional[str] = None


class HeartPayload(BaseModel):
    input_data: HeartInputData
    additional_info: HeartAdditionalInfo
from pydantic import BaseModel

class FormData(BaseModel):
    age: int
    blood_pressure: int
    specific_gravity: float
    albumin: int
    sugar: int
    red_blood_cells: str
    pus_cell: str
    pus_cell_clumps: str
    bacteria: str
    blood_glucose_random: int
    blood_urea: int
    serum_creatinine: float
    sodium: int
    potassium: float
    haemoglobin: float
    packed_cell_volume: int
    white_blood_cell_count: int
    red_blood_cell_count: float
    hypertension: str
    diabetes_mellitus: str
    coronary_artery_disease: str
    appetite: str
    peda_edema: str
    aanemia: str

class AdditionalInfo(BaseModel):
    patientName: str
    hospitalName: str
    familyHistory: str
    symptoms: str
    medications: str
    duration: str
    smokingStatus: str
    alcoholConsumption: str
    dietaryHabits: str
    fluidIntake: str
    exerciseHabits: str

class KidneyScanRequest(BaseModel):
    formData: FormData
    additionalInfo: AdditionalInfo


# {
#   "age": 52,
#   "blood_pressure": 80,
#   "specific_gravity": 1.020,
#   "albumin": 2,
#   "sugar": 0,
#   "red_blood_cells": "abnormal",
#   "pus_cell": "abnormal",
#   "pus_cell_clumps": "present",
#   "bacteria": "notpresent",
#   "blood_glucose_random": 145,
#   "blood_urea": 56,
#   "serum_creatinine": 3.4,
#   "sodium": 138.0,
#   "potassium": 4.5,
#   "haemoglobin": 11.2,
#   "packed_cell_volume": "34",
#   "white_blood_cell_count": "9800",
#   "red_blood_cell_count": "4.2",
#   "hypertension": "yes",
#   "diabetes_mellitus": "yes",
#   "coronary_artery_disease": "no",
#   "appetite": "poor",
#   "peda_edema": "yes",
#   "aanemia": "yes"
# }
