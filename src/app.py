import pandas as pd
import numpy as np
import lightgbm as lgb
import pickle

from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.preprocessing import StandardScaler

model = lgb.Booster(model_file="models/lightgbm_model.lgb")

with open("data/processed/standard_scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("data/processed/feature_list.pkl", "rb") as f:
    feature_list = pickle.load(f)

new_data = pd.read_csv("data/raw/new_patients.csv")

X_new = new_data[feature_list]

X_new_scaled = scaler.transform(X_new)

threshold = 0.8
probs = model.predict(X_new_scaled)
preds = (probs >= threshold).astype(int)

new_data["Diabetes_Risk"] = preds
new_data["Diabetes_Probability"] = probs

print(new_data[["Diabetes_Risk", "Diabetes_Probability"]])
new_data.to_csv("new_predictions.csv", index=False)

print("Predictions saved to new_predictions.csv.")