"""
Test Quality Predictor
Predicts quality scores (0-100) for test cases using trained ML models
"""

import joblib
import pandas as pd
import numpy as np
from typing import Dict, List, Optional
import os
from config.settings import settings


class TestQualityPredictor:
    """Predict test quality using ML models"""
    
    def __init__(self):
        self.model = None
        self.feature_columns = None
        self.scaler = None
        self.load_model()
    
    def load_model(self):
        """Load trained model from disk"""
        try:
            model_path = settings.QUALITY_MODEL_PATH
            self.model = joblib.load(model_path)
            
            features_path = os.path.join('saved_models', 'feature_columns.json')
            with open(features_path, 'r') as f:
                self.feature_columns = json.load(f)
            
            scaler_path = os.path.join('saved_models', 'feature_scaler.pkl')
            self.scaler = joblib.load(scaler_path)
            
            print(f"✓ Loaded quality prediction model from {model_path}")
        except FileNotFoundError as e:
            print(f"✗ Model not found. Please train the model first.")
            print(f"  Run: python ml/train_quality_model.py")
            raise e
    
    def extract_features(self, test_case: Dict) -> Dict:
        """
        Extract quality features from a test case
        
        Features:
        - assertion_count: Number of assertions in test
        - has_boundary_values: Whether test includes boundary testing
        - has_negative_test: Whether test includes negative scenarios
        - step_count: Number of test steps
        - has_error_handling: Whether test verifies error handling
        - cyclomatic_complexity: Code complexity score
        - has_setup_teardown: Whether test has setup/teardown
        - historical_pass_rate: Historical pass rate (if available)
        """
        features = {
            'assertion_count': test_case.get('assertion_count', 3),
            'has_boundary_values': 1 if test_case.get('has_boundary_values', False) else 0,
            'has_negative_test': 1 if test_case.get('has_negative_test', False) else 0,
            'step_count': test_case.get('step_count', 5),
            'has_error_handling': 1 if test_case.get('has_error_handling', False) else 0,
            'cyclomatic_complexity': test_case.get('cyclomatic_complexity', 5.0),
            'has_setup_teardown': 1 if test_case.get('has_setup_teardown', False) else 0,
            'historical_pass_rate': test_case.get('historical_pass_rate', 0.8)
        }
        
        return features
    
    def predict_quality(self, test_case: Dict) -> Dict:
        """
        Predict quality score for a test case
        
        Args:
            test_case: Dictionary containing test case information
            
        Returns:
            Dictionary with quality score and detailed metrics
        """
        # Extract features
        features = self.extract_features(test_case)
        
        # Create feature vector
        feature_vector = np.array([[features[col] for col in self.feature_columns]])
        
        # Scale features
        feature_vector_scaled = self.scaler.transform(feature_vector)
        
        # Predict quality score
        quality_score = self.model.predict(feature_vector_scaled)[0]
        
        # Clamp to 0-100 range
        quality_score = max(0, min(100, quality_score))
        
        # Determine acceptance
        is_accepted = bool(quality_score >= settings.MIN_QUALITY_SCORE)
        
        # Calculate sub-scores (for detailed breakdown)
        sub_scores = self._calculate_sub_scores(features)
        
        result = {
            'quality_score': round(float(quality_score), 2),
            'is_accepted': is_accepted,
            'threshold': settings.MIN_QUALITY_SCORE,
            'sub_scores': sub_scores,
            'features': features,
            'recommendation': self._generate_recommendation(quality_score, sub_scores)
        }
        
        return result
    
    def _calculate_sub_scores(self, features: Dict) -> Dict:
        """Calculate detailed sub-scores for each quality dimension"""
        
        # Assertion strength (0-30 points)
        assertion_score = min(features['assertion_count'] * 5, 30)
        
        # Coverage score (based on complexity coverage) (0-20 points)
        coverage_score = max(0, 20 - features['cyclomatic_complexity']) * 2
        
        # Boundary testing (0-15 points)
        boundary_score = 15 if features['has_boundary_values'] else 0
        
        # Error handling (0-15 points)
        error_handling_score = 15 if features['has_error_handling'] else 0
        
        # Mutation resistance (based on pass rate) (0-20 points)
        mutation_score = features['historical_pass_rate'] * 20
        
        return {
            'assertion_strength': round(assertion_score, 2),
            'code_coverage': round(coverage_score, 2),
            'boundary_testing': round(boundary_score, 2),
            'error_handling': round(error_handling_score, 2),
            'mutation_resistance': round(mutation_score, 2)
        }
    
    def _generate_recommendation(self, quality_score: float, sub_scores: Dict) -> str:
        """Generate improvement recommendations based on scores"""
        
        if quality_score >= 80:
            return "Excellent test quality! Maintain current standards."
        elif quality_score >= 60:
            return "Good test quality. Consider addressing weak areas."
        else:
            # Identify weakest areas
            weakest = min(sub_scores, key=sub_scores.get)
            
            recommendations = {
                'assertion_strength': "Add more assertions to verify test behavior",
                'code_coverage': "Increase code coverage by testing more paths",
                'boundary_testing': "Add boundary value tests (min, max, edge cases)",
                'error_handling': "Add error handling verification (try-catch blocks)",
                'mutation_resistance': "Improve test robustness to detect more mutations"
            }
            
            return f"Low quality detected. {recommendations.get(weakest, 'Improve overall test design.')}"
    
    def predict_batch(self, test_cases: List[Dict]) -> List[Dict]:
        """Predict quality for multiple test cases"""
        results = []
        for test_case in test_cases:
            result = self.predict_quality(test_case)
            result['test_case_id'] = test_case.get('id', 'unknown')
            results.append(result)
        return results


# Import json here to avoid circular imports
import json
