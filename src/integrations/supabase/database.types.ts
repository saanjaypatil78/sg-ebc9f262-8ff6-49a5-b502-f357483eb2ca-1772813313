 
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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      file_uploads: {
        Row: {
          created_at: string | null
          errors: Json | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          processing_status: string | null
          records_processed: number | null
          upload_category: string
          uploaded_by: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          errors?: Json | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          processing_status?: string | null
          records_processed?: number | null
          upload_category: string
          uploaded_by: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          errors?: Json | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          processing_status?: string | null
          records_processed?: number | null
          upload_category?: string
          uploaded_by?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_uploads_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          actual_delivery_date: string | null
          client_id: string
          commission_amount: number | null
          created_at: string | null
          expected_delivery_date: string | null
          id: string
          is_on_time: boolean | null
          notes: string | null
          order_number: string
          packaging_verified: boolean | null
          product_id: string
          qr_code: string | null
          qr_validated: boolean | null
          quantity: number
          shipping_address: Json
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          tracking_number: string | null
          unit_price: number
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          actual_delivery_date?: string | null
          client_id: string
          commission_amount?: number | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          is_on_time?: boolean | null
          notes?: string | null
          order_number: string
          packaging_verified?: boolean | null
          product_id: string
          qr_code?: string | null
          qr_validated?: boolean | null
          quantity?: number
          shipping_address: Json
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          tracking_number?: string | null
          unit_price: number
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          actual_delivery_date?: string | null
          client_id?: string
          commission_amount?: number | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          is_on_time?: boolean | null
          notes?: string | null
          order_number?: string
          packaging_verified?: boolean | null
          product_id?: string
          qr_code?: string | null
          qr_validated?: boolean | null
          quantity?: number
          shipping_address?: Json
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          tracking_number?: string | null
          unit_price?: number
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      penalties: {
        Row: {
          amount: number
          applied_at: string | null
          created_at: string | null
          created_by: string | null
          id: string
          reason: string
          settlement_id: string | null
          vendor_id: string
        }
        Insert: {
          amount: number
          applied_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason: string
          settlement_id?: string | null
          vendor_id: string
        }
        Update: {
          amount?: number
          applied_at?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          reason?: string
          settlement_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "penalties_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "penalties_settlement_id_fkey"
            columns: ["settlement_id"]
            isOneToOne: false
            referencedRelation: "settlements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "penalties_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category: string | null
          cost_price: number | null
          created_at: string | null
          description: string | null
          id: string
          images: Json | null
          is_active: boolean | null
          name: string
          price: number
          sku: string
          specifications: Json | null
          stock_quantity: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name: string
          price: number
          sku: string
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          category?: string | null
          cost_price?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          images?: Json | null
          is_active?: boolean | null
          name?: string
          price?: number
          sku?: string
          specifications?: Json | null
          stock_quantity?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhaar_number: string | null
          account_holder_name: string | null
          account_number: string | null
          address: Json | null
          avatar_url: string | null
          bank_details: Json | null
          bank_name: string | null
          business_registration: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          email: string | null
          franchise_location: string | null
          franchise_type: string | null
          full_name: string | null
          id: string
          ifsc_code: string | null
          investment_amount: number | null
          investment_tier: string | null
          is_active: boolean | null
          kyc_status: string | null
          onboarding_completed: boolean | null
          pan_number: string | null
          phone: string | null
          pincode: string | null
          referral_code: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          state: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          aadhaar_number?: string | null
          account_holder_name?: string | null
          account_number?: string | null
          address?: Json | null
          avatar_url?: string | null
          bank_details?: Json | null
          bank_name?: string | null
          business_registration?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          franchise_location?: string | null
          franchise_type?: string | null
          full_name?: string | null
          id: string
          ifsc_code?: string | null
          investment_amount?: number | null
          investment_tier?: string | null
          is_active?: boolean | null
          kyc_status?: string | null
          onboarding_completed?: boolean | null
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          referral_code?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          aadhaar_number?: string | null
          account_holder_name?: string | null
          account_number?: string | null
          address?: Json | null
          avatar_url?: string | null
          bank_details?: Json | null
          bank_name?: string | null
          business_registration?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string | null
          franchise_location?: string | null
          franchise_type?: string | null
          full_name?: string | null
          id?: string
          ifsc_code?: string | null
          investment_amount?: number | null
          investment_tier?: string | null
          is_active?: boolean | null
          kyc_status?: string | null
          onboarding_completed?: boolean | null
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          referral_code?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      returns: {
        Row: {
          admin_notes: string | null
          approved_at: string | null
          approved_by: string | null
          client_id: string
          created_at: string | null
          id: string
          images: Json | null
          is_within_limit: boolean | null
          order_id: string
          reason: string
          replacement_order_id: string | null
          resolved_at: string | null
          return_number: string
          status: Database["public"]["Enums"]["return_status"] | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          images?: Json | null
          is_within_limit?: boolean | null
          order_id: string
          reason: string
          replacement_order_id?: string | null
          resolved_at?: string | null
          return_number: string
          status?: Database["public"]["Enums"]["return_status"] | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          admin_notes?: string | null
          approved_at?: string | null
          approved_by?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          images?: Json | null
          is_within_limit?: boolean | null
          order_id?: string
          reason?: string
          replacement_order_id?: string | null
          resolved_at?: string | null
          return_number?: string
          status?: Database["public"]["Enums"]["return_status"] | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "returns_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_replacement_order_id_fkey"
            columns: ["replacement_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      settlements: {
        Row: {
          commission_amount: number | null
          created_at: string | null
          details: Json | null
          id: string
          net_payout: number | null
          other_deductions: number | null
          payment_date: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          penalty_amount: number | null
          period_end: string
          period_start: string
          return_count: number | null
          return_penalty: number | null
          settlement_number: string
          sla_penalty: number | null
          total_orders: number | null
          total_sales: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          commission_amount?: number | null
          created_at?: string | null
          details?: Json | null
          id?: string
          net_payout?: number | null
          other_deductions?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          penalty_amount?: number | null
          period_end: string
          period_start: string
          return_count?: number | null
          return_penalty?: number | null
          settlement_number: string
          sla_penalty?: number | null
          total_orders?: number | null
          total_sales?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          commission_amount?: number | null
          created_at?: string | null
          details?: Json | null
          id?: string
          net_payout?: number | null
          other_deductions?: number | null
          payment_date?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          penalty_amount?: number | null
          period_end?: string
          period_start?: string
          return_count?: number | null
          return_penalty?: number | null
          settlement_number?: string
          sla_penalty?: number | null
          total_orders?: number | null
          total_sales?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "settlements_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_performance_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          late_deliveries: number | null
          on_time_deliveries: number | null
          on_time_rate: number | null
          return_rate: number | null
          returns_count: number | null
          total_orders: number | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          late_deliveries?: number | null
          on_time_deliveries?: number | null
          on_time_rate?: number | null
          return_rate?: number | null
          returns_count?: number | null
          total_orders?: number | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          late_deliveries?: number | null
          on_time_deliveries?: number | null
          on_time_rate?: number | null
          return_rate?: number | null
          returns_count?: number | null
          total_orders?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_performance_logs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          assigned_bdm: string | null
          commission_rate: number | null
          created_at: string | null
          id: string
          on_time_deliveries: number | null
          onboarding_completed: boolean | null
          onboarding_step: Database["public"]["Enums"]["onboarding_step"] | null
          performance_score: number | null
          rating: number | null
          return_limit: number | null
          sla_agreement_date: string | null
          sla_agreement_signed: boolean | null
          status: Database["public"]["Enums"]["vendor_status"] | null
          total_orders: number | null
          total_returns: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_bdm?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          on_time_deliveries?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?:
            | Database["public"]["Enums"]["onboarding_step"]
            | null
          performance_score?: number | null
          rating?: number | null
          return_limit?: number | null
          sla_agreement_date?: string | null
          sla_agreement_signed?: boolean | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          total_orders?: number | null
          total_returns?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_bdm?: string | null
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          on_time_deliveries?: number | null
          onboarding_completed?: boolean | null
          onboarding_step?:
            | Database["public"]["Enums"]["onboarding_step"]
            | null
          performance_score?: number | null
          rating?: number | null
          return_limit?: number | null
          sla_agreement_date?: string | null
          sla_agreement_signed?: boolean | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          total_orders?: number | null
          total_returns?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_assigned_bdm_fkey"
            columns: ["assigned_bdm"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: { Args: never; Returns: string }
      generate_return_number: { Args: never; Returns: string }
      generate_settlement_number: { Args: never; Returns: string }
    }
    Enums: {
      onboarding_step:
        | "qualification"
        | "documentation"
        | "sla_agreement"
        | "integration"
        | "training"
        | "pilot"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "processing" | "completed" | "failed"
      return_status:
        | "requested"
        | "approved"
        | "rejected"
        | "replacement_shipped"
        | "completed"
      user_role:
        | "client"
        | "vendor"
        | "admin"
        | "bdm"
        | "investor"
        | "franchise_partner"
        | "super_admin"
      vendor_status: "pending" | "active" | "suspended" | "rejected"
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
      onboarding_step: [
        "qualification",
        "documentation",
        "sla_agreement",
        "integration",
        "training",
        "pilot",
      ],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "processing", "completed", "failed"],
      return_status: [
        "requested",
        "approved",
        "rejected",
        "replacement_shipped",
        "completed",
      ],
      user_role: [
        "client",
        "vendor",
        "admin",
        "bdm",
        "investor",
        "franchise_partner",
        "super_admin",
      ],
      vendor_status: ["pending", "active", "suspended", "rejected"],
    },
  },
} as const
