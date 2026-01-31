-- Migration: Create blockchain enum type
-- Description: Enum for supported blockchain networks

CREATE TYPE blockchain_type AS ENUM ('bitcoin', 'ethereum');

COMMENT ON TYPE blockchain_type IS 'Supported blockchain networks for wallet analysis';
