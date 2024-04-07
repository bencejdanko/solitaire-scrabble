DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS game;
DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS plays;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    score INTEGER NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE boards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    board TEXT NOT NULL,
    session_id TEXT NOT NULL,
    FOREIGN KEY (session_id) REFERENCES plays(id)
);

CREATE TABLE plays (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    board_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (board_id) REFERENCES boards(id)
);

CREATE TABLE game (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    board TEXT,
    starting_sequence TEXT,
    hand TEXT,
    sequence TEXT,
    score INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
);

INSERT INTO user (username, score, password) VALUES ('admin', 0, 'admin');
INSERT INTO user (username, score, password) VALUES ('user', 0, 'user');