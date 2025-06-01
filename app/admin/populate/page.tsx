"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import Navigation from "@/components/navigation"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function PopulatePage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<{ added: number }>({ added: 0 })

  const populateDatabase = async () => {
    setStatus("loading")
    setError(null)

    try {
      const supabase = createClient()

      // Sample university data for Germany
      const germanUniversities = [
        {
          name: "Technical University of Munich",
          country_id: await getCountryId("DE"),
          tuition_fees_bachelor: 0,
          tuition_fees_master: 0,
          application_fee: 150,
          admission_start_date: "2024-10-01",
          admission_deadline: "2024-07-15",
          admission_requirements: "Abitur or equivalent, strong mathematics background for technical programs",
          bachelor_programs: [
            "Computer Science",
            "Mechanical Engineering",
            "Electrical Engineering",
            "Physics",
            "Mathematics",
            "Architecture",
          ],
          master_programs: [
            "Computer Science",
            "Data Engineering",
            "Robotics",
            "Automotive Engineering",
            "Renewable Energy",
          ],
          english_requirements: "IELTS 6.5+ or TOEFL 88+ or DSH-2",
          acceptance_rate: 8.0,
          website_url: "https://www.tum.de",
          description:
            "One of Europe's top technical universities, known for engineering and technology programs with strong industry connections.",
        },
        {
          name: "University of Heidelberg",
          country_id: await getCountryId("DE"),
          tuition_fees_bachelor: 0,
          tuition_fees_master: 0,
          application_fee: 75,
          admission_start_date: "2024-10-01",
          admission_deadline: "2024-07-15",
          admission_requirements: "Abitur or equivalent, subject-specific requirements vary by program",
          bachelor_programs: ["Medicine", "Law", "Philosophy", "Biology", "Chemistry", "Psychology"],
          master_programs: [
            "Molecular Biosciences",
            "Medical Education",
            "International Health",
            "European Master in Law",
          ],
          english_requirements: "IELTS 6.5+ or TOEFL 80+ or DSH-2",
          acceptance_rate: 12.0,
          website_url: "https://www.uni-heidelberg.de",
          description:
            "Germany's oldest university, renowned for research excellence in medicine, natural sciences, and humanities.",
        },
      ]

      // Sample university data for Netherlands
      const dutchUniversities = [
        {
          name: "University of Amsterdam",
          country_id: await getCountryId("NL"),
          tuition_fees_bachelor: 2168,
          tuition_fees_master: 2314,
          application_fee: 100,
          admission_start_date: "2024-09-01",
          admission_deadline: "2024-05-01",
          admission_requirements: "Secondary school diploma equivalent to Dutch VWO, subject-specific requirements",
          bachelor_programs: [
            "Psychology",
            "Business Administration",
            "Computer Science",
            "Economics",
            "Political Science",
            "Media Studies",
          ],
          master_programs: [
            "Business Administration",
            "Artificial Intelligence",
            "Finance",
            "European Studies",
            "Communication Science",
          ],
          english_requirements: "IELTS 6.5+ or TOEFL 92+",
          acceptance_rate: 25.0,
          website_url: "https://www.uva.nl",
          description:
            "Leading research university in Amsterdam, offering diverse programs with strong international perspective.",
        },
        {
          name: "Delft University of Technology",
          country_id: await getCountryId("NL"),
          tuition_fees_bachelor: 2168,
          tuition_fees_master: 2314,
          application_fee: 100,
          admission_start_date: "2024-09-01",
          admission_deadline: "2024-01-15",
          admission_requirements:
            "Strong mathematics and physics background, secondary education equivalent to Dutch VWO",
          bachelor_programs: ["Aerospace Engineering", "Computer Science", "Civil Engineering", "Industrial Design"],
          master_programs: [
            "Computer Science",
            "Aerospace Engineering",
            "Sustainable Energy Technology",
            "Architecture",
          ],
          english_requirements: "IELTS 6.5+ or TOEFL 90+",
          acceptance_rate: 18.0,
          website_url: "https://www.tudelft.nl",
          description:
            "Top technical university known for engineering innovation and cutting-edge research in technology.",
        },
      ]

      // Sample university data for UK
      const ukUniversities = [
        {
          name: "University of Oxford",
          country_id: await getCountryId("GB"),
          tuition_fees_bachelor: 9250,
          tuition_fees_master: 11930,
          application_fee: 75,
          admission_start_date: "2024-10-01",
          admission_deadline: "2024-10-15",
          admission_requirements: "A-levels AAA or equivalent, college-specific requirements, interview process",
          bachelor_programs: [
            "Philosophy Politics Economics",
            "Computer Science",
            "Medicine",
            "Law",
            "History",
            "Mathematics",
          ],
          master_programs: ["MBA", "Machine Learning", "International Relations", "Medical Sciences", "Philosophy"],
          english_requirements: "IELTS 7.5+ or TOEFL 110+",
          acceptance_rate: 17.5,
          website_url: "https://www.ox.ac.uk",
          description:
            "One of the world's oldest and most prestigious universities, known for academic excellence and historic traditions.",
        },
        {
          name: "Imperial College London",
          country_id: await getCountryId("GB"),
          tuition_fees_bachelor: 9250,
          tuition_fees_master: 11930,
          application_fee: 75,
          admission_start_date: "2024-10-01",
          admission_deadline: "2024-01-15",
          admission_requirements: "A-levels A*A*A in relevant subjects, strong mathematics and science background",
          bachelor_programs: ["Engineering", "Computer Science", "Medicine", "Physics", "Chemistry", "Mathematics"],
          master_programs: [
            "Artificial Intelligence",
            "Bioengineering",
            "Climate Change",
            "Finance",
            "Innovation Design",
          ],
          english_requirements: "IELTS 7.0+ or TOEFL 100+",
          acceptance_rate: 14.3,
          website_url: "https://www.imperial.ac.uk",
          description:
            "Leading STEM university in London, renowned for science, engineering, medicine, and business programs.",
        },
      ]

      // Combine all universities
      const universities = [...germanUniversities, ...dutchUniversities, ...ukUniversities]

      // Insert universities
      const { data, error } = await supabase.from("universities").insert(universities)

      if (error) {
        throw error
      }

      setResult({ added: universities.length })
      setStatus("success")
    } catch (e) {
      console.error("Error populating database:", e)
      setError(e instanceof Error ? e.message : "Unknown error occurred")
      setStatus("error")
    }
  }

  // Helper function to get country ID by code
  async function getCountryId(code: string): Promise<number> {
    const supabase = createClient()
    const { data, error } = await supabase.from("countries").select("id").eq("code", code).single()

    if (error || !data) {
      throw new Error(`Country with code ${code} not found`)
    }

    return data.id
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Populate Database with Sample Universities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === "success" && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>Added {result.added} sample universities to the database.</AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <p className="text-gray-600">
              This will add sample university data to your database for testing purposes. This includes universities
              from Germany, Netherlands, and the UK.
            </p>

            <Button onClick={populateDatabase} disabled={status === "loading"}>
              {status === "loading" ? "Adding Sample Data..." : "Add Sample Universities"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
