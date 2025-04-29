from sqlmodel import Session, select
from sqlalchemy.orm.attributes import flag_modified
from app.db.database import engine
from app.models import Comic
from app.utils.slugify import slugify

def backfill_slugs():
    session = Session(engine)

    try:
        comics = session.exec(select(Comic)).all()
        updated = 0

        for comic in comics:
            changed = False

            # Backfill comic slug
            if not comic.slug:
                comic.slug = slugify(f"{comic.series.get('name', '')}-{comic.issue_number}")
                changed = True

            # Backfill series slug
            if comic.series and "slug" not in comic.series:
                series_name = comic.series.get("name")
                if series_name:
                    comic.series["slug"] = slugify(series_name)
                    flag_modified(comic, "series")  # <-- ADD THIS
                    changed = True

            if changed:
                session.add(comic)
                updated += 1

        session.commit()
        print(f"✅ Backfilled slugs for {updated} comics.")

    except Exception as e:
        print(f"❌ Error during backfill: {e}")
        session.rollback()

    finally:
        session.close()

if __name__ == "__main__":
    backfill_slugs()
