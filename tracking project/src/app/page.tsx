'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  HardHat,
  LayoutDashboard,
  Smartphone,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  Percent,
  Plus,
  TrendingUp,
  Bell,
  Eye,
  X,
  MapPin,
  User,
  Calendar,
  ChevronLeft,
  Camera,
  Save,
  Share2,
  Send,
  Copy,
  Download,
  Brain,
  ArrowRightCircle,
  FileSpreadsheet,
  Clock,
  DollarSign
} from 'lucide-react';

// ==========================================================================
// TYPES & INTERFACES
// ==========================================================================
interface Task {
  task_id: string;
  task_name: string;
  volume: number;
  satuan: string;
  bobot: number;
  status: 'Belum Dimulai' | 'Berjalan' | 'Selesai' | 'Tertunda';
  progress: number;
  target_days: number;
  current_day: number;
}

interface Photo {
  photo_id: string;
  task_name: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
}

interface HistoryPoint {
  week: number;
  progress: number;
}

interface Project {
  project_id: string;
  project_name: string;
  location: string;
  owner: string;
  value: number;
  start_date: string;
  end_date: string;
  percentage: number;
  tasks: Task[];
  photos: Photo[];
  history: HistoryPoint[];
}

interface Notification {
  id: string;
  type: 'alert-delayed' | 'alert-photo' | 'alert-progress' | 'alert-info';
  message: string;
  time: string;
}

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

// ==========================================================================
// DEFAULT MOCK DATA
// ==========================================================================
const DEFAULT_PROJECTS: Project[] = [
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

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: "n-1", type: "alert-delayed", message: "Pekerjaan Sloof di proyek Pembangunan Ruko 2 Lantai B terindikasi terlambat (Behind Schedule)!", time: "2 jam yang lalu" },
  { id: "n-2", type: "alert-photo", message: "Pelaksana mengunggah foto baru untuk pekerjaan Sloof di Rumah Tinggal Modern A.", time: "4 jam yang lalu" },
  { id: "n-3", type: "alert-progress", message: "Kemajuan progres rata-rata Renovasi Kantor PT C mencapai 90%.", time: "1 hari yang lalu" }
];

