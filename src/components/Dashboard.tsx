import { useEffect, useState } from "react";
import {
  getTotalJuniorTechJobs,
  getLatestJuniorTechJobs,
  getTopCitiesForJuniorTech,
} from "../services/jobService";
import type { JobAd } from "../models/IJobs";
import type { CityStat } from "../services/jobService";

// Recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// --------------------
// Kortkomponent
// --------------------
function DashboardCard({
  title,
  children,
  style,
}: {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties; // <-- tillåt style
}) {
  return (
    <div
      className="card"
      style={{
        padding: "20px",
        borderRadius: "8px",
        background: "#fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        ...style, // <-- slå ihop med style prop
      }}
    >
      <h4>{title}</h4>
      {children}
    </div>
  );
}

// --------------------
// Toppstäder diagram
// --------------------
function TopCitiesChart({ cities }: { cities: CityStat[] }) {
  if (cities.length === 0) return <p>Inga data tillgängliga</p>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={cities}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

// --------------------
// Senaste jobblistan
// --------------------
function LatestJobsList({ jobs }: { jobs: JobAd[] }) {
  if (jobs.length === 0) return <p>Inga jobbannonser</p>;

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>
          <a href={job.workplace} target="_blank" rel="noreferrer">
            {job.headline} {job.city ? `(${job.city})` : ""}
          </a>
        </li>
      ))}
    </ul>
  );
}

// --------------------
// Huvudinstrumentpanel
// --------------------
export default function Dashboard() {
  const [total, setTotal] = useState<number | null>(null);
  const [latest, setLatest] = useState<JobAd[]>([]);
  const [cities, setCities] = useState<CityStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [totalJobs, topCities, latestJobs] = await Promise.all([
          getTotalJuniorTechJobs(),
          getTopCitiesForJuniorTech(4),
          getLatestJuniorTechJobs(5),
        ]);
        setTotal(totalJobs);
        setCities(topCities);
        setLatest(latestJobs);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <p>Laddar dashboard...</p>;

  return (
    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <DashboardCard title="Totalt antal techjobb idag">
        <p style={{ fontSize: "24px", fontWeight: "bold" }}>{total}</p>
      </DashboardCard>

      <DashboardCard title="Toppstäder – Junior techjob" style={{ flex: 1 }}>
        <TopCitiesChart cities={cities} />
      </DashboardCard>

      <DashboardCard title="Senaste jobbannonser">
        <LatestJobsList jobs={latest} />
      </DashboardCard>
    </div>
  );
}
