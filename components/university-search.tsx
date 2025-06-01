"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, DollarSign, Calendar, Users, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { University, Country } from "@/lib/types"

interface UniversitySearchProps {
  initialUniversities: University[]
  countries: Country[]
}

export default function UniversitySearch({ initialUniversities, countries }: UniversitySearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [programLevel, setProgramLevel] = useState<string>("all")

  const filteredUniversities = useMemo(() => {
    return initialUniversities.filter((university) => {
      const matchesSearch =
        university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        university.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (university.bachelor_programs || []).some((program) =>
          program.toLowerCase().includes(searchTerm.toLowerCase()),
        ) ||
        (university.master_programs || []).some((program) => program.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesCountry = selectedCountry === "all" || university.country_id?.toString() === selectedCountry

      const matchesLevel =
        programLevel === "all" ||
        (programLevel === "bachelor" && (university.bachelor_programs || []).length > 0) ||
        (programLevel === "master" && (university.master_programs || []).length > 0)

      return matchesSearch && matchesCountry && matchesLevel
    })
  }, [initialUniversities, searchTerm, selectedCountry, programLevel])

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search universities, programs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {countries.map((country) => (
                <SelectItem key={country.id} value={country.id.toString()}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={programLevel} onValueChange={setProgramLevel}>
            <SelectTrigger>
              <SelectValue placeholder="Program level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Programs</SelectItem>
              <SelectItem value="bachelor">Bachelor's Programs</SelectItem>
              <SelectItem value="master">Master's Programs</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{filteredUniversities.length} Universities Found</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredUniversities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No universities found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function UniversityCard({ university }: { university: University }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{university.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">{university.countries?.name || "Unknown"}</span>
              {university.countries?.is_schengen && (
                <Badge variant="secondary" className="text-xs">
                  Schengen
                </Badge>
              )}
              {university.countries?.is_eu && (
                <Badge variant="outline" className="text-xs">
                  EU
                </Badge>
              )}
            </div>
          </div>
          {university.acceptance_rate && <Badge variant="secondary">{university.acceptance_rate}% acceptance</Badge>}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {university.description && <p className="text-gray-600 text-sm line-clamp-2">{university.description}</p>}

        <div className="grid grid-cols-2 gap-4 text-sm">
          {university.tuition_fees_bachelor && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-green-600" />
              <span>Bachelor: ${university.tuition_fees_bachelor.toLocaleString()}</span>
            </div>
          )}
          {university.tuition_fees_master && (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
              <span>Master: ${university.tuition_fees_master.toLocaleString()}</span>
            </div>
          )}
          {university.admission_deadline && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-orange-600" />
              <span>Deadline: {new Date(university.admission_deadline).toLocaleDateString()}</span>
            </div>
          )}
          {university.application_fee && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-purple-600" />
              <span>App Fee: ${university.application_fee}</span>
            </div>
          )}
        </div>

        {university.bachelor_programs && university.bachelor_programs.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">Bachelor's Programs</h4>
            <div className="flex flex-wrap gap-1">
              {university.bachelor_programs.slice(0, 3).map((program) => (
                <Badge key={program} variant="outline" className="text-xs">
                  {program}
                </Badge>
              ))}
              {university.bachelor_programs.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{university.bachelor_programs.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {university.master_programs && university.master_programs.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 mb-2">Master's Programs</h4>
            <div className="flex flex-wrap gap-1">
              {university.master_programs.slice(0, 3).map((program) => (
                <Badge key={program} variant="outline" className="text-xs">
                  {program}
                </Badge>
              ))}
              {university.master_programs.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{university.master_programs.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {university.english_requirements && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-blue-900 mb-1">English Requirements</h4>
            <p className="text-blue-800 text-xs">{university.english_requirements}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          {university.website_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={university.website_url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
