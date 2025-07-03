import numpy as np
import cv2
from tensorflow.keras.models import load_model as keras_load_model
from PIL import Image
import io

# Label mapping from model output index to human-readable class
label_mapping = {
    0: "Glioma Tumor",
    1: "No Tumor",
    2: "Meningioma Tumor",
    3: "Pituitary Tumor",
}

# Load the trained Keras model from .h5 file
def load_model(model_path):
    return keras_load_model(model_path)

# Preprocess the image bytes to match model input requirements
def preprocess_image(uploaded_file_bytes):
    # Wrap raw bytes in BytesIO to simulate a file-like object for PIL
    image = Image.open(io.BytesIO(uploaded_file_bytes)).convert("RGB")
    
    # Convert PIL image to OpenCV format (BGR)
    img_array = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
    
    # Resize image to 150x150 as expected by model
    resized = cv2.resize(img_array, (150, 150))
    
    # Normalize pixel values to [0, 1]
    normalized = resized / 255.0
    
    # Add batch dimension: (1, 150, 150, 3)
    return np.expand_dims(normalized, axis=0)
# Predict tumor type using the model and preprocessed image
def predict(uploaded_file_bytes, model):
    img_tensor = preprocess_image(uploaded_file_bytes)
    
    # Get prediction probabilities
    probs = model.predict(img_tensor)[0]
    
    # Get predicted class index
    pred_index = np.argmax(probs)
    
    # Map index to label
    pred_label = label_mapping[pred_index]
    
    return pred_index, pred_label, probs.tolist()
