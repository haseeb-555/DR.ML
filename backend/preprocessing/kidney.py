
import pandas as pd
import joblib,os
import numpy as np

def predict_kidney_disease(user_input_dict):
    """
    Unified function to preprocess input, load model, and return prediction and confidence.
    Args:
        user_input_dict (dict): Raw user input

    Returns:
        dict: {
            "prediction": "yes" or "no",
            "confidence": float,
            "probabilities": [prob_no, prob_yes]
        }
    """
    # Load all models
    model_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "models", "kidney.joblib"))
    all_models = joblib.load(model_path)
    model = all_models.get("XgBoost")  # You can make this dynamic if needed

    # Convert to DataFrame
    df = pd.DataFrame([user_input_dict])

    # Convert numeric string fields
    numeric_fields = [
        "packed_cell_volume",
        "white_blood_cell_count",
        "red_blood_cell_count"
    ]
    df[numeric_fields] = df[numeric_fields].apply(pd.to_numeric, errors="coerce")

    # Encode categorical fields
    mapping_dict = {
        "red_blood_cells": {"normal": 0, "abnormal": 1},
        "pus_cell": {"normal": 0, "abnormal": 1},
        "pus_cell_clumps": {"notpresent": 0, "present": 1},
        "bacteria": {"notpresent": 0, "present": 1},
        "hypertension": {"no": 0, "yes": 1},
        "diabetes_mellitus": {"no": 0, "yes": 1},
        "coronary_artery_disease": {"no": 0, "yes": 1},
        "appetite": {"poor": 0, "good": 1},
        "peda_edema": {"no": 0, "yes": 1},
        "aanemia": {"no": 0, "yes": 1},
    }

    for col, mapping in mapping_dict.items():
        if col in df.columns:
            df[col] = df[col].map(mapping).fillna(0).astype(int)

    # Predict
    if hasattr(model, "predict_proba"):
        proba = model.predict_proba(df)[0]
        prediction = int(np.argmax(proba))
        confidence = proba[prediction]
    else:
        prediction = model.predict(df)[0]
        proba = [None, None]
        confidence = None

    return {
        "prediction": "yes" if prediction == 1 else "no",
        "confidence": round(confidence, 4) if confidence is not None else None,
        "probabilities": proba
    }

