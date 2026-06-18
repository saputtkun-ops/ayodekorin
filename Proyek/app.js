/**
 * Saputt Project - Multi-Subcon Dependency & Job Tracker Logic (Static JS Version)
 */

// Initial Data Configurations
const defaultSubcontractors = [
    { id: 'sub-1', name: 'PT Sipil Kokoh', specialty: 'Sipil & Pekerjaan Struktur', phone: '08112233445', color: '#f43f5e' },
    { id: 'sub-2', name: 'CV Terang Abadi', specialty: 'Instalasi Listrik & ME', phone: '08123456789', color: '#f59e0b' },
    { id: 'sub-3', name: 'Mahakarya Kayu', specialty: 'Desain Interior & Kayu Custom', phone: '08134567890', color: '#10b981' },
    { id: 'sub-4', name: 'Sentosa Paint', specialty: 'Finishing & Pengecatan Cat Premium', phone: '08145678901', color: '#8b5cf6' },
    { id: 'sub-5', name: 'Glass & Metal Indo', specialty: 'Konstruksi Aluminium & Kaca', phone: '08156789012', color: '#06b6d4' }
];

const defaultTasks = [
    {
        id: 'task-1',
        title: 'Pembongkaran Dinding & Pembersihan Area',
        description: 'Membersihkan partisi lama, membongkar sekat non-struktural, dan membuang puing agar area kerja steril.',
        subconId: 'sub-1',
        status: 'DONE',
        priority: 'HIGH',
        startDate: '2026-06-19',
        duration: 3,
        endDate: '2026-06-21',
        predecessors: []
    },
    {
        id: 'task-2',
        title: 'Instalasi Jalur Kabel & ME Utama',
        description: 'Penarikan kabel induk, pemasangan pipa konduit dalam dinding untuk kelistrikan AC dan pencahayaan utama.',
        subconId: 'sub-2',
        status: 'DONE',
        priority: 'HIGH',
        startDate: '2026-06-22',
        duration: 4,
        endDate: '2026-06-25',
        predecessors: ['task-1']
    },
    {
        id: 'task-3',
        title: 'Pemasangan Rangka Plafon Hollow',
        description: 'Pemasangan besi hollow galvanis 4x4 untuk rangka plafon drop ceiling sesuai detail arsitektur.',
        subconId: 'sub-1',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        startDate: '2026-06-26',
        duration: 3,
        endDate: '2026-06-28',
        predecessors: ['task-2']
    },
    {
        id: 'task-4',
        title: 'Pemasangan Partisi Gypsum Dinding',
        description: 'Menutup partisi dinding dua sisi dengan rangka stud metal dan papan gypsum Jayaboard tebal 9mm.',
        subconId: 'sub-1',
        status: 'TODO',
        priority: 'MEDIUM',
        startDate: '2026-06-26',
        duration: 4,
        endDate: '2026-06-29',
        predecessors: ['task-2']
    },
    {
        id: 'task-5',
        title: 'Instalasi Saklar & Lampu Plafon',
        description: 'Pemasangan armature lampu downlight LED, saklar Schneider, serta pengujian koneksi sirkuit panel.',
        subconId: 'sub-2',
        status: 'TODO',
        priority: 'LOW',
        startDate: '2026-06-29',
        duration: 2,
        endDate: '2026-06-30',
        predecessors: ['task-3']
    },
    {
        id: 'task-6',
        title: 'Pemasangan Lemari Custom & Kitchen Set',
        description: 'Instalasi kabinet dapur kayu solid HPL premium, fitting engsel slow-motion Blum, dan pemasangan top table marmer.',
        subconId: 'sub-3',
        status: 'TODO',
        priority: 'HIGH',
        startDate: '2026-07-01',
        duration: 5,
        endDate: '2026-07-05',
        predecessors: ['task-4', 'task-5']
    },
    {
        id: 'task-7',
        title: 'Finishing Cat Dinding & Plafon',
        description: 'Pekerjaan plamir dinding, sanding, dan cat akhir interior dengan cat Dulux Ambiance 3 lapis untuk warna matte.',
        subconId: 'sub-4',
        status: 'TODO',
        priority: 'MEDIUM',
        startDate: '2026-07-06',
        duration: 4,
        endDate: '2026-07-09',
        predecessors: ['task-6']
    },
    {
        id: 'task-8',
        title: 'Pemasangan Cermin Hias & Kaca Partisi',
        description: 'Pemasangan cermin bronze dekoratif bevel di ruang tamu dan kaca tempered 10mm untuk pembatas shower kamar mandi.',
        subconId: 'sub-5',
        status: 'TODO',
        priority: 'LOW',
        startDate: '2026-07-10',
        duration: 2,
        endDate: '2026-07-11',
        predecessors: ['task-7']
    },
    {
        id: 'task-9',
        title: 'Serah Terima Area & QC Akhir',
        description: 'Pemeriksaan komprehensif seluruh titik kerja bersama project manager, perbaikan minor, dan pembersihan final.',
        subconId: 'sub-1',
        status: 'TODO',
        priority: 'HIGH',
        startDate: '2026-07-12',
        duration: 1,
        endDate: '2026-07-12',
        predecessors: ['task-8']
    }
];

// State variables
let subcontractors = JSON.parse(localStorage.getItem('c_subcons') || 'null') || defaultSubcontractors;
let tasks = JSON.parse(localStorage.getItem('c_tasks') || 'null') || defaultTasks;
let auditLogs = JSON.parse(localStorage.getItem('c_logs') || 'null') || [];
let activeTab = 'dashboard';
let activeGanttScale = 'days';
let dragSourceTaskId = null;
let currentSelectedTaskId = null;
let tempUploadedImageBase64 = '';

// Date helpers
function addDays(dateStr, days) {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

function getDaysBetween(startStr, endStr) {
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Log utility
function logEvent(type, actor, description, status = 'OK') {
    const newLog = {
        id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }) + ' ' + new Date().toLocaleDateString('id-ID'),
        type,
        actor,
        description,
        status
    };
    auditLogs.unshift(newLog);
    if (auditLogs.length > 150) auditLogs.pop();
    saveToStorage();
}

// Storage utility
function saveToStorage() {
    localStorage.setItem('c_subcons', JSON.stringify(subcontractors));
    localStorage.setItem('c_tasks', JSON.stringify(tasks));
    localStorage.setItem('c_logs', JSON.stringify(auditLogs));
}

// Core Algorithms

/**
 * 1. Cycle Detection (DAG validation)
 */
