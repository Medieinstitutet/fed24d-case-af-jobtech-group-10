import { useEffect, useState, useCallback } from "react";
import { searchJuniorTechJobs, getTopCitiesForJuniorTech, getWorkingHoursOptions, getOccupationGroupOptions, getOccupationOptions } from "../services/jobService";
import type { JobAd } from "../models/IJobs";
import type { CityStat } from "../services/jobService";
import type { TaxonomyConcept } from "../models/ITaxonomy";
import "../styles/Search.scss";
import { DigiButton, DigiLoaderSpinner, DigiInfoCard, DigiFormInputSearch, DigiFormFilter } from "@digi/arbetsformedlingen-react";

// --------------------
// Sökformulär
// --------------------
function SearchForm({
  query,
  setQuery,
  setFilterCity,
  setSelectedOccupationGroup,
  setSelectedOccupation,
  setWorkingHours,
  cities,
  workingHoursOptions,
  occupationGroupOptions,
  occupationOptions,
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
      {/* Sökfält */}
      <DigiFormInputSearch
        af-Label="Sök bland junior techjobb"
        af-Variation="medium"
        af-Type="search"
        af-Button-Text="Sök"
        afValue={query}
        onChange={(e) => {
          const target = e.target as HTMLInputElement;
          setQuery(target.value);
        }}
      />

      <DigiFormFilter
        afFilterButtonText="Välj stad"
        afSubmitButtonText="Filtrera"
        afName="Stad"
        afListItems={[{ id: "", label: "Alla städer" }, ...cities.map((c) => ({ id: c.id, label: c.name }))]}
        onAfSubmitFilter={(e: CustomEvent) => {
          const selected = e.detail.checked[0] || "";
          setFilterCity(selected);
        }}
      />

      <DigiFormFilter
        afFilterButtonText="Anställningstyp"
        afSubmitButtonText="Filtrera"
        afName="Anställningstyp"
        afListItems={[{ id: "", label: "Alla anställningstyper" }, ...workingHoursOptions]}
        onAfSubmitFilter={(e: CustomEvent) => {
          const selected = e.detail.checked[0] || "";
          setWorkingHours(selected);
        }}
      />

      <DigiFormFilter
        afFilterButtonText="Yrkesgrupp"
        afSubmitButtonText="Filtrera"
        afName="Yrkesgrupp"
        afListItems={[{ id: "", label: "Alla yrkesgrupper" }, ...occupationGroupOptions]}
        onAfSubmitFilter={(e: CustomEvent) => {
          const selected = e.detail.checked[0] || "";
          setSelectedOccupationGroup(selected);
        }}
      />

      <DigiFormFilter
        afFilterButtonText="Yrkesroll"
        afSubmitButtonText="Filtrera"
        afName="Yrkesroll"
        afListItems={[{ id: "", label: "Alla yrkesroller" }, ...occupationOptions]}
        onAfSubmitFilter={(e: CustomEvent) => {
          const selected = e.detail.checked[0] || "";
          setSelectedOccupation(selected);
        }}
      />
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
        <DigiInfoCard
          key={job.id}
          af-Heading={job.headline}
          af-Heading-Level="h3"
          af-Type="tip"
          af-Variation="primary"
          af-Size="standard"
          af-link-text="Läs mer"
          af-link-href={`/job/${job.id}`}
        >
          <p>{job.workplace}</p>
          <p>{job.city || "Okänd stad"}</p>
          {job.working_hours_type && (
            <span className={`working-hours ${job.working_hours_type.label.toLowerCase()}`}>
              {job.working_hours_type.label}
            </span>
          )}
        </DigiInfoCard>
      ))}
    </div>
  );
}

// --------------------
// Pagination
// --------------------
type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
};

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
      {/* Föregående */}
      <DigiButton
        afSize="small"
        afVariation="secondary"
        afFullWidth={false}
        onAfOnClick={() => !prevDisabled && onPageChange(page - 1)}
        aria-disabled={prevDisabled ? "true" : undefined}
      >
        Föregående
      </DigiButton>

      {/* Sidnummer */}
      {visiblePages.map((p) => (
        <DigiButton
          key={p}
          afSize="small"
          afVariation={page === p ? "primary" : "secondary"}
          afFullWidth={false}
          onAfOnClick={() => onPageChange(p)}
          aria-current={page === p ? "true" : undefined}
        >
          {p}
        </DigiButton>
      ))}

      {/* Nästa */}
      <DigiButton
        afSize="small"
        afVariation="secondary"
        afFullWidth={false}
        onAfOnClick={() => !nextDisabled && onPageChange(page + 1)}
        aria-disabled={nextDisabled ? "true" : undefined}
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
            const whOptions = await getWorkingHoursOptions();
            const ogOptions = await getOccupationGroupOptions();
            const oOptions = await getOccupationOptions();

            setCities(topCities);
            setWorkingHoursOptions(whOptions);
            setOccupationGroupOptions(ogOptions);
            setOccupationOptions(oOptions);

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
          <div className="loader-container">
            <DigiLoaderSpinner af-size="medium" afText="Hämtar de senaste lediga techjobben..." />
          </div>
        ) : (
          <>
            <p className="results-count">
              {totalJobs} {totalJobs === 1 ? "träff" : "träffar"}
            </p>
            <JobResultsList jobs={results} />
          </>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={handleSearch} />
      </div>
    </>
  );
}