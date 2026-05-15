# System Architecture - Component 4
## ML-Based Test Quality Prediction & RTM Generation

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         NextGen QA System                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Component 1  │  │ Component 2  │  │ Component 3  │          │
│  │ Voice/NLP   │→ │ Test Gen    │→ │ Self-Heal   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         ↓                  ↓                  ↑                  │
│         └──────────────────┼──────────────────┘                  │
│                            ↓                                     │
│                   ┌─────────────────┐                           │
│                   │  Component 4    │                           │
│                   │  Quality & RTM  │                           │
│                   └─────────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component 4 Detailed Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    Component 4 - Quality & RTM                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Frontend (React)                      │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │Dashboard │ │Quality   │ │   RTM    │ │ Coverage │   │  │
│  │  │          │ │Prediction│ │   View   │ │   Gaps   │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  │                     Port 3000                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕ HTTP/REST                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Backend API (FastAPI - Port 8004)            │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐         │  │
│  │  │  Quality   │  │    RTM     │  │   Coverage │         │  │
│  │  │ Endpoints  │  │  Endpoints │  │   Endpoints│         │  │
│  │  └────────────┘  └────────────┘  └────────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                 Core Business Logic Layer                 │  │
│  │  ┌────────────────┐ ┌──────────────┐ ┌───────────────┐  │  │
│  │  │TestQuality     │ │RTMGenerator  │ │GapDetector    │  │  │
│  │  │Predictor       │ │              │ │               │  │  │
│  │  │- ML Model      │ │- Semantic    │ │- Gap Analysis │  │  │
│  │  │- Feature Ext   │ │  Linking     │ │- Prioritization│ │  │
│  │  │- Scoring       │ │- Embeddings  │ │- Recommendations│ │  │
│  │  └────────────────┘ └──────────────┘ └───────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Machine Learning Layer                   │  │
│  │  ┌─────────────────┐  ┌────────────────────┐            │  │
│  │  │ Quality Model   │  │ Semantic Model     │            │  │
│  │  │ - Gradient      │  │ - Sentence         │            │  │
│  │  │   Boosting      │  │   Transformers     │            │  │
│  │  │ - Random Forest │  │ - BERT/RoBERTa     │            │  │
│  │  │ - XGBoost       │  │ - Cosine           │            │  │
│  │  └─────────────────┘  │   Similarity       │            │  │
│  │                       └────────────────────┘            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↕                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Data Access Layer                      │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │  PostgreSQL  │  │    Neo4j     │  │    Redis     │   │  │
│  │  │  (Primary)   │  │   (Graph)    │  │   (Cache)    │   │  │
│  │  │              │  │              │  │              │   │  │
│  │  │ - Test Cases │  │ - RTM Links  │  │ - Sessions   │   │  │
│  │  │ - Quality    │  │ - Traceability│  │ - Results   │   │  │
│  │  │   Scores     │  │ - Dependencies│  │              │   │  │
│  │  │ - Gaps       │  │              │  │              │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Architecture

### 1. Test Quality Prediction Flow

```
User Input (Frontend)
        ↓
[POST /quality/predict]
        ↓
QualityPredictor Class
        ↓
Feature Extraction
  - assertion_count
  - has_boundary_values
  - has_negative_test
  - step_count
  - has_error_handling
  - cyclomatic_complexity
  - has_setup_teardown
  - historical_pass_rate
        ↓
Feature Vector [8 features]
        ↓
ML Model (Gradient Boosting)
        ↓
Quality Score (0-100)
        ↓
Sub-score Calculation
  - Assertion Strength (0-30)
  - Code Coverage (0-20)
  - Boundary Testing (0-15)
  - Error Handling (0-15)
  - Mutation Resistance (0-20)
        ↓
Response JSON
  {quality_score, is_accepted, sub_scores, recommendation}
```

### 2. RTM Generation Flow

```
Requirements + Test Cases
        ↓
[POST /rtm/generate]
        ↓
RTMGenerator Class
        ↓
Text Extraction
  - Requirements: title + description + criteria
  - Tests: title + scenario + code
        ↓
Semantic Model (Sentence Transformers)
        ↓
Embedding Vectors (768 dimensions)
        ↓
Cosine Similarity Calculation
        ↓
Similarity Matrix [reqs × tests]
        ↓
Threshold Filtering (>0.75)
        ↓
RTM Links Creation
  - requirement_id
  - test_case_id
  - similarity_score
  - coverage_status
        ↓
Coverage Summary
  - Total requirements
  - Covered requirements
  - Coverage percentage
        ↓
Response JSON
```

### 3. Coverage Gap Detection Flow

```
Requirements + RTM Links
        ↓
[GET /coverage-gaps]
        ↓
GapDetector Class
        ↓
Coverage Analysis
  - Check each requirement
  - Find linked tests
        ↓
Gap Identification
  - Untested (no links)
  - Partially tested (weak links)
  - Missing error paths
        ↓
Severity Calculation
  - Based on requirement priority
  - Critical, High, Medium, Low
        ↓
Recommendation Generation
  - Specific test suggestions
  - Priority ordering
        ↓
Response JSON
  {gaps[], statistics, recommendations}
```

---

## Database Schema

### PostgreSQL Tables

