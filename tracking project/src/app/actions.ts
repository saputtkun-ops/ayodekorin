'use server';

import { db } from '../lib/db';
import * as schema from '../lib/schema';
import { eq, asc, desc } from 'drizzle-orm';

// Interface matching the client-side Project structure
export interface ClientTask {
  task_id: string;
  task_name: string;
  volume: number;
  satuan: string;
  bobot: number;
  status: 'Belum Dimulai' | 'Berjalan' | 'Selesai' | 'Tertunda' | 'Terlambat';
  progress: number;
  target_days: number;
  current_day: number;
  start_date?: string;
  end_date?: string;
  actual_date?: string;
  notes?: string;
  target_tomorrow?: string;
}

export interface ClientPhoto {
  photo_id: string;
  task_name: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
}

export interface ClientHistoryPoint {
  week: number;
  progress: number;
}

export interface ClientProject {
  project_id: string;
  project_name: string;
  location: string;
  owner: string;
  value: number;
  start_date: string;
  end_date: string;
  percentage: number;
  tasks: ClientTask[];
  photos: ClientPhoto[];
  history: ClientHistoryPoint[];
}

export interface ClientNotification {
  id: string;
  type: 'alert-delayed' | 'alert-photo' | 'alert-progress' | 'alert-info';
  message: string;
  time: string;
}

// ==========================================================================
// 1. Fetch All Projects Data
// ==========================================================================
export async function getProjectsData(): Promise<ClientProject[]> {
  try {
    const allProjects = await db.select().from(schema.projects);
    const projectsData: ClientProject[] = [];

    for (const proj of allProjects) {
      // Fetch Tasks
      const tasks = await db.select()
        .from(schema.tasks)
        .where(eq(schema.tasks.projectId, proj.projectId));

      // Fetch Photos
      const photos = await db.select()
        .from(schema.photos)
        .where(eq(schema.photos.projectId, proj.projectId));

      // Fetch History
      const history = await db.select()
        .from(schema.projectHistory)
        .where(eq(schema.projectHistory.projectId, proj.projectId))
        .orderBy(asc(schema.projectHistory.week));

      projectsData.push({
        project_id: proj.projectId,
        project_name: proj.projectName,
        location: proj.location,
        owner: proj.owner,
        value: proj.value,
        start_date: proj.startDate,
        end_date: proj.endDate,
        percentage: proj.percentage || 0,
        tasks: tasks.map(t => ({
          task_id: t.taskId,
          task_name: t.taskName,
          volume: t.volume,
          satuan: t.satuan,
          bobot: t.bobot,
          status: t.status as ClientTask['status'],
          progress: t.progress || 0,
          target_days: t.targetDays,
          current_day: t.currentDay || 0,
          start_date: t.startDate || undefined,
          end_date: t.endDate || undefined,
          actual_date: t.actualDate || undefined,
          notes: t.notes || undefined,
          target_tomorrow: t.targetTomorrow || undefined,
        })),
        photos: photos.map(ph => ({
          photo_id: ph.photoId,
          task_name: ph.taskName,
          description: ph.description || '',
          date: ph.date,
          location: proj.location.split(',')[0],
          image_url: ph.imageUrl,
        })),
        history: history.map(h => ({
          week: h.week,
          progress: h.progress,
        })),
      });
    }

    return projectsData;
  } catch (error) {
    console.error("Gagal memuat data proyek dari database:", error);
    return [];
  }
}

// ==========================================================================
// 2. Fetch All Notifications
// ==========================================================================
export async function getNotificationsData(): Promise<ClientNotification[]> {
  try {
    const notifs = await db.select()
      .from(schema.notifications)
      .limit(20); // Batasi 20 notifikasi terbaru jika data membengkak

    return notifs.map(n => ({
      id: n.id,
      type: n.type as ClientNotification['type'],
      message: n.message,
      time: n.time,
    }));
  } catch (error) {
    console.error("Gagal memuat data notifikasi dari database:", error);
    return [];
  }
}

// ==========================================================================
// 3. Save New Project
// ==========================================================================
export async function saveNewProjectAction(projectData: Omit<ClientProject, 'tasks' | 'photos' | 'history'>, initialNotif: ClientNotification): Promise<boolean> {
  try {
    await db.insert(schema.projects).values({
      projectId: projectData.project_id,
      projectName: projectData.project_name,
      location: projectData.location,
      owner: projectData.owner,
      value: projectData.value,
      startDate: projectData.start_date,
      endDate: projectData.end_date,
      percentage: projectData.percentage,
    });

    await db.insert(schema.notifications).values({
      id: initialNotif.id,
      type: initialNotif.type,
      message: initialNotif.message,
      time: initialNotif.time,
    });

    return true;
  } catch (error) {
    console.error("Gagal menyimpan proyek baru ke database:", error);
    return false;
  }
}

// ==========================================================================
// 4. Save Project Info Edits
// ==========================================================================
export async function saveProjectInfoAction(
  projectId: string,
  info: { projectName: string; location: string; owner: string; value: number; startDate: string; endDate: string },
  notif: ClientNotification
): Promise<boolean> {
  try {
    await db.update(schema.projects)
      .set({
        projectName: info.projectName,
        location: info.location,
        owner: info.owner,
        value: info.value,
        startDate: info.startDate,
        endDate: info.endDate,
      })
      .where(eq(schema.projects.projectId, projectId));

    await db.insert(schema.notifications).values({
      id: notif.id,
      type: notif.type,
      message: notif.message,
      time: notif.time,
    });

    return true;
  } catch (error) {
    console.error("Gagal memperbarui info proyek di database:", error);
    return false;
  }
}

