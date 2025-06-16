import numpy as np
import cv2
from tensorflow.keras.models import load_model as keras_load_model
from PIL import Image
import io

# Label mapping
label_mapping = {
    0: "Glioma Tumor",
    1: "No Tumor",
    2: "Meningioma Tumor",
    3: "Pituitary Tumor",
}


# Load model from .h5 file
def load_model(model_path):
    return keras_load_model(model_path)


# Preprocess image for prediction
def preprocess_image(uploaded_file):
    image = Image.open(uploaded_file).convert("RGB")
    img_array = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    resized = cv2.resize(img_array, (150, 150))
    normalized = resized / 255.0
    return np.expand_dims(normalized, axis=0)  # Shape: (1, 150, 150, 3)


# Predict using the model
def predict(uploaded_file, model):
    img_tensor = preprocess_image(uploaded_file)
    probs = model.predict(img_tensor)[0]
    pred_index = np.argmax(probs)
    pred_label = label_mapping[pred_index]
    return pred_index, pred_label, probs.tolist()
