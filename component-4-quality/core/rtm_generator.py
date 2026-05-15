"""
RTM Generator - Requirements Traceability Matrix
Automatically generates and maintains traceability links between requirements and tests
"""

from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from typing import List, Dict, Tuple
import os
from config.settings import settings
from database.models import get_db, RTMLink, TestCase
import uuid
from datetime import datetime


class RTMGenerator:
    """Generate and maintain Requirements Traceability Matrix"""
    
    def __init__(self):
        self.semantic_model = None
        self.load_semantic_model()
    
    def load_semantic_model(self):
        """Load semantic similarity model"""
        try:
            print(f"Loading semantic model: {settings.SENTENCE_TRANSFORMER_MODEL}")
            self.semantic_model = SentenceTransformer(settings.SENTENCE_TRANSFORMER_MODEL)
            print("✓ Semantic model loaded successfully")
        except Exception as e:
            print(f"✗ Error loading semantic model: {e}")
            raise e
    
    def extract_text(self, requirement: Dict) -> str:
        """Extract text content from requirement for semantic comparison"""
        text_parts = [
            requirement.get('title', ''),
            requirement.get('description', ''),
            str(requirement.get('acceptance_criteria', ''))
        ]
        return ' '.join(text_parts)
    
    def extract_test_text(self, test_case: Dict) -> str:
        """Extract text content from test case"""
        text_parts = [
            test_case.get('title', ''),
            test_case.get('gherkin_scenario', ''),
            str(test_case.get('generated_code', ''))
        ]
        return ' '.join(text_parts)
    
    def compute_embeddings(self, texts: List[str]) -> np.ndarray:
        """Compute semantic embeddings for texts"""
        embeddings = self.semantic_model.encode(texts, convert_to_numpy=True)
        return embeddings
    
    def find_similar_requirements(self, test_case: Dict, requirements: List[Dict], 
                                  threshold: float = None) -> List[Tuple[Dict, float]]:
        """
        Find requirements similar to a test case using semantic similarity
        
        Args:
            test_case: Test case dictionary
            requirements: List of requirement dictionaries
            threshold: Similarity threshold (default from settings)
            
        Returns:
            List of (requirement, similarity_score) tuples above threshold
        """
        if threshold is None:
            threshold = settings.RTM_SIMILARITY_THRESHOLD
        
        # Extract text
        test_text = self.extract_test_text(test_case)
        req_texts = [self.extract_text(req) for req in requirements]
        
        # Compute embeddings
        test_embedding = self.compute_embeddings([test_text])
        req_embeddings = self.compute_embeddings(req_texts)
        
        # Calculate cosine similarity
        similarities = cosine_similarity(test_embedding, req_embeddings)[0]
        
        # Filter by threshold
        matches = []
        for i, similarity in enumerate(similarities):
            if similarity >= threshold:
                matches.append((requirements[i], float(similarity)))
        
        # Sort by similarity (descending)
        matches.sort(key=lambda x: x[1], reverse=True)
        
        return matches
    
    def generate_rtm_links(self, requirements: List[Dict], test_cases: List[Dict]) -> List[Dict]:
        """
        Generate complete RTM linking requirements to test cases
        
        Args:
            requirements: List of all requirements
            test_cases: List of all test cases
            
        Returns:
            List of RTM link dictionaries
        """
        print(f"Generating RTM for {len(requirements)} requirements and {len(test_cases)} test cases...")
        
        rtm_links = []
        
        for test_case in test_cases:
            # Find matching requirements
            matches = self.find_similar_requirements(test_case, requirements)
            
            if matches:
                # Link to best match
                best_req, best_score = matches[0]
                
                link = {
                    'id': str(uuid.uuid4()),
                    'requirement_id': best_req['requirement_id'],
                    'test_case_id': test_case.get('id', test_case.get('test_id')),
                    'similarity_score': round(best_score, 3),
                    'coverage_status': 'covered' if best_score >= 0.8 else 'partial',
                    'link_type': 'requirement-test',
                    'created_at': datetime.utcnow().isoformat(),
                    'updated_at': datetime.utcnow().isoformat()
                }
                rtm_links.append(link)
                
                # Also link to other good matches (>0.75)
                for req, score in matches[1:]:
                    if score >= 0.75:
                        secondary_link = {
                            'id': str(uuid.uuid4()),
                            'requirement_id': req['requirement_id'],
                            'test_case_id': test_case.get('id', test_case.get('test_id')),
                            'similarity_score': round(score, 3),
                            'coverage_status': 'partial',
                            'link_type': 'requirement-test',
                            'created_at': datetime.utcnow().isoformat(),
                            'updated_at': datetime.utcnow().isoformat()
                        }
                        rtm_links.append(secondary_link)
        
        print(f"Generated {len(rtm_links)} RTM links")
        return rtm_links
    
    def update_rtm(self, changed_requirements: List[Dict], test_cases: List[Dict]) -> List[Dict]:
        """Update RTM when requirements change"""
        print(f"Updating RTM for {len(changed_requirements)} changed requirements...")
        
        # Regenerate links for changed requirements only
        updated_links = self.generate_rtm_links(changed_requirements, test_cases)
        
        return updated_links
    
    def get_coverage_summary(self, requirements: List[Dict], rtm_links: List[Dict]) -> Dict:
        """Get summary of requirement coverage"""
        
        # Count covered requirements
        covered_req_ids = set(link['requirement_id'] for link in rtm_links)
        total_reqs = len(requirements)
        covered_reqs = len(covered_req_ids)
        
        # Calculate coverage percentage
        coverage_percentage = (covered_reqs / total_reqs * 100) if total_reqs > 0 else 0
        
        # Group by status
        coverage_by_status = {}
        for link in rtm_links:
            status = link['coverage_status']
            coverage_by_status[status] = coverage_by_status.get(status, 0) + 1
        
        return {
            'total_requirements': total_reqs,
            'covered_requirements': covered_reqs,
            'untested_requirements': total_reqs - covered_reqs,
            'coverage_percentage': round(coverage_percentage, 2),
            'coverage_by_status': coverage_by_status,
            'total_links': len(rtm_links)
        }
    
    def export_rtm_to_csv(self, rtm_links: List[Dict], output_path: str):
        """Export RTM to CSV file"""
        import csv
        
        if not rtm_links:
            print("No RTM links to export")
            return
        
        fieldnames = [
            'id', 'requirement_id', 'test_case_id', 'similarity_score',
            'coverage_status', 'link_type', 'created_at', 'updated_at'
        ]
        
        with open(output_path, 'w', newline='') as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(rtm_links)
        
        print(f"RTM exported to {output_path}")
