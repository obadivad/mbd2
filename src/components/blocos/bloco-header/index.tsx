import Image from "next/image";
import { MapPin, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlocoHeaderProps {
  bloco: any;
  locale: string;
}

export function BlocoHeader({ bloco, locale }: BlocoHeaderProps) {
  const description =
    bloco[`short_description_${locale}`] || bloco.short_description_pt;

  return (
    <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white">
      {/* Background Image */}
      {bloco.image_url && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={bloco.image_url}
            alt={bloco.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Bloco Logo/Image */}
          {bloco.image_url && (
            <div className="flex-shrink-0">
              <Image
                src={bloco.image_url}
                alt={bloco.name}
                width={120}
                height={120}
                className="rounded-lg border-4 border-white shadow-lg"
              />
            </div>
          )}

          {/* Bloco Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold">{bloco.name}</h1>
              {bloco.is_verified && (
                <Badge variant="secondary" className="bg-yellow-500 text-black">
                  Verificado
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-4 text-green-100 mb-4">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{bloco.city.name}</span>
              </div>
              {bloco.founded_year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Desde {bloco.founded_year}</span>
                </div>
              )}
              {bloco.member_count && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{bloco.member_count.toLocaleString()} membros</span>
                </div>
              )}
            </div>

            {description && (
              <p className="text-lg text-green-50 mb-6 max-w-2xl">
                {description}
              </p>
            )}

            <div className="flex gap-3">
              <Button variant="secondary" size="lg">
                Seguir Bloco
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white hover:bg-white hover:text-green-600"
              >
                Ver Eventos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
