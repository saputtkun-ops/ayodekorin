/* ==========================================================================
   SAPUTT PROJECT - CORE APPLICATION LOGIC
   ========================================================================== */

// 1. DEFAULT STATE / DATA (MOCK DATA BASED ON PRD)
const DEFAULT_PROJECTS = [
    {
        project_id: "proj-1",
        project_name: "Rumah Tinggal Modern A",
        location: "Kebayoran Baru, Jakarta Selatan",
        owner: "Bapak H. Ahmad",
        value: 750000000, // 750 Juta
        start_date: "2026-05-01",
        end_date: "2026-08-15",
        percentage: 78, // Initial, will be calculated dynamically from tasks
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
        value: 1200000000, // 1.2 Milyar
        start_date: "2026-06-01",
        end_date: "2026-11-15",
        percentage: 45,
        tasks: [
            { task_id: "t2-1", task_name: "Persiapan", volume: 1, satuan: "Lump Sum", bobot: 5, status: "Selesai", progress: 100, target_days: 7, current_day: 7 },
            { task_id: "t2-2", task_name: "Galian Tanah", volume: 90, satuan: "m3", bobot: 5, status: "Selesai", progress: 100, target_days: 12, current_day: 12 },
            { task_id: "t2-3", task_name: "Pondasi Batu Kali", volume: 75, satuan: "m3", bobot: 15, status: "Berjalan", progress: 80, target_days: 20, current_day: 18 },
            { task_id: "t2-4", task_name: "Sloof Beton 15/20", volume: 8.5, satuan: "m3", bobot: 10, status: "Berjalan", progress: 30, target_days: 15, current_day: 14 }, // Delayed
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
        value: 450000000, // 450 Juta
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

const DEFAULT_NOTIFICATIONS = [
    { id: "n-1", type: "alert-delayed", message: "Pekerjaan Sloof di proyek Pembangunan Ruko 2 Lantai B terindikasi terlambat (Behind Schedule)!", time: "2 jam yang lalu" },
    { id: "n-2", type: "alert-photo", message: "Pelaksana mengunggah foto baru untuk pekerjaan Sloof di Rumah Tinggal Modern A.", time: "4 jam yang lalu" },
    { id: "n-3", type: "alert-progress", message: "Kemajuan progres rata-rata Renovasi Kantor PT C mencapai 90%.", time: "1 hari yang lalu" }
];

// 2. STATE INITIALIZATION
let state = {
    projects: [],
    notifications: [],
    activeRole: "manager", // 'manager' or 'pelaksana'
    // Mobile View specific states
    mobileCurrentScreen: "project-list", // 'project-list', 'project-detail', 'task-edit'
    mobileSelectedProjectId: null,
    mobileSelectedTaskId: null,
    mobileUploadedPhotoData: null // Stores temporary dataURL of uploaded photo
};

// Load or initialize state from localStorage
function initAppState() {
    const savedState = localStorage.getItem("saputt_project_state");
    if (savedState) {
        try {
            state = JSON.parse(savedState);
            // Reset mobile UI flows to home on refresh
            state.mobileCurrentScreen = "project-list";
            state.mobileSelectedProjectId = null;
            state.mobileSelectedTaskId = null;
            state.mobileUploadedPhotoData = null;
        } catch (e) {
            console.error("Gagal memuat state, inisialisasi ulang dengan default.", e);
            state.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
            state.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
        }
    } else {
        state.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
        state.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
        saveStateToLocalStorage();
    }
    
    // Auto calculate overall project percentages dynamically
    state.projects.forEach(calculateProjectPercentage);
    
    renderApp();
}

function saveStateToLocalStorage() {
    localStorage.setItem("saputt_project_state", JSON.stringify(state));
}

// Helper to dynamically calculate overall project progress as a weighted average
function calculateProjectPercentage(project) {
    let totalWeight = 0;
    let weightedProgress = 0;
    project.tasks.forEach(t => {
        totalWeight += t.bobot;
        weightedProgress += (t.progress * t.bobot) / 100;
    });
    
    // Should sum up to 100% weight, but we divide to be safe
    project.percentage = Math.round(weightedProgress);
}

// 3. UI RENDER ROUTER
function renderApp() {
    // Refresh Icons first
    lucide.createIcons();
    
    // Render view depending on active role
    if (state.activeRole === "manager") {
        renderManagerDashboard();
    } else {
        renderPelaksanaMobileSimulator();
    }
}

// Role Switcher Tab
function switchRole(role) {
    state.activeRole = role;
    
    // Toggle tab active styles
    document.getElementById("btn-role-manager").classList.toggle("active", role === "manager");
    document.getElementById("btn-role-pelaksana").classList.toggle("active", role === "pelaksana");
    
    // Toggle section visibility
    document.getElementById("manager-view").classList.toggle("active", role === "manager");
    document.getElementById("pelaksana-view").classList.toggle("active", role === "pelaksana");
    
    saveStateToLocalStorage();
    renderApp();
}

// ==========================================================================
// MANAGER VIEW (WEB DASHBOARD) IMPLEMENTATION
// ==========================================================================

function renderManagerDashboard() {
    // Calculate & Display KPIs
    const totalProjects = state.projects.length;
    const completedProjects = state.projects.filter(p => p.percentage === 100).length;
    
    // Delayed projects calculation
    // Project is delayed if any of its active tasks are "Behind Schedule"
    let delayedProjectsCount = 0;
    state.projects.forEach(p => {
        let hasDelayedTask = false;
        p.tasks.forEach(t => {
            if (t.status === "Berjalan" || t.status === "Tertunda") {
                const scheduleStatus = calculateScheduleStatus(t.target_days, t.current_day, t.progress);
                if (scheduleStatus === "Behind Schedule") {
                    hasDelayedTask = true;
                }
            }
        });
        if (hasDelayedTask && p.percentage < 100) {
            delayedProjectsCount++;
        }
    });

    // Average progress
    const avgProgress = totalProjects > 0 
        ? Math.round(state.projects.reduce((sum, p) => sum + p.percentage, 0) / totalProjects)
        : 0;

    document.getElementById("kpi-active-projects").textContent = totalProjects - completedProjects;
    document.getElementById("kpi-completed-projects").textContent = completedProjects;
    document.getElementById("kpi-delayed-projects").textContent = delayedProjectsCount;
    document.getElementById("kpi-avg-progress").textContent = `${avgProgress}%`;

    // Render Project Sheet Table
    const tableBody = document.getElementById("project-table-body");
    tableBody.innerHTML = "";

    if (state.projects.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align: center;" class="text-muted">Belum ada proyek yang terdaftar. Klik "Tambah Proyek" untuk memulai.</td></tr>`;
    } else {
        state.projects.forEach(p => {
            const formattedValue = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.value);
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${p.project_name}</strong></td>
                <td>${p.location}</td>
                <td>${p.owner}</td>
                <td>${formattedValue}</td>
                <td><span class="text-muted" style="font-size: 0.82rem;">${formatDate(p.start_date)} s/d ${formatDate(p.end_date)}</span></td>
                <td>
                    <div class="progress-bar-wrapper">
                        <div class="progress-track">
                            <div class="progress-fill" style="width: ${p.percentage}%"></div>
                        </div>
                        <span class="progress-text">${p.percentage}%</span>
                    </div>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="openProjectDetailModal('${p.project_id}')">
                        <i data-lucide="eye" class="inline-icon"></i> Detail
                    </button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
    }

    // Render Custom SVG Chart
    renderSVGChart();

    // Render Notifications
    renderNotificationsPanel();

    // Render AI Analysis
    renderAIAnalysis();

    lucide.createIcons();
}

// Custom Interactive SVG Line Chart Rendering
function renderSVGChart() {
    const wrapper = document.getElementById("svg-chart-wrapper");
    wrapper.innerHTML = "";

    if (state.projects.length === 0) {
        wrapper.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); padding-top: 50px;">Tidak ada data grafik progres.</div>`;
        return;
    }

    // Find the max number of history weeks among all projects to determine X-axis points
    let maxWeeks = 4;
    state.projects.forEach(p => {
        if (p.history && p.history.length > maxWeeks) {
            maxWeeks = p.history.length;
        }
    });

    const paddingX = 40;
    const paddingY = 30;
    const width = wrapper.clientWidth || 450;
    const height = 220;
    const chartWidth = width - paddingX * 2;
    const chartHeight = height - paddingY * 2;

    let svgContent = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

    // 1. Draw Grid Lines (Y-axis grid representing 0%, 25%, 50%, 75%, 100%)
    for (let i = 0; i <= 4; i++) {
        const percentVal = i * 25;
        const y = paddingY + chartHeight - (percentVal / 100) * chartHeight;
        // Horizontal gridline
        svgContent += `<line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="#E2E8F0" stroke-dasharray="4" stroke-width="1" />`;
        // Y-axis label
        svgContent += `<text x="${paddingX - 10}" y="${y + 4}" font-family="Outfit" font-size="10" fill="#64748B" text-anchor="end">${percentVal}%</text>`;
    }

    // 2. Draw X-axis Labels (Weeks)
    for (let w = 1; w <= maxWeeks; w++) {
        const x = paddingX + ((w - 1) / (maxWeeks - 1)) * chartWidth;
        // X-axis label
        svgContent += `<text x="${x}" y="${height - 8}" font-family="Outfit" font-size="10" fill="#64748B" text-anchor="middle">Mgg ${w}</text>`;
    }

    // 3. Draw Lines for each project
    const lineColors = ["#FF6A00", "#10B981", "#06B6D4", "#F59E0B"];
    state.projects.forEach((p, index) => {
        const color = lineColors[index % lineColors.length];
        
        // Construct points string
        const points = [];
        const historyData = p.history || [];
        
        // If history has fewer points, we pad it with start 0
        const displayData = [...historyData];
        if (displayData.length === 0) {
            displayData.push({ week: 1, progress: 0 });
        }

        displayData.forEach((h, idx) => {
            const w = h.week;
            const x = paddingX + ((w - 1) / (maxWeeks - 1)) * chartWidth;
            const y = paddingY + chartHeight - (h.progress / 100) * chartHeight;
            points.push(`${x},${y}`);
        });

        const pointsStr = points.join(" ");

        // Draw path line
        svgContent += `
            <polyline 
                fill="none" 
                stroke="${color}" 
                stroke-width="3" 
                stroke-linecap="round" 
                stroke-linejoin="round"
                points="${pointsStr}" 
            />
        `;

        // Draw Interactive Data Points
        displayData.forEach((h, idx) => {
            const w = h.week;
            const x = paddingX + ((w - 1) / (maxWeeks - 1)) * chartWidth;
            const y = paddingY + chartHeight - (h.progress / 100) * chartHeight;
            
            // Circles for hover
            svgContent += `
                <circle 
                    cx="${x}" 
                    cy="${y}" 
                    r="5" 
                    fill="${color}" 
                    stroke="#FFFFFF" 
                    stroke-width="2" 
                    style="cursor: pointer;"
                >
                    <title>${p.project_name} - Minggu ${w}: ${h.progress}%</title>
                </circle>
            `;
        });
    });

    // 4. Legend Section
    let legendX = paddingX;
    state.projects.forEach((p, index) => {
        const color = lineColors[index % lineColors.length];
        svgContent += `
            <rect x="${legendX}" y="2" width="10" height="10" fill="${color}" rx="2" />
            <text x="${legendX + 14}" y="11" font-family="Outfit" font-size="10" font-weight="600" fill="#1E293B">${p.project_name}</text>
        `;
        legendX += Math.max(120, p.project_name.length * 7);
    });

    svgContent += `</svg>`;
    wrapper.innerHTML = svgContent;
}

// Render Notifications Panel
function renderNotificationsPanel() {
    const notifList = document.getElementById("notification-list");
    notifList.innerHTML = "";

    if (state.notifications.length === 0) {
        notifList.innerHTML = `<p class="text-muted" style="text-align: center; padding: 20px;">Tidak ada notifikasi baru.</p>`;
        return;
    }

    state.notifications.forEach(n => {
        const item = document.createElement("div");
        item.className = `notification-item ${n.type}`;
        
        let iconHtml = "";
        if (n.type === "alert-delayed") iconHtml = `<i data-lucide="alert-triangle" class="text-danger"></i>`;
        else if (n.type === "alert-photo") iconHtml = `<i data-lucide="image" class="text-info"></i>`;
        else if (n.type === "alert-progress") iconHtml = `<i data-lucide="check-circle-2" class="text-success"></i>`;
        else iconHtml = `<i data-lucide="bell" class="text-muted"></i>`;

        item.innerHTML = `
            <div class="notif-icon-box">${iconHtml}</div>
            <div class="notif-content">
                <p class="notif-text">${n.message}</p>
                <span class="notif-time">${n.time}</span>
            </div>
        `;
        notifList.appendChild(item);
    });
}

// ==========================================================================
// PELAKSANA VIEW (MOBILE SIMULATOR) IMPLEMENTATION
// ==========================================================================

function renderPelaksanaMobileSimulator() {
    const screenContainer = document.getElementById("device-screen-content");
    const backBtn = document.getElementById("device-back-btn");
    const headerTitle = document.getElementById("device-header-title");

    // Clear Screen
    screenContainer.innerHTML = "";

    // Toggle Back Button and Header Title based on screen
    if (state.mobileCurrentScreen === "project-list") {
        backBtn.classList.add("hidden");
        headerTitle.textContent = "Saputt Mobile";
        renderMobileProjectList(screenContainer);
    } 
    else if (state.mobileCurrentScreen === "project-detail") {
        backBtn.classList.remove("hidden");
        const activeProj = state.projects.find(p => p.project_id === state.mobileSelectedProjectId);
        headerTitle.textContent = activeProj ? activeProj.project_name : "Detail Proyek";
        renderMobileProjectDetail(screenContainer, activeProj);
    } 
    else if (state.mobileCurrentScreen === "task-edit") {
        backBtn.classList.remove("hidden");
        const activeProj = state.projects.find(p => p.project_id === state.mobileSelectedProjectId);
        const activeTask = activeProj ? activeProj.tasks.find(t => t.task_id === state.mobileSelectedTaskId) : null;
        headerTitle.textContent = activeTask ? activeTask.task_name : "Update Pekerjaan";
        renderMobileTaskEdit(screenContainer, activeProj, activeTask);
    }

    lucide.createIcons();
}

function mobileGoBack() {
    if (state.mobileCurrentScreen === "task-edit") {
        state.mobileCurrentScreen = "project-detail";
        state.mobileSelectedTaskId = null;
        state.mobileUploadedPhotoData = null;
    } else if (state.mobileCurrentScreen === "project-detail") {
        state.mobileCurrentScreen = "project-list";
        state.mobileSelectedProjectId = null;
    }
    renderPelaksanaMobileSimulator();
}

// MOBILE SCREEN 1: Project List
function renderMobileProjectList(container) {
    const title = document.createElement("div");
    title.className = "mobile-section-title";
    title.textContent = "Daftar Proyek Aktif";
    container.appendChild(title);

    state.projects.forEach(p => {
        const card = document.createElement("div");
        card.className = "mobile-project-card";
        card.onclick = () => {
            state.mobileSelectedProjectId = p.project_id;
            state.mobileCurrentScreen = "project-detail";
            renderPelaksanaMobileSimulator();
        };

        const totalTasks = p.tasks.length;
        const completedTasks = p.tasks.filter(t => t.status === "Selesai").length;

        card.innerHTML = `
            <div class="mobile-proj-info">
                <h4 class="mobile-proj-title">${p.project_name}</h4>
                <div class="mobile-proj-meta">
                    <span><i data-lucide="map-pin" class="inline-icon" style="width:12px;height:12px;"></i> ${p.location.split(",")[0]}</span>
                    <span>•</span>
                    <span>${completedTasks}/${totalTasks} Selesai</span>
                </div>
            </div>
            <div class="mobile-proj-ring-wrapper">
                ${generateCircularProgressRingSVG(p.percentage, 42, 4)}
            </div>
        `;
        container.appendChild(card);
    });
}

// MOBILE SCREEN 2: Project Detail (Timeline)
function renderMobileProjectDetail(container, project) {
    if (!project) return;

    // Overview Card at Top
    const overview = document.createElement("div");
    overview.className = "mobile-overview-card";
    
    overview.innerHTML = `
        <div class="overview-ring-box">
            ${generateCircularProgressRingSVG(project.percentage, 80, 7, true)}
        </div>
        <div class="overview-info">
            <h3 class="overview-title">${project.project_name}</h3>
            <div class="overview-meta">
                <span><i data-lucide="map-pin" class="inline-icon" style="width:10px;height:10px;"></i> ${project.location}</span>
                <span><i data-lucide="user" class="inline-icon" style="width:10px;height:10px;"></i> Owner: ${project.owner}</span>
                <span><i data-lucide="calendar" class="inline-icon" style="width:10px;height:10px;"></i> Target: ${formatDate(project.end_date)}</span>
            </div>
        </div>
    `;
    container.appendChild(overview);

    // AI Recommendation Widget
    const aiWidget = document.createElement("div");
    aiWidget.className = "mobile-ai-widget";
    
    const nextTask = project.tasks.find(t => t.status === "Belum Dimulai");
    const activeTask = project.tasks.find(t => t.status === "Berjalan");
    let aiRecText = "";
    if (nextTask) {
        aiRecText = `Fokus saat ini menyelesaikan pekerjaan aktif${activeTask ? ` <strong>${activeTask.task_name}</strong>` : ""}. AI merekomendasikan persiapan logistik untuk langkah berikutnya: <strong>${nextTask.task_name}</strong> (Bobot ${nextTask.bobot}%).`;
    } else {
        aiRecText = "Seluruh item pekerjaan utama telah dimulai atau diselesaikan. Selesaikan sisa pekerjaan untuk penuntasan proyek.";
    }

    aiWidget.innerHTML = `
        <div class="mobile-ai-widget-header">
            <i data-lucide="brain" style="width:14px;height:14px;color:#A855F7;"></i>
            <span>Saputt AI - Rekomendasi Kerja</span>
        </div>
        <div class="mobile-ai-widget-body">
            ${aiRecText}
        </div>
    `;
    container.appendChild(aiWidget);

    // Section Title
    const secTitle = document.createElement("div");
    secTitle.className = "mobile-section-title";
    secTitle.textContent = "Timeline & Progress Pekerjaan";
    container.appendChild(secTitle);

    // Timeline List
    const list = document.createElement("div");
    list.className = "mobile-timeline-list";

    project.tasks.forEach(t => {
        const item = document.createElement("div");
        item.className = "mobile-timeline-item";
        item.onclick = () => {
            state.mobileSelectedTaskId = t.task_id;
            state.mobileCurrentScreen = "task-edit";
            renderPelaksanaMobileSimulator();
        };

        const statusClass = t.status === "Selesai" ? "status-selesai" 
                          : t.status === "Berjalan" ? "status-berjalan"
                          : t.status === "Tertunda" ? "status-tertunda" : "status-belum";

        const statusText = t.status;

        item.innerHTML = `
            <div class="timeline-item-left">
                <span class="timeline-dot ${statusClass}"></span>
                <span class="timeline-item-title">${t.task_name}</span>
            </div>
            <div class="timeline-item-right">
                <span class="badge-status ${statusClass}">${statusText}</span>
                <span class="timeline-item-percent">${t.progress}%</span>
            </div>
        `;
        list.appendChild(item);
    });

    container.appendChild(list);
}

// MOBILE SCREEN 3: Task Edit & Report Share
function renderMobileTaskEdit(container, project, task) {
    if (!project || !task) return;

    // Task details card
    const detailsCard = document.createElement("div");
    detailsCard.className = "mobile-task-card";
    
    detailsCard.innerHTML = `
        <div class="mobile-task-header">
            <h3 class="mobile-task-title">${task.task_name}</h3>
            <div class="mobile-task-meta-grid">
                <div class="meta-box">
                    <span class="meta-box-label">Volume</span>
                    <span class="meta-box-value">${task.volume} ${task.satuan}</span>
                </div>
                <div class="meta-box">
                    <span class="meta-box-label">Bobot</span>
                    <span class="meta-box-value">${task.bobot}%</span>
                </div>
                <div class="meta-box">
                    <span class="meta-box-label">Target</span>
                    <span class="meta-box-value">${task.target_days} Hari</span>
                </div>
            </div>
        </div>

        <!-- Progress Slider -->
        <div class="mobile-form-group">
            <label for="task-progress-slider">Persentase Progres Aktual</label>
            <div class="slider-container">
                <input type="range" id="task-progress-slider" class="mobile-slider" min="0" max="100" value="${task.progress}" oninput="updateTaskProgressFromSlider(this.value)">
                <span class="slider-val" id="slider-val-text">${task.progress}%</span>
            </div>
        </div>

        <!-- Status Selector -->
        <div class="mobile-form-group">
            <label for="task-status-select">Status Pekerjaan</label>
            <select id="task-status-select" class="mobile-select" onchange="updateTaskStatus(this.value)">
                <option value="Belum Dimulai" ${task.status === "Belum Dimulai" ? "selected" : ""}>Belum Dimulai</option>
                <option value="Berjalan" ${task.status === "Berjalan" ? "selected" : ""}>Berjalan</option>
                <option value="Selesai" ${task.status === "Selesai" ? "selected" : ""}>Selesai</option>
                <option value="Tertunda" ${task.status === "Tertunda" ? "selected" : ""}>Tertunda</option>
            </select>
        </div>

        <!-- Schedule Status Tracker (Automatic calculation of Ahead / On / Behind schedule) -->
        <div class="mobile-form-group">
            <label>Hari Pengerjaan Saat Ini</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" id="task-current-day" class="mobile-input" style="width: 80px;" min="0" max="${task.target_days * 2}" value="${task.current_day || 1}" oninput="updateTaskCurrentDay(this.value)">
                <span class="text-muted" style="font-size: 0.85rem;">dari target ${task.target_days} hari</span>
            </div>
        </div>

        <!-- Schedule evaluation indicator -->
        <div class="schedule-calc-box">
            <span class="text-muted">Estimasi Jadwal:</span>
            <span id="schedule-calc-badge" class="schedule-calc-badge">Menghitung...</span>
        </div>

        <!-- Photo upload section -->
        <div class="mobile-form-group">
            <label>Dokumentasi Foto Lapangan</label>
            <div class="mobile-upload-box" onclick="triggerSimulatedPhotoUpload()">
                <i data-lucide="camera" class="upload-icon" id="upload-icon-element"></i>
                <span class="upload-text" id="upload-text-element">Klik untuk ambil/unggah foto</span>
                <input type="file" id="real-file-input" accept="image/*" class="hidden" onchange="handleRealPhotoUpload(event)">
                <img id="upload-preview" class="uploaded-preview-img hidden" src="">
            </div>
        </div>

        <!-- Photo caption / description -->
        <div class="mobile-form-group">
            <label for="task-photo-desc">Catatan Lapangan / Keterangan Laporan</label>
            <textarea id="task-photo-desc" class="mobile-textarea" rows="2" placeholder="Contoh: Pemasangan bekisting selesai..." oninput="updateReportTextPreview()"></textarea>
        </div>

        <!-- Target Besok -->
        <div class="mobile-form-group">
            <label for="task-target-tomorrow">Target Pekerjaan Besok</label>
            <input type="text" id="task-target-tomorrow" class="mobile-input" placeholder="Contoh: Pengecoran beton sloof..." oninput="updateReportTextPreview()">
        </div>

        <!-- Save Button -->
        <button class="btn btn-primary" style="width: 100%; margin-top: 10px;" onclick="saveTaskUpdates()">
            <i data-lucide="save"></i> Simpan Progres Harian
        </button>
    `;

    container.appendChild(detailsCard);

    // Share Progress via WhatsApp Widget
    const shareCard = document.createElement("div");
    shareCard.className = "mobile-share-box";
    
    shareCard.innerHTML = `
        <span class="share-title"><i data-lucide="share-2"></i> Share Progress WhatsApp</span>
        <div class="report-preview-area" id="report-preview-area">
            <!-- Dynamic preview -->
        </div>
        <div class="share-action-row">
            <button class="btn btn-secondary btn-sm" onclick="copyReportToClipboard()">
                <i data-lucide="copy"></i> Salin
            </button>
            <button class="btn btn-whatsapp btn-sm" onclick="shareReportWhatsApp()">
                <i data-lucide="send"></i> Kirim WA
            </button>
        </div>
    `;

    container.appendChild(shareCard);

    // Run initial calculations
    updateScheduleCalcBadge(task.target_days, task.current_day || 1, task.progress);
    updateReportTextPreview();
}

// Handler for simulated slider updates in mobile view
function updateTaskProgressFromSlider(val) {
    document.getElementById("slider-val-text").textContent = `${val}%`;
    const progress = parseInt(val);
    
    // Auto adjust status if 100% or 0%
    const statusSelect = document.getElementById("task-status-select");
    if (progress === 100) {
        statusSelect.value = "Selesai";
    } else if (progress > 0 && statusSelect.value === "Belum Dimulai") {
        statusSelect.value = "Berjalan";
    } else if (progress === 0 && statusSelect.value === "Selesai") {
        statusSelect.value = "Belum Dimulai";
    }

    const targetDays = parseInt(document.getElementById("task-progress-slider").max);
    const currentDay = parseInt(document.getElementById("task-current-day").value) || 1;
    
    updateScheduleCalcBadge(14, currentDay, progress); // Sloof target days example, will pull actual values
    updateReportTextPreview();
}

function updateTaskStatus(status) {
    const slider = document.getElementById("task-progress-slider");
    if (status === "Selesai") {
        slider.value = 100;
        document.getElementById("slider-val-text").textContent = "100%";
    } else if (status === "Belum Dimulai") {
        slider.value = 0;
        document.getElementById("slider-val-text").textContent = "0%";
    }
    
    const currentDay = parseInt(document.getElementById("task-current-day").value) || 1;
    updateScheduleCalcBadge(14, currentDay, parseInt(slider.value));
    updateReportTextPreview();
}

function updateTaskCurrentDay(val) {
    const currentDay = parseInt(val) || 1;
    const progress = parseInt(document.getElementById("task-progress-slider").value);
    
    updateScheduleCalcBadge(14, currentDay, progress);
    updateReportTextPreview();
}

// Dynamic Schedule Calculation Badge Update
function updateScheduleCalcBadge(targetDays, currentDay, progress) {
    const badge = document.getElementById("schedule-calc-badge");
    if (!badge) return;

    const status = calculateScheduleStatus(targetDays, currentDay, progress);
    
    badge.textContent = status;
    badge.className = "schedule-calc-badge";

    if (status === "Ahead Schedule") {
        badge.classList.add("schedule-ahead");
    } else if (status === "On Schedule") {
        badge.classList.add("schedule-on");
    } else {
        badge.classList.add("schedule-behind");
    }
}

function calculateScheduleStatus(targetDays, currentDay, progress) {
    if (progress === 100) return "On Schedule";
    if (currentDay === 0) return "On Schedule";

    // Expected progress based on linear timeline
    const expectedProgress = (currentDay / targetDays) * 100;
    
    // Buffer of 5%
    if (progress >= expectedProgress + 5) {
        return "Ahead Schedule";
    } else if (progress < expectedProgress - 8) {
        return "Behind Schedule";
    } else {
        return "On Schedule";
    }
}

// Simulated Photo Upload trigger
function triggerSimulatedPhotoUpload() {
    document.getElementById("real-file-input").click();
}

function handleRealPhotoUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        
        // Save in state temporarily
        state.mobileUploadedPhotoData = dataUrl;

        // Show preview in Mobile Simulator
        const preview = document.getElementById("upload-preview");
        preview.src = dataUrl;
        preview.classList.remove("hidden");
        
        // Hide icons
        document.getElementById("upload-icon-element").classList.add("hidden");
        document.getElementById("upload-text-element").classList.add("hidden");

        showToast("Foto berhasil dimuat dari galeri!", "success");
    };
    reader.readAsDataURL(file);
}

// Generate the WhatsApp report text dynamically based on inputs
function generateWhatsAppReportText() {
    const project = state.projects.find(p => p.project_id === state.mobileSelectedProjectId);
    const task = project ? project.tasks.find(t => t.task_id === state.mobileSelectedTaskId) : null;
    
    if (!project || !task) return "";

    const progressVal = document.getElementById("task-progress-slider") ? document.getElementById("task-progress-slider").value : task.progress;
    const keterangan = document.getElementById("task-photo-desc") ? document.getElementById("task-photo-desc").value : "";
    const targetBesok = document.getElementById("task-target-tomorrow") ? document.getElementById("task-target-tomorrow").value : "";
    
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });

    return `*PROGRESS HARIAN*
*Proyek:* ${project.project_name}
*Tanggal:* ${formattedDate}
*Pekerjaan:* ${task.task_name}
*Progress:* ${progressVal}%
*Keterangan:* ${keterangan || "-"}
*Target Besok:* ${targetBesok || "-"}`;
}

