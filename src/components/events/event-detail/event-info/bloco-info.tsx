"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Users,
  ExternalLink,
  Music,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Bloco {
  id: string;
  name: string;
  slug: string;
  short_description_pt?: string;
  short_description_en?: string;
  short_description_fr?: string;
  short_description_es?: string;
  image_url?: string;
  instagram_url?: string;
  facebook_url?: string;
  youtube_channel_url?: string;
  spotify_playlist_url?: string;
}

interface BlocoInfoProps {
  bloco: Bloco;
  locale: string;
}

export function BlocoInfo({ bloco, locale }: BlocoInfoProps) {
  // Get localized description
  const getDescription = () => {
    switch (locale) {
      case "en":
        return bloco.short_description_en || bloco.short_description_pt;
      case "fr":
        return bloco.short_description_fr || bloco.short_description_pt;
      case "es":
        return bloco.short_description_es || bloco.short_description_pt;
      default:
        return bloco.short_description_pt;
    }
  };

  const description = getDescription();

  // Social media links
  const socialLinks = [
    {
      url: bloco.instagram_url,
      icon: Instagram,
      label: "Instagram",
      color: "text-pink-600",
    },
    {
      url: bloco.facebook_url,
      icon: Facebook,
      label: "Facebook",
      color: "text-blue-600",
    },
    {
      url: bloco.youtube_channel_url,
      icon: Youtube,
      label: "YouTube",
      color: "text-red-600",
    },
    {
      url: bloco.spotify_playlist_url,
      icon: Music,
      label: "Spotify",
      color: "text-green-600",
    },
  ].filter((link) => link.url);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          {locale === "pt" ? "Sobre o Bloco" : "About the Bloco"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Bloco Image */}
          <div className="flex-shrink-0">
            {bloco.image_url ? (
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden">
                <Image
                  src={bloco.image_url}
                  alt={bloco.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
            )}
          </div>

          {/* Bloco Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {bloco.name}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {locale === "pt" ? "Bloco de Carnaval" : "Carnival Bloco"}
                </Badge>
              </div>

              <Button variant="outline" size="sm" asChild>
                <Link href={`/blocos/${bloco.slug}`}>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {locale === "pt" ? "Ver Perfil" : "View Profile"}
                </Link>
              </Button>
            </div>

            {/* Description */}
            {description && (
              <p className="text-gray-700 text-sm leading-relaxed mb-4 line-clamp-3">
                {description}
              </p>
            )}

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-900">
                  {locale === "pt" ? "Redes Sociais" : "Social Media"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((link, index) => {
                    const Icon = link.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-8 px-3"
                        asChild
                      >
                        <Link
                          href={link.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Icon className={`w-4 h-4 mr-1 ${link.color}`} />
                          <span className="text-xs">{link.label}</span>
                        </Link>
                      </Button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
