import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get("locale") || "pt";
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const city = searchParams.get("city");

    const supabase = await createClient();

    // Build query with enhanced fields for search functionality
    let queryBuilder = supabase
      .from("blocos")
      .select(
        `
        id,
        name,
        slug,
        short_description_pt,
        short_description_en,
        short_description_fr,
        short_description_es,
        image_url,
        founding_year,
        facebook_url,
        instagram_url,
        youtube_channel_url,
        spotify_profile_url,
        spotify_playlist_url,
        cities:primary_city_id(name, slug)
      `,
        { count: "exact" }
      )
      .eq("is_draft", false);

    // Filter by city if specified
    if (city) {
      queryBuilder = queryBuilder.eq("cities.slug", city);
    }

    const {
      data: blocos,
      error,
      count,
    } = await queryBuilder.order("name").range(offset, offset + limit - 1);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch blocos" },
        { status: 500 }
      );
    }

    // Transform data to include localized description and proper structure
    const transformedBlocos = blocos?.map((bloco) => {
      // Get the localized description
      let description = bloco.short_description_pt;
      if (locale === "en" && bloco.short_description_en) {
        description = bloco.short_description_en;
      } else if (locale === "fr" && bloco.short_description_fr) {
        description = bloco.short_description_fr;
      } else if (locale === "es" && bloco.short_description_es) {
        description = bloco.short_description_es;
      }

      return {
        id: bloco.id,
        name: bloco.name,
        slug: bloco.slug,
        description,
        short_description_pt: bloco.short_description_pt,
        short_description_en: bloco.short_description_en,
        short_description_fr: bloco.short_description_fr,
        short_description_es: bloco.short_description_es,
        image_url: bloco.image_url,
        founding_year: bloco.founding_year,
        city: bloco.cities,
        social_links: {
          facebook: bloco.facebook_url,
          instagram: bloco.instagram_url,
          youtube: bloco.youtube_channel_url,
          spotify: bloco.spotify_profile_url,
        },
        // Include individual social URLs for search component compatibility
        facebook_url: bloco.facebook_url,
        instagram_url: bloco.instagram_url,
        youtube_channel_url: bloco.youtube_channel_url,
        spotify_profile_url: bloco.spotify_profile_url,
        spotify_playlist_url: bloco.spotify_playlist_url,
      };
    });

    return NextResponse.json({
      data: transformedBlocos,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
      metadata: {
        locale,
        city,
        filters: {
          city,
        },
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
