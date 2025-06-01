"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { University, Country } from "@/lib/types"
import Navigation from "./navigation"
import CountrySelector from "./country-selector"
import { toast } from "@/components/ui/use-toast"

interface UniversityFormProps {
  university?: University | null
  countries: Country[]
  onSave: (university: University) => void
  onCancel: () => void
}

export default function UniversityForm({ university, countries, onSave, onCancel }: UniversityFormProps) {
  const [formData, setFormData] = useState({
    name: university?.name || "",
    country_id: university?.country_id?.toString() || "",
    tuition_fees_bachelor: university?.tuition_fees_bachelor?.toString() || "",
    tuition_fees_master: university?.tuition_fees_master?.toString() || "",
    application_fee: university?.application_fee?.toString() || "",
    admission_start_date: university?.admission_start_date || "",
    admission_deadline: university?.admission_deadline || "",
    admission_requirements: university?.admission_requirements || "",
    english_requirements: university?.english_requirements || "",
    acceptance_rate: university?.acceptance_rate?.toString() || "",
    website_url: university?.website_url || "",
    description: university?.description || "",
  })

  const [bachelorPrograms, setBachelorPrograms] = useState<string[]>(university?.bachelor_programs || [])
  const [masterPrograms, setMasterPrograms] = useState<string[]>(university?.master_programs || [])
  const [newBachelorProgram, setNewBachelorProgram] = useState("")
  const [newMasterProgram, setNewMasterProgram] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!formData.country_id) {
        throw new Error("Please select a country")
      }

      if (!formData.name) {
        throw new Error("University name is required")
      }

      const universityData = {
        name: formData.name,
        country_id: Number.parseInt(formData.country_id),
        tuition_fees_bachelor: formData.tuition_fees_bachelor
          ? Number.parseFloat(formData.tuition_fees_bachelor)
          : null,
        tuition_fees_master: formData.tuition_fees_master ? Number.parseFloat(formData.tuition_fees_master) : null,
        application_fee: formData.application_fee ? Number.parseFloat(formData.application_fee) : null,
        admission_start_date: formData.admission_start_date || null,
        admission_deadline: formData.admission_deadline || null,
        admission_requirements: formData.admission_requirements || null,
        english_requirements: formData.english_requirements || null,
        acceptance_rate: formData.acceptance_rate ? Number.parseFloat(formData.acceptance_rate) : null,
        website_url: formData.website_url || null,
        description: formData.description || null,
        bachelor_programs: bachelorPrograms.length > 0 ? bachelorPrograms : [],
        master_programs: masterPrograms.length > 0 ? masterPrograms : [],
        updated_at: new Date().toISOString(),
      }

      let result
      if (university) {
        result = await supabase
          .from("universities")
          .update(universityData)
          .eq("id", university.id)
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
          .single()
      } else {
        result = await supabase
          .from("universities")
          .insert(universityData)
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
          .single()
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: university ? "University updated" : "University added",
        description: `${formData.name} has been ${university ? "updated" : "added"} successfully.`,
      })

      onSave(result.data as University)
    } catch (error) {
      console.error("Error saving university:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error saving university. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const addBachelorProgram = () => {
    if (newBachelorProgram.trim() && !bachelorPrograms.includes(newBachelorProgram.trim())) {
      setBachelorPrograms([...bachelorPrograms, newBachelorProgram.trim()])
      setNewBachelorProgram("")
    }
  }

  const addMasterProgram = () => {
    if (newMasterProgram.trim() && !masterPrograms.includes(newMasterProgram.trim())) {
      setMasterPrograms([...masterPrograms, newMasterProgram.trim()])
      setNewMasterProgram("")
    }
  }

  const removeBachelorProgram = (program: string) => {
    setBachelorPrograms(bachelorPrograms.filter((p) => p !== program))
  }

  const removeMasterProgram = (program: string) => {
    setMasterPrograms(masterPrograms.filter((p) => p !== program))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>{university ? "Edit University" : "Add New University"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">University Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="country">Country *</Label>
                  <CountrySelector
                    countries={countries}
                    value={formData.country_id}
                    onValueChange={(value) => setFormData({ ...formData, country_id: value })}
                    placeholder="Select country..."
                  />
                </div>

                <div>
                  <Label htmlFor="tuition_bachelor">Bachelor Tuition (USD)</Label>
                  <Input
                    id="tuition_bachelor"
                    type="number"
                    step="0.01"
                    value={formData.tuition_fees_bachelor}
                    onChange={(e) => setFormData({ ...formData, tuition_fees_bachelor: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="tuition_master">Master Tuition (USD)</Label>
                  <Input
                    id="tuition_master"
                    type="number"
                    step="0.01"
                    value={formData.tuition_fees_master}
                    onChange={(e) => setFormData({ ...formData, tuition_fees_master: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="application_fee">Application Fee (USD)</Label>
                  <Input
                    id="application_fee"
                    type="number"
                    step="0.01"
                    value={formData.application_fee}
                    onChange={(e) => setFormData({ ...formData, application_fee: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="acceptance_rate">Acceptance Rate (%)</Label>
                  <Input
                    id="acceptance_rate"
                    type="number"
                    step="0.1"
                    min="0"
                    max="100"
                    value={formData.acceptance_rate}
                    onChange={(e) => setFormData({ ...formData, acceptance_rate: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="admission_start">Admission Start Date</Label>
                  <Input
                    id="admission_start"
                    type="date"
                    value={formData.admission_start_date}
                    onChange={(e) => setFormData({ ...formData, admission_start_date: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="admission_deadline">Admission Deadline</Label>
                  <Input
                    id="admission_deadline"
                    type="date"
                    value={formData.admission_deadline}
                    onChange={(e) => setFormData({ ...formData, admission_deadline: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="admission_requirements">Admission Requirements</Label>
                <Textarea
                  id="admission_requirements"
                  rows={3}
                  value={formData.admission_requirements}
                  onChange={(e) => setFormData({ ...formData, admission_requirements: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="english_requirements">English Language Requirements</Label>
                <Input
                  id="english_requirements"
                  value={formData.english_requirements}
                  onChange={(e) => setFormData({ ...formData, english_requirements: e.target.value })}
                  placeholder="e.g., TOEFL 100+ or IELTS 7.0+"
                />
              </div>

              {/* Bachelor Programs */}
              <div>
                <Label>Bachelor's Programs (English)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newBachelorProgram}
                    onChange={(e) => setNewBachelorProgram(e.target.value)}
                    placeholder="Add bachelor program"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addBachelorProgram())}
                  />
                  <Button type="button" onClick={addBachelorProgram}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {bachelorPrograms.map((program) => (
                    <Badge key={program} variant="secondary" className="flex items-center gap-1">
                      {program}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeBachelorProgram(program)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Master Programs */}
              <div>
                <Label>Master's Programs (English)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newMasterProgram}
                    onChange={(e) => setNewMasterProgram(e.target.value)}
                    placeholder="Add master program"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMasterProgram())}
                  />
                  <Button type="button" onClick={addMasterProgram}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {masterPrograms.map((program) => (
                    <Badge key={program} variant="secondary" className="flex items-center gap-1">
                      {program}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeMasterProgram(program)} />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : university ? "Update University" : "Add University"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
