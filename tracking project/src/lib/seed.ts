import { db } from "./db";
import fs from "fs";
import path from "path";

// Default Mock Data for Seeding (Milestone-based)
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
      { 
        task_id: "t1-1", 
        task_name: "Pekerjaan Persiapan & Mobilisasi", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 10, 
        status: "Selesai", 
        progress: 100, 
        target_days: 7, 
        current_day: 7,
        start_date: "2026-05-01",
        end_date: "2026-05-07",
        actual_date: "2026-05-07",
        notes: "Tenaga kerja lengkap, mobilisasi alat lancar tanpa hambatan."
      },
      { 
        task_id: "t1-2", 
        task_name: "Galian Tanah & Pondasi Batu Kali", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 15, 
        status: "Selesai", 
        progress: 100, 
        target_days: 17, 
        current_day: 17,
        start_date: "2026-05-08",
        end_date: "2026-05-24",
        actual_date: "2026-05-23",
        notes: "Cuaca sangat cerah mendukung pekerjaan galian, pondasi terpasang kokoh."
      },
      { 
        task_id: "t1-3", 
        task_name: "Pekerjaan Sloof Beton & Kolom Utama Lt 1", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 15, 
        status: "Selesai", 
        progress: 100, 
        target_days: 17, 
        current_day: 17,
        start_date: "2026-05-25",
        end_date: "2026-06-10",
        actual_date: "2026-06-10",
        notes: "Pengecoran sukses menggunakan beton K-225 site-mix standar PU."
      },
      { 
        task_id: "t1-4", 
        task_name: "Pekerjaan Dinding Bata & Plesteran Lt 1", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 15, 
        status: "Berjalan", 
        progress: 80, 
        target_days: 15, 
        current_day: 12,
        start_date: "2026-06-11",
        end_date: "2026-06-25",
        notes: "Plesteran dinding sisi dalam selesai, sedang merapikan tali air kusen."
      },
      { 
        task_id: "t1-5", 
        task_name: "Pengecoran Plat Lantai Dak Lt 2", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 15, 
        status: "Berjalan", 
        progress: 40, 
        target_days: 15, 
        current_day: 8,
        start_date: "2026-06-26",
        end_date: "2026-07-10",
        notes: "Kendala: Sempat hujan deras siang hari menghambat cor rampung, bekisting aman."
      },
      { 
        task_id: "t1-6", 
        task_name: "Kolom, Ring Balk & Struktur Lt 2", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 10, 
        status: "Belum Dimulai", 
        progress: 0, 
        target_days: 12, 
        current_day: 0,
        start_date: "2026-07-11",
        end_date: "2026-07-22"
      },
      { 
        task_id: "t1-7", 
        task_name: "Rangka Atap Baja Ringan & Genteng", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 10, 
        status: "Belum Dimulai", 
        progress: 0, 
        target_days: 12, 
        current_day: 0,
        start_date: "2026-07-23",
        end_date: "2026-08-03"
      },
      { 
        task_id: "t1-8", 
        task_name: "Finishing & Pengecatan Rumah", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 10, 
        status: "Belum Dimulai", 
        progress: 0, 
        target_days: 12, 
        current_day: 0,
        start_date: "2026-08-04",
        end_date: "2026-08-15"
      }
    ],
    photos: [
      { photo_id: "p1-1", task_name: "Galian Tanah & Pondasi Batu Kali", description: "Pekerjaan pondasi batu kali selesai 100%", date: "2026-05-18", location: "Kebayoran Baru", image_url: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400" },
      { photo_id: "p1-2", task_name: "Pengecoran Plat Lantai Dak Lt 2", description: "Pemasangan bekisting sloof area timur selesai", date: "2026-06-24", location: "Kebayoran Baru", image_url: "https://images.unsplash.com/photo-1581094288338-2314dddb7eed?w=400" }
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
    percentage: 26,
    tasks: [
      { 
        task_id: "t2-1", 
        task_name: "Persiapan, Pembersihan & Bowplank", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 10, 
        status: "Selesai", 
        progress: 100, 
        target_days: 8, 
        current_day: 8,
        start_date: "2026-06-01",
        end_date: "2026-06-08",
        actual_date: "2026-06-07",
        notes: "Lahan bersih 100%, bowplank terpasang siku presisi."
      },
      { 
        task_id: "t2-2", 
        task_name: "Galian Tanah & Fondasi Footplat", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 20, 
        status: "Berjalan", 
        progress: 80, 
        target_days: 20, 
        current_day: 18,
        start_date: "2026-06-09",
        end_date: "2026-06-28",
        notes: "Sedang perakitan pembesian footplat, galian selesai seluruh titik."
      },
      { 
        task_id: "t2-3", 
        task_name: "Sloof & Kolom Struktur Lt 1", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 20, 
        status: "Belum Dimulai", 
        progress: 0, 
        target_days: 20, 
        current_day: 0,
        start_date: "2026-06-29",
        end_date: "2026-07-18"
      },
      { 
        task_id: "t2-4", 
        task_name: "Plat Lantai 2 & Balok Beton Lt 1", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 15, 
        status: "Belum Dimulai", 
        progress: 0, 
        target_days: 20, 
        current_day: 0,
        start_date: "2026-07-19",
        end_date: "2026-08-07"
      },
      { 
        task_id: "t2-5", 
        task_name: "Dinding Bata & Plesteran Lt 1 & 2", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 15, 
        status: "Belum Dimulai", 
        progress: 0, 
        target_days: 34, 
        current_day: 0,
        start_date: "2026-08-08",
        end_date: "2026-09-10"
      },
      { 
        task_id: "t2-6", 
        task_name: "Pekerjaan Atap & Penutup Ruko", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 10, 
        status: "Belum Dimulai", 
        progress: 0, 
        target_days: 25, 
        current_day: 0,
        start_date: "2026-09-11",
        end_date: "2026-10-05"
      },
      { 
        task_id: "t2-7", 
        task_name: "Finishing (Keramik, Cat & Fasad)", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 10, 
        status: "Belum Dimulai", 
        progress: 0, 
        target_days: 41, 
        current_day: 0,
        start_date: "2026-10-06",
        end_date: "2026-11-15"
      }
    ],
    photos: [
      { photo_id: "p2-1", task_name: "Galian Tanah & Fondasi Footplat", description: "Pekerjaan galian struktur ruko selesai", date: "2026-06-10", location: "Kebayoran Lama", image_url: "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=400" }
    ],
    history: [
      { week: 1, progress: 5 },
      { week: 2, progress: 15 },
      { week: 3, progress: 26 }
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
      { 
        task_id: "t3-1", 
        task_name: "Pembongkaran & Pembersihan Interior", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 15, 
        status: "Selesai", 
        progress: 100, 
        target_days: 8, 
        current_day: 8,
        start_date: "2026-04-15",
        end_date: "2026-04-22",
        actual_date: "2026-04-21",
        notes: "Pembongkaran sekat gypsum lama and pembuangan puing tuntas."
      },
      { 
        task_id: "t3-2", 
        task_name: "Instalasi Jalur Elektrikal & AC", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 20, 
        status: "Selesai", 
        progress: 100, 
        target_days: 23, 
        current_day: 23,
        start_date: "2026-04-23",
        end_date: "2026-05-15",
        actual_date: "2026-05-15",
        notes: "Kabel conduits, MCB pembagi, dan pipa AC tembaga terpasang rapi."
      },
      { 
        task_id: "t3-3", 
        task_name: "Pemasangan Dinding Partisi Gypsum", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 25, 
        status: "Selesai", 
        progress: 100, 
        target_days: 21, 
        current_day: 21,
        start_date: "2026-05-16",
        end_date: "2026-06-05",
        actual_date: "2026-06-04",
        notes: "Dinding partisi double-sided rapi, sambungan tertutup compound."
      },
      { 
        task_id: "t3-4", 
        task_name: "Pemasangan Plafon Acoustic Board", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 20, 
        status: "Selesai", 
        progress: 100, 
        target_days: 15, 
        current_day: 15,
        start_date: "2026-06-06",
        end_date: "2026-06-20",
        actual_date: "2026-06-20",
        notes: "Main tee dan cross tee lurus, panel akustik 60x60 terpasang presisi."
      },
      { 
        task_id: "t3-5", 
        task_name: "Pekerjaan Finishing (Vinyl & Cat)", 
        volume: 1, 
        satuan: "Lump Sum", 
        bobot: 20, 
        status: "Berjalan", 
        progress: 50, 
        target_days: 25, 
        current_day: 6,
        start_date: "2026-06-21",
        end_date: "2026-07-15",
        notes: "Sedang pengerjaan self-leveling lantai sebelum lem lembaran vinyl."
      }
    ],
    photos: [
      { photo_id: "p3-1", task_name: "Pemasangan Dinding Partisi Gypsum", description: "Plesteran dinding lantai 2 selesai", date: "2026-06-05", location: "Thamrin", image_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400" }
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
  { id: "n-1", type: "alert-delayed", message: "Milestone *Galian Tanah & Fondasi Footplat* di proyek Pembangunan Ruko 2 Lantai B terindikasi terlambat!", time: "2 jam yang lalu" },
  { id: "n-2", type: "alert-photo", message: "Pelaksana mengunggah foto baru untuk milestone *Pengecoran Plat Lantai Dak Lt 2* di Rumah Tinggal Modern A.", time: "4 jam yang lalu" },
  { id: "n-3", type: "alert-progress", message: "Kemajuan progres fisik Renovasi Kantor PT C mencapai 90%.", time: "1 hari yang lalu" }
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

    // 2. Menghapus tabel lama untuk migrasi bersih dan mengeksekusi skema pembuatan tabel
    console.log("Menghapus tabel lama jika ada (clean migration)...");
    await db.execute("DROP TABLE IF EXISTS project_history");
    await db.execute("DROP TABLE IF EXISTS photos");
    await db.execute("DROP TABLE IF EXISTS tasks");
    await db.execute("DROP TABLE IF EXISTS notifications");
    await db.execute("DROP TABLE IF EXISTS projects");
    await db.execute("DROP TABLE IF EXISTS users");

    console.log("Membuat tabel skema basis data baru...");
    await db.executeMultiple(schemaSql);
    console.log("Tabel skema berhasil dibuat.");

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

      // Insert Tasks (Milestone-based)
      for (const t of p.tasks) {
        await db.execute({
          sql: "INSERT INTO tasks (task_id, project_id, task_name, volume, satuan, bobot, status, progress, target_days, current_day, start_date, end_date, actual_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          args: [t.task_id, p.project_id, t.task_name, t.volume, t.satuan, t.bobot, t.status, t.progress, t.target_days, t.current_day, t.start_date, t.end_date, t.actual_date || null, t.notes || null]
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
