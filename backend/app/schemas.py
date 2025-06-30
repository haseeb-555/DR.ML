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