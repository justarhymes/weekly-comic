# Weekly Comics Platform

This monorepo powers the Weekly Comics API and (eventually) frontend. It's designed to sync, store, and query weekly comic book releases from the [Metron API](https://metron.cloud).

## 🔧 Setup (Local API & Database)

### 1. Clone the repository

```bash
git clone https://github.com/justarhymes/weekly-comic.git
cd weekly-comic
```

### 2. Set up Python environment

```bash
cd weekly-comics-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Environment variables

Copy and edit `.env`:

```bash
cp .env.example .env
```

Required values:

```
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
METRON_USERNAME=your_username
METRON_PASSWORD=your_password
ENV=development
```

### 4. Start the server

```bash
uvicorn app.main:app --reload
```

Access it at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 📦 Project Structure

```
weekly-comic/
├── weekly-comics-api/         # FastAPI backend
│   ├── app/                   # Source code
│   ├── scripts/               # CLI tools for syncing
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Sample environment config
└── (frontend coming soon)
```

---

## 🔍 Next Steps
- Add `README.md` inside `weekly-comics-api/` with API documentation
- Set up a PostgreSQL database
- Build the frontend (`weekly-comics-next`)
- Deploy backend and frontend

---

## ✨ License
MIT

