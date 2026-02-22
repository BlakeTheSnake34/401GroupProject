-- db/schema.sql

DROP TABLE IF EXISTS session_rating;
DROP TABLE IF EXISTS focus_session;
DROP TABLE IF EXISTS recommendation;
DROP TABLE IF EXISTS goal;
DROP TABLE IF EXISTS daily_app_stat;
DROP TABLE IF EXISTS purpose;
DROP TABLE IF EXISTS user_app;
DROP TABLE IF EXISTS app_user;
DROP TABLE IF EXISTS app;

CREATE TABLE app_user (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE app (
    app_id SERIAL PRIMARY KEY,
    app_name VARCHAR(100) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    icon_url VARCHAR(255)
);

CREATE TABLE user_app (
    user_app_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    app_id INT NOT NULL,
    is_social BOOLEAN NOT NULL DEFAULT FALSE,
    category VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_app_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT fk_user_app_app
        FOREIGN KEY (app_id) REFERENCES app(app_id)
);

CREATE TABLE purpose (
    purpose_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    purpose_text VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_purpose_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id)
);

CREATE TABLE daily_app_stat (
    daily_app_stat_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    app_id INT NOT NULL,
    stat_date DATE NOT NULL,
    pickups INT NOT NULL DEFAULT 0,
    time_seconds INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_daily_stat_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT fk_daily_stat_app
        FOREIGN KEY (app_id) REFERENCES app(app_id),
    CONSTRAINT uq_daily_stat UNIQUE (user_id, app_id, stat_date)
);

CREATE TABLE goal (
    goal_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    app_id INT NOT NULL,
    goal_text VARCHAR(255) NOT NULL,
    goal_type VARCHAR(50) NOT NULL,
    target_value INT NOT NULL,
    window_start TIME NOT NULL,
    window_end TIME NOT NULL,
    recurrence VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_goal_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT fk_goal_app
        FOREIGN KEY (app_id) REFERENCES app(app_id)
);

CREATE TABLE recommendation (
    recommendation_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    app_id INT NOT NULL,
    recommendation_text VARCHAR(255) NOT NULL,
    source VARCHAR(100),
    is_accepted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recommendation_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT fk_recommendation_app
        FOREIGN KEY (app_id) REFERENCES app(app_id)
);

CREATE TABLE focus_session (
    session_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    purpose_id INT NOT NULL,
    planned_minutes INT NOT NULL,
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    actual_seconds INT,
    end_reason VARCHAR(100),
    CONSTRAINT fk_focus_session_user
        FOREIGN KEY (user_id) REFERENCES app_user(user_id),
    CONSTRAINT fk_focus_session_purpose
        FOREIGN KEY (purpose_id) REFERENCES purpose(purpose_id)
);

CREATE TABLE session_rating (
    rating_id SERIAL PRIMARY KEY,
    session_id INT NOT NULL,
    rating_value INT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(255),
    CONSTRAINT fk_session_rating_session
        FOREIGN KEY (session_id) REFERENCES focus_session(session_id)
);