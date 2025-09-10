import api from "./api";
import type { JobAd, JobHit, SearchResponse } from "../models/IJobs";

/**
 * Totalt antal junior tech-jobb
 */
export async function getTotalJuniorTechJobs(): Promise<number> {
  const res = await api.get<SearchResponse>("/search", {
    params: { q: "tech junior", limit: 1, offset: 0 },
  });
  return res.data.total?.value ?? 0;
}

// Typ för stad-statistik
export interface CityStat {
  name: string;
  count: number;
}

/**
 * Hämtar full information för en annons via /ad/{id}
 */
export async function getJobDetails(id: string): Promise<JobAd> {
  const res = await api.get(`/ad/${id}`);
  const ad = res.data;

  return {
    id: ad.id,
    headline: ad.headline || ad.label || "Ingen titel",
    workplace: ad.workplace?.name || ad.webpage_url,
    city: ad.workplace_address?.municipality || "Okänd stad", 
    published: ad.published
  };
}

/**
 * Senaste annonser
 */
export async function getLatestJuniorTechJobs(
  limit: number = 3,
  offset: number = 0
): Promise<JobAd[]> {
  const res = await api.get<SearchResponse>("/search", {
    params: { q: "tech junior", limit, offset },
  });

  const hits = res.data.hits;
  const jobs = await Promise.all(
    hits.map((hit: JobHit) => getJobDetails(hit.id))
  );
  return jobs;
}

/**
 * Sök med fritext och pagination
 */
export async function searchJuniorTechJobs(
  query: string,
  page: number = 1,
  limit: number = 25,
  city?: string
): Promise<{ jobs: JobAd[]; total: number }> {
  const offset = (page - 1) * limit;

  const params: Record<string, string | number> = {
    q: `(tech junior) ${query}`,
    limit,
    offset,
    occupation_field: "apaJ_2ja_LuF",
  };
  if (city) params.city = city;

  const res = await api.get<SearchResponse>("/search", { params });

  const hits = res.data.hits;
  const jobs = await Promise.all(hits.map((hit: JobHit) => getJobDetails(hit.id)));

  return {
    jobs,
    total: res.data.total?.value ?? 0,
  };
}

/**
 * Hämta toppstäder för junior tech-jobb
 * Räknar antal jobb per stad från de första 100 träffarna
 */
export async function getTopCitiesForJuniorTech(
  limit: number = 10
): Promise<CityStat[]> {
  // Hämta upp till 100 jobb
  const res = await api.get<SearchResponse>("/search", {
    params: { q: "tech junior", limit: 100, offset: 0 },
  });

  const hits = res.data.hits;

  // Hämta detaljer för varje jobb för att få stad
  const jobs = await Promise.all(hits.map(hit => getJobDetails(hit.id)));

  // Räkna antal jobb per stad
  const cityMap: Record<string, number> = {};
  jobs.forEach(job => {
    const city = job.city || "Okänd stad";
    cityMap[city] = (cityMap[city] || 0) + 1;
  });

  // Sortera fallande och returnera top N
  const sortedCities = Object.entries(cityMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return sortedCities.slice(0, limit);
}
