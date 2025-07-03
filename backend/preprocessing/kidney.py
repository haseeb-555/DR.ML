import pandas as pd
import joblib
import numpy as np

# Load all trained models
all_models = joblib.load("backend/models/kidney.joblib")


# def get_model_names():
#     """Return a list of available model names."""
#     return list(all_models.keys())


def load_model():
    """Load model by its name from the joblib file."""
    return all_models.get("XgBoost")


def preprocess_input(user_input_dict):
    """Preprocess input dictionary into model-ready DataFrame."""
    df = pd.DataFrame([user_input_dict])

    # Convert numeric string fields
    numeric_fields = [
        "packed_cell_volume",
        "white_blood_cell_count",
        "red_blood_cell_count",
    ]
    df[numeric_fields] = df[numeric_fields].apply(pd.to_numeric, errors="coerce")

    # Fixed encoding for categorical fields (to avoid LabelEncoder issues)
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
        df[col] = df[col].map(mapping).fillna(0).astype(int)

    return df
