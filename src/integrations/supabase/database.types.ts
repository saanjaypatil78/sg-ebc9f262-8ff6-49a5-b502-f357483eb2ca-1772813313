/* eslint-disable @typescript-eslint/no-empty-object-type */
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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          entity: string
          entity_id: string | null
          id: string
          ip_address: unknown
          new_value: Json | null
          old_value: Json | null
          rbac_decision: string | null
          rbac_metadata: Json | null
          rbac_reason: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          entity: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
          rbac_decision?: string | null
          rbac_metadata?: Json | null
          rbac_reason?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          entity?: string
          entity_id?: string | null
          id?: string
          ip_address?: unknown
          new_value?: Json | null
          old_value?: Json | null
          rbac_decision?: string | null
          rbac_metadata?: Json | null
          rbac_reason?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      commission_accumulation_ledger: {
        Row: {
          admin_charge: number | null
          commission_level: number | null
          commission_rate: number | null
          commission_type: string
          created_at: string | null
          gross_commission: number
          id: string
          net_commission: number
          payout_batch_id: string | null
          processed_at: string | null
          referral_user_id: string | null
          royalty_bonus: number | null
          source_amount: number | null
          source_investment_id: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          admin_charge?: number | null
          commission_level?: number | null
          commission_rate?: number | null
          commission_type: string
          created_at?: string | null
          gross_commission: number
          id?: string
          net_commission: number
          payout_batch_id?: string | null
          processed_at?: string | null
          referral_user_id?: string | null
          royalty_bonus?: number | null
          source_amount?: number | null
          source_investment_id?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          admin_charge?: number | null
          commission_level?: number | null
          commission_rate?: number | null
          commission_type?: string
          created_at?: string | null
          gross_commission?: number
          id?: string
          net_commission?: number
          payout_batch_id?: string | null
          processed_at?: string | null
          referral_user_id?: string | null
          royalty_bonus?: number | null
          source_amount?: number | null
          source_investment_id?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_payout_accumulation: {
        Row: {
          accumulated_items: Json | null
          created_at: string | null
          deductions: number | null
          gross_amount: number
          id: string
          net_amount: number
          payout_date: string
          payout_type: string
          processed_at: string | null
          status: string | null
          transaction_reference: string | null
          user_id: string
        }
        Insert: {
          accumulated_items?: Json | null
          created_at?: string | null
          deductions?: number | null
          gross_amount: number
          id?: string
          net_amount: number
          payout_date: string
          payout_type: string
          processed_at?: string | null
          status?: string | null
          transaction_reference?: string | null
          user_id: string
        }
        Update: {
          accumulated_items?: Json | null
          created_at?: string | null
          deductions?: number | null
          gross_amount?: number
          id?: string
          net_amount?: number
          payout_date?: string
          payout_type?: string
          processed_at?: string | null
          status?: string | null
          transaction_reference?: string | null
          user_id?: string
        }
        Relationships: []
      }
      franchise_partners: {
        Row: {
          commission_earned: number | null
          created_at: string | null
          franchise_fee: number | null
          id: string
          state: string
          status: string | null
          territory: string | null
          total_investment: number | null
          total_members: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          commission_earned?: number | null
          created_at?: string | null
          franchise_fee?: number | null
          id?: string
          state: string
          status?: string | null
          territory?: string | null
          total_investment?: number | null
          total_members?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          commission_earned?: number | null
          created_at?: string | null
          franchise_fee?: number | null
          id?: string
          state?: string
          status?: string | null
          territory?: string | null
          total_investment?: number | null
          total_members?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "franchise_partners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      fundraising_capital: {
        Row: {
          current_amount: number | null
          id: string
          percentage: number | null
          target_amount: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          current_amount?: number | null
          id?: string
          percentage?: number | null
          target_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          current_amount?: number | null
          id?: string
          percentage?: number | null
          target_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      google_trends_tracking: {
        Row: {
          competition_level: string | null
          created_at: string | null
          data_timestamp: string
          growth_rate: number | null
          id: string
          product_id: string | null
          search_volume: number | null
          trend_keyword: string
          trend_score: number | null
        }
        Insert: {
          competition_level?: string | null
          created_at?: string | null
          data_timestamp: string
          growth_rate?: number | null
          id?: string
          product_id?: string | null
          search_volume?: number | null
          trend_keyword: string
          trend_score?: number | null
        }
        Update: {
          competition_level?: string | null
          created_at?: string | null
          data_timestamp?: string
          growth_rate?: number | null
          id?: string
          product_id?: string | null
          search_volume?: number | null
          trend_keyword?: string
          trend_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "google_trends_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vendor_products"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          amount: number
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          first_payout_amount: number | null
          first_payout_date: string | null
          id: string
          is_first_payout_done: boolean | null
          monthly_payout: number | null
          next_payout_date: string | null
          payment_method: string | null
          payment_status: string | null
          payout_cycle_day: number | null
          roi_percentage: number | null
          total_payouts_made: number | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          first_payout_amount?: number | null
          first_payout_date?: string | null
          id?: string
          is_first_payout_done?: boolean | null
          monthly_payout?: number | null
          next_payout_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payout_cycle_day?: number | null
          roi_percentage?: number | null
          total_payouts_made?: number | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          first_payout_amount?: number | null
          first_payout_date?: string | null
          id?: string
          is_first_payout_done?: boolean | null
          monthly_payout?: number | null
          next_payout_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          payout_cycle_day?: number | null
          roi_percentage?: number | null
          total_payouts_made?: number | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      kyc_documents: {
        Row: {
          created_at: string | null
          document_hash: string
          document_type: string
          document_url: string
          expiry_date: string | null
          id: string
          rejection_reason: string | null
          updated_at: string | null
          user_id: string
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_hash: string
          document_type: string
          document_url: string
          expiry_date?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_hash?: string
          document_type?: string
          document_url?: string
          expiry_date?: string | null
          id?: string
          rejection_reason?: string | null
          updated_at?: string | null
          user_id?: string
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      kyc_nominations: {
        Row: {
          aadhar_back_url: string | null
          aadhar_front_url: string | null
          aadhar_number: string | null
          account_holder_name: string
          account_number: string
          account_type: string | null
          address_line1: string | null
          address_line2: string | null
          bank_name: string
          bank_proof_url: string | null
          branch_name: string | null
          city: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          ifsc_code: string
          investment_amount: number
          investment_type: string
          kyc_status: string | null
          nominee_aadhar: string | null
          nominee_address: string | null
          nominee_dob: string | null
          nominee_name: string | null
          nominee_phone: string | null
          nominee_relationship: string | null
          pan_card_url: string | null
          pan_number: string | null
          phone: string
          photo_url: string | null
          pincode: string | null
          referred_by_code: string | null
          state: string | null
          updated_at: string | null
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          aadhar_back_url?: string | null
          aadhar_front_url?: string | null
          aadhar_number?: string | null
          account_holder_name: string
          account_number: string
          account_type?: string | null
          address_line1?: string | null
          address_line2?: string | null
          bank_name: string
          bank_proof_url?: string | null
          branch_name?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          id?: string
          ifsc_code: string
          investment_amount: number
          investment_type: string
          kyc_status?: string | null
          nominee_aadhar?: string | null
          nominee_address?: string | null
          nominee_dob?: string | null
          nominee_name?: string | null
          nominee_phone?: string | null
          nominee_relationship?: string | null
          pan_card_url?: string | null
          pan_number?: string | null
          phone: string
          photo_url?: string | null
          pincode?: string | null
          referred_by_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          aadhar_back_url?: string | null
          aadhar_front_url?: string | null
          aadhar_number?: string | null
          account_holder_name?: string
          account_number?: string
          account_type?: string | null
          address_line1?: string | null
          address_line2?: string | null
          bank_name?: string
          bank_proof_url?: string | null
          branch_name?: string | null
          city?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          ifsc_code?: string
          investment_amount?: number
          investment_type?: string
          kyc_status?: string | null
          nominee_aadhar?: string | null
          nominee_address?: string | null
          nominee_dob?: string | null
          nominee_name?: string | null
          nominee_phone?: string | null
          nominee_relationship?: string | null
          pan_card_url?: string | null
          pan_number?: string | null
          phone?: string
          photo_url?: string | null
          pincode?: string | null
          referred_by_code?: string | null
          state?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kyc_nominations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_confirmations: {
        Row: {
          account_number: string | null
          auto_generated_referral_code: string | null
          bank_name: string | null
          confirmation_status: string | null
          confirmed_at: string | null
          confirmed_by: string | null
          created_at: string | null
          id: string
          ifsc_code: string | null
          investment_amount: number
          is_franchise_fee: boolean | null
          payment_date: string | null
          payment_proof_url: string | null
          rejection_reason: string | null
          transaction_reference: string | null
          updated_at: string | null
          user_id: string | null
          utr_number: string | null
        }
        Insert: {
          account_number?: string | null
          auto_generated_referral_code?: string | null
          bank_name?: string | null
          confirmation_status?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          investment_amount: number
          is_franchise_fee?: boolean | null
          payment_date?: string | null
          payment_proof_url?: string | null
          rejection_reason?: string | null
          transaction_reference?: string | null
          updated_at?: string | null
          user_id?: string | null
          utr_number?: string | null
        }
        Update: {
          account_number?: string | null
          auto_generated_referral_code?: string | null
          bank_name?: string | null
          confirmation_status?: string | null
          confirmed_at?: string | null
          confirmed_by?: string | null
          created_at?: string | null
          id?: string
          ifsc_code?: string | null
          investment_amount?: number
          is_franchise_fee?: boolean | null
          payment_date?: string | null
          payment_proof_url?: string | null
          rejection_reason?: string | null
          transaction_reference?: string | null
          updated_at?: string | null
          user_id?: string | null
          utr_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_confirmations_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_confirmations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_history: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          investment_id: string | null
          payout_date: string
          payout_type: string | null
          processed_at: string | null
          referral_level: number | null
          status: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          investment_id?: string | null
          payout_date: string
          payout_type?: string | null
          processed_at?: string | null
          referral_level?: number | null
          status?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          investment_id?: string | null
          payout_date?: string
          payout_type?: string | null
          processed_at?: string | null
          referral_level?: number | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payout_history_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "investments"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          code: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          module: string
          resource: string
          updated_at: string | null
        }
        Insert: {
          action: string
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module: string
          resource: string
          updated_at?: string | null
        }
        Update: {
          action?: string
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          module?: string
          resource?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_listing_strategy: {
        Row: {
          analysis_completed_at: string | null
          competition_score: number | null
          confidence_level: number | null
          created_at: string | null
          data_collection_hours: number | null
          decision_made_at: string | null
          id: string
          market_demand_score: number | null
          notes: string | null
          overall_strategy_score: number | null
          product_id: string
          recommendation: string | null
          timing_score: number | null
          trend_analysis_score: number | null
          vendor_id: string
        }
        Insert: {
          analysis_completed_at?: string | null
          competition_score?: number | null
          confidence_level?: number | null
          created_at?: string | null
          data_collection_hours?: number | null
          decision_made_at?: string | null
          id?: string
          market_demand_score?: number | null
          notes?: string | null
          overall_strategy_score?: number | null
          product_id: string
          recommendation?: string | null
          timing_score?: number | null
          trend_analysis_score?: number | null
          vendor_id: string
        }
        Update: {
          analysis_completed_at?: string | null
          competition_score?: number | null
          confidence_level?: number | null
          created_at?: string | null
          data_collection_hours?: number | null
          decision_made_at?: string | null
          id?: string
          market_demand_score?: number | null
          notes?: string | null
          overall_strategy_score?: number | null
          product_id?: string
          recommendation?: string | null
          timing_score?: number | null
          trend_analysis_score?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_listing_strategy_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vendor_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_listing_strategy_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      rank_change_history: {
        Row: {
          change_type: string
          changed_at: string | null
          id: string
          new_rank: string
          notes: string | null
          previous_rank: string | null
          qualifying_volume: number | null
          trigger_event: string | null
          user_id: string
        }
        Insert: {
          change_type: string
          changed_at?: string | null
          id?: string
          new_rank: string
          notes?: string | null
          previous_rank?: string | null
          qualifying_volume?: number | null
          trigger_event?: string | null
          user_id: string
        }
        Update: {
          change_type?: string
          changed_at?: string | null
          id?: string
          new_rank?: string
          notes?: string | null
          previous_rank?: string | null
          qualifying_volume?: number | null
          trigger_event?: string | null
          user_id?: string
        }
        Relationships: []
      }
      referral_tree: {
        Row: {
          corrected_by: string | null
          correction_note: string | null
          created_at: string | null
          id: string
          level: number | null
          parent_id: string | null
          position: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          corrected_by?: string | null
          correction_note?: string | null
          created_at?: string | null
          id?: string
          level?: number | null
          parent_id?: string | null
          position?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          corrected_by?: string | null
          correction_note?: string | null
          created_at?: string | null
          id?: string
          level?: number | null
          parent_id?: string | null
          position?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_tree_corrected_by_fkey"
            columns: ["corrected_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_tree_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referral_tree_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          permission_id: string
          role_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id: string
          role_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          approval_level: number | null
          audit_level: string | null
          can_downgrade: boolean | null
          can_upgrade: boolean | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          level: number
          max_session_hours: number | null
          name: string
          require_2fa: boolean | null
          requires_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          approval_level?: number | null
          audit_level?: string | null
          can_downgrade?: boolean | null
          can_upgrade?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level: number
          max_session_hours?: number | null
          name: string
          require_2fa?: boolean | null
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          approval_level?: number | null
          audit_level?: string | null
          can_downgrade?: boolean | null
          can_upgrade?: boolean | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          level?: number
          max_session_hours?: number | null
          name?: string
          require_2fa?: boolean | null
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      status_change_log: {
        Row: {
          auto_triggered: boolean | null
          changed_at: string | null
          changed_by: string | null
          email_sent: boolean | null
          id: string
          new_status: string | null
          old_status: string | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          auto_triggered?: boolean | null
          changed_at?: string | null
          changed_by?: string | null
          email_sent?: boolean | null
          id?: string
          new_status?: string | null
          old_status?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          auto_triggered?: boolean | null
          changed_at?: string | null
          changed_by?: string | null
          email_sent?: boolean | null
          id?: string
          new_status?: string | null
          old_status?: string | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "status_change_log_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "status_change_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_business_volume: {
        Row: {
          created_at: string | null
          current_rank: string | null
          direct_investment: number | null
          id: string
          last_rank_evaluation: string | null
          level_1_business: number | null
          level_2_business: number | null
          level_3_business: number | null
          level_4_business: number | null
          level_5_business: number | null
          level_6_business: number | null
          next_rank: string | null
          rank_progress_percentage: number | null
          rank_qualifying_volume: number | null
          total_team_business: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_rank?: string | null
          direct_investment?: number | null
          id?: string
          last_rank_evaluation?: string | null
          level_1_business?: number | null
          level_2_business?: number | null
          level_3_business?: number | null
          level_4_business?: number | null
          level_5_business?: number | null
          level_6_business?: number | null
          next_rank?: string | null
          rank_progress_percentage?: number | null
          rank_qualifying_volume?: number | null
          total_team_business?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_rank?: string | null
          direct_investment?: number | null
          id?: string
          last_rank_evaluation?: string | null
          level_1_business?: number | null
          level_2_business?: number | null
          level_3_business?: number | null
          level_4_business?: number | null
          level_5_business?: number | null
          level_6_business?: number | null
          next_rank?: string | null
          rank_progress_percentage?: number | null
          rank_qualifying_volume?: number | null
          total_team_business?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          city: string | null
          commission_earned_passive: number | null
          created_at: string | null
          direct_referrals: number | null
          email: string
          franchise_id: string | null
          full_name: string
          id: string
          kyc_verified: boolean | null
          last_status_change: string | null
          network_size: number | null
          next_payout_date: string | null
          orange_timer_end: string | null
          orange_timer_start: string | null
          payout_cycle_day: number | null
          phone: string | null
          referral_code: string
          referred_by: string | null
          role: string | null
          state: string | null
          status: string | null
          status_change_reason: string | null
          status_changed_at: string | null
          tier_level: number | null
          total_commission: number | null
          total_investment: number | null
          total_referrals: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          city?: string | null
          commission_earned_passive?: number | null
          created_at?: string | null
          direct_referrals?: number | null
          email: string
          franchise_id?: string | null
          full_name: string
          id?: string
          kyc_verified?: boolean | null
          last_status_change?: string | null
          network_size?: number | null
          next_payout_date?: string | null
          orange_timer_end?: string | null
          orange_timer_start?: string | null
          payout_cycle_day?: number | null
          phone?: string | null
          referral_code: string
          referred_by?: string | null
          role?: string | null
          state?: string | null
          status?: string | null
          status_change_reason?: string | null
          status_changed_at?: string | null
          tier_level?: number | null
          total_commission?: number | null
          total_investment?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          city?: string | null
          commission_earned_passive?: number | null
          created_at?: string | null
          direct_referrals?: number | null
          email?: string
          franchise_id?: string | null
          full_name?: string
          id?: string
          kyc_verified?: boolean | null
          last_status_change?: string | null
          network_size?: number | null
          next_payout_date?: string | null
          orange_timer_end?: string | null
          orange_timer_start?: string | null
          payout_cycle_day?: number | null
          phone?: string | null
          referral_code?: string
          referred_by?: string | null
          role?: string | null
          state?: string | null
          status?: string | null
          status_change_reason?: string | null
          status_changed_at?: string | null
          tier_level?: number | null
          total_commission?: number | null
          total_investment?: number | null
          total_referrals?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          email_verified: boolean | null
          full_name: string
          id: string
          is_active: boolean | null
          kyc_status: string | null
          last_login_at: string | null
          password_hash: string
          phone: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          email_verified?: boolean | null
          full_name: string
          id?: string
          is_active?: boolean | null
          kyc_status?: string | null
          last_login_at?: string | null
          password_hash: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          email_verified?: boolean | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          kyc_status?: string | null
          last_login_at?: string | null
          password_hash?: string
          phone?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vendor_orders: {
        Row: {
          created_at: string | null
          customer_id: string | null
          delivered_at: string | null
          id: string
          order_number: string
          order_status: string | null
          payment_status: string | null
          platform_fee: number | null
          product_id: string
          qr_code: string | null
          quantity: number
          replacement_provided: boolean | null
          return_reason: string | null
          return_requested: boolean | null
          shipping_status: string | null
          total_amount: number
          tracking_number: string | null
          unit_price: number
          updated_at: string | null
          vendor_id: string
          vendor_share: number | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          id?: string
          order_number: string
          order_status?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          product_id: string
          qr_code?: string | null
          quantity: number
          replacement_provided?: boolean | null
          return_reason?: string | null
          return_requested?: boolean | null
          shipping_status?: string | null
          total_amount: number
          tracking_number?: string | null
          unit_price: number
          updated_at?: string | null
          vendor_id: string
          vendor_share?: number | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          delivered_at?: string | null
          id?: string
          order_number?: string
          order_status?: string | null
          payment_status?: string | null
          platform_fee?: number | null
          product_id?: string
          qr_code?: string | null
          quantity?: number
          replacement_provided?: boolean | null
          return_reason?: string | null
          return_requested?: boolean | null
          shipping_status?: string | null
          total_amount?: number
          tracking_number?: string | null
          unit_price?: number
          updated_at?: string | null
          vendor_id?: string
          vendor_share?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "vendor_products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_products: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          category: string | null
          created_at: string | null
          id: string
          images: Json | null
          listing_approval_status: string | null
          listing_score: number | null
          price: number
          product_description: string | null
          product_name: string
          product_status: string | null
          rejection_reason: string | null
          sku: string | null
          stock_quantity: number | null
          total_revenue: number | null
          total_sales: number | null
          trend_score: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          listing_approval_status?: string | null
          listing_score?: number | null
          price: number
          product_description?: string | null
          product_name: string
          product_status?: string | null
          rejection_reason?: string | null
          sku?: string | null
          stock_quantity?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          trend_score?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          images?: Json | null
          listing_approval_status?: string | null
          listing_score?: number | null
          price?: number
          product_description?: string | null
          product_name?: string
          product_status?: string | null
          rejection_reason?: string | null
          sku?: string | null
          stock_quantity?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          trend_score?: number | null
          updated_at?: string | null
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
          active_products_count: number | null
          approval_date: string | null
          approved_by: string | null
          business_name: string
          created_at: string | null
          id: string
          investment_amount: number | null
          min_products_required: number | null
          platform_fee_percentage: number | null
          platform_fees_collected: number | null
          rejection_reason: string | null
          revenue_share_percentage: number | null
          total_orders: number | null
          total_revenue: number | null
          updated_at: string | null
          user_id: string
          vendor_commission: number | null
          vendor_status: string | null
          vendor_type: string | null
        }
        Insert: {
          active_products_count?: number | null
          approval_date?: string | null
          approved_by?: string | null
          business_name: string
          created_at?: string | null
          id?: string
          investment_amount?: number | null
          min_products_required?: number | null
          platform_fee_percentage?: number | null
          platform_fees_collected?: number | null
          rejection_reason?: string | null
          revenue_share_percentage?: number | null
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id: string
          vendor_commission?: number | null
          vendor_status?: string | null
          vendor_type?: string | null
        }
        Update: {
          active_products_count?: number | null
          approval_date?: string | null
          approved_by?: string | null
          business_name?: string
          created_at?: string | null
          id?: string
          investment_amount?: number | null
          min_products_required?: number | null
          platform_fee_percentage?: number | null
          platform_fees_collected?: number | null
          rejection_reason?: string | null
          revenue_share_percentage?: number | null
          total_orders?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          user_id?: string
          vendor_commission?: number | null
          vendor_status?: string | null
          vendor_type?: string | null
        }
        Relationships: []
      }
      webhook_event_queue: {
        Row: {
          batch_id: string | null
          created_at: string | null
          error_message: string | null
          event_payload: Json
          event_type: string
          id: string
          max_retries: number | null
          priority: number | null
          processed_at: string | null
          retry_count: number | null
          scheduled_for: string | null
          status: string | null
          target_user_id: string | null
        }
        Insert: {
          batch_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_payload: Json
          event_type: string
          id?: string
          max_retries?: number | null
          priority?: number | null
          processed_at?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          status?: string | null
          target_user_id?: string | null
        }
        Update: {
          batch_id?: string | null
          created_at?: string | null
          error_message?: string | null
          event_payload?: Json
          event_type?: string
          id?: string
          max_retries?: number | null
          priority?: number | null
          processed_at?: string | null
          retry_count?: number | null
          scheduled_for?: string | null
          status?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_passive_timer_expiry: { Args: never; Returns: undefined }
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
