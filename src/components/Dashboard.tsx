import { useEffect, useState, useRef } from "react";
import {
  getTotalJuniorTechJobs,
  getLatestJuniorTechJobs,
  getTopCitiesForJuniorTech,
} from "../services/jobService";
import type { JobAd } from "../models/IJobs";
import type { CityStat } from "../services/jobService";

import { DigiInfoCard, DigiBarChart, DigiLoaderSpinner } from "@digi/arbetsformedlingen-react";
import "../styles/Dashboard.scss";

// --------------------
// Dashboard 2 - Toppstäder diagram (Junior techjobb statistik)
// --------------------
export function TopCitiesChart({ cities }: { cities: CityStat[] }) {
  const chartRef = useRef<HTMLDigiBarChartElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [sizeKey, setSizeKey] = useState(0);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    type BarClickDetail = { name: string; value: number };
    const handler = (e: CustomEvent<BarClickDetail>) => {
      console.log("Klick på stapel:", e.detail);
    };

    el.addEventListener("afOnClickBar", handler as EventListener);
    return () => el.removeEventListener("afOnClickBar", handler as EventListener);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => setSizeKey((k) => k + 1));
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  if (!cities || cities.length === 0) return <p>Ingen data tillgänglig</p>;

  const chartData = {
    data: {
      xValues: cities.map((_, i) => i + 1),
      xValueNames: cities.map((c) => c.name),
      series: [
        { yValues: cities.map((c) => c.count), title: "Antal juniorjobb" },
      ],
    },
    x: "Stad",
    y: "Antal juniorjobb",
    title: "",
    subTitle: "Statistik på 100 jobb",
    infoText: "",
    meta: {
      valueLabels: true,
      hideXAxis: false,
    },
  };

  return (
    <div ref={containerRef} className="chart-container">
      <DigiBarChart
        key={sizeKey}
        ref={chartRef}
        afHeadingLevel="h2"
        af-variation="vertical"
        afChartData={chartData}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}

// --------------------
// Dashboard 3 - Senaste juniorjobb-listan
// --------------------
function LatestJobsList({ jobs }: { jobs: JobAd[] }) {
  if (!jobs || jobs.length === 0) return <p>Inga jobbannonser</p>;

  return (
    <ul>
      {jobs.map((job) => (
        <li key={job.id}>
          <a href={job.application_url} target="_blank" rel="noreferrer">
            {job.headline} ({job.city})
          </a>
        </li>
      ))}
    </ul>
  );
}

// --------------------
// Huvudinstrumentpanel (Dashboard)
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
        // Hämta data via de angivna API-anropen
        const [totalJobs, topCities, latestJobs] = await Promise.all([
          getTotalJuniorTechJobs(), // Hämta totala juniorjobb
          getTopCitiesForJuniorTech(4), // Hämta topp 4 städer för juniorjobb
          getLatestJuniorTechJobs(4), // Hämta senaste 4 juniorjobb
        ]);
        setTotal(totalJobs); // Totalt antal juniorjobb
        setCities(topCities); // Toppstäder för juniorjobb
        setLatest(latestJobs); // Lista över de senaste juniorjobben
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading)
  return (
    <div className="loader-container">
      <DigiLoaderSpinner af-size="medium" afText="Snart klart! Dashboard laddas..." />
    </div>
  );

  return (
    <div className="dashboard">
      {/* Dashboard 1 - Totalt antal junior techjobb */}
      <DigiInfoCard af-heading="Totalt antal junior techjobb idag" af-heading-level="h2" className="dashboard__card">
        <p className="dashboard__total">{total}</p>
      </DigiInfoCard>

      {/* Dashboard 2 - Toppstäder för junior techjobb */}
      <DigiInfoCard af-heading="Toppstäder – Junior techjobb" af-heading-level="h2" className="dashboard__card">
        <div>
          <TopCitiesChart cities={cities} />
        </div>
      </DigiInfoCard>

      {/* Dashboard 3 - Nya juniorjobb annonser */}
      <DigiInfoCard af-heading="Nya juniorjobbannonser" af-heading-level="h2" className="dashboard__card">
        <LatestJobsList jobs={latest} />
      </DigiInfoCard>
    </div>
  );
}
