from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

app = FastAPI()

client = OpenAI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "AI Job Search Copilot API is running"}


@app.get("/test")
def test():
    return {"message": "Frontend connected to backend!"}

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    pdf_reader = PdfReader(resume.file)

    resume_text = ""

    for page in pdf_reader.pages:
        resume_text += page.extract_text() or ""

    response = client.responses.create(
        model="gpt-5-mini",
        input=f"""
Resume:
{resume_text}

Job Description:
{job_description}

Analyze how well this resume matches the job description.
"""
    )

    return {
        "filename": resume.filename,
        "job_description": job_description,
        "resume_text_preview": resume_text[:500],
        "analysis": response.output_text
    }