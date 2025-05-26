import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MapView } from "@/components/blocos/map-view";
import { BlocoCard } from "@/components/blocos/bloco-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, List, Map, Users, Heart, Filter } from "lucide-react";
import { Metadata } from "next";

interface CityBlocosPageProps {
  params: Promise<{
    locale: string;
    city: string;
  }>;
  searchParams: Promise<{
    view?: string;
  }>;
}

export default async function CityBlocosPage({
  params,
  searchParams,
}: CityBlocosPageProps) {
  const { locale, city } = await params;
  const { view = "list" } = await searchParams;

  const supabase = await createClient();

  // Get city information
  const { data: cityData, error: cityError } = await supabase
    .from("cities")
    .select("*")
    .eq("slug", city)
    .single();

  if (cityError || !cityData) {
    notFound();
  }

  // Get blocos for this city
  const { data: blocos, error: blocosError } = await supabase
    .from("blocos")
    .select(
      `
      id,
      name,
      slug,
      short_description_pt,
      short_description_en,
      short_description_fr,
      short_description_es,
      image_url,
      founding_year,
      instagram_url,
      facebook_url,
      youtube_channel_url,
      spotify_playlist_url,
      latitude,
      longitude,
      primary_city_id,
      cities:primary_city_id(name, slug)
    `
    )
    .eq("is_draft", false)
    .eq("primary_city_id", cityData.id)
    .order("name");

  const blocosWithCoordinates =
    blocos?.filter((bloco) => bloco.latitude && bloco.longitude) || [];

  // Get localized description helper
  const getDescription = (bloco: any) => {
    const key = `short_description_${locale}`;
    return bloco[key] || bloco.short_description_pt || "";
  };

  // Alphabet filter for blocos
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const activeLetter = "A"; // This would come from search params in a real implementation

  return (
    <div className="min-h-screen">
      {/* Carnival Hero Section */}
      <div
        className="relative bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white overflow-hidden"
        style={{
          backgroundImage: "url('/carnival-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Carnival overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/80 via-orange-600/80 to-red-600/80"></div>

        <div className="relative container mx-auto px-4 py-16">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Blocos de rua
            </h1>
            <div className="flex items-center gap-2 mb-8">
              <Select defaultValue={city}>
                <SelectTrigger className="w-64 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={city}>{cityData.name}</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-orange-600"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Alterar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Search blocos..." className="pl-10" />
              </div>
            </div>

            {/* Filter Toggles */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                My Blocos
              </Button>

              <Select defaultValue="music">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="music">Music</SelectItem>
                  <SelectItem value="samba">Samba</SelectItem>
                  <SelectItem value="frevo">Frevo</SelectItem>
                  <SelectItem value="axe">Axé</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="types">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="types">Types</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Alphabet Filter */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {alphabet.map((letter) => (
              <Button
                key={letter}
                variant={letter === activeLetter ? "default" : "ghost"}
                size="sm"
                className="w-8 h-8 p-0"
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Blocos Grid */}
      <div className="container mx-auto px-4 py-8">
        {blocos && blocos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blocos.map((bloco) => (
              <BlocoCard
                key={bloco.id}
                bloco={{
                  id: bloco.id,
                  name: bloco.name,
                  slug: bloco.slug,
                  description: getDescription(bloco),
                  image_url: bloco.image_url,
                  founding_year: bloco.founding_year,
                  social_links: {
                    instagram: bloco.instagram_url,
                    facebook: bloco.facebook_url,
                    youtube: bloco.youtube_channel_url,
                    spotify: bloco.spotify_playlist_url,
                  },
                  city: {
                    name: cityData.name,
                    slug: cityData.slug,
                  },
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum bloco encontrado
            </h3>
            <p className="text-gray-600">
              Não encontramos blocos cadastrados para {cityData.name}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: CityBlocosPageProps): Promise<Metadata> {
  const { locale, city } = await params;

  const supabase = await createClient();
  const { data: cityData } = await supabase
    .from("cities")
    .select("name, state")
    .eq("slug", city)
    .single();

  if (!cityData) {
    return {
      title: "Cidade não encontrada",
    };
  }

  return {
    title: `Blocos de ${cityData.name} | Ministério do Bloco`,
    description: `Descubra todos os blocos de carnaval de ${cityData.name}. Encontre informações, eventos e redes sociais dos melhores blocos de rua.`,
    openGraph: {
      title: `Blocos de ${cityData.name}`,
      description: `Descubra todos os blocos de carnaval de ${cityData.name}`,
    },
  };
}
