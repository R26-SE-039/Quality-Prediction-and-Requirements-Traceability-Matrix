# Component 4 - ML-Based Test Quality & Automated RTM
## Student: Rashani K.G.M (IT22182678)

This component predicts test quality scores (0-100) and automatically generates Requirements Traceability Matrices.

### Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
python database/setup_database.py

# Train ML models
python ml/train_quality_model.py

# Start the service
uvicorn api.main:app --host 0.0.0.0 --port 8004 --reload
```

### API Endpoints

- `POST /quality/predict` - Predict test quality score
- `GET /rtm` - Get Requirements Traceability Matrix
- `POST /rtm/generate` - Generate new RTM
- `GET /coverage-gaps` - Detect coverage gaps
- `GET /health` - Health check

### Project Structure

```
component-4-quality/
├── api/                  # FastAPI endpoints
├── core/                 # Business logic
├── ml/                   # ML models and training
├── graph/                # Neo4j graph operations
├── reports/              # Report generation
├── database/             # Database setup and models
├── tests/                # Unit and integration tests
└── config/               # Configuration files
```
