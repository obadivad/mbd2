// This file will be auto-generated by Supabase CLI
// For now, we'll create basic types based on our migrated schema

export interface Database {
  public: {
    Tables: {
      blocos: {
        Row: {
          id: string
          name: string
          slug: string
          short_description_pt?: string
          short_description_en?: string
          short_description_fr?: string
          short_description_es?: string
          long_description_pt?: string
          long_description_en?: string
          long_description_fr?: string
          long_description_es?: string
          founding_year?: number
          is_active: boolean
          is_draft: boolean
          primary_city_id?: string
          image_url?: string
          website_url?: string
          facebook_url?: string
          instagram_url?: string
          twitter_url?: string
          tiktok_url?: string
          youtube_channel_url?: string
          spotify_profile_url?: string
          spotify_playlist_url?: string
          deezer_url?: string
          soundcloud_url?: string
          bandcamp_url?: string
          latitude?: number
          longitude?: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          short_description_pt?: string
          short_description_en?: string
          short_description_fr?: string
          short_description_es?: string
          long_description_pt?: string
          long_description_en?: string
          long_description_fr?: string
          long_description_es?: string
          founding_year?: number
          is_active?: boolean
          is_draft?: boolean
          primary_city_id?: string
          image_url?: string
          website_url?: string
          facebook_url?: string
          instagram_url?: string
          twitter_url?: string
          tiktok_url?: string
          youtube_channel_url?: string
          spotify_profile_url?: string
          spotify_playlist_url?: string
          deezer_url?: string
          soundcloud_url?: string
          bandcamp_url?: string
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          short_description_pt?: string
          short_description_en?: string
          short_description_fr?: string
          short_description_es?: string
          long_description_pt?: string
          long_description_en?: string
          long_description_fr?: string
          long_description_es?: string
          founding_year?: number
          is_active?: boolean
          is_draft?: boolean
          primary_city_id?: string
          image_url?: string
          website_url?: string
          facebook_url?: string
          instagram_url?: string
          twitter_url?: string
          tiktok_url?: string
          youtube_channel_url?: string
          spotify_profile_url?: string
          spotify_playlist_url?: string
          deezer_url?: string
          soundcloud_url?: string
          bandcamp_url?: string
          latitude?: number
          longitude?: number
          created_at?: string
          updated_at?: string
        }
      }
      cities: {
        Row: {
          id: string
          name: string
          slug: string
          state: string
          country: string
          latitude?: number
          longitude?: number
          timezone?: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          state: string
          country?: string
          latitude?: number
          longitude?: number
          timezone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          state?: string
          country?: string
          latitude?: number
          longitude?: number
          timezone?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          bloco_id: string
          title: string
          event_type: 'parade' | 'rehearsal' | 'party' | 'workshop'
          event_status: 'scheduled' | 'cancelled' | 'postponed' | 'completed'
          description_pt?: string
          description_en?: string
          description_fr?: string
          description_es?: string
          start_datetime: string
          end_datetime?: string
          all_day: boolean
          city_id: string
          location_name?: string
          address?: string
          coordinates?: { lat: number; lon: number }
          concentration_location?: string
          concentration_coordinates?: { lat: number; lon: number }
          concentration_time?: string
          dispersal_location?: string
          dispersal_coordinates?: { lat: number; lon: number }
          dispersal_time?: string
          banner_url?: string
          external_url?: string
          external_url_text?: string
          expected_participants?: number
          ticket_required: boolean
          ticket_price?: number
          is_draft: boolean
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          bloco_id: string
          title: string
          event_type: 'parade' | 'rehearsal' | 'party' | 'workshop'
          event_status?: 'scheduled' | 'cancelled' | 'postponed' | 'completed'
          description_pt?: string
          description_en?: string
          description_fr?: string
          description_es?: string
          start_datetime: string
          end_datetime?: string
          all_day?: boolean
          city_id: string
          location_name?: string
          address?: string
          coordinates?: { lat: number; lon: number }
          concentration_location?: string
          concentration_coordinates?: { lat: number; lon: number }
          concentration_time?: string
          dispersal_location?: string
          dispersal_coordinates?: { lat: number; lon: number }
          dispersal_time?: string
          banner_url?: string
          external_url?: string
          external_url_text?: string
          expected_participants?: number
          ticket_required?: boolean
          ticket_price?: number
          is_draft?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bloco_id?: string
          title?: string
          event_type?: 'parade' | 'rehearsal' | 'party' | 'workshop'
          event_status?: 'scheduled' | 'cancelled' | 'postponed' | 'completed'
          description_pt?: string
          description_en?: string
          description_fr?: string
          description_es?: string
          start_datetime?: string
          end_datetime?: string
          all_day?: boolean
          city_id?: string
          location_name?: string
          address?: string
          coordinates?: { lat: number; lon: number }
          concentration_location?: string
          concentration_coordinates?: { lat: number; lon: number }
          concentration_time?: string
          dispersal_location?: string
          dispersal_coordinates?: { lat: number; lon: number }
          dispersal_time?: string
          banner_url?: string
          external_url?: string
          external_url_text?: string
          expected_participants?: number
          ticket_required?: boolean
          ticket_price?: number
          is_draft?: boolean
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
