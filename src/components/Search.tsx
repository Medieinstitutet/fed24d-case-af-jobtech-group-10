import { useEffect, useState, useCallback } from "react";
import { searchJuniorTechJobs, getTopCitiesForJuniorTech } from "../services/jobService";
import type { JobAd } from "../models/IJobs";
import type { CityStat } from "../services/jobService";
import type { TaxonomyConcept } from "../services/taxonomyService";
import { Link } from "react-router-dom";
import "../styles/Search.scss";
import { DigiButton, DigiLoaderSpinner } from "@digi/arbetsformedlingen-react";

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

// --------------------
// Sökformulär
// --------------------
function SearchForm({
  query,
  setQuery,
  filterCity,
  setFilterCity,
  selectedOccupationGroup,
  setSelectedOccupationGroup,
  selectedOccupation,
  setSelectedOccupation,
  workingHours,
  setWorkingHours,
  cities,
  workingHoursOptions,
  occupationGroupOptions,
  occupationOptions,
  onSearch,
}: {
  query: string;
  setQuery: (q: string) => void;
  filterCity: string;
  setFilterCity: (c: string) => void;
  selectedOccupationGroup: string;
  setSelectedOccupationGroup: (id: string) => void;
  selectedOccupation: string;
  setSelectedOccupation: (id: string) => void;
  workingHours: string;
  setWorkingHours: (w: string) => void;
  cities: CityStat[];
  workingHoursOptions: TaxonomyConcept[];
  occupationGroupOptions: TaxonomyConcept[];
  occupationOptions: TaxonomyConcept[];
  onSearch: () => void;
}) {
  return (
    <div className="search-form">
      <input
        type="text"
        placeholder="Sök bland junior techjobb..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
        <option value="">Alla städer</option>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select value={workingHours} onChange={(e) => setWorkingHours(e.target.value)}>
        <option value="">Alla anställningstyper</option>
        {workingHoursOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>

      <select value={selectedOccupationGroup} onChange={(e) => setSelectedOccupationGroup(e.target.value)}>
        <option value="">Alla yrkesgrupper</option>
        {occupationGroupOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>

      <select value={selectedOccupation} onChange={(e) => setSelectedOccupation(e.target.value)}>
        <option value="">Alla yrkesroller</option>
        {occupationOptions.map((opt) => (
          <option key={opt.id} value={opt.id}>{opt.label}</option>
        ))}
      </select>

      <DigiButton
        afSize="medium"
        afVariation="primary"
        afFullWidth={false}
        onAfOnClick={onSearch}
      >
        Sök
      </DigiButton>
    </div>
  );
}

// --------------------
// Job results
// --------------------
function JobResultsList({ jobs }: { jobs: JobAd[] }) {
  if (!jobs.length) return <p>Inga jobbannonser hittades</p>;

  return (
    <div className="job-results">
      {jobs.map((job) => (
        <Link to={`/job/${job.id}`} key={job.id} className="job-card-link">
          <div className="job-card">
            <h3>{job.headline}</h3>
            <p>{job.workplace}</p>
            <p>{job.city || "Okänd stad"}</p>
            {job.working_hours_type && (
              <span className={`working-hours ${job.working_hours_type.label.toLowerCase()}`}>
                {job.working_hours_type.label}
              </span>
            )}
            <DigiButton className="read-more" afSize="medium" afVariation="primary" afFullWidth={false}>
              Läs mer
            </DigiButton>
          </div>
        </Link>
      ))}
    </div>
  );
}

// --------------------
// Pagination
// --------------------
function getPageNumbers(page: number, totalPages: number, maxVisible: number = 5): number[] {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, page + half);

  if (end - start + 1 < maxVisible) {
    if (start === 1) end = Math.min(totalPages, start + maxVisible - 1);
    if (end === totalPages) start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = page === 1;
  const nextDisabled = page === totalPages;
  const visiblePages = getPageNumbers(page, totalPages, 5);

  return (
    <div className="pagination">
      <DigiButton
        afSize="small"
        afVariation="primary"
        afFullWidth={false}
        onAfOnClick={() => { if (prevDisabled) return; onPageChange(page - 1);}}
        aria-disabled={prevDisabled}
        className={`af-Variation-primary ${prevDisabled ? "disabled" : ""}`}
      >
        Föregående
      </DigiButton>

      {visiblePages.map((p) => (
        <DigiButton
          key={p}
          afVariation="secondary"
          afSize="small"
          afFullWidth={false}
          onAfOnClick={() => onPageChange(p)}
          aria-current={page === p ? "true" : undefined}
          className={`af-Variation-${page === p ? "primary" : "secondary"} ${page === p ? "active" : ""}`}
        >
          {p}
        </DigiButton>
      ))}

      <DigiButton
        afSize="small"
        afVariation="secondary"
        afFullWidth={false}
        onAfOnClick={() => { if (nextDisabled) return; onPageChange(page + 1);}}
        aria-disabled={nextDisabled}
        className={`af-Variation-secondary ${nextDisabled ? "disabled" : ""}`}
      >
        Nästa
      </DigiButton>
    </div>
  );
}

// --------------------
// Huvudsida
// --------------------
export default function Search() {
  const [results, setResults] = useState<JobAd[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filterCity, setFilterCity] = useState("");
  const [selectedOccupationGroup, setSelectedOccupationGroup] = useState("");
  const [selectedOccupation, setSelectedOccupation] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [cities, setCities] = useState<CityStat[]>([]);
  const [loading, setLoading] = useState(false);
  const [workingHoursOptions, setWorkingHoursOptions] = useState<TaxonomyConcept[]>([]);
  const [occupationGroupOptions, setOccupationGroupOptions] = useState<TaxonomyConcept[]>([]);
  const [occupationOptions, setOccupationOptions] = useState<TaxonomyConcept[]>([]);

  const limit = 25;
  const totalPages = Math.ceil(totalJobs / limit);

  // --------------------
  // Hjälp: unika dropdown-options
  // --------------------
  const getUniqueOptions = (jobs: JobAd[], key: keyof JobAd): TaxonomyConcept[] => {
    const map: Record<string, TaxonomyConcept> = {};
    jobs.forEach((job) => {
      const val = job[key] as unknown as { concept_id: string; label: string } | undefined;
      if (val && val.concept_id && !map[val.concept_id]) {
        map[val.concept_id] = { id: val.concept_id, label: val.label };
      }
    });
    return Object.values(map);
  };

  // --------------------
  // Sökfunktion
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
          filterCity || "",
          selectedOccupationGroup || "",
          workingHours || "",
          selectedOccupation || ""
        );

        setResults(jobs);
        setTotalJobs(total);

        // Dynamiskt bygg dropdowns
        setWorkingHoursOptions(getUniqueOptions(jobs, "working_hours_type"));
        setOccupationGroupOptions(getUniqueOptions(jobs, "occupation_group"));
        setOccupationOptions(getUniqueOptions(jobs, "occupation"));
      } finally {
        setLoading(false);
      }
    },
    [query, filterCity, selectedOccupationGroup, workingHours, selectedOccupation]
  );

  // Init: städer + första sökning
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
    <>
    <h3 className="findjob">Hitta ditt nästa jobb</h3>
    <div className="search">
      <SearchForm
        query={query}
        setQuery={setQuery}
        filterCity={filterCity}
        setFilterCity={setFilterCity}
        selectedOccupationGroup={selectedOccupationGroup}
        setSelectedOccupationGroup={setSelectedOccupationGroup}
        selectedOccupation={selectedOccupation}
        setSelectedOccupation={setSelectedOccupation}
        workingHours={workingHours}
        setWorkingHours={setWorkingHours}
        cities={cities}
        workingHoursOptions={workingHoursOptions}
        occupationGroupOptions={occupationGroupOptions}
        occupationOptions={occupationOptions}
        onSearch={() => handleSearch(1)}
      />

      {loading ? (
        <DigiLoaderSpinner af-size="medium" afText="Lediga techjobben laddar" />
      ) : (
        <>
        <p className="results-count"> {totalJobs} {totalJobs === 1 ? "träff" : "träffar"} </p>
        <JobResultsList jobs={results} />
        </>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={handleSearch} />
    </div>
  </>
  );
}
