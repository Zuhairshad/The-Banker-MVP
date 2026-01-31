-- Migration: Create wallet_analyses table
-- Description: Stores wallet analysis data and AI-generated insights

CREATE TABLE wallet_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    blockchain blockchain_type NOT NULL,
    
    -- Analysis data
    analysis_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    ai_insights TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_wallet_analyses_user_id ON wallet_analyses(user_id);
CREATE INDEX idx_wallet_analyses_wallet_address ON wallet_analyses(wallet_address);
CREATE INDEX idx_wallet_analyses_blockchain ON wallet_analyses(blockchain);
CREATE INDEX idx_wallet_analyses_created_at ON wallet_analyses(created_at DESC);

-- Composite index for user + wallet lookups
CREATE INDEX idx_wallet_analyses_user_wallet ON wallet_analyses(user_id, wallet_address);

-- GIN index for JSONB queries
CREATE INDEX idx_wallet_analyses_data ON wallet_analyses USING GIN (analysis_data);

-- Trigger for updated_at
CREATE TRIGGER update_wallet_analyses_updated_at
    BEFORE UPDATE ON wallet_analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE wallet_analyses ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE wallet_analyses IS 'Wallet transaction analyses with AI-generated insights';
COMMENT ON COLUMN wallet_analyses.analysis_data IS 'Raw transaction data and metrics in JSONB format';
COMMENT ON COLUMN wallet_analyses.ai_insights IS 'AI-generated investment insights based on user preferences';
