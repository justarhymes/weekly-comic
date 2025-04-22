import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import get_session
from app.db.test_utils import init_test_db, test_engine
from sqlmodel import Session
from typing import Generator
from tests.factories import make_fake_comic

# Dependency override
def override_get_session() -> Generator:
    with Session(test_engine) as session:
        yield session

app.dependency_overrides[get_session] = override_get_session

@pytest.fixture(scope="function", autouse=True)
def setup_test_db():
    init_test_db()

client = TestClient(app)

# --- TESTS ---

def test_create_comic():
    response = client.post("/comics/", json={
        "title": "Amazing Spider-Man",
        "publisher": "Marvel",
        "release_date": "2025-04-17",
        "issue_number": "5",
        "image": "https://example.com/image.jpg",
        "api_source": "custom",
        "is_custom": True
    })
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Amazing Spider-Man"
    assert "id" in data

def test_create_random_comic():
    fake_comic = make_fake_comic()
    response = client.post("/comics/", json=fake_comic.model_dump(mode="json")
)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == fake_comic.title
    assert "id" in data

def test_get_comics():
    # Insert a fake comic first
    client.post("/comics/", json=make_fake_comic().model_dump(mode="json"))
    response = client.get("/comics/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_single_comic():
    comic = make_fake_comic()
    post = client.post("/comics/", json=comic.model_dump(mode="json"))
    comic_id = post.json()["id"]
    response = client.get(f"/comics/{comic_id}")
    assert response.status_code == 200
    assert response.json()["id"] == comic_id
