"use client"

import { useState } from "react"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import type { University, Country } from "@/lib/types"
import UniversityForm from "./university-form"
import Navigation from "./navigation"
import CountryStats from "./country-stats"

interface AdminDashboardProps {
  universities: University[]
  countries: Country[]
}

export default function AdminDashboard({ universities: initialUniversities, countries }: AdminDashboardProps) {
  const [universities, setUniversities] = useState(initialUniversities)
  const [showForm, setShowForm] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null)
  const supabase = createClient()

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this university?")) {
      const { error } = await supabase.from("universities").delete().eq("id", id)

      if (!error) {
        setUniversities(universities.filter((u) => u.id !== id))
      }
    }
  }

  const handleEdit = (university: University) => {
    setEditingUniversity(university)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingUniversity(null)
  }

  const handleUniversityUpdate = (university: University) => {
    if (editingUniversity) {
      setUniversities(universities.map((u) => (u.id === university.id ? university : u)))
    } else {
      setUniversities([...universities, university])
    }
    handleFormClose()
  }

  if (showForm) {
    return (
      <UniversityForm
        university={editingUniversity}
        countries={countries}
        onSave={handleUniversityUpdate}
        onCancel={handleFormClose}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CountryStats countries={countries} universities={universities} />

        <div className="mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">University Management</h1>
              <p className="text-gray-600 mt-1">Add, edit, and manage university information</p>
            </div>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add University
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <Card key={university.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{university.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      {university.countries?.name}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(university)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(university.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="text-sm text-gray-600">
                  <p>Bachelor Programs: {university.bachelor_programs.length}</p>
                  <p>Master Programs: {university.master_programs.length}</p>
                  {university.tuition_fees_bachelor && (
                    <p>Bachelor Tuition: ${university.tuition_fees_bachelor.toLocaleString()}</p>
                  )}
                  {university.tuition_fees_master && (
                    <p>Master Tuition: ${university.tuition_fees_master.toLocaleString()}</p>
                  )}
                  {university.acceptance_rate && <p>Acceptance Rate: {university.acceptance_rate}%</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {universities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No universities added yet.</p>
            <Button onClick={() => setShowForm(true)} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First University
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
