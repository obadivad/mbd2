import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Music, Users } from "lucide-react";

interface BlocoInfoProps {
  bloco: any;
  locale: string;
}

export function BlocoInfo({ bloco, locale }: BlocoInfoProps) {
  const description =
    bloco[`long_description_${locale}`] || bloco.long_description_pt;

  return (
    <div className="space-y-6">
      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Sobre o Bloco
          </CardTitle>
        </CardHeader>
        <CardContent>
          {description ? (
            <p className="text-gray-700 leading-relaxed">{description}</p>
          ) : (
            <p className="text-gray-500 italic">Descrição não disponível</p>
          )}
        </CardContent>
      </Card>

      {/* Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Informações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bloco.founded_year && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Fundado em:</span>
                <span className="font-medium">{bloco.founded_year}</span>
              </div>
            )}

            {bloco.neighborhood && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Bairro:</span>
                <span className="font-medium">{bloco.neighborhood}</span>
              </div>
            )}

            {bloco.music_style && (
              <div className="flex items-center gap-2">
                <Music className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Estilo Musical:</span>
                <Badge variant="outline">{bloco.music_style}</Badge>
              </div>
            )}

            {bloco.member_count && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Membros:</span>
                <span className="font-medium">
                  {bloco.member_count.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Links Section */}
      {(bloco.facebook_url || bloco.instagram_url || bloco.twitter_url) && (
        <Card>
          <CardHeader>
            <CardTitle>Redes Sociais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {bloco.facebook_url && (
                <a
                  href={bloco.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Facebook
                </a>
              )}
              {bloco.instagram_url && (
                <a
                  href={bloco.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors"
                >
                  Instagram
                </a>
              )}
              {bloco.twitter_url && (
                <a
                  href={bloco.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Twitter
                </a>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
