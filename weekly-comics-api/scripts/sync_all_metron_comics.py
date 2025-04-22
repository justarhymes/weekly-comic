import sys
import os
from datetime import date
from sqlmodel import Session, SQLModel, select
from app.db.database import engine
from app.models import Comic
from app.services.metron import api
from app.routes.comics import nested_get

def sync_all_metron_comics(start_year: int):
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
                    series = issue.series
                    comic_data = dict(
                        title=f"{series.name} #{issue.number}",
                        publisher=series.name,
                        release_date=issue.cover_date,
                        issue_number=issue.number,
                        image=str(getattr(issue, "image", None)) if getattr(issue, "image", None) else None,
                        api_source="metron",
                        is_custom=False,
                        summary=getattr(issue, "desc", None),
                        page_count=issue.page_count,
                        price=issue.price,
                        rating=nested_get(issue, "rating", "name"),
                        distributor_sku=getattr(issue, "sku", None),
                        upc=issue.upc,
                        metron_id=issue.id,
                        comicvine_id=getattr(issue, "cv_id", None),
                        gcd_id=issue.gcd_id,
                        series_name=series.name
                    )

                    exists = session.exec(
                        select(Comic).where(
                            Comic.title == comic_data["title"],
                            Comic.publisher == comic_data["publisher"],
                            Comic.release_date == comic_data["release_date"]
                        )
                    ).first()

                    if exists:
                        updated = False
                        for key, value in comic_data.items():
                            if getattr(exists, key) != value:
                                setattr(exists, key, value)
                                updated = True
                        if updated:
                            print(f"🔄 Updated comic: {comic_data['title']}")
                            session.add(exists)
                    else:
                        print(f"➕ Adding comic: {comic_data['title']}")
                        session.add(Comic(**comic_data))
                except Exception as e:
                    print(f"⚠️ Failed to fetch details for issue {base.id}: {e}")

            session.commit()

if __name__ == "__main__":
    # Usage: python -m scripts.sync_all_metron_comics --year=2005
    import argparse
    parser = argparse.ArgumentParser(description="Sync all Metron comics by year")
    parser.add_argument("--year", type=int, default=2000, help="Starting year (default: 2000)")
    args = parser.parse_args()
    sync_all_metron_comics(args.year)
