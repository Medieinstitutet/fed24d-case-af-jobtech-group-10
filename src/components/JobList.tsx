import React from "react";
import type { JobAd } from "../models/IJobs"; // Typimport

interface JobListProps {
  jobs: JobAd[];
}

const JobList: React.FC<JobListProps> = ({ jobs }) => (
  <div>
    {jobs.map((job) => (
      <div key={job.id} className="job-card">
        <h3>{job.headline}</h3>
        <p>{job.workplace}</p>
        <p>{job.city}</p>
        <p>{job.published}</p>
        <a href={job.application_url} target="_blank" rel="noopener noreferrer">
          Ansök här
        </a>
      </div>
    ))}
  </div>
);

export default JobList;
