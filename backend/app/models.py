from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
from .database import Base

class FoodScan(Base):
    __tablename__ = "food_scans"

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String)
    scan_result = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    food_type = Column(String)  # 'packaged' or 'raw'