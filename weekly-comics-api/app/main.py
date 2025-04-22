from fastapi import FastAPI
from app.routes import comics
from app.db.database import init_db
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager
from app.scheduler import run_scheduled_tasks

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("ENV") != "test":
        init_db()

        # Start cron job scheduler only in production
        if os.getenv("ENV") == "production":
            run_scheduled_tasks()

    yield

app = FastAPI(lifespan=lifespan)

app.include_router(comics.router)
