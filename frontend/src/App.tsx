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

  const handleAnalyze = () => {
    if (!resumeFile) {
      alert('Please upload a resume.')
      return
    }
  
    if (!jobDescription.trim()) {
      alert('Please paste a job description.')
      return
    }
    
    const formData = new FormData()

formData.append('resume', resumeFile)
formData.append('job_description', jobDescription)

fetch('http://127.0.0.1:8000/analyze', {
  method: 'POST',
  body: formData,
})
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    setAnalysis(data.analysis)

  })
}
const handleAskResume = () => {
  const formData = new FormData()
  formData.append('question', resumeQuestion)

  fetch('http://127.0.0.1:8000/ask', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setResumeAnswer(data.answer)
    })
}

const handleGenerateInterviewQuestions = () => {
  const formData = new FormData()
  formData.append('job_description', jobDescription)

  fetch('http://127.0.0.1:8000/interview-questions', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data)
      setInterviewQuestions(data.questions)
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

<button type="button" onClick={handleAnalyze}>
  Analyze Match
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

 <button onClick={handleAskResume}>
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

  <button onClick={handleGenerateInterviewQuestions}>
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

</div>
      </section>
    </>
  )
}

export default App