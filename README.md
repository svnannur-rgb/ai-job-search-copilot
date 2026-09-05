# AI Job Search Copilot

An AI-powered job search assistant that analyzes resumes against job descriptions, identifies skill gaps, answers questions using grounded resume evidence, generates interview questions, assists with job application responses, and uses an AI career agent with tool calling.

## Live Demo

[Try the AI Job Search Copilot](https://ai-job-search-copilot-ten.vercel.app)

## Features

- **Resume–Job Match Analysis** — Compares a resume against a job description and returns a structured match score, strong matches, partial matches, missing skills, and grounded recommendations.
- **Grounded Resume Analysis** — Uses explicit resume evidence to reduce hallucinations and avoid inventing unsupported skills or experience.
- **Ask My Resume (RAG)** — Uses embeddings and semantic retrieval to find relevant resume content and answer questions using retrieved evidence.
- **Interview Question Generator** — Generates role-specific interview questions based on the provided job description.
- **Application Assistant** — Creates tailored application responses grounded in the candidate's resume and target role.
- **AI Career Agent** — Uses tool/function calling to decide when resume retrieval is needed and dynamically searches resume evidence before responding.

## Tech Stack

### Frontend
- React
- TypeScript
- Vite

### Backend
- Python
- FastAPI
- Pydantic

### AI / LLM
- OpenAI API
- Structured Outputs
- Embeddings
- Retrieval-Augmented Generation (RAG)
- Tool / Function Calling
- Agentic Workflows

### Data & Retrieval
- ChromaDB
- Semantic Search
- PDF Text Extraction

### Deployment
- Vercel — frontend hosting
- Render — backend hosting
- GitHub — version control and source repository

## Architecture

The application separates the frontend, backend, AI workflows, and retrieval layer:

1. The **React + TypeScript frontend** collects the resume, job description, and user requests.
2. The **FastAPI backend** handles PDF extraction, API requests, AI orchestration, and retrieval logic.
3. Resume content is split into chunks and converted into vector embeddings using the **OpenAI Embeddings API**.
4. Embeddings are stored in **ChromaDB** for semantic retrieval.
5. The **RAG workflow** retrieves relevant resume chunks for evidence-grounded resume Q&A.
6. **OpenAI structured outputs** provide validated resume–job match analysis.
7. The **Career Agent** uses tool/function calling to determine when resume retrieval is necessary before generating a response.
8. The frontend is deployed on **Vercel**, while the FastAPI backend is deployed on **Render**.

### System Flow

```text
User
  ↓
React + TypeScript (Vercel)
  ↓
FastAPI (Render)
  ├── Resume / Job Match → OpenAI Structured Output
  ├── Interview Questions → OpenAI
  ├── Application Assistant → OpenAI
  └── Career Agent → Tool Calling
                         ↓
                   Resume Search
                         ↓
OpenAI Embeddings → ChromaDB → Retrieved Resume Evidence
                         ↓
                   Grounded Response

```
## RAG Design Decision

During development, two approaches were evaluated for resume analysis:

- **Full-resume context** for holistic resume-to-job matching
- **Retrieval-Augmented Generation (RAG)** for targeted resume questions

RAG retrieval works well when a user asks a specific question because semantic search can retrieve the most relevant resume chunks. However, using only the top retrieved chunks for overall job-match analysis can omit relevant experience located elsewhere in the resume.

For this reason, the application uses:

- **Full resume context** for overall resume–job match analysis
- **RAG retrieval** for targeted "Ask My Resume" questions and resume-search tools

This hybrid approach preserves broader context for holistic analysis while using semantic retrieval where focused evidence is most useful.
## Grounding & Hallucination Mitigation

Because resume recommendations can become misleading if an LLM invents experience, the application includes explicit grounding rules throughout its AI workflows.

The system instructs the model to:

- Use only experience explicitly supported by the candidate's resume
- Avoid inventing skills, tools, responsibilities, or achievements
- Identify unsupported job requirements as missing or not demonstrated
- Avoid recommending resume bullets that falsely claim experience
- Ground resume Q&A responses in retrieved resume evidence

For resume–job analysis, responses are also returned using a defined Pydantic schema, providing a predictable structure for match scores, strong matches, partial matches, missing skills, and recommendations.


## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/svnannur-rgb/ai-job-search-copilot.git
cd ai-job-search-copilot
```

### 2. Start the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` and add:

```text
OPENAI_API_KEY=your_openai_api_key
```

Then start FastAPI:

```bash
uvicorn main:app --reload
```

### 3. Start the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend connects to the local FastAPI server. For a deployed backend, set `VITE_API_URL` in the frontend environment.

