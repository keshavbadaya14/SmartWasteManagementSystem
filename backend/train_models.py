import pandas as pd
import numpy as np
import joblib
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Input, Dropout, BatchNormalization
from tensorflow.keras.regularizers import l2
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report

# Load dataset
df = pd.read_csv('data/waste_data.csv')

# Combine item_name and description into single text input
df['text'] = df['item_name'].fillna('') + ' ' + df['description'].fillna('')
df['text'] = df['text'].str.strip()

# Show initial class distribution
print("✅ Class Distribution:")
print(df['category'].value_counts())

# Encode category labels
label_encoder = LabelEncoder()
df['category_encoded'] = label_encoder.fit_transform(df['category'])
joblib.dump(label_encoder, 'label_encoder.joblib')
print("✅ Label Encoder Classes:", label_encoder.classes_)

# TF-IDF Vectorization
vectorizer = TfidfVectorizer(max_features=500, ngram_range=(1, 2), stop_words='english')
X = vectorizer.fit_transform(df['text']).toarray()
y = df['category_encoded']
joblib.dump(vectorizer, 'tfidf_vectorizer.joblib')

# Split into train, validation, and test sets
X_temp, X_test, y_temp, y_test = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
X_train, X_val, y_train, y_val = train_test_split(X_temp, y_temp, test_size=0.25, stratify=y_temp, random_state=42)

print(f"✅ Dataset Sizes:\nTrain: {len(X_train)}, Validation: {len(X_val)}, Test: {len(X_test)}")

# Train Logistic Regression with GridSearchCV
print("\n🔧 Training Logistic Regression...")
param_grid = {'C': [0.01, 0.1, 1, 10, 100]}
grid = GridSearchCV(LogisticRegression(max_iter=2000), param_grid, cv=5, scoring='accuracy')
grid.fit(X_train, y_train)
logreg = grid.best_estimator_
joblib.dump(logreg, 'logreg_model.joblib')

print("✅ LogReg Best Params:", grid.best_params_)
print("✅ Validation Accuracy:", logreg.score(X_val, y_val))
print("✅ Test Accuracy:", logreg.score(X_test, y_test))
print("\n📊 Classification Report (LogReg):")
print(classification_report(y_test, logreg.predict(X_test), target_names=label_encoder.classes_))

# Train Neural Network
print("\n🧠 Training Neural Network...")
model = Sequential([
    Input(shape=(X_train.shape[1],)),
    Dense(128, activation='relu', kernel_regularizer=l2(0.01)),
    BatchNormalization(),
    Dropout(0.4),
    Dense(64, activation='relu', kernel_regularizer=l2(0.01)),
    BatchNormalization(),
    Dropout(0.4),
    Dense(32, activation='relu', kernel_regularizer=l2(0.01)),
    BatchNormalization(),
    Dropout(0.4),
    Dense(len(label_encoder.classes_), activation='softmax')
])
model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])
early_stop = EarlyStopping(patience=10, restore_best_weights=True)

model.fit(X_train, y_train, validation_data=(X_val, y_val),
          epochs=100, batch_size=16, callbacks=[early_stop], verbose=1)

model.save('nn_model.keras')

print("✅ Neural Network Test Accuracy:", model.evaluate(X_test, y_test)[1])
print("\n📊 Classification Report (NN):")
print(classification_report(y_test, np.argmax(model.predict(X_test, verbose=0), axis=1), target_names=label_encoder.classes_))

# Test on sample inputs
print("\n🧪 Sample Predictions:")
test_texts = [
    "rodenticide packet for rat poison",
    "syringe used medical needle",
    "battery used",
    "fluorescent bulb with mercury",
    "paper towel soiled with food grease",
    "banana peel from kitchen",
    "aluminum foil clean and dry",
    "nail polish remover bottle",
    "magazine with glossy pages",
    "apple core",
    "paint thinner container"
]

for text in test_texts:
    vec = vectorizer.transform([text]).toarray()
    logreg_pred = label_encoder.inverse_transform(logreg.predict(vec))[0]
    nn_pred = label_encoder.inverse_transform(np.argmax(model.predict(vec, verbose=0), axis=1))[0]
    print(f"\n📝 Text: {text}")
    print(f"🔍 LogReg: {logreg_pred}")
    print(f"🧠 Neural Net: {nn_pred}")
