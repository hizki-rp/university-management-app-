"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Settings, Database } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              University Explorer
            </Link>
            <div className="flex space-x-4">
              <Link href="/">
                <Button variant={pathname === "/" ? "default" : "ghost"} className="flex items-center">
                  <Home className="h-4 w-4 mr-2" />
                  Browse Universities
                </Button>
              </Link>
              <Link href="/admin">
                <Button variant={pathname === "/admin" ? "default" : "ghost"} className="flex items-center">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Universities
                </Button>
              </Link>
              <Link href="/admin/populate">
                <Button variant={pathname === "/admin/populate" ? "default" : "ghost"} className="flex items-center">
                  <Database className="h-4 w-4 mr-2" />
                  Populate Data
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
