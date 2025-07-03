import numpy as np
import cv2
from PIL import Image
import os
from tensorflow.keras.models import load_model as keras_load_model

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from chat.agents.brain.agent import report_agent

# Constants
APP_NAME = "brain_report"
USER_ID = "report_user"
SESSION_ID = "brain_report_session"
session_service = InMemorySessionService()

# Label mapping
label_mapping = {
    0: "Glioma Tumor",
    1: "No Tumor",
    2: "Meningioma Tumor",
    3: "Pituitary Tumor",
}


def load_model():
    model_path = os.path.join(os.path.dirname(__file__), "..", "models", "brain.h5")
    return keras_load_model(os.path.abspath(model_path))


def preprocess_image(uploaded_file):
    image = Image.open(uploaded_file).convert("RGB")
    img_array = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    resized = cv2.resize(img_array, (150, 150))
    normalized = resized / 255.0
    return np.expand_dims(normalized, axis=0)


def predict(uploaded_file, model):
    img_tensor = preprocess_image(uploaded_file)
    probs = model.predict(img_tensor)[0]
    pred_index = int(np.argmax(probs))
    pred_label = label_mapping[pred_index]
    return pred_label, float(probs[pred_index])


async def generate_brain_report(image_file, patient_data):
    model = load_model()
    label, confidence = predict(image_file, model)

    name = patient_data.get("patientName", "The patient")
    age = patient_data.get("age", "unknown")
    gender = patient_data.get("gender", "unknown")
    hospital = patient_data.get("hospitalName", "unknown hospital")

    query = (
        f"**{name}** is diagnosed with **{label}** with a confidence score of **{confidence:.2f}**.\n"
        f"{name} is a {age}-year-old {gender} visiting {hospital}."
    )

    optional_fields = {
        "familyHistoryBrainTumor": "has a family history of brain tumor: {}",
        "currentMedications": "is currently taking medications: {}",
        "neurologicalSymptoms": "has neurological symptoms: {}",
        "smokingStatus": "has a smoking status of {}",
        "alcoholConsumption": "consumes alcohol: {}",
        "occupationalExposure": "has occupational exposure: {}",
        "previousCancerHistory": "has previous cancer history: {}",
        "radiationExposure": "was exposed to radiation: {}",
    }

    details = [
        template.format(patient_data[field])
        for field, template in optional_fields.items()
        if patient_data.get(field)
    ]

    if details:
        query += " Additionally, " + ", ".join(details) + "."

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

    print("brain session state:", session.state.get("brain_report_response"))
    return session.state.get("brain_report_response", "No response found.")
