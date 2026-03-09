 
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
      active_sessions: {
        Row: {
          created_at: string
          device_fingerprint: string
          device_id: string
          expires_at: string
          id: string
          ip_address: unknown
          is_active: boolean
          last_activity: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          device_fingerprint: string
          device_id: string
          expires_at: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          device_fingerprint?: string
          device_id?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean
          last_activity?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      commission_accumulation_ledger: {
        Row: {
          admin_charge: number
          commission_percent: number | null
          created_at: string
          gross_commission: number
          id: string
          level: number | null
          net_commission: number
          source_id: string | null
          source_type: string
          status: Database["public"]["Enums"]["commission_status"]
          user_id: string
        }
        Insert: {
          admin_charge?: number
          commission_percent?: number | null
          created_at?: string
          gross_commission?: number
          id?: string
          level?: number | null
          net_commission?: number
          source_id?: string | null
          source_type: string
          status?: Database["public"]["Enums"]["commission_status"]
          user_id: string
        }
        Update: {
          admin_charge?: number
          commission_percent?: number | null
          created_at?: string
          gross_commission?: number
          id?: string
          level?: number | null
          net_commission?: number
          source_id?: string | null
          source_type?: string
          status?: Database["public"]["Enums"]["commission_status"]
          user_id?: string
        }
        Relationships: []
      }
      commission_ledger: {
        Row: {
          admin_fee_amount: number
          beneficiary_user_id: string
          created_at: string
          gross_amount: number
          id: string
          level: number
          net_amount: number
          rate: number
          source_id: string
          source_type: string
          source_user_id: string
          status: Database["public"]["Enums"]["commission_status"]
          updated_at: string
        }
        Insert: {
          admin_fee_amount: number
          beneficiary_user_id: string
          created_at?: string
          gross_amount: number
          id?: string
          level: number
          net_amount: number
          rate: number
          source_id: string
          source_type?: string
          source_user_id: string
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Update: {
          admin_fee_amount?: number
          beneficiary_user_id?: string
          created_at?: string
          gross_amount?: number
          id?: string
          level?: number
          net_amount?: number
          rate?: number
          source_id?: string
          source_type?: string
          source_user_id?: string
          status?: Database["public"]["Enums"]["commission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "commission_ledger_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "investment_roi_payouts"
            referencedColumns: ["id"]
          },
        ]
      }
      commission_rate_matrix: {
        Row: {
          created_at: string
          level: number
          rate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          level: number
          rate: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          level?: number
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      commission_rates: {
        Row: {
          created_at: string
          id: string
          level: number
          rank_name: string
          rate: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          level: number
          rank_name?: string
          rate: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          level?: number
          rank_name?: string
          rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      direct_target_royalty_rules: {
        Row: {
          created_at: string
          rank_name: string
          royalty_rate: number
          target_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          rank_name: string
          royalty_rate: number
          target_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          rank_name?: string
          royalty_rate?: number
          target_amount?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_verification_tokens: {
        Row: {
          created_at: string
          email: string | null
          expires_at: string
          id: string
          token: string | null
          token_hash: string
          used_at: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          expires_at: string
          id?: string
          token?: string | null
          token_hash: string
          used_at?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          token?: string | null
          token_hash?: string
          used_at?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      investment_agreements: {
        Row: {
          advocate_license: string | null
          advocate_name: string | null
          agreement_date: string | null
          agreement_number: string | null
          agreement_status: string | null
          created_at: string
          early_termination_allowed: boolean | null
          early_termination_penalty: number | null
          end_date: string | null
          id: string
          investment_id: string | null
          monthly_roi_rate: number | null
          notarization_date: string | null
          notarized_by: string | null
          principal_amount: number | null
          start_date: string | null
          total_expected_payout: number | null
          total_expected_profit: number | null
          total_months: number | null
          updated_at: string
        }
        Insert: {
          advocate_license?: string | null
          advocate_name?: string | null
          agreement_date?: string | null
          agreement_number?: string | null
          agreement_status?: string | null
          created_at?: string
          early_termination_allowed?: boolean | null
          early_termination_penalty?: number | null
          end_date?: string | null
          id?: string
          investment_id?: string | null
          monthly_roi_rate?: number | null
          notarization_date?: string | null
          notarized_by?: string | null
          principal_amount?: number | null
          start_date?: string | null
          total_expected_payout?: number | null
          total_expected_profit?: number | null
          total_months?: number | null
          updated_at?: string
        }
        Update: {
          advocate_license?: string | null
          advocate_name?: string | null
          agreement_date?: string | null
          agreement_number?: string | null
          agreement_status?: string | null
          created_at?: string
          early_termination_allowed?: boolean | null
          early_termination_penalty?: number | null
          end_date?: string | null
          id?: string
          investment_id?: string | null
          monthly_roi_rate?: number | null
          notarization_date?: string | null
          notarized_by?: string | null
          principal_amount?: number | null
          start_date?: string | null
          total_expected_payout?: number | null
          total_expected_profit?: number | null
          total_months?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_agreements_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_plans: {
        Row: {
          agreement_months: number
          code: string
          created_at: string
          is_active: boolean
          roi_rate: number
          updated_at: string
        }
        Insert: {
          agreement_months?: number
          code: string
          created_at?: string
          is_active?: boolean
          roi_rate?: number
          updated_at?: string
        }
        Update: {
          agreement_months?: number
          code?: string
          created_at?: string
          is_active?: boolean
          roi_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      investment_roi_payouts: {
        Row: {
          created_at: string
          due_at: string | null
          id: string
          investment_id: string
          investor_user_id: string
          paid_at: string | null
          period_month: string
          roi_amount: number
          status: Database["public"]["Enums"]["roi_payout_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          due_at?: string | null
          id?: string
          investment_id: string
          investor_user_id: string
          paid_at?: string | null
          period_month: string
          roi_amount: number
          status?: Database["public"]["Enums"]["roi_payout_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          due_at?: string | null
          id?: string
          investment_id?: string
          investor_user_id?: string
          paid_at?: string | null
          period_month?: string
          roi_amount?: number
          status?: Database["public"]["Enums"]["roi_payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "investment_roi_payouts_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          agreement_months: number
          amount: number | null
          created_at: string
          id: string
          investment_amount: number
          investment_date: string
          payment_status: string | null
          plan_code: string | null
          roi_rate: number
          status: Database["public"]["Enums"]["investment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          agreement_months?: number
          amount?: number | null
          created_at?: string
          id?: string
          investment_amount: number
          investment_date?: string
          payment_status?: string | null
          plan_code?: string | null
          roi_rate?: number
          status?: Database["public"]["Enums"]["investment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          agreement_months?: number
          amount?: number | null
          created_at?: string
          id?: string
          investment_amount?: number
          investment_date?: string
          payment_status?: string | null
          plan_code?: string | null
          roi_rate?: number
          status?: Database["public"]["Enums"]["investment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "investments_plan_code_fkey"
            columns: ["plan_code"]
            isOneToOne: false
            referencedRelation: "investment_plans"
            referencedColumns: ["code"]
          },
        ]
      }
      investor_network: {
        Row: {
          created_at: string
          investment_amount: number
          investor_level: number
          is_team_leader: boolean
          referral_code: string | null
          sponsor_id: string | null
          total_team_business: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          investment_amount?: number
          investor_level?: number
          is_team_leader?: boolean
          referral_code?: string | null
          sponsor_id?: string | null
          total_team_business?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          investment_amount?: number
          investor_level?: number
          is_team_leader?: boolean
          referral_code?: string | null
          sponsor_id?: string | null
          total_team_business?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      investor_ranks: {
        Row: {
          business_target: number
          created_at: string
          rank_name: string
          royalty_rate: number
          updated_at: string
        }
        Insert: {
          business_target: number
          created_at?: string
          rank_name: string
          royalty_rate: number
          updated_at?: string
        }
        Update: {
          business_target?: number
          created_at?: string
          rank_name?: string
          royalty_rate?: number
          updated_at?: string
        }
        Relationships: []
      }
      kyc_documents: {
        Row: {
          created_at: string
          document_hash: string | null
          document_type: string
          document_url: string
          id: string
          rejection_reason: string | null
          updated_at: string
          user_id: string
          verification_status: Database["public"]["Enums"]["kyc_status"]
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_hash?: string | null
          document_type: string
          document_url: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string
          user_id: string
          verification_status?: Database["public"]["Enums"]["kyc_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_hash?: string | null
          document_type?: string
          document_url?: string
          id?: string
          rejection_reason?: string | null
          updated_at?: string
          user_id?: string
          verification_status?: Database["public"]["Enums"]["kyc_status"]
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      login_history: {
        Row: {
          created_at: string
          id: string
          ip_address: unknown
          status: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: unknown
          status: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: unknown
          status?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          id: string
          status: Database["public"]["Enums"]["order_status"]
          total_amount: number
          updated_at: string
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["order_status"]
          total_amount?: number
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_storage: {
        Row: {
          attempts: number
          created_at: string
          expires_at: string
          id: string
          max_attempts: number
          otp_hash: string
          otp_type: string
          user_id: string
          verified: boolean
          verified_at: string | null
        }
        Insert: {
          attempts?: number
          created_at?: string
          expires_at: string
          id?: string
          max_attempts?: number
          otp_hash: string
          otp_type: string
          user_id: string
          verified?: boolean
          verified_at?: string | null
        }
        Update: {
          attempts?: number
          created_at?: string
          expires_at?: string
          id?: string
          max_attempts?: number
          otp_hash?: string
          otp_type?: string
          user_id?: string
          verified?: boolean
          verified_at?: string | null
        }
        Relationships: []
      }
      password_reset_tokens: {
        Row: {
          created_at: string
          email: string | null
          expires_at: string
          id: string
          token_hash: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          expires_at: string
          id?: string
          token_hash: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          expires_at?: string
          id?: string
          token_hash?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payout_history: {
        Row: {
          amount: number
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          status: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      payouts: {
        Row: {
          created_at: string
          due_at: string | null
          fees_amount: number
          gross_amount: number
          id: string
          net_amount: number
          paid_at: string | null
          payout_type: string
          reference_id: string | null
          status: Database["public"]["Enums"]["payout_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_at?: string | null
          fees_amount?: number
          gross_amount: number
          id?: string
          net_amount: number
          paid_at?: string | null
          payout_type: string
          reference_id?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_at?: string | null
          fees_amount?: number
          gross_amount?: number
          id?: string
          net_amount?: number
          paid_at?: string | null
          payout_type?: string
          reference_id?: string | null
          status?: Database["public"]["Enums"]["payout_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      phonepe_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          merchant_transaction_id: string
          payload: Json | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          merchant_transaction_id: string
          payload?: Json | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          merchant_transaction_id?: string
          payload?: Json | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      platform_integrations: {
        Row: {
          access_token: string | null
          api_key: string | null
          api_secret: string | null
          created_at: string
          id: string
          platform_name: string
          platform_store_id: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          id?: string
          platform_name: string
          platform_store_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          created_at?: string
          id?: string
          platform_name?: string
          platform_store_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      product_aggregated_reviews: {
        Row: {
          id: string
          product_id: string | null
          rating_avg: number | null
          rating_count: number
          updated_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          rating_avg?: number | null
          rating_count?: number
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          rating_avg?: number | null
          rating_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_sync_logs: {
        Row: {
          conflicts_detected: number
          created_at: string
          details: Json | null
          id: string
          integration_id: string | null
          products_fetched: number
          status: string
        }
        Insert: {
          conflicts_detected?: number
          created_at?: string
          details?: Json | null
          id?: string
          integration_id?: string | null
          products_fetched?: number
          status?: string
        }
        Update: {
          conflicts_detected?: number
          created_at?: string
          details?: Json | null
          id?: string
          integration_id?: string | null
          products_fetched?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sync_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "platform_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sync_mapping: {
        Row: {
          created_at: string
          id: string
          integration_id: string
          local_product_id: string | null
          platform_product_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          integration_id: string
          local_product_id?: string | null
          platform_product_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          integration_id?: string
          local_product_id?: string | null
          platform_product_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_sync_mapping_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "platform_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          aadhaar_number: string | null
          account_number: string | null
          address: string | null
          avatar_url: string | null
          bank_name: string | null
          bank_verified: boolean
          bank_verified_at: string | null
          city: string | null
          contact_verified: boolean
          contact_verified_at: string | null
          created_at: string | null
          email: string | null
          email_verified: boolean
          email_verified_at: string | null
          first_name: string | null
          franchise_location: string | null
          full_name: string | null
          id: string
          ifsc_code: string | null
          investment_amount: number | null
          is_active: boolean
          join_date: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          last_name: string | null
          middle_name: string | null
          onboarding_completed: boolean
          pan_number: string | null
          phone: string | null
          pincode: string | null
          rbac_level: number
          referral_code: string | null
          referred_by: string | null
          role: string
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          two_factor_enabled: boolean
          updated_at: string | null
          wallet_balance: number
        }
        Insert: {
          aadhaar_number?: string | null
          account_number?: string | null
          address?: string | null
          avatar_url?: string | null
          bank_name?: string | null
          bank_verified?: boolean
          bank_verified_at?: string | null
          city?: string | null
          contact_verified?: boolean
          contact_verified_at?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          first_name?: string | null
          franchise_location?: string | null
          full_name?: string | null
          id: string
          ifsc_code?: string | null
          investment_amount?: number | null
          is_active?: boolean
          join_date?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_name?: string | null
          middle_name?: string | null
          onboarding_completed?: boolean
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          rbac_level?: number
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          two_factor_enabled?: boolean
          updated_at?: string | null
          wallet_balance?: number
        }
        Update: {
          aadhaar_number?: string | null
          account_number?: string | null
          address?: string | null
          avatar_url?: string | null
          bank_name?: string | null
          bank_verified?: boolean
          bank_verified_at?: string | null
          city?: string | null
          contact_verified?: boolean
          contact_verified_at?: string | null
          created_at?: string | null
          email?: string | null
          email_verified?: boolean
          email_verified_at?: string | null
          first_name?: string | null
          franchise_location?: string | null
          full_name?: string | null
          id?: string
          ifsc_code?: string | null
          investment_amount?: number | null
          is_active?: boolean
          join_date?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          last_name?: string | null
          middle_name?: string | null
          onboarding_completed?: boolean
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          rbac_level?: number
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          two_factor_enabled?: boolean
          updated_at?: string | null
          wallet_balance?: number
        }
        Relationships: []
      }
      rank_change_history: {
        Row: {
          changed_at: string
          id: string
          new_rank: string
          previous_rank: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string
          id?: string
          new_rank: string
          previous_rank?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string
          id?: string
          new_rank?: string
          previous_rank?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referral_tree: {
        Row: {
          created_at: string
          placement_parent_id: string | null
          placement_position: number | null
          sponsor_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          placement_parent_id?: string | null
          placement_position?: number | null
          sponsor_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          placement_parent_id?: string | null
          placement_position?: number | null
          sponsor_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      returns: {
        Row: {
          amount: number
          created_at: string
          id: string
          order_id: string | null
          reason: string | null
          status: Database["public"]["Enums"]["return_status"]
          updated_at: string
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["return_status"]
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          order_id?: string | null
          reason?: string | null
          status?: Database["public"]["Enums"]["return_status"]
          updated_at?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_order_id_fkey"
            columns: ["order_id"]
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
      security_policies: {
        Row: {
          condition: Json | null
          created_at: string
          id: string
          is_active: boolean
          policy_key: string
          policy_name: string | null
          policy_value: Json
          updated_at: string
        }
        Insert: {
          condition?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          policy_key: string
          policy_name?: string | null
          policy_value: Json
          updated_at?: string
        }
        Update: {
          condition?: Json | null
          created_at?: string
          id?: string
          is_active?: boolean
          policy_key?: string
          policy_name?: string | null
          policy_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          amount: number
          created_at: string
          id: string
          period_end: string | null
          period_start: string | null
          status: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          period_end?: string | null
          period_start?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string | null
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
      trusted_devices: {
        Row: {
          browser_name: string | null
          created_at: string
          device_fingerprint: string
          device_id: string
          device_name: string | null
          id: string
          is_trusted: boolean
          last_seen: string | null
          last_used_at: string | null
          os_name: string | null
          user_id: string
        }
        Insert: {
          browser_name?: string | null
          created_at?: string
          device_fingerprint: string
          device_id: string
          device_name?: string | null
          id?: string
          is_trusted?: boolean
          last_seen?: string | null
          last_used_at?: string | null
          os_name?: string | null
          user_id: string
        }
        Update: {
          browser_name?: string | null
          created_at?: string
          device_fingerprint?: string
          device_id?: string
          device_name?: string | null
          id?: string
          is_trusted?: boolean
          last_seen?: string | null
          last_used_at?: string | null
          os_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_2fa: {
        Row: {
          backup_codes: Json | null
          created_at: string
          enabled: boolean
          secret: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          backup_codes?: Json | null
          created_at?: string
          enabled?: boolean
          secret?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          backup_codes?: Json | null
          created_at?: string
          enabled?: boolean
          secret?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_attributes: {
        Row: {
          attributes: Json
          created_at: string
          investment_amount: number | null
          investment_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          attributes?: Json
          created_at?: string
          investment_amount?: number | null
          investment_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          attributes?: Json
          created_at?: string
          investment_amount?: number | null
          investment_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_business_volume: {
        Row: {
          current_rank: string
          last_rank_evaluation: string | null
          total_personal_business: number
          total_team_business: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_rank?: string
          last_rank_evaluation?: string | null
          total_personal_business?: number
          total_team_business?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_rank?: string
          last_rank_evaluation?: string | null
          total_personal_business?: number
          total_team_business?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          aadhaar_number: string | null
          address: string | null
          city: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          pan_number: string | null
          phone: string | null
          pincode: string | null
          referral_code: string | null
          referred_by: string | null
          role: string
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string
          wallet_balance: number
        }
        Insert: {
          aadhaar_number?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          wallet_balance?: number
        }
        Update: {
          aadhaar_number?: string | null
          address?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          pan_number?: string | null
          phone?: string | null
          pincode?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          investment_amount: number
          join_date: string | null
          kyc_status: Database["public"]["Enums"]["kyc_status"]
          phone: string | null
          rbac_level: number
          referral_code: string | null
          referred_by: string | null
          role: string
          state: string | null
          status: Database["public"]["Enums"]["user_status"]
          two_factor_enabled: boolean
          updated_at: string
          wallet_balance: number
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          investment_amount?: number
          join_date?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          phone?: string | null
          rbac_level?: number
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          two_factor_enabled?: boolean
          updated_at?: string
          wallet_balance?: number
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          investment_amount?: number
          join_date?: string | null
          kyc_status?: Database["public"]["Enums"]["kyc_status"]
          phone?: string | null
          rbac_level?: number
          referral_code?: string | null
          referred_by?: string | null
          role?: string
          state?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          two_factor_enabled?: boolean
          updated_at?: string
          wallet_balance?: number
        }
        Relationships: []
      }
      vendor_products: {
        Row: {
          created_at: string
          id: string
          product_name: string
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_name: string
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_name?: string
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          created_at: string
          id: string
          platform_fee: number
          revenue_share: number
          updated_at: string
          user_id: string
          vendor_status: Database["public"]["Enums"]["vendor_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          platform_fee?: number
          revenue_share?: number
          updated_at?: string
          user_id: string
          vendor_status?: Database["public"]["Enums"]["vendor_status"]
        }
        Update: {
          created_at?: string
          id?: string
          platform_fee?: number
          revenue_share?: number
          updated_at?: string
          user_id?: string
          vendor_status?: Database["public"]["Enums"]["vendor_status"]
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          direction: string
          id: string
          source_id: string | null
          source_type: string | null
          txn_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          direction: string
          id?: string
          source_id?: string | null
          source_type?: string | null
          txn_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          direction?: string
          id?: string
          source_id?: string | null
          source_type?: string | null
          txn_type?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_event_queue: {
        Row: {
          created_at: string
          event_type: string
          id: string
          last_error: string | null
          next_retry_at: string | null
          payload: Json
          retry_count: number
          status: Database["public"]["Enums"]["webhook_event_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          last_error?: string | null
          next_retry_at?: string | null
          payload: Json
          retry_count?: number
          status?: Database["public"]["Enums"]["webhook_event_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          last_error?: string | null
          next_retry_at?: string | null
          payload?: Json
          retry_count?: number
          status?: Database["public"]["Enums"]["webhook_event_status"]
          updated_at?: string
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          amount: number
          created_at: string
          id: string
          processed_at: string | null
          requested_at: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          processed_at?: string | null
          requested_at?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_upgrade_rank: {
        Args: { investor_user_id: string }
        Returns: boolean
      }
      get_network_stats: {
        Args: { p_user_id: string }
        Returns: {
          level_1_count: number
          level_2_count: number
          level_3_count: number
          level_4_count: number
          level_5_count: number
          level_6_count: number
          rank: string
          rank_progress: number
          total_commissions_earned: number
          total_network_investment: number
          total_network_size: number
        }[]
      }
      get_network_tree: {
        Args: { p_max_level?: number; p_user_id: string }
        Returns: {
          direct_referrals: number
          email: string
          full_name: string
          investment_total: number
          joined_at: string
          level: number
          user_id: string
        }[]
      }
      get_visible_network_commission_leaderboard_v1: {
        Args: { p_days: number; p_include_cancelled?: boolean }
        Returns: {
          admin_charge: number
          full_name: string
          gross_commission: number
          items_count: number
          net_commission: number
          user_id: string
        }[]
      }
      has_any_role: { Args: { required_roles: string[] }; Returns: boolean }
      is_admin: { Args: never; Returns: boolean }
      is_staff: { Args: never; Returns: boolean }
      process_daily_payouts: { Args: never; Returns: Json }
      recalculate_user_rank: {
        Args: { p_user_auth_id: string }
        Returns: {
          current_rank: string
          previous_rank: string
          qualifying_volume: number
        }[]
      }
      record_sync_result: {
        Args: {
          p_error_message: string
          p_integration_id: string
          p_products_created: number
          p_products_failed: number
          p_products_fetched: number
          p_products_updated: number
          p_status: string
          p_sync_type: string
        }
        Returns: Json
      }
      resolve_referrer_user_id_v1: { Args: { p_code: string }; Returns: string }
    }
    Enums: {
      commission_status: "ACCRUED" | "APPROVED" | "PAID" | "REJECTED"
      investment_status: "ACTIVE" | "COMPLETED" | "TERMINATED"
      kyc_status: "PENDING" | "VERIFIED" | "REJECTED"
      order_status:
        | "PENDING"
        | "CONFIRMED"
        | "SHIPPED"
        | "DELIVERED"
        | "CANCELLED"
      payout_status: "DUE" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED"
      return_status:
        | "REQUESTED"
        | "APPROVED"
        | "REJECTED"
        | "PICKED"
        | "REFUNDED"
        | "CLOSED"
      roi_payout_status: "DUE" | "PROCESSING" | "PAID"
      user_status: "RED" | "GREEN"
      vendor_status: "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED"
      webhook_event_status:
        | "QUEUED"
        | "PROCESSING"
        | "COMPLETED"
        | "FAILED"
        | "RETRY_SCHEDULED"
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
      commission_status: ["ACCRUED", "APPROVED", "PAID", "REJECTED"],
      investment_status: ["ACTIVE", "COMPLETED", "TERMINATED"],
      kyc_status: ["PENDING", "VERIFIED", "REJECTED"],
      order_status: [
        "PENDING",
        "CONFIRMED",
        "SHIPPED",
        "DELIVERED",
        "CANCELLED",
      ],
      payout_status: ["DUE", "PROCESSING", "PAID", "FAILED", "CANCELLED"],
      return_status: [
        "REQUESTED",
        "APPROVED",
        "REJECTED",
        "PICKED",
        "REFUNDED",
        "CLOSED",
      ],
      roi_payout_status: ["DUE", "PROCESSING", "PAID"],
      user_status: ["RED", "GREEN"],
      vendor_status: ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"],
      webhook_event_status: [
        "QUEUED",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
        "RETRY_SCHEDULED",
      ],
    },
  },
} as const
