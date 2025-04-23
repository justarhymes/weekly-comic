from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import comics
from app.db.database import init_db
from dotenv import load_dotenv
import os
from contextlib import asynccontextmanager

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    if os.getenv("ENV") != "test":
        init_db()
    yield

app = FastAPI(lifespan=lifespan)

# CORS setup
origins = [
    "http://localhost:3000",  # Local frontend
    "https://weekly-comic.vercel.app",  # Vercel deploy (adjust as needed)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(comics.router)
