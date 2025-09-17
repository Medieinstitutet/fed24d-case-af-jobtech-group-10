import api from "./api";
import type { JobAd, SearchResponse, JobHit } from "../models/IJobs";

export interface CityStat {
  id: string;   
  name: string; 
  count: number;
}

// --------------------
// Hämta detaljer för en annons
// --------------------
export async function getJobDetails(id: string): Promise<JobAd | null> {
  const res = await api.get(`/ad/${id}`);
  const ad = res.data;

  // Filtrera bort jobb som inte tillhör yrkesområdet Data/IT
  if (ad.occupation_field?.concept_id !== "apaJ_2ja_LuF") return null;

  return {
    id: ad.id,
    external_id: ad.external_id,
    headline: ad.headline || ad.label || "Ingen titel",
    workplace: ad.employer?.workplace || ad.webpage_url || "Okänt företag",
    city: ad.workplace_address?.municipality || ad.city || "Okänd stad",
    municipality: ad.workplace_address?.municipality_concept_id || ad.workplace_address?.municipality || "",
    region: ad.workplace_address?.region,
    country: ad.workplace_address?.country,
    published: ad.publication_date,
    application_deadline: ad.application_deadline,
    description: ad.description?.text,
    working_hours_type: ad.working_hours_type
      ? {
          concept_id: ad.working_hours_type.concept_id,
          label: ad.working_hours_type.label,
          legacy_ams_taxonomy_id: ad.working_hours_type.legacy_ams_taxonomy_id,
        }
      : undefined,
    salary_description: ad.salary_description,
    occupation: ad.occupation
      ? { 
          concept_id: ad.occupation.concept_id,
          label: ad.occupation.label,
          legacy_ams_taxonomy_id: ad.occupation.legacy_ams_taxonomy_id,
        }
      : undefined,
    occupation_group: ad.occupation_group
      ? {                     
          concept_id: ad.occupation_group.concept_id,
          label: ad.occupation_group.label,
          legacy_ams_taxonomy_id: ad.occupation_group.legacy_ams_taxonomy_id,
        }
      : undefined,
    occupation_field: ad.occupation_field?.label,
    application_url: ad.application_details?.url || ad.webpage_url,
    employment_type: ad.employment_type
      ? {
          concept_id: ad.employment_type.concept_id,
          label: ad.employment_type.label,
          legacy_ams_taxonomy_id: ad.employment_type.legacy_ams_taxonomy_id,
        }
      : undefined,
  };
}

// --------------------
// Sök med query, pagination, stad och anställningstyp
// --------------------
export async function searchJuniorTechJobs(
  query: string,
  page: number,
  limit: number,
  city?: string,
  occupationGroup?: string,
  workingHoursLabel?: string,
  occupation?: string 
): Promise<{ jobs: JobAd[]; total: number }> {
  const params: Record<string, string | number> = {
    limit,
    offset: (page - 1) * limit,
    q: query && query.trim() !== "" ? query : "junior tech", // 🚀 fix
    "occupation-field": "apaJ_2ja_LuF",
  };

  if (city) params.municipality = city;
  if (occupationGroup) params["occupation-group"] = occupationGroup;
  if (workingHoursLabel) params["working-hours-type"] = workingHoursLabel;
  if (occupation) params.occupation = occupation; 

  const res = await api.get<SearchResponse>("/search", { params });
  const hits: JobHit[] = res.data.hits;

  const jobs = (await Promise.all(hits.map((hit) => getJobDetails(hit.id))))
    .filter((j): j is JobAd => j !== null);

  return {
    jobs,
    total: res.data.total?.value ?? jobs.length,
  };
}


// --------------------
// Senaste annonser
// --------------------
export async function getLatestJuniorTechJobs(
  limit: number = 4,
  city?: string,
  occupationGroup?: string
): Promise<JobAd[]> {
  const params: Record<string, string | number> = {
    limit,
    offset: 0,
    q: "junior tech",
    "occupation-field": "apaJ_2ja_LuF",
  };

  if (city) params.municipality = city;
  if (occupationGroup) params["occupation-group"] = occupationGroup;

  const res = await api.get<SearchResponse>("/search", { params });
  const hits: JobHit[] = res.data.hits;

  const jobs = (await Promise.all(hits.map((hit) => getJobDetails(hit.id))))
    .filter((j): j is JobAd => j !== null);

  return jobs;
}

// --------------------
// Hämta total antal Data/IT-juniorjobb
// --------------------
export async function getTotalJuniorTechJobs(
  city?: string,
  occupationGroup?: string
): Promise<number> {
  const params: Record<string, string | number> = {
    limit: 1,
    offset: 0,
    q: "junior tech",
    "occupation-field": "apaJ_2ja_LuF",
  };

  if (city) params.municipality = city;
  if (occupationGroup) params["occupation-group"] = occupationGroup;

  const res = await api.get<SearchResponse>("/search", { params });
  return res.data.total?.value ?? 0;
}

// --------------------
// Toppstäder (diagram) – filtrerar bort "Okänd stad"
// --------------------
export async function getTopCitiesForJuniorTech(limit: number = 10): Promise<CityStat[]> {
  const params: Record<string, string | number> = {
    limit: 100,
    offset: 0,
    q: "junior tech",
    "occupation-field": "apaJ_2ja_LuF",
  };

  const res = await api.get<SearchResponse>("/search", { params });
  const hits: JobHit[] = res.data.hits;

  const jobs = (await Promise.all(hits.map((hit) => getJobDetails(hit.id))))
    .filter((j): j is JobAd => j !== null);

  const cityMap: Record<string, CityStat> = {};
  jobs.forEach((job) => {
    // Säkerställ alltid en string för city-namn
    const cityName = job.city ?? "Okänd stad";

    // För diagrammet vill vi exkludera Okänd stad
    if (cityName.toLowerCase() === "okänd stad") return;

    // Använd municipality (concept-id) som nyckel om den finns,
    // annars fallback till cityName (inte idealiskt men säkert)
    const id = job.municipality && job.municipality !== "" ? job.municipality : cityName;

    if (!cityMap[id]) {
      cityMap[id] = { id, name: cityName, count: 0 };
    }
    cityMap[id].count++;
  });

  return Object.values(cityMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}