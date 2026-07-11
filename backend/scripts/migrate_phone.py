import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Add parent directory to path to allow imports if necessary
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()
db_url = os.getenv("DATABASE_URL")

engine = create_engine(db_url)
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE patients ADD COLUMN phone VARCHAR(20);"))
        conn.commit()
        print("Successfully added 'phone' column to 'patients' table.")
    except Exception as e:
        print(f"Error (column might already exist): {e}")
