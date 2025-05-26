"use client";

import { useEffect, useState } from "react";
import { BlocoCard } from "@/components/blocos/bloco-card";
import { Skeleton } from "@/components/ui/skeleton";

interface Bloco {
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
}

export function FeaturedBlocos() {
  const [blocos, setBlocos] = useState<Bloco[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocos = async () => {
      try {
        const response = await fetch("/api/blocos?limit=6");
        if (!response.ok) {
          throw new Error("Failed to fetch blocos");
        }
        const data = await response.json();
        setBlocos(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocos();
  }, []);

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Erro ao carregar blocos: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-green-600 hover:text-green-700 underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (blocos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Nenhum bloco encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blocos.map((bloco) => (
        <BlocoCard key={bloco.id} bloco={bloco} />
      ))}
    </div>
  );
}
