import pandas as pd
import joblib


def load_model():
    return joblib.load("backend/models/best_svm_model.pkl")


def get_model_features():
    return joblib.load("backend/models/svm_model_features.pkl")


def prepare_input(user_input: dict):
    """
    Converts user input into the same feature format used in training.
    Handles one-hot encoding and reorders columns.
    """
    # Step 1: Create DataFrame
    input_df = pd.DataFrame([user_input])

    # Step 2: One-hot encode like training
    input_df = pd.get_dummies(
        input_df, columns=["cp", "restecg", "thal"], drop_first=True
    )

    # Step 3: Ensure all expected columns exist
    model_columns = get_model_features()
    for col in model_columns:
        if col not in input_df.columns:
            input_df[col] = 0  # add missing column with 0

    # Step 4: Reorder columns to match training
    input_df = input_df[model_columns]

    return input_df
