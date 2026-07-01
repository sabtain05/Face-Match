-- Create database
CREATE DATABASE IF NOT EXISTS facematch;
USE facematch;

-- Images table
CREATE TABLE IF NOT EXISTS images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(255) NOT NULL,
    rating INT DEFAULT 1200,
    matches_played INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_a_id INT NOT NULL,
    image_b_id INT NOT NULL,
    winner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (image_a_id) REFERENCES images(id),
    FOREIGN KEY (image_b_id) REFERENCES images(id),
    FOREIGN KEY (winner_id) REFERENCES images(id)
);

-- Create indexes for better performance
CREATE INDEX idx_rating ON images(rating);
CREATE INDEX idx_matches_played ON images(matches_played);