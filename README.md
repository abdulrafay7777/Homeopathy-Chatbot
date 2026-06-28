# Homeopathy AI Chatbot

A full-stack AI-powered case-taking doctor chatbot specialized in homeopathy. It features a React-based frontend and a FastAPI-based backend, leveraging LangChain for LLM integrations.

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Charts/UI**: Recharts, Lucide React, React Markdown

### Backend
- **Framework**: FastAPI (Python)
- **AI / LLMs**: LangChain (Google GenAI, Groq)
- **Database**: PostgreSQL (via SQLAlchemy & psycopg2)
- **Server**: Uvicorn

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python 3.9+](https://www.python.org/)
- PostgreSQL server (if running a local DB)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Chatbot
```

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure Environment Variables:
   Create a `.env` file in the `backend` directory based on your required keys (e.g., `GOOGLE_API_KEY`, `GROQ_API_KEY`, `DATABASE_URL`, etc.).

5. Run the FastAPI server:
   ```bash
   python app.py
   # Or manually with uvicorn:
   # uvicorn app:app --host 0.0.0.0 --port 5000 --reload
   ```
   The API will be available at `http://localhost:5000`.

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   Create a `.env` file in the `frontend` directory if needed (e.g., `VITE_API_BASE_URL=http://localhost:5000`).

4. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

---

## Features
- **Interactive Chat**: Conversational AI designed to act as a homeopathic practitioner for initial case taking.
- **LLM Integrations**: Utilizes LangChain for complex query handling with models from Google (Gemini) and Groq.
- **Admin/Consultation**: Routes mapped for consultations, admin dashboards, and health checks.

