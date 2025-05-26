"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MapPin, ChevronDown } from "lucide-react";

export function CitySelector() {
  const t = useTranslations("Cities");

  const cities = [
    { slug: "rio-de-janeiro", name: "Rio de Janeiro" },
    { slug: "salvador", name: "Salvador" },
    { slug: "sao-paulo", name: "São Paulo" },
    { slug: "recife", name: "Recife" },
    { slug: "belo-horizonte", name: "Belo Horizonte" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="hidden sm:flex">
          <MapPin className="h-4 w-4 mr-2" />
          {t("selectCity")}
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {cities.map((city) => (
          <DropdownMenuItem key={city.slug}>{city.name}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
