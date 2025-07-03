import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from datetime import datetime

from backend.preprocessing.kidney import (
    preprocess_input,
    get_model_names,
    load_model,
)

# Page configuration
st.set_page_config(page_title="Kidney Disease Predictor", layout="centered")
st.title("🧪 Kidney Disease Prediction App")
st.markdown("Fill out the patient's details and lab report to get a prediction.")

# Form UI
with st.form("kidney_form"):
    name = st.text_input("Patient Name")
    hospital = st.text_input("Hospital Name")
    model_name = st.selectbox("Choose Prediction Model", get_model_names())
    print("names:", get_model_names())

    age = st.number_input("Age", 0, 120)
    blood_pressure = st.number_input("Blood Pressure (mmHg)", 0, 200)
    specific_gravity = st.selectbox(
        "Specific Gravity", [1.005, 1.010, 1.015, 1.020, 1.025]
    )
    albumin = st.slider("Albumin", 0, 5)
    sugar = st.slider("Sugar", 0, 5)

    red_blood_cells = st.selectbox("Red Blood Cells", ["normal", "abnormal"])
    pus_cell = st.selectbox("Pus Cell", ["normal", "abnormal"])
    pus_cell_clumps = st.selectbox("Pus Cell Clumps", ["present", "notpresent"])
    bacteria = st.selectbox("Bacteria", ["present", "notpresent"])

    blood_glucose_random = st.number_input("Random Blood Glucose (mg/dL)", 0, 500)
    blood_urea = st.number_input("Blood Urea (mg/dL)", 0, 400)
    serum_creatinine = st.number_input("Serum Creatinine (mg/dL)", 0.0, 50.0)
    sodium = st.number_input("Sodium (mEq/L)", 0.0, 200.0)
    potassium = st.number_input("Potassium (mEq/L)", 0.0, 15.0)
    haemoglobin = st.number_input("Hemoglobin (g/dL)", 0.0, 20.0)
    packed_cell_volume = st.text_input("Packed Cell Volume")
    white_blood_cell_count = st.text_input("WBC Count")
    red_blood_cell_count = st.text_input("RBC Count")

    hypertension = st.selectbox("Hypertension", ["yes", "no"])
    diabetes_mellitus = st.selectbox("Diabetes Mellitus", ["yes", "no"])
    coronary_artery_disease = st.selectbox("Coronary Artery Disease", ["yes", "no"])
    appetite = st.selectbox("Appetite", ["good", "poor"])
    peda_edema = st.selectbox("Pedal Edema", ["yes", "no"])
    aanemia = st.selectbox("Anemia", ["yes", "no"])

    submitted = st.form_submit_button("Submit & Predict")

# Handle prediction logic
if submitted:
    # Collect and preprocess input
    user_input = {
        "age": age,
        "blood_pressure": blood_pressure,
        "specific_gravity": specific_gravity,
        "albumin": albumin,
        "sugar": sugar,
        "red_blood_cells": red_blood_cells,
        "pus_cell": pus_cell,
        "pus_cell_clumps": pus_cell_clumps,
        "bacteria": bacteria,
        "blood_glucose_random": blood_glucose_random,
        "blood_urea": blood_urea,
        "serum_creatinine": serum_creatinine,
        "sodium": sodium,
        "potassium": potassium,
        "haemoglobin": haemoglobin,
        "packed_cell_volume": packed_cell_volume,
        "white_blood_cell_count": white_blood_cell_count,
        "red_blood_cell_count": red_blood_cell_count,
        "hypertension": hypertension,
        "diabetes_mellitus": diabetes_mellitus,
        "coronary_artery_disease": coronary_artery_disease,
        "appetite": appetite,
        "peda_edema": peda_edema,
        "aanemia": aanemia,
    }

    X_input = preprocess_input(user_input)
    model = load_model()
    # Predict and get probabilities if available
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(X_input)[0]
        prediction = int(np.argmax(proba))
        confidence = proba[prediction]
    else:
        prediction = model.predict(X_input)[0]
        proba = None
        confidence = None

    # Final result
    result = (
        "❗ Chronic Kidney Disease Detected"
        if prediction == 0
        else "✅ No Chronic Kidney Disease Detected"
    )
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Display
    st.success(f"Prediction for **{name}** at **{hospital}** on `{timestamp}`")
    st.markdown(f"### Result using **{model_name}**:\n{result}")

    if confidence is not None:
        st.markdown(f"#### 🔎 Confidence Score: `{confidence:.2f}`")

    if proba is not None:
        st.write("### 📊 Probability Distribution:")
        fig, ax = plt.subplots()
        ax.bar(["CKD", "Not CKD"], proba, color=["crimson", "green"])
        ax.set_ylim(0, 1)
        for i, score in enumerate(proba):
            ax.text(i, score + 0.02, f"{score:.2f}", ha="center", fontsize=10)
        st.pyplot(fig)
