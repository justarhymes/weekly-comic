from app.utils.nested import nested_get
from app.utils.slugify import slugify
from PIL import Image
import requests
from io import BytesIO
import base64

def generate_blur_data_url(image_url: str) -> str | None:
    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image = Image.open(BytesIO(response.content))
        image = image.convert("RGB")

        try:
            resample = Image.Resampling.LANCZOS
        except AttributeError:
            resample = Image.LANCZOS

        image.thumbnail((10, 10), resample)
        buffered = BytesIO()
        image.save(buffered, format="JPEG")
        encoded = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/jpeg;base64,{encoded}"
    except Exception as e:
        print(f"Failed to generate blur_data_url: {e}")
        return None

def build_comic_data(issue):
    series = issue.series
    image_url = str(getattr(issue, "image", None)) if getattr(issue, "image", None) else None
    blur_data_url = generate_blur_data_url(image_url) if image_url else None

    return {
        "title": f"{series.name} #{issue.number}",
        "slug": slugify(f"{series.name}-{issue.number}"),
        "release_date": nested_get(issue, "store_date"),
        "issue_number": issue.number,
        "image": image_url,
        "blur_data_url": blur_data_url,
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
            "slug": slugify(series.name),
            "volume": series.volume,
            "start_year": getattr(series, "year_began", None),
            "type": nested_get(series, "series_type", "name"),
            "genre": [g.name for g in getattr(series, "genres", [])],
            "publisher": nested_get(issue, "publisher", "name"),
        }
    }