function checkCycle(taskId, predecessorId) {
    if (taskId === predecessorId) return true;
    
    const adj = new Map();
    tasks.forEach(t => {
        adj.set(t.id, [...t.predecessors]);
    });
    
    const currentPreds = adj.get(taskId) || [];
    if (!currentPreds.includes(predecessorId)) {
        adj.set(taskId, [...currentPreds, predecessorId]);
    }
    
    const visited = new Set();
    const recStack = new Set();
    
    function dfs(node) {
        if (recStack.has(node)) return true;
        if (visited.has(node)) return false;
        
        visited.add(node);
        recStack.add(node);
        
        const neighbors = adj.get(node) || [];
        for (const neighbor of neighbors) {
            if (dfs(neighbor)) return true;
        }
        
        recStack.delete(node);
        return false;
    }
    
    for (const t of tasks) {
        if (dfs(t.id)) return true;
    }
    
    return false;
}

/**
 * 2. CPM Solver (Critical Path Method)
 */
function solveCPM() {
    if (tasks.length === 0) return;

    tasks.forEach(t => {
        t.es = 0; t.ef = 0; t.ls = 0; t.lf = 0; t.slack = 0; t.critical = false;
    });

    let minDateStr = tasks[0].startDate;
    tasks.forEach(t => {
        if (t.startDate < minDateStr) minDateStr = t.startDate;
    });
    
    function getOffset(dateStr) {
        return getDaysBetween(minDateStr, dateStr);
    }
    
    const inDegree = new Map();
    const adj = new Map();
    
    tasks.forEach(t => {
        inDegree.set(t.id, 0);
        adj.set(t.id, []);
    });
    
    tasks.forEach(t => {
        t.predecessors.forEach(pId => {
            const list = adj.get(pId) || [];
            list.push(t.id);
            adj.set(pId, list);
            inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
        });
    });
    
    const queue = [];
    inDegree.forEach((deg, id) => {
        if (deg === 0) queue.push(id);
    });
    
    const topoOrder = [];
    while (queue.length > 0) {
        const u = queue.shift();
        topoOrder.push(u);
        const neighbors = adj.get(u) || [];
        neighbors.forEach(v => {
            inDegree.set(v, inDegree.get(v) - 1);
            if (inDegree.get(v) === 0) queue.push(v);
        });
    }

    if (topoOrder.length !== tasks.length) {
        console.error("Dependency cycle detected during CPM calculation.");
        return;
    }

    const tasksMap = new Map();
    tasks.forEach(t => tasksMap.set(t.id, t));

    topoOrder.forEach(id => {
        const t = tasksMap.get(id);
        let maxEF = 0;
        
        t.predecessors.forEach(pId => {
            const pred = tasksMap.get(pId);
            if (pred.ef > maxEF) {
                maxEF = pred.ef;
            }
        });
        
        const scheduledOffset = getOffset(t.startDate);
        t.es = Math.max(maxEF, scheduledOffset);
        t.ef = t.es + t.duration;
    });

    let projectDuration = 0;
    tasks.forEach(t => {
        if (t.ef > projectDuration) projectDuration = t.ef;
    });

    topoOrder.slice().reverse().forEach(id => {
        const t = tasksMap.get(id);
        
        const successors = [];
        tasks.forEach(other => {
            if (other.predecessors.includes(id)) successors.push(other);
        });
        
        if (successors.length === 0) {
            t.lf = projectDuration;
        } else {
            let minLS = projectDuration;
            successors.forEach(s => {
                if (s.ls < minLS) minLS = s.ls;
            });
            t.lf = minLS;
        }
        
        t.ls = t.lf - t.duration;
        t.slack = t.ls - t.es;
        t.critical = Math.abs(t.slack) < 0.001;
    });
}

/**
 * 3. Evaluate Date Cascades
 */
function evaluateScheduleCascades() {
    let changed = false;
    let iterations = 0;
    const maxIterations = 100;
    
    do {
        changed = false;
        for (let i = 0; i < tasks.length; i++) {
            const t = tasks[i];
            let requiredMinStart = t.startDate;
            
            for (const pId of t.predecessors) {
                const pred = tasks.find(x => x.id === pId);
                if (pred) {
                    const predEnd = pred.endDate;
                    const nextDay = addDays(predEnd, 1);
                    if (nextDay > requiredMinStart) {
                        requiredMinStart = nextDay;
                    }
                }
            }
            
            if (requiredMinStart !== t.startDate) {
                const prevStart = t.startDate;
                t.startDate = requiredMinStart;
                t.endDate = addDays(t.startDate, t.duration - 1);
                changed = true;
                logEvent('dependency', 'System Scheduler', `Auto-shift jadwal tugas "${t.title}": tanggal mulai digeser dari ${prevStart} ke ${t.startDate} untuk memenuhi dependensi.`);
            }
        }
        iterations++;
    } while (changed && iterations < maxIterations);
    
    return iterations > 1;
}

function detectScheduleConflicts() {
    const conflicts = [];
    tasks.forEach(t => {
        t.predecessors.forEach(pId => {
            const pred = tasks.find(x => x.id === pId);
            if (pred) {
                const predEnd = new Date(pred.endDate);
                const succStart = new Date(t.startDate);
                if (succStart <= predEnd) {
                    conflicts.push(`Tugas "${t.title}" dijadwalkan mulai (${t.startDate}) sebelum pendahulunya "${pred.title}" selesai (${pred.endDate}).`);
                }
            }
        });
    });
    return conflicts;
}

function isTaskBlocked(task) {
    if (task.status === 'DONE') return false;
    for (const pId of task.predecessors) {
        const pred = tasks.find(x => x.id === pId);
        if (pred && pred.status !== 'DONE') {
            return true;
        }
    }
    return false;
}

// UI Rendering Logic

function renderBanners() {
    const banner = document.getElementById('dependency-warning-banner');
    const warningText = document.getElementById('dependency-warning-text');
    const conflicts = detectScheduleConflicts();
    
    if (conflicts.length > 0) {
        warningText.innerHTML = conflicts.map(c => `<li>${c}</li>`).join('');
        banner.classList.remove('hidden');
    } else {
        banner.classList.add('hidden');
    }
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (type === 'error') {
        iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        iconSvg = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }
    
    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">${message}</div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(40px)';
        toast.style.transition = 'all 0.35s ease';
        setTimeout(() => toast.remove(), 350);
    }, 4000);
}

