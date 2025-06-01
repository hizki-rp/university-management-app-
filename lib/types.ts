export interface Country {
  id: number
  name: string
  code: string
  is_schengen?: boolean
  is_eu?: boolean
  region?: string
  display_order?: number
  created_at: string
}

export interface University {
  id: number
  country_id: number
  name: string
  tuition_fees_bachelor: number | null
  tuition_fees_master: number | null
  application_fee: number | null
  admission_start_date: string | null
  admission_deadline: string | null
  admission_requirements: string | null
  bachelor_programs: string[]
  master_programs: string[]
  english_requirements: string | null
  acceptance_rate: number | null
  website_url: string | null
  description: string | null
  created_at: string
  updated_at: string
  countries?: Country
}
