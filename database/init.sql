-- Kreditheld24 Database Initialization
-- This script sets up the initial database schema

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create interest_rates table for storing scraped data
CREATE TABLE IF NOT EXISTS interest_rates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    kreditart VARCHAR(100) NOT NULL,
    bank VARCHAR(100) NOT NULL,
    min_zins DECIMAL(5,2) NOT NULL,
    max_zins DECIMAL(5,2) NOT NULL,
    rep_zins DECIMAL(5,2) NOT NULL,
    laufzeit_min INTEGER NOT NULL,
    laufzeit_max INTEGER NOT NULL,
    min_summe INTEGER NOT NULL,
    max_summe INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_interest_rates_source ON interest_rates(source);
CREATE INDEX IF NOT EXISTS idx_interest_rates_kreditart ON interest_rates(kreditart);
CREATE INDEX IF NOT EXISTS idx_interest_rates_created_at ON interest_rates(created_at);
CREATE INDEX IF NOT EXISTS idx_interest_rates_source_date ON interest_rates(source, created_at);

-- Create scraping_logs table for monitoring
CREATE TABLE IF NOT EXISTS scraping_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source VARCHAR(50) NOT NULL,
    success BOOLEAN NOT NULL,
    rate_count INTEGER DEFAULT 0,
    error_message TEXT,
    duration_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for scraping logs
CREATE INDEX IF NOT EXISTS idx_scraping_logs_source ON scraping_logs(source);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_created_at ON scraping_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_scraping_logs_success ON scraping_logs(success);

-- Create email_verifications table (from existing system)
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    form_data JSONB,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_TIMESTAMP + INTERVAL '24 hours')
);

-- Create index for email verifications
CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token);
CREATE INDEX IF NOT EXISTS idx_email_verifications_email ON email_verifications(email);
CREATE INDEX IF NOT EXISTS idx_email_verifications_expires_at ON email_verifications(expires_at);

-- Create credit_applications table for storing form submissions
CREATE TABLE IF NOT EXISTS credit_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    form_data JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for credit applications
CREATE INDEX IF NOT EXISTS idx_credit_applications_email ON credit_applications(email);
CREATE INDEX IF NOT EXISTS idx_credit_applications_status ON credit_applications(status);
CREATE INDEX IF NOT EXISTS idx_credit_applications_created_at ON credit_applications(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_interest_rates_updated_at 
    BEFORE UPDATE ON interest_rates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_credit_applications_updated_at 
    BEFORE UPDATE ON credit_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for latest rates by source
CREATE OR REPLACE VIEW latest_rates_by_source AS
SELECT DISTINCT ON (source, kreditart, bank) 
    id,
    source,
    kreditart,
    bank,
    min_zins,
    max_zins,
    rep_zins,
    laufzeit_min,
    laufzeit_max,
    min_summe,
    max_summe,
    created_at
FROM interest_rates
ORDER BY source, kreditart, bank, created_at DESC;

-- Create view for scraping statistics
CREATE OR REPLACE VIEW scraping_statistics AS
SELECT 
    source,
    DATE(created_at) as scrape_date,
    COUNT(*) as total_attempts,
    SUM(CASE WHEN success THEN 1 ELSE 0 END) as successful_attempts,
    SUM(CASE WHEN success THEN rate_count ELSE 0 END) as total_rates_scraped,
    AVG(CASE WHEN success THEN duration_ms ELSE NULL END) as avg_duration_ms
FROM scraping_logs
GROUP BY source, DATE(created_at)
ORDER BY scrape_date DESC, source;

-- Insert some sample data for testing (optional)
-- INSERT INTO interest_rates (source, kreditart, bank, min_zins, max_zins, rep_zins, laufzeit_min, laufzeit_max, min_summe, max_summe)
-- VALUES 
--     ('demo', 'Ratenkredit', 'Demo Bank', 2.99, 9.99, 5.99, 12, 120, 1000, 100000),
--     ('demo', 'Autokredit', 'Demo Auto', 1.99, 7.99, 4.49, 12, 96, 5000, 150000);

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO kreditheld;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO kreditheld;
-- GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO kreditheld;

COMMIT;