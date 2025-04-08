CREATE TABLE IF NOT EXISTS wallet (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency_id character varying(30) NOT NULL,
    currency_name character varying(30) NOT NULL,
    amount NUMERIC(18,8) NOT NULL CHECK (amount >= 0),
    total_spent NUMERIC(18,2) NOT NULL CHECK (total_spent >= 0),
    UNIQUE (user_id, currency_id)
);

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    currency_id character varying(30) NOT NULL,
    currency_name character varying(30) NOT NULL,
    transaction_type TEXT CHECK (transaction_type IN ('buy', 'sell')) NOT NULL,
    amount NUMERIC(18,8) NOT NULL CHECK (amount > 0),
    price_per_unit NUMERIC(18,2) NOT NULL CHECK (price_per_unit > 0),
    total_value NUMERIC(18,2) NOT NULL,
    transaction_date timestamp with time zone DEFAULT NOW()
);

-- ALTER TABLE users ADD COLUMN balance NUMERIC(18,2) DEFAULT 10000;