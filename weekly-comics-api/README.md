# Weekly Comics API Documentation

This document provides API usage guidance for the backend powering the Weekly Comics platform. The API syncs and serves comic book data from the [Metron API](https://metron.cloud).

## 🛠 Useful Commands

### Sync this week's comics and publisher optionally
```bash
python -m scripts.sync_comics --week new --publisher="MARVEL COMICS"
```

### Sync all by year (backfill)
```bash
python -m scripts.sync_all_metron_comics --year 2025
```

---

## 📨 API Usage Examples

### Get all comics

**Request:**
```http
GET /comics?skip=0&limit=5
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Cable: Love and Chrome #4",
    "publisher": "Marvel",
    "release_date": "2025-06-01",
    "issue_number": "4",
    "image": "https://static.metron.cloud/media/issue/2025/04/03/7e5dea304c49460f9c1ea2b937650c52.jpg",
    "summary": "A MISSION THROUGH TIME! The Prime Conclave stands defeated — but when Resistance leader Avery Ryder succumbs to the Techno-Organic virus...",
    "page_count": 32,
    "price": 3.99,
    "rating": "Teen",
    "upc": "75960621035000411"
  }
]
```

### Get comic by ID

**Request:**
```http
GET /comics/1
```

**Response:**
```json
{
  "id": 1,
  "title": "Cable: Love and Chrome #4",
  "publisher": "Marvel",
  "release_date": "2025-06-01",
  "issue_number": "4",
  "image": "https://static.metron.cloud/media/issue/2025/04/03/7e5dea304c49460f9c1ea2b937650c52.jpg",
  "summary": "A MISSION THROUGH TIME!...",
  "page_count": 32,
  "price": 3.99,
  "rating": "Teen",
  "distributor_sku": "FEB250749",
  "upc": "75960621035000411",
  "metron_id": 141985,
  "comicvine_id": 1104100,
  "gcd_id": 2724423,
  "series_name": "Cable: Love and Chrome"
}
```

### Delete all comics

**Request:**
```http
DELETE /comics/clear
```

**Response:**
```json
{"detail": "All comics cleared."}
```

---

## 📜 Data Model: `Comic`

| Field           | Type      | Description                           |
|----------------|-----------|---------------------------------------|
| `id`           | int       | Auto-incremented ID                   |
| `title`        | str       | Comic title with issue number         |
| `publisher`    | str       | Publisher name                        |
| `release_date` | date      | Release date                          |
| `issue_number` | str       | Issue number                          |
| `image`        | str/null  | URL to the cover image                |
| `summary`      | str/null  | Comic description                     |
| `page_count`   | int/null  | Number of pages                       |
| `price`        | float/null| Price in USD                          |
| `rating`       | str/null  | Rating label (e.g. Teen, Mature)      |
| `distributor_sku` | str/null | Diamond or distributor SKU           |
| `upc`          | str/null  | Universal Product Code                |
| `metron_id`    | int       | Metron issue ID                       |
| `comicvine_id` | int/null  | ComicVine ID (if present)             |
| `gcd_id`       | int/null  | Grand Comics Database ID              |
| `series_name`  | str/null  | Name of the comic series              |

---

## ✨ License
MIT

