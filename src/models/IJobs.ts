export interface JobHit {
  id: string;
  external_id: string;
  webpage_url: string;
  city?: string;
  published?: string;
}

export interface JobAd {
  id: string;
  headline: string;
  workplace: string;
  city?: string;
  published?: string;
}

export interface SearchResponse {
  total: { value: number };
  hits: JobHit[];
}
