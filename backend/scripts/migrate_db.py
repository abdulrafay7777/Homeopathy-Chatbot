import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

load_dotenv()
db_url = os.getenv("DATABASE_URL")

engine = create_engine(db_url)
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE admin_person ADD COLUMN profile_image VARCHAR(255);"))
        conn.commit()
        print("Successfully added profile_image column to admin_person table.")
    except Exception as e:
        print(f"Error (column might already exist): {e}")
