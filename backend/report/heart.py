import joblib
import pandas as pd
from pathlib import Path

from chat.agents.heart.agent import report_agent
from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types

# Constants
MODEL_PATH = Path("backend/models/best_svm_model.pkl")
FEATURES_PATH = Path("backend/models/svm_model_features.pkl")
APP_NAME = "heart_report"
USER_ID = "report_user"
SESSION_ID = "heart_report_session"

session_service = InMemorySessionService()


def load_model():
    return joblib.load(MODEL_PATH)


def get_model_features():
    return joblib.load(FEATURES_PATH)


def prepare_input(user_input: dict):
    input_df = pd.DataFrame([user_input])
    input_df = pd.get_dummies(
        input_df, columns=["cp", "restecg", "thal"], drop_first=True
    )

    model_columns = get_model_features()
    for col in model_columns:
        if col not in input_df.columns:
            input_df[col] = 0

    return input_df[model_columns]


async def generate_heart_report(formData: dict, additionalInfo: dict):
    model = load_model()
    input_df = prepare_input(formData)

    prediction = model.predict(input_df)[0]
    confidence = max(model.predict_proba(input_df)[0])

    has_disease = prediction == 1
    diagnosis = "has heart disease" if has_disease else "does not have heart disease"
    bold_diagnosis = f"**{diagnosis}**"
    bold_conf = f"**{confidence:.2f}**"

    name = additionalInfo.get("patientName", "The patient")
    hospital = additionalInfo.get("hospitalName", "N/A")

    optional_fields = {
        "familyHistory": "has a family history of heart disease: {}",
        "smokingStatus": "smoking status: {}",
        "alcoholConsumption": "alcohol consumption: {}",
        "exerciseHabits": "exercise habits: {}",
        "dietaryHabits": "diet: {}",
        "stressLevels": "stress levels: {}",
        "sleepQuality": "sleep quality: {}",
        "currentMedications": "current medications: {}",
        "symptoms": "reported symptoms: {}",
        "occupationalHazards": "occupational hazards: {}",
    }

    additional_info_text = [
        template.format(additionalInfo[field])
        for field, template in optional_fields.items()
        if additionalInfo.get(field)
    ]

    query = (
        f"{name} {bold_diagnosis} with a confidence score of {bold_conf}. "
        f"This diagnosis was made at {hospital}."
    )

    if additional_info_text:
        query += (
            " Additional patient information includes: "
            + ", ".join(additional_info_text)
            + "."
        )

    # Create session
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

    print("heart session state:", session.state.get("heart_report_response"))
    return session.state.get("heart_report_response", "No response found.")