function renderDashboard() {
    const completedTasks = tasks.filter(t => t.status === 'DONE');
    const progressPercent = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    
    document.getElementById('stat-project-progress').innerText = `${progressPercent}%`;
    const circle = document.getElementById('progress-circle');
    if (circle) {
        const offset = 150.79 - (progressPercent / 100) * 150.79;
        circle.style.strokeDashoffset = offset.toString();
    }
    
    const blockedCount = tasks.filter(t => isTaskBlocked(t)).length;
    document.getElementById('stat-blocked-tasks').innerText = blockedCount.toString();
    
    const criticalTasks = tasks.filter(t => t.critical);
    document.getElementById('stat-critical-path-count').innerText = `${criticalTasks.length} Tugas`;
    
    const uniqueSubconIds = new Set(tasks.map(t => t.subconId));
    document.getElementById('stat-active-subcons').innerText = uniqueSubconIds.size.toString();
    
    const cpmContainer = document.getElementById('cpm-flow-list');
    if (criticalTasks.length === 0) {
        cpmContainer.innerHTML = `<div class="empty-state">Tidak ada jalur kritis yang terhitung.</div>`;
    } else {
        const sortedCritical = criticalTasks.slice().sort((a, b) => (a.es || 0) - (b.es || 0));
        
        let cpmHtml = '';
        sortedCritical.forEach((t, index) => {
            const subcon = subcontractors.find(s => s.id === t.subconId);
            const subconName = subcon ? subcon.name : 'Unknown';
            cpmHtml += `
                <div class="cpm-node" onclick="inspectTask('${t.id}')">
                    <span class="cpm-node-title">${t.title}</span>
                    <span class="cpm-node-subcon">${subconName}</span>
                    <span class="cpm-node-dates">${t.startDate} s/d ${t.endDate}</span>
                </div>
            `;
            if (index < sortedCritical.length - 1) {
                cpmHtml += `
                    <div class="cpm-arrow">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="3">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                `;
            }
        });
        cpmContainer.innerHTML = cpmHtml;
    }
    
    const distContainer = document.getElementById('subcon-distribution-list');
    if (subcontractors.length === 0) {
        distContainer.innerHTML = `<div class="empty-state">Belum ada subkontraktor terdaftar.</div>`;
    } else {
        let distHtml = '';
        subcontractors.forEach(sub => {
            const subTasks = tasks.filter(t => t.subconId === sub.id);
            const totalHours = subTasks.reduce((sum, t) => sum + t.duration * 8, 0);
            const completedHours = subTasks.filter(t => t.status === 'DONE').reduce((sum, t) => sum + t.duration * 8, 0);
            
            const completionPercent = totalHours > 0 ? Math.round((completedHours / totalHours) * 100) : 0;
            const taskCount = subTasks.length;
            
            distHtml += `
                <div class="subcon-bar-item">
                    <div class="subcon-bar-lbl">
                        <span class="subcon-bar-name" style="color: ${sub.color}">${sub.name} (${sub.specialty})</span>
                        <span class="subcon-bar-count">${taskCount} Tugas (${completionPercent}% Selesai)</span>
                    </div>
                    <div class="subcon-bar-track">
                        <div class="subcon-bar-fill" style="width: ${completionPercent}%; background-color: ${sub.color}"></div>
                    </div>
                </div>
            `;
        });
        distContainer.innerHTML = distHtml;
    }
    
    const recentActivities = document.getElementById('recent-activities-list');
    if (auditLogs.length === 0) {
        recentActivities.innerHTML = `<div class="empty-state">Belum ada aktivitas tercatat.</div>`;
    } else {
        recentActivities.innerHTML = auditLogs.slice(0, 5).map(log => {
            let className = '';
            if (log.status === 'BLOCKED') className = 'error';
            else if (log.type === 'validation') className = 'success';
            else if (log.type === 'dependency') className = 'warning';
            
            return `
                <div class="activity-item ${className}">
                    <span class="activity-time">[${log.timestamp.split(' ')[0]}] ${log.actor}</span>
                    <p class="activity-text">${log.description}</p>
                </div>
            `;
        }).join('');
    }
}

