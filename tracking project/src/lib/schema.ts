import { sqliteTable, text, integer, real, unique } from 'drizzle-orm/sqlite-core';

// 1. Users Table
export const users = sqliteTable('users', {
  userId: text('user_id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  role: text('role', { enum: ['Pelaksana', 'Manager'] }).notNull(),
});

// 2. Projects Table
export const projects = sqliteTable('projects', {
  projectId: text('project_id').primaryKey(),
  projectName: text('project_name').notNull(),
  location: text('location').notNull(),
  owner: text('owner').notNull(),
  value: integer('value').notNull(),
  startDate: text('start_date').notNull(), // YYYY-MM-DD
  endDate: text('end_date').notNull(),     // YYYY-MM-DD
  percentage: integer('percentage').default(0),
});

// 3. Tasks Table (Timeline Pekerjaan / Milestone)
export const tasks = sqliteTable('tasks', {
  taskId: text('task_id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.projectId, { onDelete: 'cascade' }),
  taskName: text('task_name').notNull(),
  volume: real('volume').notNull(),
  satuan: text('satuan').notNull(),
  bobot: real('bobot').notNull(),
  status: text('status', { enum: ['Belum Dimulai', 'Berjalan', 'Selesai', 'Tertunda', 'Terlambat'] }).notNull(),
  progress: integer('progress').default(0),
  targetDays: integer('target_days').notNull(),
  currentDay: integer('current_day').default(0),
  startDate: text('start_date'), // YYYY-MM-DD
  endDate: text('end_date'),     // YYYY-MM-DD
  actualDate: text('actual_date'), // YYYY-MM-DD
  notes: text('notes'),
  targetTomorrow: text('target_tomorrow'),
});

// 4. Photos Table (Dokumentasi Lapangan)
export const photos = sqliteTable('photos', {
  photoId: text('photo_id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.projectId, { onDelete: 'cascade' }),
  taskName: text('task_name').notNull(),
  description: text('description'),
  date: text('date').notNull(), // YYYY-MM-DD
  imageUrl: text('image_url').notNull(), // Base64 or Cloud URL
});

// 5. Notifications Table
export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  type: text('type', { enum: ['alert-delayed', 'alert-photo', 'alert-progress', 'alert-info'] }).notNull(),
  message: text('message').notNull(),
  time: text('time').notNull(),
});

// 6. Project History Table (Weekly progress tracking for charts)
export const projectHistory = sqliteTable('project_history', {
  historyId: text('history_id').primaryKey(),
  projectId: text('project_id').notNull().references(() => projects.projectId, { onDelete: 'cascade' }),
  week: integer('week').notNull(),
  progress: integer('progress').notNull(),
}, (t) => [
  unique('project_week_unique').on(t.projectId, t.week),
]);
