import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import type { Database } from "@/types/database";

type EventType = Database["public"]["Tables"]["events"]["Row"]["event_type"];

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const city = searchParams.get("city");
    const date = searchParams.get("date"); // YYYY-MM-DD
    const eventType = searchParams.get("eventType") as EventType;
    const blocoSlug = searchParams.get("blocoSlug");
    const blocoId = searchParams.get("blocoId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const upcoming = searchParams.get("upcoming") === "true";

    // Build the query
    let query = supabase
      .from("events")
      .select(
        `
        *,
        bloco:bloco_id(
          id,
          name,
          slug,
          short_description_pt,
          short_description_en,
          short_description_fr,
          short_description_es,
          image_url,
          instagram_url,
          facebook_url,
          youtube_channel_url
        ),
        city:city_id(
          id,
          name,
          slug,
          state,
          country
        )
      `
      )
      .eq("is_cancelled", false)
      .order("start_datetime", { ascending: true });

    // Apply filters
    if (city) {
      // Filter by city slug
      query = query.eq("city.slug", city);
    }

    if (date) {
      // Filter by specific date
      const startOfDay = `${date}T00:00:00`;
      const endOfDay = `${date}T23:59:59`;
      query = query
        .gte("start_datetime", startOfDay)
        .lte("start_datetime", endOfDay);
    }

    if (eventType) {
      query = query.eq("event_type", eventType);
    }

    if (blocoSlug) {
      query = query.eq("bloco.slug", blocoSlug);
    }

    if (blocoId) {
      query = query.eq("bloco_id", blocoId);
    }

    if (upcoming) {
      // Only future events
      const now = new Date().toISOString();
      query = query.gte("start_datetime", now);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: events, error, count } = await query;

    if (error) {
      console.error("Events API error:", error);
      return Response.json(
        { error: { code: "FETCH_ERROR", message: "Failed to fetch events" } },
        { status: 500 }
      );
    }

    // Calculate pagination info
    const totalPages = count ? Math.ceil(count / limit) : 0;
    const currentPage = Math.floor(offset / limit) + 1;
    const hasNextPage = offset + limit < (count || 0);
    const hasPrevPage = offset > 0;

    return Response.json({
      data: events || [],
      pagination: {
        total: count || 0,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error("Events API error:", error);
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    const body = await request.json();

    // Validate required fields
    const { title, slug, bloco_id, city_id, event_type, start_datetime } = body;

    if (
      !title ||
      !slug ||
      !bloco_id ||
      !city_id ||
      !event_type ||
      !start_datetime
    ) {
      return Response.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required fields",
          },
        },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingEvent } = await supabase
      .from("events")
      .select("id")
      .eq("slug", slug)
      .single();

    if (existingEvent) {
      return Response.json(
        {
          error: { code: "SLUG_EXISTS", message: "Event slug already exists" },
        },
        { status: 409 }
      );
    }

    // Create the event
    const { data: event, error } = await supabase
      .from("events")
      .insert({
        title,
        slug,
        bloco_id,
        city_id,
        event_type,
        start_datetime,
        end_datetime: body.end_datetime,
        location_name: body.location_name,
        location_address: body.location_address,
        latitude: body.latitude,
        longitude: body.longitude,
        description: body.description,
        is_confirmed: body.is_confirmed ?? true,
        is_cancelled: false,
      })
      .select(
        `
        *,
        bloco:bloco_id(
          id,
          name,
          slug,
          short_description_pt,
          image_url
        ),
        city:city_id(
          id,
          name,
          slug,
          state
        )
      `
      )
      .single();

    if (error) {
      console.error("Event creation error:", error);
      return Response.json(
        { error: { code: "CREATE_ERROR", message: "Failed to create event" } },
        { status: 500 }
      );
    }

    return Response.json({ data: event }, { status: 201 });
  } catch (error) {
    console.error("Event creation error:", error);
    return Response.json(
      { error: { code: "INTERNAL_ERROR", message: "Internal server error" } },
      { status: 500 }
    );
  }
}
