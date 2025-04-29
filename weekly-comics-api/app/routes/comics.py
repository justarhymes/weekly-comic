from fastapi import APIRouter, Depends, Query, HTTPException
from sqlmodel import Session, select, text
from sqlalchemy import Integer
from typing import Optional, List
from app.models import Comic
from app.db.database import get_session
import app.crud as crud
from app.services.metron import fetch_metron_issues_for_week
from datetime import datetime, timedelta, date
from app.utils.comic_builder import build_comic_data
import os
import argparse

router = APIRouter()

# CLI argument parser for sync_all_metron_comics.py
parser = argparse.ArgumentParser(description="Sync Metron comics by year")
parser.add_argument("--year", type=int, default=2000, help="Starting year (default: 2000)")
args, _ = parser.parse_known_args()
START_YEAR = args.year
END_YEAR = date.today().year

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
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    session: Session = Depends(get_session)
):
    query = select(Comic)
    if publisher:
        query = query.where(Comic.series["publisher"].astext == publisher)
    if title:
        query = query.where(Comic.title.ilike(f"%{title}%"))
    if api_source:
        query = query.where(Comic.api_source == api_source)
    if start_date and end_date:
        query = query.where(Comic.release_date.between(start_date, end_date))

    query = query.offset(skip).limit(limit)
    return session.exec(query).all()

@router.get("/comics/{slug}", response_model=Comic)
def get_one(slug: str, session: Session = Depends(get_session)):
    comic = session.exec(select(Comic).where(Comic.slug == slug)).first()
    if not comic:
        raise HTTPException(status_code=404, detail="Comic not found")
    return comic

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
    publisher: Optional[str] = None,
    dry_run: bool = Query(False, description="If true, simulate the sync without committing changes"),
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
        comic_data = build_comic_data(issue)
        exists = session.exec(
            select(Comic).where(Comic.metron_id == comic_data["metron_id"])
        ).first()

        if exists:
            for key, value in comic_data.items():
                setattr(exists, key, value)
            print(f"\U0001f501 Would update: {comic_data['title']}" if dry_run else f"\U0001f501 Updated comic: {comic_data['title']}")
            if not dry_run:
                session.add(exists)
        else:
            print(f"➕ Would add: {comic_data['title']}" if dry_run else f"➕ Adding comic: {comic_data['title']}")
            if not dry_run:
                session.add(Comic(**comic_data))

    if not dry_run:
        session.commit()
    else:
        print("✅ Dry run complete. No changes committed.")

    return crud.read_comics_by_date(target, session=session)

@router.get("/comics/series/{series_slug}/{start_year}", response_model=List[Comic])
def get_comics_by_series(
    series_slug: str,
    start_year: int,
    session: Session = Depends(get_session)
):
    query = (
        select(Comic)
        .where(
            Comic.series["slug"].astext == series_slug,
            Comic.series["start_year"].astext.cast(Integer) == start_year
        )
        .order_by(Comic.issue_number.asc())
    )
    return session.exec(query).all()
