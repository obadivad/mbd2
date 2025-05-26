"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="bg-green-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-800 font-bold text-sm">MB</span>
              </div>
              <span className="text-xl font-bold">Ministério do Bloco</span>
            </div>
            <p className="text-green-100 mb-4">
              A plataforma completa para descobrir e acompanhar blocos de
              carnaval no Brasil.
            </p>
          </div>

          {/* Blocos */}
          <div>
            <h3 className="font-semibold mb-4">{t("blocos")}</h3>
            <ul className="space-y-2 text-green-100">
              <li>
                <Link
                  href="/blocos"
                  className="hover:text-white transition-colors"
                >
                  Todos os Blocos
                </Link>
              </li>
              <li>
                <Link
                  href="/blocos"
                  className="hover:text-white transition-colors"
                >
                  Mapa de Blocos
                </Link>
              </li>
              <li>
                <Link
                  href="/blocos"
                  className="hover:text-white transition-colors"
                >
                  Por Cidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Events */}
          <div>
            <h3 className="font-semibold mb-4">{t("events")}</h3>
            <ul className="space-y-2 text-green-100">
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  Todos os Eventos
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  Calendário
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="hover:text-white transition-colors"
                >
                  Mapa de Eventos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-green-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-green-100 text-sm">
            © 2024 Ministério do Bloco. Todos os direitos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="/about"
              className="text-green-100 hover:text-white text-sm transition-colors"
            >
              {t("about")}
            </Link>
            <Link
              href="/privacy"
              className="text-green-100 hover:text-white text-sm transition-colors"
            >
              Privacidade
            </Link>
            <Link
              href="/terms"
              className="text-green-100 hover:text-white text-sm transition-colors"
            >
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
