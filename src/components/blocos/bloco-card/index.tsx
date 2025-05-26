"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, MapPin, Users } from "lucide-react";

interface BlocoCardProps {
  bloco: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    image_url?: string;
    founding_year?: number;
    social_links?: {
      facebook?: string;
      instagram?: string;
      youtube?: string;
      spotify?: string;
    };
    city?: {
      name: string;
      slug: string;
    };
  };
}

export function BlocoCard({ bloco }: BlocoCardProps) {
  const params = useParams();
  const locale = (params.locale as string) || "pt";
  const city = (params.city as string) || bloco.city?.slug || "rio-de-janeiro";

  const blocoUrl = `/${locale}/${city}/blocos/${bloco.slug}`;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] group cursor-pointer">
      <Link href={blocoUrl} className="block">
        {/* Bloco Image */}
        {bloco.image_url && (
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <img
              src={bloco.image_url}
              alt={bloco.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
            <div className="absolute top-2 right-2">
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/80 hover:bg-white"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle follow logic here
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                {bloco.name}
              </CardTitle>

              <div className="flex items-center gap-2 mt-1">
                {bloco.founding_year && (
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Fundado em {bloco.founding_year}
                  </CardDescription>
                )}
                {bloco.city && (
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {bloco.city.name}
                  </CardDescription>
                )}
              </div>
            </div>
            {!bloco.image_url && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Handle follow logic here
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {bloco.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {bloco.description}
            </p>
          )}

          {/* Social Media Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {bloco.social_links?.instagram && (
              <Badge
                variant="outline"
                className="text-xs bg-pink-50 text-pink-700 border-pink-200"
              >
                📷 Instagram
              </Badge>
            )}
            {bloco.social_links?.facebook && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700 border-blue-200"
              >
                📘 Facebook
              </Badge>
            )}
            {bloco.social_links?.youtube && (
              <Badge
                variant="outline"
                className="text-xs bg-red-50 text-red-700 border-red-200"
              >
                🎥 YouTube
              </Badge>
            )}
            {bloco.social_links?.spotify && (
              <Badge
                variant="outline"
                className="text-xs bg-green-50 text-green-700 border-green-200"
              >
                🎵 Spotify
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={(e) => {
                e.preventDefault();
                // Navigation is handled by the Link wrapper
                window.location.href = blocoUrl;
              }}
            >
              Ver Detalhes
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Handle follow logic here
              }}
            >
              Seguir
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
