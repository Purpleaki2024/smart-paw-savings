-- Smart Paw Savings Database Schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  address JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  gdpr_consent BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE,
  data_retention_preference TEXT DEFAULT '2_years'
);

-- Pet profiles table
CREATE TABLE pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- dog, cat, bird, etc.
  breed TEXT,
  age INTEGER,
  weight DECIMAL(5,2),
  medical_conditions TEXT[],
  dietary_requirements TEXT[],
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bank accounts (Plaid integration)
CREATE TABLE bank_accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plaid_account_id TEXT UNIQUE NOT NULL,
  plaid_access_token TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  balance DECIMAL(10,2),
  currency TEXT DEFAULT 'GBP',
  is_active BOOLEAN DEFAULT TRUE,
  last_synced TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense categories
CREATE TABLE expense_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES expense_categories(id),
  icon TEXT,
  color TEXT,
  is_pet_related BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions from bank accounts
CREATE TABLE transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bank_account_id UUID REFERENCES bank_accounts(id) ON DELETE CASCADE,
  plaid_transaction_id TEXT UNIQUE,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'GBP',
  description TEXT,
  merchant_name TEXT,
  category_id UUID REFERENCES expense_categories(id),
  pet_id UUID REFERENCES pets(id),
  transaction_date DATE NOT NULL,
  is_pet_expense BOOLEAN DEFAULT FALSE,
  ai_confidence_score DECIMAL(3,2), -- AI classification confidence
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Expense tracking and budgets
CREATE TABLE budgets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id),
  category_id UUID REFERENCES expense_categories(id),
  name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  period TEXT NOT NULL, -- monthly, yearly, etc.
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Savings opportunities identified by AI
CREATE TABLE savings_opportunities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id),
  category_id UUID REFERENCES expense_categories(id),
  title TEXT NOT NULL,
  description TEXT,
  potential_savings DECIMAL(10,2),
  savings_type TEXT, -- alternative_supplier, bulk_purchase, subscription_change, etc.
  status TEXT DEFAULT 'pending', -- pending, accepted, dismissed, applied
  ai_recommendation JSONB,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discount codes and offers
CREATE TABLE discounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  merchant_name TEXT NOT NULL,
  discount_code TEXT,
  discount_percentage DECIMAL(5,2),
  discount_amount DECIMAL(10,2),
  description TEXT,
  terms_conditions TEXT,
  category_id UUID REFERENCES expense_categories(id),
  valid_from DATE,
  valid_to DATE,
  usage_limit INTEGER,
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Veterinary appointments and reminders
CREATE TABLE vet_appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  vet_name TEXT,
  vet_contact JSONB,
  appointment_type TEXT,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  notes TEXT,
  cost DECIMAL(10,2),
  reminder_sent BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'scheduled', -- scheduled, completed, cancelled
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Care tips and recommendations
CREATE TABLE care_tips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT, -- grooming, health, nutrition, exercise, etc.
  pet_types TEXT[], -- applicable pet types
  difficulty_level TEXT, -- easy, medium, hard
  estimated_savings DECIMAL(10,2),
  image_url TEXT,
  video_url TEXT,
  tags TEXT[],
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User interactions with care tips
CREATE TABLE user_care_tips (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  care_tip_id UUID REFERENCES care_tips(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'viewed', -- viewed, bookmarked, completed, dismissed
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, care_tip_id, pet_id)
);

-- Notifications
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- vet_reminder, savings_opportunity, care_tip, etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insurance comparisons
CREATE TABLE insurance_providers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  website_url TEXT,
  contact_info JSONB,
  coverage_types TEXT[],
  rating DECIMAL(3,2),
  reviews_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE insurance_quotes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES insurance_providers(id),
  coverage_type TEXT,
  monthly_premium DECIMAL(10,2),
  annual_premium DECIMAL(10,2),
  deductible DECIMAL(10,2),
  coverage_limit DECIMAL(10,2),
  coverage_percentage DECIMAL(5,2),
  quote_data JSONB,
  valid_until DATE,
  status TEXT DEFAULT 'pending', -- pending, accepted, expired
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods (Stripe integration)
CREATE TABLE payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL, -- card, bank_account, etc.
  brand TEXT,
  last_four TEXT,
  exp_month INTEGER,
  exp_year INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscription management
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  plan_name TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'GBP',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI analysis logs
CREATE TABLE ai_analysis_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  analysis_type TEXT NOT NULL, -- expense_categorization, savings_opportunity, care_recommendation
  input_data JSONB,
  output_data JSONB,
  confidence_score DECIMAL(3,2),
  processing_time_ms INTEGER,
  model_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_pets_user_id ON pets(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_pet_expense ON transactions(is_pet_expense);
CREATE INDEX idx_savings_opportunities_user_id ON savings_opportunities(user_id);
CREATE INDEX idx_savings_opportunities_status ON savings_opportunities(status);
CREATE INDEX idx_vet_appointments_user_id ON vet_appointments(user_id);
CREATE INDEX idx_vet_appointments_date ON vet_appointments(appointment_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE savings_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_care_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own pets" ON pets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own bank accounts" ON bank_accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own savings opportunities" ON savings_opportunities FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own vet appointments" ON vet_appointments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own care tips interactions" ON user_care_tips FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own insurance quotes" ON insurance_quotes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own payment methods" ON payment_methods FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own subscriptions" ON subscriptions FOR ALL USING (auth.uid() = user_id);

-- Public read access for reference tables
CREATE POLICY "Public read access" ON expense_categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON care_tips FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access" ON insurance_providers FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access" ON discounts FOR SELECT USING (is_active = true);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pets_updated_at BEFORE UPDATE ON pets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_savings_opportunities_updated_at BEFORE UPDATE ON savings_opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vet_appointments_updated_at BEFORE UPDATE ON vet_appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_care_tips_updated_at BEFORE UPDATE ON care_tips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_care_tips_updated_at BEFORE UPDATE ON user_care_tips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_quotes_updated_at BEFORE UPDATE ON insurance_quotes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
