import pandas as pd

import seaborn as sns
import matplotlib.pyplot as plt

from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

data1 = pd.read_csv("C:\\Users\\91797\\OneDrive\\Desktop\\codeWithAbhi\\Health Care Website\\prediction\health_data_final.csv")

data1.head()

# print(data1.dtypes)

def preprocess_input(input_data):
    
    # Splitting the 'Blood Pressure (mmHg)' column into 'Systolic_BP' and 'Diastolic_BP'
    input_data[['Systolic_BP', 'Diastolic_BP']] = input_data['bloodPressure'].str.split('/', expand=True)
    input_data.drop('bloodPressure', axis=1, inplace=True)
    
    # Fit and transform categorical data to numerical labels
    label_encoder_ecg = LabelEncoder()
    input_data['ecgInformation'] = label_encoder_ecg.fit_transform(input_data['ecgInformation'])

    # Ensure 'Diastolic_BP' and 'Disease' columns are present
    if 'Diastolic_BP' not in input_data.columns:
        input_data['Diastolic_BP'] = None  # You might replace None with appropriate default value
    
#     if 'Disease' not in input_data.columns:
#         input_data['Disease'] = None  # You might replace None with appropriate default value
        
    return input_data

data1 = preprocess_input(data1)

# sns.countplot(data1["Disease"], palette="Set1")
# plt.title("Disease", fontsize=10)
# plt.show()

# data1["Disease"].value_counts().plot(kind="pie", autopct="%2f")

label_encoder = LabelEncoder()
data1['Disease'] = label_encoder.fit_transform(data1['Disease'])

# Separate features and target
X = data1.drop('Disease', axis=1)
y = data1['Disease']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a RandomForestClassifier
# Algo model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Function to make predictions based on input data
def predict_disease(input_data,clf):
    # Make predictions using the loaded model
    predictions = clf.predict(input_data)
    
    if predictions[0] == 1:
        print('Healthy')
    elif predictions[0] == 2:
        print('Hypertension')
    else:
        print('Cardiovascular Disease')
    
    # Return predictions
    return predictions

#input_data_processed = preprocess_input(input_data)

# Make predictions
new_data = pd.DataFrame({
    'walkingData': [6000],
    'heartRate': [80],
    'respiratoryRate': [16],
    'bloodPressure': ['120/80'],
    'calories': [320],
    'sleepQuality': [6],
    'temperature': [37],
    'ecgInformation': [1]
}, columns=X.columns)


# predictions = predict_disease(new_data, clf)
# Print or return predictions (this will be captured by Node.js)
# print(predictions)

# # Evaluate the model
# print("Classification Report:")
# print(classification_report(y_test, y_pred))




import pymongo

# Establish a connection to the MongoDB database
client = pymongo.MongoClient("mongodb://127.0.0.1:27017")
db = client["HealthCare"]
collection = db["patientdatas"]

# Query the database
query = {}
result = collection.find_one(query)

# Map MongoDB field names to frontend input fields
field_mapping = {
    "walkingData": "walkingData",
    "heartRate": "heartRate",
    "respiratoryRate": "respiratoryRate",
    "bloodPressure": "bloodPressure",
    "calories": "calories",
    "sleepQuality": "sleepQuality",
    "temperature": "temperature",
    "ecgInformation": "ecgInformation"
}

# Rename fields according to the frontend input fields
new_data = {}
for mongo_field, frontend_field in field_mapping.items():
    new_data[frontend_field] = result.get(mongo_field)

# Convert to DataFrame
new_data_df = pd.DataFrame(new_data, index=[0])
new_data_df = preprocess_input(new_data_df)

# Make predictions
predictions = predict_disease(new_data_df, clf)
# print(predictions)