DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS game;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    score INTEGER NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    board TEXT,
    plays TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

INSERT INTO user (username, score, password) VALUES ('admin', 0, 'admin');
INSERT INTO user (username, score, password) VALUES ('user', 0, 'user');