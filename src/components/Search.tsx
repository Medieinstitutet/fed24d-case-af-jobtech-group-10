import { useEffect, useState, useCallback } from "react";
import { searchJuniorTechJobs, getTopCitiesForJuniorTech } from "../services/jobService";
import type { JobAd } from "../models/IJobs";
import type { CityStat } from "../services/jobService";
import { Link } from "react-router-dom";

// occupation_groups – lägg till fler vid behov
const occupationGroups = [
  { id: "DJh5_yyF_hEM", label: "Mjukvaru- och systemutvecklare m.fl." },
  { id: "Q5DF_juj_8do", label: "Utvecklare inom spel och digitala media" },
];

// --------------------
// Sökformulärkomponent
// --------------------
function SearchForm({
  query,
  setQuery,
  filterCity,
  setFilterCity,
  selectedOccupationGroup,
  setSelectedOccupationGroup,
  cities,
  onSearch,
}: {
  query: string;
  setQuery: (q: string) => void;
  filterCity: string;
  setFilterCity: (c: string) => void;
  selectedOccupationGroup: string;
  setSelectedOccupationGroup: (id: string) => void;
  cities: CityStat[];
  onSearch: () => void;
}) {
  return (
    <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
      <input
        type="text"
        placeholder="Sök bland junior techjobb..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ flex: 1, padding: "8px" }}
      />

      <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} style={{ padding: "8px" }}>
        <option value="">Alla städer</option>
        {cities.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={selectedOccupationGroup}
        onChange={(e) => setSelectedOccupationGroup(e.target.value)}
        style={{ padding: "8px" }}
      >
        <option value="">Alla yrkesgrupper</option>
        {occupationGroups.map((og) => (
          <option key={og.id} value={og.id}>
            {og.label}
          </option>
        ))}
      </select>

      <button onClick={onSearch} style={{ padding: "8px 16px" }}>
        Sök
      </button>
    </div>
  );
}

function JobResultsList({ jobs }: { jobs: JobAd[] }) {
  if (jobs.length === 0) return <p>Inga jobbannonser hittades</p>;

  return (
    <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))" }}>
      {jobs.map((job) => (
        <div
          key={job.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            background: "#fff",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* Titel som länk */}
          <Link to={`/job/${job.id}`} style={{ textDecoration: "none", color: "#333" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{job.headline}</h3>
          </Link>

          <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#555" }}>
            {job.workplace}
          </p>
          <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#555" }}>
            {job.city || "Okänd stad"}
          </p>

          {job.working_hours_type && (
            <span
              style={{
                display: "inline-block",
                padding: "2px 8px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#fff",
                backgroundColor: job.working_hours_type === "Heltid" ? "#4caf50" : "#2196f3",
                borderRadius: "4px",
                alignSelf: "flex-start",
              }}
            >
              {job.working_hours_type}
            </span>
          )}

          {/* Ny tydlig knapp-länk */}
          <Link
            to={`/job/${job.id}`}
            style={{
              marginTop: "12px",
              padding: "6px 12px",
              backgroundColor: "#1976d2",
              color: "#fff",
              borderRadius: "4px",
              textAlign: "center",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "bold",
              alignSelf: "flex-start",
            }}
          >
            Läs mer om jobbet
          </Link>
        </div>
      ))}
    </div>
  );
}

// --------------------
// Pagineringskomponent
// --------------------
function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ marginTop: "20px", display: "flex", gap: "5px", flexWrap: "wrap" }}>
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}>
        Föregående
      </button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          style={{ fontWeight: page === i + 1 ? "bold" : "normal" }}
        >
          {i + 1}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}>
        Nästa
      </button>
    </div>
  );
}

// --------------------
// Huvudsökningskomponent
// --------------------
export default function Search() {
  const [results, setResults] = useState<JobAd[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filterCity, setFilterCity] = useState("");
  const [selectedOccupationGroup, setSelectedOccupationGroup] = useState("");
  const [cities, setCities] = useState<CityStat[]>([]);
  const [loading, setLoading] = useState(false);

  const limit = 25;
  const totalPages = Math.ceil(totalJobs / limit);

  // --------------------
  // Hantera sökning med useCallback
  // --------------------
  const handleSearch = useCallback(
    async (newPage: number = 1) => {
      setPage(newPage);
      setLoading(true);
      try {
        const { jobs, total } = await searchJuniorTechJobs(
          query,
          newPage,
          limit,
          filterCity,
          selectedOccupationGroup
        );
        setResults(jobs);
        setTotalJobs(total);
      } finally {
        setLoading(false);
      }
    },
    [query, filterCity, selectedOccupationGroup]
  );

  // --------------------
  // Initiera toppstäder + initial sökning
  // --------------------
  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const topCities = await getTopCitiesForJuniorTech(10);
        setCities(topCities);
        await handleSearch(1);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [handleSearch]);

  return (
    <div>
      <SearchForm
        query={query}
        setQuery={setQuery}
        filterCity={filterCity}
        setFilterCity={setFilterCity}
        selectedOccupationGroup={selectedOccupationGroup}
        setSelectedOccupationGroup={setSelectedOccupationGroup}
        cities={cities}
        onSearch={() => handleSearch(1)}
      />

      {loading ? <p>Laddar...</p> : <JobResultsList jobs={results} />}
      <Pagination page={page} totalPages={totalPages} onPageChange={handleSearch} />
    </div>
  );
}
