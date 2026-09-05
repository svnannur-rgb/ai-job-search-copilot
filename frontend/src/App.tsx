import { useState } from 'react'
import './App.css'

interface ResumeAnalysis {
  match_score: number
  strong_matches: string[]
  partial_matches: string[]
  missing_skills: string[]
  recommendations: string[]
}

interface ResumeQuestionAnswer {
  answer: string
  evidence: string[]
}
function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [resumeQuestion, setResumeQuestion] = useState('')
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([])
  const [resumeAnswer, setResumeAnswer] = useState<ResumeQuestionAnswer | null>(null)
  const [applicationQuestion, setApplicationQuestion] = useState('')
  const [applicationResponse, setApplicationResponse] = useState('')
  const [agentRequest, setAgentRequest] = useState('')
  const [coverLetter, setCoverLetter] = useState('')
  const [agentResponse, setAgentResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

  const handleAnalyze = () => {
    if (!resumeFile) {
      alert('Please upload a resume.')
      return
    }
  
    if (!jobDescription.trim()) {
      alert('Please paste a job description.')
      return
    }
    setIsLoading(true)
    const formData = new FormData()

formData.append('resume', resumeFile)
formData.append('job_description', jobDescription)

fetch(`${API_URL}/analyze`, {
  method: 'POST',
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    setAnalysis(data.analysis)
  })
  .catch((error) => {
    console.error(error)
    alert('Something went wrong while analyzing the resume.')
  })
  .finally(() => {
    setIsLoading(false)
  })
}
const handleAskResume = () => {
  setIsLoading(true)
  const formData = new FormData()
  formData.append('question', resumeQuestion)

  fetch(`${API_URL}/ask`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      setResumeAnswer(data.answer)
    })
    .catch((error) => {
      console.error(error)
      alert('Something went wrong while answering your question.')
    })
    .finally(() => {
      setIsLoading(false)
    })
}

