import os
import sys
from datetime import date

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.metron import fetch_metron_issues_for_week

issues = fetch_metron_issues_for_week(date.today(), publisher="marvel")
for issue in issues:
    print(f"{issue.id} | {issue.issue_name} | {issue.store_date}")