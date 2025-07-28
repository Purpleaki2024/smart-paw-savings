export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          address: Json | null
          created_at: string
          updated_at: string
          gdpr_consent: boolean
          marketing_consent: boolean
          data_retention_preference: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
          gdpr_consent?: boolean
          marketing_consent?: boolean
          data_retention_preference?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          address?: Json | null
          created_at?: string
          updated_at?: string
          gdpr_consent?: boolean
          marketing_consent?: boolean
          data_retention_preference?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pets: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          breed: string | null
          age: number | null
          weight: number | null
          medical_conditions: string[] | null
          dietary_requirements: string[] | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          breed?: string | null
          age?: number | null
          weight?: number | null
          medical_conditions?: string[] | null
          dietary_requirements?: string[] | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          breed?: string | null
          age?: number | null
          weight?: number | null
          medical_conditions?: string[] | null
          dietary_requirements?: string[] | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      bank_accounts: {
        Row: {
          id: string
          user_id: string
          plaid_account_id: string
          plaid_access_token: string
          account_name: string
          account_type: string
          balance: number | null
          currency: string
          is_active: boolean
          last_synced: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plaid_account_id: string
          plaid_access_token: string
          account_name: string
          account_type: string
          balance?: number | null
          currency?: string
          is_active?: boolean
          last_synced?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plaid_account_id?: string
          plaid_access_token?: string
          account_name?: string
          account_type?: string
          balance?: number | null
          currency?: string
          is_active?: boolean
          last_synced?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      expense_categories: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          icon: string | null
          color: string | null
          is_pet_related: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          icon?: string | null
          color?: string | null
          is_pet_related?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          icon?: string | null
          color?: string | null
          is_pet_related?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          bank_account_id: string
          plaid_transaction_id: string | null
          amount: number
          currency: string
          description: string | null
          merchant_name: string | null
          category_id: string | null
          pet_id: string | null
          transaction_date: string
          is_pet_expense: boolean
          ai_confidence_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bank_account_id: string
          plaid_transaction_id?: string | null
          amount: number
          currency?: string
          description?: string | null
          merchant_name?: string | null
          category_id?: string | null
          pet_id?: string | null
          transaction_date: string
          is_pet_expense?: boolean
          ai_confidence_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bank_account_id?: string
          plaid_transaction_id?: string | null
          amount?: number
          currency?: string
          description?: string | null
          merchant_name?: string | null
          category_id?: string | null
          pet_id?: string | null
          transaction_date?: string
          is_pet_expense?: boolean
          ai_confidence_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          }
        ]
      }
      budgets: {
        Row: {
          id: string
          user_id: string
          pet_id: string | null
          category_id: string | null
          name: string
          amount: number
          period: string
          start_date: string
          end_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pet_id?: string | null
          category_id?: string | null
          name: string
          amount: number
          period: string
          start_date: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pet_id?: string | null
          category_id?: string | null
          name?: string
          amount?: number
          period?: string
          start_date?: string
          end_date?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "budgets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      savings_opportunities: {
        Row: {
          id: string
          user_id: string
          pet_id: string | null
          category_id: string | null
          title: string
          description: string | null
          potential_savings: number | null
          savings_type: string | null
          status: string
          ai_recommendation: Json | null
          expires_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pet_id?: string | null
          category_id?: string | null
          title: string
          description?: string | null
          potential_savings?: number | null
          savings_type?: string | null
          status?: string
          ai_recommendation?: Json | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pet_id?: string | null
          category_id?: string | null
          title?: string
          description?: string | null
          potential_savings?: number | null
          savings_type?: string | null
          status?: string
          ai_recommendation?: Json | null
          expires_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "savings_opportunities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "savings_opportunities_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "savings_opportunities_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      discounts: {
        Row: {
          id: string
          user_id: string | null
          merchant_name: string
          discount_code: string | null
          discount_percentage: number | null
          discount_amount: number | null
          description: string | null
          terms_conditions: string | null
          category_id: string | null
          valid_from: string | null
          valid_to: string | null
          usage_limit: number | null
          times_used: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          merchant_name: string
          discount_code?: string | null
          discount_percentage?: number | null
          discount_amount?: number | null
          description?: string | null
          terms_conditions?: string | null
          category_id?: string | null
          valid_from?: string | null
          valid_to?: string | null
          usage_limit?: number | null
          times_used?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          merchant_name?: string
          discount_code?: string | null
          discount_percentage?: number | null
          discount_amount?: number | null
          description?: string | null
          terms_conditions?: string | null
          category_id?: string | null
          valid_from?: string | null
          valid_to?: string | null
          usage_limit?: number | null
          times_used?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discounts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      vet_appointments: {
        Row: {
          id: string
          user_id: string
          pet_id: string
          vet_name: string | null
          vet_contact: Json | null
          appointment_type: string | null
          appointment_date: string
          notes: string | null
          cost: number | null
          reminder_sent: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pet_id: string
          vet_name?: string | null
          vet_contact?: Json | null
          appointment_type?: string | null
          appointment_date: string
          notes?: string | null
          cost?: number | null
          reminder_sent?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pet_id?: string
          vet_name?: string | null
          vet_contact?: Json | null
          appointment_type?: string | null
          appointment_date?: string
          notes?: string | null
          cost?: number | null
          reminder_sent?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vet_appointments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vet_appointments_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          }
        ]
      }
      care_tips: {
        Row: {
          id: string
          title: string
          content: string
          category: string | null
          pet_types: string[] | null
          difficulty_level: string | null
          estimated_savings: number | null
          image_url: string | null
          video_url: string | null
          tags: string[] | null
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          category?: string | null
          pet_types?: string[] | null
          difficulty_level?: string | null
          estimated_savings?: number | null
          image_url?: string | null
          video_url?: string | null
          tags?: string[] | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          category?: string | null
          pet_types?: string[] | null
          difficulty_level?: string | null
          estimated_savings?: number | null
          image_url?: string | null
          video_url?: string | null
          tags?: string[] | null
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_care_tips: {
        Row: {
          id: string
          user_id: string
          care_tip_id: string
          pet_id: string
          status: string
          rating: number | null
          feedback: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          care_tip_id: string
          pet_id: string
          status?: string
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          care_tip_id?: string
          pet_id?: string
          status?: string
          rating?: number | null
          feedback?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_care_tips_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_care_tips_care_tip_id_fkey"
            columns: ["care_tip_id"]
            isOneToOne: false
            referencedRelation: "care_tips"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_care_tips_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          is_read: boolean
          scheduled_for: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json | null
          is_read?: boolean
          scheduled_for?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json | null
          is_read?: boolean
          scheduled_for?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      insurance_providers: {
        Row: {
          id: string
          name: string
          website_url: string | null
          contact_info: Json | null
          coverage_types: string[] | null
          rating: number | null
          reviews_count: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          website_url?: string | null
          contact_info?: Json | null
          coverage_types?: string[] | null
          rating?: number | null
          reviews_count?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          website_url?: string | null
          contact_info?: Json | null
          coverage_types?: string[] | null
          rating?: number | null
          reviews_count?: number
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      insurance_quotes: {
        Row: {
          id: string
          user_id: string
          pet_id: string
          provider_id: string | null
          coverage_type: string | null
          monthly_premium: number | null
          annual_premium: number | null
          deductible: number | null
          coverage_limit: number | null
          coverage_percentage: number | null
          quote_data: Json | null
          valid_until: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pet_id: string
          provider_id?: string | null
          coverage_type?: string | null
          monthly_premium?: number | null
          annual_premium?: number | null
          deductible?: number | null
          coverage_limit?: number | null
          coverage_percentage?: number | null
          quote_data?: Json | null
          valid_until?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pet_id?: string
          provider_id?: string | null
          coverage_type?: string | null
          monthly_premium?: number | null
          annual_premium?: number | null
          deductible?: number | null
          coverage_limit?: number | null
          coverage_percentage?: number | null
          quote_data?: Json | null
          valid_until?: string | null
          status?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_quotes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_quotes_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_quotes_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          }
        ]
      }
      payment_methods: {
        Row: {
          id: string
          user_id: string
          stripe_payment_method_id: string
          type: string
          brand: string | null
          last_four: string | null
          exp_month: number | null
          exp_year: number | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_method_id: string
          type: string
          brand?: string | null
          last_four?: string | null
          exp_month?: number | null
          exp_year?: number | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_method_id?: string
          type?: string
          brand?: string | null
          last_four?: string | null
          exp_month?: number | null
          exp_year?: number | null
          is_default?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          plan_name: string
          status: string
          current_period_start: string | null
          current_period_end: string | null
          amount: number | null
          currency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          plan_name: string
          status: string
          current_period_start?: string | null
          current_period_end?: string | null
          amount?: number | null
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          plan_name?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          amount?: number | null
          currency?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ai_analysis_logs: {
        Row: {
          id: string
          user_id: string | null
          analysis_type: string
          input_data: Json | null
          output_data: Json | null
          confidence_score: number | null
          processing_time_ms: number | null
          model_version: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          analysis_type: string
          input_data?: Json | null
          output_data?: Json | null
          confidence_score?: number | null
          processing_time_ms?: number | null
          model_version?: string | null
          created_at?: string
        }
        Update: {
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
          created_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: number
          level: string
          message: string
          metadata: Json | null
          timestamp: string
          user_id: string | null
        }
        Insert: {
          chat_id?: string | null
          command?: string | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: number
          level: string
          message: string
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          chat_id?: string | null
          command?: string | null
          created_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: number
          level?: string
          message?: string
          metadata?: Json | null
          timestamp?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bot_stats: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          value?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          value?: number
        }
        Relationships: []
      }
      location_searches: {
        Row: {
          created_at: string | null
          id: string
          latitude: string | null
          longitude: string | null
          query: string | null
          query_type: string | null
          response_time_ms: number | null
          search_result_count: number | null
          success: boolean | null
          telegram_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          latitude?: string | null
          longitude?: string | null
          query?: string | null
          query_type?: string | null
          response_time_ms?: number | null
          search_result_count?: number | null
          success?: boolean | null
          telegram_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          latitude?: string | null
          longitude?: string | null
          query?: string | null
          query_type?: string | null
          response_time_ms?: number | null
          search_result_count?: number | null
          success?: boolean | null
          telegram_user_id?: string | null
        }
        Relationships: []
      }
      medical_contacts: {
        Row: {
          address: string | null
          city: string | null
          contact_method: string | null
          country: string | null
          created_at: string | null
          hours: string | null
          id: number
          is_active: boolean | null
          is_whatsapp_only: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          password_required: string | null
          phone: string
          region: string | null
          special_instructions: string | null
          special_message: string | null
          specialty: string | null
          start_message: string | null
          telegram_username: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_method?: string | null
          country?: string | null
          created_at?: string | null
          hours?: string | null
          id?: number
          is_active?: boolean | null
          is_whatsapp_only?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          password_required?: string | null
          phone: string
          region?: string | null
          special_instructions?: string | null
          special_message?: string | null
          specialty?: string | null
          start_message?: string | null
          telegram_username?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_method?: string | null
          country?: string | null
          created_at?: string | null
          hours?: string | null
          id?: number
          is_active?: boolean | null
          is_whatsapp_only?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          password_required?: string | null
          phone?: string
          region?: string | null
          special_instructions?: string | null
          special_message?: string | null
          specialty?: string | null
          start_message?: string | null
          telegram_username?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      message_templates: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
          variables: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
          variables?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
          variables?: Json | null
        }
        Relationships: []
      }
      telegram_users: {
        Row: {
          first_name: string | null
          first_seen: string | null
          id: string
          last_name: string | null
          last_request_date: string | null
          last_seen: string | null
          requests_today: number | null
          telegram_id: string
          username: string | null
        }
        Insert: {
          first_name?: string | null
          first_seen?: string | null
          id?: string
          last_name?: string | null
          last_request_date?: string | null
          last_seen?: string | null
          requests_today?: number | null
          telegram_id: string
          username?: string | null
        }
        Update: {
          first_name?: string | null
          first_seen?: string | null
          id?: string
          last_name?: string | null
          last_request_date?: string | null
          last_seen?: string | null
          requests_today?: number | null
          telegram_id?: string
          username?: string | null
        }
        Relationships: []
      }
      user_activities: {
        Row: {
          activity_type: string
          created_at: string
          id: string
          location_id: string | null
          message: string | null
          telegram_user_id: string | null
          telegram_username: string | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string
          id?: string
          location_id?: string | null
          message?: string | null
          telegram_user_id?: string | null
          telegram_username?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string
          id?: string
          location_id?: string | null
          message?: string | null
          telegram_user_id?: string | null
          telegram_username?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          command_count: number | null
          created_at: string | null
          duration_seconds: number | null
          end_time: string | null
          id: string
          start_time: string | null
          user_id: string | null
        }
        Insert: {
          command_count?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          user_id?: string | null
        }
        Update: {
          command_count?: number | null
          created_at?: string | null
          duration_seconds?: number | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "telegram_users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      batch_increment_visits: {
        Args: { location_ids: number[] }
        Returns: undefined
      }
      cleanup_old_activities: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_bot_logs: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      get_bot_error_summary: {
        Args: { days_back?: number }
        Returns: {
          error_message: string
          command: string
          count: number
          last_occurrence: string
        }[]
      }
      get_bot_log_stats: {
        Args: { days_back?: number }
        Returns: {
          level: string
          count: number
          avg_duration_ms: number
        }[]
      }
      get_bot_performance_stats: {
        Args: { days_back?: number }
        Returns: {
          date: string
          total_requests: number
          error_count: number
          avg_duration_ms: number
          success_rate: number
        }[]
      }
      get_bot_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          value: number
        }[]
      }
      get_command_usage_stats: {
        Args: { days_back?: number }
        Returns: {
          command: string
          usage_count: number
          avg_duration_ms: number
          error_count: number
        }[]
      }
      get_location_search_stats: {
        Args: { days_back?: number }
        Returns: {
          date: string
          total_searches: number
          successful_searches: number
          avg_response_time: number
          unique_users: number
        }[]
      }
      get_telegram_user_count: {
        Args: Record<PropertyKey, never>
        Returns: {
          count: number
        }[]
      }
      get_template_by_type: {
        Args: { template_type: string }
        Returns: {
          id: string
          name: string
          content: string
          variables: Json
        }[]
      }
      get_user_activity_stats: {
        Args: { days_back?: number }
        Returns: {
          date: string
          active_users: number
          total_commands: number
          avg_session_duration: number
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          user_id: string
          check_role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_bot_stats: {
        Args: { stat_name: string; increment_by: number }
        Returns: undefined
      }
      reset_daily_requests: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "user" | "blocked"
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
      app_role: ["admin", "manager", "user", "blocked"],
    },
  },
} as const
