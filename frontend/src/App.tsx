import { useState } from 'react'
import './App.css'

function App() {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')


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
      </section>
    </>
  )
}

export default App
