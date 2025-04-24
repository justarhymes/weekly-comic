from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB
from typing import Optional
from datetime import date

class Comic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
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

    # New field replacing publisher and series_name
    series: Optional[dict] = Field(default=None, sa_column=Column(JSONB))
