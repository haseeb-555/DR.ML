# 🧠 Alzheimer MRI Disease Classification

This module uses the `Falah/Alzheimer_MRI` dataset for classifying brain MRI images into 4 stages of Alzheimer’s disease:

- `0`: Mild_Demented
- `1`: Moderate_Demented
- `2`: Non_Demented
- `3`: Very_Mild_Demented

This is a submodule of the `DR.ML` project which aims to provide an AI-powered diagnostic system for various diseases using FastAPI.

---

## 📦 Dataset Information

- **Hugging Face Dataset:** [Falah/Alzheimer_MRI](https://huggingface.co/datasets/Falah/Alzheimer_MRI)
- **Total Size:** 28 MB
- **Train Samples:** 5,120
- **Test Samples:** 1,280

---

## 🔍 Use Case

This module helps in early diagnosis of Alzheimer’s stages via image classification of MRI scans. Ideal for healthcare screening tools and research.

---

## 🧪 Labels

| Label | Class Name         |
| ----- | ------------------ |
| 0     | Mild_Demented      |
| 1     | Moderate_Demented  |
| 2     | Non_Demented       |
| 3     | Very_Mild_Demented |

---

## 🔗 Google Colab Notebook

Training and evaluation were performed using the following Colab notebook:  
👉 [Colab Link](https://colab.research.google.com/drive/1PYAjEWZCdzN1Uk5WIB2HnlMbvjkj6PJl?authuser=2#scrollTo=3fea170b)

---

## 📥 Loading the Dataset (Hugging Face)

```python
from datasets import load_dataset

dataset = load_dataset('Falah/Alzheimer_MRI', split='train')
print("Number of examples:", len(dataset))

# View first few samples
for example in dataset[:5]:
    print(example)
```