function updateReportTextPreview() {
    const previewArea = document.getElementById("report-preview-area");
    if (previewArea) {
        previewArea.textContent = generateWhatsAppReportText();
    }
}

// Copy report text to clipboard
function copyReportToClipboard() {
    const text = generateWhatsAppReportText();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        showToast("Laporan progres berhasil disalin ke papan klip!", "success");
    }).catch(err => {
        showToast("Gagal menyalin teks laporan.", "error");
    });
}

// Share progress via WhatsApp redirect
function shareReportWhatsApp() {
    const text = generateWhatsAppReportText();
    if (!text) return;

    const encodedText = encodeURIComponent(text);
    const waUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    
    // Open in a new tab
    window.open(waUrl, "_blank");
}

// Save all progress updates from mobile screen to global state
function saveTaskUpdates() {
    const project = state.projects.find(p => p.project_id === state.mobileSelectedProjectId);
    const task = project ? project.tasks.find(t => t.task_id === state.mobileSelectedTaskId) : null;
    
    if (!project || !task) return;

    const progressVal = parseInt(document.getElementById("task-progress-slider").value);
    const statusVal = document.getElementById("task-status-select").value;
    const currentDayVal = parseInt(document.getElementById("task-current-day").value) || 1;
    const notesVal = document.getElementById("task-photo-desc").value;

    // 1. Update task values
    const oldProgress = task.progress;
    task.progress = progressVal;
    task.status = statusVal;
    task.current_day = currentDayVal;

    // 2. Save Photo if uploaded
    if (state.mobileUploadedPhotoData) {
        const newPhoto = {
            photo_id: "photo-" + Date.now(),
            task_name: task.task_name,
            description: notesVal || `${task.task_name} update progres ${progressVal}%`,
            date: new Date().toISOString().split("T")[0],
            location: project.location.split(",")[0],
            image_url: state.mobileUploadedPhotoData
        };
        project.photos.unshift(newPhoto); // Add at beginning of gallery
    }

    // 3. Recalculate Project Percentage
    calculateProjectPercentage(project);

    // 4. Update Weekly Chart History (Simulated incremental history point)
    // If progress increased, append to history
    if (progressVal > oldProgress) {
        const lastHistory = project.history[project.history.length - 1];
        if (lastHistory && lastHistory.week === project.history.length) {
            // Update current week progress
            lastHistory.progress = project.percentage;
        } else {
            // Push next week
            project.history.push({
                week: project.history.length + 1,
                progress: project.percentage
            });
        }
    }

    // 5. Add Live Notification for Managers
    const notifMessage = `Pelaksana mengupdate pekerjaan *${task.task_name}* (${progressVal}%) pada proyek *${project.project_name}*.`;
    state.notifications.unshift({
        id: "notif-" + Date.now(),
        type: "alert-progress",
        message: notifMessage,
        time: "Baru saja"
    });

    // Check if task is delayed and trigger delayed notification
    const scheduleStatus = calculateScheduleStatus(task.target_days, currentDayVal, progressVal);
    if (scheduleStatus === "Behind Schedule" && statusVal !== "Selesai") {
        state.notifications.unshift({
            id: "notif-warn-" + Date.now(),
            type: "alert-delayed",
            message: `[Peringatan] Pekerjaan *${task.task_name}* di proyek *${project.project_name}* terdeteksi terlambat (Behind Schedule)!`,
            time: "Baru saja"
        });
    }

    // Keep notifications list at max 10
    if (state.notifications.length > 10) {
        state.notifications.pop();
    }

    // Save state
    saveStateToLocalStorage();

    // Show toast and redirect back
    showToast("Data progres berhasil disimpan dan diperbarui!", "success");
    
    // Return back to project detail
    state.mobileCurrentScreen = "project-detail";
    state.mobileSelectedTaskId = null;
    state.mobileUploadedPhotoData = null;
    
    renderPelaksanaMobileSimulator();
}

