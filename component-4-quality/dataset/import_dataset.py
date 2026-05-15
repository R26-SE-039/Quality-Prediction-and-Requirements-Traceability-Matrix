"""
Dataset Import and Preprocessing Pipeline
Imports test quality data from various sources and prepares it for ML training
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random
import os
from typing import List, Dict
import json


class DatasetImporter:
    """Import and preprocess datasets for test quality prediction"""
    
    def __init__(self):
        self.datasets_dir = "datasets"
        os.makedirs(self.datasets_dir, exist_ok=True)
        
    def generate_sample_test_quality_data(self, num_samples: int = 500) -> pd.DataFrame:
        """
        Generate synthetic test quality data for training
        In production, this would import from actual test repositories
        """
        print(f"Generating {num_samples} sample test quality records...")
        
        data = []
        for i in range(num_samples):
            # Generate realistic test features
            assertion_count = random.randint(1, 15)
            has_boundary = random.choice([True, False])
            has_negative = random.choice([True, False])
            step_count = random.randint(3, 20)
            has_error_handling = random.choice([True, False])
            cyclomatic_complexity = random.uniform(1.0, 10.0)
            has_setup_teardown = random.choice([True, False])
            historical_pass_rate = random.uniform(0.5, 1.0)
            
            # Calculate quality score based on features (simulated ground truth)
            quality_score = (
                min(assertion_count * 5, 30) +  # Max 30 points from assertions
                (15 if has_boundary else 0) +
                (10 if has_negative else 0) +
                (max(0, 20 - step_count)) +  # Fewer steps = better
                (15 if has_error_handling else 0) +
                (max(0, 10 - cyclomatic_complexity)) +  # Lower complexity = better
                (10 if has_setup_teardown else 0) +
                (historical_pass_rate * 20)  # Max 20 points from pass rate
            )
            
            # Add some noise
            quality_score += random.uniform(-5, 5)
            quality_score = max(0, min(100, quality_score))  # Clamp to 0-100
            
            # Determine if test detected bugs (for labeling)
            bug_detection_prob = quality_score / 100
            detected_bugs = 1 if random.random() < bug_detection_prob else 0
            
            record = {
                'test_id': f'TEST_{i:04d}',
                'user_story_id': f'US_{random.randint(1, 100):03d}',
                'title': f'Test case {i} for feature {random.randint(1, 50)}',
                'assertion_count': assertion_count,
                'has_boundary_values': has_boundary,
                'has_negative_test': has_negative,
                'step_count': step_count,
                'has_error_handling': has_error_handling,
                'cyclomatic_complexity': round(cyclomatic_complexity, 2),
                'has_setup_teardown': has_setup_teardown,
                'historical_pass_rate': round(historical_pass_rate, 3),
                'quality_score': round(quality_score, 2),
                'detected_bugs': detected_bugs,
                'framework': random.choice(['selenium', 'cypress', 'playwright']),
                'created_at': (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat()
            }
            data.append(record)
        
        df = pd.DataFrame(data)
        
        # Save to CSV
        output_path = os.path.join(self.datasets_dir, 'test_quality_data.csv')
        df.to_csv(output_path, index=False)
        print(f"Saved test quality data to {output_path}")
        
        return df
    
    def generate_sample_requirements_data(self, num_reqs: int = 100) -> pd.DataFrame:
        """Generate sample requirements/user stories data"""
        print(f"Generating {num_reqs} sample requirements...")
        
        features = [
            "User authentication", "Payment processing", "Search functionality",
            "Data export", "Report generation", "User profile management",
            "Notification system", "File upload", "Dashboard analytics",
            "API integration"
        ]
        
        data = []
        for i in range(num_reqs):
            feature = random.choice(features)
            record = {
                'requirement_id': f'REQ_{i+1:03d}',
                'user_story_id': f'US_{i+1:03d}',
                'title': f'{feature} - Requirement {i+1}',
                'description': f'As a user, I want {feature.lower()} so that I can achieve my goals.',
                'acceptance_criteria': json.dumps([
                    f'Criterion 1 for requirement {i+1}',
                    f'Criterion 2 for requirement {i+1}',
                    f'Criterion 3 for requirement {i+1}'
                ]),
                'priority': random.choice(['critical', 'high', 'medium', 'low']),
                'status': random.choice(['approved', 'in_progress', 'pending']),
                'created_at': (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat()
            }
            data.append(record)
        
        df = pd.DataFrame(data)
        output_path = os.path.join(self.datasets_dir, 'requirements_data.csv')
        df.to_csv(output_path, index=False)
        print(f"Saved requirements data to {output_path}")
        
        return df
    
    def generate_test_requirement_mapping(self, num_mappings: int = 300) -> pd.DataFrame:
        """Generate sample test-to-requirement mappings for RTM training"""
        print(f"Generating {num_mappings} test-requirement mappings...")
        
        data = []
        for i in range(num_mappings):
            similarity = random.uniform(0.6, 1.0)
            record = {
                'mapping_id': f'MAP_{i:04d}',
                'test_case_id': f'TEST_{random.randint(0, 499):04d}',
                'requirement_id': f'REQ_{random.randint(1, 100):03d}',
                'similarity_score': round(similarity, 3),
                'link_type': random.choice(['requirement-test', 'acceptance-test', 'test-code']),
                'coverage_status': random.choice(['covered', 'partial', 'untested']),
                'is_validated': random.choice([True, False]),
                'created_at': (datetime.now() - timedelta(days=random.randint(0, 365))).isoformat()
            }
            data.append(record)
        
        df = pd.DataFrame(data)
        output_path = os.path.join(self.datasets_dir, 'test_requirement_mapping.csv')
        df.to_csv(output_path, index=False)
        print(f"Saved mapping data to {output_path}")
        
        return df
    
    def load_all_datasets(self) -> Dict[str, pd.DataFrame]:
        """Load all generated datasets"""
        datasets = {}
        
        datasets['test_quality'] = pd.read_csv(
            os.path.join(self.datasets_dir, 'test_quality_data.csv')
        )
        datasets['requirements'] = pd.read_csv(
            os.path.join(self.datasets_dir, 'requirements_data.csv')
        )
        datasets['mappings'] = pd.read_csv(
            os.path.join(self.datasets_dir, 'test_requirement_mapping.csv')
        )
        
        print(f"Loaded {len(datasets)} datasets successfully")
        return datasets
    
    def preprocess_test_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocess test features for ML model"""
        df_processed = df.copy()
        
        # Ensure boolean columns are properly encoded
        bool_columns = [
            'has_boundary_values', 'has_negative_test', 
            'has_error_handling', 'has_setup_teardown'
        ]
        for col in bool_columns:
            if col in df_processed.columns:
                df_processed[col] = df_processed[col].astype(int)
        
        # Fill missing values
        numeric_cols = df_processed.select_dtypes(include=[np.number]).columns
        df_processed[numeric_cols] = df_processed[numeric_cols].fillna(df_processed[numeric_cols].mean())
        
        return df_processed


def main():
    """Main function to generate and prepare datasets"""
    print("=" * 60)
    print("DATASET IMPORT AND PREPROCESSING PIPELINE")
    print("=" * 60)
    
    importer = DatasetImporter()
    
    # Generate datasets
    test_df = importer.generate_sample_test_quality_data(num_samples=500)
    req_df = importer.generate_sample_requirements_data(num_reqs=100)
    map_df = importer.generate_test_requirement_mapping(num_mappings=300)
    
    # Load and verify
    datasets = importer.load_all_datasets()
    
    print("\n" + "=" * 60)
    print("DATASET SUMMARY")
    print("=" * 60)
    print(f"Test Quality Records: {len(datasets['test_quality'])}")
    print(f"Requirements Records: {len(datasets['requirements'])}")
    print(f"Test-Requirement Mappings: {len(datasets['mappings'])}")
    
    print("\nTest Quality Features:")
    print(datasets['test_quality'].columns.tolist())
    
    print("\nSample Test Quality Data:")
    print(datasets['test_quality'].head())
    
    print("\n" + "=" * 60)
    print("PREPROCESSING COMPLETE")
    print("=" * 60)
    
    return datasets


if __name__ == "__main__":
    main()
