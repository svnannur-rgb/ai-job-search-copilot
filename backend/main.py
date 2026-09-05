from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv
from openai import OpenAI
from pydantic import BaseModel
import chromadb

load_dotenv()

class ResumeAnalysis(BaseModel):
    match_score: int
    strong_matches: list[str]
    partial_matches: list[str]
    missing_skills: list[str]
    recommendations: list[str]

app = FastAPI()

client = OpenAI()

chroma_client = chromadb.PersistentClient(
    path="./chroma_db"
)

resume_collection = chroma_client.get_or_create_collection(
    name="resume_chunks"
)

class ResumeQuestionAnswer(BaseModel):
    answer: str
    evidence: list[str]

class InterviewQuestions(BaseModel):
    questions: list[str]

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

def chunk_text(text: str, chunk_size: int = 1000) -> list[str]:
    chunks = []

    for i in range(0, len(text), chunk_size):
        chunk = text[i:i + chunk_size]
        chunks.append(chunk)

    return chunks

def create_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )

    return response.data[0].embedding
@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    pdf_reader = PdfReader(resume.file)

    resume_text = ""
    for page in pdf_reader.pages:
        resume_text += page.extract_text() or ""

    resume_chunks = chunk_text(resume_text)

    resume_embeddings = [
        create_embedding(chunk)
        for chunk in resume_chunks
    ]

    resume_collection.upsert(
        ids=[f"chunk-{i}" for i in range(len(resume_chunks))],
        documents=resume_chunks,
        embeddings=resume_embeddings
    )

    job_embedding = create_embedding(job_description)

    results = resume_collection.query(
        query_embeddings=[job_embedding],
        n_results=3
    )

    retrieved_chunks = results["documents"][0]
    retrieved_context = "\n\n".join(retrieved_chunks)
    response = client.responses.parse(
        model="gpt-5-mini",
        text_format=ResumeAnalysis,
        input=f"""
Resume:
{resume_text}

Job Description:
{job_description}

Analyze how well this resume matches the job description.

Only use evidence that is explicitly present in the resume.
Do not invent skills, tools, experience, achievements, or responsibilities.
If a skill is not supported by the resume, label it as missing or not demonstrated.
Do not recommend resume bullets that claim experience the candidate has not actually shown.
"""
    )
    analysis = response.output_parsed

    return {
        "filename": resume.filename,
        "job_description": job_description,
        "resume_text_preview": resume_text[:500],
        "analysis": analysis.model_dump()
    }

@app.post("/ask")
async def ask_resume(
    question: str = Form(...)
):
    question_embedding = create_embedding(question)

    results = resume_collection.query(
        query_embeddings=[question_embedding],
        n_results=3
    )

    retrieved_chunks = results["documents"][0]
    retrieved_context = "\n\n".join(retrieved_chunks)
    print(retrieved_chunks)

    response = client.responses.parse(
        model="gpt-5-mini",
        text_format=ResumeQuestionAnswer,
        input=f"""
Resume Evidence:
{retrieved_context}

Question:
{question}

Answer the question using only the resume evidence provided.
Do not invent experience, skills, tools, or achievements.
If the evidence does not support an answer, clearly say that the resume does not demonstrate it.
"""
    )
    answer = response.output_parsed

    return {
        "question": question,
        "answer": answer.model_dump()
    }

@app.post("/interview-questions")
async def generate_interview_questions(
    job_description: str = Form(...)
):
    job_embedding = create_embedding(job_description)

    results = resume_collection.query(
        query_embeddings=[job_embedding],
        n_results=3
    )

    retrieved_chunks = results["documents"][0]
    retrieved_context = "\n\n".join(retrieved_chunks)

    response = client.responses.parse(
        model="gpt-5-mini",
        text_format=InterviewQuestions,
        input=f"""
Resume Evidence:
{retrieved_context}

Job Description:
{job_description}

Generate 5 interview questions tailored to this candidate and this role.

Use only the resume evidence provided.
Do not invent skills, experience, tools, or achievements.
Focus on areas the interviewer is likely to probe based on the job requirements and the candidate's demonstrated experience.
"""
    )
    interview_questions = response.output_parsed
    return {
        "questions": interview_questions.questions
    }    