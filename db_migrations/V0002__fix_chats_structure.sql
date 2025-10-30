-- Fix chats table structure
ALTER TABLE chats ADD COLUMN IF NOT EXISTS operator_id INTEGER;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS topic VARCHAR(255);
ALTER TABLE chats ADD COLUMN IF NOT EXISTS postponed_until TIMESTAMP;
ALTER TABLE chats ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP;

-- Update messages sender_id to integer if needed
ALTER TABLE messages ALTER COLUMN sender_id TYPE INTEGER USING sender_id::INTEGER;