import { useTranslations } from "next-intl";
import { AdvancedSearch } from "@/components/search/advanced-search";
import { MapView } from "@/components/blocos/map-view";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Map, List } from "lucide-react";

interface SearchPageProps {
  params: {
    locale: string;
  };
  searchParams: {
    q?: string;
    city?: string;
  };
}

export default function SearchPage({ params, searchParams }: SearchPageProps) {
  const t = useTranslations("Search");
  const { locale } = params;
  const { q: query, city } = searchParams;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">
          {t("title", { defaultValue: "Buscar Blocos" })}
        </h1>
        <p className="text-gray-600">
          {t("subtitle", {
            defaultValue: "Encontre blocos de carnaval em todo o Brasil",
          })}
        </p>
      </div>

      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="search" className="flex items-center space-x-2">
            <Search className="h-4 w-4" />
            <span>{t("searchResults", { defaultValue: "Busca" })}</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center space-x-2">
            <Map className="h-4 w-4" />
            <span>{t("mapView", { defaultValue: "Mapa" })}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <AdvancedSearch
            locale={locale}
            onResultsChange={(results) => {
              console.log("Search results:", results);
            }}
          />
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <MapView
            locale={locale}
            city={city}
            height="600px"
            className="w-full"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export async function generateMetadata({ params }: SearchPageProps) {
  const { locale } = params;

  return {
    title:
      locale === "pt"
        ? "Buscar Blocos - Ministério do Bloco"
        : "Search Blocos - Ministério do Bloco",
    description:
      locale === "pt"
        ? "Encontre blocos de carnaval em todo o Brasil. Busque por cidade, tipo de evento e muito mais."
        : "Find carnival blocos throughout Brazil. Search by city, event type and more.",
  };
}
