CREATE DATABASE structor_db;

USE structor_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    domain VARCHAR(255) UNIQUE,
    pages JSON,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

INSERT INTO users (username, phone, password) VALUES ('testuser', '+77071234567', '$2y$10$...'); -- Hashed password