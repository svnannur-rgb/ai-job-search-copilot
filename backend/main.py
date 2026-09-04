from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Job Search Copilot API is running"}