"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/types/database";

type EventType = Database["public"]["Tables"]["events"]["Row"]["event_type"];

interface City {
  id: string;
  name: string;
  slug: string;
  state: string;
}

interface Bloco {
  id: string;
  name: string;
  slug: string;
}

interface EventsFiltersProps {
  cities: City[];
  blocos: Bloco[];
  locale: string;
}

export function EventsFilters({ cities, blocos, locale }: EventsFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCity = searchParams.get("city") || "all";
  const currentBloco = searchParams.get("bloco") || "all";
  const currentDate = searchParams.get("date") || "";
  const currentEventType = searchParams.get("eventType") || "all";
  const carnaval2025 = searchParams.get("carnaval2025") !== "false";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const updateCarnaval2025 = useCallback(
    (checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!checked) {
        params.set("carnaval2025", "false");
      } else {
        params.delete("carnaval2025");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const eventTypes = [
    { value: "parade", label: locale === "pt" ? "Desfile" : "Parade" },
    { value: "rehearsal", label: locale === "pt" ? "Ensaio" : "Rehearsal" },
    { value: "party", label: locale === "pt" ? "Festa" : "Party" },
    { value: "workshop", label: locale === "pt" ? "Oficina" : "Workshop" },
  ];

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 lg:gap-4">
      {/* City Filter */}
      <Select
        value={currentCity}
        onValueChange={(value) => updateFilter("city", value)}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue
            placeholder={locale === "pt" ? "Todas as cidades" : "All cities"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {locale === "pt" ? "Todas as cidades" : "All cities"}
          </SelectItem>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.slug}>
              {city.name}, {city.state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Bloco Filter */}
      <Select
        value={currentBloco}
        onValueChange={(value) => updateFilter("bloco", value)}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue
            placeholder={locale === "pt" ? "Todos os blocos" : "All blocos"}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {locale === "pt" ? "Todos os blocos" : "All blocos"}
          </SelectItem>
          {blocos.map((bloco) => (
            <SelectItem key={bloco.id} value={bloco.slug}>
              {bloco.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Event Type Filter */}
      <Select
        value={currentEventType}
        onValueChange={(value) => updateFilter("eventType", value)}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder={locale === "pt" ? "Tipo" : "Type"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            {locale === "pt" ? "Todos os tipos" : "All types"}
          </SelectItem>
          {eventTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Filter */}
      <input
        type="date"
        value={currentDate}
        onChange={(e) => updateFilter("date", e.target.value)}
        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
        placeholder={locale === "pt" ? "Selecionar data" : "Select a date"}
      />

      {/* Carnaval 2025 Toggle */}
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <Switch
          id="carnaval-2025"
          checked={carnaval2025}
          onCheckedChange={updateCarnaval2025}
        />
        <Label
          htmlFor="carnaval-2025"
          className="text-sm font-medium whitespace-nowrap"
        >
          Carnaval 2025
        </Label>
      </div>
    </div>
  );
}
