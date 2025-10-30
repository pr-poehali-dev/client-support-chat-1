-- Add missing display_name column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name VARCHAR(100);

-- Update existing superadmin
UPDATE users SET display_name = 'Супер Админ', role = 'super_admin' WHERE username = '123';

-- Insert sample operators
INSERT INTO users (username, password, role, display_name, status) 
VALUES 
    ('operator1', 'pass123', 'operator', 'Оператор Иван', 'online'),
    ('operator2', 'pass123', 'operator', 'Оператор Мария', 'offline'),
    ('qcc1', 'pass123', 'qcc', 'Контролёр Анна', 'online');