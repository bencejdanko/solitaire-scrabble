DROP TABLE IF EXISTS user;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    score INTEGER NOT NULL,
    password TEXT NOT NULL
);

INSERT INTO user (username, score, password) VALUES ('bence', 0, '123');
INSERT INTO user (username, score, password) VALUES ('john', 0, '123');
INSERT INTO user (username, score, password) VALUES ('pablo', 0, '123');
INSERT INTO user (username, score, password) VALUES ('picasso', 0, '123');