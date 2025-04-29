from sqlmodel import SQLModel, Field, Column
from sqlalchemy.dialects.postgresql import JSONB
from typing import Optional, List
from datetime import date

class Comic(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    slug: Optional[str] = None 
    release_date: date
    issue_number: Optional[str] = None
    image: Optional[str] = None
    blur_data_url: Optional[str] = Field(default=None, sa_column_kwargs={"nullable": True})
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
    series: Optional[dict] = Field(default=None, sa_column=Column(JSONB))  # nested series data
    creators: Optional[List[dict]] = Field(default=None, sa_column=Column(JSONB))  # list of { name, roles }
