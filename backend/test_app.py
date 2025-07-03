from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
import json
import uvicorn
import multiprocessing

from report.alzhaimer import generate_alzhaimer_report
from report.brain import generate_brain_report
from report.chatbot import get_chatbot_response
from report.heart import generate_heart_report
from report.kidney import generate_kidney_report

app = FastAPI(
    title="Medical Diagnostic Test App",
    description="Test endpoints for Alzheimer, Brain Tumor, Heart Disease, Kidney Disease, and Chatbot classification",
    version="1.0.0",
)

# Allow CORS for testing if needed
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----------- Alzheimer Endpoint -------------
@app.post("/test/alzhaimer")
async def test_alzhaimer_report(
    image_file: UploadFile = File(...), patient_data: str = Form(...)
):
    try:
        parsed_data = json.loads(patient_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid patient_data JSON")

    # ✅ FIXED: read raw bytes from file
    image_bytes = image_file.file.read()

    res = await generate_alzhaimer_report(image_bytes, parsed_data)
    return res


# ----------- Brain Tumor Endpoint -------------
@app.post("/test/brain")
async def test_brain(image: UploadFile = File(...), patient_data: str = Form(...)):
    try:
        parsed_data = json.loads(patient_data)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid patient_data JSON")

    return await generate_brain_report(image_file=image.file, patient_data=parsed_data)


# ----------- Heart Disease Endpoint -------------
@app.post("/test/heart")
async def test_heart(formData: str = Form(...), additionalInfo: str = Form(...)):
    try:
        form_data_dict = json.loads(formData)
        additional_info_dict = json.loads(additionalInfo)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid form data JSON")

    return await generate_heart_report(
        formData=form_data_dict, additionalInfo=additional_info_dict
    )


# ----------- Kidney Disease Endpoint -------------
@app.post("/test/kidney")
async def test_kidney(formData: str = Form(...), additionalInfo: str = Form(...)):
    try:
        form_data_dict = json.loads(formData)
        additional_info_dict = json.loads(additionalInfo)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid form data JSON")

    return await generate_kidney_report(
        formData=form_data_dict, additionalInfo=additional_info_dict
    )


# ----------- General Chatbot Classifier -------------
@app.post("/test/chatbot")
async def test_chatbot(query: str):
    return await get_chatbot_response(query)


# ----------- Run the app -------------
if __name__ == "__main__":
    uvicorn.run("test_app:app", host="0.0.0.0", port=9000, reload=True)
