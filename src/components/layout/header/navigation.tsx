"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Calendar, Map, Users, Search } from "lucide-react";

export function Navigation() {
  const t = useTranslations("Navigation");

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-green-700 hover:text-green-800">
            {t("blocos")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <NavigationMenuLink asChild>
                <Link
                  href="/blocos"
                  className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-md"
                >
                  <Users className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Todos os Blocos</div>
                    <div className="text-sm text-gray-600">
                      Descubra blocos de carnaval
                    </div>
                  </div>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/blocos/map"
                  className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-md"
                >
                  <Map className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Mapa de Blocos</div>
                    <div className="text-sm text-gray-600">
                      Visualize no mapa
                    </div>
                  </div>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-green-700 hover:text-green-800">
            {t("events")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-6 w-[400px]">
              <NavigationMenuLink asChild>
                <Link
                  href="/eventos"
                  className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-md"
                >
                  <Calendar className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Todos os Eventos</div>
                    <div className="text-sm text-gray-600">
                      Ensaios, desfiles e festas
                    </div>
                  </div>
                </Link>
              </NavigationMenuLink>
              <NavigationMenuLink asChild>
                <Link
                  href="/eventos"
                  className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-md"
                >
                  <Calendar className="h-4 w-4" />
                  <div>
                    <div className="font-medium">Calendário</div>
                    <div className="text-sm text-gray-600">
                      Vista de calendário
                    </div>
                  </div>
                </Link>
              </NavigationMenuLink>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/cities"
              className="text-green-700 hover:text-green-800 px-4 py-2"
            >
              {t("cities")}
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="/search"
              className="text-sm font-medium text-gray-700 hover:text-green-600 transition-colors flex items-center space-x-1"
            >
              <Search className="h-4 w-4" />
              <span>{t("search", { defaultValue: "Buscar" })}</span>
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
