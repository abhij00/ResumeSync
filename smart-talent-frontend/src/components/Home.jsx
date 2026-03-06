
// src/components/Home.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);

  useEffect(() => {
    // Fetch all jobs
    axios.get("http://localhost:5000/jobs")
      .then(res => {
        setJobs(res.data || []);
        if (res.data && res.data.length > 0) {
          setSelectedJobId(res.data[0].id); // pick first job by default
        }
      })
      .catch(err => console.error("Jobs fetch error:", err));
  }, []);

  // Fetch ranking when a job is selected
  useEffect(() => {
    if (!selectedJobId) return;
    axios.get(`http://localhost:5000/ranking/${selectedJobId}`)
      .then(res => setRanking(res.data.candidates || []))
      .catch(err => {
        console.error("Ranking fetch error:", err);
        setRanking([]);
      });
  }, [selectedJobId]);

  return (
    <div className="p-10">

      {/* ACTIVE JOB ROLES */}
      <h2 className="text-2xl font-bold mb-6">Active Job Roles</h2>
      <div className="flex gap-4 mb-12">
        {jobs.map((job) => (
          <div key={job.id} className="flex flex-col items-center">
            <button
              onClick={() => setSelectedJobId(job.id)}
              className={`w-20 h-20 rounded-lg flex items-center justify-center text-center p-1 break-words leading-tight hover:bg-gray-400 ${
                selectedJobId === job.id ? "bg-blue-300" : "bg-gray-300"
              }`}
            >
              {job.title}
            </button>
          </div>
        ))}

        <Link
          to="/job/new"
          className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-3xl hover:bg-gray-300"
        >
          +
        </Link>
      </div>

      {/* RANKING TABLE */}
      <h2 className="text-2xl font-bold mb-4">
        Ranking {selectedJobId ? `for "${jobs.find(j => j.id === selectedJobId)?.title}"` : ""}
      </h2>
      <div className="max-w-xl overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-blue-400 text-white">
            <tr>
              <th className="p-2 text-left">Candidate</th>
              <th className="p-2 text-center">Score</th>
            </tr>
          </thead>
          <tbody>
            {ranking.length === 0 ? (
              <tr>
                <td colSpan={2} className="p-2 text-center">
                  No candidates found
                </td>
              </tr>
            ) : (
              ranking.map((c, i) => (
                <tr key={c.id} className="border-b">
                  <td className="p-2">{c.name || "-"}</td>
                  <td className="p-2 text-center">{c.score ?? "-"}%</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selectedJobId && (
          <Link to={`/ranking/${selectedJobId}`} className="text-blue-600 mt-2 inline-block">
            See More →
          </Link>
        )}
      </div>

      {/* UPLOAD BUTTON */}
      <div className="mt-10">
        <Link
          to="/upload"
          className="block w-full bg-blue-500 text-white text-center py-3 rounded-lg text-lg hover:bg-blue-600"
        >
          + Upload Resumes
        </Link>
      </div>
    </div>
  );
}