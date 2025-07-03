import pandas as pd
import numpy as np
import joblib,os

# Load all models from kidney.joblib
model_path = os.path.join(os.path.dirname(__file__), "..", "models", "kidney.joblib")
model_path = os.path.abspath(model_path)  # optional, ensures absolute resolution

all_models = joblib.load(model_path)



def get_model_names():
    return list(all_models.keys())


def load_model():
    return all_models.get("XgBoost")


def preprocess_input(user_input_dict):
    df = pd.DataFrame([user_input_dict])

    # Convert numerical string fields
    num_fields = [
        "packed_cell_volume",
        "white_blood_cell_count",
        "red_blood_cell_count",
    ]
    for field in num_fields:
        df[field] = pd.to_numeric(df[field], errors="coerce")

    # Label encoding for categorical fields
    categorical_cols = [
        "red_blood_cells",
        "pus_cell",
        "pus_cell_clumps",
        "bacteria",
        "hypertension",
        "diabetes_mellitus",
        "coronary_artery_disease",
        "appetite",
        "peda_edema",
        "aanemia",
    ]
    from sklearn.preprocessing import LabelEncoder

    le = LabelEncoder()
    for col in categorical_cols:
        df[col] = le.fit_transform(df[col].astype(str))

    return df
