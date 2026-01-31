-- Migration: Create connected_wallets table
-- Description: User's connected wallet addresses

CREATE TABLE connected_wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    wallet_address TEXT NOT NULL,
    blockchain blockchain_type NOT NULL,
    nickname TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Each wallet address can only be connected once per user
    CONSTRAINT unique_user_wallet UNIQUE (user_id, wallet_address)
);

-- Indexes for common queries
CREATE INDEX idx_connected_wallets_user_id ON connected_wallets(user_id);
CREATE INDEX idx_connected_wallets_wallet_address ON connected_wallets(wallet_address);
CREATE INDEX idx_connected_wallets_blockchain ON connected_wallets(blockchain);

-- Partial index for primary wallets (fast lookup)
CREATE UNIQUE INDEX idx_connected_wallets_primary 
    ON connected_wallets(user_id) 
    WHERE is_primary = TRUE;

-- Enable RLS
ALTER TABLE connected_wallets ENABLE ROW LEVEL SECURITY;

-- Function to ensure only one primary wallet per user
CREATE OR REPLACE FUNCTION ensure_single_primary_wallet()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_primary = TRUE THEN
        UPDATE connected_wallets
        SET is_primary = FALSE
        WHERE user_id = NEW.user_id AND id != NEW.id AND is_primary = TRUE;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to maintain single primary wallet
CREATE TRIGGER ensure_single_primary_wallet_trigger
    BEFORE INSERT OR UPDATE ON connected_wallets
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_primary_wallet();

COMMENT ON TABLE connected_wallets IS 'User connected wallet addresses for monitoring';
COMMENT ON COLUMN connected_wallets.is_primary IS 'Primary wallet used for default analysis';
