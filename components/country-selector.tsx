"use client"

import { useState, useMemo } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import type { Country } from "@/lib/types"

interface CountrySelectorProps {
  countries: Country[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
}

export default function CountrySelector({
  countries,
  value,
  onValueChange,
  placeholder = "Select country...",
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false)

  const groupedCountries = useMemo(() => {
    if (!countries || countries.length === 0) {
      return {
        schengen: [],
        euNonSchengen: [],
        otherEuropean: [],
        nonEuropean: [],
      }
    }

    const schengenCountries = countries
      .filter((country) => country.is_schengen)
      .sort((a, b) => a.name.localeCompare(b.name))
    const euNonSchengenCountries = countries
      .filter((country) => country.is_eu && !country.is_schengen)
      .sort((a, b) => a.name.localeCompare(b.name))
    const otherEuropeanCountries = countries
      .filter((country) => country.region?.includes("Europe") && !country.is_eu && !country.is_schengen)
      .sort((a, b) => a.name.localeCompare(b.name))
    const nonEuropeanCountries = countries
      .filter((country) => !country.region?.includes("Europe"))
      .sort((a, b) => a.name.localeCompare(b.name))

    return {
      schengen: schengenCountries,
      euNonSchengen: euNonSchengenCountries,
      otherEuropean: otherEuropeanCountries,
      nonEuropean: nonEuropeanCountries,
    }
  }, [countries])

  const selectedCountry = countries?.find((country) => country.id.toString() === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {selectedCountry ? (
            <div className="flex items-center gap-2">
              <span className="text-lg">{getFlagEmoji(selectedCountry.code)}</span>
              <span>{selectedCountry.name}</span>
              <div className="flex gap-1">
                {selectedCountry.is_schengen && (
                  <Badge variant="secondary" className="text-xs">
                    Schengen
                  </Badge>
                )}
                {selectedCountry.is_eu && (
                  <Badge variant="outline" className="text-xs">
                    EU
                  </Badge>
                )}
              </div>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search countries..." />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>No country found.</CommandEmpty>

            {countries.length === 0 && (
              <div className="py-6 text-center text-sm">
                No countries available. Please add countries to the database first.
              </div>
            )}

            {groupedCountries.schengen.length > 0 && (
              <CommandGroup heading="🇪🇺 Schengen Area Countries">
                {groupedCountries.schengen.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={`${country.name} ${country.code}`}
                    onSelect={() => {
                      onValueChange(country.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value === country.id.toString() ? "opacity-100" : "opacity-0")}
                    />
                    <span className="mr-2 text-lg">{getFlagEmoji(country.code)}</span>
                    <span className="flex-1">{country.name}</span>
                    <div className="flex gap-1">
                      <Badge variant="secondary" className="text-xs">
                        Schengen
                      </Badge>
                      {country.is_eu && (
                        <Badge variant="outline" className="text-xs">
                          EU
                        </Badge>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {groupedCountries.euNonSchengen.length > 0 && (
              <CommandGroup heading="🇪🇺 EU Countries (Non-Schengen)">
                {groupedCountries.euNonSchengen.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={`${country.name} ${country.code}`}
                    onSelect={() => {
                      onValueChange(country.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value === country.id.toString() ? "opacity-100" : "opacity-0")}
                    />
                    <span className="mr-2 text-lg">{getFlagEmoji(country.code)}</span>
                    <span className="flex-1">{country.name}</span>
                    <Badge variant="outline" className="text-xs">
                      EU
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {groupedCountries.otherEuropean.length > 0 && (
              <CommandGroup heading="🌍 Other European Countries">
                {groupedCountries.otherEuropean.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={`${country.name} ${country.code}`}
                    onSelect={() => {
                      onValueChange(country.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value === country.id.toString() ? "opacity-100" : "opacity-0")}
                    />
                    <span className="mr-2 text-lg">{getFlagEmoji(country.code)}</span>
                    <span>{country.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {groupedCountries.nonEuropean.length > 0 && (
              <CommandGroup heading="🌎 Other Countries">
                {groupedCountries.nonEuropean.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={`${country.name} ${country.code}`}
                    onSelect={() => {
                      onValueChange(country.id.toString())
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", value === country.id.toString() ? "opacity-100" : "opacity-0")}
                    />
                    <span className="mr-2 text-lg">{getFlagEmoji(country.code)}</span>
                    <span>{country.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

// Helper function to get flag emoji from country code
function getFlagEmoji(countryCode: string): string {
  if (!countryCode) return "🏳️"

  const flagMap: Record<string, string> = {
    AD: "🇦🇩",
    AE: "🇦🇪",
    AL: "🇦🇱",
    AM: "🇦🇲",
    AR: "🇦🇷",
    AT: "🇦🇹",
    AU: "🇦🇺",
    AZ: "🇦🇿",
    BA: "🇧🇦",
    BE: "🇧🇪",
    BG: "🇧🇬",
    BR: "🇧🇷",
    BY: "🇧🇾",
    CA: "🇨🇦",
    CH: "🇨🇭",
    CL: "🇨🇱",
    CN: "🇨🇳",
    CY: "🇨🇾",
    CZ: "🇨🇿",
    DE: "🇩🇪",
    DK: "🇩🇰",
    EE: "🇪🇪",
    ES: "🇪🇸",
    FI: "🇫🇮",
    FR: "🇫🇷",
    GB: "🇬🇧",
    GE: "🇬🇪",
    GR: "🇬🇷",
    HK: "🇭🇰",
    HR: "🇭🇷",
    HU: "🇭🇺",
    IE: "🇮🇪",
    IL: "🇮🇱",
    IN: "🇮🇳",
    IS: "🇮🇸",
    IT: "🇮🇹",
    JP: "🇯🇵",
    KR: "🇰🇷",
    KZ: "🇰🇿",
    LI: "🇱🇮",
    LT: "🇱🇹",
    LU: "🇱🇺",
    LV: "🇱🇻",
    MC: "🇲🇨",
    MD: "🇲🇩",
    ME: "🇲🇪",
    MK: "🇲🇰",
    MT: "🇲🇹",
    MX: "🇲🇽",
    NL: "🇳🇱",
    NO: "🇳🇴",
    NZ: "🇳🇿",
    PL: "🇵🇱",
    PT: "🇵🇹",
    RO: "🇷🇴",
    RS: "🇷🇸",
    RU: "🇷🇺",
    SE: "🇸🇪",
    SG: "🇸🇬",
    SI: "🇸🇮",
    SK: "🇸🇰",
    SM: "🇸🇲",
    TR: "🇹🇷",
    UA: "🇺🇦",
    US: "🇺🇸",
    VA: "🇻🇦",
    XK: "🇽🇰",
    ZA: "🇿🇦",
  }
  return flagMap[countryCode] || "🏳️"
}