// Helper: Generate circular progress SVG
function generateCircularProgressRingSVG(percent, size = 50, strokeWidth = 5, isLight = false) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percent / 100) * circumference;
    const strokeColor = isLight ? "rgba(255, 255, 255, 0.25)" : "#E2E8F0";
    const fillColor = isLight ? "#FF6A00" : "url(#grad-ring)";

    return `
        <div class="progress-ring-container">
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                <defs>
                    <linearGradient id="grad-ring" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="var(--color-primary)" />
                        <stop offset="100%" stop-color="var(--color-secondary)" />
                    </linearGradient>
                </defs>
                <circle 
                    stroke="${strokeColor}" 
                    stroke-width="${strokeWidth}" 
                    fill="transparent" 
                    r="${radius}" 
                    cx="${size / 2}" 
                    cy="${size / 2}" 
                />
                <circle 
                    class="progress-ring-circle"
                    stroke="${fillColor}" 
                    stroke-width="${strokeWidth}" 
                    stroke-linecap="round"
                    fill="transparent" 
                    r="${radius}" 
                    cx="${size / 2}" 
                    cy="${size / 2}" 
                    style="stroke-dasharray: ${circumference} ${circumference}; stroke-dashoffset: ${offset};"
                />
            </svg>
            <span class="progress-ring-text">${percent}%</span>
        </div>
    `;
}

