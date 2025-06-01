"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Country, University } from "@/lib/types"

interface CountryStatsProps {
  countries: Country[]
  universities: University[]
}

export default function CountryStats({ countries, universities }: CountryStatsProps) {
  const schengenCount = countries.filter((c) => c.is_schengen).length
  const euCount = countries.filter((c) => c.is_eu).length
  const europeanCount = countries.filter((c) => c.region?.includes("Europe")).length

  const universitiesByRegion = universities.reduce(
    (acc, uni) => {
      const country = countries.find((c) => c.id === uni.country_id)
      if (country?.is_schengen) {
        acc.schengen = (acc.schengen || 0) + 1
      }
      if (country?.is_eu) {
        acc.eu = (acc.eu || 0) + 1
      }
      if (country?.region?.includes("Europe")) {
        acc.europe = (acc.europe || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Available Countries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{countries.length}</div>
          <p className="text-xs text-muted-foreground">Total countries</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Schengen Area</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{schengenCount}</div>
          <p className="text-xs text-muted-foreground">{universitiesByRegion.schengen || 0} universities</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">European Union</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{euCount}</div>
          <p className="text-xs text-muted-foreground">{universitiesByRegion.eu || 0} universities</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Europe Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{europeanCount}</div>
          <p className="text-xs text-muted-foreground">{universitiesByRegion.europe || 0} universities</p>
        </CardContent>
      </Card>
    </div>
  )
}
