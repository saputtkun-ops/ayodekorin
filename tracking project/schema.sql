-- ==========================================================================
-- SAPUTT PROJECT - DATABASE SCHEMA (SQLITE / TURSO LIBSQL COMPATIBLE)
-- ==========================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('Pelaksana', 'Manager'))
);

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    project_id TEXT PRIMARY KEY,
    project_name TEXT NOT NULL,
    location TEXT NOT NULL,
    owner TEXT NOT NULL,
    value INTEGER NOT NULL,
    start_date TEXT NOT NULL, -- YYYY-MM-DD
    end_date TEXT NOT NULL,   -- YYYY-MM-DD
    percentage INTEGER DEFAULT 0
);

-- 3. Tasks Table (Timeline Pekerjaan)
CREATE TABLE IF NOT EXISTS tasks (
    task_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    task_name TEXT NOT NULL,
    volume REAL NOT NULL,
    satuan TEXT NOT NULL,
    bobot REAL NOT NULL,
    status TEXT NOT NULL CHECK(status IN ('Belum Dimulai', 'Berjalan', 'Selesai', 'Tertunda')),
    progress INTEGER DEFAULT 0 CHECK(progress >= 0 AND progress <= 100),
    target_days INTEGER NOT NULL,
    current_day INTEGER DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- 4. Photos Table (Dokumentasi Lapangan)
CREATE TABLE IF NOT EXISTS photos (
    photo_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    task_name TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL, -- YYYY-MM-DD
    image_url TEXT NOT NULL, -- Base64 or Cloud URL
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE
);

-- 5. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK(type IN ('alert-delayed', 'alert-photo', 'alert-progress', 'alert-info')),
    message TEXT NOT NULL,
    time TEXT NOT NULL
);

-- 6. Project History Table (Weekly progress tracking for charts)
CREATE TABLE IF NOT EXISTS project_history (
    history_id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    week INTEGER NOT NULL,
    progress INTEGER NOT NULL CHECK(progress >= 0 AND progress <= 100),
    FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE CASCADE,
    UNIQUE(project_id, week)
);
