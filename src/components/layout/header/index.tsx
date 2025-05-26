"use client";

import { Link } from "@/i18n/navigation";
import { Navigation } from "./navigation";
import { CitySelector } from "./city-selector";
import { LanguageSelector } from "./language-selector";
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">MB</span>
            </div>
            <span className="font-bold text-xl text-green-800 hidden sm:inline">
              Ministério do Bloco
            </span>
          </Link>

          {/* Navigation */}
          <Navigation />

          {/* Right side controls */}
          <div className="flex items-center space-x-2">
            {/* Search button */}
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>

            {/* City selector */}
            <CitySelector />

            {/* Language selector */}
            <LanguageSelector />

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
