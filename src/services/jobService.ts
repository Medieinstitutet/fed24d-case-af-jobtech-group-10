import api from "./api";
import taxonomyApi from "./taxonomyApi";
import type { JobAd, SearchResponse, JobHit } from "../models/IJobs";
import type { TaxonomyConcept, TaxonomyResponseConcept, OccupationConcept } from "../models/ITaxonomy";

export interface CityStat {
  id: string;
  name: string;
  count: number;
}

// --------------------
// Hämta unika värden för filter från Taxonomy API
// --------------------
export async function fetchTaxonomyConcepts(type: string): Promise<TaxonomyConcept[]> {
  try {
    const res = await taxonomyApi.get(`/v1/taxonomy/main/concepts?type=${type}`);

    if (type === "occupation-name") {
      // Hantera datan för "occupation-name" som har en plattare struktur
      const concepts: OccupationConcept[] = res.data;
      return concepts.map((concept) => ({
        id: concept.id,
        label: concept.name,
      }));
    } else {
      // Hantera datan för övriga typer som har "taxonomy"-strukturen
      const concepts: TaxonomyResponseConcept[] = res.data;
      return concepts.map((concept) => ({
        id: concept.taxonomy.id,
        label: concept.name,
      }));
    }
  } catch (error) {
    console.error(`Kunde inte hämta koncept för typen: ${type}`, error);
    return [];
  }
}

export async function getWorkingHoursOptions(): Promise<TaxonomyConcept[]> {
  return fetchTaxonomyConcepts("working-hours-type");
}

export async function getOccupationGroupOptions(): Promise<TaxonomyConcept[]> {
  return fetchTaxonomyConcepts("occupation-group");
}

export async function getOccupationOptions(): Promise<TaxonomyConcept[]> {
  return fetchTaxonomyConcepts("occupation-name");
}

// --------------------
// Resten av dina funktioner (oförändrade)
// --------------------

export async function getJobDetails(id: string): Promise<JobAd | null> {
  const res = await api.get(`/ad/${id}`);
  const ad = res.data;

  if (ad.occupation_field?.concept_id !== "apaJ_2ja_LuF") return null;

  const job: JobAd = {
    id: String(ad.id ?? id),
    external_id: ad.external_id,
    headline: ad.headline || ad.label || 'Ingen titel',
    workplace: ad.workplace ?? ad.employer?.name ?? 'Okänt företag',
    city: ad.workplace_address?.municipality ?? ad.city ?? "Okänd stad",
    municipality: ad.workplace_address?.municipality_concept_id ?? ad.workplace_address?.municipality ?? '',
    region: ad.workplace_address?.region,
    country: ad.workplace_address?.country,
    published: ad.publication_date,
    application_deadline: ad.application_deadline,
    description:
      ad.description?.text_formatted ??
      ad.description?.text ??
      ad.description_html ??
      ad.description_text ??
      ad.description ??
      undefined,
    salary_description: ad.salary_description,
    logo_url:
      ad.logo_url ??
      ad.logoUrl ??
      ad.employer?.logo_url ??
      ad.employer?.logoUrl ??
      undefined,
    application_url:
      ad.application_details?.url ??
      ad.webpage_url ??
      undefined,
    working_hours_type: ad.working_hours_type && {
      concept_id: ad.working_hours_type.concept_id,
      label: ad.working_hours_type.label,
      legacy_ams_taxonomy_id: ad.working_hours_type.legacy_ams_taxonomy_id,
    },
    occupation: ad.occupation && {
      concept_id: ad.occupation.concept_id,
      label: ad.occupation.label,
      legacy_ams_taxonomy_id: ad.occupation.legacy_ams_taxonomy_id,
    },
    occupation_group: ad.occupation_group && {
      concept_id: ad.occupation_group.concept_id,
      label: ad.occupation_group.label,
      legacy_ams_taxonomy_id: ad.occupation_group.legacy_ams_taxonomy_id,
    },
    occupation_field: ad.occupation_field?.label,
    employment_type: ad.employment_type && {
      concept_id: ad.employment_type.concept_id,
      label: ad.employment_type.label,
      legacy_ams_taxonomy_id: ad.employment_type.legacy_ams_taxonomy_id,
    },
  };
  return job;
}

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
    q: query && query.trim() !== "" ? query : "junior tech",
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
    const cityName = job.city ?? "Okänd stad";
    if (cityName.toLowerCase() === "okänd stad") return;
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