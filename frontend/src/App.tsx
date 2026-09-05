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
          <h1>AI Job Search Copilot</h1>
          <p>
            Upload your resume and compare it against a job description.
          </p>
        </div>
        <div>
  <h2>Upload Resume</h2>

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

  <textarea
    placeholder="Paste the job description here..."
    rows={10}
    value={jobDescription}
    onChange={(event) => setJobDescription(event.target.value)}
  />
</div>

<button
  type="button"
  onClick={handleAnalyze}
  disabled={isLoading}
>
  {isLoading ? 'Analyzing...' : 'Analyze Match'}
</button>

{analysis && (
  <div>
    <h2>AI Analysis</h2>
    <p>Match Score: {analysis.match_score}%</p>

    <h3>Strong Matches</h3>

    <ul>
      {analysis.strong_matches.map((item: string, index: number) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

    <h3>Partial Matches</h3>

<ul>
  {analysis.partial_matches.map((item: string, index: number) => (
    <li key={index}>{item}</li>
  ))}
</ul>

<h3>Missing Skills</h3>

<ul>
  {analysis.missing_skills.map((item: string, index: number) => (
    <li key={index}>{item}</li>
  ))}
</ul>
<h3>Recommendations</h3>

<ul>
  {analysis.recommendations.map((item: string, index: number) => (
    <li key={index}>{item}</li>
  ))}
</ul>

  </div>
)}
<div>
  <h2>Ask My Resume</h2>

  <input
    type="text"
    placeholder="Ask a question about your resume..."
    value={resumeQuestion}
    onChange={(event) => setResumeQuestion(event.target.value)}
  />

<button onClick={handleAskResume} disabled={isLoading}>
  Ask
</button>

{resumeAnswer && (
  <div>
    <h3>Answer</h3>
    <p>{resumeAnswer.answer}</p>
    <h3>Resume Evidence</h3>

<ul>
  {resumeAnswer.evidence.map((item: string, index: number) => (
    <li key={index}>{item}</li>
  ))}
</ul>
  </div>
)}
<div>
  <h2>Interview Questions</h2>

  <button onClick={handleGenerateInterviewQuestions}disabled={isLoading}>
    Generate Interview Questions
  </button>
</div>
{interviewQuestions.length > 0 && (
  <ul>
    {interviewQuestions.map((question: string, index: number) => (
      <li key={index}>{question}</li>
    ))}
  </ul>
)}

<div>
  <h2>Application Assistant</h2>

  <input
    type="text"
    placeholder="Enter an application question..."
    value={applicationQuestion}
    onChange={(event) => setApplicationQuestion(event.target.value)}
  />

  <button onClick={handleApplicationAssistant}disabled={isLoading}>
    Generate Response
  </button>

  {applicationResponse && (
  <div>
    <h3>Generated Response</h3>
    <p>{applicationResponse}</p>
  </div>
)}
</div>


<div>
  <h2>Career Agent</h2>

  <input
    type="text"
    placeholder="Ask the agent something..."
    value={agentRequest}
    onChange={(event) => setAgentRequest(event.target.value)}
  />

  <button onClick={handleAgentRequest}disabled={isLoading}>
    Ask Agent
  </button>

  {agentResponse && (
    <div>
      <h3>Agent Response</h3>
      <p>{agentResponse}</p>
    </div>
  )}
</div>

</div>
      </section>
    </>
  )
}

export default App