function renderGantt() {
    const labelsContainer = document.getElementById('gantt-task-labels');
    const timelineHeader = document.getElementById('gantt-timeline-header');
    const gridBg = document.getElementById('gantt-grid-bg');
    const barsWrap = document.getElementById('gantt-bars-wrap');
    const svgOverlay = document.getElementById('gantt-svg-arrows');
    
    if (tasks.length === 0) {
        labelsContainer.innerHTML = `<div class="empty-state" style="border:none">Tidak ada tugas.</div>`;
        barsWrap.innerHTML = '';
        timelineHeader.innerHTML = '';
        gridBg.innerHTML = '';
        svgOverlay.innerHTML = '';
        return;
    }
    
    let minDateStr = tasks[0].startDate;
    let maxDateStr = tasks[0].endDate;
    
    tasks.forEach(t => {
        if (t.startDate < minDateStr) minDateStr = t.startDate;
        if (t.endDate > maxDateStr) maxDateStr = t.endDate;
    });
    
    const projectStart = new Date(minDateStr);
    projectStart.setDate(projectStart.getDate() - 2);
    const timelineStartStr = projectStart.toISOString().split('T')[0];
    
    const projectEnd = new Date(maxDateStr);
    projectEnd.setDate(projectEnd.getDate() + 5);
    const timelineEndStr = projectEnd.toISOString().split('T')[0];
    
    const totalDays = getDaysBetween(timelineStartStr, timelineEndStr);
    const colWidth = activeGanttScale === 'days' ? 44 : 100;
    
    const sortedTasks = tasks.slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
    
    let labelsHtml = '';
    sortedTasks.forEach(t => {
        const sub = subcontractors.find(s => s.id === t.subconId);
        const subName = sub ? sub.name : 'Unknown';
        const subColor = sub ? sub.color : '#3b82f6';
        
        labelsHtml += `
            <div class="gantt-label-row" onclick="inspectTask('${t.id}')">
                <span class="gantt-label-title" title="${t.title}">${t.title}</span>
                <span class="gantt-label-subcon">
                    <span class="subcon-indicator-dot" style="background-color: ${subColor}"></span>
                    ${subName}
                </span>
            </div>
        `;
    });
    labelsContainer.innerHTML = labelsHtml;
    
    let headerHtml = '';
    let gridBgHtml = '';
    
    if (activeGanttScale === 'days') {
        for (let i = 0; i < totalDays; i++) {
            const current = new Date(timelineStartStr);
            current.setDate(current.getDate() + i);
            const dateStr = current.getDate();
            const monthStr = current.toLocaleDateString('id-ID', { month: 'short' });
            const isWeekend = current.getDay() === 0 || current.getDay() === 6;
            
            headerHtml += `
                <div class="gantt-timeline-col" style="width: ${colWidth}px; ${isWeekend ? 'background-color: rgba(255,255,255,0.02)' : ''}">
                    <span style="font-weight: 700">${dateStr}</span>
                    <span>${monthStr}</span>
                </div>
            `;
            
            gridBgHtml += `
                <div class="gantt-grid-col" style="width: ${colWidth}px; ${isWeekend ? 'background-color: rgba(255,255,255,0.02)' : ''}"></div>
            `;
        }
    } else {
        const totalWeeks = Math.ceil(totalDays / 7);
        for (let w = 0; w < totalWeeks; w++) {
            const current = new Date(timelineStartStr);
            current.setDate(current.getDate() + (w * 7));
            const dateStr = current.getDate();
            const monthStr = current.toLocaleDateString('id-ID', { month: 'short' });
            
            headerHtml += `
                <div class="gantt-timeline-col" style="width: ${colWidth}px">
                    <span style="font-weight: 700">W${w + 1}</span>
                    <span>${dateStr} ${monthStr}</span>
                </div>
            `;
            
            gridBgHtml += `
                <div class="gantt-grid-col" style="width: ${colWidth}px"></div>
            `;
        }
    }
    
    timelineHeader.innerHTML = headerHtml;
    gridBg.innerHTML = gridBgHtml;
    
    const contentWidth = totalDays * (activeGanttScale === 'days' ? 44 : (100 / 7));
    document.getElementById('gantt-bars-container').style.width = `${contentWidth}px`;
    document.getElementById('gantt-timeline-header').style.width = `${contentWidth}px`;
    document.getElementById('gantt-grid-bg').style.width = `${contentWidth}px`;
    svgOverlay.style.width = `${contentWidth}px`;
    svgOverlay.style.height = `${sortedTasks.length * 54}px`;
    
    let barsHtml = '';
    const barRowHeight = 54;
    const taskBarYPositions = new Map();
    
    sortedTasks.forEach((t, index) => {
        const sub = subcontractors.find(s => s.id === t.subconId);
        const subColor = sub ? sub.color : '#3b82f6';
        
        const daysFromStart = getDaysBetween(timelineStartStr, t.startDate);
        const barLeft = daysFromStart * (colWidth / (activeGanttScale === 'days' ? 1 : 7));
        const barWidth = t.duration * (colWidth / (activeGanttScale === 'days' ? 1 : 7));
        
        taskBarYPositions.set(t.id, (index * barRowHeight) + 27);
        
        let progressWidthPercent = 0;
        if (t.status === 'DONE') progressWidthPercent = 100;
        else if (t.status === 'REVIEW') progressWidthPercent = 85;
        else if (t.status === 'IN_PROGRESS') progressWidthPercent = 40;
        
        const isBlocked = isTaskBlocked(t);
        const barClass = `${t.critical ? 'critical' : ''}`;
        
        let barColor = subColor;
        let opacity = '1';
        if (isBlocked) {
            barColor = 'var(--accent-ruby)';
            opacity = '0.75';
        }
        
        barsHtml += `
            <div class="gantt-bar-row">
                <div class="gantt-task-bar ${barClass}" 
                     style="left: ${barLeft}px; width: ${barWidth}px; background-color: rgba(${hexToRgb(barColor)}, 0.25); border-color: ${barColor}; opacity: ${opacity};"
                     onclick="inspectTask('${t.id}')">
                    <div class="gantt-bar-progress" style="width: ${progressWidthPercent}%; background-color: rgba(${hexToRgb(barColor)}, 0.2);"></div>
                    <span class="gantt-bar-title">
                        ${isBlocked ? '🔒 ' : ''}${t.title}
                    </span>
                </div>
            </div>
        `;
    });
    barsWrap.innerHTML = barsHtml;
    
    let svgHtml = `
        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="rgba(255,255,255,0.4)" />
            </marker>
            <marker id="arrow-critical" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent-purple)" />
            </marker>
            <marker id="arrow-blocked" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1 L 10 5 L 0 9 z" fill="var(--accent-ruby)" />
            </marker>
        </defs>
    `;
    
    sortedTasks.forEach((t, index) => {
        t.predecessors.forEach(predId => {
            const pred = tasks.find(x => x.id === predId);
            if (!pred) return;
            
            const predIndex = sortedTasks.findIndex(x => x.id === predId);
            if (predIndex === -1) return;
            
            const predDaysFromStart = getDaysBetween(timelineStartStr, pred.startDate);
            const scaleFactor = colWidth / (activeGanttScale === 'days' ? 1 : 7);
            const xStart = (predDaysFromStart + pred.duration) * scaleFactor;
            const yStart = taskBarYPositions.get(predId);
            
            const tDaysFromStart = getDaysBetween(timelineStartStr, t.startDate);
            const xEnd = tDaysFromStart * scaleFactor;
            const yEnd = taskBarYPositions.get(t.id);
            
            const isCriticalPath = t.critical && pred.critical;
            const isBlockedPath = isTaskBlocked(t) && pred.status !== 'DONE';
            
            let strokeColor = 'rgba(255,255,255,0.2)';
            let markerId = 'arrow';
            let strokeWidth = '1.5';
            let strokeDash = '';
            
            if (isCriticalPath) {
                strokeColor = 'var(--accent-purple)';
                markerId = 'arrow-critical';
                strokeWidth = '2';
            } else if (isBlockedPath) {
                strokeColor = 'rgba(244, 63, 94, 0.6)';
                markerId = 'arrow-blocked';
                strokeWidth = '1.5';
                strokeDash = '4,4';
            }
            
            const controlPointX = 20;
            const dPath = `M ${xStart} ${yStart} 
                           C ${xStart + controlPointX} ${yStart}, 
                             ${xEnd - controlPointX} ${yEnd}, 
                             ${xEnd} ${yEnd}`;
            
            svgHtml += `
                <path d="${dPath}" 
                      stroke="${strokeColor}" 
                      stroke-width="${strokeWidth}" 
                      stroke-dasharray="${strokeDash}"
                      fill="none" 
                      marker-end="url(#${markerId})" />
            `;
        });
    });
    
    svgOverlay.innerHTML = svgHtml;
}

function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
}

