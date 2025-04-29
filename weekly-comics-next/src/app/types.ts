export interface Comic {
  id: number;
  title: string;
  slug?: string;
  release_date: string;
  issue_number?: string;
  image?: string;
  blur_data_url?: string;
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
  creators?: {
    name: string;
    roles: string[];
  }[];
  series?: {
    name?: string;
    slug?: string;
    publisher?: string;
    type?: string;
    genre?: string[];
    status?: string;
    volume?: number;
    start_year?: number;
    num_issues?: number;
  };
}
