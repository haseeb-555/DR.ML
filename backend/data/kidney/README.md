Thanks! Based on your format, here is a clean and **focused `README.md`** specifically for the **Kidney Disease Streamlit Testing Module**, while clearly noting that the main app is FastAPI-based.

---

### ✅ `README.md` (for Kidney Streamlit Testing Module)

````markdown
# 🧪 Kidney Disease Classifier – Streamlit Test Module

This is a **Streamlit-based testing module** for the **Kidney Disease Prediction** component of a larger disease diagnosis platform (which is being developed using **FastAPI**).  
It lets you enter clinical features and predict CKD using trained ML models like XGBoost, AdaBoost, and Random Forest.

---

## 📁 Project Context

This module is part of a broader medical ML system (`DR.ML`) with support for:

- 🧠 Brain Tumor (MRI-based)
- ❤️ Heart Disease
- 🧴 Skin Disease
- 🧬 Dementia
- 🔬 Kidney Disease (👈 current module)

Each module is located under `backend/preprocessing/` and integrated in the main **FastAPI app**.

---

## 🚀 How to Run the Streamlit Test App

1. **Clone the repository:**

```bash
git clone https://github.com/your-username/dr.ml.git
cd dr.ml
```
````

2. **Create & activate a virtual environment:**

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
streamlit run backend/testing/app3.py
```

---

## 📊 Prediction Details

- ✅ Uses models saved at `backend/models/kidney.joblib`
- ✅ Accepts 24 medical parameters related to CKD
- ✅ Displays prediction result and confidence

---

## 📓 Data Info

Dataset includes **400 patients** and **25 features**:

| Column                  | Description            |
| ----------------------- | ---------------------- |
| age                     | Age of patient         |
| blood_pressure          | BP in mm Hg            |
| specific_gravity        | Urine specific gravity |
| albumin                 | Protein in urine       |
| sugar                   | Urine sugar level      |
| red_blood_cells         | Normal / Abnormal      |
| pus_cell                | Normal / Abnormal      |
| pus_cell_clumps         | Present / Not present  |
| bacteria                | Present / Not present  |
| blood_glucose_random    | Random glucose level   |
| blood_urea              | Urea level             |
| serum_creatinine        | Creatinine level       |
| sodium                  | Sodium level           |
| potassium               | Potassium level        |
| haemoglobin             | Hemoglobin level       |
| packed_cell_volume      | Volume %               |
| white_blood_cell_count  | Count                  |
| red_blood_cell_count    | Count                  |
| hypertension            | Yes / No               |
| diabetes_mellitus       | Yes / No               |
| coronary_artery_disease | Yes / No               |
| appetite                | Good / Poor            |
| peda_edema              | Yes / No               |
| aanemia                 | Yes / No               |
| class                   | Target (CKD / not CKD) |

---

## 🧠 Models Used

Top 3 performing models (saved as `kidney.joblib`):

| Model                  | Accuracy |
| ---------------------- | -------- |
| ✅ XGBoost             | 1.00     |
| ✅ AdaBoost Classifier | 0.983    |
| ✅ Random Forest       | 0.983    |

---

## 🧾 References

📔 [Google Colab Notebook – Kidney Model Training](https://colab.research.google.com/drive/1vtNHjWXEUKP2rHFa-xQJbBcLBxPjZC5N?authuser=2)

---

## 🛠 Developer Notes

⚠️ This Streamlit module is **not the production frontend**.

- Final app will use **FastAPI**
- All modules will be exposed via **REST API endpoints**
- Frontend will interact via fetch/axios calls

---

## 📁 Test Folder Structure

```
DR.ML/
├── backend/
│   ├── models/                    # kidney.joblib
│   ├── preprocessing/
│   │   └── kidney.py              # input preprocessing logic
│   └── testing/
│       └── app3.py                # Streamlit UI test app
├── requirements.txt
└── README.md                      # this file
```

---

## 📌 Requirements

- Python 3.8+
- streamlit
- scikit-learn
- xgboost
- pandas
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
