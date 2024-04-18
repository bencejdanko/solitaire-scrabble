DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS sequences;
DROP TABLE IF EXISTS boards;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    score INTEGER NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE sequences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sequence TEXT NOT NULL
);

CREATE TABLE boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board TEXT NOT NULL
);

CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    board_id INTEGER NOT NULL,
    sequence_id INTEGER NOT NULL,
    played_words TEXT,
    score INTEGER NOT NULL,
    complete BOOLEAN NOT NULL DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (board_id) REFERENCES boards(id),
    FOREIGN KEY (sequence_id) REFERENCES sequences(id)
);

INSERT INTO user (username, score, password) VALUES ('admin', 0, 'admin');
INSERT INTO user (username, score, password) VALUES ('user', 0, 'user');