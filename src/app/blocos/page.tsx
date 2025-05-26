import { createClient } from "@/lib/supabase/server";
import { BlocoCard } from "@/components/blocos/bloco-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Search, Heart } from "lucide-react";
import { Metadata } from "next";

export default async function AllBlocosPage() {
  const supabase = await createClient();

  // Get all cities for the dropdown
  const { data: cities } = await supabase
    .from("cities")
    .select("id, name, slug")
    .order("name");

  // Get all blocos from all cities
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
      primary_city_id,
      cities!primary_city_id(name, slug)
    `
    )
    .eq("is_draft", false)
    .order("name");

  // Log any errors for debugging
  if (blocosError) {
    console.error("Error fetching blocos:", blocosError);
  }

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
              <Select defaultValue="">
                <SelectTrigger className="w-64 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={city.slug}>
                      {city.name}
                    </SelectItem>
                  ))}
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
        <div className="mb-6">
          <p className="text-gray-600">
            {blocos?.length || 0} blocos encontrados
          </p>
        </div>

        {blocos && blocos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {blocos.map((bloco) => (
              <BlocoCard
                key={bloco.id}
                bloco={{
                  id: bloco.id,
                  name: bloco.name,
                  slug: bloco.slug,
                  description: bloco.short_description_pt || "",
                  image_url: bloco.image_url,
                  founding_year: bloco.founding_year,
                  social_links: {
                    instagram: bloco.instagram_url,
                    facebook: bloco.facebook_url,
                    youtube: bloco.youtube_channel_url,
                    spotify: bloco.spotify_playlist_url,
                  },
                  city: {
                    name: Array.isArray(bloco.cities)
                      ? bloco.cities[0]?.name || "Unknown"
                      : bloco.cities?.name || "Unknown",
                    slug: Array.isArray(bloco.cities)
                      ? bloco.cities[0]?.slug || "unknown"
                      : bloco.cities?.slug || "unknown",
                  },
                }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum bloco encontrado
            </h3>
            <p className="text-gray-600">Não encontramos blocos cadastrados.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Blocos de Carnaval do Brasil | Ministério do Bloco",
    description:
      "Descubra todos os blocos de carnaval do Brasil. Encontre informações, eventos e redes sociais dos melhores blocos de rua de todas as cidades.",
    openGraph: {
      title: "Blocos de Carnaval do Brasil",
      description: "Descubra todos os blocos de carnaval do Brasil",
    },
  };
}
