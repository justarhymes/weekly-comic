from datetime import date
from pprint import pprint
from app.services.metron import fetch_metron_issues_for_week

def main():
    issues = fetch_metron_issues_for_week(date.today())
    for issue in issues[:5]:
        print(f"🔍 Series for issue #{issue.number}:")
        pprint(issue)
        print("-" * 60)

if __name__ == "__main__":
    main()