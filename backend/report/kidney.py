# report/kidney.py

import pandas as pd
import joblib
from pathlib import Path

from chat.agents.kidney.agent import report_agent
from google.adk.sessions import InMemorySessionService
from google.adk.runners import Runner
from google.genai import types

# Constants
MODEL_PATH = Path("backend/models/kidney.joblib")
APP_NAME = "kidney_report"
USER_ID = "report_user"
SESSION_ID = "kidney_session"

session_service = InMemorySessionService()

# Load all models from joblib (XgBoost is selected)
all_models = joblib.load(MODEL_PATH)


def load_model():
    return all_models.get("XgBoost")


def preprocess_input(user_input_dict):
    df = pd.DataFrame([user_input_dict])

    # Convert numeric string fields
    numeric_fields = [
        "packed_cell_volume",
        "white_blood_cell_count",
        "red_blood_cell_count",
    ]
    df[numeric_fields] = df[numeric_fields].apply(pd.to_numeric, errors="coerce")

    # Encode categorical fields
    mapping_dict = {
        "red_blood_cells": {"normal": 0, "abnormal": 1},
        "pus_cell": {"normal": 0, "abnormal": 1},
        "pus_cell_clumps": {"notpresent": 0, "present": 1},
        "bacteria": {"notpresent": 0, "present": 1},
        "hypertension": {"no": 0, "yes": 1},
        "diabetes_mellitus": {"no": 0, "yes": 1},
        "coronary_artery_disease": {"no": 0, "yes": 1},
        "appetite": {"poor": 0, "good": 1},
        "peda_edema": {"no": 0, "yes": 1},
        "aanemia": {"no": 0, "yes": 1},
    }

    for col, mapping in mapping_dict.items():
        df[col] = df[col].map(mapping).fillna(0).astype(int)

    return df


async def generate_kidney_report(formData: dict, additionalInfo: dict):
    model = load_model()
    input_df = preprocess_input(formData)

    # Prediction and confidence
    prediction = model.predict(input_df)[0]
    confidence = (
        max(model.predict_proba(input_df)[0])
        if hasattr(model, "predict_proba")
        else 0.90
    )

    has_disease = prediction == 1
    diagnosis = (
        "has chronic kidney disease"
        if has_disease
        else "does not have chronic kidney disease"
    )
    bold_diagnosis = f"**{diagnosis}**"
    bold_conf = f"**{confidence:.2f}**"

    name = additionalInfo.get("patientName", "The patient")
    hospital = additionalInfo.get("hospitalName", "N/A")

    # Optional fields (dynamically included)
    optional_fields = {
        "familyHistory": "family history of kidney disease: {}",
        "symptoms": "reported symptoms: {}",
        "medications": "current medications: {}",
        "duration": "duration of symptoms: {}",
        "smokingStatus": "smoking status: {}",
        "alcoholConsumption": "alcohol consumption: {}",
        "dietaryHabits": "dietary habits: {}",
        "fluidIntake": "fluid intake: {}",
        "exerciseHabits": "exercise habits: {}",
    }

    additional_info_parts = [
        template.format(additionalInfo[field])
        for field, template in optional_fields.items()
        if additionalInfo.get(field)
    ]

    # Construct query
    query = (
        f"{name} {bold_diagnosis} with a confidence score of {bold_conf}. "
        f"This diagnosis was made at {hospital}."
    )

    if additional_info_parts:
        query += (
            " Additional patient details include: "
            + ", ".join(additional_info_parts)
            + "."
        )

    await session_service.create_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    runner = Runner(
        agent=report_agent, app_name=APP_NAME, session_service=session_service
    )
    content = types.Content(role="user", parts=[types.Part(text=query)])

    # ✅ FIXED: use regular `for` because `runner.run()` is a normal generator
    for _ in runner.run(user_id=USER_ID, session_id=SESSION_ID, new_message=content):
        pass

    session = await session_service.get_session(
        app_name=APP_NAME, user_id=USER_ID, session_id=SESSION_ID
    )

    print("kidney session state:", session.state.get("kidney_report_response"))
    return session.state.get("kidney_report_response", "No response found.")
