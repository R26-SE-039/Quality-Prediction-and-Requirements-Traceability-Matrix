"""
Component 4 - ML-Based Test Quality & RTM API
FastAPI Backend Service
Port: 8004
"""

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import os
import json
import csv
from datetime import datetime

from config.settings import settings
from database.models import init_db, get_db
from core.quality_predictor import TestQualityPredictor
from core.rtm_generator import RTMGenerator
from core.gap_detector import CoverageGapDetector
from data.inventory_data import get_inventory, get_item_by_id, filter_by_category, get_low_stock_items

# Initialize FastAPI app
app = FastAPI(
    title="NextGen QA - Component 4",
    description="ML-Based Test Quality Prediction & RTM Generation",
    version="1.0.0",
    port=settings.C4_SERVICE_PORT
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
quality_predictor = None
rtm_generator = None
gap_detector = None


@app.on_event("startup")
async def startup_event():
    """Initialize components on startup"""
    global quality_predictor, rtm_generator, gap_detector
    
    print("="*60)
    print("COMPONENT 4 - STARTUP")
    print("="*60)
    
    # Initialize database
    init_db()
    
    # Initialize ML predictor
    try:
        quality_predictor = TestQualityPredictor()
        print("✓ Quality Predictor initialized")
    except Exception as e:
        print(f"✗ Quality Predictor initialization failed: {e}")
        quality_predictor = None
    
    # Initialize RTM generator
    try:
        rtm_generator = RTMGenerator()
        print("✓ RTM Generator initialized")
    except Exception as e:
        print(f"✗ RTM Generator initialization failed: {e}")
        rtm_generator = None
    
    # Initialize gap detector
    gap_detector = CoverageGapDetector()
    print("✓ Gap Detector initialized")
    
    print("="*60)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "component": "Component 4 - Quality & RTM",
        "port": settings.C4_SERVICE_PORT,
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "quality_prediction": quality_predictor is not None,
            "rtm_generation": rtm_generator is not None,
            "gap_detection": gap_detector is not None
        }
    }


# ==================== QUALITY PREDICTION ENDPOINTS ====================

