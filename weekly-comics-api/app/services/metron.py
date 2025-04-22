# app/services/metron.py
import mokkari
from datetime import date, timedelta
from typing import List, Optional
from dotenv import load_dotenv
import os

load_dotenv()

USERNAME = os.getenv("METRON_USERNAME")
PASSWORD = os.getenv("METRON_PASSWORD")

api = mokkari.api(USERNAME, PASSWORD)

def get_week_range(target_date: date):
    monday = target_date - timedelta(days=target_date.weekday())
    sunday = monday + timedelta(days=6)
    return monday.isoformat(), sunday.isoformat()

def fetch_metron_issues_for_week(target_date: date, publisher: Optional[str] = None) -> List:
    start_date, end_date = get_week_range(target_date)
    filters = {
        "store_date_range_after": start_date,
        "store_date_range_before": end_date,
    }
    if publisher:
        filters["publisher_name"] = publisher

    base_issues = api.issues_list(filters)

    full_issues = []
    for base in base_issues:
        try:
            full = api.issue(base.id)
            full_issues.append(full)
        except Exception as e:
            print(f"⚠️ Failed to fetch details for issue {base.id}: {e}")

    return full_issues
