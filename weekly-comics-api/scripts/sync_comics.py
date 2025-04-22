import argparse
from datetime import date, timedelta
from app.db.database import SessionLocal
from app.services.metron import fetch_metron_issues_for_week
from app.models import Comic
from app.routes.comics import nested_get


def sync_weekly_comics(week: str, publisher: str | None = None):
    today = date.today()

    if week == "new":
        target_date = today
    elif week == "previous":
        target_date = today - timedelta(days=7)
    else:
        try:
            target_date = date.fromisoformat(week)
        except ValueError:
            raise ValueError("Invalid date format. Use YYYY-MM-DD, 'new', or 'previous'")

    issues = fetch_metron_issues_for_week(target_date, publisher=publisher)
    print(f"Found {len(issues)} issues for week: {target_date.isoformat()} (Publisher: {publisher or 'All'})")

    session = SessionLocal()

    for issue in issues:
        title = f"{nested_get(issue, 'series.name')} #{nested_get(issue, 'number')}"
        release_date = nested_get(issue, "store_date")

        existing = session.query(Comic).filter_by(title=title, release_date=release_date).first()

        data = Comic(
            title=title,
            publisher=nested_get(issue, "publisher.name"),
            release_date=release_date,
            issue_number=nested_get(issue, "number"),
            image=str(nested_get(issue, "image")) if nested_get(issue, "image") else None,
            api_source="metron",
            is_custom=False,
            summary=nested_get(issue, "desc"),
            page_count=nested_get(issue, "page_count"),
            price=float(nested_get(issue, "price")) if nested_get(issue, "price") else None,
            rating=nested_get(issue, "rating.name"),
            distributor_sku=nested_get(issue, "sku"),
            upc=nested_get(issue, "upc"),
            metron_id=nested_get(issue, "id"),
            comicvine_id=nested_get(issue, "cv_id"),
            gcd_id=nested_get(issue, "gcd_id"),
            series_name=nested_get(issue, "series.name")
        )

        if existing:
            for field in data.model_fields:
                setattr(existing, field, getattr(data, field))
            print(f"🔁 Updated: {title}")
        else:
            session.add(data)
            print(f"➕ Added: {title}")

    session.commit()
    session.close()
    print("✅ Sync complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sync comics for a given week.")
    parser.add_argument("--week", type=str, default="new", help="Specify 'new', 'previous', or an ISO date (YYYY-MM-DD)")
    parser.add_argument("--publisher", type=str, help="(Optional) Filter by publisher")

    args = parser.parse_args()
    sync_weekly_comics(args.week, args.publisher)
