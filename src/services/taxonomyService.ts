import api from "./api";

// --------------------
// Typ för dropdown-koncept
// --------------------
export interface TaxonomyConcept {
  id: string;               // t.ex. concept_id från API:et
  label: string;            // t.ex. "Heltid"
  legacy_ams_taxonomy_id?: string;
  concept_id?: string;
}

// Typ som beskriver API-responsen
interface TaxonomyHit {
  concept_id: string;
  label: string;
  legacy_ams_taxonomy_id?: string;
}

// --------------------
// Generisk funktion för att hämta en taxonomi-lista
// --------------------
export async function fetchTaxonomy(type: string): Promise<TaxonomyConcept[]> {
  const res = await api.get<{ hits: TaxonomyHit[] }>(`/taxonomy/${type}`);
  const hits = res.data.hits || [];

  return hits.map((hit) => ({
    id: hit.concept_id,
    label: hit.label,
    legacy_ams_taxonomy_id: hit.legacy_ams_taxonomy_id,
    concept_id: hit.concept_id,
  }));
}

// --------------------
// Specifika dropdowns
// --------------------
export async function fetchWorkingHours(): Promise<TaxonomyConcept[]> {
  return fetchTaxonomy("working-hours-type");
}

export async function fetchOccupationGroups(): Promise<TaxonomyConcept[]> {
  return fetchTaxonomy("occupation-group");
}

export async function fetchEmploymentTypes(): Promise<TaxonomyConcept[]> {
  return fetchTaxonomy("employment-type");
}