export default function Home() {
  // ==========================================================================
  // STATE DEFINITIONS
  // ==========================================================================
  const [projects, setProjects] = useState<Project[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeRole, setActiveRole] = useState<'manager' | 'pelaksana'>('manager');
  const [toast, setToast] = useState<Toast>({ message: '', type: 'info', visible: false });

  // Manager state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [projectDetailModalOpen, setProjectDetailModalOpen] = useState(false);

  // Manager Add Project Form state
  const [newProjName, setNewProjName] = useState('');
  const [newProjLocation, setNewProjLocation] = useState('');
  const [newProjOwner, setNewProjOwner] = useState('');
  const [newProjValue, setNewProjValue] = useState('');
  const [newProjStart, setNewProjStart] = useState('');
  const [newProjEnd, setNewProjEnd] = useState('');

  // Mobile Simulator state
  const [mobileScreen, setMobileScreen] = useState<'project-list' | 'project-detail' | 'task-edit'>('project-list');
  const [mobileSelectedProjId, setMobileSelectedProjId] = useState<string | null>(null);
  const [mobileSelectedTaskId, setMobileSelectedTaskId] = useState<string | null>(null);
  
  // Mobile task editing state
  const [editProgress, setEditProgress] = useState(0);
  const [editStatus, setEditStatus] = useState<Task['status']>('Belum Dimulai');
  const [editCurrentDay, setEditCurrentDay] = useState(1);
  const [editPhotoData, setEditPhotoData] = useState<string | null>(null);
  const [editPhotoDesc, setEditPhotoDesc] = useState('');
  const [editTargetTomorrow, setEditTargetTomorrow] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ==========================================================================
  // INITIALIZATION & PERSISTENCE
  // ==========================================================================
  useEffect(() => {
    const savedState = localStorage.getItem('saputt_next_project_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setProjects(parsed.projects || DEFAULT_PROJECTS);
        setNotifications(parsed.notifications || DEFAULT_NOTIFICATIONS);
      } catch (e) {
        setProjects(DEFAULT_PROJECTS);
        setNotifications(DEFAULT_NOTIFICATIONS);
      }
    } else {
      setProjects(DEFAULT_PROJECTS);
      setNotifications(DEFAULT_NOTIFICATIONS);
      localStorage.setItem('saputt_next_project_state', JSON.stringify({
        projects: DEFAULT_PROJECTS,
        notifications: DEFAULT_NOTIFICATIONS
      }));
    }
  }, []);

  const saveState = (updatedProjects: Project[], updatedNotifications: Notification[]) => {
    setProjects(updatedProjects);
    setNotifications(updatedNotifications);
    localStorage.setItem('saputt_next_project_state', JSON.stringify({
      projects: updatedProjects,
      notifications: updatedNotifications
    }));
  };

  // ==========================================================================
  // TOAST ALERT HELPER
  // ==========================================================================
  const triggerToast = (message: string, type: Toast['type'] = 'info') => {
    setToast({ message, type, visible: true });
  };

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // ==========================================================================
  // CALCULATIONS & HELPERS
  // ==========================================================================
  const calculateWeightedProjectPercentage = (projectTasks: Task[]): number => {
    let totalWeight = 0;
    let weightedProgress = 0;
    projectTasks.forEach(t => {
      totalWeight += t.bobot;
      weightedProgress += (t.progress * t.bobot) / 100;
    });
    return Math.round(weightedProgress);
  };

  const getScheduleStatus = (targetDays: number, currentDay: number, progress: number): 'Ahead Schedule' | 'On Schedule' | 'Behind Schedule' => {
    if (progress === 100) return 'On Schedule';
    if (currentDay === 0) return 'On Schedule';

    const expectedProgress = (currentDay / targetDays) * 100;
    if (progress >= expectedProgress + 5) {
      return 'Ahead Schedule';
    } else if (progress < expectedProgress - 8) {
      return 'Behind Schedule';
    } else {
      return 'On Schedule';
    }
  };

  const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateShort = (dateStr: string): string => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

  // ==========================================================================
  // METRICS & KPIS
  // ==========================================================================
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.percentage === 100).length;
  
  let delayedProjectsCount = 0;
  projects.forEach(p => {
    let hasDelayedTask = false;
    p.tasks.forEach(t => {
      if (t.status === 'Berjalan' || t.status === 'Tertunda') {
        const scheduleStatus = getScheduleStatus(t.target_days, t.current_day, t.progress);
        if (scheduleStatus === 'Behind Schedule') {
          hasDelayedTask = true;
        }
      }
    });
    if (hasDelayedTask && p.percentage < 100) {
      delayedProjectsCount++;
    }
  });

  const avgProgress = totalProjects > 0
    ? Math.round(projects.reduce((sum, p) => sum + p.percentage, 0) / totalProjects)
    : 0;

  // ==========================================================================
  // EXPORT TO CSV ENGINE
  // ==========================================================================
  const exportAllToCSV = () => {
    if (projects.length === 0) {
      triggerToast("Tidak ada data proyek untuk diekspor", "error");
      return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM
    csvContent += "ID Proyek;Nama Proyek;Lokasi;Pemilik;Nilai Proyek (Rp);Tanggal Mulai;Tanggal Selesai;Progres (%)\r\n";

    projects.forEach(p => {
      const row = [
        p.project_id,
        p.project_name.replace(/;/g, ","),
        p.location.replace(/;/g, ","),
        p.owner.replace(/;/g, ","),
        p.value,
        p.start_date,
        p.end_date,
        p.percentage
      ];
      csvContent += row.join(";") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `saputt_semua_proyek_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast("Ekspor seluruh proyek ke CSV sukses", "success");
  };

  const exportDetailsToCSV = (project: Project) => {
    let csvContent = "\uFEFF";
    csvContent += `LAPORAN DETAIL PROYEK: ${project.project_name.toUpperCase()}\r\n`;
    csvContent += `Lokasi: ${project.location};Pemilik: ${project.owner};Progres Total: ${project.percentage}%\r\n\r\n`;
    csvContent += "Nama Pekerjaan;Volume;Satuan;Bobot (%);Target Waktu (Hari);Hari Ke;Progres (%);Status;Jadwal\r\n";

    project.tasks.forEach(t => {
      const scheduleStatus = getScheduleStatus(t.target_days, t.current_day, t.progress);
      const row = [
        t.task_name.replace(/;/g, ","),
        t.volume,
        t.satuan,
        t.bobot,
        t.target_days,
        t.current_day,
        t.progress,
        t.status,
        scheduleStatus
      ];
      csvContent += row.join(";") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `saputt_detail_${project.project_name.toLowerCase().replace(/\s+/g, "_")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`Ekspor detail proyek ${project.project_name} sukses`, "success");
  };

  // ==========================================================================
  // MANAGER BUSINESS LOGIC
  // ==========================================================================
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProjName || !newProjLocation || !newProjOwner || !newProjValue || !newProjStart || !newProjEnd) {
      triggerToast("Mohon isi seluruh kolom wajib", "error");
      return;
    }

    const defaultTasks: Task[] = [
      { task_id: "t-new-1", task_name: "Persiapan", volume: 1, satuan: "Lump Sum", bobot: 5, status: "Belum Dimulai", progress: 0, target_days: 7, current_day: 0 },
      { task_id: "t-new-2", task_name: "Galian Tanah", volume: 50, satuan: "m3", bobot: 5, status: "Belum Dimulai", progress: 0, target_days: 10, current_day: 0 },
      { task_id: "t-new-3", task_name: "Pondasi Batu Kali", volume: 40, satuan: "m3", bobot: 15, status: "Belum Dimulai", progress: 0, target_days: 15, current_day: 0 },
      { task_id: "t-new-4", task_name: "Sloof Beton 15/20", volume: 5, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 12, current_day: 0 },
      { task_id: "t-new-5", task_name: "Kolom Struktur 15/15", volume: 4, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 14, current_day: 0 },
      { task_id: "t-new-6", task_name: "Balok Beton 15/20", volume: 4.5, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 14, current_day: 0 },
      { task_id: "t-new-7", task_name: "Plat Lantai Beton", volume: 14, satuan: "m3", bobot: 10, status: "Belum Dimulai", progress: 0, target_days: 20, current_day: 0 },
      { task_id: "t-new-8", task_name: "Dinding Bata & Plesteran", volume: 200, satuan: "m2", bobot: 15, status: "Belum Dimulai", progress: 0, target_days: 30, current_day: 0 },
      { task_id: "t-new-9", task_name: "Atap Baja Ringan & Genteng", volume: 100, satuan: "m2", bobot: 15, status: "Belum Dimulai", progress: 0, target_days: 15, current_day: 0 },
      { task_id: "t-new-10", task_name: "Finishing (Keramik & Cat)", volume: 120, satuan: "m2", bobot: 5, status: "Belum Dimulai", progress: 0, target_days: 20, current_day: 0 }
    ];

    const newProject: Project = {
      project_id: "proj-" + Date.now(),
      project_name: newProjName,
      location: newProjLocation,
      owner: newProjOwner,
      value: parseInt(newProjValue),
      start_date: newProjStart,
      end_date: newProjEnd,
      percentage: 0,
      tasks: defaultTasks,
      photos: [],
      history: [{ week: 1, progress: 0 }]
    };

    const updatedProjects = [...projects, newProject];
    const updatedNotifications = [
      {
        id: "notif-new-" + Date.now(),
        type: "alert-info" as const,
        message: `Proyek konstruksi baru telah didaftarkan: ${newProjName}`,
        time: "Baru saja"
      },
      ...notifications
    ];

    saveState(updatedProjects, updatedNotifications);

    // Reset Form
    setNewProjName('');
    setNewProjLocation('');
    setNewProjOwner('');
    setNewProjValue('');
    setNewProjStart('');
    setNewProjEnd('');
    setAddProjectModalOpen(false);

    triggerToast("Proyek baru berhasil ditambahkan", "success");
  };

  // ==========================================================================
  // MOBILE SIMULATOR BUSINESS LOGIC
  // ==========================================================================
  const selectMobileProject = (projId: string) => {
    setMobileSelectedProjId(projId);
    setMobileScreen('project-detail');
  };

  const selectMobileTask = (taskId: string, project: Project) => {
    const task = project.tasks.find(t => t.task_id === taskId);
    if (task) {
      setMobileSelectedTaskId(taskId);
      setEditProgress(task.progress);
      setEditStatus(task.status);
      setEditCurrentDay(task.current_day || 1);
      setEditPhotoData(null);
      setEditPhotoDesc('');
      setEditTargetTomorrow('');
      setMobileScreen('task-edit');
    }
  };

  const mobileGoBack = () => {
    if (mobileScreen === 'task-edit') {
      setMobileScreen('project-detail');
      setMobileSelectedTaskId(null);
      setEditPhotoData(null);
    } else if (mobileScreen === 'project-detail') {
      setMobileScreen('project-list');
      setMobileSelectedProjId(null);
    }
  };


  const handleSliderChange = (val: number) => {
    setEditProgress(val);
    if (val === 100) {
      setEditStatus('Selesai');
    } else if (val > 0 && editStatus === 'Belum Dimulai') {
      setEditStatus('Berjalan');
    } else if (val === 0 && editStatus === 'Selesai') {
      setEditStatus('Belum Dimulai');
    }
  };

  const handleStatusChange = (status: Task['status']) => {
    setEditStatus(status);
    if (status === 'Selesai') {
      setEditProgress(100);
    } else if (status === 'Belum Dimulai') {
      setEditProgress(0);
    }
  };

  const triggerSimulatedUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setEditPhotoData(dataUrl);
      triggerToast("Foto berhasil dimuat dari galeri", "success");
    };
    reader.readAsDataURL(file);
  };

  const generateWhatsAppReport = (project: Project, task: Task): string => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    return `*PROGRESS HARIAN*
*Proyek:* ${project.project_name}
*Tanggal:* ${formattedDate}
*Pekerjaan:* ${task.task_name}
*Progress:* ${editProgress}%
*Keterangan:* ${editPhotoDesc || "-"}
*Target Besok:* ${editTargetTomorrow || "-"}`;
  };

  const copyReport = (project: Project, task: Task) => {
    const text = generateWhatsAppReport(project, task);
    navigator.clipboard.writeText(text).then(() => {
      triggerToast("Laporan progres disalin ke clipboard", "success");
    }).catch(() => {
      triggerToast("Gagal menyalin laporan", "error");
    });
  };

  const shareReportWhatsApp = (project: Project, task: Task) => {
    const text = generateWhatsAppReport(project, task);
    const encodedText = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encodedText}`, "_blank");
  };

  const handleSaveMobileTask = (project: Project, task: Task) => {
    // 1. Update task values
    const oldProgress = task.progress;
    
    const updatedProjects = projects.map(p => {
      if (p.project_id === project.project_id) {
        // Update specific task
        const updatedTasks = p.tasks.map(t => {
          if (t.task_id === task.task_id) {
            return {
              ...t,
              progress: editProgress,
              status: editStatus,
              current_day: editCurrentDay
            };
          }
          return t;
        });

        // Add photo if uploaded
        let updatedPhotos = [...p.photos];
        if (editPhotoData) {
          const newPhoto: Photo = {
            photo_id: "photo-" + Date.now(),
            task_name: task.task_name,
            description: editPhotoDesc || `${task.task_name} update progres ${editProgress}%`,
            date: new Date().toISOString().split("T")[0],
            location: p.location.split(",")[0],
            image_url: editPhotoData
          };
          updatedPhotos = [newPhoto, ...updatedPhotos];
        }

        // Calculate overall percentage
        const nextPercentage = calculateWeightedProjectPercentage(updatedTasks);

        // Update history if progress changed
        let updatedHistory = [...p.history];
        if (editProgress > oldProgress) {
          const lastHistory = updatedHistory[updatedHistory.length - 1];
          if (lastHistory && lastHistory.week === updatedHistory.length) {
            lastHistory.progress = nextPercentage;
          } else {
            updatedHistory.push({
              week: updatedHistory.length + 1,
              progress: nextPercentage
            });
          }
        }

        return {
          ...p,
          tasks: updatedTasks,
          photos: updatedPhotos,
          percentage: nextPercentage,
          history: updatedHistory
        };
      }
      return p;
    });

    // 2. Add Manager notifications
    const newNotifications = [...notifications];
    newNotifications.unshift({
      id: "notif-prog-" + Date.now(),
      type: "alert-progress",
      message: `Pelaksana memperbarui *${task.task_name}* (${editProgress}%) di *${project.project_name}*`,
      time: "Baru saja"
    });

    const scheduleStatus = getScheduleStatus(task.target_days, editCurrentDay, editProgress);
    if (scheduleStatus === 'Behind Schedule' && editStatus !== 'Selesai') {
      newNotifications.unshift({
        id: "notif-warn-" + Date.now(),
        type: "alert-delayed",
        message: `[Peringatan] Pekerjaan *${task.task_name}* di proyek *${project.project_name}* terdeteksi terlambat (Behind Schedule)!`,
        time: "Baru saja"
      });
    }

    if (newNotifications.length > 10) newNotifications.pop();

    saveState(updatedProjects, newNotifications);
    triggerToast("Progres pekerjaan berhasil disimpan", "success");
    
    // Go back to project timeline
    setMobileScreen('project-detail');
    setMobileSelectedTaskId(null);
    setEditPhotoData(null);
  };

  // ==========================================================================
  // DYNAMIC AI ANALYTICS GENERATOR
  // ==========================================================================
  const renderAIAnalysisList = () => {
    const aiCards: React.ReactNode[] = [];

    projects.forEach(p => {
      let riskScore = 0;
      const delayedTasks: string[] = [];
      
      p.tasks.forEach(t => {
        if (t.status === 'Berjalan' || t.status === 'Tertunda') {
          const scheduleStatus = getScheduleStatus(t.target_days, t.current_day, t.progress);
          if (scheduleStatus === 'Behind Schedule') {
            riskScore += t.bobot;
            delayedTasks.push(t.task_name);
          }
        }
      });

      if (riskScore > 0 && p.percentage < 100) {
        aiCards.push(
          <div key={`ai-risk-${p.project_id}`} className="bg-white border border-purple-100 rounded-xl p-4 flex flex-col gap-2 hover:border-purple-300 hover:shadow-sm transition-all">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="text-red-500 w-4 h-4" />
                Prediksi Keterlambatan: {p.project_name}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-50 text-red-500 uppercase">
                Risiko Tinggi ({riskScore}%)
              </span>
            </div>
            <p className="text-xs text-slate-600">
              AI memprediksi hambatan jadwal konstruksi akibat ketertinggalan progres pekerjaan <strong>{delayedTasks.join(", ")}</strong>.
            </p>
            <div className="bg-purple-50/50 border-l-4 border-purple-500 rounded p-2 text-[11px] text-purple-950 mt-1">
              <strong>Rekomendasi AI:</strong> Lakukan percepatan pengerjaan <strong>{delayedTasks[0]}</strong> dengan mengalokasikan 2-3 tenaga kerja tambahan.
            </div>
          </div>
        );
      }
    });

    projects.forEach(p => {
      if (p.percentage < 100) {
        const nextTask = p.tasks.find(t => t.status === 'Belum Dimulai');
        const currentActiveTask = p.tasks.find(t => t.status === 'Berjalan');

        if (nextTask) {
          aiCards.push(
            <div key={`ai-next-${p.project_id}`} className="bg-white border border-purple-100 rounded-xl p-4 flex flex-col gap-2 hover:border-purple-300 hover:shadow-sm transition-all">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Brain className="text-purple-500 w-4 h-4" />
                  Alur & Logistik: {p.project_name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-purple-50 text-purple-500 uppercase">
                  Rekomendasi Langkah
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Pekerjaan berikutnya adalah <strong>{nextTask.task_name}</strong> (Bobot {nextTask.bobot}%). 
                {currentActiveTask ? ` Saat ini pekerjaan ${currentActiveTask.task_name} sedang berjalan (${currentActiveTask.progress}%).` : ''}
              </p>
              <div className="bg-purple-50/50 border-l-4 border-purple-500 rounded p-2 text-[11px] text-purple-950 mt-1">
                <strong>Rekomendasi AI:</strong> Segera lakukan review pemesanan material untuk <strong>{nextTask.task_name}</strong> agar dapat langsung dimulai begitu pekerjaan sebelumnya rampung.
              </div>
            </div>
          );
        }
      }
    });

    if (aiCards.length === 0) {
      return (
        <div className="bg-white border border-emerald-100 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <CheckCircle2 className="text-emerald-500 w-4 h-4" />
              Kondisi Proyek Optimal
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-500 uppercase">
              Aman
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Berdasarkan analisis performa harian lapangan, seluruh jadwal berjalan optimal. Risiko keterlambatan 0%.
          </p>
          <div className="bg-emerald-50/50 border-l-4 border-emerald-500 rounded p-2 text-[11px] text-emerald-950 mt-1">
            <strong>Rekomendasi AI:</strong> Pertahankan koordinasi terstruktur tim pelaksana harian.
          </div>
        </div>
      );
    }

    return aiCards;
  };

  // ==========================================================================
  // INTERACTIVE SVG CHART RENDERER
  // ==========================================================================
  const renderSVGChartReact = () => {
    if (projects.length === 0) {
      return <div className="text-xs text-slate-400 text-center py-12">Tidak ada data grafik.</div>;
    }

    let maxWeeks = 4;
    projects.forEach(p => {
      if (p.history && p.history.length > maxWeeks) {
        maxWeeks = p.history.length;
      }
    });

    const paddingX = 40;
    const paddingY = 25;
    const width = 450;
    const height = 180;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    const lineColors = ["#FF6A00", "#10B981", "#06B6D4", "#F59E0B"];

    return (
      <div className="w-full h-full relative">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Y Axis Grid Lines */}
          {[0, 25, 50, 75, 100].map((percent, idx) => {
            const y = paddingY + chartHeight - (percent / 100) * chartHeight;
            return (
              <g key={`y-grid-${percent}`}>
                <line x1={paddingX} y1={y} x2={width - paddingX} y2={y} stroke="#E2E8F0" strokeDasharray="4" strokeWidth={1} />
                <text x={paddingX - 8} y={y + 3.5} fontFamily="Outfit" fontSize={9} fill="#64748B" textAnchor="end">{percent}%</text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {Array.from({ length: maxWeeks }).map((_, idx) => {
            const w = idx + 1;
            const x = paddingX + (idx / (maxWeeks - 1)) * chartWidth;
            return (
              <text key={`x-lbl-${w}`} x={x} y={height - 5} fontFamily="Outfit" fontSize={9} fill="#64748B" textAnchor="middle">M-W{w}</text>
            );
          })}

          {/* Lines and Dots */}
          {projects.map((p, pIdx) => {
            const color = lineColors[pIdx % lineColors.length];
            const displayData = [...(p.history || [])];
            if (displayData.length === 0) displayData.push({ week: 1, progress: 0 });

            const points = displayData.map((h) => {
              const x = paddingX + ((h.week - 1) / (maxWeeks - 1)) * chartWidth;
              const y = paddingY + chartHeight - (h.progress / 100) * chartHeight;
              return `${x},${y}`;
            }).join(" ");

            return (
              <g key={`line-proj-${p.project_id}`}>
                {/* Connection line */}
                <polyline fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" points={points} />
                
                {/* Dots */}
                {displayData.map((h, hIdx) => {
                  const x = paddingX + ((h.week - 1) / (maxWeeks - 1)) * chartWidth;
                  const y = paddingY + chartHeight - (h.progress / 100) * chartHeight;
                  return (
                    <circle
                      key={`dot-${p.project_id}-${hIdx}`}
                      cx={x}
                      cy={y}
                      r={3.5}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                      className="cursor-pointer transition-all hover:r-5"
                    >
                      <title>{`${p.project_name} - Minggu ${h.week}: ${h.progress}%`}</title>
                    </circle>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // ==========================================================================
  // RENDER INTERFACES
  // ==========================================================================
  
  // Find current viewing project inside manager detail modal
  const currentViewingProject = projects.find(p => p.project_id === selectedProjectId);

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Dynamic Toast Alerts */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-[300] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 transform translate-y-0 ${
          toast.type === 'success' ? 'bg-emerald-500 border-l-4 border-emerald-700' :
          toast.type === 'error' ? 'bg-rose-500 border-l-4 border-rose-700' : 'bg-blue-500 border-l-4 border-blue-700'
        }`}>
          <CheckCircle2 className="w-5 h-5" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Global Header & Navigation */}
      <header className="bg-primary text-white px-6 md:px-12 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-secondary p-2 rounded-lg text-white">
            <HardHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Saputt Project</h1>
            <p className="text-xs text-white/70 font-medium">Sistem Monitoring Konstruksi Sipil Next.js</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveRole('manager')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs md:text-sm font-semibold transition-all ${
              activeRole === 'manager' ? 'bg-white text-primary shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Manager (Web Dashboard)
          </button>
          <button
            onClick={() => {
              setActiveRole('pelaksana');
              setMobileScreen('project-list');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs md:text-sm font-semibold transition-all ${
              activeRole === 'pelaksana' ? 'bg-white text-primary shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Pelaksana (Mobile View)
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* ========================================== */}
        {/* MANAGER VIEW (WEB DASHBOARD)               */}
        {/* ========================================== */}
        {activeRole === 'manager' && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Block */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Total Proyek Aktif</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mt-1">{totalProjects - completedProjects}</h3>
                </div>
                <div className="bg-cyan-50 text-cyan-500 p-3 rounded-2xl">
                  <Briefcase className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Proyek Selesai</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mt-1">{completedProjects}</h3>
                </div>
                <div className="bg-emerald-50 text-emerald-500 p-3 rounded-2xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Proyek Terlambat</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-red-500 mt-1">{delayedProjectsCount}</h3>
                </div>
                <div className="bg-red-50 text-red-500 p-3 rounded-2xl">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex justify-between items-center hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Rata-rata Progres</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary mt-1">{avgProgress}%</h3>
                </div>
                <div className="bg-orange-50 text-secondary p-3 rounded-2xl">
                  <Percent className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Grid Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Panel: Project Sheet */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="text-secondary w-5 h-5" />
                    <h2 className="text-lg font-bold text-primary">Project Sheet</h2>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportAllToCSV}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Ekspor CSV
                    </button>
                    <button
                      onClick={() => setAddProjectModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-orange-600 shadow-sm transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Proyek
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Nama Proyek</th>
                        <th className="py-3 px-4">Lokasi</th>
                        <th className="py-3 px-4">Pemilik</th>
                        <th className="py-3 px-4">Nilai Kontrak</th>
                        <th className="py-3 px-4">Timeline</th>
                        <th className="py-3 px-4">Progres</th>
                        <th className="py-3 px-4">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {projects.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                            Belum ada proyek terdaftar.
                          </td>
                        </tr>
                      ) : (
                        projects.map(p => (
                          <tr key={p.project_id} className="hover:bg-slate-50/50 transition-all">
                            <td className="py-3.5 px-4 font-bold text-slate-800">{p.project_name}</td>
                            <td className="py-3.5 px-4 text-slate-500 text-xs">{p.location.split(",")[0]}</td>
                            <td className="py-3.5 px-4 text-slate-500 text-xs">{p.owner}</td>
                            <td className="py-3.5 px-4 font-medium text-slate-700 text-xs">{formatCurrency(p.value)}</td>
                            <td className="py-3.5 px-4 text-[11px] text-slate-400">
                              {formatDateShort(p.start_date)} - {formatDateShort(p.end_date)}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2 min-w-[120px]">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                                    style={{ width: `${p.percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-[11px] font-bold text-slate-700 w-8 text-right">{p.percentage}%</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => {
                                  setSelectedProjectId(p.project_id);
                                  setProjectDetailModalOpen(true);
                                }}
                                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold transition-all"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Detail
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Sidebar: Charts & AI */}
              <div className="flex flex-col gap-6">
                {/* SVG Progress Trend Chart */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <TrendingUp className="text-secondary w-5 h-5" />
                    <h2 className="text-sm font-bold text-primary">Progres Rata-rata Proyek</h2>
                  </div>
                  <div className="h-44 w-full flex items-center justify-center">
                    {renderSVGChartReact()}
                  </div>
                </div>

                {/* Saputt AI Analysis Center */}
                <div className="bg-purple-50/20 border border-purple-200 rounded-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-purple-100 pb-3">
                    <Brain className="text-purple-600 w-5 h-5" />
                    <h2 className="text-sm font-bold text-purple-800">Saputt AI - Analisis & Prediksi</h2>
                  </div>
                  <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-1">
                    {renderAIAnalysisList()}
                  </div>
                </div>

                {/* Live Field Notification Panel */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <Bell className="text-secondary w-5 h-5" />
                    <h2 className="text-sm font-bold text-primary">Notifikasi Lapangan</h2>
                  </div>
                  <div className="flex flex-col gap-3 max-h-[260px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">Tidak ada notifikasi.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-3 rounded-lg border-l-4 text-xs flex gap-2.5 items-start ${
                            n.type === 'alert-delayed' ? 'bg-red-50/50 border-red-500' :
                            n.type === 'alert-photo' ? 'bg-cyan-50/50 border-cyan-500' :
                            n.type === 'alert-progress' ? 'bg-emerald-50/50 border-emerald-500' : 'bg-slate-50 border-slate-300'
                          }`}
                        >
                          <div className="mt-0.5">
                            {n.type === 'alert-delayed' && <AlertTriangle className="w-3.5 h-3.5 text-red-500" />}
                            {n.type === 'alert-photo' && <Camera className="w-3.5 h-3.5 text-cyan-500" />}
                            {n.type === 'alert-progress' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                            {n.type === 'alert-info' && <Bell className="w-3.5 h-3.5 text-slate-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-700 font-medium leading-relaxed">
                              {n.message.split('*').map((chunk, index) => 
                                index % 2 === 1 ? <strong key={index} className="font-bold text-slate-950">{chunk}</strong> : chunk
                              )}
                            </p>
                            <span className="text-[9px] text-slate-400 block mt-1">{n.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* PELAKSANA VIEW (MOBILE SIMULATOR)          */}
        {/* ========================================== */}
        {activeRole === 'pelaksana' && (
          <div className="flex flex-col lg:flex-row gap-8 justify-center items-center py-4 animate-fadeIn">
            {/* Mobile Device Frame Simulator */}
            <div className="relative w-[380px] h-[760px] bg-slate-900 rounded-[45px] p-3 border-4 border-slate-800 shadow-2xl flex flex-col overflow-hidden shrink-0">
              
              {/* Notch and Camera Area */}
              <div className="h-6 w-full flex justify-between items-center px-6 text-[10px] font-bold text-white/90 z-20">
                <span>09:41</span>
                <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-36 h-5 bg-slate-900 rounded-b-xl"></div>
                <div className="flex gap-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[8px]">4G</div>
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20 flex items-center justify-center text-[8px]">🔋</div>
                </div>
              </div>

              {/* Simulated Screen Header */}
              <div className="bg-primary text-white p-4 flex items-center gap-3 h-14 relative rounded-t-[32px] mt-1 shrink-0">
                {mobileScreen !== 'project-list' && (
                  <button onClick={mobileGoBack} className="text-white hover:opacity-80 transition-all">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <span className="font-bold text-sm truncate flex-1 text-center pr-4">
                  {mobileScreen === 'project-list' && 'Daftar Proyek'}
                  {mobileScreen === 'project-detail' && (projects.find(p => p.project_id === mobileSelectedProjId)?.project_name || 'Detail Proyek')}
                  {mobileScreen === 'task-edit' && (
                    projects.find(p => p.project_id === mobileSelectedProjId)?.tasks.find(t => t.task_id === mobileSelectedTaskId)?.task_name || 'Update Pekerjaan'
                  )}
                </span>
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/25 border border-secondary text-secondary uppercase tracking-wider">
                  Pelaksana
                </span>
              </div>

              {/* Simulated Screen Viewport Container */}
              <div className="flex-1 bg-slate-50 overflow-y-auto p-4 flex flex-col gap-4 rounded-b-[32px]">
                
                {/* 1. Project List View */}
                {mobileScreen === 'project-list' && (
                  <div className="flex flex-col gap-3 animate-fadeIn">
                    <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Proyek Konstruksi Aktif</span>
                    {projects.map(p => {
                      const totalTasks = p.tasks.length;
                      const completedTasks = p.tasks.filter(t => t.status === 'Selesai').length;
                      return (
                        <div
                          key={p.project_id}
                          onClick={() => selectMobileProject(p.project_id)}
                          className="bg-white border border-slate-200/80 rounded-2xl p-4 flex justify-between items-center cursor-pointer hover:border-secondary hover:shadow-sm transition-all"
                        >
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">{p.project_name}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" /> {p.location.split(",")[0]}</span>
                              <span>•</span>
                              <span>{completedTasks}/{totalTasks} Selesai</span>
                            </div>
                          </div>
                          <div className="w-11 h-11 shrink-0 relative flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="22" cy="22" r="18" stroke="#E2E8F0" strokeWidth="3" fill="transparent" />
                              <circle
                                cx="22"
                                cy="22"
                                r="18"
                                stroke="url(#grad-ring-mob)"
                                strokeWidth="3"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 18}
                                strokeDashoffset={2 * Math.PI * 18 - (p.percentage / 100) * (2 * Math.PI * 18)}
                                strokeLinecap="round"
                              />
                              <defs>
                                <linearGradient id="grad-ring-mob" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#1B365D" />
                                  <stop offset="100%" stopColor="#FF6A00" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <span className="absolute text-[10px] font-extrabold text-primary">{p.percentage}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. Project Details / Timeline View */}
                {mobileScreen === 'project-detail' && (() => {
                  const project = projects.find(p => p.project_id === mobileSelectedProjId);
                  if (!project) return null;

                  // Mobile AI Recommendation logic
                  const nextTask = project.tasks.find(t => t.status === 'Belum Dimulai');
                  const activeTask = project.tasks.find(t => t.status === 'Berjalan');
                  
                  return (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                      {/* Overview Header */}
                      <div className="bg-primary text-white p-4 rounded-2xl shadow-md flex items-center gap-4">
                        <div className="w-16 h-16 shrink-0 relative flex items-center justify-center bg-white/10 rounded-full">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.15)" strokeWidth="4.5" fill="transparent" />
                            <circle
                              cx="32"
                              cy="32"
                              r="26"
                              stroke="#FF6A00"
                              strokeWidth="4.5"
                              fill="transparent"
                              strokeDasharray={2 * Math.PI * 26}
                              strokeDashoffset={2 * Math.PI * 26 - (project.percentage / 100) * (2 * Math.PI * 26)}
                              strokeLinecap="round"
                            />
                          </svg>
                          <span className="absolute text-sm font-extrabold text-white">{project.percentage}%</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xs font-bold text-white leading-tight">{project.project_name}</h3>
                          <div className="flex flex-col gap-0.5 text-[9px] text-white/80 mt-1">
                            <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5 text-white/50" /> {project.location}</span>
                            <span className="flex items-center gap-0.5"><User className="w-2.5 h-2.5 text-white/50" /> Owner: {project.owner}</span>
                            <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5 text-white/50" /> Target: {formatDate(project.end_date)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mobile AI Advisor Widget */}
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-3.5">
                        <div className="flex items-center gap-1.5 text-purple-700 text-[10px] font-extrabold uppercase">
                          <Brain className="w-3.5 h-3.5" />
                          <span>Saputt AI - Asisten Lapangan</span>
                        </div>
                        <p className="text-[10px] text-purple-900 mt-1.5 leading-relaxed">
                          {nextTask ? (
                            <>Fokus saat ini menyelesaikan pekerjaan aktif{activeTask ? ` <strong>${activeTask.task_name}</strong>` : ''}. AI merekomendasikan persiapan logistik untuk langkah berikutnya: <strong>{nextTask.task_name}</strong> (Bobot {nextTask.bobot}%).</>
                          ) : (
                            'Seluruh item pekerjaan utama telah dimulai atau diselesaikan. Selesaikan sisa pekerjaan untuk penuntasan proyek.'
                          )}
                        </p>
                      </div>

                      {/* Timeline List */}
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Timeline Pekerjaan Konstruksi</span>
                        {project.tasks.map(t => {
                          const statusClass = 
                            t.status === 'Selesai' ? 'bg-emerald-500' :
                            t.status === 'Berjalan' ? 'bg-amber-500' :
                            t.status === 'Tertunda' ? 'bg-red-500' : 'bg-slate-300';
                          
                          const badgeClass =
                            t.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' :
                            t.status === 'Berjalan' ? 'bg-amber-50 text-amber-600' :
                            t.status === 'Tertunda' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500';

                          return (
                            <div
                              key={t.task_id}
                              onClick={() => selectMobileTask(t.task_id, project)}
                              className="bg-white border border-slate-200/80 rounded-xl p-3 flex justify-between items-center cursor-pointer hover:border-secondary hover:translate-x-1 transition-all"
                            >
                              <div className="flex items-center gap-2.5">
                                <span className={`w-2.5 h-2.5 rounded-full ${statusClass}`}></span>
                                <span className="font-bold text-slate-700 text-[11px]">{t.task_name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>{t.status}</span>
                                <span className="text-[11px] font-extrabold text-slate-600 w-8 text-right">{t.progress}%</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}

                {/* 3. Task Edit View & WhatsApp Report Share */}
                {mobileScreen === 'task-edit' && (() => {
                  const project = projects.find(p => p.project_id === mobileSelectedProjId);
                  const task = project?.tasks.find(t => t.task_id === mobileSelectedTaskId);
                  if (!project || !task) return null;

                  const scheduleStatus = getScheduleStatus(task.target_days, editCurrentDay, editProgress);

                  return (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                      {/* Task Detail Card */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-4">
                        <div className="border-b border-slate-100 pb-3">
                          <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{task.task_name}</h3>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-slate-50 rounded p-1.5 flex flex-col items-center">
                              <span className="text-[8px] text-slate-400 uppercase">Volume</span>
                              <span className="text-[10px] font-bold text-primary">{task.volume} {task.satuan}</span>
                            </div>
                            <div className="bg-slate-50 rounded p-1.5 flex flex-col items-center">
                              <span className="text-[8px] text-slate-400 uppercase">Bobot</span>
                              <span className="text-[10px] font-bold text-primary">{task.bobot}%</span>
                            </div>
                            <div className="bg-slate-50 rounded p-1.5 flex flex-col items-center">
                              <span className="text-[8px] text-slate-400 uppercase">Target</span>
                              <span className="text-[10px] font-bold text-primary">{task.target_days} H</span>
                            </div>
                          </div>
                        </div>

                        {/* Slider Progress */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Persentase Progres Aktual</label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              className="flex-1 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-secondary"
                              min={0}
                              max={100}
                              value={editProgress}
                              onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                            />
                            <span className="text-xs font-extrabold text-slate-700 w-9 text-right">{editProgress}%</span>
                          </div>
                        </div>

                        {/* Status Select */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Status Pekerjaan</label>
                          <select
                            value={editStatus}
                            onChange={(e) => handleStatusChange(e.target.value as Task['status'])}
                            className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                          >
                            <option value="Belum Dimulai">Belum Dimulai</option>
                            <option value="Berjalan">Berjalan</option>
                            <option value="Selesai">Selesai</option>
                            <option value="Tertunda">Tertunda</option>
                          </select>
                        </div>

                        {/* Timeline Current Day */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Hari Pengerjaan Saat Ini</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-center focus:outline-none"
                              min={0}
                              max={task.target_days * 2}
                              value={editCurrentDay}
                              onChange={(e) => setEditCurrentDay(parseInt(e.target.value) || 0)}
                            />
                            <span className="text-[10px] text-slate-400">dari target {task.target_days} hari</span>
                          </div>
                        </div>

                        {/* Schedule evaluation */}
                        <div className="bg-slate-50 rounded-lg border border-slate-100 p-2 flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-medium">Status Jadwal Rencana:</span>
                          <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                            scheduleStatus === 'Ahead Schedule' ? 'bg-emerald-50 text-emerald-600' :
                            scheduleStatus === 'On Schedule' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                          }`}>{scheduleStatus}</span>
                        </div>

                        {/* Simulated Photo Upload */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Dokumentasi Lapangan</label>
                          <div
                            onClick={triggerSimulatedUpload}
                            className="border-2 border-dashed border-slate-200 bg-slate-50 hover:bg-slate-100/50 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden min-h-[90px]"
                          >
                            {editPhotoData ? (
                              <img src={editPhotoData} alt="Preview" className="absolute inset-0 w-full h-full object-cover z-10" />
                            ) : (
                              <>
                                <Camera className="w-6 h-6 text-slate-400" />
                                <span className="text-[10px] text-slate-400 font-medium">Klik untuk ambil/unggah foto</span>
                              </>
                            )}
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handlePhotoFileChange}
                              className="hidden"
                            />
                          </div>
                        </div>

                        {/* Photo Caption */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Catatan Harian Lapangan</label>
                          <textarea
                            rows={2}
                            value={editPhotoDesc}
                            onChange={(e) => setEditPhotoDesc(e.target.value)}
                            placeholder="Contoh: Pemasangan bekisting rampung..."
                            className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                          />
                        </div>

                        {/* Target Tomorrow */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Target Pekerjaan Besok</label>
                          <input
                            type="text"
                            value={editTargetTomorrow}
                            onChange={(e) => setEditTargetTomorrow(e.target.value)}
                            placeholder="Contoh: Pengecoran sloof..."
                            className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none"
                          />
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={() => handleSaveMobileTask(project, task)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-orange-600 shadow-sm transition-all mt-2"
                        >
                          <Save className="w-4 h-4" />
                          Simpan Progres Harian
                        </button>
                      </div>

                      {/* Share Progress Widget */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1.5 uppercase border-b border-slate-50 pb-2">
                          <Share2 className="w-3.5 h-3.5 text-secondary" />
                          Share Progress WhatsApp
                        </span>
                        <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 font-mono text-[9px] text-slate-600 white-space-pre-wrap max-h-[120px] overflow-y-auto leading-relaxed">
                          {generateWhatsAppReport(project, task)}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => copyReport(project, task)}
                            className="flex items-center justify-center gap-1.5 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Salin
                          </button>
                          <button
                            onClick={() => shareReportWhatsApp(project, task)}
                            className="flex items-center justify-center gap-1.5 py-2 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#128C7E] transition-all"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Kirim WA
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Bottom Home Bar Indicator */}
              <div className="h-1.5 w-28 bg-white/20 rounded-full mx-auto my-2 shrink-0"></div>
            </div>

            {/* Simulated Mobile Instructions Side-Card */}
            <div className="w-full max-w-sm bg-white border border-slate-200/60 shadow-md rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Brain className="text-secondary w-5 h-5" />
                <h3 className="font-bold text-primary text-base">Panduan Simulasi Lapangan</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Bagian kiri mensimulasikan antarmuka <strong>Aplikasi Android Pelaksana (Fase 1)</strong>. Ikuti langkah-langkah berikut:
              </p>
              <ol className="flex flex-col gap-4 list-decimal list-inside text-xs text-slate-500">
                <li className="leading-relaxed">
                  Pilih proyek aktif di layar ponsel (contoh: <strong>Rumah Tinggal Modern A</strong>).
                </li>
                <li className="leading-relaxed">
                  Tinjau timeline pekerjaan sipil dan pilih salah satu item pekerjaan yang sedang berlangsung (contoh: <strong>Sloof Beton</strong>).
                </li>
                <li className="leading-relaxed">
                  Geser slider progres, perbarui status, masukkan hari kerja berjalan, serta ambil foto riil dari komputer Anda.
                </li>
                <li className="leading-relaxed">
                  Klik <strong>Simpan Progres Harian</strong>. Data lapangan akan langsung diperbarui secara sinkron dan otomatis memperbarui statistik dashboard Manager!
                </li>
              </ol>
            </div>
          </div>
        )}

      </main>

      {/* ========================================== */}
      {/* MODALS                                     */}
      {/* ========================================== */}

      {/* 1. Add Project Modal (Manager View) */}
      {addProjectModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-primary text-base">Tambah Proyek Konstruksi Baru</h3>
              <button onClick={() => setAddProjectModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateProject} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Nama Proyek *</label>
                <input
                  type="text"
                  required
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="Contoh: Pembangunan Ruko Kebayoran"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Lokasi Proyek *</label>
                  <input
                    type="text"
                    required
                    value={newProjLocation}
                    onChange={(e) => setNewProjLocation(e.target.value)}
                    placeholder="Contoh: Jakarta Selatan"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Pemilik Proyek (Owner) *</label>
                  <input
                    type="text"
                    required
                    value={newProjOwner}
                    onChange={(e) => setNewProjOwner(e.target.value)}
                    placeholder="Contoh: PT Bangun Persada"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500">Nilai Proyek (Rp) *</label>
                <input
                  type="number"
                  required
                  min={1000000}
                  value={newProjValue}
                  onChange={(e) => setNewProjValue(e.target.value)}
                  placeholder="Contoh: 750000000"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Tanggal Mulai *</label>
                  <input
                    type="date"
                    required
                    value={newProjStart}
                    onChange={(e) => setNewProjStart(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500">Tanggal Selesai (Target) *</label>
                  <input
                    type="date"
                    required
                    value={newProjEnd}
                    onChange={(e) => setNewProjEnd(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setAddProjectModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-orange-600 shadow-sm transition-all"
                >
                  Simpan Proyek
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Project Detail Modal (Manager View) */}
      {projectDetailModalOpen && currentViewingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-5xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-primary text-base leading-tight">{currentViewingProject.project_name}</h3>
                <span className="text-xs text-slate-400 font-medium">{currentViewingProject.location} • Pemilik: {currentViewingProject.owner}</span>
              </div>
              <button onClick={() => setProjectDetailModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
              {/* Left Column: Stats & Timeline Table */}
              <div className="flex-1 flex flex-col gap-5">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Nilai Kontrak</span>
                    <strong className="text-xs md:text-sm font-bold text-primary mt-1">{formatCurrency(currentViewingProject.value)}</strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Target Periode</span>
                    <strong className="text-xs md:text-sm font-bold text-primary mt-1">
                      {formatDateShort(currentViewingProject.start_date)} - {formatDateShort(currentViewingProject.end_date)}
                    </strong>
                  </div>
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Progres Kumulatif</span>
                    <strong className="text-xs md:text-sm font-extrabold text-secondary mt-1">{currentViewingProject.percentage}%</strong>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b-2 border-secondary pb-1.5 self-start">Timeline & Rincian Progres</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] font-bold tracking-wide border-b border-slate-100">
                          <th className="py-2.5 px-3">Nama Pekerjaan</th>
                          <th className="py-2.5 px-3">Volume</th>
                          <th className="py-2.5 px-3">Satuan</th>
                          <th className="py-2.5 px-3">Bobot</th>
                          <th className="py-2.5 px-3">Durasi</th>
                          <th className="py-2.5 px-3">Progres</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Jadwal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentViewingProject.tasks.map(t => {
                          const scheduleStatus = getScheduleStatus(t.target_days, t.current_day, t.progress);
                          const statusClass = 
                            t.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' :
                            t.status === 'Berjalan' ? 'bg-amber-50 text-amber-600' :
                            t.status === 'Tertunda' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500';

                          return (
                            <tr key={t.task_id} className="hover:bg-slate-50/30 transition-all">
                              <td className="py-2.5 px-3 font-bold text-slate-700">{t.task_name}</td>
                              <td className="py-2.5 px-3 text-slate-500">{t.volume}</td>
                              <td className="py-2.5 px-3 text-slate-500">{t.satuan}</td>
                              <td className="py-2.5 px-3 font-medium text-slate-600">{t.bobot}%</td>
                              <td className="py-2.5 px-3 text-slate-400">
                                {t.target_days} Hari <span className="text-[10px]">({t.current_day} H)</span>
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-1.5 min-w-[90px]">
                                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-secondary rounded-full" style={{ width: `${t.progress}%` }}></div>
                                  </div>
                                  <span className="font-bold text-slate-600 w-6 text-right">{t.progress}%</span>
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusClass}`}>{t.status}</span>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                                  scheduleStatus === 'Ahead Schedule' ? 'bg-emerald-50 text-emerald-600' :
                                  scheduleStatus === 'On Schedule' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                                }`}>{scheduleStatus}</span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Photos Gallery */}
              <div className="w-full lg:w-[320px] flex flex-col gap-4">
                <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b-2 border-secondary pb-1.5 self-start">Galeri Foto Lapangan</h4>
                <div className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {currentViewingProject.photos.length === 0 ? (
                    <div className="col-span-2 py-12 text-center text-slate-400 text-xs font-medium">
                      Belum ada foto yang diunggah.
                    </div>
                  ) : (
                    currentViewingProject.photos.map(ph => (
                      <div
                        key={ph.photo_id}
                        onClick={() => window.open(ph.image_url, '_blank')}
                        className="group relative rounded-xl overflow-hidden aspect-square border border-slate-100 shadow-sm cursor-pointer hover:scale-[1.02] transition-all"
                      >
                        <img src={ph.image_url} alt={ph.task_name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent p-2.5 flex flex-col justify-end opacity-95">
                          <span className="text-[10px] font-bold text-white truncate leading-tight">{ph.description}</span>
                          <span className="text-[8px] text-white/70 block mt-1">{formatDate(ph.date)} • {ph.task_name}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center shrink-0">
              <button
                onClick={() => exportDetailsToCSV(currentViewingProject)}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-all"
              >
                <Download className="w-4 h-4" />
                Ekspor Detail (CSV)
              </button>
              <button
                onClick={() => setProjectDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-all"
              >
                Tutup
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Global Footer */}
      <footer className="bg-slate-800 text-slate-400 text-center py-4 border-t border-slate-700/40 text-[10px] md:text-xs">
        <p>© 2026 Saputt Project. Sistem Monitoring Konstruksi Sipil Next.js • React 19 • Tailwind v3</p>
      </footer>
    </div>
  );
}
