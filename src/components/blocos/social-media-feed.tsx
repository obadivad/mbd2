"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Youtube, Music, ExternalLink, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface SocialMediaFeedProps {
  blocoId: string;
  socialLinks: {
    instagram_url?: string;
    youtube_channel_url?: string;
    spotify_playlist_url?: string;
    facebook_url?: string;
  };
  locale: string;
}

interface InstagramPost {
  id: string;
  caption: string;
  media_url: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  permalink: string;
  timestamp: string;
}

interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  preview_url?: string;
  external_url: string;
  image?: string;
}

export function SocialMediaFeed({
  blocoId,
  socialLinks,
  locale,
}: SocialMediaFeedProps) {
  const t = useTranslations("SocialMedia");
  const [activeTab, setActiveTab] = useState<string>("instagram");

  // Determine which tabs to show based on available social links
  const availableTabs: string[] = [];
  if (socialLinks.instagram_url) availableTabs.push("instagram");
  if (socialLinks.youtube_channel_url) availableTabs.push("youtube");
  if (socialLinks.spotify_playlist_url) availableTabs.push("spotify");

  // Set default active tab to first available
  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [availableTabs, activeTab]);

  // Instagram feed query
  const { data: instagramPosts, isLoading: instagramLoading } = useQuery({
    queryKey: ["instagram", blocoId],
    queryFn: async (): Promise<InstagramPost[]> => {
      if (!socialLinks.instagram_url) return [];

      const response = await fetch(`/api/social/instagram?blocoId=${blocoId}`);
      if (!response.ok) throw new Error("Failed to fetch Instagram posts");

      const data = await response.json();
      return data.data || [];
    },
    enabled: !!socialLinks.instagram_url,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  // YouTube videos query
  const { data: youtubeVideos, isLoading: youtubeLoading } = useQuery({
    queryKey: ["youtube", blocoId],
    queryFn: async (): Promise<YouTubeVideo[]> => {
      if (!socialLinks.youtube_channel_url) return [];

      const response = await fetch(`/api/social/youtube?blocoId=${blocoId}`);
      if (!response.ok) throw new Error("Failed to fetch YouTube videos");

      const data = await response.json();
      return data.data || [];
    },
    enabled: !!socialLinks.youtube_channel_url,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  // Spotify tracks query
  const { data: spotifyTracks, isLoading: spotifyLoading } = useQuery({
    queryKey: ["spotify", blocoId],
    queryFn: async (): Promise<SpotifyTrack[]> => {
      if (!socialLinks.spotify_playlist_url) return [];

      const response = await fetch(`/api/social/spotify?blocoId=${blocoId}`);
      if (!response.ok) throw new Error("Failed to fetch Spotify tracks");

      const data = await response.json();
      return data.data || [];
    },
    enabled: !!socialLinks.spotify_playlist_url,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (availableTabs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-gray-500">
            <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {t("noSocialMedia", {
                defaultValue: "Nenhuma rede social disponível",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Music className="h-5 w-5" />
          <span>{t("socialMediaFeed", { defaultValue: "Redes Sociais" })}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {socialLinks.instagram_url && (
              <TabsTrigger
                value="instagram"
                className="flex items-center space-x-2"
              >
                <Instagram className="h-4 w-4" />
                <span className="hidden sm:inline">Instagram</span>
              </TabsTrigger>
            )}
            {socialLinks.youtube_channel_url && (
              <TabsTrigger
                value="youtube"
                className="flex items-center space-x-2"
              >
                <Youtube className="h-4 w-4" />
                <span className="hidden sm:inline">YouTube</span>
              </TabsTrigger>
            )}
            {socialLinks.spotify_playlist_url && (
              <TabsTrigger
                value="spotify"
                className="flex items-center space-x-2"
              >
                <Music className="h-4 w-4" />
                <span className="hidden sm:inline">Spotify</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Instagram Tab */}
          {socialLinks.instagram_url && (
            <TabsContent value="instagram" className="mt-4">
              {instagramLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : instagramPosts && instagramPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {instagramPosts.slice(0, 6).map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <div className="aspect-square relative">
                        {post.media_type === "VIDEO" ? (
                          <div className="relative">
                            <img
                              src={post.media_url}
                              alt={post.caption}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                          </div>
                        ) : (
                          <img
                            src={post.media_url}
                            alt={post.caption}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <CardContent className="p-3">
                        <p className="text-sm text-gray-700 line-clamp-3 mb-2">
                          {post.caption}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="text-xs">
                            <Instagram className="h-3 w-3 mr-1" />
                            Instagram
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              window.open(post.permalink, "_blank")
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Instagram className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    {t("noInstagramPosts", {
                      defaultValue: "Nenhum post encontrado",
                    })}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      window.open(socialLinks.instagram_url, "_blank")
                    }
                  >
                    {t("visitInstagram", { defaultValue: "Visitar Instagram" })}
                  </Button>
                </div>
              )}
            </TabsContent>
          )}

          {/* YouTube Tab */}
          {socialLinks.youtube_channel_url && (
            <TabsContent value="youtube" className="mt-4">
              {youtubeLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex space-x-4">
                      <Skeleton className="h-24 w-32 flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-4 w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : youtubeVideos && youtubeVideos.length > 0 ? (
                <div className="space-y-4">
                  {youtubeVideos.slice(0, 5).map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex space-x-4">
                          <div className="relative flex-shrink-0">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              className="w-32 h-24 object-cover rounded"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 mb-2">
                              {video.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                              {video.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                <Youtube className="h-3 w-3 mr-1" />
                                YouTube
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(video.url, "_blank")}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Youtube className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    {t("noYouTubeVideos", {
                      defaultValue: "Nenhum vídeo encontrado",
                    })}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      window.open(socialLinks.youtube_channel_url, "_blank")
                    }
                  >
                    {t("visitYouTube", { defaultValue: "Visitar YouTube" })}
                  </Button>
                </div>
              )}
            </TabsContent>
          )}

          {/* Spotify Tab */}
          {socialLinks.spotify_playlist_url && (
            <TabsContent value="spotify" className="mt-4">
              {spotifyLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <Skeleton className="h-12 w-12 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : spotifyTracks && spotifyTracks.length > 0 ? (
                <div className="space-y-3">
                  {spotifyTracks.slice(0, 10).map((track) => (
                    <div
                      key={track.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
                    >
                      {track.image && (
                        <img
                          src={track.image}
                          alt={track.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">
                          {track.name}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {track.artists.join(", ")}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {track.preview_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const audio = new Audio(track.preview_url);
                              audio.play();
                            }}
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(track.external_url, "_blank")
                          }
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Music className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500">
                    {t("noSpotifyTracks", {
                      defaultValue: "Nenhuma música encontrada",
                    })}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() =>
                      window.open(socialLinks.spotify_playlist_url, "_blank")
                    }
                  >
                    {t("visitSpotify", { defaultValue: "Visitar Spotify" })}
                  </Button>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
