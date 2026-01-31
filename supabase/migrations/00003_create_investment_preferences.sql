-- Migration: Create investment_preferences table
-- Description: User investment preferences on 1-10 scale

CREATE TABLE investment_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Investment preference scores (1-10 scale)
    risk_aversion INTEGER NOT NULL CHECK (risk_aversion BETWEEN 1 AND 10),
    volatility_tolerance INTEGER NOT NULL CHECK (volatility_tolerance BETWEEN 1 AND 10),
    growth_focus INTEGER NOT NULL CHECK (growth_focus BETWEEN 1 AND 10),
    crypto_experience INTEGER NOT NULL CHECK (crypto_experience BETWEEN 1 AND 10),
    innovation_trust INTEGER NOT NULL CHECK (innovation_trust BETWEEN 1 AND 10),
    impact_interest INTEGER NOT NULL CHECK (impact_interest BETWEEN 1 AND 10),
    diversification INTEGER NOT NULL CHECK (diversification BETWEEN 1 AND 10),
    holding_patience INTEGER NOT NULL CHECK (holding_patience BETWEEN 1 AND 10),
    monitoring_frequency INTEGER NOT NULL CHECK (monitoring_frequency BETWEEN 1 AND 10),
    advice_openness INTEGER NOT NULL CHECK (advice_openness BETWEEN 1 AND 10),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure one preference record per user
    CONSTRAINT unique_user_preferences UNIQUE (user_id)
);

-- Index on user_id for fast lookups
CREATE INDEX idx_investment_preferences_user_id ON investment_preferences(user_id);

-- Trigger for updated_at
CREATE TRIGGER update_investment_preferences_updated_at
    BEFORE UPDATE ON investment_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE investment_preferences ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE investment_preferences IS 'User investment preferences used for AI-powered analysis personalization';
