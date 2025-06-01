"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function Diagnostic() {
  const [countriesStatus, setCountriesStatus] = useState<"loading" | "success" | "error">("loading")
  const [universitiesStatus, setUniversitiesStatus] = useState<"loading" | "success" | "error">("loading")
  const [countriesCount, setCountriesCount] = useState(0)
  const [universitiesCount, setUniversitiesCount] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const runDiagnostic = async () => {
    setIsRunning(true)
    setCountriesStatus("loading")
    setUniversitiesStatus("loading")
    setError(null)

    const supabase = createClient()

    try {
      // Test countries fetch
      const { data: countries, error: countriesError } = await supabase.from("countries").select("*")

      if (countriesError) {
        throw new Error(`Countries fetch error: ${countriesError.message}`)
      }

      setCountriesCount(countries?.length || 0)
      setCountriesStatus("success")

      // Test universities fetch
      const { data: universities, error: universitiesError } = await supabase.from("universities").select("*")

      if (universitiesError) {
        throw new Error(`Universities fetch error: ${universitiesError.message}`)
      }

      setUniversitiesCount(universities?.length || 0)
      setUniversitiesStatus("success")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error occurred")
      setCountriesStatus("error")
      setUniversitiesStatus("error")
    } finally {
      setIsRunning(false)
    }
  }

  useEffect(() => {
    runDiagnostic()
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Database Connection Diagnostic
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {countriesStatus === "loading" ? (
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
            ) : countriesStatus === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>
              Countries: {countriesStatus === "success" ? `${countriesCount} records found` : countriesStatus}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {universitiesStatus === "loading" ? (
              <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-blue-500 animate-spin" />
            ) : universitiesStatus === "success" ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <span>
              Universities:{" "}
              {universitiesStatus === "success" ? `${universitiesCount} records found` : universitiesStatus}
            </span>
          </div>
        </div>

        <Button onClick={runDiagnostic} disabled={isRunning}>
          {isRunning ? "Running..." : "Run Diagnostic Again"}
        </Button>
      </CardContent>
    </Card>
  )
}
