
// src/components/RankingView.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function RankingView() {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/ranking/${jobId}`)
      .then((res) => setCandidates(res.data.candidates))
      .catch(console.error);
  }, [jobId]);

  const preview = candidates.slice(0, 5);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Candidate Ranking</h1>
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-blue-500 text-white">
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Years Exp</th>
            <th>Skills</th>
          </tr>
        </thead>
        <tbody>
          {preview.map((c, i) => (
            <tr key={i}>
              <td>{c.name}</td>
              <td className="text-center">{c.score}%</td>
              <td className="text-center">{c.years}</td>
              <td>{c.skills.join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {candidates.length > 5 && (
        <Link
          to={`/ranking-full/${jobId}`}
          className="text-blue-500 underline mt-4 block"
        >
          See Full Table
        </Link>
      )}
    </div>
  );
}