export interface JobAd {
  id: string;
  external_id: string;
  headline: string;
  workplace: string;
  city?: string;
  municipality?: string;
  region?: string;
  country?: string;
  published?: string;
  application_deadline?: string;
  description?: string;
  employment_type?: string;
  salary_description?: string;
  occupation?: string;
  occupation_group?: string;
  occupation_field?: string;
  application_url?: string;
  working_hours_type?: string;
}

export interface JobHit {
  id: string;
  headline: string;
  webpage_url: string;
  occupation_field?: {
    concept_id: string;
    label: string;
  };
}

export interface SearchResponse {
  total: { value: number };
  hits: JobHit[];
}
