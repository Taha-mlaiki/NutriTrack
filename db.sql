-- Users table: Stores user information and profile type
CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    profile_type ENUM('diabetes', 'hypertension', 'obesity', 'athlete', 'weight_loss', 'muscle_gain') NOT NULL,
    age INT,
    gender ENUM('male', 'female', 'other'),
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Profile_Settings table: Stores user-specific goals and constraints
CREATE TABLE Profile_Settings (
    profile_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    max_carbs DECIMAL(6,2),
    max_sodium DECIMAL(6,2),
    min_proteins DECIMAL(6,2),
    calorie_target DECIMAL(6,2),
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- Food_Items table: Stores details of foods for meal analysis
CREATE TABLE Food_Items (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    calories_per_unit DECIMAL(6,2),
    carbs DECIMAL(6,2),
    proteins DECIMAL(6,2),
    fats DECIMAL(6,2),
    sodium DECIMAL(6,2),
    fiber DECIMAL(6,2),
    glycemic_index INT
);

-- Meals table: Stores meal data with nutritional analysis
CREATE TABLE Meals (
    meal_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255),
    calories DECIMAL(6,2),
    carbs DECIMAL(6,2),
    proteins DECIMAL(6,2),
    fats DECIMAL(6,2),
    sodium DECIMAL(6,2),
    fiber DECIMAL(6,2),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Meal_Food_Associations table: Links meals to specific food items
CREATE TABLE Meal_Food_Associations (
    meal_id INT NOT NULL,
    food_id INT NOT NULL,
    quantity DECIMAL(6,2) NOT NULL,
    PRIMARY KEY (meal_id, food_id),
    FOREIGN KEY (meal_id) REFERENCES Meals(meal_id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES Food_Items(food_id) ON DELETE RESTRICT
);

-- Recommendations table: Stores dynamic recommendations
CREATE TABLE Recommendations (
    recommendation_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    meal_id INT,
    type ENUM('pre_workout', 'post_workout', 'medical_alert', 'weight_adjustment', 'hydration') NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (meal_id) REFERENCES Meals(meal_id) ON DELETE SET NULL
);

-- Nutrient_Tracking table: Tracks daily/weekly nutrient intake
CREATE TABLE Nutrient_Tracking (
    tracking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    nutrient_type ENUM('calories', 'carbs', 'proteins', 'fats', 'sodium', 'fiber') NOT NULL,
    amount DECIMAL(6,2) NOT NULL,
    goal_status ENUM('met', 'exceeded', 'deficient') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- Reports table: Stores weekly reports
CREATE TABLE Reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    week_start_date DATE NOT NULL,
    weight DECIMAL(5,2),
    bmi DECIMAL(4,2),
    muscle_mass DECIMAL(5,2),
    glycemic_trends TEXT,
    sodium_intake DECIMAL(6,2),
    charts_data JSON,
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);