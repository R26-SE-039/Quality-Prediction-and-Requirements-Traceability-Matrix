"""
Coverage Gap Detection
Identifies untested or partially tested requirements
"""

from typing import List, Dict
import uuid
from datetime import datetime


class CoverageGapDetector:
    """Detect and analyze coverage gaps in requirements"""
    
    def __init__(self):
        pass
    
    def detect_gaps(self, requirements: List[Dict], rtm_links: List[Dict]) -> List[Dict]:
        """
        Detect coverage gaps by analyzing RTM
        
        Args:
            requirements: List of all requirements
            rtm_links: List of RTM links
            
        Returns:
            List of detected coverage gaps
        """
        print(f"Analyzing coverage for {len(requirements)} requirements...")
        
        # Create set of covered requirement IDs
        covered_reqs = {}
        for link in rtm_links:
            req_id = link['requirement_id']
            status = link['coverage_status']
            
            if req_id not in covered_reqs:
                covered_reqs[req_id] = []
            covered_reqs[req_id].append(status)
        
        gaps = []
        
        for requirement in requirements:
            req_id = requirement['requirement_id']
            
            # Check if requirement is completely untested
            if req_id not in covered_reqs:
                gap = {
                    'id': str(uuid.uuid4()),
                    'requirement_id': req_id,
                    'gap_type': 'untested',
                    'severity': self._calculate_severity(requirement),
                    'description': f"Requirement '{requirement.get('title', req_id)}' has no test coverage",
                    'recommended_tests': self._generate_test_recommendations(requirement, 'untested'),
                    'detected_at': datetime.utcnow().isoformat(),
                    'status': 'open'
                }
                gaps.append(gap)
            
            # Check for partial coverage
            elif 'partial' in covered_reqs[req_id]:
                # Check if all acceptance criteria are covered
                acceptance_criteria = requirement.get('acceptance_criteria', [])
                if isinstance(acceptance_criteria, str):
                    import json
                    try:
                        acceptance_criteria = json.loads(acceptance_criteria)
                    except:
                        acceptance_criteria = []
                
                if len(acceptance_criteria) > 0:
                    gap = {
                        'id': str(uuid.uuid4()),
                        'requirement_id': req_id,
                        'gap_type': 'partially_tested',
                        'severity': self._calculate_severity(requirement, is_partial=True),
                        'description': f"Requirement '{requirement.get('title', req_id)}' has partial test coverage. Some acceptance criteria may be untested.",
                        'recommended_tests': self._generate_test_recommendations(requirement, 'partial'),
                        'detected_at': datetime.utcnow().isoformat(),
                        'status': 'open'
                    }
                    gaps.append(gap)
        
        print(f"Detected {len(gaps)} coverage gaps")
        return gaps
    
    def _calculate_severity(self, requirement: Dict, is_partial: bool = False) -> str:
        """Calculate severity of gap based on requirement priority"""
        priority = requirement.get('priority', 'medium')
        
        severity_map = {
            'critical': 'critical',
            'high': 'high',
            'medium': 'medium',
            'low': 'low'
        }
        
        base_severity = severity_map.get(priority, 'medium')
        
        # Partial gaps are one level less severe
        if is_partial:
            severity_order = ['critical', 'high', 'medium', 'low']
            current_idx = severity_order.index(base_severity) if base_severity in severity_order else 2
            new_idx = min(current_idx + 1, 3)
            return severity_order[new_idx]
        
        return base_severity
    
    def _generate_test_recommendations(self, requirement: Dict, gap_type: str) -> List[Dict]:
        """Generate specific test recommendations for a gap"""
        
        title = requirement.get('title', 'Unknown Requirement')
        description = requirement.get('description', '')
        acceptance_criteria = requirement.get('acceptance_criteria', [])
        
        if isinstance(acceptance_criteria, str):
            import json
            try:
                acceptance_criteria = json.loads(acceptance_criteria)
            except:
                acceptance_criteria = []
        
        recommendations = []
        
        if gap_type == 'untested':
            # Recommend creating tests for each acceptance criterion
            for i, criterion in enumerate(acceptance_criteria[:3], 1):  # Max 3 recommendations
                recommendations.append({
                    'type': 'new_test',
                    'title': f'Test {criterion[:50]}...' if len(criterion) > 50 else f'Test {criterion}',
                    'description': f'Create test to verify acceptance criterion {i}: {criterion}',
                    'priority': 'high'
                })
            
            # If no acceptance criteria, recommend general tests
            if not acceptance_criteria:
                recommendations.append({
                    'type': 'new_test',
                    'title': f'Test for {title}',
                    'description': f'Create comprehensive test covering: {description[:100]}...',
                    'priority': 'high'
                })
        
        elif gap_type == 'partial':
            # Recommend extending existing tests
            recommendations.append({
                'type': 'extend_test',
                'title': f'Extend test coverage for {title}',
                'description': 'Add additional test scenarios to cover remaining acceptance criteria',
                'priority': 'medium'
            })
            
            # Recommend boundary tests
            recommendations.append({
                'type': 'boundary_test',
                'title': 'Add boundary value tests',
                'description': 'Include tests for minimum, maximum, and edge case values',
                'priority': 'medium'
            })
        
        return recommendations
    
    def get_gap_statistics(self, gaps: List[Dict]) -> Dict:
        """Calculate statistics about detected gaps"""
        
        if not gaps:
            return {
                'total_gaps': 0,
                'by_type': {},
                'by_severity': {},
                'recommendations_count': 0
            }
        
        # Count by type
        by_type = {}
        for gap in gaps:
            gap_type = gap['gap_type']
            by_type[gap_type] = by_type.get(gap_type, 0) + 1
        
        # Count by severity
        by_severity = {}
        for gap in gaps:
            severity = gap['severity']
            by_severity[severity] = by_severity.get(severity, 0) + 1
        
        # Count total recommendations
        total_recommendations = sum(len(gap.get('recommended_tests', [])) for gap in gaps)
        
        return {
            'total_gaps': len(gaps),
            'by_type': by_type,
            'by_severity': by_severity,
            'recommendations_count': total_recommendations,
            'critical_gaps': by_severity.get('critical', 0),
            'high_priority_gaps': by_severity.get('high', 0)
        }
    
    def prioritize_gaps(self, gaps: List[Dict]) -> List[Dict]:
        """Sort gaps by priority (severity + type)"""
        
        severity_order = {'critical': 0, 'high': 1, 'medium': 2, 'low': 3}
        type_order = {'untested': 0, 'partially_tested': 1, 'missing_error_path': 2}
        
        sorted_gaps = sorted(
            gaps,
            key=lambda g: (
                severity_order.get(g['severity'], 2),
                type_order.get(g['gap_type'], 1)
            )
        )
        
        return sorted_gaps
