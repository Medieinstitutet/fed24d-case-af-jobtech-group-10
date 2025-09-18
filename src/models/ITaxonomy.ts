export interface TaxonomyResponseConcept {
  name: string;
  taxonomy: {
    id: string;
    type: string;
  };
}

export interface OccupationConcept {
  id: string;
  name: string;
}

export interface TaxonomyConcept {
  id: string;
  label: string;
}