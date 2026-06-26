'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  getProjectsData,
  getNotificationsData,
  saveNewProjectAction,
  saveProjectInfoAction,
  addTaskAction,
  deleteTaskAction,
  equalizeWeightsAction,
  saveMobileProgressAction
} from './actions';
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
  DollarSign,
  Edit,
  Trash2
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
  status: 'Belum Dimulai' | 'Berjalan' | 'Selesai' | 'Tertunda' | 'Terlambat';
  progress: number;
  target_days: number;
  current_day: number;
  start_date?: string; // Target Mulai (YYYY-MM-DD)
  end_date?: string; // Target Selesai (YYYY-MM-DD)
  actual_date?: string; // Realisasi Selesai (YYYY-MM-DD)
  notes?: string; // Catatan Lapangan / Kendala
  target_tomorrow?: string; // Rencana Besok
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
// DEFAULT MOCK DATA (TRACKING VERSI PELAKSANA - MILESTONE BASED)
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

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: "n-1", type: "alert-delayed", message: "Milestone *Galian Tanah & Fondasi Footplat* di proyek Pembangunan Ruko 2 Lantai B terindikasi terlambat!", time: "2 jam yang lalu" },
  { id: "n-2", type: "alert-photo", message: "Pelaksana mengunggah foto baru untuk milestone *Pengecoran Plat Lantai Dak Lt 2* di Rumah Tinggal Modern A.", time: "4 jam yang lalu" },
  { id: "n-3", type: "alert-progress", message: "Kemajuan progres fisik Renovasi Kantor PT C mencapai 90%.", time: "1 hari yang lalu" }
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

  // Manager Edit Project states
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editProjName, setEditProjName] = useState('');
  const [editProjLocation, setEditProjLocation] = useState('');
  const [editProjOwner, setEditProjOwner] = useState('');
  const [editProjValue, setEditProjValue] = useState('');
  const [editProjStart, setEditProjStart] = useState('');
  const [editProjEnd, setEditProjEnd] = useState('');

  // Manager Add Task states
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskVolume, setNewTaskVolume] = useState('');
  const [newTaskSatuan, setNewTaskSatuan] = useState('');
  const [newTaskBobot, setNewTaskBobot] = useState('');
  const [newTaskTargetDays, setNewTaskTargetDays] = useState('');
  const [newTaskStart, setNewTaskStart] = useState('');
  const [newTaskEnd, setNewTaskEnd] = useState('');

  // Auto-calculate target days from start and end dates
  useEffect(() => {
    if (newTaskStart && newTaskEnd) {
      const start = new Date(newTaskStart);
      const end = new Date(newTaskEnd);
      if (end >= start) {
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        setNewTaskTargetDays(diff.toString());
      } else {
        setNewTaskTargetDays('');
      }
    }
  }, [newTaskStart, newTaskEnd]);

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
    // Load initial data from SQLite/Turso database using Server Actions
    const loadDatabaseData = async () => {
      try {
        const dbProjects = await getProjectsData();
        const dbNotifications = await getNotificationsData();
        
        if (dbProjects && dbProjects.length > 0) {
          setProjects(dbProjects);
        } else {
          setProjects(DEFAULT_PROJECTS);
        }
        
        if (dbNotifications && dbNotifications.length > 0) {
          setNotifications(dbNotifications);
        } else {
          setNotifications(DEFAULT_NOTIFICATIONS);
        }
      } catch (error) {
        console.error("Gagal memuat data dari database, memuat dari localStorage sebagai cadangan:", error);
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
        }
      }
    };
    
    loadDatabaseData();
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
      weightedProgress += (t.progress * t.bobot);
    });
    if (totalWeight === 0) return 0;
    return Math.round(weightedProgress / totalWeight);
  };

  const getMilestoneScheduleInfo = (
    startDateStr?: string,
    endDateStr?: string,
    progress: number = 0,
    status: string = 'Belum Dimulai',
    actualDateStr?: string
  ) => {
    if (!startDateStr || !endDateStr) {
      return {
        statusText: 'Sesuai Jadwal',
        deviationText: 'Tepat Waktu',
        badgeColor: 'bg-blue-50 text-blue-600',
        deviationColor: 'text-slate-400'
      };
    }

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const today = new Date(); // Dynamic current local date

    const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    if (status === 'Selesai' || progress === 100) {
      if (actualDateStr) {
        const actualEnd = new Date(actualDateStr);
        const diffDays = Math.ceil((actualEnd.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 0) {
          return {
            statusText: 'Selesai',
            deviationText: diffDays === 0 ? 'Tepat Waktu' : `Lebih Cepat ${Math.abs(diffDays)} Hari`,
            badgeColor: 'bg-emerald-50 text-emerald-600',
            deviationColor: 'text-emerald-600 font-semibold'
          };
        } else {
          return {
            statusText: 'Terlambat Selesai',
            deviationText: `Terlambat ${diffDays} Hari`,
            badgeColor: 'bg-red-50 text-red-600',
            deviationColor: 'text-red-500 font-semibold'
          };
        }
      }
      return {
        statusText: 'Selesai',
        deviationText: 'Selesai',
        badgeColor: 'bg-emerald-50 text-emerald-600',
        deviationColor: 'text-emerald-600 font-semibold'
      };
    }

    if (today < start) {
      return {
        statusText: 'Belum Mulai',
        deviationText: 'Belum Dimulai',
        badgeColor: 'bg-slate-100 text-slate-500',
        deviationColor: 'text-slate-400'
      };
    }

    // Milestone is active (today is between start and end, or past end but not completed)
    const elapsedDays = Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (today > end) {
      const delayDays = Math.ceil((today.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
      return {
        statusText: 'Terlambat',
        deviationText: `Terlambat ${delayDays} Hari`,
        badgeColor: 'bg-red-50 text-red-600',
        deviationColor: 'text-red-600 font-bold'
      };
    }

    const expectedProgress = (elapsedDays / totalDays) * 100;
    const deviationProgress = progress - expectedProgress;

    const expectedDaysEarned = (progress / 100) * totalDays;
    const deviationDays = Math.round(elapsedDays - expectedDaysEarned);

    if (deviationProgress >= 5) {
      return {
        statusText: 'Lebih Cepat',
        deviationText: `Lebih Cepat ${Math.abs(deviationDays)} Hari`,
        badgeColor: 'bg-emerald-50 text-emerald-600',
        deviationColor: 'text-emerald-600 font-semibold'
      };
    } else if (deviationProgress < -8) {
      return {
        statusText: 'Terlambat',
        deviationText: `Terlambat ${deviationDays} Hari`,
        badgeColor: 'bg-red-50 text-red-600',
        deviationColor: 'text-red-500 font-semibold'
      };
    } else {
      return {
        statusText: 'Sesuai Jadwal',
        deviationText: 'Tepat Waktu',
        badgeColor: 'bg-blue-50 text-blue-600',
        deviationColor: 'text-blue-500'
      };
    }
  };

  const getScheduleStatus = (targetDays: number, currentDay: number, progress: number): 'Ahead Schedule' | 'On Schedule' | 'Behind Schedule' => {
    if (progress === 100) return 'On Schedule';
    if (currentDay === 0) return 'On Schedule';
    const expectedProgress = (currentDay / targetDays) * 100;
    if (progress >= expectedProgress + 5) return 'Ahead Schedule';
    if (progress < expectedProgress - 8) return 'Behind Schedule';
    return 'On Schedule';
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
      const sched = getMilestoneScheduleInfo(t.start_date, t.end_date, t.progress, t.status, t.actual_date);
      if (sched.statusText.includes('Terlambat')) {
        hasDelayedTask = true;
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

    const newProjId = "proj-" + Date.now();
    const projValue = parseInt(newProjValue) || 0;

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
      project_id: newProjId,
      project_name: newProjName,
      location: newProjLocation,
      owner: newProjOwner,
      value: projValue,
      start_date: newProjStart,
      end_date: newProjEnd,
      percentage: 0,
      tasks: [],
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
    
    // Simpan ke database menggunakan Server Action secara asynchronous
    saveNewProjectAction({
      project_id: newProjId,
      project_name: newProjName,
      location: newProjLocation,
      owner: newProjOwner,
      value: projValue,
      start_date: newProjStart,
      end_date: newProjEnd,
      percentage: 0
    }, updatedNotifications[0]);

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

  const handleOpenDetailModal = (project: Project) => {
    setSelectedProjectId(project.project_id);
    setEditProjName(project.project_name);
    setEditProjLocation(project.location);
    setEditProjOwner(project.owner);
    setEditProjValue(project.value.toString());
    setEditProjStart(project.start_date);
    setEditProjEnd(project.end_date);
    setIsEditingProject(false);
    setIsAddingTask(false);
    setProjectDetailModalOpen(true);
  };

  const handleSaveProjectInfo = (projectId: string) => {
    if (!editProjName || !editProjLocation || !editProjOwner || !editProjValue || !editProjStart || !editProjEnd) {
      triggerToast("Mohon isi seluruh kolom wajib info proyek", "error");
      return;
    }

    const updatedProjects = projects.map(p => {
      if (p.project_id === projectId) {
        return {
          ...p,
          project_name: editProjName,
          location: editProjLocation,
          owner: editProjOwner,
          value: parseInt(editProjValue) || p.value,
          start_date: editProjStart,
          end_date: editProjEnd
        };
      }
      return p;
    });

    const updatedNotifications = [
      {
        id: "notif-edit-" + Date.now(),
        type: "alert-info" as const,
        message: `Informasi proyek *${editProjName}* telah diubah oleh Manager`,
        time: "Baru saja"
      },
      ...notifications
    ];

    saveState(updatedProjects, updatedNotifications);
    
    // Simpan ke database menggunakan Server Action secara asynchronous
    saveProjectInfoAction(projectId, {
      projectName: editProjName,
      location: editProjLocation,
      owner: editProjOwner,
      value: parseInt(editProjValue) || 0,
      startDate: editProjStart,
      endDate: editProjEnd
    }, updatedNotifications[0]);

    setIsEditingProject(false);
    triggerToast("Informasi proyek berhasil diperbarui", "success");
  };

  const handleAddTask = (projectId: string) => {
    if (!newTaskName || !newTaskVolume || !newTaskSatuan || !newTaskBobot || !newTaskTargetDays || !newTaskStart || !newTaskEnd) {
      triggerToast("Mohon isi seluruh kolom data pekerjaan (termasuk jadwal target)", "error");
      return;
    }

    const taskWeight = parseFloat(newTaskBobot);
    const taskVolume = parseFloat(newTaskVolume);
    const taskTarget = parseInt(newTaskTargetDays);

    if (isNaN(taskWeight) || isNaN(taskVolume) || isNaN(taskTarget)) {
      triggerToast("Data volume, bobot, dan target harus berupa angka", "error");
      return;
    }

    const newTask: Task = {
      task_id: "t-added-" + Date.now(),
      task_name: newTaskName,
      volume: taskVolume,
      satuan: newTaskSatuan,
      bobot: taskWeight,
      status: 'Belum Dimulai',
      progress: 0,
      target_days: taskTarget,
      current_day: 0,
      start_date: newTaskStart,
      end_date: newTaskEnd
    };

    let nextPercentage = 0;
    const updatedProjects = projects.map(p => {
      if (p.project_id === projectId) {
        const nextTasks = [...p.tasks, newTask];
        nextPercentage = calculateWeightedProjectPercentage(nextTasks);

        return {
          ...p,
          tasks: nextTasks,
          percentage: nextPercentage
        };
      }
      return p;
    });

    const updatedNotifications = [
      {
        id: "notif-addtask-" + Date.now(),
        type: "alert-info" as const,
        message: `Milestone baru *${newTaskName}* ditambahkan ke proyek *${editProjName}*`,
        time: "Baru saja"
      },
      ...notifications
    ];

    saveState(updatedProjects, updatedNotifications);
    
    // Simpan ke database menggunakan Server Action secara asynchronous
    addTaskAction(projectId, newTask, nextPercentage, updatedNotifications[0]);
    
    // Reset Form
    setNewTaskName('');
    setNewTaskVolume('');
    setNewTaskSatuan('');
    setNewTaskBobot('');
    setNewTaskTargetDays('');
    setNewTaskStart('');
    setNewTaskEnd('');
    setIsAddingTask(false);

    triggerToast(`Milestone ${newTaskName} berhasil ditambahkan`, "success");
  };

  const handleDeleteTask = (projectId: string, taskId: string, taskName: string) => {
    let nextPercentage = 0;
    const updatedProjects = projects.map(p => {
      if (p.project_id === projectId) {
        const nextTasks = p.tasks.filter(t => t.task_id !== taskId);
        nextPercentage = calculateWeightedProjectPercentage(nextTasks);

        return {
          ...p,
          tasks: nextTasks,
          percentage: nextPercentage
        };
      }
      return p;
    });

    const updatedNotifications = [
      {
        id: "notif-deltask-" + Date.now(),
        type: "alert-delayed" as const,
        message: `Milestone *${taskName}* dihapus dari proyek *${editProjName}*`,
        time: "Baru saja"
      },
      ...notifications
    ];

    saveState(updatedProjects, updatedNotifications);
    
    // Simpan ke database menggunakan Server Action secara asynchronous
    deleteTaskAction(projectId, taskId, nextPercentage, updatedNotifications[0]);

    triggerToast(`Milestone ${taskName} berhasil dihapus`, "success");
  };

  const handleEqualizeWeights = (projectId: string) => {
    let nextPercentage = 0;
    let tasksToUpdate: { taskId: string; bobot: number }[] = [];
    const updatedProjects = projects.map(p => {
      if (p.project_id === projectId) {
        if (p.tasks.length === 0) return p;
        const equalWeight = parseFloat((100 / p.tasks.length).toFixed(2));
        const updatedTasks = p.tasks.map(t => ({
          ...t,
          bobot: equalWeight
        }));

        // Adjust last task so the sum is exactly 100
        let sum = 0;
        for (let i = 0; i < updatedTasks.length - 1; i++) {
          sum += updatedTasks[i].bobot;
        }
        if (updatedTasks.length > 0) {
          updatedTasks[updatedTasks.length - 1].bobot = parseFloat((100 - sum).toFixed(2));
        }

        tasksToUpdate = updatedTasks.map(t => ({ taskId: t.task_id, bobot: t.bobot }));
        nextPercentage = calculateWeightedProjectPercentage(updatedTasks);
        return {
          ...p,
          tasks: updatedTasks,
          percentage: nextPercentage
        };
      }
      return p;
    });

    const updatedNotifications = [
      {
        id: "notif-equalize-" + Date.now(),
        type: "alert-info" as const,
        message: `Bobot milestone untuk proyek *${editProjName || 'ini'}* diratakan secara merata`,
        time: "Baru saja"
      },
      ...notifications
    ];

    saveState(updatedProjects, updatedNotifications);
    
    // Simpan ke database menggunakan Server Action secara asynchronous
    if (tasksToUpdate.length > 0) {
      equalizeWeightsAction(projectId, tasksToUpdate, nextPercentage, updatedNotifications[0]);
    }

    triggerToast("Bobot pekerjaan berhasil dibagi rata", "success");
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
      setEditPhotoDesc(task.notes || '');
      setEditTargetTomorrow(task.target_tomorrow || '');
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
    const sched = getMilestoneScheduleInfo(task.start_date, task.end_date, editProgress, editStatus, task.actual_date);

    return `*LAPORAN TRACKING MILESTONE (VERSI PELAKSANA)*
---------------------------------------------
*Proyek:* ${project.project_name}
*Tanggal Laporan:* ${formattedDate}

*Milestone / Target:* ${task.task_name}
*Target Periode:* ${task.start_date ? formatDateShort(task.start_date) : '-'} s/d ${task.end_date ? formatDateShort(task.end_date) : '-'}
*Progres Fisik Aktual:* ${editProgress}%
*Status Target:* ${editStatus} (${sched.statusText} - ${sched.deviationText})

*Catatan & Kendala Lapangan:*
${editPhotoDesc || "Lancar, tidak ada kendala berarti."}

*Rencana Kerja Besok:*
${editTargetTomorrow || "Melanjutkan target milestone berjalan."}
---------------------------------------------
_Dikirim via Saputt Project Tracking Dashboard_`;
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
    const oldProgress = task.progress;
    
    let nextPercentage = 0;
    let taskUpdates: any = {};
    let historyUpdates: any[] = [];
    let photoToInsert: any = null;
    let notifsToInsert: any[] = [];

    const updatedProjects = projects.map(p => {
      if (p.project_id === project.project_id) {
        const updatedTasks = p.tasks.map(t => {
          if (t.task_id === task.task_id) {
            const isCompleted = editProgress === 100 || editStatus === 'Selesai';
            taskUpdates = {
              progress: editProgress,
              status: editStatus,
              current_day: editCurrentDay,
              notes: editPhotoDesc, // Save daily log/notes
              target_tomorrow: editTargetTomorrow,
              actual_date: isCompleted ? (t.actual_date || new Date().toISOString().split("T")[0]) : t.actual_date
            };
            return {
              ...t,
              ...taskUpdates
            };
          }
          return t;
        });

        // Add photo if uploaded
        let updatedPhotos = [...p.photos];
        if (editPhotoData) {
          photoToInsert = {
            photo_id: "photo-" + Date.now(),
            task_name: task.task_name,
            description: editPhotoDesc || `${task.task_name} update progres ${editProgress}%`,
            date: new Date().toISOString().split("T")[0],
            image_url: editPhotoData
          };
          updatedPhotos = [{ ...photoToInsert, location: p.location.split(",")[0] }, ...updatedPhotos];
        }

        nextPercentage = calculateWeightedProjectPercentage(updatedTasks);

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
        historyUpdates = updatedHistory;

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

    const newNotifications = [...notifications];
    const n1 = {
      id: "notif-prog-" + Date.now(),
      type: "alert-progress" as const,
      message: `Pelaksana memperbarui *${task.task_name}* (${editProgress}%) di *${project.project_name}*`,
      time: "Baru saja"
    };
    newNotifications.unshift(n1);
    notifsToInsert.push(n1);

    const sched = getMilestoneScheduleInfo(task.start_date, task.end_date, editProgress, editStatus, task.actual_date);
    if (sched.statusText === 'Terlambat' && editStatus !== 'Selesai') {
      const n2 = {
        id: "notif-warn-" + Date.now(),
        type: "alert-delayed" as const,
        message: `[Peringatan] Milestone *${task.task_name}* di *${project.project_name}* terdeteksi terlambat (${sched.deviationText})!`,
        time: "Baru saja"
      };
      newNotifications.unshift(n2);
      notifsToInsert.push(n2);
    }

    if (newNotifications.length > 10) newNotifications.pop();

    saveState(updatedProjects, newNotifications);
    
    // Simpan ke database menggunakan Server Action secara asynchronous
    saveMobileProgressAction(
      project.project_id,
      task.task_id,
      taskUpdates,
      nextPercentage,
      historyUpdates,
      photoToInsert,
      notifsToInsert
    );

    triggerToast("Progres milestone berhasil disimpan", "success");
    
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
                                onClick={() => handleOpenDetailModal(p)}
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

                      {/* Timeline List (Milestone-based) */}
                      <div className="flex flex-col gap-2.5">
                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Target Pekerjaan (Milestone)</span>
                        {project.tasks.map(t => {
                          const statusClass = 
                            t.status === 'Selesai' ? 'bg-emerald-500' :
                            t.status === 'Berjalan' ? 'bg-amber-500' :
                            t.status === 'Tertunda' ? 'bg-red-500' : 'bg-slate-300';
                          
                          const badgeClass =
                            t.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' :
                            t.status === 'Berjalan' ? 'bg-amber-50 text-amber-600' :
                            t.status === 'Tertunda' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500';

                          const sched = getMilestoneScheduleInfo(t.start_date, t.end_date, t.progress, t.status, t.actual_date);

                          return (
                            <div
                              key={t.task_id}
                              onClick={() => selectMobileTask(t.task_id, project)}
                              className="bg-white border border-slate-200/80 rounded-xl p-3 flex flex-col gap-2 cursor-pointer hover:border-secondary hover:translate-x-1 transition-all"
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${statusClass}`}></span>
                                  <span className="font-bold text-slate-800 text-[11px] leading-tight">{t.task_name}</span>
                                </div>
                                <span className="text-[10px] font-extrabold text-slate-700">{t.progress}%</span>
                              </div>
                              <div className="flex justify-between items-center text-[9px] text-slate-400 font-medium">
                                <span>Target: {t.start_date ? formatDateShort(t.start_date) : '-'} - {t.end_date ? formatDateShort(t.end_date) : '-'}</span>
                                <span className={`font-bold px-1.5 py-0.5 rounded ${sched.badgeColor}`}>{sched.statusText}</span>
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

                  // Dynamic live schedule evaluation on the fly!
                  const schedLive = getMilestoneScheduleInfo(task.start_date, task.end_date, editProgress, editStatus, task.actual_date);

                  return (
                    <div className="flex flex-col gap-4 animate-fadeIn">
                      {/* Task Detail Card */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
                        <div className="border-b border-slate-100 pb-3">
                          <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{task.task_name}</h3>
                          <div className="grid grid-cols-3 gap-2 mt-2">
                            <div className="bg-slate-50 rounded p-1.5 flex flex-col items-center">
                              <span className="text-[8px] text-slate-400 uppercase">Target Vol</span>
                              <span className="text-[10px] font-bold text-primary">{task.volume} {task.satuan}</span>
                            </div>
                            <div className="bg-slate-50 rounded p-1.5 flex flex-col items-center">
                              <span className="text-[8px] text-slate-400 uppercase">Bobot Proyek</span>
                              <span className="text-[10px] font-bold text-primary">{task.bobot.toFixed(1)}%</span>
                            </div>
                            <div className="bg-slate-50 rounded p-1.5 flex flex-col items-center">
                              <span className="text-[8px] text-slate-400 uppercase">Durasi Rencana</span>
                              <span className="text-[10px] font-bold text-primary">{task.target_days} Hari</span>
                            </div>
                          </div>
                        </div>

                        {/* Slider Progress */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Persentase Progres Fisik</label>
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
                          <label className="text-[10px] font-bold text-slate-500">Status Target Milestone</label>
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
                          <label className="text-[10px] font-bold text-slate-500">Hari Pengerjaan Lapangan (Saat Ini)</label>
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

                        {/* Schedule evaluation (LIVE UPDATE) */}
                        <div className="bg-slate-50 rounded-lg border border-slate-100 p-2.5 flex justify-between items-center">
                          <span className="text-[10px] text-slate-500 font-semibold">Live Deviasi Jadwal:</span>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${schedLive.badgeColor}`}>
                            {schedLive.statusText} • {schedLive.deviationText}
                          </span>
                        </div>

                        {/* Simulated Photo Upload */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Dokumentasi Progres Fisik (Foto)</label>
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

                        {/* Photo Caption / Notes */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Catatan Harian Lapangan / Kendala</label>
                          <textarea
                            rows={2}
                            value={editPhotoDesc}
                            onChange={(e) => setEditPhotoDesc(e.target.value)}
                            placeholder="Contoh: Pengecoran berjalan lancar, kendala cuaca hujan rintik di sore hari..."
                            className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                          />
                        </div>

                        {/* Target Tomorrow */}
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-slate-500">Rencana Kerja Besok</label>
                          <input
                            type="text"
                            value={editTargetTomorrow}
                            onChange={(e) => setEditTargetTomorrow(e.target.value)}
                            placeholder="Contoh: Bongkar bekisting dan lanjut plesteran dinding..."
                            className="w-full px-2.5 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                          />
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={() => handleSaveMobileTask(project, task)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary text-white rounded-xl text-xs font-bold hover:bg-orange-600 shadow-sm transition-all mt-2"
                        >
                          <Save className="w-4 h-4" />
                          Simpan Progres Lapangan
                        </button>
                      </div>

                      {/* Share Progress Widget */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col gap-3 shadow-sm">
                        <span className="text-[10px] font-bold text-primary flex items-center gap-1.5 uppercase border-b border-slate-50 pb-2">
                          <Share2 className="w-3.5 h-3.5 text-secondary" />
                          Kirim Progres WhatsApp (Pelaksana)
                        </span>
                        <div className="bg-slate-50 border border-slate-200/60 rounded-lg p-2.5 font-mono text-[9px] text-slate-600 white-space-pre-wrap max-h-[140px] overflow-y-auto leading-relaxed">
                          {generateWhatsAppReport(project, task)}
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                          <button
                            onClick={() => copyReport(project, task)}
                            className="flex items-center justify-center gap-1.5 py-2 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Salin Laporan
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
              {isEditingProject ? (
                <div className="flex-1 flex flex-col md:flex-row gap-3 mr-4 items-center">
                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="text"
                      value={editProjName}
                      onChange={(e) => setEditProjName(e.target.value)}
                      className="w-full text-sm font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                      placeholder="Nama Proyek"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editProjLocation}
                        onChange={(e) => setEditProjLocation(e.target.value)}
                        className="w-1/2 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                        placeholder="Lokasi Proyek"
                      />
                      <input
                        type="text"
                        value={editProjOwner}
                        onChange={(e) => setEditProjOwner(e.target.value)}
                        className="w-1/2 text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                        placeholder="Pemilik Proyek"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0 w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleSaveProjectInfo(currentViewingProject.project_id)}
                      className="px-3.5 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 shadow-sm transition-all"
                    >
                      Simpan Info
                    </button>
                    <button
                      onClick={() => setIsEditingProject(false)}
                      className="px-3.5 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex justify-between items-center mr-4">
                  <div>
                    <h3 className="font-bold text-primary text-base leading-tight">{currentViewingProject.project_name}</h3>
                    <span className="text-xs text-slate-400 font-medium">{currentViewingProject.location} • Pemilik: {currentViewingProject.owner}</span>
                  </div>
                  <button
                    onClick={() => {
                      setEditProjName(currentViewingProject.project_name);
                      setEditProjLocation(currentViewingProject.location);
                      setEditProjOwner(currentViewingProject.owner);
                      setEditProjValue(currentViewingProject.value.toString());
                      setEditProjStart(currentViewingProject.start_date);
                      setEditProjEnd(currentViewingProject.end_date);
                      setIsEditingProject(true);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-500" />
                    Edit Detail Proyek
                  </button>
                </div>
              )}
              <button onClick={() => setProjectDetailModalOpen(false)} className="text-slate-400 hover:text-red-500 transition-all shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
              {/* Left Column: Stats & Timeline Table */}
              <div className="flex-1 flex flex-col gap-5">
                
                {/* Stats Section */}
                {isEditingProject ? (
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Nilai Kontrak (Rp)</span>
                      <input
                        type="number"
                        value={editProjValue}
                        onChange={(e) => setEditProjValue(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Mulai</span>
                      <input
                        type="date"
                        value={editProjStart}
                        onChange={(e) => setEditProjStart(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tanggal Selesai (Target)</span>
                      <input
                        type="date"
                        value={editProjEnd}
                        onChange={(e) => setEditProjEnd(e.target.value)}
                        className="text-xs border border-slate-200 rounded-lg p-2 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1 justify-end">
                      <span className="text-[10px] text-slate-400 italic">Nilai progres keseluruhan dihitung otomatis dari bobot pekerjaan.</span>
                    </div>
                  </div>
                ) : (
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
                )}

                {/* Timeline Section (Milestone-based) */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <div>
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider border-b-2 border-secondary pb-1 self-start">
                        Target Pekerjaan (Milestone)
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-medium">Tracking performa harian lapangan versi pelaksana tanpa RAB.</p>
                    </div>
                    {!isAddingTask && (
                      <button
                        onClick={() => {
                          setNewTaskVolume('1');
                          setNewTaskSatuan('Lump Sum');
                          setNewTaskStart('');
                          setNewTaskEnd('');
                          setNewTaskBobot('');
                          setNewTaskTargetDays('');
                          setIsAddingTask(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1 bg-secondary text-white rounded-lg text-[10px] font-bold hover:bg-orange-600 transition-all shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Milestone
                      </button>
                    )}
                  </div>

                  {/* Inline Add Milestone Form */}
                  {isAddingTask && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3 animate-fadeIn">
                      <span className="text-[10px] font-bold text-primary uppercase">Tambah Milestone / Target Baru</span>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        <div className="flex flex-col gap-1 col-span-2">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Nama Milestone</span>
                          <input
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="Contoh: Pekerjaan Pondasi"
                            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Target Mulai</span>
                          <input
                            type="date"
                            value={newTaskStart}
                            onChange={(e) => setNewTaskStart(e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Target Selesai</span>
                          <input
                            type="date"
                            value={newTaskEnd}
                            onChange={(e) => setNewTaskEnd(e.target.value)}
                            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Bobot Target (%)</span>
                          <input
                            type="number"
                            step="0.1"
                            value={newTaskBobot}
                            onChange={(e) => setNewTaskBobot(e.target.value)}
                            placeholder="Bobot %"
                            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Durasi (Hari)</span>
                          <input
                            type="text"
                            disabled
                            value={newTaskTargetDays ? `${newTaskTargetDays} Hari` : '-'}
                            className="text-xs border border-slate-150 rounded-lg p-2 bg-slate-100 text-slate-500 font-bold text-center"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 md:w-1/3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Volume Fisik (Opsional)</span>
                          <input
                            type="number"
                            value={newTaskVolume}
                            onChange={(e) => setNewTaskVolume(e.target.value)}
                            placeholder="1"
                            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase">Satuan (Opsional)</span>
                          <input
                            type="text"
                            value={newTaskSatuan}
                            onChange={(e) => setNewTaskSatuan(e.target.value)}
                            placeholder="Lump Sum"
                            className="text-xs border border-slate-200 rounded-lg p-2 bg-white focus:outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2 border-t border-slate-200/40">
                        <button
                          onClick={() => setIsAddingTask(false)}
                          className="px-3.5 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold hover:bg-slate-200"
                        >
                          Batal
                        </button>
                        <button
                          onClick={() => handleAddTask(currentViewingProject.project_id)}
                          className="px-3.5 py-1.5 bg-secondary text-white rounded-lg text-xs font-bold hover:bg-orange-600 shadow-sm"
                        >
                          Simpan Milestone
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Milestones Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 uppercase text-[9px] font-bold tracking-wide border-b border-slate-100">
                          <th className="py-2.5 px-3">Target Pekerjaan (Milestone)</th>
                          <th className="py-2.5 px-3">Target Jadwal</th>
                          <th className="py-2.5 px-3">Realisasi Selesai</th>
                          <th className="py-2.5 px-3">Bobot</th>
                          <th className="py-2.5 px-3">Progres Fisik</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Deviasi Jadwal</th>
                          <th className="py-2.5 px-3">Catatan / Kendala Lapangan</th>
                          <th className="py-2.5 px-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentViewingProject.tasks.map(t => {
                          const sched = getMilestoneScheduleInfo(t.start_date, t.end_date, t.progress, t.status, t.actual_date);
                          const statusClass = 
                            t.status === 'Selesai' ? 'bg-emerald-50 text-emerald-600' :
                            t.status === 'Berjalan' ? 'bg-amber-50 text-amber-600' :
                            t.status === 'Tertunda' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-500';

                          return (
                            <tr key={t.task_id} className="hover:bg-slate-50/30 transition-all">
                              <td className="py-3 px-3">
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-700 leading-tight">{t.task_name}</span>
                                  <span className="text-[9px] text-slate-400 mt-0.5">Target: {t.volume} {t.satuan}</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-slate-600">
                                <div className="flex flex-col">
                                  <span className="font-semibold">{t.start_date ? formatDateShort(t.start_date) : '-'} - {t.end_date ? formatDateShort(t.end_date) : '-'}</span>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase">{t.target_days} Hari</span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-slate-500 font-medium">
                                {t.status === 'Selesai' && t.actual_date ? formatDate(t.actual_date) : '-'}
                              </td>
                              <td className="py-3 px-3 font-bold text-slate-700">{t.bobot.toFixed(1)}%</td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1.5 min-w-[80px]">
                                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: `${t.progress}%` }}></div>
                                  </div>
                                  <span className="font-extrabold text-slate-700 w-6 text-right">{t.progress}%</span>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusClass}`}>{t.status}</span>
                              </td>
                              <td className="py-3 px-3">
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${sched.badgeColor}`}>
                                  {sched.deviationText}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-slate-500 max-w-[160px] truncate" title={t.notes}>
                                {t.notes ? (
                                  <span className="flex items-center gap-1 text-[10px] text-slate-600 font-medium">
                                    <Clock className="w-3 h-3 text-secondary shrink-0" />
                                    {t.notes}
                                  </span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                              <td className="py-3 px-3 text-center">
                                <button
                                  onClick={() => handleDeleteTask(currentViewingProject.project_id, t.task_id, t.task_name)}
                                  className="text-slate-400 hover:text-red-500 p-1 rounded transition-all"
                                  title="Hapus Milestone"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Weight Summary and Equalizer Banner */}
                  {(() => {
                    const totalWeight = currentViewingProject.tasks.reduce((sum, t) => sum + t.bobot, 0);
                    const isWeightUnbalanced = Math.abs(totalWeight - 100) > 0.05;
                    return (
                      <div className="flex flex-col md:flex-row justify-between items-center bg-slate-50 border border-slate-200/60 rounded-xl p-3 mt-1 gap-3 text-xs shadow-sm">
                        <div className="flex items-center gap-2">
                          <Percent className="text-secondary w-4.5 h-4.5 shrink-0" />
                          <div>
                            <span className="font-semibold text-slate-700">Akumulasi Bobot Target: </span>
                            <strong className={`font-extrabold ${isWeightUnbalanced ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {totalWeight.toFixed(1)}%
                            </strong>
                            {isWeightUnbalanced ? (
                              <span className="text-slate-400 block md:inline md:ml-2">
                                (Disarankan tepat 100% untuk kalkulasi proyek akurat)
                              </span>
                            ) : (
                              <span className="text-emerald-600 font-medium block md:inline md:ml-2">
                                (Bobot optimal 100%)
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleEqualizeWeights(currentViewingProject.project_id)}
                          className="shrink-0 px-3 py-1.5 bg-primary hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm flex items-center gap-1"
                        >
                          Ratakan Bobot (Bagi Rata)
                        </button>
                      </div>
                    );
                  })()}
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
