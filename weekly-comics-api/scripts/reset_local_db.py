import os
import sys
from sqlmodel import SQLModel
from pathlib import Path

# allow import from app/
sys.path.append(str(Path(__file__).resolve().parent.parent))

from app.db.database import engine
from app.models import Comic  # ensures model fields are registered

env = os.getenv("ENV", "local")
print(f"⚠️ Resetting database for environment: {env}")

if env not in ["local", "test", "development"]:
    raise RuntimeError("This script should not be run in production.")

SQLModel.metadata.drop_all(engine)
print("🧨 All tables dropped.")

SQLModel.metadata.create_all(engine)
print("✅ Tables recreated successfully.")
