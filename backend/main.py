from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from db import get_connection

app = FastAPI(title="Stackly Email App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class EmailCreate(BaseModel):
    name: str
    email: EmailStr

@app.get("/")
def home():
    return {"message": "API is running"}

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/api/emails")
def list_emails():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name, email, created_at FROM emails ORDER BY id DESC")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

@app.post("/api/emails")
def create_email(payload: EmailCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO emails (name, email) VALUES (%s, %s)",
        (payload.name, payload.email)
    )
    conn.commit()
    inserted_id = cursor.lastrowid
    cursor.close()
    conn.close()
    return {"message": "Email saved successfully", "id": inserted_id}

@app.delete("/api/emails/{email_id}")
def delete_email(email_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM emails WHERE id = %s", (email_id,))
    conn.commit()
    affected = cursor.rowcount
    cursor.close()
    conn.close()

    if affected == 0:
        raise HTTPException(status_code=404, detail="Email not found")

    return {"message": "Email deleted successfully"}
