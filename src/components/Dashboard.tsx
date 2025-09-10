import { useEffect, useState } from "react";
import {
  getTotalJuniorTechJobs,
  getLatestJuniorTechJobs,
  searchJuniorTechJobs,
  getTopCitiesForJuniorTech,
} from "../services/jobService";
import type { JobAd } from "../models/IJobs";
import type { CityStat } from "../services/jobService";

// Recharts
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Dashboard() {
  const [total, setTotal] = useState<number | null>(null);
  const [latest, setLatest] = useState<JobAd[]>([]);
  const [cities, setCities] = useState<CityStat[]>([]);
  const [results, setResults] = useState<JobAd[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filterCity, setFilterCity] = useState("");
  const [loading, setLoading] = useState(false);

  const limit = 25; // max antal jobb per sida
  const totalPages = Math.ceil(totalJobs / limit);

  // Ladda total, top cities och senaste annonser + första sidan jobb
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        setTotal(await getTotalJuniorTechJobs());
        setCities(await getTopCitiesForJuniorTech(4)); // Top 4 städer
        setLatest(await getLatestJuniorTechJobs(3));

        const { jobs, total } = await searchJuniorTechJobs("", 1, limit);
        setResults(jobs);
        setTotalJobs(total);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Hantera sökning och sidbyten
  async function handleSearch(newPage: number = 1) {
    setPage(newPage);
    setLoading(true);
    try {
      const { jobs, total } = await searchJuniorTechJobs(query, newPage, limit, filterCity);
      setResults(jobs);
      setTotalJobs(total);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      {loading && <p>Laddar...</p>}

      {/* Kortsektionen */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "40px" }}>
        <div className="card">
          <h4>Totalt junior techjobb</h4>
          <p>{total}</p>
        </div>

        {/* Top Cities-diagram */}
        <div className="card" style={{ flex: 1 }}>
          <h4>Top Cities – Junior techjobb</h4>
          {cities.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cities}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>Inga data tillgängliga</p>
          )}
        </div>

        <div className="card">
          <h4>Senaste annonser</h4>
          <ul>
            {latest.map((job) => (
              <li key={job.id}>
                <a href={job.workplace} target="_blank" rel="noreferrer">
                  {job.headline} {job.city ? `(${job.city})` : ""}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sökfält */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Sök bland junior techjobb..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
          <option value="">Alla städer</option>
          {cities.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <button onClick={() => handleSearch(1)}>Sök</button>
      </div>

      {/* Sökresultat */}
      <ul>
        {results.map((job) => (
          <li key={job.id}>
            <a href={job.workplace} target="_blank" rel="noreferrer">
              {job.headline} {job.city ? `(${job.city})` : ""}
            </a>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {results.length > 0 && totalPages > 1 && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => handleSearch(page - 1)} disabled={page === 1}>
            Föregående
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handleSearch(i + 1)}
              style={{
                margin: "0 5px",
                fontWeight: page === i + 1 ? "bold" : "normal",
              }}
            >
              {i + 1}
            </button>
          ))}

          <button onClick={() => handleSearch(page + 1)} disabled={page === totalPages}>
            Nästa
          </button>
        </div>
      )}
    </div>
  );
}
