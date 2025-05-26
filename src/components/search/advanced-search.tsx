"use client";

import { useState, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, MapPin, Calendar, Music } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchFilters {
  query: string;
  city: string;
  eventType: string;
  hasInstagram: boolean;
  hasSpotify: boolean;
  sortBy: string;
}

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  short_description_pt?: string;
  short_description_en?: string;
  short_description_fr?: string;
  short_description_es?: string;
  city: {
    name: string;
    slug: string;
  };
  instagram_url?: string;
  spotify_playlist_url?: string;
  image_url?: string;
  relevance_score?: number;
}

interface AdvancedSearchProps {
  locale: string;
  onResultsChange?: (results: SearchResult[]) => void;
}

export function AdvancedSearch({
  locale,
  onResultsChange,
}: AdvancedSearchProps) {
  const t = useTranslations("Search");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    city: "",
    eventType: "",
    hasInstagram: false,
    hasSpotify: false,
    sortBy: "relevance",
  });
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Debounced search
  const [debouncedQuery, setDebouncedQuery] = useState(filters.query);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(filters.query), 300);
    return () => clearTimeout(timer);
  }, [filters.query]);

  // Search query
  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", debouncedQuery, filters, locale],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!debouncedQuery.trim() && !filters.city && !filters.eventType) {
        return [];
      }

      const params = new URLSearchParams({
        q: debouncedQuery,
        locale,
        ...(filters.city && { city: filters.city }),
        ...(filters.eventType && { eventType: filters.eventType }),
        ...(filters.hasInstagram && { hasInstagram: "true" }),
        ...(filters.hasSpotify && { hasSpotify: "true" }),
        sortBy: filters.sortBy,
      });

      const response = await fetch(`/api/search?${params}`);
      if (!response.ok) throw new Error("Search failed");

      const data = await response.json();
      return data.data || [];
    },
    enabled: Boolean(
      debouncedQuery.length > 0 || filters.city || filters.eventType
    ),
  });

  // Cities for filter
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const response = await fetch("/api/cities");
      if (!response.ok) throw new Error("Failed to fetch cities");
      const data = await response.json();
      return data.data || [];
    },
  });

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      query: "",
      city: "",
      eventType: "",
      hasInstagram: false,
      hasSpotify: false,
      sortBy: "relevance",
    });
  }, []);

  // Notify parent of results changes
  useEffect(() => {
    if (onResultsChange && searchResults) {
      onResultsChange(searchResults);
    }
  }, [searchResults, onResultsChange]);

  const getDescription = (result: SearchResult) => {
    const key = `short_description_${locale}` as keyof SearchResult;
    return (result[key] as string) || result.short_description_pt || "";
  };

  const activeFiltersCount = [
    filters.city,
    filters.eventType,
    filters.hasInstagram,
    filters.hasSpotify,
  ].filter(Boolean).length;

  return (
    <div className="w-full space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder={t("placeholder")}
          value={filters.query}
          onChange={(e) => updateFilter("query", e.target.value)}
          className="pl-10 pr-12"
        />

        {/* Filters Toggle */}
        <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Filter className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{t("filters")}</h4>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  {t("clearAll")}
                </Button>
              </div>

              {/* City Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("city")}</label>
                <Select
                  value={filters.city}
                  onValueChange={(value) => updateFilter("city", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCity")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("allCities")}</SelectItem>
                    {cities?.map((city: any) => (
                      <SelectItem key={city.slug} value={city.slug}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Event Type Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("eventType")}</label>
                <Select
                  value={filters.eventType}
                  onValueChange={(value) => updateFilter("eventType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectEventType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">{t("allEventTypes")}</SelectItem>
                    <SelectItem value="parade">{t("parade")}</SelectItem>
                    <SelectItem value="rehearsal">{t("rehearsal")}</SelectItem>
                    <SelectItem value="party">{t("party")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Social Media Filters */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("socialMedia")}
                </label>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={filters.hasInstagram ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateFilter("hasInstagram", !filters.hasInstagram)
                    }
                  >
                    Instagram
                  </Button>
                  <Button
                    variant={filters.hasSpotify ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      updateFilter("hasSpotify", !filters.hasSpotify)
                    }
                  >
                    <Music className="h-4 w-4 mr-1" />
                    Spotify
                  </Button>
                </div>
              </div>

              {/* Sort Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("sortBy")}</label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => updateFilter("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">{t("relevance")}</SelectItem>
                    <SelectItem value="name">{t("name")}</SelectItem>
                    <SelectItem value="popularity">
                      {t("popularity")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Search Results */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">{t("searching")}</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">{t("searchError")}</p>
        </div>
      )}

      {searchResults && searchResults.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {t("resultsFound", { count: searchResults.length })}
            </p>
          </div>

          <div className="grid gap-4">
            {searchResults.map((result: SearchResult) => (
              <Card
                key={result.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {result.image_url && (
                      <img
                        src={result.image_url}
                        alt={result.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-green-800 truncate">
                        {result.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        <MapPin className="inline h-3 w-3 mr-1" />
                        {result.city.name}
                      </p>
                      {getDescription(result) && (
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {getDescription(result)}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        {result.instagram_url && (
                          <Badge variant="secondary" className="text-xs">
                            Instagram
                          </Badge>
                        )}
                        {result.spotify_playlist_url && (
                          <Badge variant="secondary" className="text-xs">
                            <Music className="h-3 w-3 mr-1" />
                            Spotify
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {searchResults && searchResults.length === 0 && debouncedQuery && (
        <div className="text-center py-8">
          <p className="text-gray-600">{t("noResults")}</p>
          <Button variant="outline" onClick={clearFilters} className="mt-2">
            {t("clearFilters")}
          </Button>
        </div>
      )}
    </div>
  );
}
