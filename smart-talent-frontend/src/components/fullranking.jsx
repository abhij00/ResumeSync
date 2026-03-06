//src/components/fullranking.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Fullranking() {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/ranking/${jobId}`)
      .then((res) => setCandidates(res.data.candidates))
      .catch(console.error);
  }, [jobId]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Full Candidate Ranking</h1>

      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Years Exp</th>
            <th>Skills</th>
            <th>AI Justification</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td className="text-center">{c.score}%</td>
              <td className="text-center">{c.years}</td>
              <td>{c.skills.join(", ")}</td>
              <td>{c.justification}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}