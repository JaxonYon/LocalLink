# LocalLink – AI‑Powered Travel Planner

LocalLink is a FastAPI backend that generates personalized travel itineraries using Gemini, manages user accounts, stores saved trips, and supports sharing itineraries via unique links.

This README provides everything needed to run the project locally or inside Docker.

---

## 🔑 Environment Variables

Create a `.env` file in the backend root:

```
GEMINI_API_KEY=your_api_key_here
```

---

## 📦 Install Dependencies

From the backend folder:

```
pip install -r requirements.txt
```

---

## 🚀 Run the Server (Local Development)

```
python -m uvicorn app.main:app --reload
```

API URL:

```
http://localhost:8000
```

Swagger docs:

```
http://localhost:8000/docs
```

---

# 🐳 Running with Docker

## Build the image

```
docker build -t locallink-backend .
```

## Run the container

```
docker run -p 8000:8000 --env-file .env locallink-backend
```

---

# 🐳 Using Docker Compose (Recommended)

```
docker compose up --build
```

This automatically loads your `.env` file and mounts your code for live reload.

---

# 🧰 Development Commands

| Action             | Command                                     |
| ------------------ | ------------------------------------------- |
| Run server         | `python -m uvicorn app.main:app --reload`   |
| Install deps       | `pip install -r requirements.txt`           |
| Build Docker image | `docker build -t locallink-backend .`       |
| Run Docker         | `docker run -p 8000:8000 locallink-backend` |
| Docker Compose     | `docker compose up --build`                 |

---

# 📝 TODO List

### Backend Improvements

- **Change “time” to “schedule”**  
  Update itinerary schema + frontend formatting.

- **Password requirements**  
  Add validation (min length, special chars, etc.).

- **Email verification**  
  Add verification tokens + email service (SendGrid, Resend, etc.).

- **Location information**  
  Add richer metadata (coordinates, address validation, Google Places API).
