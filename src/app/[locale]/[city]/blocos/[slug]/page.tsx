import { notFound } from "next/navigation";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

interface BlocoDetailPageProps {
  params: Promise<{
    locale: string;
    city: string;
    slug: string;
  }>;
}

async function getBlocoBySlug(citySlug: string, blocoSlug: string) {
  const supabase = await createClient();

  // First get the city
  const { data: city } = await supabase
    .from("cities")
    .select("id, name, slug")
    .eq("slug", citySlug)
    .single();

  if (!city) {
    return null;
  }

  // Then get the bloco
  const { data: bloco, error } = await supabase
    .from("blocos")
    .select("*")
    .eq("slug", blocoSlug)
    .eq("primary_city_id", city.id)
    .single();

  if (error || !bloco) {
    return null;
  }

  return {
    ...bloco,
    city,
  };
}

export async function generateMetadata({
  params,
}: BlocoDetailPageProps): Promise<Metadata> {
  const { locale, city, slug } = await params;
  const bloco = await getBlocoBySlug(city, slug);

  if (!bloco) {
    return {
      title: "Bloco não encontrado",
    };
  }

  const description =
    bloco[`short_description_${locale}`] || bloco.short_description_pt;

  return {
    title: `${bloco.name} - ${bloco.city.name} | Ministério do Bloco`,
    description,
    openGraph: {
      title: `${bloco.name} - ${bloco.city.name}`,
      description,
      images: bloco.image_url ? [bloco.image_url] : [],
    },
  };
}

export default async function BlocoDetailPage({
  params,
}: BlocoDetailPageProps) {
  const { locale, city, slug } = await params;
  const bloco = await getBlocoBySlug(city, slug);

  if (!bloco) {
    notFound();
  }

  const description =
    bloco[`short_description_${locale}`] || bloco.short_description_pt;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {bloco.name}
          </h1>

          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <span>{bloco.city.name}</span>
            {bloco.founding_year && (
              <span>Fundado em {bloco.founding_year}</span>
            )}
          </div>

          {description && <p className="text-gray-700 mb-6">{description}</p>}

          {bloco.image_url && (
            <div className="mb-6">
              <img
                src={bloco.image_url}
                alt={bloco.name}
                className="w-full max-w-md rounded-lg"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Informações</h2>
              <ul className="space-y-2">
                <li>
                  <strong>Cidade:</strong> {bloco.city.name}
                </li>
                {bloco.founding_year && (
                  <li>
                    <strong>Fundado:</strong> {bloco.founding_year}
                  </li>
                )}
                {bloco.instagram_url && (
                  <li>
                    <strong>Instagram:</strong>{" "}
                    <a
                      href={bloco.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver perfil
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
