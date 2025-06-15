import streamlit as st
import torch

import sys
import os

# Add the project root to Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import matplotlib.pyplot as plt
import numpy as np
from backend.preprocessing.alzhaimer import load_model, predict


st.set_page_config(page_title="Dementia MRI Classifier", layout="centered")
st.title("🧠 Dementia MRI Classifier")
st.write("Upload a grayscale `.jpg` brain MRI (128x128) to predict the dementia stage.")

uploaded_file = st.file_uploader("Choose an MRI image", type=["jpg", "jpeg", "png"])


device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_path = "backend/models/dementia_classifier.pth"
model = load_model(model_path, device)

if uploaded_file is not None:
    st.image(uploaded_file, caption="Uploaded MRI", use_column_width=True)

    pred_label, pred_class, prob = predict(uploaded_file.read(), model, device)
    st.markdown(f"### ✅ Prediction: `{pred_class}`")

    st.write("#### 🔍 Confidence scores:")
    labels = ["Mild", "Moderate", "Non", "Very Mild"]
    fig, ax = plt.subplots()
    bars = ax.bar(labels, prob, color="skyblue")
    ax.set_ylim([0, 1])
    for bar, p in zip(bars, prob):
        ax.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height(),
            f"{p:.2f}",
            ha="center",
            va="bottom",
        )
    st.pyplot(fig)
