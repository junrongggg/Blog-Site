
-- This makes sure that foreign_key constraints are observed and that errors will be thrown for violations
PRAGMA foreign_keys=ON;

BEGIN TRANSACTION;

--create your tables with SQL commands here (watch out for slight syntactical differences with SQLite)

CREATE TABLE IF NOT EXISTS login_info(
    login_id INTEGER PRIMARY KEY AUTOINCREMENT,
    login_username TEXT NOT NULL UNIQUE,
    login_password VARCHAR
);

CREATE TABLE IF NOT EXISTS readers (
    readers_id INTEGER PRIMARY KEY AUTOINCREMENT,
    readers_comments TEXT NOT NULL,
    readers_commentID INT,
    readers_date DATE

);

CREATE TABLE IF NOT EXISTS articles (
    articles_record_id INTEGER PRIMARY KEY AUTOINCREMENT,
    articles_AuthorName TEXT NOT NULL,
    articles_Title TEXT NOT NULL,
    articles_Subtitle TEXT NOT NULL,
    articles_Content TEXT NOT NULL,
    articles_DateCreated DATE,
    articles_DateModified DATE,
    articles_DatePublished DATE,
    articles_isPublished BOOLEAN,
    articles_likes INT
    
);

CREATE TABLE IF NOT EXISTS blogs(
    blog_id INTEGER PRIMARY KEY AUTOINCREMENT,
    blog_AuthorName TEXT NOT NULL,
    blog_Title TEXT NOT NULL,
    blog_Subtitle TEXT NOT NULL
);

--insert default data (if necessary here)
INSERT INTO blogs ('blog_AuthorName','blog_Title', 'blog_Subtitle') VALUES ('AuthorName', 'title', 'subtitle');

INSERT INTO login_info ('login_username', 'login_password') VALUES ('admin', 'admin123');


COMMIT;

