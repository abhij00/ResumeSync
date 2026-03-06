
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Jobview() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const isNewJob = jobId === "new";
  const [job, setJob] = useState({});
  const [resumes, setResumes] = useState([]);
  const [showForm, setShowForm] = useState(isNewJob);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Load job details
  useEffect(() => {
    if (!jobId || isNewJob) return;
    axios.get(`http://localhost:5000/jobs/${jobId}`)
      .then(res => setJob(res.data))
      .catch(console.error);

    axios.get(`http://localhost:5000/candidates?job_id=${jobId}`)
      .then(res => setResumes(res.data))
      .catch(console.error);
  }, [jobId, isNewJob]);

  // Add job
  const addJob = async () => {
    if (!title) return alert("Please enter job title");
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    try {
      await axios.post("http://localhost:5000/jobs", formData);
      alert("Job Added Successfully");
      setTitle(""); setDescription(""); setShowForm(false);
    } catch (error) {
      console.error(error); alert("Error adding job");
    }
  };

  // Delete job
  const deleteJob = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axios.delete(`http://localhost:5000/jobs/${jobId}`);
      alert("Job deleted successfully");
      navigate("/");
    } catch (err) {
      console.error(err); alert("Error deleting job");
    }
  };

  // Delete resume
  const deleteResume = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await axios.delete(`http://localhost:5000/candidates/${id}`);
      setResumes(resumes.filter(r => r.id !== id));
    } catch (err) {
      console.error(err); alert("Error deleting resume");
    }
  };

  return (
    <div className="p-8">

      {!isNewJob && job && (
        <div>
          <h1 className="text-3xl font-bold">{job.title}</h1>
          <p className="mt-4 text-gray-700">{job.description}</p>

          <div className="flex gap-4 mt-4">
            <Link to={`/ranking/${jobId}`} className="text-blue-500 underline">View Rankings</Link>
            <button onClick={deleteJob} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Delete Job</button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Resumes</h2>
            {resumes.length === 0 && <p>No resumes uploaded yet.</p>}
            {resumes.map(r => (
              <div key={r.id} className="flex justify-between border p-2 mb-2 rounded">
                <span>{r.name}</span>
                <button onClick={() => deleteResume(r.id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ADD JOB FORM */}
      {!showForm ? (
        <div onClick={() => setShowForm(true)} className="mt-10 border-2 border-dashed h-32 w-64 flex items-center justify-center text-4xl cursor-pointer hover:bg-gray-100">+</div>
      ) : (
        <div className="mt-6 border p-6 rounded w-96 bg-white shadow">
          <h2 className="text-xl font-bold mb-4">Add Job Role</h2>
          <input type="text" placeholder="Job Title" className="border p-2 w-full mb-3 rounded" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea placeholder="Job Description" className="border p-2 w-full mb-3 rounded" value={description} onChange={e => setDescription(e.target.value)} />
          <div className="flex gap-3">
            <button onClick={addJob} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Job</button>
            <button onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}