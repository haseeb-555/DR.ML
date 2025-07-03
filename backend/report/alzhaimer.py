import torch
import torch.nn as nn
from torchvision import models
import cv2
import numpy as np
from pathlib import Path
from dotenv import load_dotenv

from google.adk.runners import Runner
from google.adk.sessions import InMemorySessionService
from google.genai import types
from chat.agents.alzhaimer.agent import report_agent

env_path = Path(__file__).resolve().parents[1] / ".env"
load_dotenv(dotenv_path=env_path)

MODEL_PATH = Path(__file__).resolve().parents[1] / "models" / "dementia_classifier.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
APP_NAME = "alzhaimer_report"
USER_ID = "report_user"
SESSION_ID = "alzhaimer_report_session"

session_service = InMemorySessionService()

label_mapping = {
    0: "Mild Dementia",
    1: "Moderate Dementia",
    2: "No Dementia",
    3: "Very Mild Dementia",
}


def load_model():
    model = models.resnet18(pretrained=False)
    model.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
    model.fc = nn.Linear(model.fc.in_features, 4)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    return model.to(DEVICE)


model = load_model()


def preprocess_image(image_bytes):
    file_bytes = np.asarray(bytearray(image_bytes), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)
    img_resized = cv2.resize(img, (128, 128))
    img_normalized = img_resized.astype(np.float32) / 255.0
    img_tensor = torch.from_numpy(img_normalized).unsqueeze(0).unsqueeze(0)
    return img_tensor.to(DEVICE)


def predict(image_bytes):
    input_tensor = preprocess_image(image_bytes)
    with torch.no_grad():
        output = model(input_tensor)
        _, pred = torch.max(output, 1)
        prob = torch.softmax(output, dim=1).squeeze().cpu().numpy()
    class_id = int(pred.item())
    label = label_mapping[class_id]
    confidence = float(prob[class_id])
    print("label and condidence of alzhaimer:", label, confidence)
    return label, confidence


async def generate_alzhaimer_report(image_file_bytes, patient_data):
    label, confidence = predict(image_file_bytes)

    name = patient_data.get("patient_name", "The patient")
    age = patient_data.get("age", "unknown")
    gender = patient_data.get("gender", "unspecified")
    hospital = patient_data.get("hospital_name", "unknown hospital")

    query = (
        f"The patient **{name}** is diagnosed with **{label}** "
        f"with a confidence score of **{confidence:.2f}**.\n\n"
        f"{name} is a {age}-year-old {gender} patient admitted to {hospital}."
    )

    optional_fields = {
        "family_history": "has a family history of {}",
        "current_medications": "is currently taking the following medications: {}",
        "cognitive_symptoms": "has reported the following cognitive symptoms: {}",
        "smoking_status": "has a smoking status of {}",
        "alcohol_consumption": "consumes alcohol at a {} level",
        "exercise_habits": "has a {} level of physical activity",
        "education_level": "has attained a {} level of education",
        "living_arrangement": "is currently living in a {} arrangement",
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

    print("alzhaimer session state:", session.state.get("alzhaimer_report_response"))
    return session.state.get("alzhaimer_report_response", "No response found.")
