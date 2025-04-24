from app.utils.nested import nested_get

def build_comic_data(issue):
    series = issue.series

    return {
        "title": f"{series.name} #{issue.number}",
        "release_date": nested_get(issue, "store_date"),
        "issue_number": issue.number,
        "image": str(getattr(issue, "image", None)) if getattr(issue, "image", None) else None,
        "api_source": "metron",
        "is_custom": False,
        "summary": getattr(issue, "desc", None),
        "page_count": issue.page_count,
        "price": issue.price,
        "rating": nested_get(issue, "rating", "name"),
        "distributor_sku": getattr(issue, "sku", None),
        "upc": issue.upc,
        "metron_id": issue.id,
        "comicvine_id": getattr(issue, "cv_id", None),
        "gcd_id": issue.gcd_id,
        "series": {
            "name": series.name,
            "volume": series.volume,
            "start_year": getattr(series, "year_began", None),
            "type": nested_get(series, "series_type", "name"),
            "genre": [g.name for g in getattr(series, "genres", [])],
            "publisher": nested_get(issue, "publisher", "name"),
        }
    }