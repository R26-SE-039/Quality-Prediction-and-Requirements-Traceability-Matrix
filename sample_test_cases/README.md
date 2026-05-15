# Sample Test Cases for Quality Prediction

## Files Overview

### Single Test Case Files

1. **test_case_good.json** - Good Quality Test Case
   - Quality Score: ~82 (Good)
   - 5 assertions, 8 steps
   - Has boundary values, negative testing, error handling
   - Historical pass rate: 85%

2. **test_case_poor.json** - Poor Quality Test Case
   - Quality Score: ~35 (Poor)
   - 2 assertions, 3 steps
   - Missing quality indicators
   - Historical pass rate: 45%

3. **test_case_excellent.json** - Excellent Quality Test Case
   - Quality Score: ~92 (Excellent)
   - 8 assertions, 12 steps
   - All quality indicators enabled
   - Historical pass rate: 95%

### Multiple Test Cases

4. **multiple_test_cases.json** - Contains 5 test cases with varying quality levels
   - TEST_001: Good quality
   - TEST_002: Poor quality
   - TEST_003: Excellent quality
   - TEST_004: Fair quality
   - TEST_005: Excellent quality

## How to Use

1. Go to Quality Prediction page
2. Click "Upload File" tab
3. Click "Upload Test Case" button
4. Select any JSON file from this folder
5. View Quality Prediction Results

## JSON Structure

Each test case must contain these fields:
```json
{
  "id": "TEST_001",
  "assertion_count": 5,
  "has_boundary_values": true,
  "has_negative_test": true,
  "step_count": 8,
  "has_error_handling": true,
  "cyclomatic_complexity": 4.5,
  "has_setup_teardown": true,
  "historical_pass_rate": 0.85
}
```

### Field Descriptions
- **id**: Test case identifier (string)
- **assertion_count**: Number of assertions (number)
- **has_boundary_values**: Tests boundary conditions (boolean)
- **has_negative_test**: Includes negative test scenarios (boolean)
- **step_count**: Number of test steps (number)
- **has_error_handling**: Tests error scenarios (boolean)
- **cyclomatic_complexity**: Code complexity metric (number)
- **has_setup_teardown**: Has setup/teardown methods (boolean)
- **historical_pass_rate**: Historical pass rate 0-1 (number)
