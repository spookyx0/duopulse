USE duopulse;

-- Insert the two users (passwords are 'password123' encrypted)
INSERT INTO users (email, password, name, avatar_url) VALUES
('quinnreeve@example.com', '$2b$10$ExampleHashForPassword123', 'Quinnreeve', '/avatars/quinnreeve.jpg'),
('aliyah@example.com', '$2b$10$ExampleHashForPassword456', 'Aliyah', '/avatars/aliyah.jpg');

-- Insert sample tasks
INSERT INTO tasks (title, description, status, priority, due_date, created_by, updated_by) VALUES
('Complete project proposal', 'Finish the DuoPulse project proposal document', 'pending', 'high', '2024-12-20 18:00:00', 1, 1),
('Study for exams', 'Prepare for final exams next week', 'in_progress', 'high', '2024-12-22 23:59:00', 2, 2),
('Grocery shopping', 'Buy groceries for the week', 'pending', 'medium', '2024-12-15 20:00:00', 1, 1);

-- Insert sample calendar schedules
INSERT INTO calendar_schedules (title, description, start_time, end_time, location, created_by, updated_by) VALUES
('Team Meeting', 'Weekly team sync meeting', '2024-12-15 10:00:00', '2024-12-15 11:00:00', 'Conference Room A', 1, 1),
('Doctor Appointment', 'Annual checkup', '2024-12-16 14:30:00', '2024-12-16 15:30:00', 'Medical Center', 2, 2);

-- Insert sample daily thoughts
INSERT INTO daily_thoughts (content, mood, created_by, updated_by) VALUES
('Feeling productive today! Completed all morning tasks ahead of schedule.', 'productive', 1, 1),
('Looking forward to the weekend getaway with Quinnreeve!', 'excited', 2, 2);

-- Insert sample chat messages
INSERT INTO chat_messages (message, sender_id, receiver_id, is_read) VALUES
('Hey Aliyah, did you finish the project proposal?', 1, 2, true),
('Almost done! Just need to add the final sections. How about you?', 2, 1, true),
('Working on the backend APIs. Should be done by EOD.', 1, 2, false);