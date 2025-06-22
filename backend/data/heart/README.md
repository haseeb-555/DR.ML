Here is your tailored `README.md` for the **Heart Disease Prediction** test module using **Streamlit**, following the same format:

---

### ✅ `README.md` (for Heart Streamlit Testing Module)

````markdown
# ❤️ Heart Disease Predictor – Streamlit Test Module

This is a **Streamlit-based testing module** for the **Heart Disease Prediction** component of a larger disease diagnosis platform (FastAPI-based).  
It allows users to enter common medical indicators and receive a heart disease risk prediction using a trained **SVM model** (`best_svm_model.pkl`).

---

## 📁 Project Context

This module is part of a broader medical ML system (`DR.ML`) that supports:

- 🧠 Brain Tumor (MRI-based)
- 🧴 Skin Disease
- 🧬 Dementia
- 🔬 Kidney Disease
- ❤️ Heart Disease (👈 current module)

Each module lives in `backend/preprocessing/` and is used inside the main **FastAPI project**.

---

## 🚀 How to Run the Streamlit Test App

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/dr.ml.git
cd dr.ml
```
````

2. **Create and activate a virtual environment:**

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
```

3. **Install dependencies:**

```bash
pip install -r requirements.txt
```

4. **Run the test app:**

```bash
streamlit run backend/testing/app4.py
```

---

## 📊 Prediction Details

- ✅ Uses model at `backend/models/best_svm_model.pkl`
- ✅ Features ordered as per `svm_model_features.pkl`
- ✅ Preprocessing logic handled in `backend/preprocessing/heart.py`

---

## 📓 Dataset Features

The dataset contains **numerical and categorical medical attributes** used to detect heart disease:

| Feature    | Description                                          |
| ---------- | ---------------------------------------------------- |
| `age`      | Age of patient (years)                               |
| `sex`      | Gender (0 = male, 1 = female)                        |
| `cp`       | Chest pain type (0-3)                                |
| `trestbps` | Resting blood pressure (mm Hg)                       |
| `chol`     | Serum cholesterol (mg/dl)                            |
| `fbs`      | Fasting blood sugar >120 mg/dl (1 = true, 0 = false) |
| `restecg`  | Resting ECG result (0-2)                             |
| `thalach`  | Maximum heart rate achieved                          |
| `exang`    | Exercise-induced angina (1 = yes, 0 = no)            |
| `oldpeak`  | ST depression induced by exercise                    |
| `slope`    | Slope of peak exercise ST segment (0-2)              |
| `ca`       | Number of major vessels (0–4)                        |
| `thal`     | Thallium stress test result (0–3)                    |
| `target`   | Heart disease status (1 = disease, 0 = no disease)   |

> During training, categorical features were one-hot encoded
> Final model used feature selection and tuning via `GridSearchCV`

---

## 🧠 Model Used

| Model                     | Type                | Score           |
| ------------------------- | ------------------- | --------------- |
| ✅ Support Vector Machine | SVM with GridSearch | Based on recall |

Saved to:

- `backend/models/best_svm_model.pkl`
- `backend/models/svm_model_features.pkl`

---

## 📓 Training Reference

📔 [Colab Notebook – Heart Disease Model Training](https://colab.research.google.com/drive/1-1Zoz_4wbAdTe6HJWM8kJVDVx6EaFy5f?authuser=2)

---

## 🛠 Developer Notes

⚠️ This Streamlit UI is **not the final frontend**.
It is used for **testing only**.

The final app:

- Will use **FastAPI**
- Provide endpoints for model inference
- Integrate multiple diseases

---

## 📁 Folder Structure (for Test Module)

```
DR.ML/
├── backend/
│   ├── models/                       # SVM model + features
│   │   ├── best_svm_model.pkl
│   │   └── svm_model_features.pkl
│   ├── preprocessing/
│   │   └── heart.py                 # load_model, prepare_input
│   └── testing/
│       └── app4.py                  # Streamlit UI app
├── requirements.txt
└── README.md (this file)
```

---

## 📌 Requirements

- Python 3.8+
- scikit-learn
- pandas
- streamlit
- joblib

Install with:

```bash
pip install -r requirements.txt
```

---

## 🧩 License

This is part of a student academic project.
Open for educational and research use only.

```

```
