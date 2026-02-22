-- db/seed.sql

INSERT INTO app_user (email, display_name) VALUES
('blake@example.com', 'Blake Rogers'),
('brodie@example.com', 'Brodie Newman'),
('matt@example.com', 'Matt Vance');

INSERT INTO app (app_name, platform, icon_url) VALUES
('Instagram', 'iOS', 'https://example.com/icons/instagram.png'),
('Discord', 'Desktop', 'https://example.com/icons/discord.png'),
('YouTube', 'Android', 'https://example.com/icons/youtube.png'),
('Spotify', 'iOS', 'https://example.com/icons/spotify.png');

INSERT INTO user_app (user_id, app_id, is_social, category) VALUES
(1, 1, TRUE, 'social'),
(1, 2, TRUE, 'communication'),
(1, 3, FALSE, 'video'),
(2, 2, TRUE, 'communication'),
(3, 4, FALSE, 'music');

INSERT INTO purpose (user_id, purpose_text, is_active) VALUES
(1, 'Reply to messages and log off', TRUE),
(1, 'Watch one tutorial only', TRUE),
(2, 'Coordinate group project tasks', TRUE),
(3, 'Listen while studying', TRUE);

INSERT INTO daily_app_stat (user_id, app_id, stat_date, pickups, time_seconds) VALUES
(1, 1, CURRENT_DATE - INTERVAL '1 day', 18, 4200),
(1, 2, CURRENT_DATE - INTERVAL '1 day', 12, 1800),
(1, 3, CURRENT_DATE - INTERVAL '1 day', 6, 3600),
(2, 2, CURRENT_DATE - INTERVAL '1 day', 9, 2400),
(3, 4, CURRENT_DATE - INTERVAL '1 day', 4, 5400);

INSERT INTO goal (
    user_id, app_id, goal_text, goal_type, target_value,
    window_start, window_end, recurrence, is_active
) VALUES
(1, 1, 'Limit Instagram use before class', 'time_limit_minutes', 20, '07:00', '12:00', 'daily', TRUE),
(1, 2, 'Check Discord only for project updates', 'pickup_limit', 5, '08:00', '18:00', 'weekdays', TRUE),
(2, 2, 'Use Discord for team coordination only', 'time_limit_minutes', 30, '09:00', '22:00', 'daily', TRUE),
(3, 4, 'Spotify only during study block', 'time_limit_minutes', 90, '18:00', '23:00', 'daily', TRUE);

INSERT INTO recommendation (user_id, app_id, recommendation_text, source, is_accepted) VALUES
(1, 1, 'Try setting a 20 minute timer before opening Instagram.', 'system', TRUE),
(1, 2, 'Mute non project channels during study time.', 'system', FALSE),
(2, 2, 'Batch message replies twice per day.', 'coach', FALSE),
(3, 4, 'Use a focus playlist with no lyrics.', 'system', TRUE);

INSERT INTO focus_session (
    user_id, purpose_id, app_name, planned_minutes, started_at, ended_at, actual_seconds, end_reason
) VALUES
(1, 1, 'Instagram', 15, CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes', 900, 'completed'),
(1, 2, 'YouTube', 20, CURRENT_TIMESTAMP - INTERVAL '1 hour', CURRENT_TIMESTAMP - INTERVAL '50 minutes', 600, 'ended_early'),
(2, 3, 'Discord', 25, CURRENT_TIMESTAMP - INTERVAL '3 hours', CURRENT_TIMESTAMP - INTERVAL '2 hours 35 minutes', 1500, 'completed'),
(3, 4, 'Spotify', 30, CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours 20 minutes', 2400, 'completed');

INSERT INTO session_rating (session_id, rating_value, notes) VALUES
(1, 5, 'Stayed on task the whole time'),
(2, 3, 'Got distracted midway'),
(3, 4, 'Pretty focused, good session'),
(4, 5, 'Great study music session');