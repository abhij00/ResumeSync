
// src/components/UploadView.jsx
import axios from "axios";
import React, { useState, useEffect } from "react";

export default function UploadView() {

  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState("");

  // Load jobs
  useEffect(() => {
    fetch("http://localhost:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  // File selection
  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setProgress(0);
    setMessage("");
  };

  // Upload function
  const handleUpload = async () => {

    if (!selectedJob) {
      setMessage("Please select a job role");
      return;
    }

    if (files.length === 0) {
      setMessage("Please select files to upload");
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("resumes", file);
    });

    formData.append("jobId", selectedJob);

    try {

      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round((event.loaded * 100) / event.total);
              setProgress(percent);
            }
          },
        }
      );

      console.log("Upload response:", response.data);

      setMessage("Upload successful ✅");
      setFiles([]);
      setProgress(100);

    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Upload failed ❌");
    }
  };

  return (
    <div className="p-8 flex flex-col items-center">

      <h1 className="text-4xl font-bold mb-6">Upload Resumes</h1>

      {/* Job selector */}
      <select
        value={selectedJob}
        onChange={(e) => setSelectedJob(e.target.value)}
        className="mb-4 p-2 border rounded w-64"
      >
        <option value="">Select job to upload</option>

        {jobs.map((job) => (
          <option key={job.id} value={job.id}>
            {job.title}
          </option>
        ))}

      </select>

      {/* Upload box */}
      <label className="flex flex-col items-center justify-center w-full max-w-md p-6 border-2 border-dashed cursor-pointer rounded-lg">

        <span className="text-gray-600 mb-2">
          Click or drag files
        </span>

        <input
          type="file"
          multiple
          accept=".pdf,.docx,.jpg,.jpeg,.png,.txt"
          className="hidden"
          onChange={handleFileChange}
        />

      </label>

      {/* File info */}
      {files.length > 0 && (

        <div className="w-full max-w-md mt-6">

          <p className="font-medium mb-2">
            Selected {files.length} file(s)
          </p>

          {/* Progress bar */}
          <div className="bg-gray-200 h-3 rounded">
            <div
              className="bg-blue-500 h-3 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Upload button */}
          <button
            onClick={handleUpload}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Upload
          </button>

          {/* Message */}
          {message && (
            <p className="mt-3 text-center">
              {message}
            </p>
          )}

        </div>
      )}

    </div>
  );
}