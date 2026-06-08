CREATE DATABASE IF NOT EXISTS FitnessProject 
DEFAULT CHARACTER SET utf8mb4 
DEFAULT COLLATE utf8mb4_unicode_ci;

USE FitnessProject;

-- ==========================================
-- BƯỚC 1: CÁC BẢNG DANH MỤC NỀN
-- ==========================================

-- 1. BẢNG ROLES (Phân quyền)
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- 2. BẢNG PRODUCT_PACKAGES (Các gói hội viên / tập online)
CREATE TABLE product_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type ENUM('MEMBERSHIP', 'ONLINE_WORKOUT') NOT NULL, -- MySQL hỗ trợ ENUM rất tốt
    price DECIMAL(10,2) NOT NULL,
    duration_days INT NOT NULL,
    description TEXT
) ENGINE=InnoDB;

-- 3. BẢNG FOODS (Danh mục món ăn & Dinh dưỡng)
CREATE TABLE foods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE,
    calories INT NOT NULL,
    protein DECIMAL(5,2) DEFAULT 0.0, -- gram
    carbs DECIMAL(5,2) DEFAULT 0.0,   -- gram
    fat DECIMAL(5,2) DEFAULT 0.0      -- gram
) ENGINE=InnoDB;


-- ==========================================
-- BƯỚC 2: BẢNG USERS VÀ CÁC CHỈ SỐ SỨC KHỎE
-- ==========================================

-- 4. BẢNG USERS (Tài khoản Member, PT, Admin)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. BẢNG BODY_METRICS (Hồ sơ chỉ số cơ thể Hội viên)
CREATE TABLE body_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    weight DECIMAL(5,2) NOT NULL,               -- Cân nặng (kg)
    body_fat_percentage DECIMAL(4,2) NULL,     -- % Mỡ cơ thể
    muscle_mass DECIMAL(5,2) NULL,             -- Khối lượng cơ (kg)
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. BẢNG PT_PROFILES (Thông tin bổ sung của PT)
CREATE TABLE pt_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNIQUE,
    bio TEXT,
    experience_years INT,
    rating DECIMAL(3,2) DEFAULT 5.0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ==========================================
-- BƯỚC 3: DỊCH VỤ, ĐẶT LỊCH VÀ BÀI TẬP
-- ==========================================

-- 7. BẢNG ORDERS (Hóa đơn và doanh thu)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    package_id INT,
    price_paid DECIMAL(10,2) NOT NULL,
    payment_status ENUM('PENDING', 'PAID', 'CANCELLED') DEFAULT 'PENDING',
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expired_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (package_id) REFERENCES product_packages(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 8. BẢNG SCHEDULES (Lịch hẹn tập)
CREATE TABLE schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pt_id INT,
    member_id INT,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    meeting_url VARCHAR(512) NULL, -- Link phòng học trực tuyến (Zoom, Google Meet)
    FOREIGN KEY (pt_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 9. BẢNG EXERCISES (Kho bài tập)
CREATE TABLE exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    video_url VARCHAR(255),
    muscle_group VARCHAR(100),
    difficulty ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL,
    duration INT NULL, -- Thời lượng bài tập ước tính (phút)
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. BẢNG WORKOUT_LOGS (Nhật ký tập luyện của Member)
CREATE TABLE workout_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    exercise_id INT,
    sets INT,
    reps INT,
    weight_kg DECIMAL(5,2),
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ==========================================
-- BƯỚC 4: AI & THỰC ĐƠN DINH DƯỠNG MỚI
-- ==========================================

-- 11. BẢNG AI_RECOMMENDATIONS (Lưu vết yêu cầu gọi AI)
CREATE TABLE ai_recommendations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type ENUM('WORKOUT_PLAN', 'NUTRITION_DIET') NOT NULL,
    user_request TEXT,
    ai_response LONGTEXT NOT NULL, -- MySQL lưu chuỗi JSON thô vào LONGTEXT cực tốt
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 12. BẢNG MEAL_SCHEDULES (Lịch trình các bữa ăn)
CREATE TABLE meal_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ai_recommendation_id INT NULL,         
    schedule_name VARCHAR(100) NOT NULL,  
    eat_time TIME NULL,                    
    total_calories_target INT NULL,        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (ai_recommendation_id) REFERENCES ai_recommendations(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 13. BẢNG MENUS (Thực đơn chi tiết liên kết món ăn)
CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_schedule_id INT NOT NULL,         
    food_id INT NOT NULL,                  -- Kết nối tới bảng foods
    amount VARCHAR(50) NOT NULL,          
    is_eaten TINYINT(1) DEFAULT 0,         -- MySQL dùng TINYINT(1) thay cho BIT/BOOLEAN
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (meal_schedule_id) REFERENCES meal_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES foods(id) ON DELETE CASCADE
) ENGINE=InnoDB;


-- ==========================================
-- BƯỚC 5: NẠP DỮ LIỆU NỀN TRÁNH LỖI KHÓA NGOẠI
-- ==========================================
INSERT INTO roles (role_name) VALUES ('ADMIN'), ('PT'), ('MEMBER');

INSERT INTO users (fullname, email, password_hash, phone, role_id) 
VALUES ('Nguyễn Văn Admin', 'admin@fitness.com', 'admin_secure_hash', '0123456789', 1);