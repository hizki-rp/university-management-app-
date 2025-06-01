import { createClient } from "@/lib/supabase/server"
import AdminDashboard from "@/components/admin-dashboard"
import type { University } from "@/lib/types"
import Diagnostic from "@/components/diagnostic"

export default async function AdminPage() {
  const supabase = await createClient()

  // Fetch countries first to ensure they exist
  const { data: countries, error: countriesError } = await supabase
    .from("countries")
    .select("*")
    .order("display_order, name")

  if (countriesError) {
    console.error("Error fetching countries:", countriesError)
  }

  // Only fetch universities if countries exist
  const { data: universitiesData, error: universitiesError } = await supabase
    .from("universities")
    .select(`
      *,
      countries (
        id,
        name,
        code,
        is_schengen,
        is_eu,
        region
      )
    `)
    .order("name")

  if (universitiesError) {
    console.error("Error fetching universities:", universitiesError)
  }

  const universities = (universitiesData as University[]) || []

  return (
    <div>
      <Diagnostic />
      <AdminDashboard universities={universities} countries={countries || []} />
    </div>
  )
}
