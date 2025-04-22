from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, text
from typing import Optional, List
from app.models import Comic
from app.db.database import get_session
import app.crud as crud
from app.services.metron import fetch_metron_issues_for_week
from datetime import datetime, timedelta, date
import os
from pprint import pprint
import argparse

router = APIRouter()

# CLI argument parser for sync_all_metron_comics.py
parser = argparse.ArgumentParser(description="Sync Metron comics by year")
parser.add_argument("--year", type=int, default=2000, help="Starting year (default: 2000)")
args, _ = parser.parse_known_args()
START_YEAR = args.year
END_YEAR = date.today().year

def nested_get(obj, *attrs, default=None):
    for attr in attrs:
        obj = getattr(obj, attr, None)
        if obj is None:
            return default
    return obj

@router.post("/comics/", response_model=Comic)
def create(comic: Comic, session: Session = Depends(get_session)):
    return crud.create_comic(comic, session=session)

@router.get("/comics/", response_model=List[Comic])
def get_all(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    publisher: Optional[str] = None,
    title: Optional[str] = None,
    api_source: Optional[str] = None,
    session: Session = Depends(get_session)
):
    query = select(Comic)
    if publisher:
        query = query.where(Comic.publisher == publisher)
    if title:
        query = query.where(Comic.title.ilike(f"%{title}%"))
    if api_source:
        query = query.where(Comic.api_source == api_source)
    query = query.offset(skip).limit(limit)
    return session.exec(query).all()

@router.get("/comics/{comic_id}", response_model=Comic)
def get_one(comic_id: int, session: Session = Depends(get_session)):
    return crud.read_comic(comic_id, session=session)

@router.put("/comics/{comic_id}", response_model=Comic)
def update(comic_id: int, comic: Comic, session: Session = Depends(get_session)):
    return crud.update_comic(comic_id, comic, session=session)

@router.delete("/comics/clear", response_model=dict, include_in_schema=os.getenv("ENV") in ["test", "local", "development"])
def clear_comics(session: Session = Depends(get_session)):
    env = os.getenv("ENV")
    if env not in ["test", "local", "development"]:
        raise HTTPException(status_code=403, detail="Clearing comics is not allowed in this environment")

    session.exec(text("DELETE FROM comic"))
    session.commit()
    return {"message": "Comics cleared"}

@router.delete("/comics/{comic_id}", response_model=dict)
def delete(comic_id: int, session: Session = Depends(get_session)):
    return crud.delete_comic(comic_id, session=session)

@router.post("/sync/comics", response_model=List[Comic])
def sync_comics(
    week: str = Query("new", enum=["new", "previous", "future", "date"]),
    date_str: Optional[str] = Query(None, alias="date"),
    publisher: Optional[str] = Query(None),
    session: Session = Depends(get_session)
):
    today = date.today()

    if week == "previous":
        target = today - timedelta(weeks=1)
    elif week == "future":
        target = today + timedelta(weeks=1)
    elif week == "date":
        if not date_str:
            raise HTTPException(status_code=400, detail="You must provide a date when week='date'")
        target = datetime.strptime(date_str, "%Y-%m-%d").date()
    else:
        target = today

    issues = fetch_metron_issues_for_week(target, publisher)
    for issue in issues:
        series = issue.series
        comic_data = dict(
            title=f"{series.name} #{issue.number}",
            publisher=series.name,
            release_date=issue.cover_date,
            issue_number=issue.number,
            image=str(getattr(issue, "image", None)) if getattr(issue, "image", None) else None,
            api_source="metron",
            is_custom=False,
            summary=getattr(issue, "desc", None),
            page_count=issue.page_count,
            price=issue.price,
            rating=nested_get(issue, "rating", "name"),
            distributor_sku=getattr(issue, "sku", None),
            upc=issue.upc,
            metron_id=issue.id,
            comicvine_id=getattr(issue, "cv_id", None),
            gcd_id=issue.gcd_id,
            series_name=series.name
        )

        exists = session.exec(
            select(Comic).where(
                Comic.title == comic_data["title"],
                Comic.publisher == comic_data["publisher"],
                Comic.release_date == comic_data["release_date"]
            )
        ).first()

        if exists:
            updated = False
            for key, value in comic_data.items():
                if getattr(exists, key) != value:
                    setattr(exists, key, value)
                    updated = True
            if updated:
                print(f"🔄 Updated comic: {comic_data['title']}")
                session.add(exists)
        else:
            print(f"➕ Adding comic: {comic_data['title']}")
            session.add(Comic(**comic_data))

    session.commit()
    return crud.read_comics_by_date(target, session=session)
