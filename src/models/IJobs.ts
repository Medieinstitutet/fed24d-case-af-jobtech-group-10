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
  salary_description?: string;
  occupation?: {                      //objekt för filtrering
    concept_id: string;
    label: string;
    legacy_ams_taxonomy_id?: string;
  };
  occupation_group?: {                 //objekt för filtrering      
    concept_id: string;
    label: string;
    legacy_ams_taxonomy_id?: string;
  };
  occupation_field?: string;
  application_url?: string;
  working_hours_type?: {               //objekt för filtrering
    concept_id: string;
    label: string;
    legacy_ams_taxonomy_id: string;
  };
  employment_type?: {                   //objekt för filtrering
    concept_id: string;
    label: string;
    legacy_ams_taxonomy_id: string;
  };
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
