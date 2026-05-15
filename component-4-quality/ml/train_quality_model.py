"""
Test Quality Prediction Model Training
Trains ML models to predict test quality scores (0-100)
Target: MAE < 10, R² > 0.80
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.neighbors import KNeighborsRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error, accuracy_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os
from datetime import datetime
import json

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from dataset.import_dataset import DatasetImporter


class TestQualityModelTrainer:
    """Train and evaluate test quality prediction models"""
    
    def __init__(self):
        self.models_dir = "saved_models"
        os.makedirs(self.models_dir, exist_ok=True)
        
        # Feature columns for training
        self.feature_columns = [
            'assertion_count',
            'has_boundary_values',
            'has_negative_test',
            'step_count',
            'has_error_handling',
            'cyclomatic_complexity',
            'has_setup_teardown',
            'historical_pass_rate'
        ]
        
    def load_training_data(self) -> pd.DataFrame:
        """Load and preprocess training data"""
        print("Loading training data...")
        
        # Check if dataset exists, if not generate it
        dataset_path = 'datasets/test_quality_data.csv'
        if not os.path.exists(dataset_path):
            print("Dataset not found. Generating sample data...")
            importer = DatasetImporter()
            importer.generate_sample_test_quality_data(num_samples=500)
        
        df = pd.read_csv(dataset_path)
        
        # Preprocess
        print("Preprocessing data...")
        bool_columns = ['has_boundary_values', 'has_negative_test', 
                       'has_error_handling', 'has_setup_teardown']
        for col in bool_columns:
            if col in df.columns:
                df[col] = df[col].astype(int)
        
        return df
    
    def prepare_features(self, df: pd.DataFrame):
        """Prepare feature matrix X and target vector y"""
        print("Preparing features...")
        
        # Filter to only existing columns
        available_features = [col for col in self.feature_columns if col in df.columns]
        X = df[available_features].values
        y = df['quality_score'].values
        
        print(f"Feature matrix shape: {X.shape}")
        print(f"Target vector shape: {y.shape}")
        print(f"Features: {available_features}")
        
        return X, y, available_features
    
    def train_model(self, X: np.ndarray, y: np.ndarray):
        """Train multiple models and select the best one"""
        print("\n" + "="*60)
        print("TRAINING ML MODELS")
        print("="*60)
        
        # Split data: 70% train, 15% validation, 15% test
        X_temp, X_test, y_temp, y_test = train_test_split(
            X, y, test_size=0.15, random_state=42
        )
        X_train, X_val, y_train, y_val = train_test_split(
            X_temp, y_temp, test_size=0.176, random_state=42  # 0.176 * 0.85 ≈ 0.15
        )
        
        print(f"\nTraining set size: {len(X_train)}")
        print(f"Validation set size: {len(X_val)}")
        print(f"Test set size: {len(X_test)}")
        
        # Define models to compare
        models = {
            'GradientBoosting': GradientBoostingRegressor(random_state=42),
            'RandomForest': RandomForestRegressor(random_state=42),
            'KNN': KNeighborsRegressor(),
            'DecisionTree': DecisionTreeRegressor(random_state=42),
            'Ridge': Ridge(random_state=42)
        }
        
        # Hyperparameter grids
        param_grids = {
            'GradientBoosting': {
                'n_estimators': [100, 200, 300],
                'learning_rate': [0.05, 0.1, 0.2],
                'max_depth': [3, 5, 7],
                'min_samples_split': [2, 5, 10]
            },
            'RandomForest': {
                'n_estimators': [100, 200, 300],
                'max_depth': [None, 10, 20, 30],
                'min_samples_split': [2, 5, 10],
                'min_samples_leaf': [1, 2, 4]
            },
            'KNN': {
                'n_neighbors': [3, 5, 7, 9, 11],
                'weights': ['uniform', 'distance'],
                'metric': ['euclidean', 'manhattan', 'minkowski']
            },
            'DecisionTree': {
                'max_depth': [None, 10, 20, 30, 50],
                'min_samples_split': [2, 5, 10, 20],
                'min_samples_leaf': [1, 2, 4, 6],
                'criterion': ['squared_error', 'friedman_mse', 'absolute_error']
            },
            'Ridge': {
                'alpha': [0.1, 1.0, 10.0, 100.0],
                'solver': ['auto', 'svd', 'cholesky', 'lsqr', 'saga']
            }
        }
        
        best_model = None
        best_score = float('inf')
        best_params = {}
        results = []
        
        for model_name, model in models.items():
            print(f"\n{'='*60}")
            print(f"Training {model_name}...")
            print(f"{'='*60}")
            
            # Grid search with cross-validation
            grid_search = GridSearchCV(
                estimator=model,
                param_grid=param_grids[model_name],
                cv=5,
                scoring='neg_mean_absolute_error',
                n_jobs=-1,
                verbose=1
            )
            
            grid_search.fit(X_train, y_train)
            
            # Evaluate on validation set
            val_predictions = grid_search.predict(X_val)
            val_mae = mean_absolute_error(y_val, val_predictions)
            val_mse = mean_squared_error(y_val, val_predictions)
            val_r2 = r2_score(y_val, val_predictions)
            
            print(f"\n{model_name} - Validation Results:")
            print(f"  MAE: {val_mae:.4f}")
            print(f"  MSE: {val_mse:.4f}")
            print(f"  R²:  {val_r2:.4f}")
            print(f"  Best Parameters: {grid_search.best_params_}")
            
            results.append({
                'model': model_name,
                'mae': val_mae,
                'mse': val_mse,
                'r2': val_r2,
                'params': grid_search.best_params_
            })
            
            # Track best model
            if val_mae < best_score:
                best_score = val_mae
                best_model = grid_search.best_estimator_
                best_params = grid_search.best_params_
                best_model_name = model_name
        
        # Print comparison table
        print(f"\n{'='*80}")
        print(f"MODEL COMPARISON SUMMARY")
        print(f"{'='*80}")
        print(f"{'Model':<25} {'MAE':<12} {'RMSE':<12} {'R²':<12}")
        print(f"{'-'*25} {'-'*12} {'-'*12} {'-'*12}")
        for result in sorted(results, key=lambda x: x['mae']):
            print(f"{result['model']:<25} {result['mae']:<12.4f} {np.sqrt(result['mse']):<12.4f} {result['r2']:<12.4f}")
        print(f"{'='*80}")
        
        # Final evaluation on test set
        print(f"\n{'='*60}")
        print(f"BEST MODEL: {best_model_name}")
        print(f"{'='*60}")
        
        test_predictions = best_model.predict(X_test)
        test_mae = mean_absolute_error(y_test, test_predictions)
        test_mse = mean_squared_error(y_test, test_predictions)
        test_r2 = r2_score(y_test, test_predictions)
        
        print(f"\nTest Set Performance:")
        print(f"  MAE: {test_mae:.4f} (Target: < 10)")
        print(f"  RMSE: {np.sqrt(test_mse):.4f}")
        print(f"  R²:  {test_r2:.4f} (Target: > 0.80)")
        
        # Check if targets are met
        targets_met = test_mae < 10 and test_r2 > 0.80
        print(f"\nTargets Met: {'✓ YES' if targets_met else '✗ NO'}")
        
        # Save results
        training_results = {
            'model_name': best_model_name,
            'training_timestamp': datetime.now().isoformat(),
            'test_metrics': {
                'mae': float(test_mae),
                'rmse': float(np.sqrt(test_mse)),
                'r2': float(test_r2)
            },
            'best_parameters': best_params,
            'all_results': results,
            'targets_met': targets_met
        }
        
        results_path = os.path.join(self.models_dir, 'training_results.json')
        with open(results_path, 'w') as f:
            json.dump(training_results, f, indent=2)
        print(f"\nSaved training results to {results_path}")
        
        return best_model, best_model_name, training_results
    
    def save_model(self, model, model_name: str, feature_columns: list):
        """Save trained model and metadata"""
        print("\nSaving model artifacts...")
        
        # Save the model
        model_path = os.path.join(self.models_dir, 'quality_scorer.pkl')
        joblib.dump(model, model_path)
        print(f"Saved model to {model_path}")
        
        # Save feature columns
        features_path = os.path.join(self.models_dir, 'feature_columns.json')
        with open(features_path, 'w') as f:
            json.dump(feature_columns, f, indent=2)
        print(f"Saved feature columns to {features_path}")
        
        # Save scaler (for preprocessing)
        scaler = StandardScaler()
        # Fit on dummy data to save the scaler object
        scaler.fit(np.random.rand(10, len(feature_columns)))
        scaler_path = os.path.join(self.models_dir, 'feature_scaler.pkl')
        joblib.dump(scaler, scaler_path)
        print(f"Saved scaler to {scaler_path}")
        
        print("Model saving complete!")
    
    def run_training_pipeline(self):
        """Execute complete training pipeline"""
        print("="*60)
        print("TEST QUALITY PREDICTION MODEL TRAINING")
        print("="*60)
        
        # Load data
        df = self.load_training_data()
        
        # Prepare features
        X, y, feature_columns = self.prepare_features(df)
        
        # Train model
        best_model, model_name, results = self.train_model(X, y)
        
        # Save model
        self.save_model(best_model, model_name, feature_columns)
        
        print("\n" + "="*60)
        print("TRAINING COMPLETE")
        print("="*60)
        print(f"Best Model: {model_name}")
        print(f"Test MAE: {results['test_metrics']['mae']:.4f}")
        print(f"Test R²: {results['test_metrics']['r2']:.4f}")
        print(f"Targets Met: {'✓' if results['targets_met'] else '✗'}")
        
        return results


def main():
    """Main training function"""
    trainer = TestQualityModelTrainer()
    results = trainer.run_training_pipeline()
    
    # Print summary
    print("\n" + "="*60)
    print("TRAINING SUMMARY")
    print("="*60)
    print(json.dumps(results['test_metrics'], indent=2))
    
    return results


if __name__ == "__main__":
    main()