```sql
-- Test Quality Records
CREATE TABLE test_quality (
    id UUID PRIMARY KEY,
    test_case_id UUID NOT NULL,
    quality_score FLOAT NOT NULL,
    assertion_strength FLOAT,
    code_coverage FLOAT,
    boundary_testing FLOAT,
    error_handling FLOAT,
    mutation_resistance FLOAT,
    prediction_timestamp TIMESTAMP,
    is_accepted BOOLEAN
);

-- RTM Links
CREATE TABLE rtm_links (
    id UUID PRIMARY KEY,
    requirement_id TEXT NOT NULL,
    test_case_id UUID NOT NULL,
    similarity_score FLOAT,
    coverage_status VARCHAR(20),
    link_type VARCHAR(50),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Coverage Gaps
CREATE TABLE coverage_gaps (
    id UUID PRIMARY KEY,
    requirement_id TEXT NOT NULL,
    gap_type VARCHAR(50),
    severity VARCHAR(20),
    description TEXT,
    recommended_tests JSONB,
    detected_at TIMESTAMP,
    status VARCHAR(20)
);
```

### Neo4j Graph Nodes

```cypher
// Requirement Node
(:Requirement {
    id: "REQ_001",
    title: "User Login",
    priority: "critical",
    status: "approved"
})

// Test Case Node
(:TestCase {
    id: "TEST_001",
    title: "Test login",
    framework: "selenium",
    quality_score: 85.5
})

// Relationships
(:Requirement)-[:COVERED_BY {
    similarity: 0.92,
    status: "covered",
    created: timestamp()
}]->(:TestCase)
```

---

## Technology Stack Details

### Backend Technologies

```
Python 3.10+
├── FastAPI 0.104          # Web framework
├── SQLAlchemy 2.0         # ORM
├── scikit-learn 1.3       # ML library
├── XGBoost 2.0            # Gradient boosting
├── sentence-transformers  # NLP embeddings
├── pandas 2.1             # Data manipulation
└── joblib                 # Model persistence
```

### Frontend Technologies

```
React 18
├── Material-UI 5          # UI components
├── Recharts 2.10          # Data visualization
├── Axios 1.6              # HTTP client
├── React Router 6         # Navigation
└── Emotion 11             # Styling
```

### Infrastructure

```
Docker Compose
├── PostgreSQL 15          # Primary database
├── Neo4j 5.15             # Graph database
├── Redis 7                # Cache layer
├── Python 3.10-slim       # Backend runtime
└── Nginx alpine           # Frontend server
```

---

## Deployment Architecture

### Development Environment

```
Local Machine
├── Docker Desktop
│   ├── postgres:5432
│   ├── neo4j:7687
│   ├── redis:6379
│   └── backend:8004
└── npm start
    └── frontend:3000
```

### Production Environment (Cloud)

```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer
│   └── Routes to frontend
├── Frontend Cluster
│   └── Nginx containers
├── Backend Cluster
│   └── FastAPI containers (auto-scaling)
├── Database Layer
│   ├── RDS PostgreSQL (managed)
│   ├── Neo4j Aura (managed)
│   └── ElastiCache Redis (managed)
└── ML Inference
    └── GPU instances for models
```

---

## Security Architecture

```
┌─────────────────────────────────────────┐
│           Security Layers                │
├─────────────────────────────────────────┤
│ 1. Network Security                     │
│    - VPC isolation                      │
│    - Security groups                    │
│    - HTTPS/TLS encryption               │
├─────────────────────────────────────────┤
│ 2. Application Security                 │
│    - API key authentication             │
│    - Rate limiting                      │
│    - Input validation                   │
│    - CORS policies                      │
├─────────────────────────────────────────┤
│ 3. Data Security                        │
│    - Encryption at rest                 │
│    - Encryption in transit              │
│    - Database access controls           │
│    - Secrets management                 │
├─────────────────────────────────────────┤
│ 4. ML Security                          │
│    - Model integrity checks             │
│    - Adversarial robustness             │
│    - Data privacy                       │
└─────────────────────────────────────────┘
```

---

## Performance Optimization

### Caching Strategy

```
Redis Cache Layers
├── API Response Cache (5 min TTL)
│   └── Health checks, static data
├── ML Model Cache (persistent)
│   └── Loaded models stay in memory
├── Embedding Cache (1 hour TTL)
│   └── Semantic embeddings for requirements
└── Session Cache (30 min TTL)
    └── User sessions and preferences
```

### Database Optimization

```
PostgreSQL
├── Indexes on frequently queried columns
│   - test_case_id
│   - requirement_id
│   - quality_score
├── Connection pooling (20 connections)
└── Query optimization with EXPLAIN ANALYZE

Neo4j
├── Indexes on node IDs
├── Relationship indexes
└── Graph caching for frequent traversals
```

---

## Monitoring & Observability

```
Monitoring Stack
├── Application Metrics
│   ├── API response times
│   ├── Error rates
│   ├── Request counts
│   └── ML inference latency
├── Database Metrics
│   ├── Query performance
│   ├── Connection pool usage
│   └── Storage growth
├── System Metrics
│   ├── CPU utilization
│   ├── Memory usage
│   └── Disk I/O
└── Business Metrics
    ├── Tests analyzed count
    ├── Average quality scores
    ├── RTM coverage %
    └── Gaps detected count
```

---

This architecture ensures:
- ✅ Scalability (horizontal scaling ready)
- ✅ High Availability (redundant components)
- ✅ Performance (caching, optimization)
- ✅ Security (multiple layers)
- ✅ Maintainability (modular design)
- ✅ Observability (comprehensive monitoring)