// ==========================================================================
// 5. Add New Task / Milestone
// ==========================================================================
export async function addTaskAction(
  projectId: string,
  task: ClientTask,
  projectPercentage: number,
  notif: ClientNotification
): Promise<boolean> {
  try {
    await db.insert(schema.tasks).values({
      taskId: task.task_id,
      projectId: projectId,
      taskName: task.task_name,
      volume: task.volume,
      satuan: task.satuan,
      bobot: task.bobot,
      status: task.status,
      progress: task.progress,
      targetDays: task.target_days,
      currentDay: task.current_day,
      startDate: task.start_date || null,
      endDate: task.end_date || null,
    });

    await db.update(schema.projects)
      .set({ percentage: projectPercentage })
      .where(eq(schema.projects.projectId, projectId));

    await db.insert(schema.notifications).values({
      id: notif.id,
      type: notif.type,
      message: notif.message,
      time: notif.time,
    });

    return true;
  } catch (error) {
    console.error("Gagal menambahkan milestone ke database:", error);
    return false;
  }
}

// ==========================================================================
// 6. Delete Task / Milestone
// ==========================================================================
export async function deleteTaskAction(
  projectId: string,
  taskId: string,
  projectPercentage: number,
  notif: ClientNotification
): Promise<boolean> {
  try {
    await db.delete(schema.tasks).where(eq(schema.tasks.taskId, taskId));

    await db.update(schema.projects)
      .set({ percentage: projectPercentage })
      .where(eq(schema.projects.projectId, projectId));

    await db.insert(schema.notifications).values({
      id: notif.id,
      type: notif.type,
      message: notif.message,
      time: notif.time,
    });

    return true;
  } catch (error) {
    console.error("Gagal menghapus milestone dari database:", error);
    return false;
  }
}

// ==========================================================================
// 7. Equalize Weights of Project Tasks
// ==========================================================================
export async function equalizeWeightsAction(
  projectId: string,
  tasksToUpdate: { taskId: string; bobot: number }[],
  projectPercentage: number,
  notif: ClientNotification
): Promise<boolean> {
  try {
    for (const t of tasksToUpdate) {
      await db.update(schema.tasks)
        .set({ bobot: t.bobot })
        .where(eq(schema.tasks.taskId, t.taskId));
    }

    await db.update(schema.projects)
      .set({ percentage: projectPercentage })
      .where(eq(schema.projects.projectId, projectId));

    await db.insert(schema.notifications).values({
      id: notif.id,
      type: notif.type,
      message: notif.message,
      time: notif.time,
    });

    return true;
  } catch (error) {
    console.error("Gagal meratakan bobot milestone di database:", error);
    return false;
  }
}

// ==========================================================================
// 8. Save Mobile Progress, Photos, History, and Notifications
// ==========================================================================
export async function saveMobileProgressAction(
  projectId: string,
  taskId: string,
  taskUpdates: {
    progress: number;
    status: 'Belum Dimulai' | 'Berjalan' | 'Selesai' | 'Tertunda' | 'Terlambat';
    current_day: number;
    notes?: string;
    target_tomorrow?: string;
    actual_date?: string;
  },
  projectPercentage: number,
  historyUpdates: ClientHistoryPoint[],
  photoToInsert: Omit<ClientPhoto, 'location'> | null,
  notifsToInsert: ClientNotification[]
): Promise<boolean> {
  try {
    // Update task
    await db.update(schema.tasks)
      .set({
        progress: taskUpdates.progress,
        status: taskUpdates.status,
        currentDay: taskUpdates.current_day,
        notes: taskUpdates.notes || null,
        targetTomorrow: taskUpdates.target_tomorrow || null,
        actualDate: taskUpdates.actual_date || null,
      })
      .where(eq(schema.tasks.taskId, taskId));

    // Update project percentage
    await db.update(schema.projects)
      .set({ percentage: projectPercentage })
      .where(eq(schema.projects.projectId, projectId));

    // Upsert project history points
    for (const h of historyUpdates) {
      const historyId = `hist-${projectId}-${h.week}`;
      await db.insert(schema.projectHistory)
        .values({
          historyId,
          projectId,
          week: h.week,
          progress: h.progress,
        })
        .onConflictDoUpdate({
          target: [schema.projectHistory.projectId, schema.projectHistory.week],
          set: { progress: h.progress },
        });
    }

    // Insert photo if uploaded
    if (photoToInsert) {
      await db.insert(schema.photos).values({
        photoId: photoToInsert.photo_id,
        projectId: projectId,
        taskName: photoToInsert.task_name,
        description: photoToInsert.description,
        date: photoToInsert.date,
        imageUrl: photoToInsert.image_url,
      });
    }

    // Insert notifications
    for (const n of notifsToInsert) {
      await db.insert(schema.notifications).values({
        id: n.id,
        type: n.type,
        message: n.message,
        time: n.time,
      });
    }

    return true;
  } catch (error) {
    console.error("Gagal memperbarui progres mobile dan sinkronisasi database:", error);
    return false;
  }
}
