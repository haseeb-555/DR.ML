import streamlit as st
import os
import sys
import matplotlib.pyplot as plt

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.preprocessing.brain import load_model, predict

# Page config
st.set_page_config(page_title="🧠 Brain Tumor Classifier", layout="centered")

st.title("🧠 Brain Tumor MRI Classifier")
st.write("Upload a brain MRI image (150x150 RGB) to predict the tumor type.")

uploaded_file = st.file_uploader("Choose a brain MRI", type=["jpg", "jpeg", "png"])

model_path = "backend/models/brain.h5"
model = load_model(model_path)

if uploaded_file is not None:
    st.image(uploaded_file, caption="Uploaded MRI", use_column_width=True)

    pred_index, pred_class, prob = predict(uploaded_file, model)
    st.markdown(f"### ✅ Prediction: `{pred_class}`")

    st.write("#### 🔍 Confidence scores:")
    labels = ["Glioma Tumor", "No Tumor", "Meningioma Tumor", "Pituitary Tumor"]
    fig, ax = plt.subplots()
    bars = ax.bar(labels, prob, color="lightblue")
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
