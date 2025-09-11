import { useEffect, useState, useRef } from "react";
import {
  getTotalJuniorTechJobs,
  getLatestJuniorTechJobs,
  getTopCitiesForJuniorTech,
} from "../services/jobService";
import type { JobAd } from "../models/IJobs";
import type { CityStat } from "../services/jobService";

import { DigiInfoCard, DigiBarChart } from "@digi/arbetsformedlingen-react";
import "./Dashboard.scss";

// --------------------
// Toppstäder diagram
// --------------------
function TopCitiesChart({ cities }: { cities: CityStat[] }) {
  const chartRef = useRef<DigiBarChart>(null);

  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;

    const handler = (e: CustomEvent<any>) =>
      console.log("Klick på stapel:", e.detail);
    el.addEventListener("afOnClickBar", handler);

    return () => el.removeEventListener("afOnClickBar", handler);
  }, []);

  if (!cities || cities.length === 0) return <p>Inga data tillgängliga</p>;

  const chartData = {
    data: {
      xValues: cities.map((_, index) => index + 1),
      xValueNames: cities.map((c) => c.name),
      series: [
        {
          yValues: cities.map((c) => c.count),
          title: "Antal jobb",
        },
      ],
    },
    x: "Stad",
    y: "Antal jobb",
    title: "",
    subTitle: "",
    infoText: "",
    meta: {
      valueLabels: true,
      hideXAxis: false,
    },
  };

  return (
    <DigiBarChart
      ref={chartRef}
      afHeading="Antal junior techjobb per stad"
      afVariation="vertical"
      afChartData={chartData}
      style={{ width: "100%", height: "300px" }}
    />
  );
}

// --------------------
// Senaste jobblistan
// --------------------
function LatestJobsList({ jobs }: { jobs: JobAd[] }) {
  if (!jobs || jobs.length === 0) return <p>Inga jobbannonser</p>;

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
    <div className="dashboard">
      {/* Totalt antal techjobb */}
      <DigiInfoCard afHeading="Totalt antal techjobb idag" className="dashboard__card">
        <p className="dashboard__total">{total}</p>
      </DigiInfoCard>

      {/* Toppstäder */}
      <DigiInfoCard afHeading="Toppstäder – Junior techjobb" className="dashboard__card">
        <div style={{ width: "100%", maxWidth: "600px", height: "300px" }}>
          <TopCitiesChart cities={cities} />
        </div>
      </DigiInfoCard>

      {/* Senaste jobbannonser */}
      <DigiInfoCard afHeading="Senaste jobbannonser" className="dashboard__card">
        <LatestJobsList jobs={latest} />
      </DigiInfoCard>
    </div>
  );
}
