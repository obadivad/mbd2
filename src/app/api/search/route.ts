import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const locale = searchParams.get("locale") || "pt";
    const city = searchParams.get("city");
    const eventType = searchParams.get("eventType");
    const hasInstagram = searchParams.get("hasInstagram") === "true";
    const hasSpotify = searchParams.get("hasSpotify") === "true";
    const sortBy = searchParams.get("sortBy") || "relevance";
    const limit = parseInt(searchParams.get("limit") || "20");

    const supabase = createRouteHandlerClient({ cookies });

    // Build the base query with proper select
    const selectFields = `
      id,
      name,
      slug,
      short_description_pt,
      short_description_en,
      short_description_fr,
      short_description_es,
      instagram_url,
      facebook_url,
      youtube_channel_url,
      spotify_playlist_url,
      image_url,
      view_count,
      popularity_score,
      cities:primary_city_id(name, slug)
    `;

    let queryBuilder = supabase
      .from("blocos")
      .select(selectFields)
      .eq("is_draft", false);

    // Apply text search if query provided
    if (query.trim()) {
      queryBuilder = queryBuilder.textSearch("search_vector", query, {
        type: "websearch",
        config: "portuguese",
      });
    }

    // Apply city filter
    if (city) {
      queryBuilder = queryBuilder.eq("cities.slug", city);
    }

    // Apply social media filters
    if (hasInstagram) {
      queryBuilder = queryBuilder.not("instagram_url", "is", null);
    }

    if (hasSpotify) {
      queryBuilder = queryBuilder.not("spotify_playlist_url", "is", null);
    }

    // Apply sorting
    switch (sortBy) {
      case "name":
        queryBuilder = queryBuilder.order("name", { ascending: true });
        break;
      case "popularity":
        queryBuilder = queryBuilder.order("popularity_score", {
          ascending: false,
        });
        break;
      case "relevance":
      default:
        if (query.trim()) {
          // For text search, we'll rely on the natural ranking from textSearch
          queryBuilder = queryBuilder.order("popularity_score", {
            ascending: false,
          });
        } else {
          queryBuilder = queryBuilder.order("popularity_score", {
            ascending: false,
          });
        }
        break;
    }

    // Apply limit
    queryBuilder = queryBuilder.limit(limit);

    const { data, error } = await queryBuilder;

    if (error) {
      console.error("Search error:", error);
      return NextResponse.json(
        { error: "Search failed", details: error.message },
        { status: 500 }
      );
    }

    // Process results to include proper multilingual descriptions
    const processedResults =
      data?.map((bloco) => ({
        ...bloco,
        city: bloco.cities,
        cities: undefined, // Remove the nested cities object
      })) || [];

    return NextResponse.json({
      data: processedResults,
      pagination: {
        total: processedResults.length,
        limit,
        hasMore: processedResults.length === limit,
      },
      metadata: {
        query,
        locale,
        filters: {
          city,
          eventType,
          hasInstagram,
          hasSpotify,
        },
        sortBy,
      },
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Auto-complete suggestions endpoint
export async function POST(request: NextRequest) {
  try {
    const { query, limit = 5 } = await request.json();

    if (!query || query.length < 2) {
      return NextResponse.json({ data: [] });
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get bloco suggestions
    const { data: blocoSuggestions } = await supabase
      .from("blocos")
      .select("name, slug")
      .ilike("name", `${query}%`)
      .eq("is_draft", false)
      .limit(limit);

    // Get city suggestions
    const { data: citySuggestions } = await supabase
      .from("cities")
      .select("name, slug")
      .ilike("name", `${query}%`)
      .limit(3);

    const suggestions = [
      ...(blocoSuggestions?.map((bloco) => ({
        text: bloco.name,
        type: "bloco",
        category: "Blocos",
        url: `/blocos/${bloco.slug}`,
      })) || []),
      ...(citySuggestions?.map((city) => ({
        text: city.name,
        type: "city",
        category: "Cidades",
        url: `/${city.slug}`,
      })) || []),
    ];

    return NextResponse.json({ data: suggestions });
  } catch (error) {
    console.error("Suggestions API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
