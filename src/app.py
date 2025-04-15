import pandas as pd
import numpy as np
import lightgbm as lgb
import pickle
from flask import Flask, render_template, request, jsonify

from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score
from sklearn.preprocessing import StandardScaler

app = Flask(__name__, template_folder='templates', static_folder='static')

model = lgb.Booster(model_file="models/lightgbm_model.lgb")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data
        data = request.get_json()

        # Extract and convert all values to float
        input_data = [float(data.get(f)) for f in [
            'HighBP', 'HighChol', 'CholCheck', 'Smoker', 'Stroke',
            'HeartDiseaseorAttack', 'PhysActivity', 'Fruits', 'Veggies',
            'HvyAlcoholConsump', 'AnyHealthcare', 'NoDocbcCost', 'DiffWalk', 'Sex',
            'BMI', 'GenHlth', 'Age', 'Education', 'Income',
            'MentHlth_Bin', 'PhysHlth_Bin'
        ]]

        # Reshape into 2D array
        input_np = np.array([input_data])

        # Predict
        prob = model.predict(input_np)[0]
        result = int(prob >= 0.8)

        return jsonify({
            'diabetes_risk': result,
            'probability': round(prob, 4)
        })

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)