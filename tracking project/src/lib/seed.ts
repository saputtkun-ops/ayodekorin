import { db } from "./db";
import fs from "fs";
import path from "path";

// Default Mock Data for Seeding
const SEED_PROJECTS = [
  {
    project_id: "proj-1",
    project_name: "Rumah Tinggal Modern A",
    location: "Kebayoran Baru, Jakarta Selatan",
    owner: "Bapak H. Ahmad",
    value: 750000000,
    start_date: "2026-05-01",
    end_date: "2026-08-15",
    percentage: 78,
    tasks: [
      { task_id: "t1-1", task_name: "Persiapan", volume: 1, satuan: "Lump Sum", bobot: 5, status: "Selesai", progress: 100, target_days: 7, current_day: 7 },
      { task_id: "t1-2", task_name: "Galian Tanah", volume: 45, satuan: "m3", bobot: 5, status: "Selesai", progress: 100, target_days: 10, current_day: 10 },
      { task_id: "t1-3", task_name: "Pondasi Batu Kali", volume: 38, satuan: "m3", bobot: 15, status: "Selesai", progress: 100, target_days: 14, current_day: 14 },
      { task_id: "t1-4", task_name: "Sloof Beton 15/20", volume: 4.8, satuan: "m3", bobot: 10, status: "Berjalan", progress: 75, target_days: 14, current_day: 8 },
      { task_id: "t1-5", task_name: "Kolom Struktur 15/15", volume: 3.2, satuan: "m3", bobot: 10, status: "Berjalan", progress: 50, target_days: 14, current_day: 10 },
      { task_id: "t1-6", task_name: "Balok Beton 15/20", volume: 4.2, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 14, current_day: 0 },
      { task_id: "t1-7", task_name: "Plat Lantai Beton", volume: 12.5, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 20, current_day: 0 },
      { task_id: "t1-8", task_name: "Dinding Bata & Plesteran", volume: 240, satuan: "m2", bobot: 15, status: "Belum Dimulai", progress: 0, target_days: 25, current_day: 0 },
      { task_id: "t1-9", task_name: "Atap Baja Ringan & Genteng", volume: 110, satuan: "m2", bobot: 15, status: "Belum Dimulai", progress: 0, target_days: 15, current_day: 0 },
      { task_id: "t1-10", task_name: "Finishing (Keramik & Cat)", volume: 150, satuan: "m2", bobot: 5, status: "Belum Dimulai", progress: 0, target_days: 20, current_day: 0 }
    ],
    photos: [
      { photo_id: "p1-1", task_name: "Pondasi Batu Kali", description: "Pekerjaan pondasi batu kali selesai 100%", date: "2026-05-18", location: "Kebayoran Baru", image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400" },
      { photo_id: "p1-2", task_name: "Sloof Beton 15/20", description: "Pemasangan bekisting sloof area timur selesai", date: "2026-06-24", location: "Kebayoran Baru", image_url: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?w=400" }
    ],
    history: [
      { week: 1, progress: 10 },
      { week: 2, progress: 25 },
      { week: 3, progress: 48 },
      { week: 4, progress: 62 },
      { week: 5, progress: 78 }
    ]
  },
  {
    project_id: "proj-2",
    project_name: "Pembangunan Ruko 2 Lantai B",
    location: "Kebayoran Lama, Jakarta Selatan",
    owner: "Ibu Diana Lestari",
    value: 1200000000,
    start_date: "2026-06-01",
    end_date: "2026-11-15",
    percentage: 45,
    tasks: [
      { task_id: "t2-1", task_name: "Persiapan", volume: 1, satuan: "Lump Sum", bobot: 5, status: "Selesai", progress: 100, target_days: 7, current_day: 7 },
      { task_id: "t2-2", task_name: "Galian Tanah", volume: 90, satuan: "m3", bobot: 5, status: "Selesai", progress: 100, target_days: 12, current_day: 12 },
      { task_id: "t2-3", task_name: "Pondasi Batu Kali", volume: 75, satuan: "m3", bobot: 15, status: "Berjalan", progress: 80, target_days: 20, current_day: 18 },
      { task_id: "t2-4", task_name: "Sloof Beton 15/20", volume: 8.5, satuan: "m3", bobot: 10, status: "Berjalan", progress: 30, target_days: 15, current_day: 14 },
      { task_id: "t2-5", task_name: "Kolom Struktur 15/15", volume: 6.8, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 15, current_day: 0 },
      { task_id: "t2-6", task_name: "Balok Beton 15/20", volume: 7.2, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 15, current_day: 0 },
      { task_id: "t2-7", task_name: "Plat Lantai Beton", volume: 22.4, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 25, current_day: 0 },
      { task_id: "t2-8", task_name: "Dinding Bata & Plesteran", volume: 480, satuan: "m2", bobot: 15, status: "Belum Dimulai", progress: 0, target_days: 30, current_day: 0 },
      { task_id: "t2-9", task_name: "Atap Baja Ringan & Genteng", volume: 180, satuan: "m2", bobot: 15, status: "Belum Dimulai", progress: 0, target_days: 20, current_day: 0 },
      { task_id: "t2-10", task_name: "Finishing (Keramik & Cat)", volume: 300, satuan: "m2", bobot: 5, status: "Belum Dimulai", progress: 0, target_days: 25, current_day: 0 }
    ],
    photos: [
      { photo_id: "p2-1", task_name: "Galian Tanah", description: "Pekerjaan galian struktur ruko selesai", date: "2026-06-10", location: "Kebayoran Lama", image_url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400" }
    ],
    history: [
      { week: 1, progress: 5 },
      { week: 2, progress: 15 },
      { week: 3, progress: 30 },
      { week: 4, progress: 45 }
    ]
  },
  {
    project_id: "proj-3",
    project_name: "Renovasi Kantor PT C",
    location: "Thamrin, Jakarta Pusat",
    owner: "PT Cipta Swakarsa",
    value: 450000000,
    start_date: "2026-04-15",
    end_date: "2026-07-15",
    percentage: 90,
    tasks: [
      { task_id: "t3-1", task_name: "Persiapan", volume: 1, satuan: "Lump Sum", bobot: 5, status: "Selesai", progress: 100, target_days: 5, current_day: 5 },
      { task_id: "t3-2", task_name: "Galian Tanah", volume: 10, satuan: "m3", bobot: 5, status: "Selesai", progress: 100, target_days: 5, current_day: 5 },
      { task_id: "t3-3", task_name: "Pondasi Batu Kali", volume: 12, satuan: "m3", bobot: 15, status: "Selesai", progress: 100, target_days: 10, current_day: 10 },
      { task_id: "t3-4", task_name: "Sloof Beton 15/20", volume: 2.5, satuan: "m3", bobot: 10, status: "Selesai", progress: 100, target_days: 10, current_day: 10 },
      { task_id: "t3-5", task_name: "Kolom Struktur 15/15", volume: 1.8, satuan: "m3", bobot: 10, status: "Selesai", progress: 100, target_days: 10, current_day: 10 },
      { task_id: "t3-6", task_name: "Balok Beton 15/20", volume: 2.2, satuan: "m3", bobot: 10, status: "Selesai", progress: 100, target_days: 10, current_day: 10 },
      { task_id: "t3-7", task_name: "Plat Lantai Beton", volume: 6.5, satuan: "m3", bobot: 10, status: "Selesai", progress: 100, target_days: 12, current_day: 12 },
      { task_id: "t3-8", task_name: "Dinding Bata & Plesteran", volume: 120, satuan: "m2", bobot: 15, status: "Selesai", progress: 100, target_days: 15, current_day: 15 },
      { task_id: "t3-9", task_name: "Atap Baja Ringan & Genteng", volume: 60, satuan: "m2", bobot: 15, status: "Selesai", progress: 100, target_days: 12, current_day: 12 },
      { task_id: "t3-10", task_name: "Finishing (Keramik & Cat)", volume: 80, satuan: "m2", bobot: 5, status: "Berjalan", progress: 0, target_days: 15, current_day: 2 }
    ],
    photos: [
      { photo_id: "p3-1", task_name: "Dinding Bata", description: "Plesteran dinding lantai 2", date: "2026-06-05", location: "Thamrin", image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" }
    ],
    history: [
      { week: 1, progress: 15 },
      { week: 2, progress: 35 },
      { week: 3, progress: 55 },
      { week: 4, progress: 70 },
      { week: 5, progress: 85 },
      { week: 6, progress: 90 }
    ]
  }
];

const SEED_NOTIFICATIONS = [
  { id: "n-1", type: "alert-delayed", message: "Pekerjaan Sloof di proyek Pembangunan Ruko 2 Lantai B terindikasi terlambat (Behind Schedule)!", time: "2 jam yang lalu" },
  { id: "n-2", type: "alert-photo", message: "Pelaksana mengunggah foto baru untuk pekerjaan Sloof di Rumah Tinggal Modern A.", time: "4 jam yang lalu" },
  { id: "n-3", type: "alert-progress", message: "Kemajuan progres rata-rata Renovasi Kantor PT C mencapai 90%.", time: "1 hari yang lalu" }
];

const SEED_USERS = [
  { user_id: "usr-1", name: "Budi Santoso", email: "budi@saputtproject.com", role: "Pelaksana" },
  { user_id: "usr-2", name: "Hendra Wijaya", email: "hendra@saputtproject.com", role: "Manager" }
];

async function main() {
  console.log("Memulai proses seeding basis data...");

  try {
    // 1. Membaca skema SQL dari berkas schema.sql
    const schemaPath = path.join(__dirname, "../../schema.sql");
    if (!fs.existsSync(schemaPath)) {
      throw new Error(`Berkas skema tidak ditemukan di: ${schemaPath}`);
    }
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    // 2. Mengeksekusi skema pembuatan tabel di Turso DB/SQLite
    console.log("Membuat tabel skema basis data...");
    await db.executeMultiple(schemaSql);
    console.log("Tabel skema berhasil dibuat.");

    // 3. Membersihkan data lama (Clean Seed)
    console.log("Membersihkan data lama...");
    await db.execute("DELETE FROM users");
    await db.execute("DELETE FROM project_history");
    await db.execute("DELETE FROM notifications");
    await db.execute("DELETE FROM photos");
    await db.execute("DELETE FROM tasks");
    await db.execute("DELETE FROM projects");

    // 4. Memasukkan data Users
    console.log("Memasukkan data pengguna bawaan...");
    for (const u of SEED_USERS) {
      await db.execute({
        sql: "INSERT INTO users (user_id, name, email, role) VALUES (?, ?, ?, ?)",
        args: [u.user_id, u.name, u.email, u.role]
      });
    }

    // 5. Memasukkan data Projects dan anak tabelnya (Tasks, Photos, History)
    console.log("Memasukkan data proyek, tugas, foto, dan tren riwayat...");
    for (const p of SEED_PROJECTS) {
      // Insert Project
      await db.execute({
        sql: "INSERT INTO projects (project_id, project_name, location, owner, value, start_date, end_date, percentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        args: [p.project_id, p.project_name, p.location, p.owner, p.value, p.start_date, p.end_date, p.percentage]
      });

      // Insert Tasks
      for (const t of p.tasks) {
        await db.execute({
          sql: "INSERT INTO tasks (task_id, project_id, task_name, volume, satuan, bobot, status, progress, target_days, current_day) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          args: [t.task_id, p.project_id, t.task_name, t.volume, t.satuan, t.bobot, t.status, t.progress, t.target_days, t.current_day]
        });
      }

      // Insert Photos
      for (const ph of p.photos) {
        await db.execute({
          sql: "INSERT INTO photos (photo_id, project_id, task_name, description, date, image_url) VALUES (?, ?, ?, ?, ?, ?)",
          args: [ph.photo_id, p.project_id, ph.task_name, ph.description, ph.date, ph.image_url]
        });
      }

      // Insert History
      for (const h of p.history) {
        await db.execute({
          sql: "INSERT INTO project_history (history_id, project_id, week, progress) VALUES (?, ?, ?, ?)",
          args: [`hist-${p.project_id}-${h.week}`, p.project_id, h.week, h.progress]
        });
      }
    }

    // 6. Memasukkan data Notifications
    console.log("Memasukkan data notifikasi...");
    for (const n of SEED_NOTIFICATIONS) {
      await db.execute({
        sql: "INSERT INTO notifications (id, type, message, time) VALUES (?, ?, ?, ?)",
        args: [n.id, n.type, n.message, n.time]
      });
    }

    console.log("Proses seeding basis data berhasil diselesaikan!");
  } catch (error) {
    console.error("Gagal melakukan seeding basis data:", error);
    process.exit(1);
  }
}

main();
