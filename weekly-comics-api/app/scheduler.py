import os
from datetime import date
from apscheduler.schedulers.background import BackgroundScheduler
from sqlalchemy.orm import Session
from app.db.database import engine

def run_scheduled_tasks():
    if os.getenv("APP_ENV") != "production":
        print("Skipping scheduled sync: not in production environment.")
        return

    scheduler = BackgroundScheduler()

    def weekly_sync():
        print("Running scheduled weekly sync...")
        with Session(engine) as session:
            today = date.today()
            print("Weekly sync complete.")

    # Run every Friday at 3am
    scheduler.add_job(weekly_sync, trigger="cron", day_of_week="fri", hour=3, minute=0)
    scheduler.start()
