import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobDetails } from "../services/jobService";
import type { JobAd } from "../models/IJobs";

export default function JobDetail() {
  const { id } = useParams<{ id: string }>();
  console.log("Job ID från URL:", id);  // Logga ID från URL

  const [job, setJob] = useState<JobAd | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      console.log("Hämtar jobbdata för id:", id);  // Logga när vi börjar hämta jobb
      setLoading(true);
      try {
        const jobData = await getJobDetails(id);
        console.log("Jobbdata hämtad:", jobData);  // Logga jobbdata
        setJob(jobData);
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [id]);

  if (loading) return <p>Laddar...</p>;
  if (!job) return <p>Kunde inte hitta jobbet.</p>;

  console.log("Jobb som ska renderas:", job);  // Logga jobbdata innan rendering

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
        ← Tillbaka till sökresultat
      </Link>

      <h1 style={{ margin: "20px 0" }}>{job.headline}</h1>
      <p><strong>Arbetsplats:</strong> {job.workplace}</p>
      <p><strong>Stad:</strong> {job.city || "Okänd stad"}</p>
      <p><strong>Anställningsform:</strong> {job.working_hours_type?.label || "Ej angivet"}</p>
      <p><strong>Yrke:</strong> {job.occupation?.label || "Ej angivet"}</p>

      <hr style={{ margin: "20px 0" }} />

      <h2>Beskrivning</h2>
      <p>{job.description || "Ingen beskrivning tillgänglig."}</p>

      {job.application_url && (
        <a
          href={job.application_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#1976d2",
            color: "#fff",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold",
          }}
        >
          Ansök här
        </a>
      )}
    </div>
  );
}