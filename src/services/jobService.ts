import api from "./api";
import type { JobAd, SearchResponse, JobHit } from "../models/IJobs";

export interface CityStat {
  name: string;
  count: number;
}

// --------------------
// Hämta detaljer för en annons
// --------------------
export async function getJobDetails(id: string): Promise<JobAd> {
  const res = await api.get(`/ad/${id}`);
  const ad = res.data;

  return {
    id: ad.id,
    external_id: ad.external_id,
    headline: ad.headline || ad.label || "Ingen titel",
    workplace: ad.employer?.workplace || ad.webpage_url || "Okänt företag",
    city: ad.workplace_address?.municipality || ad.city || "Okänd stad",
    municipality: ad.workplace_address?.municipality,
    region: ad.workplace_address?.region,
    country: ad.workplace_address?.country,
    published: ad.publication_date,
    application_deadline: ad.application_deadline,
    description: ad.description?.text,
    employment_type: ad.employment_type?.label,
    salary_description: ad.salary_description,
    occupation: ad.occupation?.label,
    occupation_group: ad.occupation_group?.label,
    occupation_field: ad.occupation_field?.label,
    application_url: ad.application_details?.url || ad.webpage_url,
    working_hours_type: ad.working_hours_type?.label,
  };
}

// --------------------
// Hämta total antal Data/IT-juniorjobb
// --------------------
export async function getTotalJuniorTechJobs(
  city?: string,
  occupationGroupId?: string
): Promise<number> {
  const params: Record<string, string | number> = {
    limit: 1,
    offset: 0,
    occupation_field: "apaJ_2ja_LuF",
    q: "junior tech",
  };

  if (city) params.municipality = city;
  if (occupationGroupId) params.occupation_group = occupationGroupId;

  const res = await api.get<SearchResponse>("/search", { params });
  return res.data.total?.value ?? 0;
}

// --------------------
// Toppstäder
// --------------------
export async function getTopCitiesForJuniorTech(
  limit: number = 10,
  city?: string,
  occupationGroupId?: string
): Promise<CityStat[]> {
  const params: Record<string, string | number> = {
    limit: 100, // hämta tillräckligt många för att räkna städer
    offset: 0,
    occupation_field: "apaJ_2ja_LuF", // Data/IT
    q: "junior tech",
  };

  if (city) params.municipality = city;
  if (occupationGroupId) params.occupation_group = occupationGroupId;

  const res = await api.get<SearchResponse>("/search", { params });
  const hits: JobHit[] = res.data.hits;
  const jobs = await Promise.all(hits.map((hit) => getJobDetails(hit.id)));

  const cityMap: Record<string, number> = {};
  jobs.forEach((job) => {
    const cityName = job.city;
    if (cityName && cityName.toLowerCase() !== "okänd stad") {
      cityMap[cityName] = (cityMap[cityName] || 0) + 1;
    }
  });

  return Object.entries(cityMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// --------------------
// Senaste annonser
// --------------------
export async function getLatestJuniorTechJobs(
  limit: number = 5,
  city?: string,
  occupationGroupId?: string
): Promise<JobAd[]> {
  const params: Record<string, string | number> = {
    limit,
    offset: 0,
    occupation_field: "apaJ_2ja_LuF",
    q: "junior tech",
  };

  if (city) params.municipality = city;
  if (occupationGroupId) params.occupation_group = occupationGroupId;

  const res = await api.get<SearchResponse>("/search", { params });
  const hits: JobHit[] = res.data.hits;
  return Promise.all(hits.map((hit) => getJobDetails(hit.id)));
}

// --------------------
// Sök med query, pagination och stadfilter
// --------------------
export async function searchJuniorTechJobs(
  query: string,
  page: number,
  limit: number,
  city?: string,
  occupationGroupId?: string
): Promise<{ jobs: JobAd[]; total: number }> {
  const params: Record<string, string | number> = {
    limit,
    offset: (page - 1) * limit,
    occupation_field: "apaJ_2ja_LuF", // Data/IT
    q: query ? `${query} junior tech` : "junior tech", // använd query + junior
  };

  if (city) params.municipality = city;
  if (occupationGroupId) params.occupation_group = occupationGroupId;

  const res = await api.get<SearchResponse>("/search", { params });
  const hits: JobHit[] = res.data.hits;

  const jobs = await Promise.all(hits.map((hit) => getJobDetails(hit.id)));

  return {
    jobs,
    total: res.data.total?.value ?? jobs.length,
  };
}


