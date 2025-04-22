import mokkari

# Replace these with your actual Metron Cloud credentials
USERNAME = "justarhymes"
PASSWORD = "pyr4JRB-xnh9gxa9cry"

# Create API instance
api = mokkari.api(USERNAME, PASSWORD)

# Example: get Marvel comics released in a given date range
comics = api.issues_list({
    "store_date_range_after": "2021-06-07",
    "store_date_range_before": "2021-06-13",
    "publisher_name": "marvel"
})

for issue in comics:
    print(f"{issue.id} {issue.issue_name}")