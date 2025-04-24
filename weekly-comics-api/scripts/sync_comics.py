# scripts/sync_comics.py

import argparse
from datetime import date, timedelta
from app.db.database import engine
from sqlmodel import Session, select
from app.models import Comic
from app.services.metron import fetch_metron_issues_for_week
from app.utils.comic_builder import build_comic_data


def sync_weekly_comics(week: str, publisher: str | None = None, dry_run: bool = False):
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

    session = Session(engine)

    for issue in issues:
        comic_data = build_comic_data(issue)
        existing = session.exec(
            select(Comic).where(Comic.metron_id == comic_data["metron_id"])
        ).first()

        if existing:
            for key, value in comic_data.items():
                setattr(existing, key, value)
            print(f"🔄 Would update: {comic_data['title']}" if dry_run else f"🔄 Updated comic: {comic_data['title']}")
            if not dry_run:
                session.add(existing)
        else:
            print(f"➕ Would add: {comic_data['title']}" if dry_run else f"➕ Added comic: {comic_data['title']}")
            if not dry_run:
                session.add(Comic(**comic_data))

    if not dry_run:
        session.commit()
    else:
        print("✅ Dry run complete. No changes committed.")

    session.close()
    print("✅ Sync complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sync comics for a given week.")
    parser.add_argument("--week", type=str, default="new", help="Specify 'new', 'previous', or an ISO date (YYYY-MM-DD)")
    parser.add_argument("--publisher", type=str, help="(Optional) Filter by publisher")
    parser.add_argument("--dry-run", action="store_true", help="Run sync in dry run mode")
    args = parser.parse_args()
    sync_weekly_comics(args.week, args.publisher, dry_run=args.dry_run)
