# Weekly Comics Platform

This monorepo powers the Weekly Comics API and frontend. It's designed to sync, store, and query weekly comic book releases from the [Metron API](https://metron.cloud).

## 🔧 Setup (Local API & Database)

### 1. Clone the repository
```bash
https://github.com/justarhymes/weekly-comic.git
cd weekly-comic
```

### 2. Set up Python environment for backend
```bash
cd weekly-comics-api
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Set up environment variables
```bash
cp .env.example .env
```

Fill in:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/your_db
METRON_USERNAME=your_username
METRON_PASSWORD=your_password
ENV=development
```

### 4. Start backend server
```bash
uvicorn app.main:app --reload
```
Server runs at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 5. Set up frontend (Next.js)
```bash
cd weekly-comics-next
npm install
npm run dev
```
Frontend runs at: [http://localhost:3000](http://localhost:3000)

---

## 📦 Project Structure

```
weekly-comic/
├── weekly-comics-api/         # FastAPI backend
│   ├── app/                   # Source code
│   ├── scripts/               # CLI tools for syncing
|   ├── render.yaml            # Deployment config
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Sample environment config
└── weekly-comics-next/        # Next.js frontend
```

---

## 🔍 Next Steps
- TBD

## ✨ License
MIT