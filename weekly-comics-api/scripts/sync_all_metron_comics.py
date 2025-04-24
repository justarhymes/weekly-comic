import sys
import os
from datetime import date
from sqlmodel import Session, SQLModel, select
from app.db.database import engine
from app.models import Comic
from app.services.metron import api
from app.utils.comic_builder import build_comic_data

def sync_all_metron_comics(start_year: int, dry_run: bool = False):
    with Session(engine) as session:
        for year in range(start_year, date.today().year + 1):
            print(f"\n📅 Syncing year: {year}")
            filters = {
                "store_date_range_after": f"{year}-01-01",
                "store_date_range_before": f"{year}-12-31"
            }

            try:
                base_issues = api.issues_list(filters)
                print(f"Found {len(base_issues)} base issues for {year}")
            except Exception as e:
                print(f"⚠️ Failed to fetch issues for {year}: {e}")
                continue

            for base in base_issues:
                try:
                    issue = api.issue(base.id)
                    comic_data = build_comic_data(issue)
                    exists = session.exec(
                        select(Comic).where(Comic.metron_id == comic_data["metron_id"])
                    ).first()

                    if exists:
                        for key, value in comic_data.items():
                            setattr(exists, key, value)
                        print(f"🔄 Would update: {comic_data['title']}" if dry_run else f"🔄 Updated comic: {comic_data['title']}")
                        if not dry_run:
                            session.add(exists)
                    else:
                        print(f"➕ Would add: {comic_data['title']}" if dry_run else f"➕ Adding comic: {comic_data['title']}")
                        if not dry_run:
                            session.add(Comic(**comic_data))
                except Exception as e:
                    print(f"⚠️ Failed to fetch details for issue {base.id}: {e}")

            if not dry_run:
                session.commit()
            else:
                print("✅ Dry run complete. No changes committed.")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Sync all Metron comics by year")
    parser.add_argument("--year", type=int, default=2000, help="Starting year (default: 2000)")
    parser.add_argument("--dry-run", action="store_true", help="Run sync in dry run mode")
    args = parser.parse_args()
    sync_all_metron_comics(args.year, dry_run=args.dry_run)
