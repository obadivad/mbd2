import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blocoId = searchParams.get("blocoId");

    if (!blocoId) {
      return NextResponse.json(
        { error: "Bloco ID is required" },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get bloco info to check if it has Instagram URL
    const { data: bloco } = await supabase
      .from("blocos")
      .select("instagram_url, name")
      .eq("id", blocoId)
      .single();

    if (!bloco?.instagram_url) {
      return NextResponse.json({ data: [] });
    }

    // For now, return mock data since we don't have Instagram API credentials
    // In production, you would use the Instagram Basic Display API
    const mockPosts = [
      {
        id: "1",
        caption: `🎭 ${bloco.name} está se preparando para o carnaval! Vem com a gente! #carnaval #bloco #festa`,
        media_url:
          "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        media_type: "IMAGE" as const,
        permalink: bloco.instagram_url,
        timestamp: new Date().toISOString(),
      },
      {
        id: "2",
        caption: `Ensaio de hoje foi incrível! 🥁 Obrigado a todos que vieram! #ensaio #${bloco.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        media_url:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
        media_type: "IMAGE" as const,
        permalink: bloco.instagram_url,
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: "3",
        caption: `Preparativos para o grande dia! 🎪 #carnaval2024 #blocoderua`,
        media_url:
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
        media_type: "VIDEO" as const,
        permalink: bloco.instagram_url,
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
    ];

    return NextResponse.json({
      data: mockPosts,
      metadata: {
        blocoId,
        source: "mock", // Indicates this is mock data
        note: "This is sample data. In production, integrate with Instagram Basic Display API.",
      },
    });
  } catch (error) {
    console.error("Instagram API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram posts" },
      { status: 500 }
    );
  }
}

/*
TODO: Production Instagram Integration

To integrate with real Instagram data:

1. Set up Instagram Basic Display API:
   - Create Facebook App at developers.facebook.com
   - Add Instagram Basic Display product
   - Get App ID and App Secret

2. Environment variables needed:
   INSTAGRAM_APP_ID=your_app_id
   INSTAGRAM_APP_SECRET=your_app_secret

3. Implementation:
   - OAuth flow for user authorization
   - Store access tokens securely
   - Use Instagram API endpoints:
     - GET /me/media (user's media)
     - GET /{media-id} (media details)

4. Rate limiting:
   - 200 requests per hour per user
   - Implement proper caching strategy

5. Error handling:
   - Handle expired tokens
   - Graceful fallback to cached data
*/
