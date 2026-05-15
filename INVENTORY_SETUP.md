# Inventory Management System - Setup Guide

## Overview
This is a complete inventory management system inspired by [saucedemo.com](https://www.saucedemo.com/inventory.html), integrated with the existing NextGen QA Component 4 backend and frontend.

## Features

### ✅ Backend API (FastAPI - Port 8004)
- **GET `/inventory`** - Get all inventory items
  - Query params: `category` (filter by category), `low_stock` (show low stock only)
- **GET `/inventory/{item_id}`** - Get specific item details
- **GET `/inventory/stats`** - Get inventory statistics
- Sample data based on Sauce Labs products

### ✅ Frontend (React - Port 3000)
- **Inventory Page** - Full product catalog display
  - Grid view with product cards
  - Table view for detailed information
  - Category filtering (Clothing, Accessories)
  - Real-time stock status indicators
  - Responsive design with Material-UI
  - Statistics dashboard

## Quick Start

### Option 1: Start Everything Together (Recommended)
```bash
./start_all.sh
```

This single command will:
1. Check and clear ports 8004 and 3000
2. Start the backend API server
3. Start the frontend React app
4. Display access URLs

### Option 2: Start Separately

#### Terminal 1 - Backend:
```bash
cd component-4-quality
python -m uvicorn api.main:app --host 0.0.0.0 --port 8004 --reload
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

## Access Points

After starting:
- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:8004
- **API Documentation**: http://localhost:8004/docs
- **Inventory Endpoint**: http://localhost:8004/inventory

## Navigation

Once the app is running:
1. Open http://localhost:3000
2. Click on **"Inventory"** in the left sidebar menu
3. You'll see the Sauce Labs product catalog

## Available Views

### Grid View (Default)
- Product cards with images
- Price and stock information
- Status chips (Low/Medium/In Stock)
- Hover effects and animations

### Table View
- Detailed product information
- Sortable columns
- Compact layout for power users

## Filtering Options

1. **Category Filter**
   - All Categories
   - Clothing (T-shirts, Jackets, Onesies)
   - Accessories (Backpacks, Water Bottles, etc.)

2. **View Mode Toggle**
   - Switch between Grid and Table views

3. **Refresh Button**
   - Reload data from backend

## Sample Products

The system includes 8 Sauce Labs products:

| Product | Price | Category | Stock |
|---------|-------|----------|-------|
| Sauce Labs Backpack | $29.99 | Accessories | 50 |
| Sauce Labs Bike Light | $9.99 | Accessories | 75 |
| Sauce Labs Bolt T-Shirt | $15.99 | Clothing | 100 |
| Sauce Labs Fleece Jacket | $49.99 | Clothing | 30 |
| Sauce Labs Onesie | $7.99 | Clothing | 120 |
| Test.allTheThings() T-Shirt | $15.99 | Clothing | 200 |
| Sauce Labs Water Bottle | $11.99 | Accessories | 60 |
| Sauce Labs Laptop Bag | $39.99 | Accessories | 25 |

## Statistics Dashboard

The inventory page displays real-time statistics:
- **Total Products**: Count of all products
- **Inventory Value**: Total value of all stock
- **Categories**: Number of product categories
- **Low Stock Items**: Count of items with stock < 30 units

## API Examples

### Get All Inventory
```bash
curl http://localhost:8004/inventory
```

### Filter by Category
```bash
curl "http://localhost:8004/inventory?category=clothing"
```

### Get Low Stock Items
```bash
curl "http://localhost:8004/inventory?low_stock=true"
```

### Get Statistics
```bash
curl http://localhost:8004/inventory/stats
```

## Technology Stack

### Backend
- **Framework**: FastAPI
- **Data**: Python dictionaries (can be replaced with database)
- **Port**: 8004
- **CORS**: Enabled for localhost:3000

### Frontend
- **Framework**: React
- **UI Library**: Material-UI (MUI)
- **Icons**: Material-UI Icons
- **HTTP Client**: Fetch API
- **Port**: 3000

## Troubleshooting

### Backend won't start
```bash
# Check if port 8004 is in use
lsof -i:8004

# Kill the process if needed
kill -9 <PID>
```

### Frontend won't start
```bash
# Check if port 3000 is in use
lsof -i:3000

# Kill the process if needed
kill -9 <PID>

# Clear npm cache
npm cache clean --force
```

### CORS Errors
Make sure backend CORS settings allow your frontend origin:
- Backend runs on: `http://localhost:8004`
- Frontend runs on: `http://localhost:3000`
- CORS is configured in `api/main.py`

### Data Not Loading
1. Check backend is running: `curl http://localhost:8004/inventory`
2. Check browser console for errors
3. Verify network tab shows successful API calls

## Customization

### Add New Products
Edit `component-4-quality/data/inventory_data.py`:
```python
SAMPLE_INVENTORY_DATA = [
    # ... existing products ...
    {
        "id": 9,
        "name": "New Product",
        "description": "Product description",
        "price": 19.99,
        "image": "URL_TO_IMAGE",
        "stock": 50,
        "category": "accessories"
    }
]
```

### Change Stock Thresholds
In `Inventory.js`, modify `getStockColor` and `getStockLabel` functions:
```javascript
const getStockColor = (stock) => {
  if (stock < 20) return 'error';    // Changed from 30
  if (stock < 50) return 'warning';  // Changed from 60
  return 'success';
};
```

## Next Steps

1. ✅ **Completed**: Sample data generation
2. ✅ **Completed**: Backend API endpoints
3. ✅ **Completed**: Frontend inventory page
4. ✅ **Completed**: Backend-Frontend connection
5. 🔄 **Optional**: Connect to real database
6. 🔄 **Optional**: Add shopping cart functionality
7. 🔄 **Optional**: Add user authentication

## Support

For issues or questions:
1. Check API docs: http://localhost:8004/docs
2. Review browser console for frontend errors
3. Check backend terminal for API errors

---

**Created for NextGen QA - Component 4**
Inspired by Sauce Demo inventory system
