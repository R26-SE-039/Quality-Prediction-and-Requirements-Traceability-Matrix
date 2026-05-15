"""
Database Setup and Models for Component 4
Implements PostgreSQL schema for test quality and RTM storage
"""

from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, ForeignKey, Text, Boolean, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./nextgen_qa.db")

# Use SQLite for development, PostgreSQL for production
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ===== Component 4 Database Models =====

class TestQuality(Base):
    """Stores test quality predictions and scores"""
    __tablename__ = "test_quality"

    id = Column(String, primary_key=True, index=True)
    test_case_id = Column(String, ForeignKey("test_cases.id"), nullable=False)
    quality_score = Column(Float, nullable=False)  # 0-100
    assertion_strength = Column(Float)
    code_coverage = Column(Float)
    boundary_testing = Column(Float)
    error_handling = Column(Float)
    mutation_resistance = Column(Float)
    prediction_timestamp = Column(DateTime, default=datetime.utcnow)
    is_accepted = Column(Boolean, default=True)  # True if score >= MIN_QUALITY_SCORE

    # Relationships
    test_case = relationship("TestCase", back_populates="quality_scores")


class RTMLink(Base):
    """Requirements Traceability Matrix links"""
    __tablename__ = "rtm_links"

    id = Column(String, primary_key=True, index=True)
    requirement_id = Column(String, nullable=False, index=True)
    test_case_id = Column(String, ForeignKey("test_cases.id"), nullable=False)
    similarity_score = Column(Float)
    coverage_status = Column(String, default="pending")  # covered, partial, untested
    link_type = Column(String)  # requirement-test, test-code, acceptance-test
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    test_case = relationship("TestCase", back_populates="rtm_links")


class CoverageGap(Base):
    """Detected coverage gaps"""
    __tablename__ = "coverage_gaps"

    id = Column(String, primary_key=True, index=True)
    requirement_id = Column(String, nullable=False, index=True)
    gap_type = Column(String)  # untested, partially_tested, missing_error_path
    severity = Column(String)  # critical, high, medium, low
    description = Column(Text)
    recommended_tests = Column(JSON)
    detected_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="open")  # open, in_progress, resolved


class TestCase(Base):
    """Test case information (mirrored from Component 2)"""
    __tablename__ = "test_cases"

    id = Column(String, primary_key=True, index=True)
    user_story_id = Column(String)  # Removed FK - Component 2 manages user_stories
    title = Column(Text)
    gherkin_scenario = Column(Text)
    framework = Column(String)  # selenium/cypress/playwright
    generated_code = Column(Text)
    quality_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    quality_scores = relationship("TestQuality", back_populates="test_case")
    rtm_links = relationship("RTMLink", back_populates="test_case")


def get_db():
    """Dependency for FastAPI to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database - create all tables"""
    print("Creating database tables...")
    # Import all models to ensure they're registered
    from database.models import TestQuality, RTMLink, CoverageGap, TestCase
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")


if __name__ == "__main__":
    # Run this script to create tables
    init_db()
