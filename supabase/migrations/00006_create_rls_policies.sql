-- Migration: Create RLS policies
-- Description: Row Level Security policies for all tables

-- ============================================
-- USERS TABLE POLICIES
-- ============================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
    ON users
    FOR SELECT
    USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Users are created via trigger from auth.users (service role)
CREATE POLICY "Service role can insert users"
    ON users
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- INVESTMENT_PREFERENCES TABLE POLICIES
-- ============================================

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
    ON investment_preferences
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
    ON investment_preferences
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
    ON investment_preferences
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own preferences
CREATE POLICY "Users can delete own preferences"
    ON investment_preferences
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- WALLET_ANALYSES TABLE POLICIES
-- ============================================

-- Users can view their own analyses
CREATE POLICY "Users can view own analyses"
    ON wallet_analyses
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own analyses
CREATE POLICY "Users can insert own analyses"
    ON wallet_analyses
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own analyses
CREATE POLICY "Users can update own analyses"
    ON wallet_analyses
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own analyses
CREATE POLICY "Users can delete own analyses"
    ON wallet_analyses
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- CONNECTED_WALLETS TABLE POLICIES
-- ============================================

-- Users can view their own connected wallets
CREATE POLICY "Users can view own wallets"
    ON connected_wallets
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own connected wallets
CREATE POLICY "Users can insert own wallets"
    ON connected_wallets
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own connected wallets
CREATE POLICY "Users can update own wallets"
    ON connected_wallets
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own connected wallets
CREATE POLICY "Users can delete own wallets"
    ON connected_wallets
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- AUTO-CREATE USER PROFILE ON AUTH SIGNUP
-- ============================================

-- Function to create user profile when auth.users is created
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

COMMENT ON FUNCTION handle_new_user IS 'Automatically creates a public.users record when a new auth.users is created';
