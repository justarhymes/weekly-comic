from sqlmodel import Session, select
from fastapi import HTTPException
from app.models import Comic

def create_comic(comic: Comic, session: Session):
    session.add(comic)
    session.commit()
    session.refresh(comic)
    return comic

def read_comics(skip: int = 0, limit: int = 10, session: Session = None):
    return session.exec(select(Comic).offset(skip).limit(limit)).all()

def read_comic(comic_id: int, session: Session):
    comic = session.get(Comic, comic_id)
    if not comic:
        raise HTTPException(status_code=404, detail="Comic not found")
    return comic

def update_comic(comic_id: int, updated: Comic, session: Session):
    comic = session.get(Comic, comic_id)
    if not comic:
        raise HTTPException(status_code=404, detail="Comic not found")
    comic.title = updated.title
    comic.publisher = updated.publisher
    comic.release_date = updated.release_date
    comic.issue_number = updated.issue_number
    comic.image = updated.image
    comic.api_source = updated.api_source
    comic.is_custom = updated.is_custom
    session.add(comic)
    session.commit()
    session.refresh(comic)
    return comic

def read_comics_by_date(target_date, session: Session):
    return session.exec(
        select(Comic).where(Comic.release_date == target_date)
    ).all()

