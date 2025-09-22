CREATE DATABASE IF NOT EXISTS nutritrack;
USE nutritrack;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('patient','athlete','doctor') DEFAULT 'patient',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profiles table
CREATE TABLE profiles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  goal ENUM('weight_loss','muscle_gain','maintenance') DEFAULT 'maintenance',
  chronic_condition ENUM('none','diabetes','hypertension','obesity') DEFAULT 'none',
  calories_target INT,
  protein_target FLOAT,
  carb_target FLOAT,
  fat_target FLOAT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Meals table
CREATE TABLE meals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  meal_time DATETIME DEFAULT CURRENT_TIMESTAMP,
  description TEXT,
  image_path VARCHAR(255),
  total_calories FLOAT,
  carbs FLOAT,
  proteins FLOAT,
  fats FLOAT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Recommendations table
CREATE TABLE recommendations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  recommendation TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Reports table
CREATE TABLE reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  week_start DATE,
  week_end DATE,
  avg_calories FLOAT,
  avg_protein FLOAT,
  avg_carbs FLOAT,
  avg_fats FLOAT,
  alerts TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
