import { createClient } from "@/lib/supabase/server"
import UniversitySearch from "@/components/university-search"
import type { University } from "@/lib/types"
import Navigation from "@/components/navigation"
import Diagnostic from "@/components/diagnostic"

export default async function HomePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Diagnostic />

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Discover Universities Worldwide</h1>
          <p className="text-gray-600">Find universities and programs taught in English around the world</p>
        </div>
        <UniversitySearch initialUniversities={universities} countries={countries || []} />
      </main>
    </div>
  )
}