const handleGenerateInterviewQuestions = () => {
  setIsLoading(true)  
  const formData = new FormData()
  formData.append('job_description', jobDescription)

  fetch(`${API_URL}/interview-questions`, {
  method: 'POST',
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    setInterviewQuestions(data.questions)
  })
  .catch((error) => {
    console.error(error)
    alert('Something went wrong while generating interview questions.')
  })
  .finally(() => {
    setIsLoading(false)
  })
}
const handleApplicationAssistant = () => {
  setIsLoading(true)  
  const formData = new FormData()

  formData.append('question', applicationQuestion)
  formData.append('job_description', jobDescription)

  fetch(`${API_URL}/application-assistant`, {
    method: 'POST',
    body: formData,
  })
  .then((response) => response.json())
  .then((data) => {
    setApplicationResponse(data.response)
  })
  .catch((error) => {
    console.error(error)
    alert('Something went wrong while generating the application response.')
  })
  .finally(() => {
    setIsLoading(false)
  })
}
const handleGenerateCoverLetter = () => {
  setIsLoading(true)

  const formData = new FormData()
  formData.append('job_description', jobDescription)

  fetch(`${API_URL}/cover-letter`, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      setCoverLetter(data.cover_letter)
    })
    .catch((error) => {
      console.error(error)
      alert('Something went wrong while generating the cover letter.')
    })
    .finally(() => {
      setIsLoading(false)
    })
}
const handleAgentRequest = () => {
  setIsLoading(true)  
  const formData = new FormData()

  formData.append('request', agentRequest)

  fetch(`${API_URL}/agent`, {
    method: 'POST',
    body: formData,
  })
  .then((response) => response.json())
  .then((data) => {
    setAgentResponse(data.response)
  })
  .catch((error) => {
    console.error(error)
    alert('Something went wrong while using the career agent.')
  })
  .finally(() => {
    setIsLoading(false)
  })
}
  return (
    <>
      <section id="center">
        <div>
        <span className="hero-badge">AI-Powered Resume Intelligence</span>
          <h1>AI Job Search Copilot</h1>
          <p>
            Upload your resume and compare it against a job description.
          </p>
        </div>
        <div>
  <h2>Upload Resume</h2>
  <p className="section-description">
    Upload a PDF resume to begin your AI-powered job match analysis.
  </p>

  <input
    type="file"
    accept=".pdf"
    onChange={(event) => {
      const file = event.target.files?.[0]

      if (file) {
        setResumeFile(file)
      }
    }}
  />

  {resumeFile && <p>Selected: {resumeFile.name}</p>}
</div>

<div>
  <h2>Job Description</h2>
  <p className="section-description">
    Paste the role description to compare requirements against your resume.
  </p>

  <textarea
    placeholder="Paste the job description here..."
    rows={10}
    value={jobDescription}
    onChange={(event) => setJobDescription(event.target.value)}
  />
</div>

<button
  className="primary-action"
  type="button"
  onClick={handleAnalyze}
  disabled={isLoading}
>
  {isLoading ? 'Analyzing...' : 'Analyze Match'}
</button>

{analysis && (
  <div className="analysis-card">
    <div className="analysis-header">
      <div>
        <span className="result-badge">AI ANALYSIS</span>
        <h2>Resume Match Results</h2>
      </div>

      <div className="score-badge">
        <span>{analysis.match_score}%</span>
        <small>Match</small>
      </div>
    </div>
    <div className="result-section strong-section">
  <h3>Strong Matches</h3>
  <ul>
    {analysis.strong_matches.map((item: string, index: number) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
</div>

<div className="result-section partial-section">
  <h3>Partial Matches</h3>
  <ul>
    {analysis.partial_matches.map((item: string, index: number) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
</div>

<div className="result-section missing-section">
  <h3>Missing Skills</h3>
  <ul>
    {analysis.missing_skills.map((item: string, index: number) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
</div>

<div className="result-section recommendation-section">
  <h3>Recommendations</h3>
  <ul>
    {analysis.recommendations.map((item: string, index: number) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
</div>

  </div>
)}
<div>
<h2>Resume Evidence Finder</h2>
<p className="section-description">
  Find relevant experience from your resume for skills, interview questions, or job requirements.
</p>
  <input
    type="text"
    placeholder="e.g. What experience demonstrates my AWS skills?"
    value={resumeQuestion}
    onChange={(event) => setResumeQuestion(event.target.value)}
  />

  <button onClick={handleAskResume} disabled={isLoading}>
    Ask
  </button>

  {resumeAnswer && (
  <div className="response-box">
    <h3>Answer</h3>

    <div className="answer-text">
      {resumeAnswer.answer}
    </div>

    <h3>Resume Evidence</h3>
      <ul>
        {resumeAnswer.evidence.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )}
</div>

<div>
  <h2>Interview Questions</h2>

  <button
    onClick={handleGenerateInterviewQuestions}
    disabled={isLoading}
  >
    Generate Interview Questions
  </button>

  {interviewQuestions.length > 0 && (
  <div className="interview-question-list">
    {interviewQuestions.map((question: string, index: number) => (
      <div className="interview-question-card" key={index}>
        <span className="question-number">Question {index + 1}</span>
        <p>{question}</p>
      </div>
    ))}
  </div>
)}
</div>

<div>
  <h2>Application Assistant</h2>
  <p className="section-description">
  Draft tailored answers to job application questions using your resume and the job description.
</p>
  <input
    type="text"
    placeholder="e.g. Why are you a good fit for this role?"
    value={applicationQuestion}
    onChange={(event) => setApplicationQuestion(event.target.value)}
  />

  <button
    onClick={handleApplicationAssistant}
    disabled={isLoading}
  >
    Generate Response
  </button>

  {applicationResponse && (
  <div className="response-box">
    <h3>Generated Response</h3>

    <div className="answer-text">
      {applicationResponse}
    </div>
  </div>
)}
</div>

<div>
  <h2>Personalized Cover Letter</h2>

  <p className="section-description">
    Generate a tailored cover letter using your resume and the job description.
  </p>

  <button
    onClick={handleGenerateCoverLetter}
    disabled={isLoading}
  >
    Generate Cover Letter
  </button>

  {coverLetter && (
    <div className="response-box">
      <h3>Your Cover Letter</h3>

      <div className="answer-text">
        {coverLetter}
      </div>
    </div>
  )}
</div>

<div>
  <h2>Career Agent</h2>

  <p className="section-description">
  Get strategic guidance on how to position your experience for a role. The agent can search your resume when relevant.
</p>

  <input
    type="text"
    placeholder="e.g. Which experiences should I emphasize for this role?"
    value={agentRequest}
    onChange={(event) => setAgentRequest(event.target.value)}
  />

  <button onClick={handleAgentRequest} disabled={isLoading}>
    Ask Agent
  </button>

  {agentResponse && (
  <div className="response-box">
    <h3>Agent Response</h3>

    <div className="answer-text">
      {agentResponse}
    </div>
  </div>
)}
</div>

      </section>
    </>
  )
}

export default App