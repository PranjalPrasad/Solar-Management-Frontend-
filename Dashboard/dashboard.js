// ===========================================================
// Solar Quotation Management System — Dashboard
// ===========================================================

/* ---------------- Sidebar toggle ---------------- */
let isCollapsed = false;
const sidebar = document.getElementById('sidebar');
const mainWrapper = document.getElementById('main-wrapper');
const sidebarToggle = document.getElementById('sidebar-toggle');
const overlay = document.getElementById('sidebar-overlay');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');

function updateChevron() {
    const chevronIcon = sidebarToggle?.querySelector('i');
    if (!chevronIcon) return;
    chevronIcon.classList.remove('fa-chevron-left', 'fa-chevron-right');
    chevronIcon.classList.add(isCollapsed ? 'fa-chevron-right' : 'fa-chevron-left');
}

function openMobileSidebar() {
    sidebar?.classList.add('sidebar-open');
    overlay?.classList.remove('hidden');
}
function closeMobileSidebar() {
    sidebar?.classList.remove('sidebar-open');
    overlay?.classList.add('hidden');
}

sidebarToggle?.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
        sidebar.classList.contains('sidebar-open') ? closeMobileSidebar() : openMobileSidebar();
    } else {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('sidebar-collapsed', isCollapsed);
        mainWrapper.classList.toggle('main-expanded', isCollapsed);
        mainWrapper.style.marginLeft = isCollapsed ? '68px' : '';
    }
    updateChevron();
});

mobileMenuBtn?.addEventListener('click', openMobileSidebar);
overlay?.addEventListener('click', closeMobileSidebar);

window.addEventListener('resize', () => {
    updateChevron();
    if (window.innerWidth >= 1024) closeMobileSidebar();
});

updateChevron();

/* ---------------- Sidebar dropdown groups ---------------- */
document.querySelectorAll('.nav-group-header').forEach(header => {
    header.addEventListener('click', function (e) {
        e.stopPropagation();
        const groupItems = this.nextElementSibling;
        const chevron = this.querySelector('.fa-chevron-down');
        if (groupItems) {
            groupItems.classList.toggle('hidden');
            if (chevron) chevron.style.transform = groupItems.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });
});

/* ---------------- Notification & user menus ---------------- */
const notifBtn = document.getElementById('notif-btn');
const notifMenu = document.getElementById('notif-menu');
const userBtn = document.getElementById('user-menu-btn');
const userMenu = document.getElementById('user-menu');

notifBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    notifMenu.classList.toggle('hidden');
    userMenu?.classList.add('hidden');
});
userBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('hidden');
    notifMenu?.classList.add('hidden');
});
document.addEventListener('click', (e) => {
    if (!userBtn?.contains(e.target) && !userMenu?.contains(e.target)) userMenu?.classList.add('hidden');
    if (!notifBtn?.contains(e.target) && !notifMenu?.contains(e.target)) notifMenu?.classList.add('hidden');
});

const logoutBtn = document.getElementById('logout-btn');
logoutBtn?.addEventListener('click', (e) => {
    // e.preventDefault(); // enable once a real logout() handler exists
});

/* ---------------- Monthly Quotation Trend chart ---------------- */
const navy = '#111844';
const slate = '#4B5694';
const gridColor = 'rgba(75, 86, 148, 0.12)';
const fontColor = '#7288AE';

Chart.defaults.font.family = "'Roboto', sans-serif";
Chart.defaults.font.size = 11;

const trendMonths = ['Jan-25', 'Feb-25', 'Mar-25', 'Apr-25', 'May-25', 'Jun-25'];
const trendCounts = [25, 31, 42, 38, 45, 52];

new Chart(document.getElementById('chartQuotationTrend'), {
    type: 'line',
    data: {
        labels: trendMonths,
        datasets: [{
            label: 'Quotations',
            data: trendCounts,
            borderColor: navy,
            backgroundColor: 'rgba(17, 24, 68, 0.10)',
            fill: true,
            tension: 0.35,
            pointBackgroundColor: navy,
            pointRadius: 4
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#FFFCFC',
                titleColor: navy,
                bodyColor: slate,
                borderColor: 'rgba(75,86,148,0.2)',
                borderWidth: 1,
                padding: 10,
                displayColors: false
            }
        },
        scales: {
            x: { grid: { display: false }, ticks: { color: fontColor } },
            y: { grid: { color: gridColor }, ticks: { color: fontColor, precision: 0 } }
        }
    }
});