@app.post("/quality/predict")
async def predict_test_quality(test_case: Dict):
    """
    Predict quality score for a test case
    
    Args:
        test_case: Test case data with features
        
    Returns:
        Quality prediction results
    """
    if not quality_predictor:
        raise HTTPException(status_code=503, detail="Quality predictor not initialized")
    
    try:
        result = quality_predictor.predict_quality(test_case)
        return {
            "success": True,
            "prediction": result,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/quality/predict/batch")
async def predict_batch_quality(test_cases: List[Dict]):
    """
    Predict quality scores for multiple test cases
    
    Args:
        test_cases: List of test case data
        
    Returns:
        List of quality predictions
    """
    if not quality_predictor:
        raise HTTPException(status_code=503, detail="Quality predictor not initialized")
    
    try:
        results = quality_predictor.predict_batch(test_cases)
        return {
            "success": True,
            "predictions": results,
            "count": len(results),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/quality/predict-file")
async def predict_quality_from_file(file: UploadFile = File(...)):
    """
    Predict quality score from uploaded test case file (JSON/CSV)
    
    Args:
        file: Uploaded test case file
        
    Returns:
        Quality prediction results
    """
    if not quality_predictor:
        raise HTTPException(status_code=503, detail="Quality predictor not initialized")
    
    try:
        contents = await file.read()
        file_extension = file.filename.split('.')[-1].lower()
        
        test_cases = []
        
        if file_extension == 'json':
            data = json.loads(contents)
            # Handle both single test case and array of test cases
            if isinstance(data, list):
                test_cases = data
            elif 'test_cases' in data:
                test_cases = data['test_cases']
            else:
                test_cases = [data]
        elif file_extension in ['csv', 'xlsx', 'xls']:
            if file_extension == 'csv':
                # Parse CSV
                decoded = contents.decode('utf-8')
                reader = csv.DictReader(decoded.splitlines())
                for row in reader:
                    # Convert string values to appropriate types
                    test_case = {
                        'id': row.get('id', 'UNKNOWN'),
                        'assertion_count': int(row.get('assertion_count', 0)),
                        'has_boundary_values': row.get('has_boundary_values', 'false').lower() == 'true',
                        'has_negative_test': row.get('has_negative_test', 'false').lower() == 'true',
                        'step_count': int(row.get('step_count', 0)),
                        'has_error_handling': row.get('has_error_handling', 'false').lower() == 'true',
                        'cyclomatic_complexity': float(row.get('cyclomatic_complexity', 0)),
                        'has_setup_teardown': row.get('has_setup_teardown', 'false').lower() == 'true',
                        'historical_pass_rate': float(row.get('historical_pass_rate', 0))
                    }
                    test_cases.append(test_case)
            else:
                raise HTTPException(status_code=400, detail=f"File format .{file_extension} not yet supported. Use JSON or CSV.")
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported file format: .{file_extension}. Use JSON or CSV.")
        
        if not test_cases:
            raise HTTPException(status_code=400, detail="No test cases found in file")
        
        # Predict quality for first test case (or all if batch)
        if len(test_cases) == 1:
            result = quality_predictor.predict_quality(test_cases[0])
            return {
                "success": True,
                "prediction": result,
                "test_case": test_cases[0],
                "timestamp": datetime.utcnow().isoformat()
            }
        else:
            # Return batch results
            results = quality_predictor.predict_batch(test_cases)
            return {
                "success": True,
                "predictions": results,
                "test_cases": test_cases,
                "count": len(results),
                "timestamp": datetime.utcnow().isoformat()
            }
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid JSON format")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== RTM ENDPOINTS ====================

@app.get("/rtm")
async def get_rtm():
    """Get current Requirements Traceability Matrix"""
    # In production, this would query the database
    return {
        "success": True,
        "message": "RTM retrieval endpoint - implement database query",
        "data": []
    }


@app.post("/rtm/generate")
async def generate_rtm(requirements: List[Dict], test_cases: List[Dict]):
    """
    Generate Requirements Traceability Matrix
    
    Args:
        requirements: List of requirements
        test_cases: List of test cases
        
    Returns:
        Generated RTM links and coverage summary
    """
    if not rtm_generator:
        raise HTTPException(status_code=503, detail="RTM generator not initialized")
    
    try:
        # Generate RTM links
        rtm_links = rtm_generator.generate_rtm_links(requirements, test_cases)
        
        # Get coverage summary
        coverage_summary = rtm_generator.get_coverage_summary(requirements, rtm_links)
        
        return {
            "success": True,
            "rtm_links": rtm_links,
            "coverage_summary": coverage_summary,
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== COVERAGE GAP ENDPOINTS ====================

@app.get("/coverage-gaps")
async def get_coverage_gaps(requirements: List[Dict] = None, rtm_links: List[Dict] = None):
    """
    Detect coverage gaps
    
    Args:
        requirements: Optional list of requirements
        rtm_links: Optional list of RTM links
        
    Returns:
        Detected gaps and statistics
    """
    if not gap_detector:
        raise HTTPException(status_code=503, detail="Gap detector not initialized")
    
    # Use sample data if not provided
    if not requirements:
        requirements = [
            {
                "requirement_id": "REQ_001",
                "title": "User Authentication",
                "description": "Users should be able to login with valid credentials",
                "priority": "critical",
                "acceptance_criteria": ["Valid login succeeds", "Invalid login fails", "Password validation"]
            },
            {
                "requirement_id": "REQ_002",
                "title": "Payment Processing",
                "description": "System should process payments securely",
                "priority": "critical",
                "acceptance_criteria": ["Credit card validation", "Transaction logging", "Error handling"]
            },
            {
                "requirement_id": "REQ_003",
                "title": "Product Search",
                "description": "Users can search for products",
                "priority": "high",
                "acceptance_criteria": ["Search by name", "Filter by category", "Sort results"]
            },
            {
                "requirement_id": "REQ_004",
                "title": "Shopping Cart",
                "description": "Users can add items to cart",
                "priority": "high",
                "acceptance_criteria": ["Add items", "Remove items", "Update quantity"]
            },
            {
                "requirement_id": "REQ_005",
                "title": "Order History",
                "description": "Users can view past orders",
                "priority": "medium",
                "acceptance_criteria": ["View orders", "Filter by date", "Download invoice"]
            },
            {
                "requirement_id": "REQ_006",
                "title": "User Profile",
                "description": "Users can manage their profile",
                "priority": "medium",
                "acceptance_criteria": ["Update name", "Change email", "Upload avatar"]
            },
            {
                "requirement_id": "REQ_007",
                "title": "Email Notifications",
                "description": "Send email notifications for orders",
                "priority": "high",
                "acceptance_criteria": ["Order confirmation", "Shipping update", "Delivery notification"]
            },
            {
                "requirement_id": "REQ_008",
                "title": "Inventory Management",
                "description": "Track product inventory levels",
                "priority": "medium",
                "acceptance_criteria": ["Stock tracking", "Low stock alerts", "Restock notifications"]
            }
        ]
    
    if not rtm_links:
        rtm_links = [
            {"requirement_id": "REQ_001", "coverage_status": "full"},
            {"requirement_id": "REQ_003", "coverage_status": "full"},
            {"requirement_id": "REQ_003", "coverage_status": "partial"},
            {"requirement_id": "REQ_004", "coverage_status": "full"},
            {"requirement_id": "REQ_006", "coverage_status": "partial"},
        ]
    
    try:
        gaps = gap_detector.detect_gaps(requirements, rtm_links)
        stats = gap_detector.get_gap_statistics(gaps)
        prioritized = gap_detector.prioritize_gaps(gaps)
        
        return {
            "success": True,
            "gaps": prioritized,
            "statistics": stats,
            "detected_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== REPORT ENDPOINTS ====================

@app.get("/reports/summary")
async def get_quality_summary():
    """Get summary report of test quality metrics"""
    return {
        "success": True,
        "report": {
            "total_tests_analyzed": 0,
            "average_quality_score": 0,
            "accepted_tests": 0,
            "rejected_tests": 0,
            "message": "Implement database queries for actual metrics"
        }
    }


# ==================== INVENTORY ENDPOINTS ====================

@app.get("/inventory/stats")
async def get_inventory_statistics():
    """
    Get inventory statistics and summary
    
    Returns:
        Inventory statistics including total items, categories, stock levels
    """
    try:
        all_items = get_inventory()
        low_stock = get_low_stock_items()
        
        # Calculate statistics
        total_value = sum(item["price"] * item["stock"] for item in all_items)
        categories = list(set(item["category"] for item in all_items))
        
        stats = {
            "total_items": len(all_items),
            "total_stock": sum(item["stock"] for item in all_items),
            "total_inventory_value": round(total_value, 2),
            "categories": categories,
            "low_stock_count": len(low_stock),
            "average_price": round(sum(item["price"] for item in all_items) / len(all_items), 2),
            "items_by_category": {}
        }
        
        # Count items per category
        for category in categories:
            count = len([item for item in all_items if item["category"] == category])
            stats["items_by_category"][category] = count
        
        return {
            "success": True,
            "statistics": stats,
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/inventory")
async def get_all_inventory(category: str = None, low_stock: bool = False):
    """
    Get all inventory items with optional filtering
    
    Args:
        category: Filter by category (optional)
        low_stock: Show only low stock items (optional)
        
    Returns:
        List of inventory items
    """
    try:
        if low_stock:
            items = get_low_stock_items()
        elif category:
            items = filter_by_category(category)
        else:
            items = get_inventory()
        
        return {
            "success": True,
            "data": items,
            "count": len(items),
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/inventory/{item_id}")
async def get_inventory_item(item_id: int):
    """
    Get a specific inventory item by ID
    
    Args:
        item_id: Item ID to retrieve
        
    Returns:
        Inventory item details
    """
    try:
        item = get_item_by_id(item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        return {
            "success": True,
            "data": item,
            "timestamp": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "api.main:app",
        host="0.0.0.0",
        port=settings.C4_SERVICE_PORT,
        reload=True
    )
