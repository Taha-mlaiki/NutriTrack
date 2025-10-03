-- Create a test user for development
INSERT INTO Users (name, email, password, profile_type, age, gender, weight, height) 
VALUES ('Test User', 'test@example.com', '$2a$10$dummy.hash.for.testing', 'diabetes', 25, 'male', 70.0, 175.0);

-- Create profile settings for the test user
INSERT INTO Profile_Settings (user_id, max_carbs, max_sodium, min_proteins, calorie_target)
VALUES (1, 150.0, 2300.0, 80.0, 2000.0);
