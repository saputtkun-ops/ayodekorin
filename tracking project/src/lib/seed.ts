import { db } from "./db";
import * as schema from "./schema";

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
        notes: "Pembongkaran sekat gypsum lama dan pembuangan puing tuntas."
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
  console.log("Memulai proses seeding basis data dengan Drizzle ORM...");

  try {
    // 1. Menghapus data lama (clean migration)
    console.log("Menghapus data lama jika ada (clean migration)...");
    
    // Kita gunakan try-catch individual jika tabel belum terbentuk di database
    try { await db.delete(schema.projectHistory); } catch (e) {}
    try { await db.delete(schema.photos); } catch (e) {}
    try { await db.delete(schema.tasks); } catch (e) {}
    try { await db.delete(schema.notifications); } catch (e) {}
    try { await db.delete(schema.projects); } catch (e) {}
    try { await db.delete(schema.users); } catch (e) {}

    // 2. Memasukkan data Users
    console.log("Memasukkan data pengguna bawaan...");
    await db.insert(schema.users).values(
      SEED_USERS.map(u => ({
        userId: u.user_id,
        name: u.name,
        email: u.email,
        role: u.role as 'Pelaksana' | 'Manager'
      }))
    );

    // 3. Memasukkan data Projects dan anak tabelnya (Tasks, Photos, History)
    console.log("Memasukkan data proyek, tugas, foto, dan tren riwayat...");
    for (const p of SEED_PROJECTS) {
      // Insert Project
      await db.insert(schema.projects).values({
        projectId: p.project_id,
        projectName: p.project_name,
        location: p.location,
        owner: p.owner,
        value: p.value,
        startDate: p.start_date,
        endDate: p.end_date,
        percentage: p.percentage,
      });

      // Insert Tasks (Milestone-based)
      if (p.tasks.length > 0) {
        const tasksToInsert = p.tasks.map(t => ({
          taskId: t.task_id,
          projectId: p.project_id,
          taskName: t.task_name,
          volume: t.volume,
          satuan: t.satuan,
          bobot: t.bobot,
          status: t.status as 'Belum Dimulai' | 'Berjalan' | 'Selesai' | 'Tertunda' | 'Terlambat',
          progress: t.progress,
          targetDays: t.target_days,
          currentDay: t.current_day,
          startDate: t.start_date,
          endDate: t.end_date,
          actualDate: t.actual_date || null,
          notes: t.notes || null,
        }));
        await db.insert(schema.tasks).values(tasksToInsert);
      }

      // Insert Photos
      if (p.photos.length > 0) {
        const photosToInsert = p.photos.map(ph => ({
          photoId: ph.photo_id,
          projectId: p.project_id,
          taskName: ph.task_name,
          description: ph.description || null,
          date: ph.date,
          imageUrl: ph.image_url,
        }));
        await db.insert(schema.photos).values(photosToInsert);
      }

      // Insert History
      if (p.history.length > 0) {
        const historyToInsert = p.history.map(h => ({
          historyId: `hist-${p.project_id}-${h.week}`,
          projectId: p.project_id,
          week: h.week,
          progress: h.progress,
        }));
        await db.insert(schema.projectHistory).values(historyToInsert);
      }
    }

    // 4. Memasukkan data Notifications
    console.log("Memasukkan data notifikasi...");
    if (SEED_NOTIFICATIONS.length > 0) {
      const notificationsToInsert = SEED_NOTIFICATIONS.map(n => ({
        id: n.id,
        type: n.type as 'alert-delayed' | 'alert-photo' | 'alert-progress' | 'alert-info',
        message: n.message,
        time: n.time,
      }));
      await db.insert(schema.notifications).values(notificationsToInsert);
    }

    console.log("Proses seeding basis data berhasil diselesaikan dengan Drizzle ORM!");
  } catch (error) {
    console.error("Gagal melakukan seeding basis data:", error);
    process.exit(1);
  }
}

main();