function renderKanban() {
    const cols = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'];
    
    cols.forEach(status => {
        const colContainer = document.getElementById(`kanban-${status.toLowerCase()}`);
        const countBadge = document.getElementById(`count-${status.toLowerCase()}`);
        
        const colTasks = tasks.filter(t => t.status === status);
        countBadge.innerText = colTasks.length.toString();
        
        if (colTasks.length === 0) {
            colContainer.innerHTML = `<div class="empty-state" style="padding: 20px 0; border: 1px dashed rgba(255,255,255,0.02)">Kosong</div>`;
        } else {
            let colHtml = '';
            colTasks.sort((a,b) => a.startDate.localeCompare(b.startDate));
            
            colTasks.forEach(t => {
                const sub = subcontractors.find(s => s.id === t.subconId);
                const subColor = sub ? sub.color : '#3b82f6';
                const subName = sub ? sub.name : 'Unknown';
                
                const isBlocked = isTaskBlocked(t);
                
                let badgesHtml = '';
                if (isBlocked) {
                    badgesHtml += `<span class="card-badge badge-blocked" title="Tugas pendahulu belum selesai">🔒 TERKUNCI</span>`;
                }
                if (t.critical) {
                    badgesHtml += `<span class="card-badge badge-critical-indicator">CRITICAL</span>`;
                }
                
                colHtml += `
                    <div class="kanban-card ${t.critical ? 'critical' : ''}" 
                         draggable="true" 
                         data-task-id="${t.id}"
                         id="kanban-card-${t.id}"
                         onclick="inspectTask('${t.id}')">
                        
                        <div class="kanban-card-header" style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                            <span class="kanban-card-title">${t.title}</span>
                            <button class="btn-card-share-wa" onclick="event.stopPropagation(); shareTaskToWhatsApp('${t.id}')" title="Bagikan ke WhatsApp" style="background: none; border: none; color: #25d366; cursor: pointer; padding: 2px; display: flex; align-items: center; justify-content: center;">
                                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.706 1.458h.008c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                            </button>
                        </div>
                        
                        <div class="kanban-card-subcon" style="color: ${subColor}">
                            <span class="subcon-indicator-dot" style="background-color: ${subColor}"></span>
                            ${subName}
                        </div>
                        
                        <div class="kanban-card-badges">
                            ${badgesHtml}
                        </div>
                        
                        <div class="kanban-card-footer">
                            <span class="kanban-card-date">${t.startDate} s/d ${t.endDate}</span>
                            <span class="kanban-card-date">⏱️ ${t.duration} hari</span>
                        </div>
                    </div>
                `;
            });
            colContainer.innerHTML = colHtml;
            
            colContainer.querySelectorAll('.kanban-card').forEach(card => {
                card.addEventListener('dragstart', (e) => {
                    dragSourceTaskId = card.getAttribute('data-task-id');
                    card.style.opacity = '0.5';
                    e.dataTransfer.setData('text/plain', dragSourceTaskId);
                });
                
                card.addEventListener('dragend', () => {
                    card.style.opacity = '1';
                    dragSourceTaskId = null;
                });
            });
        }
    });
}

function renderSubcontractors() {
    const listContainer = document.getElementById('subcon-card-list');
    if (subcontractors.length === 0) {
        listContainer.innerHTML = `<div class="empty-state" style="grid-column: 1/-1">Belum ada subkontraktor yang didaftarkan.</div>`;
        return;
    }
    
    let subconHtml = '';
    subcontractors.forEach(sub => {
        const subTasks = tasks.filter(t => t.subconId === sub.id);
        const total = subTasks.length;
        const done = subTasks.filter(t => t.status === 'DONE').length;
        const inProgress = subTasks.filter(t => t.status === 'IN_PROGRESS').length;
        
        subconHtml += `
            <div class="subcon-card" style="--subcon-color: ${sub.color}">
                <div class="subcon-card-header">
                    <div>
                        <h3 class="subcon-card-name">${sub.name}</h3>
                        <span class="subcon-card-spec">${sub.specialty}</span>
                    </div>
                </div>
                
                <div class="subcon-card-stats">
                    <div class="subcon-stat-box">
                        <span class="subcon-stat-lbl">Tugas Aktif</span>
                        <span class="subcon-stat-val">${total - done}</span>
                    </div>
                    <div class="subcon-stat-box">
                        <span class="subcon-stat-lbl">Pekerjaan Selesai</span>
                        <span class="subcon-stat-val text-emerald">${done} / ${total}</span>
                    </div>
                </div>
                
                <div class="subcon-card-contact">
                    <div class="contact-item">
                        <span>📞</span> <span>${sub.phone || '-'}</span>
                    </div>
                    <div class="contact-item">
                        <span>💻</span> <span>Status: ${inProgress > 0 ? 'Sedang Bekerja' : 'Idle / Standby'}</span>
                    </div>
                </div>
            </div>
        `;
    });
    listContainer.innerHTML = subconHtml;
}

