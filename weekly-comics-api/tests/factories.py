from faker import Faker
from app.models import Comic
from datetime import date
import random

faker = Faker()

def make_fake_comic(**overrides) -> Comic:
    return Comic(
        title=overrides.get("title", faker.sentence(nb_words=3)),
        publisher=overrides.get("publisher", faker.company()),
        release_date=overrides.get("release_date", faker.date_this_year()),
        issue_number=overrides.get("issue_number", str(random.randint(1, 100))),
        image=overrides.get("image", faker.image_url()),
        api_source=overrides.get("api_source", "test"),
        is_custom=overrides.get("is_custom", False),
    )