/* ---------------- Recent Quotations table ---------------- */
const quotations = [
    { no: 'SQ-1001', customer: 'Amit Sharma', size: '3 kW', amount: 165000, status: 'Pending', date: '2026-07-15' },
    { no: 'SQ-1000', customer: 'Priya Enterprises', size: '10 kW', amount: 540000, status: 'Accepted', date: '2026-07-14' },
    { no: 'SQ-0999', customer: 'Ravi Constructions', size: '5 kW', amount: 275000, status: 'Rejected', date: '2026-07-14' },
    { no: 'SQ-0998', customer: 'Meena Textiles', size: '25 kW', amount: 1320000, status: 'Accepted', date: '2026-07-13' },
    { no: 'SQ-0997', customer: 'Suresh Patel', size: '4 kW', amount: 210000, status: 'Pending', date: '2026-07-12' },
    { no: 'SQ-0996', customer: 'Global Foods Pvt Ltd', size: '50 kW', amount: 2650000, status: 'Accepted', date: '2026-07-12' },
    { no: 'SQ-0995', customer: 'Anita Deshmukh', size: '3 kW', amount: 158000, status: 'Rejected', date: '2026-07-11' },
    { no: 'SQ-0994', customer: 'Rajesh Traders', size: '7 kW', amount: 372000, status: 'Pending', date: '2026-07-11' },
    { no: 'SQ-0993', customer: 'Sunrise Apartments', size: '15 kW', amount: 795000, status: 'Accepted', date: '2026-07-10' },
    { no: 'SQ-0992', customer: 'Vikram Industries', size: '30 kW', amount: 1580000, status: 'Pending', date: '2026-07-09' },
    { no: 'SQ-0991', customer: 'Kavita Rao', size: '3 kW', amount: 162000, status: 'Accepted', date: '2026-07-08' },
    { no: 'SQ-0990', customer: 'Deepak Motors', size: '20 kW', amount: 1050000, status: 'Pending', date: '2026-07-08' },
    { no: 'SQ-0989', customer: 'Farha Textiles', size: '6 kW', amount: 318000, status: 'Rejected', date: '2026-07-07' },
    { no: 'SQ-0988', customer: 'Nikhil Joshi', size: '4 kW', amount: 205000, status: 'Accepted', date: '2026-07-06' },
    { no: 'SQ-0987', customer: 'Star Cold Storage', size: '40 kW', amount: 2120000, status: 'Pending', date: '2026-07-05' },
];

const statusPillClass = { Pending: 'pill-pending', Accepted: 'pill-accepted', Rejected: 'pill-rejected' };

function formatINR(n) {
    return '₹' + n.toLocaleString('en-IN');
}
function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

let sortKey = 'date';
let sortDir = 'desc';
let currentPage = 1;
let rowsPerPage = 10;

const tbody = document.getElementById('quotationsTbody');
const paginationControls = document.getElementById('paginationControls');
const rowsRangeLabel = document.getElementById('rowsRangeLabel');
const rowsPerPageSelect = document.getElementById('rowsPerPage');
const rowActionDropdown = document.getElementById('rowActionDropdown');

function sortedQuotations() {
    const list = [...quotations];
    list.sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey];
        if (sortKey === 'amount') { /* numeric already */ }
        else if (sortKey === 'date') { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
        else { av = String(av).toLowerCase(); bv = String(bv).toLowerCase(); }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });
    return list;
}

