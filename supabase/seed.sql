-- Banker Expert Seed Data
-- Creates 3 mock users with investment preferences for testing
-- Note: In production, users are created via Supabase Auth

-- ============================================
-- MOCK USERS (for local development/testing)
-- ============================================
-- These UUIDs are used for testing purposes only
-- In production, users are created automatically when they sign up via auth

-- Insert into auth.users (Supabase auth schema)
-- This requires running with service_role or in local development
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
) VALUES 
    (
        '11111111-1111-1111-1111-111111111111',
        '00000000-0000-0000-0000-000000000000',
        'conservative@test.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Conservative Carl"}',
        'authenticated',
        'authenticated'
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        '00000000-0000-0000-0000-000000000000',
        'balanced@test.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Balanced Betty"}',
        'authenticated',
        'authenticated'
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        '00000000-0000-0000-0000-000000000000',
        'aggressive@test.com',
        crypt('password123', gen_salt('bf')),
        NOW(),
        NOW(),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "Aggressive Alex"}',
        'authenticated',
        'authenticated'
    )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- INVESTMENT PREFERENCES
-- ============================================

-- Conservative investor (high risk aversion, low volatility tolerance)
INSERT INTO investment_preferences (
    id,
    user_id,
    risk_aversion,
    volatility_tolerance,
    growth_focus,
    crypto_experience,
    innovation_trust,
    impact_interest,
    diversification,
    holding_patience,
    monitoring_frequency,
    advice_openness
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    9,  -- Very risk averse
    2,  -- Low volatility tolerance
    4,  -- Moderate growth focus
    3,  -- Limited crypto experience
    3,  -- Low innovation trust
    5,  -- Moderate impact interest
    8,  -- High diversification preference
    7,  -- Patient holder
    4,  -- Moderate monitoring
    8   -- Open to advice
) ON CONFLICT (user_id) DO NOTHING;

-- Balanced investor (moderate across the board)
INSERT INTO investment_preferences (
    id,
    user_id,
    risk_aversion,
    volatility_tolerance,
    growth_focus,
    crypto_experience,
    innovation_trust,
    impact_interest,
    diversification,
    holding_patience,
    monitoring_frequency,
    advice_openness
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    5,  -- Moderate risk aversion
    5,  -- Moderate volatility tolerance
    6,  -- Moderate-high growth focus
    5,  -- Moderate crypto experience
    6,  -- Moderate innovation trust
    6,  -- Moderate impact interest
    6,  -- Moderate diversification
    5,  -- Moderate patience
    6,  -- Moderate-frequent monitoring
    5   -- Moderate advice openness
) ON CONFLICT (user_id) DO NOTHING;

-- Aggressive investor (low risk aversion, high volatility tolerance)
INSERT INTO investment_preferences (
    id,
    user_id,
    risk_aversion,
    volatility_tolerance,
    growth_focus,
    crypto_experience,
    innovation_trust,
    impact_interest,
    diversification,
    holding_patience,
    monitoring_frequency,
    advice_openness
) VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    2,  -- Low risk aversion
    9,  -- High volatility tolerance
    9,  -- Very high growth focus
    8,  -- Experienced in crypto
    8,  -- High innovation trust
    4,  -- Lower impact interest
    3,  -- Concentrated positions OK
    3,  -- Impatient, active trader
    9,  -- Very frequent monitoring
    3   -- Less open to outside advice
) ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- CONNECTED WALLETS (Sample Data)
-- ============================================

-- Conservative Carl's wallets (Bitcoin focus)
INSERT INTO connected_wallets (
    id,
    user_id,
    wallet_address,
    blockchain,
    nickname,
    is_primary
) VALUES 
    (
        'wallet-1111-1111-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        'bitcoin',
        'Main BTC Savings',
        TRUE
    ),
    (
        'wallet-1111-2222-1111-111111111111',
        '11111111-1111-1111-1111-111111111111',
        '0x742d35Cc6634C0532925a3b844Bc9e7595f3E6aB',
        'ethereum',
        'ETH Holdings',
        FALSE
    )
ON CONFLICT (user_id, wallet_address) DO NOTHING;

-- Balanced Betty's wallets (Mixed)
INSERT INTO connected_wallets (
    id,
    user_id,
    wallet_address,
    blockchain,
    nickname,
    is_primary
) VALUES 
    (
        'wallet-2222-1111-2222-222222222222',
        '22222222-2222-2222-2222-222222222222',
        '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        'ethereum',
        'Primary ETH',
        TRUE
    ),
    (
        'wallet-2222-2222-2222-222222222222',
        '22222222-2222-2222-2222-222222222222',
        'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4',
        'bitcoin',
        'BTC Reserve',
        FALSE
    )
ON CONFLICT (user_id, wallet_address) DO NOTHING;

-- Aggressive Alex's wallets (Multiple active)
INSERT INTO connected_wallets (
    id,
    user_id,
    wallet_address,
    blockchain,
    nickname,
    is_primary
) VALUES 
    (
        'wallet-3333-1111-3333-333333333333',
        '33333333-3333-3333-3333-333333333333',
        '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8',
        'ethereum',
        'DeFi Trading',
        TRUE
    ),
    (
        'wallet-3333-2222-3333-333333333333',
        '33333333-3333-3333-3333-333333333333',
        '0x8103683202aa8DA10536036EDeF04CDd865C225E',
        'ethereum',
        'NFT Wallet',
        FALSE
    ),
    (
        'wallet-3333-3333-3333-333333333333',
        '33333333-3333-3333-3333-333333333333',
        'bc1q9h6yzs4d2pnl0v8khntgl7h3k8v6zymtdjy3qm',
        'bitcoin',
        'BTC Speculation',
        FALSE
    )
ON CONFLICT (user_id, wallet_address) DO NOTHING;

-- ============================================
-- SAMPLE WALLET ANALYSES
-- ============================================

INSERT INTO wallet_analyses (
    id,
    user_id,
    wallet_address,
    blockchain,
    analysis_data,
    ai_insights
) VALUES (
    'analysis-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    'bitcoin',
    '{
        "total_transactions": 45,
        "total_received_btc": 2.5,
        "total_sent_btc": 0.8,
        "balance_btc": 1.7,
        "first_transaction": "2023-01-15T10:30:00Z",
        "last_transaction": "2024-01-20T14:22:00Z",
        "avg_transaction_size_btc": 0.055,
        "profit_loss_estimate_usd": 12500
    }'::jsonb,
    'Based on your conservative investment profile, your Bitcoin holdings show a steady accumulation strategy. Key observations:

1. **Low Trading Activity**: Your transaction frequency suggests a "buy and hold" approach, which aligns well with your high risk aversion.

2. **Positive Returns**: Estimated unrealized gains of ~$12,500 indicate good entry timing.

3. **Recommendation**: Consider maintaining your current strategy. With your high diversification preference, you might explore adding a small allocation to Ethereum for additional exposure.

Risk Score: 3/10 (Conservative)'
) ON CONFLICT DO NOTHING;
