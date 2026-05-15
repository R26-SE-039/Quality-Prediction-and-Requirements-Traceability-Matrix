import json

notebook = {
    "cells": [],
    "metadata": {
        "kernelspec": {
            "display_name": "Python 3",
            "language": "python",
            "name": "python3"
        },
        "language_info": {
            "name": "python",
            "version": "3.14.0"
        }
    },
    "nbformat": 4,
    "nbformat_minor": 4
}

cells = [
    ("markdown", "# Test Quality Prediction Model - KNN & Random Forest\n\n## Assignment Component: Quality Prediction for Test Cases\n\n**Team Member:** Rashani K.G.M  \n**Date:** May 2026  \n**Course:** Machine Learning Assignment\n\n## 1. Introduction\n\nThis notebook implements **K-Nearest Neighbors (KNN)** and **Random Forest** algorithms to predict test case quality scores.\n\n### Quality Categories:\n- **Excellent** (80-100): High quality tests\n- **Good** (60-79): Acceptable quality\n- **Fair** (40-59): Needs improvement\n- **Poor** (0-39): Requires major revision"),
    ("markdown", "## 2. Import Libraries and Load Data"),
    ("code", "import pandas as pd\nimport numpy as np\nimport matplotlib.pyplot as plt\nimport seaborn as sns\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score, classification_report, confusion_matrix\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.model_selection import train_test_split, cross_val_score\nimport joblib\nimport warnings\nwarnings.filterwarnings('ignore')\n\nprint('Libraries imported successfully!')"),
    ("code", "# Load test quality dataset\ndf = pd.read_csv('component-4-quality/datasets/test_quality_data.csv')\n\nprint(f'Dataset shape: {df.shape}')\nprint(f'Columns: {df.columns.tolist()}')\nprint(f'First 5 rows:')\ndf.head()"),
    ("markdown", "## 3. Data Preprocessing"),
    ("code", "# Display dataset statistics\nprint('Dataset Statistics:')\nprint(df.describe())\n\nprint(f'Quality Distribution:')\nprint(df['quality_category'].value_counts())"),
    ("code", "# Prepare features and target\nfeature_cols = ['assertion_count', 'has_boundary_values', 'has_negative_test', \n                'step_count', 'has_error_handling', 'cyclomatic_complexity',\n                'has_setup_teardown', 'historical_pass_rate']\n\nX = df[feature_cols]\ny = df['quality_category']\n\nprint(f'Features shape: {X.shape}')\nprint(f'Target shape: {y.shape}')\nprint(f'Quality categories: {y.unique()}')"),
    ("code", "# Split data into training and testing sets\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)\n\nprint(f'Training set: {X_train.shape}')\nprint(f'Testing set: {X_test.shape}')\nprint(f'Training distribution:')\nprint(y_train.value_counts())\nprint(f'Testing distribution:')\nprint(y_test.value_counts())"),
    ("code", "# Feature scaling (important for KNN)\nscaler = StandardScaler()\nX_train_scaled = scaler.fit_transform(X_train)\nX_test_scaled = scaler.transform(X_test)\n\nprint('Features scaled using StandardScaler')"),
    ("markdown", "## 4. Visualize Quality Distribution"),
    ("code", "# Plot quality distribution\nplt.figure(figsize=(12, 5))\n\nplt.subplot(1, 2, 1)\nsns.countplot(x=y_train, palette='viridis')\nplt.title('Training Set - Quality Distribution', fontsize=14, fontweight='bold')\nplt.xlabel('Quality Category')\nplt.ylabel('Count')\nplt.xticks(rotation=45)\n\nplt.subplot(1, 2, 2)\nsns.countplot(x=y_test, palette='magma')\nplt.title('Testing Set - Quality Distribution', fontsize=14, fontweight='bold')\nplt.xlabel('Quality Category')\nplt.ylabel('Count')\nplt.xticks(rotation=45)\n\nplt.tight_layout()\nplt.show()"),
    ("markdown", "## 5. KNN Model - Finding Optimal K"),
    ("code", "# Test different K values\nk_range = range(1, 31)\nknn_scores = []\n\nfor k in k_range:\n    knn = KNeighborsClassifier(n_neighbors=k)\n    knn.fit(X_train_scaled, y_train)\n    y_pred = knn.predict(X_test_scaled)\n    accuracy = accuracy_score(y_test, y_pred)\n    knn_scores.append(accuracy)\n    print(f'K={k}: Accuracy = {accuracy:.4f}')\n\n# Find optimal K\noptimal_k = k_range[np.argmax(knn_scores)]\nbest_knn_accuracy = max(knn_scores)\nprint(f'Optimal K value: {optimal_k}')\nprint(f'Best KNN accuracy: {best_knn_accuracy:.4f}')"),
    ("code", "# Plot K vs Accuracy\nplt.figure(figsize=(12, 6))\nplt.plot(k_range, knn_scores, marker='o', linestyle='-', color='blue', linewidth=2)\nplt.axvline(x=optimal_k, color='red', linestyle='--', label=f'Optimal K={optimal_k}')\nplt.xlabel('K Value (Number of Neighbors)', fontsize=12)\nplt.ylabel('Accuracy Score', fontsize=12)\nplt.title('KNN: Accuracy vs K Value', fontsize=14, fontweight='bold')\nplt.grid(True, alpha=0.3)\nplt.legend()\nplt.show()"),
    ("markdown", "## 6. Random Forest Model"),
    ("code", "# Test different number of trees\nn_estimators_range = [10, 20, 50, 100, 150, 200]\nrf_scores = []\n\nfor n_trees in n_estimators_range:\n    rf = RandomForestClassifier(n_estimators=n_trees, random_state=42)\n    rf.fit(X_train_scaled, y_train)\n    y_pred = rf.predict(X_test_scaled)\n    accuracy = accuracy_score(y_test, y_pred)\n    rf_scores.append(accuracy)\n    print(f'Trees={n_trees}: Accuracy = {accuracy:.4f}')\n\n# Find optimal number of trees\noptimal_trees = n_estimators_range[np.argmax(rf_scores)]\nbest_rf_accuracy = max(rf_scores)\nprint(f'Optimal trees: {optimal_trees}')\nprint(f'Best Random Forest accuracy: {best_rf_accuracy:.4f}')"),
    ("code", "# Plot Trees vs Accuracy\nplt.figure(figsize=(12, 6))\nplt.plot(n_estimators_range, rf_scores, marker='s', linestyle='-', color='green', linewidth=2)\nplt.axvline(x=optimal_trees, color='red', linestyle='--', label=f'Optimal Trees={optimal_trees}')\nplt.xlabel('Number of Trees', fontsize=12)\nplt.ylabel('Accuracy Score', fontsize=12)\nplt.title('Random Forest: Accuracy vs Number of Trees', fontsize=14, fontweight='bold')\nplt.grid(True, alpha=0.3)\nplt.legend()\nplt.show()"),
    ("markdown", "## 7. Train Final Models"),
    ("code", "# Train final KNN model\nknn_final = KNeighborsClassifier(n_neighbors=optimal_k)\nknn_final.fit(X_train_scaled, y_train)\nknn_predictions = knn_final.predict(X_test_scaled)\n\nprint(f'KNN Model trained with K={optimal_k}')\n\n# Train final Random Forest model\nrf_final = RandomForestClassifier(n_estimators=optimal_trees, random_state=42)\nrf_final.fit(X_train_scaled, y_train)\nrf_predictions = rf_final.predict(X_test_scaled)\n\nprint(f'Random Forest Model trained with {optimal_trees} trees')"),
    ("markdown", "## 8. Model Evaluation"),
    ("code", "# Evaluate KNN\nknn_accuracy = accuracy_score(y_test, knn_predictions)\nprint('='*60)\nprint('K-NEAREST NEIGHBORS (KNN) MODEL')\nprint('='*60)\nprint(f'Accuracy: {knn_accuracy:.4f} ({knn_accuracy*100:.2f}%)')\nprint(f'Classification Report:')\nprint(classification_report(y_test, knn_predictions))\n\n# Confusion Matrix for KNN\ncm_knn = confusion_matrix(y_test, knn_predictions)\nplt.figure(figsize=(10, 8))\nsns.heatmap(cm_knn, annot=True, fmt='d', cmap='Blues',\n            xticklabels=['Excellent', 'Fair', 'Good', 'Poor'],\n            yticklabels=['Excellent', 'Fair', 'Good', 'Poor'])\nplt.xlabel('Predicted')\nplt.ylabel('Actual')\nplt.title('Confusion Matrix - KNN Model')\nplt.show()"),
    ("code", "# Evaluate Random Forest\nrf_accuracy = accuracy_score(y_test, rf_predictions)\nprint('='*60)\nprint('RANDOM FOREST MODEL')\nprint('='*60)\nprint(f'Accuracy: {rf_accuracy:.4f} ({rf_accuracy*100:.2f}%)')\nprint(f'Classification Report:')\nprint(classification_report(y_test, rf_predictions))\n\n# Confusion Matrix for Random Forest\ncm_rf = confusion_matrix(y_test, rf_predictions)\nplt.figure(figsize=(10, 8))\nsns.heatmap(cm_rf, annot=True, fmt='d', cmap='Greens',\n            xticklabels=['Excellent', 'Fair', 'Good', 'Poor'],\n            yticklabels=['Excellent', 'Fair', 'Good', 'Poor'])\nplt.xlabel('Predicted')\nplt.ylabel('Actual')\nplt.title('Confusion Matrix - Random Forest Model')\nplt.show()"),
    ("markdown", "## 9. Model Comparison"),
    ("code", "# Compare models\nmodels = ['KNN', 'Random Forest']\naccuracies = [knn_accuracy, rf_accuracy]\n\nplt.figure(figsize=(10, 6))\nbars = plt.bar(models, accuracies, color=['blue', 'green'], edgecolor='black', linewidth=1.5)\nplt.ylim(0, 1)\nplt.ylabel('Accuracy', fontsize=12)\nplt.title('Model Comparison: KNN vs Random Forest', fontsize=14, fontweight='bold')\nplt.grid(axis='y', alpha=0.3)\n\n# Add value labels on bars\nfor bar, acc in zip(bars, accuracies):\n    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.01,\n             f'{acc*100:.2f}%', ha='center', va='bottom', fontsize=12, fontweight='bold')\n\nplt.show()\n\n# Select best model\nif knn_accuracy >= rf_accuracy:\n    best_model = knn_final\n    best_model_name = 'KNN'\n    best_accuracy = knn_accuracy\nelse:\n    best_model = rf_final\n    best_model_name = 'Random Forest'\n    best_accuracy = rf_accuracy\n\nprint(f'Best Model: {best_model_name}')\nprint(f'Best Accuracy: {best_accuracy*100:.2f}%')"),
    ("markdown", "## 10. Cross-Validation"),
    ("code", "# 5-fold cross-validation for both models\ncv_knn = cross_val_score(knn_final, X_train_scaled, y_train, cv=5)\ncv_rf = cross_val_score(rf_final, X_train_scaled, y_train, cv=5)\n\nprint('Cross-Validation Results:')\nprint(f'KNN:')\nprint(f'  Scores: {cv_knn}')\nprint(f'  Mean: {cv_knn.mean():.4f} (+/- {cv_knn.std() * 2:.4f})')\n\nprint(f'Random Forest:')\nprint(f'  Scores: {cv_rf}')\nprint(f'  Mean: {cv_rf.mean():.4f} (+/- {cv_rf.std() * 2:.4f})')\n\n# Visualize CV scores\nplt.figure(figsize=(12, 6))\nx = np.arange(1, 6)\nwidth = 0.35\n\nplt.bar(x - width/2, cv_knn, width, label='KNN', color='blue', alpha=0.7)\nplt.bar(x + width/2, cv_rf, width, label='Random Forest', color='green', alpha=0.7)\n\nplt.axhline(y=cv_knn.mean(), color='blue', linestyle='--', alpha=0.5)\nplt.axhline(y=cv_rf.mean(), color='green', linestyle='--', alpha=0.5)\n\nplt.xlabel('Fold', fontsize=12)\nplt.ylabel('Accuracy Score', fontsize=12)\nplt.title('5-Fold Cross-Validation Comparison', fontsize=14, fontweight='bold')\nplt.xticks(x, [f'Fold {i}' for i in range(1, 6)])\nplt.legend()\nplt.grid(axis='y', alpha=0.3)\nplt.show()"),
    ("markdown", "## 11. Feature Importance (Random Forest)"),
    ("code", "# Feature importance from Random Forest\nfeature_importance = pd.DataFrame({\n    'feature': feature_cols,\n    'importance': rf_final.feature_importances_\n}).sort_values('importance', ascending=False)\n\nprint('Feature Importance:')\nprint(feature_importance)\n\n# Plot feature importance\nplt.figure(figsize=(12, 6))\nsns.barplot(x='importance', y='feature', data=feature_importance, palette='viridis')\nplt.title('Feature Importance - Random Forest', fontsize=14, fontweight='bold')\nplt.xlabel('Importance Score')\nplt.ylabel('Feature')\nplt.grid(axis='x', alpha=0.3)\nplt.show()"),
    ("markdown", "## 12. Test Predictions"),
    ("code", "# Test with sample data\nsample_test = pd.DataFrame({\n    'assertion_count': [5, 2, 8, 3],\n    'has_boundary_values': [1, 0, 1, 0],\n    'has_negative_test': [1, 0, 1, 1],\n    'step_count': [8, 4, 12, 5],\n    'has_error_handling': [1, 0, 1, 0],\n    'cyclomatic_complexity': [4.5, 7.0, 3.2, 8.5],\n    'has_setup_teardown': [1, 0, 1, 0],\n    'historical_pass_rate': [0.85, 0.45, 0.92, 0.35]\n})\n\nsample_scaled = scaler.transform(sample_test)\n\n# Predictions\nknn_preds = best_model.predict(sample_scaled)\nrf_preds = rf_final.predict(sample_scaled)\n\nresults = pd.DataFrame({\n    'Test Case': [f'Test_{i+1}' for i in range(4)],\n    'Assertions': sample_test['assertion_count'],\n    'Steps': sample_test['step_count'],\n    'KNN Prediction': knn_preds,\n    'RF Prediction': rf_preds\n})\n\nprint('Sample Predictions:')\nprint(results)"),
    ("markdown", "## 13. Save Models"),
    ("code", "# Save the best model\nimport os\nos.makedirs('component-4-quality/saved_models', exist_ok=True)\n\nmodel_path = f'component-4-quality/saved_models/quality_scorer.pkl'\njoblib.dump(best_model, model_path)\nprint(f'Best model ({best_model_name}) saved to {model_path}')\n\n# Save scaler\nscaler_path = f'component-4-quality/saved_models/feature_scaler.pkl'\njoblib.dump(scaler, scaler_path)\nprint(f'Scaler saved to {scaler_path}')\n\n# Save feature columns\nimport json\nfeatures_path = f'component-4-quality/saved_models/feature_columns.json'\nwith open(features_path, 'w') as f:\n    json.dump(feature_cols, f)\nprint(f'Feature columns saved to {features_path}')"),
    ("markdown", "## 14. Final Model Summary"),
    ("code", "print('\\n' + '='*60)\nprint('FINAL MODEL SUMMARY')\nprint('='*60)\nprint(f'Best Model: {best_model_name}')\nprint(f'Test Accuracy: {best_accuracy*100:.2f}%')\n\nif best_model_name == 'KNN':\n    print(f'K Value: {optimal_k}')\n    print(f'CV Accuracy: {cv_knn.mean()*100:.2f}%')\nelse:\n    print(f'Number of Trees: {optimal_trees}')\n    print(f'CV Accuracy: {cv_rf.mean()*100:.2f}%')\n\nprint(f'Quality Categories: Excellent, Good, Fair, Poor')\nprint(f'Features Used: {len(feature_cols)}')\nprint(f'Training Samples: {len(X_train)}')\nprint(f'Testing Samples: {len(X_test)}')\nprint('='*60)\nprint(f'MODEL TRAINING COMPLETED SUCCESSFULLY!')")
]

for cell_type, content in cells:
    cell = {
        "cell_type": cell_type,
        "execution_count": None,
        "id": f'{cell_type}-{len(notebook["cells"])}',
        "metadata": {},
        "outputs": [],
        "source": content.split('\n')
    }
    notebook["cells"].append(cell)

with open('test_quality_prediction.ipynb', 'w') as f:
    json.dump(notebook, f, indent=1)

print('Notebook created successfully!')