function renderTable() {
    const data = sortedQuotations();
    const totalRows = data.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = data.slice(start, start + rowsPerPage);

    tbody.innerHTML = pageRows.map((q, i) => `
        <tr data-idx="${start + i}">
            <td class="font-medium">${q.no}</td>
            <td>${q.customer}</td>
            <td>${q.size}</td>
            <td>${formatINR(q.amount)}</td>
            <td><span class="pill ${statusPillClass[q.status]}">${q.status}</span></td>
            <td>${formatDate(q.date)}</td>
            <td class="text-center">
                <button class="action-menu-btn" data-row-actions="${start + i}" title="Actions">
                    <i class="fas fa-ellipsis-vertical"></i>
                </button>
            </td>
        </tr>
    `).join('');

    rowsRangeLabel.textContent = totalRows === 0
        ? 'No records'
        : `${start + 1}–${Math.min(start + rowsPerPage, totalRows)} of ${totalRows}`;

    renderPagination(totalPages);
    updateSortIcons();
}

function renderPagination(totalPages) {
    let html = '';
    html += `<span class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" data-page="prev"><i class="fas fa-chevron-left" style="font-size:9px"></i></span>`;
    for (let p = 1; p <= totalPages; p++) {
        if (totalPages > 7 && p !== 1 && p !== totalPages && Math.abs(p - currentPage) > 1) {
            if (p === 2 || p === totalPages - 1) html += `<span class="pagination-btn disabled">…</span>`;
            continue;
        }
        html += `<span class="pagination-btn ${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</span>`;
    }
    html += `<span class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" data-page="next"><i class="fas fa-chevron-right" style="font-size:9px"></i></span>`;
    paginationControls.innerHTML = html;

    paginationControls.querySelectorAll('.pagination-btn:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            const p = btn.getAttribute('data-page');
            if (p === 'prev') currentPage = Math.max(1, currentPage - 1);
            else if (p === 'next') currentPage = Math.min(totalPages, currentPage + 1);
            else currentPage = parseInt(p, 10);
            renderTable();
        });
    });
}

function updateSortIcons() {
    document.querySelectorAll('#quotationsTable thead th[data-key]').forEach(th => {
        const icon = th.querySelector('i');
        const key = th.getAttribute('data-key');
        icon.className = key === sortKey
            ? (sortDir === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down')
            : 'fas fa-sort';
    });
}

document.querySelectorAll('#quotationsTable thead th[data-key]').forEach(th => {
    th.addEventListener('click', () => {
        const key = th.getAttribute('data-key');
        if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        else { sortKey = key; sortDir = 'asc'; }
        currentPage = 1;
        renderTable();
    });
});

rowsPerPageSelect?.addEventListener('change', () => {
    rowsPerPage = parseInt(rowsPerPageSelect.value, 10);
    currentPage = 1;
    renderTable();
});

/* ---------------- Row actions dropdown ---------------- */
let activeRowIdx = null;

tbody.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-row-actions]');
    if (actionBtn) {
        e.stopPropagation();
        activeRowIdx = parseInt(actionBtn.getAttribute('data-row-actions'), 10);
        const rect = actionBtn.getBoundingClientRect();
        rowActionDropdown.style.top = `${window.scrollY + rect.bottom + 4}px`;
        rowActionDropdown.style.left = `${window.scrollX + rect.right - 160}px`;
        rowActionDropdown.classList.remove('hidden');
        return;
    }
    const row = e.target.closest('tr[data-idx]');
    if (row) {
        const idx = parseInt(row.getAttribute('data-idx'), 10);
        const q = sortedQuotations()[idx];
        showToast(`Opening ${q.no}…`);
    }
});

rowActionDropdown.querySelectorAll('a[data-action]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const q = sortedQuotations()[activeRowIdx];
        const action = link.getAttribute('data-action');
        const labels = { view: 'Viewing', edit: 'Editing', pdf: 'Downloading PDF for', print: 'Printing', duplicate: 'Duplicating' };
        showToast(`${labels[action]} ${q.no}`);
        rowActionDropdown.classList.add('hidden');
    });
});

document.addEventListener('click', () => rowActionDropdown.classList.add('hidden'));

/* ---------------- Toast helper ---------------- */
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast-animate bg-[#111844] text-[#FAFAFA] text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
}

/* ---------------- Init ---------------- */
renderTable();