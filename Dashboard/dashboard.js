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
    if (window.trendChart) window.trendChart.resize();
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

window.trendChart = new Chart(document.getElementById('chartQuotationTrend'), {
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
        maintainAspectRatio: false,
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

/* ---------------- Recent Quotations data ---------------- */
let quotations = [
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

/* Inline action icon buttons — one icon per action, always in a single
   horizontal row, small enough that the table never needs to scroll. */
function actionIconsHtml(no) {
    return `
        <div class="row-actions">
            <button class="action-icon-btn icon-view" data-action="view" data-no="${no}" title="View"><i class="fas fa-eye"></i></button>
            <button class="action-icon-btn icon-edit" data-action="edit" data-no="${no}" title="Edit"><i class="fas fa-pen"></i></button>
            <button class="action-icon-btn icon-print" data-action="print" data-no="${no}" title="Print"><i class="fas fa-print"></i></button>
            <button class="action-icon-btn icon-pdf" data-action="pdf" data-no="${no}" title="Download PDF"><i class="fas fa-file-pdf"></i></button>
            <button class="action-icon-btn icon-duplicate" data-action="duplicate" data-no="${no}" title="Duplicate"><i class="fas fa-copy"></i></button>
        </div>`;
}

function renderTable() {
    const data = sortedQuotations();
    const totalRows = data.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = data.slice(start, start + rowsPerPage);

    tbody.innerHTML = pageRows.map((q) => `
        <tr data-no="${q.no}">
            <td data-label="Quotation No." class="font-medium">${q.no}</td>
            <td data-label="Customer">${q.customer}</td>
            <td data-label="System Size">${q.size}</td>
            <td data-label="Amount">${formatINR(q.amount)}</td>
            <td data-label="Status"><span class="pill ${statusPillClass[q.status]}">${q.status}</span></td>
            <td data-label="Date">${formatDate(q.date)}</td>
            <td data-label="Actions">${actionIconsHtml(q.no)}</td>
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

/* ===========================================================
   Row actions: View (read-only) / Edit (selective fields) /
   Print / Download PDF / Duplicate
   =========================================================== */
const quoteModal = document.getElementById('quoteModal');
const modalTitle = document.getElementById('modalTitle');
const modalSubtitle = document.getElementById('modalSubtitle');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalSaveBtn = document.getElementById('modalSaveBtn');
const quoteForm = document.getElementById('quoteForm');

const fldNo = document.getElementById('fldNo');
const fldCustomer = document.getElementById('fldCustomer');
const fldSize = document.getElementById('fldSize');
const fldAmount = document.getElementById('fldAmount');
const fldStatus = document.getElementById('fldStatus');
const fldDate = document.getElementById('fldDate');

// Fields the "Edit" mode is allowed to change. Everything else always stays read-only.
const EDITABLE_FIELD_IDS = ['fldCustomer', 'fldSize', 'fldAmount', 'fldStatus'];

let modalMode = 'view'; // 'view' | 'edit'
let modalQuoteNo = null;

function findQuote(no) {
    return quotations.find(q => q.no === no);
}

function fillForm(q) {
    fldNo.value = q.no;
    fldCustomer.value = q.customer;
    fldSize.value = q.size;
    fldAmount.value = q.amount;
    fldStatus.value = q.status;
    fldDate.value = q.date;
}

function openModal(no, mode) {
    const q = findQuote(no);
    if (!q) return;
    modalMode = mode;
    modalQuoteNo = no;
    fillForm(q);

    if (mode === 'view') {
        modalTitle.textContent = 'Quotation Details';
        modalSubtitle.textContent = `${q.no} · Read-only`;
        quoteForm.querySelectorAll('.field-input').forEach(el => el.disabled = true);
        modalSaveBtn.classList.add('hidden');
        modalCancelBtn.textContent = 'Close';
    } else {
        modalTitle.textContent = 'Edit Quotation';
        modalSubtitle.textContent = `${q.no} · Customer, size, amount & status only`;
        quoteForm.querySelectorAll('.field-input').forEach(el => {
            el.disabled = !EDITABLE_FIELD_IDS.includes(el.id);
        });
        modalSaveBtn.classList.remove('hidden');
        modalCancelBtn.textContent = 'Cancel';
    }

    quoteModal.classList.remove('hidden');
}

function closeModal() {
    quoteModal.classList.add('hidden');
    modalQuoteNo = null;
}

modalCloseBtn.addEventListener('click', closeModal);
modalCancelBtn.addEventListener('click', closeModal);
quoteModal.addEventListener('click', (e) => { if (e.target === quoteModal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !quoteModal.classList.contains('hidden')) closeModal(); });

modalSaveBtn.addEventListener('click', () => {
    const q = findQuote(modalQuoteNo);
    if (!q) return;
    q.customer = fldCustomer.value.trim() || q.customer;
    q.size = fldSize.value.trim() || q.size;
    q.amount = parseFloat(fldAmount.value) || q.amount;
    q.status = fldStatus.value;
    renderTable();
    closeModal();
    showToast(`Saved changes to ${q.no}`);
});

/* ---- Print: fills the hidden print slip and opens the browser print dialog ---- */
function printQuotation(no) {
    const q = findQuote(no);
    if (!q) return;
    document.getElementById('pNo').textContent = q.no;
    document.getElementById('pCustomer').textContent = q.customer;
    document.getElementById('pSize').textContent = q.size;
    document.getElementById('pAmount').textContent = formatINR(q.amount);
    document.getElementById('pStatus').textContent = q.status;
    document.getElementById('pDate').textContent = formatDate(q.date);
    document.getElementById('pGenDate').textContent = new Date().toLocaleString('en-IN');
    window.print();
}

/* ---- Download PDF: generates a real .pdf file client-side with jsPDF ---- */
function downloadQuotationPdf(no) {
    const q = findQuote(no);
    if (!q) return;
    if (!window.jspdf) {
        showToast('PDF library failed to load — check your connection');
        return;
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    doc.setFontSize(16);
    doc.setTextColor(17, 24, 68);
    doc.text('Solar Quotation Management', 40, 50);
    doc.setFontSize(11);
    doc.setTextColor(75, 86, 148);
    doc.text('Quotation Slip', 40, 68);
    doc.setDrawColor(17, 24, 68);
    doc.line(40, 78, 555, 78);

    const rows = [
        ['Quotation No.', q.no],
        ['Customer', q.customer],
        ['System Size', q.size],
        ['Amount', formatINR(q.amount)],
        ['Status', q.status],
        ['Date', formatDate(q.date)],
    ];

    let y = 110;
    doc.setFontSize(11);
    rows.forEach(([label, value]) => {
        doc.setTextColor(75, 86, 148);
        doc.text(label, 40, y);
        doc.setTextColor(17, 24, 68);
        doc.text(String(value), 220, y);
        y += 26;
    });

    doc.setFontSize(9);
    doc.setTextColor(114, 136, 174);
    doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, 40, y + 20);

    doc.save(`${q.no}.pdf`);
    showToast(`Downloaded ${q.no}.pdf`);
}

/* ---- Duplicate: clones the quotation with a fresh number and inserts it at the top ---- */
function duplicateQuotation(no) {
    const q = findQuote(no);
    if (!q) return;

    const maxNum = quotations.reduce((max, item) => {
        const n = parseInt(item.no.replace(/\D/g, ''), 10);
        return isNaN(n) ? max : Math.max(max, n);
    }, 0);
    const newNo = `SQ-${String(maxNum + 1).padStart(4, '0')}`;

    const copy = {
        ...q,
        no: newNo,
        status: 'Pending',
        date: new Date().toISOString().slice(0, 10),
    };
    quotations.unshift(copy);
    sortKey = 'date'; sortDir = 'desc'; currentPage = 1;
    renderTable();
    showToast(`Duplicated as ${newNo}`);
}

/* ---- Wire up the action icons + row click ---- */
tbody.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
        e.stopPropagation();
        const no = actionBtn.getAttribute('data-no');
        const action = actionBtn.getAttribute('data-action');
        if (action === 'view') openModal(no, 'view');
        else if (action === 'edit') openModal(no, 'edit');
        else if (action === 'print') printQuotation(no);
        else if (action === 'pdf') downloadQuotationPdf(no);
        else if (action === 'duplicate') duplicateQuotation(no);
        return;
    }
    const row = e.target.closest('tr[data-no]');
    if (row) {
        openModal(row.getAttribute('data-no'), 'view');
    }
});

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