import torch
import torch.nn as nn
from torchvision import models
import cv2
import numpy as np

# Label mapping
label_mapping = {
    0: "Mild_Demented",
    1: "Moderate_Demented",
    2: "Non_Demented",
    3: "Very_Mild_Demented",
}


def load_model(model_path, device):
    model = models.resnet18(pretrained=False)
    model.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
    model.fc = nn.Linear(model.fc.in_features, 4)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    return model.to(device)


def preprocess_image(image_bytes):
    file_bytes = np.asarray(bytearray(image_bytes), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)
    img_resized = cv2.resize(img, (128, 128))
    img_normalized = img_resized.astype(np.float32) / 255.0
    img_tensor = (
        torch.tensor(img_normalized).unsqueeze(0).unsqueeze(0)
    )  # Shape: (1, 1, 128, 128)
    return img_tensor


def predict(image_bytes, model, device):
    input_tensor = preprocess_image(image_bytes).to(device)
    with torch.no_grad():
        output = model(input_tensor)
        _, pred = torch.max(output, 1)
        prob = torch.softmax(output, dim=1).squeeze().cpu().numpy()
    return int(pred.item()), label_mapping[int(pred.item())], prob
