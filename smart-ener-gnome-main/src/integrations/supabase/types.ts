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
      anomaly_logs: {
        Row: {
          created_at: string
          description: string
          id: string
          severity: string
          type: string
          value: number | null
          zone: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          severity: string
          type: string
          value?: number | null
          zone: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          severity?: string
          type?: string
          value?: number | null
          zone?: string
        }
        Relationships: []
      }
      automation_logs: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          status: string
          target: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          status?: string
          target: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          status?: string
          target?: string
        }
        Relationships: []
      }
      chatbot_logs: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          message: string
          role: string
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          message: string
          role: string
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          message?: string
          role?: string
        }
        Relationships: []
      }
      energy_logs: {
        Row: {
          created_at: string
          eco_mode: boolean
          hvac_load: number
          hvac_temp: number
          id: string
          lifts_load: number
          lighting: number
          optimized_energy: number | null
          parking_occupancy: number
          savings_pct: number | null
          shops_active: boolean
          total_energy: number
        }
        Insert: {
          created_at?: string
          eco_mode?: boolean
          hvac_load: number
          hvac_temp: number
          id?: string
          lifts_load?: number
          lighting: number
          optimized_energy?: number | null
          parking_occupancy: number
          savings_pct?: number | null
          shops_active: boolean
          total_energy: number
        }
        Update: {
          created_at?: string
          eco_mode?: boolean
          hvac_load?: number
          hvac_temp?: number
          id?: string
          lifts_load?: number
          lighting?: number
          optimized_energy?: number | null
          parking_occupancy?: number
          savings_pct?: number | null
          shops_active?: boolean
          total_energy?: number
        }
        Relationships: []
      }
      maintenance_logs: {
        Row: {
          created_at: string
          failure_probability: number
          health_score: number
          id: string
          notes: string | null
          system: string
          urgency: string
        }
        Insert: {
          created_at?: string
          failure_probability: number
          health_score: number
          id?: string
          notes?: string | null
          system: string
          urgency: string
        }
        Update: {
          created_at?: string
          failure_probability?: number
          health_score?: number
          id?: string
          notes?: string | null
          system?: string
          urgency?: string
        }
        Relationships: []
      }
      occupancy_logs: {
        Row: {
          created_at: string
          density: number
          floor: number
          id: string
          zone: string
        }
        Insert: {
          created_at?: string
          density: number
          floor?: number
          id?: string
          zone: string
        }
        Update: {
          created_at?: string
          density?: number
          floor?: number
          id?: string
          zone?: string
        }
        Relationships: []
      }
      sustainability_logs: {
        Row: {
          co2_saved_kg: number
          created_at: string
          esg_score: number
          id: string
          renewable_pct: number
          trees_equivalent: number
        }
        Insert: {
          co2_saved_kg: number
          created_at?: string
          esg_score: number
          id?: string
          renewable_pct: number
          trees_equivalent: number
        }
        Update: {
          co2_saved_kg?: number
          created_at?: string
          esg_score?: number
          id?: string
          renewable_pct?: number
          trees_equivalent?: number
        }
        Relationships: []
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
    Enums: {},
  },
} as const
