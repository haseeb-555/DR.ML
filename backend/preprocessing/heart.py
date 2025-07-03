import pandas as pd
import joblib,os

def load_model():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    model_path = os.path.join(base_dir, "backend", "models", "best_svm_model.pkl")
    return joblib.load(model_path)


def get_model_features():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    feature_path = os.path.join(base_dir, "backend", "models", "svm_model_features.pkl")
    return joblib.load(feature_path)

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
