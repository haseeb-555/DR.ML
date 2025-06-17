import numpy as np
import cv2
from tensorflow.keras.models import load_model as keras_load_model
from PIL import Image

# ✅ Class names
class_names = [
    "Acne and Rosacea Photos",
    "Actinic Keratosis Basal Cell Carcinoma and other Malignant Lesions",
    "Atopic Dermatitis Photos",
    "Cellulitis Impetigo and other Bacterial Infections",
    "Eczema Photos",
    "Exanthems and Drug Eruptions",
    "Herpes HPV and other STDs Photos",
    "Light Diseases and Disorders of Pigmentation",
    "Lupus and other Connective Tissue diseases",
    "Melanoma Skin Cancer Nevi and Moles",
    "Poison Ivy Photos and other Contact Dermatitis",
    "Psoriasis pictures Lichen Planus and related diseases",
    "Seborrheic Keratoses and other Benign Tumors",
    "Systemic Disease",
    "Tinea Ringworm Candidiasis and other Fungal Infections",
    "Urticaria Hives",
    "Vascular Tumors",
    "Vasculitis Photos",
    "Warts Molluscum and other Viral Infections",
]


# ✅ Load model
def load_model(model_path):
    return keras_load_model(model_path)


# ✅ Preprocess image
def preprocess_image(uploaded_file):
    image = Image.open(uploaded_file).convert("RGB")
    img_array = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    resized = cv2.resize(img_array, (192, 192))
    normalized = resized / 255.0
    return np.expand_dims(normalized, axis=0)  # Shape: (1, 192, 192, 3)


# ✅ Predict
def predict(uploaded_file, model):
    img_tensor = preprocess_image(uploaded_file)
    probs = model.predict(img_tensor)[0]
    pred_index = int(np.argmax(probs))
    pred_label = class_names[pred_index]
    return pred_index, pred_label, probs.tolist()
