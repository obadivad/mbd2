import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FeaturedBlocos } from "@/components/homepage/featured-content/featured-blocos";

export default function HomePage() {
  const t = useTranslations("Homepage");

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-green-800 mb-4">
            {t("title")}
          </h1>
          <p className="text-xl text-green-600 mb-8">{t("subtitle")}</p>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              {t("heroTitle")}
            </h2>
            <p className="text-lg text-gray-600 mb-8">{t("heroSubtitle")}</p>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Explorar Blocos
            </Button>
          </div>
        </div>

        {/* Featured Blocos Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-green-800 mb-8 text-center">
            {t("featuredBlocos")}
          </h3>
          <FeaturedBlocos />
        </div>

        {/* Other Sections */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">
                {t("upcomingEvents")}
              </CardTitle>
              <CardDescription>Eventos próximos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Não perca nenhum ensaio, desfile ou festa
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-700">
                {t("popularCities")}
              </CardTitle>
              <CardDescription>Cidades em destaque</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Explore o carnaval em diferentes cidades
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
