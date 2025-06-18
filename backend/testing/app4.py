# root/backend/testing/app4.py
import sys
import os
import streamlit as st
from datetime import datetime

# Add root (DR.ML) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.preprocessing.heart import load_model, prepare_input

st.title("❤️ Heart Disease Predictor")

# Meta input
st.subheader("Patient Meta Information")
name = st.text_input("Patient Name")
hospital = st.text_input("Hospital")
date = st.date_input("Date", value=datetime.today())

# Medical inputs
st.subheader("Medical Inputs")

user_input = {
    "age": st.number_input("Age", min_value=1),
    "sex": st.selectbox("Sex", [0, 1]),
    "cp": st.selectbox("Chest Pain Type (cp)", [0, 1, 2, 3]),
    "trestbps": st.number_input("Resting Blood Pressure", min_value=0),
    "chol": st.number_input("Serum Cholesterol", min_value=0),
    "fbs": st.selectbox("Fasting Blood Sugar > 120 mg/dl", [0, 1]),
    "restecg": st.selectbox("Resting ECG Results", [0, 1, 2]),
    "thalach": st.number_input("Maximum Heart Rate", min_value=0),
    "exang": st.selectbox("Exercise Induced Angina", [0, 1]),
    "oldpeak": st.number_input("Oldpeak (ST Depression)", format="%.2f"),
    "slope": st.selectbox("Slope of ST Segment", [0, 1, 2]),
    "ca": st.selectbox("Number of Major Vessels (0-3)", [0, 1, 2, 3, 4]),
    "thal": st.selectbox("Thalassemia", [0, 1, 2, 3]),
}

# Predict button
if st.button("Predict"):
    model = load_model()
    input_df = prepare_input(user_input)
    prediction = model.predict(input_df)[0]
    proba = model.predict_proba(input_df)[0][1]

    st.subheader("Prediction Result")
    st.write(f"👤 Patient: **{name}**")
    st.write(f"🏥 Hospital: **{hospital}**")
    st.write(f"🗓️ Date: **{date.strftime('%d-%m-%Y')}**")
    st.write(
        "📊 Result: ",
        "🚨 **Heart Disease**" if prediction == 1 else "✅ **No Heart Disease**",
    )
    st.write(f"🔍 Confidence: **{proba * 100:.2f}%**")
