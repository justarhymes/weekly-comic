from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import date

class Comic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    publisher: str
    release_date: date
    issue_number: Optional[str] = None
    image: Optional[str] = None
    api_source: Optional[str] = None
    is_custom: bool = False
    summary: Optional[str] = None
    page_count: Optional[int] = None
    price: Optional[float] = None
    rating: Optional[str] = None
    distributor_sku: Optional[str] = None
    upc: Optional[str] = None
    metron_id: Optional[int] = None
    comicvine_id: Optional[int] = None
    gcd_id: Optional[int] = None
    series_name: Optional[str] = None