// ==========================================================================
// MODALS LOGIC
// ==========================================================================

// Add Project Modal
function openAddProjectModal() {
    document.getElementById("add-project-modal").classList.add("active");
}

function closeAddProjectModal() {
    document.getElementById("add-project-modal").classList.remove("active");
    document.getElementById("add-project-form").reset();
}

function handleAddProjectSubmit(e) {
    e.preventDefault();

    const name = document.getElementById("project-name").value;
    const location = document.getElementById("project-location").value;
    const owner = document.getElementById("project-owner").value;
    const value = parseInt(document.getElementById("project-value").value);
    const startDate = document.getElementById("project-start").value;
    const endDate = document.getElementById("project-end").value;

    const defaultTasks = [
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

    const newProject = {
        project_id: "proj-" + Date.now(),
        project_name: name,
        location: location,
        owner: owner,
        value: value,
        start_date: startDate,
        end_date: endDate,
        percentage: 0,
        tasks: defaultTasks,
        photos: [],
        history: [{ week: 1, progress: 0 }]
    };

    // Add to state
    state.projects.push(newProject);
    
    // Add Notification
    state.notifications.unshift({
        id: "notif-new-" + Date.now(),
        type: "alert-progress",
        message: `Proyek konstruksi baru telah didaftarkan: *${name}*`,
        time: "Baru saja"
    });

    saveStateToLocalStorage();
    closeAddProjectModal();
    renderApp();
    showToast("Proyek baru berhasil didaftarkan!", "success");
}

// Project Details Modal for Managers
function openProjectDetailModal(projectId) {
    const project = state.projects.find(p => p.project_id === projectId);
    if (!project) return;

    state.currentViewingProjectId = projectId; // Store for exporting

    // Fill Header Info
    document.getElementById("modal-detail-title").textContent = project.project_name;
    document.getElementById("modal-detail-subtitle").textContent = `${project.location} • Pemilik: ${project.owner}`;

    // Fill Stat mini cards
    const formattedValue = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(project.value);
    document.getElementById("detail-val-value").textContent = formattedValue;
    document.getElementById("detail-val-dates").textContent = `${formatDateShort(project.start_date)} - ${formatDateShort(project.end_date)}`;
    document.getElementById("detail-val-progress").textContent = `${project.percentage}%`;

    // Render Timeline Tasks Table
    const tasksBody = document.getElementById("detail-tasks-body");
    tasksBody.innerHTML = "";

    project.tasks.forEach(t => {
        const scheduleStatus = calculateScheduleStatus(t.target_days, t.current_day || 0, t.progress);
        let scheduleBadgeClass = "schedule-on";
        if (scheduleStatus === "Ahead Schedule") scheduleBadgeClass = "schedule-ahead";
        else if (scheduleStatus === "Behind Schedule") scheduleBadgeClass = "schedule-behind";

        const statusClass = t.status === "Selesai" ? "status-selesai" 
                          : t.status === "Berjalan" ? "status-berjalan"
                          : t.status === "Tertunda" ? "status-tertunda" : "status-belum";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><strong>${t.task_name}</strong></td>
            <td>${t.volume}</td>
            <td>${t.satuan}</td>
            <td>${t.bobot}%</td>
            <td>${t.target_days} hari <span class="text-muted" style="font-size:0.75rem;">(H-${t.current_day || 0})</span></td>
            <td>
                <div class="progress-bar-wrapper" style="min-width: 100px;">
                    <div class="progress-track">
                        <div class="progress-fill" style="width: ${t.progress}%"></div>
                    </div>
                    <span class="progress-text" style="width: 25px;">${t.progress}%</span>
                </div>
            </td>
            <td><span class="badge-status ${statusClass}">${t.status}</span></td>
            <td><span class="schedule-calc-badge ${scheduleBadgeClass}">${scheduleStatus}</span></td>
        `;
        tasksBody.appendChild(tr);
    });

    // Render Photo Gallery
    const gallery = document.getElementById("detail-photos-gallery");
    gallery.innerHTML = "";

    if (!project.photos || project.photos.length === 0) {
        gallery.innerHTML = `<div class="no-photos-msg">Belum ada dokumentasi foto yang diunggah oleh Pelaksana.</div>`;
    } else {
        project.photos.forEach(ph => {
            const photoItem = document.createElement("div");
            photoItem.className = "photo-gallery-item";
            photoItem.onclick = () => window.open(ph.image_url, "_blank");
            
            photoItem.innerHTML = `
                <img src="${ph.image_url}" alt="${ph.task_name}">
                <div class="photo-item-meta">
                    <span class="photo-item-desc">${ph.description}</span>
                    <span class="photo-item-date">${formatDate(ph.date)} • ${ph.task_name}</span>
                </div>
            `;
            gallery.appendChild(photoItem);
        });
    }

    document.getElementById("project-detail-modal").classList.add("active");
    lucide.createIcons();
}

function closeProjectDetailModal() {
    document.getElementById("project-detail-modal").classList.remove("active");
}

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================

// Custom toast alerts
function showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "info";
    if (type === "success") icon = "check-circle";
    else if (type === "error") icon = "alert-circle";

    toast.innerHTML = `
        <i data-lucide="${icon}" style="width:18px;height:18px;"></i>
        <span>${message}</span>
    `;
    container.appendChild(toast);
    lucide.createIcons();

    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Format Date string (YYYY-MM-DD to DD Month YYYY)
function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateShort(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

// ==========================================================================
// SAPUTT AI ANALYSIS ENGINE
// ==========================================================================
function renderAIAnalysis() {
    const aiList = document.getElementById("ai-analysis-list");
    if (!aiList) return;

    aiList.innerHTML = "";

    // 1. Analyze Delay Risks for each active project
    state.projects.forEach(p => {
        let riskScore = 0;
        let delayedTasks = [];
        p.tasks.forEach(t => {
            if (t.status === "Berjalan" || t.status === "Tertunda") {
                const scheduleStatus = calculateScheduleStatus(t.target_days, t.current_day, t.progress);
                if (scheduleStatus === "Behind Schedule") {
                    riskScore += t.bobot;
                    delayedTasks.push(t.task_name);
                }
            }
        });

        if (riskScore > 0 && p.percentage < 100) {
            const card = document.createElement("div");
            card.className = "ai-card";
            card.innerHTML = `
                <div class="ai-card-header">
                    <span class="ai-card-title">
                        <i data-lucide="alert-triangle" class="text-danger" style="width:16px;height:16px;"></i>
                        Prediksi Keterlambatan: ${p.project_name}
                    </span>
                    <span class="ai-card-badge badge-ai-warning">Risiko Tinggi (${riskScore}%)</span>
                </div>
                <p class="ai-card-desc">
                    AI mendeteksi risiko keterlambatan karena pekerjaan <strong>${delayedTasks.join(", ")}</strong> berjalan lambat dibanding target durasi.
                </p>
                <div class="ai-recommendation-box">
                    <strong>Rekomendasi AI:</strong> Alokasikan pekerja tambahan ke pekerjaan <strong>${delayedTasks[0]}</strong> dan koordinasikan percepatan pengiriman material.
                </div>
            `;
            aiList.appendChild(card);
        }
    });

    // 2. Next Step & Procurement Recommendation
    state.projects.forEach(p => {
        if (p.percentage < 100) {
            const nextTask = p.tasks.find(t => t.status === "Belum Dimulai");
            const currentActiveTask = p.tasks.find(t => t.status === "Berjalan");

            if (nextTask) {
                const card = document.createElement("div");
                card.className = "ai-card";
                card.innerHTML = `
                    <div class="ai-card-header">
                        <span class="ai-card-title">
                            <i data-lucide="arrow-right-circle" class="text-primary" style="width:16px;height:16px;color:#A855F7;"></i>
                            Rekomendasi Rencana Kerja: ${p.project_name}
                        </span>
                        <span class="ai-card-badge badge-ai-info">Logistik</span>
                    </div>
                    <p class="ai-card-desc">
                        Langkah berikutnya adalah pekerjaan <strong>${nextTask.task_name}</strong> (Bobot ${nextTask.bobot}%). 
                        ${currentActiveTask ? `Saat ini progres <strong>${currentActiveTask.task_name}</strong> sedang berjalan di tingkat ${currentActiveTask.progress}%.` : ""}
                    </p>
                    <div class="ai-recommendation-box">
                        <strong>Rekomendasi AI:</strong> Segera lakukan approval order material untuk <strong>${nextTask.task_name}</strong> agar pekerjaan dapat dimulai tanpa jeda waktu.
                    </div>
                `;
                aiList.appendChild(card);
            }
        }
    });

    // If all projects are smooth sailing
    if (aiList.children.length === 0) {
        const card = document.createElement("div");
        card.className = "ai-card";
        card.innerHTML = `
            <div class="ai-card-header">
                <span class="ai-card-title">
                    <i data-lucide="check-circle" class="text-success" style="width:16px;height:16px;"></i>
                    Kondisi Proyek Optimal
                </span>
                <span class="ai-card-badge badge-ai-info" style="background-color: rgba(16, 185, 129, 0.1); color: var(--color-success);">Aman</span>
            </div>
            <p class="ai-card-desc">
                Seluruh proyek konstruksi terdeteksi berjalan sesuai target jadwal. Tingkat risiko keterlambatan adalah <strong>0%</strong>.
            </p>
            <div class="ai-recommendation-box" style="background-color: rgba(16, 185, 129, 0.05); border-left-color: var(--color-success); color: #065F46;">
                <strong>Rekomendasi AI:</strong> Pertahankan koordinasi harian tim pelaksana lapangan dan kontrol kualitas beton berkala.
            </div>
        `;
        aiList.appendChild(card);
    }
    
    lucide.createIcons();
}

// ==========================================================================
// CSV REPORT EXPORT ENGINE
// ==========================================================================
function exportAllProjectsToCSV() {
    if (state.projects.length === 0) {
        showToast("Tidak ada data proyek untuk diekspor.", "error");
        return;
    }

    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel compatibility
    csvContent += "ID Proyek;Nama Proyek;Lokasi;Pemilik;Nilai Proyek (Rp);Tanggal Mulai;Tanggal Selesai;Progres (%)\r\n";

    state.projects.forEach(p => {
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
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `saputt_semua_proyek_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("Berhasil mengekspor semua proyek ke berkas Excel/CSV!", "success");
}

function exportProjectDetailsToCSV() {
    if (!state.currentViewingProjectId) {
        showToast("Pilih detail proyek terlebih dahulu.", "error");
        return;
    }

    const project = state.projects.find(p => p.project_id === state.currentViewingProjectId);
    if (!project) return;

    let csvContent = "\uFEFF"; // UTF-8 BOM
    csvContent += `LAPORAN DETAIL PROYEK: ${project.project_name.toUpperCase()}\r\n`;
    csvContent += `Lokasi: ${project.location};Pemilik: ${project.owner};Progres Total: ${project.percentage}%\r\n\r\n`;
    
    csvContent += "Nama Pekerjaan;Volume;Satuan;Bobot (%);Target Waktu (Hari);Hari Ke;Progres (%);Status;Jadwal\r\n";

    project.tasks.forEach(t => {
        const scheduleStatus = calculateScheduleStatus(t.target_days, t.current_day || 0, t.progress);
        const row = [
            t.task_name.replace(/;/g, ","),
            t.volume,
            t.satuan,
            t.bobot,
            t.target_days,
            t.current_day || 0,
            t.progress,
            t.status,
            scheduleStatus
        ];
        csvContent += row.join(";") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `saputt_detail_${project.project_name.toLowerCase().replace(/\s+/g, "_")}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Berhasil mengekspor detail proyek ${project.project_name}!`, "success");
}

// ==========================================================================
// APP INITIALIZATION ENTRY POINT
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
    initAppState();
});
