export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          body_en: string
          body_jp: string
          created_at: string
          id: string
          is_active: boolean
          position: number
          title_en: string
          title_jp: string
          updated_at: string
        }
        Insert: {
          body_en?: string
          body_jp?: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          title_en?: string
          title_jp?: string
          updated_at?: string
        }
        Update: {
          body_en?: string
          body_jp?: string
          created_at?: string
          id?: string
          is_active?: boolean
          position?: number
          title_en?: string
          title_jp?: string
          updated_at?: string
        }
        Relationships: []
      }
      community_messages: {
        Row: {
          body: string
          created_at: string
          display_name: string
          id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          display_name: string
          id?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          display_name?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          body: string
          created_at: string
          id: string
          is_archived: boolean
          is_read: boolean
          role_applied: string | null
          sender_email: string
          sender_name: string
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_archived?: boolean
          is_read?: boolean
          role_applied?: string | null
          sender_email: string
          sender_name: string
          subject?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_archived?: boolean
          is_read?: boolean
          role_applied?: string | null
          sender_email?: string
          sender_name?: string
          subject?: string
        }
        Relationships: []
      }
      game_players: {
        Row: {
          created_at: string
          email: string
          id: string
          player_name: string
          score: number
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          player_name: string
          score?: number
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          player_name?: string
          score?: number
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string | null
          download_url: string | null
          id: string
          image_url: string | null
          owner_id: string
          price_cents: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          download_url?: string | null
          id?: string
          image_url?: string | null
          owner_id: string
          price_cents?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          download_url?: string | null
          id?: string
          image_url?: string | null
          owner_id?: string
          price_cents?: number
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      radio_tracks: {
        Row: {
          artist_name: string | null
          artist_official_url: string | null
          artist_url: string | null
          created_at: string
          genre: string
          id: string
          mood: string
          notes: string | null
          position: number
          title: string
          youtube_id: string
        }
        Insert: {
          artist_name?: string | null
          artist_official_url?: string | null
          artist_url?: string | null
          created_at?: string
          genre?: string
          id?: string
          mood?: string
          notes?: string | null
          position?: number
          title: string
          youtube_id: string
        }
        Update: {
          artist_name?: string | null
          artist_official_url?: string | null
          artist_url?: string | null
          created_at?: string
          genre?: string
          id?: string
          mood?: string
          notes?: string | null
          position?: number
          title?: string
          youtube_id?: string
        }
        Relationships: []
      }
      realtime_channel_access: {
        Row: {
          created_at: string
          id: string
          is_public: boolean
          role: Database["public"]["Enums"]["app_role"] | null
          topic: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_public?: boolean
          role?: Database["public"]["Enums"]["app_role"] | null
          topic: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_public?: boolean
          role?: Database["public"]["Enums"]["app_role"] | null
          topic?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      products_public: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string | null
          image_url: string | null
          owner_id: string | null
          price_cents: number | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          owner_id?: string | null
          price_cents?: number | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string | null
          image_url?: string | null
          owner_id?: string | null
          price_cents?: number | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      can_access_channel: {
        Args: { _topic: string; _user_id: string }
        Returns: boolean
      }
      get_product_download_url: {
        Args: { _product_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      list_products: {
        Args: never
        Returns: {
          category: string
          created_at: string
          description: string
          id: string
          image_url: string
          owner_id: string
          price_cents: number
          title: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