function renderAuditLogs() {
    const tbody = document.getElementById('logs-tbody');
    if (auditLogs.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="empty-state" style="text-align: center">Belum ada log audit dependensi keamanan.</td></tr>`;
        return;
    }
    
    tbody.innerHTML = auditLogs.map(log => {
        let typeBadgeClass = 'badge-log-validation';
        if (log.type === 'security') typeBadgeClass = 'badge-log-security';
        else if (log.type === 'dependency') typeBadgeClass = 'badge-log-dependency';
        
        let statusBadgeClass = log.status === 'OK' ? 'badge-status-ok' : 'badge-status-blocked';
        
        return `
            <tr>
                <td style="font-family: var(--font-mono); font-size: 11px;">${log.timestamp}</td>
                <td><span class="log-type-badge ${typeBadgeClass}">${log.type}</span></td>
                <td style="font-weight: 600;">${log.actor}</td>
                <td>${log.description}</td>
                <td><span class="log-status-badge ${statusBadgeClass}">${log.status}</span></td>
            </tr>
        `;
    }).join('');
}

function inspectTask(taskId) {
    currentSelectedTaskId = taskId;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const subcon = subcontractors.find(s => s.id === task.subconId);
    const subconName = subcon ? subcon.name : 'Unknown';
    const subconColor = subcon ? subcon.color : '#3b82f6';
    
    const panel = document.getElementById('flyout-inspector');
    const content = document.getElementById('inspector-content');
    
    const isBlocked = isTaskBlocked(task);
    
    let predListHtml = '<div class="empty-state" style="padding:10px">Tidak ada tugas pendahulu</div>';
    if (task.predecessors.length > 0) {
        predListHtml = '<div class="flyout-pred-list">';
        task.predecessors.forEach(pId => {
            const pred = tasks.find(x => x.id === pId);
            if (pred) {
                let statusColor = 'var(--accent-blue)';
                if (pred.status === 'DONE') statusColor = 'var(--accent-emerald)';
                else if (pred.status === 'IN_PROGRESS') statusColor = 'var(--accent-amber)';
                
                predListHtml += `
                    <div class="flyout-pred-item">
                        <span>${pred.title}</span>
                        <span class="flyout-pred-status" style="background-color: rgba(${hexToRgb(statusColor)}, 0.1); color: ${statusColor}">
                            ${pred.status}
                        </span>
                    </div>
                `;
            }
        });
        predListHtml += '</div>';
    }
    
    let statusColor = 'var(--accent-blue)';
    if (task.status === 'DONE') statusColor = 'var(--accent-emerald)';
    else if (task.status === 'IN_PROGRESS') statusColor = 'var(--accent-amber)';
    else if (task.status === 'REVIEW') statusColor = 'var(--accent-purple)';
    
    content.innerHTML = `
        <div class="flyout-section">
            <span class="flyout-section-lbl">Judul Pekerjaan</span>
            <h2 style="font-family: var(--font-heading); font-size: 18px; font-weight: 700; margin-top: 4px;">${task.title}</h2>
        </div>

        <div class="flyout-section">
            <span class="flyout-section-lbl">Status Pelaksanaan</span>
            <div style="margin-top: 6px; display: flex; align-items: center; gap: 8px;">
                <span class="badge-role" style="background-color: rgba(${hexToRgb(statusColor)}, 0.12); border-color: rgba(${hexToRgb(statusColor)}, 0.25); color: ${statusColor}">
                    ${task.status}
                </span>
                ${isBlocked ? `<span class="badge-role" style="background-color: rgba(244,63,94,0.12); border-color: rgba(244,63,94,0.25); color: var(--accent-ruby)">🔒 TERKUNCI (Blocked)</span>` : ''}
                ${task.critical ? `<span class="badge-role" style="background-color: rgba(139,92,246,0.12); border-color: rgba(139,92,246,0.25); color: var(--accent-purple)">⚡ CPM JALUR KRITIS</span>` : ''}
            </div>
        </div>

        <div class="flyout-section">
            <span class="flyout-section-lbl">Subkontraktor PJ</span>
            <div style="font-weight: 600; display:flex; align-items:center; gap:8px; margin-top:4px;">
                <span class="subcon-indicator-dot" style="background-color: ${subconColor}; width:10px; height:10px;"></span>
                <span style="color: ${subconColor}">${subconName}</span>
            </div>
        </div>

        <div class="form-row">
            <div class="flyout-section">
                <span class="flyout-section-lbl">Tanggal Mulai</span>
                <span class="flyout-section-val" style="font-family:var(--font-mono)">${task.startDate}</span>
            </div>
            <div class="flyout-section">
                <span class="flyout-section-lbl">Durasi Rencana</span>
                <span class="flyout-section-val" style="font-family:var(--font-mono)">${task.duration} Hari kerja</span>
            </div>
        </div>

        <div class="form-row">
            <div class="flyout-section">
                <span class="flyout-section-lbl">Tanggal Selesai</span>
                <span class="flyout-section-val" style="font-family:var(--font-mono)">${task.endDate}</span>
            </div>
            <div class="flyout-section">
                <span class="flyout-section-lbl">Toleransi Keterlambatan (Slack)</span>
                <span class="flyout-section-val" style="font-family:var(--font-mono); font-weight:600; color: ${task.critical ? 'var(--accent-purple)' : 'var(--text-muted)'}">
                    ${task.slack !== undefined ? `${task.slack} Hari` : 'Belum dihitung'}
                </span>
            </div>
        </div>

        <div class="flyout-section">
            <span class="flyout-section-lbl">Tugas Pendahulu (Predecessors)</span>
            ${predListHtml}
        </div>

        <div class="flyout-section">
            <span class="flyout-section-lbl">Deskripsi / Spesifikasi Material</span>
            <div class="flyout-desc-box">${task.description || 'Tidak ada deskripsi pekerjaan.'}</div>
        </div>
        ${task.image ? `
        <div class="flyout-section">
            <span class="flyout-section-lbl">Foto Pekerjaan</span>
            <div style="margin-top: 6px;">
                <img src="${task.image}" alt="Foto Pekerjaan" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-color); display: block; max-height: 180px; object-fit: cover; cursor: pointer;" onclick="window.open('${task.image}', '_blank')">
            </div>
        </div>
        ` : ''}
    `;
    
    panel.classList.remove('hidden');
}

function closeInspector() {
    const panel = document.getElementById('flyout-inspector');
    panel.classList.add('hidden');
    currentSelectedTaskId = null;
}

function openTaskModal(editId = null) {
    const modal = document.getElementById('modal-task');
    const titleEl = document.getElementById('modal-task-title');
    const form = document.getElementById('form-task');
    
    form.reset();
    
    const subconSelect = document.getElementById('task-subcon');
    subconSelect.innerHTML = subcontractors.map(s => `
        <option value="${s.id}">${s.name} (${s.specialty})</option>
    `).join('');
    
    const predContainer = document.getElementById('predecessors-checkbox-list');
    
    if (editId) {
        const task = tasks.find(t => t.id === editId);
        if (!task) return;
        
        titleEl.innerText = 'Edit Detail Tugas';
        document.getElementById('task-edit-id').value = task.id;
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-subcon').value = task.subconId;
        document.getElementById('task-priority').value = task.priority;
        document.getElementById('task-start-date').value = task.startDate;
        document.getElementById('task-duration').value = task.duration.toString();
        document.getElementById('task-description').value = task.description;
        
        // Reset and populate image values
        document.getElementById('task-image-file').value = '';
        tempUploadedImageBase64 = '';
        const imageUrlInput = document.getElementById('task-image-url');
        if (task.image) {
            if (task.image.startsWith('data:')) {
                tempUploadedImageBase64 = task.image;
                imageUrlInput.value = '';
            } else {
                imageUrlInput.value = task.image;
            }
        } else {
            imageUrlInput.value = '';
        }
        
        predContainer.innerHTML = tasks
            .filter(t => t.id !== editId)
            .map(t => {
                const isChecked = task.predecessors.includes(t.id);
                return `
                    <label class="pred-check-label">
                        <input type="checkbox" name="pred-checkbox" value="${t.id}" ${isChecked ? 'checked' : ''}>
                        <span>${t.title} (${t.startDate})</span>
                    </label>
                `;
            }).join('');
            
        if (tasks.filter(t => t.id !== editId).length === 0) {
            predContainer.innerHTML = `<div class="empty-state" style="padding:10px">Tidak ada tugas lain yang tersedia.</div>`;
        }
    } else {
        titleEl.innerText = 'Tambah Tugas Baru';
        document.getElementById('task-edit-id').value = '';
        document.getElementById('task-image-file').value = '';
        document.getElementById('task-image-url').value = '';
        tempUploadedImageBase64 = '';
        
        predContainer.innerHTML = tasks.map(t => `
            <label class="pred-check-label">
                <input type="checkbox" name="pred-checkbox" value="${t.id}">
                <span>${t.title} (${t.startDate})</span>
            </label>
        `).join('');
        
        if (tasks.length === 0) {
            predContainer.innerHTML = `<div class="empty-state" style="padding:10px">Belum ada tugas lain untuk dijadikan dependensi.</div>`;
        }
        
        let defaultStart = new Date().toISOString().split('T')[0];
        if (tasks.length > 0) {
            defaultStart = tasks.slice().sort((a,b) => a.startDate.localeCompare(b.startDate))[0].startDate;
        }
        document.getElementById('task-start-date').value = defaultStart;
    }
    
    modal.classList.remove('hidden');
}

function closeTaskModal() {
    document.getElementById('modal-task').classList.add('hidden');
}

function openSubconModal() {
    const modal = document.getElementById('modal-subcon');
    document.getElementById('form-subcon').reset();
    modal.classList.remove('hidden');
}

function closeSubconModal() {
    document.getElementById('modal-subcon').classList.add('hidden');
}

function updateAllViews() {
    evaluateScheduleCascades();
    solveCPM();
    saveToStorage();
    
    renderBanners();
    renderDashboard();
    
    if (activeTab === 'gantt') renderGantt();
    else if (activeTab === 'kanban') renderKanban();
    else if (activeTab === 'subcons') renderSubcontractors();
    else if (activeTab === 'logs') renderAuditLogs();
}

// Page Setup & Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    solveCPM();
    renderBanners();
    renderDashboard();
    
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
            document.getElementById(`tab-${targetTab}`).classList.remove('hidden');
            
            activeTab = targetTab;
            
            const titleEl = document.getElementById('page-title');
            const subEl = document.getElementById('page-subtitle');
            
            if (targetTab === 'dashboard') {
                titleEl.innerText = 'Architect Dashboard';
                subEl.innerText = 'Ikhtisar metrik proyek, distribusi beban kerja subkontraktor, dan analisis jalur kritis.';
                renderDashboard();
            } else if (targetTab === 'gantt') {
                titleEl.innerText = 'Timeline Gantt';
                subEl.innerText = 'Visualisasi hubungan dependensi ketat antar-subkontraktor dan jalur kritis proyek.';
                renderGantt();
            } else if (targetTab === 'kanban') {
                titleEl.innerText = 'Kanban Board';
                subEl.innerText = 'Pelacakan status pekerjaan harian. Tarik kartu untuk memindahkan status tugas.';
                renderKanban();
            } else if (targetTab === 'subcons') {
                titleEl.innerText = 'Manajemen Subkontraktor';
                subEl.innerText = 'Daftar perusahaan subkontraktor spesialis, detail kontak, serta progres pekerjaan.';
                renderSubcontractors();
            } else if (targetTab === 'logs') {
                titleEl.innerText = 'Log Audit & Analisis CPM';
                subEl.innerText = 'Catatan detail operasi pergeseran tanggal, dependensi baru, dan deteksi konflik secara real-time.';
                renderAuditLogs();
            }
        });
    });
    
    document.getElementById('btn-scale-days')?.addEventListener('click', () => {
        document.getElementById('btn-scale-days')?.classList.add('active');
        document.getElementById('btn-scale-weeks')?.classList.remove('active');
        activeGanttScale = 'days';
        renderGantt();
    });
    
    document.getElementById('btn-scale-weeks')?.addEventListener('click', () => {
        document.getElementById('btn-scale-weeks')?.classList.add('active');
        document.getElementById('btn-scale-days')?.classList.remove('active');
        activeGanttScale = 'weeks';
        renderGantt();
    });
    
    document.getElementById('btn-add-task-trigger')?.addEventListener('click', () => openTaskModal(null));
    document.getElementById('btn-close-task-modal')?.addEventListener('click', closeTaskModal);
    document.getElementById('btn-cancel-task')?.addEventListener('click', closeTaskModal);
    
    document.getElementById('task-image-file')?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                tempUploadedImageBase64 = event.target.result;
            };
            reader.readAsDataURL(file);
        } else {
            tempUploadedImageBase64 = '';
        }
    });

    document.getElementById('btn-add-subcon-trigger')?.addEventListener('click', openSubconModal);
    document.getElementById('btn-close-subcon-modal')?.addEventListener('click', closeSubconModal);
    document.getElementById('btn-cancel-subcon')?.addEventListener('click', closeSubconModal);
    
    document.getElementById('btn-close-banner')?.addEventListener('click', () => {
        document.getElementById('dependency-warning-banner').classList.add('hidden');
    });
    
    document.getElementById('btn-close-inspector')?.addEventListener('click', closeInspector);
    
    document.getElementById('btn-inspect-share-wa')?.addEventListener('click', () => {
        if (currentSelectedTaskId) {
            shareTaskToWhatsApp(currentSelectedTaskId);
        }
    });
    
    document.getElementById('btn-inspect-edit')?.addEventListener('click', () => {
        if (currentSelectedTaskId) {
            const id = currentSelectedTaskId;
            closeInspector();
            openTaskModal(id);
        }
    });
    
    document.getElementById('btn-inspect-delete')?.addEventListener('click', () => {
        if (currentSelectedTaskId && confirm('Apakah Anda yakin ingin menghapus tugas ini beserta semua dependensinya?')) {
            const idToDelete = currentSelectedTaskId;
            const task = tasks.find(t => t.id === idToDelete);
            
            tasks = tasks.filter(t => t.id !== idToDelete);
            tasks.forEach(t => {
                t.predecessors = t.predecessors.filter(pId => pId !== idToDelete);
            });
            
            logEvent('security', 'Architect', `Menghapus tugas "${task ? task.title : idToDelete}" dari data konstruksi.`);
            closeInspector();
            showToast('Tugas berhasil dihapus!', 'success');
            updateAllViews();
        }
    });
    
    document.getElementById('btn-clear-logs')?.addEventListener('click', () => {
        if (confirm('Bersihkan seluruh catatan log audit?')) {
            auditLogs = [];
            logEvent('security', 'Architect', 'Log audit dibersihkan secara manual.');
            updateAllViews();
        }
    });
    
    document.getElementById('form-task')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const editId = document.getElementById('task-edit-id').value;
        const title = document.getElementById('task-title').value.trim();
        const subconId = document.getElementById('task-subcon').value;
        const priority = document.getElementById('task-priority').value;
        const startDate = document.getElementById('task-start-date').value;
        const duration = parseInt(document.getElementById('task-duration').value, 10);
        const description = document.getElementById('task-description').value.trim();
        
        const imageUrl = document.getElementById('task-image-url').value.trim();
        let image = '';
        if (tempUploadedImageBase64) {
            image = tempUploadedImageBase64;
        } else if (imageUrl) {
            image = imageUrl;
        } else if (editId) {
            const prev = tasks.find(x => x.id === editId);
            if (prev && prev.image) {
                if (document.getElementById('task-image-file').files.length === 0 && !imageUrl) {
                    image = prev.image;
                }
            }
        }
        
        const endDate = addDays(startDate, duration - 1);
        
        const predCheckboxes = document.getElementsByName('pred-checkbox');
        const selectedPreds = [];
        predCheckboxes.forEach(cb => {
            if (cb.checked) selectedPreds.push(cb.value);
        });
        
        if (editId) {
            for (const pId of selectedPreds) {
                if (checkCycle(editId, pId)) {
                    showToast(`Gagal menyimpan: Terdeteksi loop dependensi melingkar! (Cycle detected with task "${tasks.find(x=>x.id===pId)?.title}")`, 'error');
                    logEvent('security', 'System Guard', `Modifikasi dependensi dibatalkan: Upaya penambahan dependensi melingkar pada tugas "${title}".`, 'BLOCKED');
                    return;
                }
            }
            
            const taskIdx = tasks.findIndex(t => t.id === editId);
            if (taskIdx > -1) {
                const prev = tasks[taskIdx];
                
                tasks[taskIdx] = {
                    ...prev,
                    title,
                    subconId,
                    priority,
                    startDate,
                    duration,
                    endDate,
                    description,
                    predecessors: selectedPreds,
                    image
                };
                
                logEvent('validation', 'Architect', `Memperbarui rincian tugas "${title}" (ID: ${editId}).`);
                showToast('Tugas berhasil diperbarui!', 'success');
            }
        } else {
            const newTaskId = 'task-' + Date.now();
            
            const tempTask = {
                id: newTaskId,
                title,
                description,
                subconId,
                status: 'TODO',
                priority,
                startDate,
                duration,
                endDate,
                predecessors: selectedPreds,
                image
            };
            
            tasks.push(tempTask);
            logEvent('validation', 'Architect', `Mendaftarkan tugas konstruksi baru: "${title}".`);
            showToast('Tugas baru berhasil ditambahkan!', 'success');
        }
        
        closeTaskModal();
        updateAllViews();
    });
    
    document.getElementById('form-subcon')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('subcon-name').value.trim();
        const specialty = document.getElementById('subcon-specialty').value.trim();
        const phone = document.getElementById('subcon-phone').value.trim();
        const color = document.getElementById('subcon-color').value;
        
        const newSub = {
            id: 'sub-' + Date.now(),
            name,
            specialty,
            phone,
            color
        };
        
        subcontractors.push(newSub);
        logEvent('security', 'Architect', `Mendaftarkan subkontraktor spesialis baru: "${name}" (${specialty}).`);
        showToast('Subkontraktor terdaftar!', 'success');
        
        closeSubconModal();
        updateAllViews();
    });
    
    const kanbanColumns = document.querySelectorAll('.kanban-column');
    kanbanColumns.forEach(column => {
        column.addEventListener('dragover', (e) => {
            e.preventDefault();
            column.classList.add('drag-over');
        });
        
        column.addEventListener('dragleave', () => {
            column.classList.remove('drag-over');
        });
        
        column.addEventListener('drop', (e) => {
            e.preventDefault();
            column.classList.remove('drag-over');
            
            const taskId = e.dataTransfer.getData('text/plain');
            const targetStatus = column.getAttribute('data-status');
            
            if (!taskId || !targetStatus) return;
            
            const task = tasks.find(t => t.id === taskId);
            if (!task) return;
            
            if (task.status === targetStatus) return;
            
            if (targetStatus !== 'TODO') {
                const unfinishedPreds = [];
                task.predecessors.forEach(pId => {
                    const pred = tasks.find(x => x.id === pId);
                    if (pred && pred.status !== 'DONE') {
                        unfinishedPreds.push(pred);
                    }
                });
                
                if (unfinishedPreds.length > 0) {
                    const names = unfinishedPreds.map(p => `"${p.title}"`).join(', ');
                    showToast(`Gagal memindahkan status! Tugas ini terkunci. Harap selesaikan pendahulu terlebih dahulu: ${names}`, 'error');
                    logEvent('security', 'Security Policy', `Pemindahan tugas "${task.title}" ke status "${targetStatus}" ditolak karena pendahulu (${names}) belum selesai (DONE).`, 'BLOCKED');
                    return;
                }
            }
            
            const oldStatus = task.status;
            task.status = targetStatus;
            
            logEvent('validation', 'Architect', `Mengubah status tugas "${task.title}" dari ${oldStatus} menjadi ${targetStatus}.`);
            showToast(`Status tugas diubah ke ${targetStatus}`, 'success');
            
            updateAllViews();
        });
    });
    
    if (auditLogs.length === 0) {
        logEvent('security', 'System Initiator', 'Sistem pelacakan Saputt Project berhasil dimulai.');
        logEvent('validation', 'System Scheduler', 'Model CPM dijalankan. Jalur kritis berhasil dihitung.');
    }
    
    updateAllViews();
});

// Global WhatsApp Sharing function
window.shareTaskToWhatsApp = function(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const subcon = subcontractors.find(s => s.id === task.subconId);
    const subconName = subcon ? subcon.name : 'Unknown';
    
    const isBlocked = isTaskBlocked(task);
    let statusText = task.status;
    if (isBlocked) statusText += ' (🔒 TERKUNCI/Blocked)';
    
    let criticalText = task.critical ? 'Ya (Jalur Kritis CPM)' : 'Tidak';
    
    let imageText = '';
    if (task.image) {
        if (task.image.startsWith('http')) {
            imageText = `\n*Link Foto:* ${task.image}`;
        } else {
            imageText = `\n*Foto:* (Tersimpan lokal di dasbor)`;
        }
    }
    
    const message = `*👷 SAPUTT PROJECT - DETAIL PEKERJAAN*
---------------------------------------
*Proyek:* Penthouse Renovasi
*Pekerjaan:* ${task.title}
*Subkontraktor:* ${subconName}
*Jadwal:* ${task.startDate} s/d ${task.endDate} (${task.duration} Hari)
*Status:* ${statusText}
*Prioritas:* ${task.priority}
*Kritis (CPM):* ${criticalText}${imageText}

*Instruksi/Spesifikasi:*
${task.description || 'Tidak ada deskripsi pekerjaan.'}
---------------------------------------
_Dikirim via Saputt Project Architect Console_`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
};
