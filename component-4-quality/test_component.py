"""
Test Script for Component 4
Verifies all endpoints are working correctly
"""

import requests
import json
from datetime import datetime

API_BASE = "http://localhost:8004"


def test_health():
    """Test health check endpoint"""
    print("\n" + "="*60)
    print("TESTING HEALTH CHECK")
    print("="*60)
    
    try:
        response = requests.get(f"{API_BASE}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Status: {data['status']}")
            print(f"✓ Component: {data['component']}")
            print(f"✓ Services:")
            for service, status in data['services'].items():
                print(f"  - {service}: {'✓' if status else '✗'}")
            return True
        else:
            print(f"✗ Health check failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        print("  Make sure backend is running on port 8004")
        return False


def test_quality_prediction():
    """Test quality prediction endpoint"""
    print("\n" + "="*60)
    print("TESTING QUALITY PREDICTION")
    print("="*60)
    
    test_case = {
        "id": "TEST_001",
        "assertion_count": 5,
        "has_boundary_values": True,
        "has_negative_test": True,
        "step_count": 8,
        "has_error_handling": True,
        "cyclomatic_complexity": 4.5,
        "has_setup_teardown": True,
        "historical_pass_rate": 0.85
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/quality/predict",
            json=test_case
        )
        
        if response.status_code == 200:
            result = response.json()
            prediction = result['prediction']
            
            print(f"✓ Quality Score: {prediction['quality_score']}/100")
            print(f"✓ Status: {'ACCEPTED' if prediction['is_accepted'] else 'REJECTED'}")
            print(f"✓ Threshold: {prediction['threshold']}")
            print(f"\nSub-Scores:")
            for key, value in prediction['sub_scores'].items():
                print(f"  - {key}: {value}")
            print(f"\nRecommendation: {prediction['recommendation']}")
            return True
        else:
            print(f"✗ Prediction failed with status {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_batch_prediction():
    """Test batch quality prediction"""
    print("\n" + "="*60)
    print("TESTING BATCH QUALITY PREDICTION")
    print("="*60)
    
    test_cases = [
        {
            "id": "TEST_HIGH_QUALITY",
            "assertion_count": 10,
            "has_boundary_values": True,
            "has_negative_test": True,
            "step_count": 5,
            "has_error_handling": True,
            "cyclomatic_complexity": 2.0,
            "has_setup_teardown": True,
            "historical_pass_rate": 0.95
        },
        {
            "id": "TEST_LOW_QUALITY",
            "assertion_count": 1,
            "has_boundary_values": False,
            "has_negative_test": False,
            "step_count": 15,
            "has_error_handling": False,
            "cyclomatic_complexity": 8.0,
            "has_setup_teardown": False,
            "historical_pass_rate": 0.50
        }
    ]
    
    try:
        response = requests.post(
            f"{API_BASE}/quality/predict/batch",
            json=test_cases
        )
        
        if response.status_code == 200:
            result = response.json()
            print(f"✓ Processed {result['count']} test cases")
            
            for pred in result['predictions']:
                status = "✓" if pred['is_accepted'] else "✗"
                print(f"\n{status} {pred['test_case_id']}: {pred['quality_score']}/100")
            
            return True
        else:
            print(f"✗ Batch prediction failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_rtm_generation():
    """Test RTM generation endpoint"""
    print("\n" + "="*60)
    print("TESTING RTM GENERATION")
    print("="*60)
    
    requirements = [
        {
            "requirement_id": "REQ_001",
            "user_story_id": "US_001",
            "title": "User Login",
            "description": "Users should be able to login with valid credentials",
            "acceptance_criteria": json.dumps([
                "Valid username and password",
                "Invalid password handling",
                "Account lockout after 3 failed attempts"
            ])
        },
        {
            "requirement_id": "REQ_002",
            "user_story_id": "US_002",
            "title": "Password Reset",
            "description": "Users can reset their password via email",
            "acceptance_criteria": json.dumps([
                "Request password reset email",
                "Reset link expires after 24 hours",
                "New password must meet complexity requirements"
            ])
        }
    ]
    
    test_cases = [
        {
            "id": "TEST_LOGIN_001",
            "user_story_id": "US_001",
            "title": "Test valid user login",
            "gherkin_scenario": """
            Given I am on the login page
            When I enter valid username and password
            Then I should be redirected to dashboard
            """,
            "framework": "selenium"
        },
        {
            "id": "TEST_LOGIN_002",
            "user_story_id": "US_001",
            "title": "Test invalid password handling",
            "gherkin_scenario": """
            Given I am on the login page
            When I enter invalid password
            Then I should see error message
            """,
            "framework": "cypress"
        },
        {
            "id": "TEST_RESET_001",
            "user_story_id": "US_002",
            "title": "Test password reset request",
            "gherkin_scenario": """
            Given I am on the password reset page
            When I enter my registered email
            Then I should receive reset email
            """,
            "framework": "playwright"
        }
    ]
    
    try:
        response = requests.post(
            f"{API_BASE}/rtm/generate",
            json={
                "requirements": requirements,
                "test_cases": test_cases
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"✓ Generated {len(result['rtm_links'])} RTM links")
            print(f"\nCoverage Summary:")
            summary = result['coverage_summary']
            print(f"  - Total Requirements: {summary['total_requirements']}")
            print(f"  - Covered: {summary['covered_requirements']}")
            print(f"  - Coverage: {summary['coverage_percentage']}%")
            
            print(f"\nSample Links:")
            for link in result['rtm_links'][:3]:
                print(f"  - {link['requirement_id']} ←→ {link['test_case_id']} ({link['similarity_score']})")
            
            return True
        else:
            print(f"✗ RTM generation failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def test_coverage_gaps():
    """Test coverage gap detection"""
    print("\n" + "="*60)
    print("TESTING COVERAGE GAP DETECTION")
    print("="*60)
    
    requirements = [
        {"requirement_id": "REQ_001", "title": "Login", "priority": "critical"},
        {"requirement_id": "REQ_002", "title": "Logout", "priority": "high"},
        {"requirement_id": "REQ_003", "title": "Settings", "priority": "medium"},
    ]
    
    rtm_links = [
        {"requirement_id": "REQ_001", "test_case_id": "TEST_001", "coverage_status": "covered"}
    ]
    
    try:
        response = requests.post(
            f"{API_BASE}/coverage-gaps",
            json={
                "requirements": requirements,
                "rtm_links": rtm_links
            }
        )
        
        if response.status_code == 200:
            result = response.json()
            
            print(f"✓ Detected {result['statistics']['total_gaps']} gaps")
            print(f"\nGap Statistics:")
            stats = result['statistics']
            print(f"  - By Type: {stats['by_type']}")
            print(f"  - By Severity: {stats['by_severity']}")
            print(f"  - Recommendations: {stats['recommendations_count']}")
            
            if result['gaps']:
                print(f"\nDetected Gaps:")
                for gap in result['gaps'][:3]:
                    print(f"  - {gap['requirement_id']}: {gap['gap_type']} ({gap['severity']})")
            
            return True
        else:
            print(f"✗ Gap detection failed with status {response.status_code}")
            return False
    except Exception as e:
        print(f"✗ Error: {e}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("COMPONENT 4 - TEST SUITE")
    print("ML-Based Test Quality & RTM")
    print("="*60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = []
    
    # Run tests
    results.append(("Health Check", test_health()))
    results.append(("Quality Prediction", test_quality_prediction()))
    results.append(("Batch Prediction", test_batch_prediction()))
    results.append(("RTM Generation", test_rtm_generation()))
    results.append(("Coverage Gaps", test_coverage_gaps()))
    
    # Summary
    print("\n" + "="*60)
    print("TEST SUMMARY")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for name, result in results:
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed}/{total} tests passed ({passed/total*100:.1f}%)")
    print("="*60)
    
    return passed == total


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)
