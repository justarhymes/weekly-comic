from mokkari.clients import MetronClient

client = MetronClient()

def fetch_recent_releases():
    releases = client.releases.list()
    for release in releases[:5]:
        print({
            "title": release.title,
            "publisher": release.publisher.name if release.publisher else None,
            "release_date": release.release_date,
            "issue_number": release.issue_number,
            "image": release.cover_url,
        })

if __name__ == "__main__":
    fetch_recent_releases()
