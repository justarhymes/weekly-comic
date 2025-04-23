export interface Comic {
  id: number;
  title: string;
  publisher: string;
  release_date: string;
  issue_number?: string;
  image?: string;
  api_source?: string;
  is_custom: boolean;
  summary?: string;
  page_count?: number;
  price?: number;
  rating?: string;
  distributor_sku?: string;
  upc?: string;
  metron_id?: number;
  comicvine_id?: number;
  gcd_id?: number;
  series_name?: string;
}
