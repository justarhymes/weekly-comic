from sqlmodel import SQLModel, create_engine, Session
import os
from dotenv import load_dotenv
from typing import Generator

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../.env.test"))

TEST_DATABASE_URL = os.getenv("DATABASE_URL")
test_engine = create_engine(TEST_DATABASE_URL, echo=False)

def init_test_db():
    print("🔄 Resetting test DB...")
    # Dispose existing connections
    test_engine.dispose()
    print("💣 Disposed test_engine connections")
    print("🔽 Dropping all tables...")
    SQLModel.metadata.drop_all(test_engine)
    print("📦 Creating all tables...")
    SQLModel.metadata.create_all(test_engine)
    print("✅ Test DB ready")


def get_test_session() -> Generator:
    print("🔧 Opening test DB session")
    with Session(test_engine) as session:
        yield session
    print("✅ Closed test DB session")

if __name__ == "__main__":
    init_test_db()