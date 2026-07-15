// ============================================================
// Quotation Management — single-module client-side logic (demo data only)
// ============================================================

/* ---------------- Company info (used in sidebar + invoice header) ---------------- */
const COMPANY = {
    name: 'SolarTech Renewables Pvt. Ltd.',
    address: '14, Industrial Estate Road, Pune, Maharashtra',
    phone: '+91 98765 43210',
    email: 'sales@solartechrenewables.in',
    gstin: '27ABCDE1234F1Z5',
    state: 'Maharashtra',
    logo: 'logo.svg'
};

/* ---------------- Sidebar / Topbar chrome (fixed + collapsible, mirrors reference dashboard) ---------------- */
const sidebar = document.getElementById('sidebar');
const mainWrapper = document.getElementById('main-wrapper');
const sidebarToggle = document.getElementById('sidebar-toggle');
const mobileToggle = document.getElementById('mobile-toggle');
const sidebarOverlay = document.getElementById('sidebar-overlay');

let isCollapsed = false;

sidebarToggle?.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('show');
    } else {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('collapsed', isCollapsed);
        mainWrapper.classList.toggle('expanded', isCollapsed);
    }
});
mobileToggle?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('show');
});
sidebarOverlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
});
window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('show');
    }
});

function setupDropdown(btnId, menuId) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    btn?.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.dropdown-menu').forEach(m => { if (m !== menu) m.classList.add('hidden'); });
        menu.classList.toggle('hidden');
    });
}
setupDropdown('notif-btn', 'notif-menu');
setupDropdown('user-menu-btn', 'user-menu');
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.add('hidden'));
});

/* ---------------- Generic modal open/close ---------------- */
function openModal(id) { document.getElementById(id).classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); document.body.style.overflow = ''; }

document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => closeModal(btn.dataset.close));
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});

/* ---------------- Toasts ---------------- */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function formatINR(n) {
    return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN');
}

/* =====================================================================
   QUOTATION DATA MODEL
   ===================================================================== */
const UNIT_PRICES = {
    panelPerWatt: 22,
    inverterPerKw: 6500,
    structurePerPanel: 900,
    accessories: {
        'DC Cable': 45, 'AC Cable': 60, 'Earthing Kit': 1800,
        'Lightning Arrestor': 2200, 'Junction Box': 700, 'Connectors': 120, 'Net Meter': 3500
    }
};

function computeTotals(costs, gstPercent, discountType, discountValue) {
    const subtotal = costs.panel + costs.inverter + costs.structure + costs.accessories +
        costs.installation + costs.transport + costs.netmeter + costs.other;
    const discountAmount = discountType === 'percent' ? subtotal * (discountValue / 100) : discountValue;
    const taxable = Math.max(0, subtotal - discountAmount);
    const sgst = taxable * (gstPercent / 2 / 100);
    const cgst = taxable * (gstPercent / 2 / 100);
    const total = taxable + sgst + cgst;
    return { subtotal, discountAmount, sgst, cgst, total };
}

function numberToWordsIndian(num) {
    num = Math.round(num);
    if (num === 0) return 'Zero Rupees Only';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
        'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    function twoDigits(n) { return n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : ''); }
    function threeDigits(n) { return n < 100 ? twoDigits(n) : ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + twoDigits(n % 100) : ''); }
    let result = '';
    const crore = Math.floor(num / 10000000); num %= 10000000;
    const lakh = Math.floor(num / 100000); num %= 100000;
    const thousand = Math.floor(num / 1000); num %= 1000;
    const rest = num;
    if (crore) result += threeDigits(crore) + ' Crore ';
    if (lakh) result += threeDigits(lakh) + ' Lakh ';
    if (thousand) result += threeDigits(thousand) + ' Thousand ';
    if (rest) result += threeDigits(rest);
    return result.trim() + ' Rupees Only';
}

let quoteCounter = 1000;
function nextQuoteNo() { quoteCounter += 1; return `SQ-${quoteCounter}`; }

function makeQuotation(overrides = {}) {
    const base = {
        quoteNo: nextQuoteNo(),
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        customer: {
            name: '', company: '', mobile: '', email: '', address: '', city: '', state: '',
            pincode: '', consumerNo: '', commercial: false, gst: ''
        },
        systemSizeKw: 3,
        systemSizeLabel: '3 kW',
        panel: { brand: 'Waaree', model: 'WSM-550', wattage: 550, qty: 6, warranty: '25 years (performance)' },
        inverter: { brand: 'Growatt', capacity: '3 kW', type: 'String', warranty: '5 years' },
        mounting: 'RCC Roof',
        accessories: [
            { name: 'DC Cable', qty: 15, checked: true },
            { name: 'AC Cable', qty: 10, checked: true },
            { name: 'Earthing Kit', qty: 2, checked: true },
            { name: 'Lightning Arrestor', qty: 1, checked: false },
            { name: 'Junction Box', qty: 1, checked: true },
            { name: 'Connectors', qty: 6, checked: true },
            { name: 'Net Meter', qty: 1, checked: false }
        ],
        costs: { panel: 0, inverter: 0, structure: 0, accessories: 0, installation: 8000, transport: 2500, netmeter: 0, otherLabel: 'Other Charges', other: 0 },
        gstPercent: 18,
        discountType: 'percent',
        discountValue: 0,
        tariff: 8,
        subsidy: 78000,
        advance: 0
    };
    const merged = { ...base, ...overrides };
    merged.customer = { ...base.customer, ...(overrides.customer || {}) };
    merged.panel = { ...base.panel, ...(overrides.panel || {}) };
    merged.inverter = { ...base.inverter, ...(overrides.inverter || {}) };
    merged.costs = { ...base.costs, ...(overrides.costs || {}) };
    if (overrides.accessories) merged.accessories = overrides.accessories;

    // Auto-calc cost components from panel/inverter/structure/accessories
    merged.costs.panel = merged.panel.wattage * merged.panel.qty * UNIT_PRICES.panelPerWatt;
    merged.costs.inverter = merged.systemSizeKw * UNIT_PRICES.inverterPerKw;
    merged.costs.structure = merged.panel.qty * UNIT_PRICES.structurePerPanel;
    merged.costs.accessories = merged.accessories.reduce((sum, a) => {
        if (a.checked && a.name !== 'Net Meter') return sum + (UNIT_PRICES.accessories[a.name] || 0) * a.qty;
        return sum;
    }, 0);
    const netMeterItem = merged.accessories.find(a => a.name === 'Net Meter');
    merged.costs.netmeter = (netMeterItem && netMeterItem.checked) ? (UNIT_PRICES.accessories['Net Meter'] * netMeterItem.qty) : 0;

    const totals = computeTotals(merged.costs, merged.gstPercent, merged.discountType, merged.discountValue);
    Object.assign(merged, totals);
    merged.amount = Math.round(totals.total);
    merged.balance = Math.round(totals.total - merged.advance);
    return merged;
}

/* ---------------- Seed demo quotations ---------------- */
let quotations = [
    makeQuotation({ customer: { name: 'Amit Sharma', mobile: '9876543210', email: 'amit.sharma@example.com', address: 'Plot 12, Kothrud', city: 'Pune', state: 'Maharashtra', pincode: '411038' }, status: 'Pending', date: '2026-07-15' }),
    makeQuotation({ customer: { name: 'Ramesh Traders', company: 'Ramesh Traders', mobile: '9876500001', email: 'ramesh.traders@example.com', address: 'MG Road', city: 'Ahmedabad', state: 'Gujarat', pincode: '380001', commercial: true, gst: '24ABCDE5678F1Z2' }, systemSizeKw: 5, systemSizeLabel: '5 kW', panel: { qty: 9 }, status: 'Accepted', date: '2026-07-14' }),
    makeQuotation({ customer: { name: 'Priya Nair', mobile: '9876500002', email: 'priya.nair@example.com', address: 'Marine Drive', city: 'Kochi', state: 'Karnataka', pincode: '682001' }, systemSizeKw: 2, systemSizeLabel: '2 kW', panel: { qty: 4 }, status: 'Rejected', date: '2026-07-13' }),
    makeQuotation({ customer: { name: 'Suresh Patel', mobile: '9876500003', email: 'suresh.patel@example.com', address: 'Ring Road', city: 'Rajkot', state: 'Gujarat', pincode: '360001' }, systemSizeKw: 10, systemSizeLabel: '10 kW', panel: { qty: 18 }, status: 'Pending', date: '2026-07-12' }),
    makeQuotation({ customer: { name: 'Neha Gupta', mobile: '9876500004', email: 'neha.gupta@example.com', address: 'Civil Lines', city: 'Jaipur', state: 'Rajasthan', pincode: '302001' }, systemSizeKw: 1, systemSizeLabel: '1 kW', panel: { qty: 2 }, status: 'Accepted', date: '2026-07-11' }),
    makeQuotation({ customer: { name: 'Vikas Enterprises', company: 'Vikas Enterprises', mobile: '9876500005', email: 'vikas.ent@example.com', address: 'Industrial Area', city: 'Delhi', state: 'Delhi', pincode: '110001', commercial: true, gst: '07ABCDE1111F1Z9' }, systemSizeKw: 20, systemSizeLabel: '20 kW', panel: { qty: 36 }, status: 'Pending', date: '2026-07-10' }),
    makeQuotation({ customer: { name: 'Anjali Deshmukh', mobile: '9876500006', email: 'anjali.d@example.com', address: 'FC Road', city: 'Pune', state: 'Maharashtra', pincode: '411005' }, status: 'Accepted', date: '2026-07-09' }),
    makeQuotation({ customer: { name: 'Rohit Verma', mobile: '9876500007', email: 'rohit.verma@example.com', address: 'Anna Nagar', city: 'Chennai', state: 'Tamil Nadu', pincode: '600040' }, systemSizeKw: 5, systemSizeLabel: '5 kW', panel: { qty: 9 }, status: 'Rejected', date: '2026-07-08' }),
    makeQuotation({ customer: { name: 'Sneha Kulkarni', mobile: '9876500008', email: 'sneha.k@example.com', address: 'Deccan Gymkhana', city: 'Pune', state: 'Maharashtra', pincode: '411004' }, systemSizeKw: 2, systemSizeLabel: '2 kW', panel: { qty: 4 }, status: 'Pending', date: '2026-07-07' }),
    makeQuotation({ customer: { name: 'Manoj Yadav', mobile: '9876500009', email: 'manoj.y@example.com', address: 'Hazratganj', city: 'Lucknow', state: 'Delhi', pincode: '226001' }, systemSizeKw: 10, systemSizeLabel: '10 kW', panel: { qty: 18 }, status: 'Accepted', date: '2026-07-06' }),
];

/* =====================================================================
   TABLE: search / filter / sort / pagination / stats
   ===================================================================== */
let sortKey = null, sortDir = 1, currentPage = 1, rowsPerPage = 10;

function refreshSizeFilterOptions() {
    const sel = document.getElementById('filter-size');
    const current = sel.value;
    const sizes = [...new Set(quotations.map(q => q.systemSizeLabel))];
    sel.innerHTML = `<option value="">All Sizes</option>` + sizes.map(s => `<option value="${s}">${s}</option>`).join('');
    sel.value = sizes.includes(current) ? current : '';
}

function badgeClass(status) {
    if (status === 'Accepted') return 'badge-accepted';
    if (status === 'Rejected') return 'badge-rejected';
    return 'badge-pending';
}

function getFiltered() {
    const q = document.getElementById('search-input').value.trim().toLowerCase();
    const status = document.getElementById('filter-status').value;
    const size = document.getElementById('filter-size').value;
    let list = quotations.filter(row => {
        const matchesSearch = !q || row.customer.name.toLowerCase().includes(q) || row.quoteNo.toLowerCase().includes(q);
        const matchesStatus = !status || row.status === status;
        const matchesSize = !size || row.systemSizeLabel === size;
        return matchesSearch && matchesStatus && matchesSize;
    });
    if (sortKey) {
        list = [...list].sort((a, b) => {
            const map = { quoteNo: a.quoteNo, customer: a.customer.name, size: a.systemSizeLabel, amount: a.amount, status: a.status, date: a.date };
            const mapB = { quoteNo: b.quoteNo, customer: b.customer.name, size: b.systemSizeLabel, amount: b.amount, status: b.status, date: b.date };
            let va = map[sortKey], vb = mapB[sortKey];
            if (sortKey === 'amount') { va = Number(va); vb = Number(vb); }
            if (va < vb) return -1 * sortDir;
            if (va > vb) return 1 * sortDir;
            return 0;
        });
    }
    return list;
}

function updateStats() {
    document.getElementById('stat-total').textContent = quotations.length;
    const todayStr = new Date().toISOString().slice(0, 10);
    document.getElementById('stat-today').textContent = quotations.filter(q => q.date === todayStr).length;
    document.getElementById('stat-value').textContent = formatINR(quotations.reduce((s, q) => s + q.amount, 0));
    document.getElementById('stat-accepted').textContent = quotations.filter(q => q.status === 'Accepted').length;
    document.getElementById('stat-rejected').textContent = quotations.filter(q => q.status === 'Rejected').length;
    document.getElementById('stat-pending').textContent = quotations.filter(q => q.status === 'Pending').length;
}

function renderTable() {
    updateStats();
    refreshSizeFilterOptions();
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;
    const start = (currentPage - 1) * rowsPerPage;
    const pageRows = filtered.slice(start, start + rowsPerPage);

    const tbody = document.getElementById('quotation-tbody');
    tbody.innerHTML = pageRows.map(row => `
        <tr>
            <td><b>${row.quoteNo}</b></td>
            <td>${row.customer.name || '—'}</td>
            <td>${row.systemSizeLabel}</td>
            <td>${formatINR(row.amount)}</td>
            <td><span class="badge ${badgeClass(row.status)}">${row.status}</span></td>
            <td>${new Date(row.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
            <td class="text-right">
                <div class="action-icons">
                    <button class="icon-action-btn" title="View" data-action="view" data-quote="${row.quoteNo}"><i class="fas fa-eye"></i></button>
                    <button class="icon-action-btn" title="Edit" data-action="edit" data-quote="${row.quoteNo}"><i class="fas fa-pen"></i></button>
                    <button class="icon-action-btn danger" title="Delete" data-action="delete" data-quote="${row.quoteNo}"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--hover2);padding:24px;">No quotations match your filters.</td></tr>`;

    const pagination = document.getElementById('pagination');
    let html = `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}"><i class="fas fa-chevron-left"></i></button>`;
    for (let p = 1; p <= totalPages; p++) html += `<button class="${p === currentPage ? 'active' : ''}" data-page="${p}">${p}</button>`;
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}"><i class="fas fa-chevron-right"></i></button>`;
    pagination.innerHTML = html;
    pagination.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', () => { currentPage = Number(btn.dataset.page); renderTable(); });
    });

    tbody.querySelectorAll('[data-action]').forEach(btn => {
        btn.addEventListener('click', () => {
            const quote = quotations.find(q => q.quoteNo === btn.dataset.quote);
            if (!quote) return;
            if (btn.dataset.action === 'view') openViewModal(quote);
            if (btn.dataset.action === 'edit') openEditModal(quote);
            if (btn.dataset.action === 'delete') openDeleteModal(quote);
        });
    });
}

['search-input', 'filter-status', 'filter-size'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => { currentPage = 1; renderTable(); });
});
document.getElementById('rows-per-page').addEventListener('change', (e) => {
    rowsPerPage = Number(e.target.value);
    currentPage = 1;
    renderTable();
});
document.querySelectorAll('.data-table th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        const key = th.dataset.sort;
        sortDir = (sortKey === key) ? -sortDir : 1;
        sortKey = key;
        renderTable();
    });
});

/* =====================================================================
   INVOICE MARKUP (shared by wizard preview + view modal)
   ===================================================================== */
function buildInvoiceMarkup(q) {
    const items = [
        { name: 'Solar Panels', type: q.panel.brand, qty: q.panel.qty, unit: 'Pcs', amount: q.costs.panel },
        { name: 'Inverter', type: q.inverter.type, qty: 1, unit: 'Unit', amount: q.costs.inverter },
        { name: 'Mounting Structure', type: q.mounting, qty: 1, unit: 'Set', amount: q.costs.structure },
        { name: 'Electrical Accessories', type: 'Miscellaneous', qty: 1, unit: 'Set', amount: q.costs.accessories },
        { name: 'Installation', type: 'Labor Cost', qty: 1, unit: 'Job', amount: q.costs.installation },
        { name: 'Transportation', type: 'Logistics', qty: 1, unit: 'Job', amount: q.costs.transport },
    ];
    if (q.costs.netmeter) items.push({ name: 'Net Meter', type: 'Metering', qty: 1, unit: 'Unit', amount: q.costs.netmeter });
    if (q.costs.other) items.push({ name: q.costs.otherLabel || 'Other Charges', type: 'Other', qty: 1, unit: '—', amount: q.costs.other });

    const rowsHtml = items.map((item, i) => `
        <tr>
            <td>${i + 1}</td><td>${item.name}</td><td>${item.type}</td>
            <td class="num">${item.qty}</td><td>${item.unit}</td>
            <td class="num">${formatINR(item.amount)}</td><td class="num">0</td>
            <td class="num">${q.gstPercent}%</td><td class="num">${formatINR(item.amount)}</td>
        </tr>
    `).join('');

    const badgeCls = badgeClass(q.status);

    return `
        <div class="inv-header">
            <div class="inv-company">
                <div class="inv-company-name">${COMPANY.name}</div>
                <div>Address: ${COMPANY.address}</div>
                <div>Phone No.: ${COMPANY.phone}</div>
                <div>Email ID: ${COMPANY.email}</div>
                <div>GSTIN: ${COMPANY.gstin}</div>
                <div>State: ${COMPANY.state}</div>
            </div>
            <img src="${COMPANY.logo}" alt="Company Logo" class="inv-logo">
        </div>
        <div class="inv-title">Quotation</div>
        <div class="inv-parties">
            <div class="inv-bill-to">
                <div class="inv-label">Bill To:</div>
                <div>Name: ${q.customer.name || '—'}</div>
                <div>Address: ${q.customer.address || '—'}${q.customer.city ? ', ' + q.customer.city : ''}</div>
                <div>Contact No.: ${q.customer.mobile || '—'}</div>
                <div>GSTIN No.: ${q.customer.gst || '—'}</div>
                <div>State: ${q.customer.state || '—'}</div>
                <span class="badge ${badgeCls} inv-status">${q.status}</span>
            </div>
            <div class="inv-meta">
                <div><span>Quotation No.:</span> <b>${q.quoteNo}</b></div>
                <div><span>Quotation Date:</span> <b>${new Date(q.date).toLocaleDateString('en-GB')}</b></div>
                <div><span>System Size:</span> <b>${q.systemSizeLabel}</b></div>
            </div>
        </div>
        <table class="inv-items-table">
            <thead><tr><th>#</th><th>Item</th><th>Type</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Dis</th><th>GST</th><th>Amount</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
        </table>
        <div class="inv-totals">
            <div class="inv-words">
                <div class="inv-label">Amount in Words:</div>
                <div>${numberToWordsIndian(q.total)}</div>
                <div class="inv-terms">
                    <div class="inv-label">Terms & Conditions</div>
                    <div class="terms-text">1. Prices valid for 15 days. 2. 50% advance required to confirm order. 3. Delivery within 3–4 weeks of advance payment.</div>
                </div>
            </div>
            <table class="inv-totals-table">
                <tr><td>Sub Total</td><td>${formatINR(q.subtotal)}</td></tr>
                <tr><td>Discount</td><td>${formatINR(q.discountAmount)}</td></tr>
                <tr><td>SGST</td><td>${formatINR(q.sgst)}</td></tr>
                <tr><td>CGST</td><td>${formatINR(q.cgst)}</td></tr>
                <tr class="total-row"><td>Total</td><td>${formatINR(q.total)}</td></tr>
                <tr><td>Advance</td><td>${formatINR(q.advance)}</td></tr>
                <tr><td>Balance</td><td>${formatINR(q.total - q.advance)}</td></tr>
            </table>
        </div>
        <div class="inv-seal">Company Seal & Signature</div>
    `;
}

/* =====================================================================
   VIEW MODAL (read-only)
   ===================================================================== */
function openViewModal(q) {
    document.getElementById('view-invoice-preview').innerHTML = buildInvoiceMarkup(q);
    openModal('modal-view');
}

/* =====================================================================
   EDIT MODAL (essential fields only)
   ===================================================================== */
let editingQuoteNo = null;

function openEditModal(q) {
    editingQuoteNo = q.quoteNo;
    document.getElementById('edit-quoteno').textContent = q.quoteNo;
    document.getElementById('edit-customerName').value = q.customer.name;
    document.getElementById('edit-mobile').value = q.customer.mobile;
    document.getElementById('edit-email').value = q.customer.email;
    document.getElementById('edit-installation').value = q.costs.installation;
    document.getElementById('edit-transport').value = q.costs.transport;
    document.getElementById('edit-discountValue').value = q.discountValue;
    document.getElementById('edit-status').value = q.status;
    ['err-edit-customerName', 'err-edit-mobile', 'err-edit-email'].forEach(id => document.getElementById(id).textContent = '');
    updateEditSummary();
    openModal('modal-edit');
}

function updateEditSummary() {
    const q = quotations.find(x => x.quoteNo === editingQuoteNo);
    if (!q) return;
    const installation = parseFloat(document.getElementById('edit-installation').value) || 0;
    const transport = parseFloat(document.getElementById('edit-transport').value) || 0;
    const discountValue = parseFloat(document.getElementById('edit-discountValue').value) || 0;
    const costs = { ...q.costs, installation, transport };
    const totals = computeTotals(costs, q.gstPercent, q.discountType, discountValue);
    document.getElementById('edit-summary').innerHTML = `
        <div class="row"><span>Sub Total</span><b>${formatINR(totals.subtotal)}</b></div>
        <div class="row"><span>Discount</span><b>- ${formatINR(totals.discountAmount)}</b></div>
        <div class="row"><span>SGST + CGST</span><b>${formatINR(totals.sgst + totals.cgst)}</b></div>
        <div class="row total"><span>New Total</span><b>${formatINR(totals.total)}</b></div>
    `;
}
['edit-installation', 'edit-transport', 'edit-discountValue'].forEach(id => {
    document.getElementById(id).addEventListener('input', updateEditSummary);
});

document.getElementById('btn-save-edit').addEventListener('click', () => {
    const q = quotations.find(x => x.quoteNo === editingQuoteNo);
    if (!q) return;

    const name = document.getElementById('edit-customerName').value.trim();
    const mobile = document.getElementById('edit-mobile').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    let valid = true;

    if (!name) { document.getElementById('err-edit-customerName').textContent = 'Required'; valid = false; }
    else document.getElementById('err-edit-customerName').textContent = '';

    if (!/^[6-9]\d{9}$/.test(mobile)) { document.getElementById('err-edit-mobile').textContent = 'Enter valid 10-digit mobile'; valid = false; }
    else document.getElementById('err-edit-mobile').textContent = '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('err-edit-email').textContent = 'Enter valid email'; valid = false; }
    else document.getElementById('err-edit-email').textContent = '';

    if (!valid) { showToast('Please fix the highlighted fields.', 'error'); return; }

    q.customer.name = name;
    q.customer.mobile = mobile;
    q.customer.email = email;
    q.costs.installation = parseFloat(document.getElementById('edit-installation').value) || 0;
    q.costs.transport = parseFloat(document.getElementById('edit-transport').value) || 0;
    q.discountValue = parseFloat(document.getElementById('edit-discountValue').value) || 0;
    q.status = document.getElementById('edit-status').value;

    const totals = computeTotals(q.costs, q.gstPercent, q.discountType, q.discountValue);
    Object.assign(q, totals);
    q.amount = Math.round(totals.total);
    q.balance = Math.round(totals.total - q.advance);

    closeModal('modal-edit');
    renderTable();
    showToast(`${q.quoteNo} updated successfully`, 'success');
});

/* =====================================================================
   DELETE MODAL (confirmation)
   ===================================================================== */
let deletingQuoteNo = null;

function openDeleteModal(q) {
    deletingQuoteNo = q.quoteNo;
    document.getElementById('delete-quoteno').textContent = q.quoteNo;
    openModal('modal-delete');
}

document.getElementById('btn-confirm-delete').addEventListener('click', () => {
    quotations = quotations.filter(q => q.quoteNo !== deletingQuoteNo);
    closeModal('modal-delete');
    showToast(`${deletingQuoteNo} deleted`, 'success');
    renderTable();
});

/* =====================================================================
   NEW QUOTATION WIZARD (inside modal-wizard)
   ===================================================================== */
let currentStep = 1;
const totalWizardSteps = 6;

function resetWizardForm() {
    document.getElementById('f-customerName').value = '';
    document.getElementById('f-companyName').value = '';
    document.getElementById('f-mobile').value = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-address').value = '';
    document.getElementById('f-city').value = '';
    document.getElementById('f-state').value = '';
    document.getElementById('f-pincode').value = '';
    document.getElementById('f-consumerNo').value = '';
    document.getElementById('f-commercial').checked = false;
    document.getElementById('f-gst').value = '';
    document.getElementById('gst-field').classList.add('hidden');
    document.getElementById('f-systemSize').value = '3';
    document.getElementById('other-size-wrap').classList.add('hidden');
    document.getElementById('f-panelQty').value = 6;
    document.getElementById('f-invCapacity').value = '3 kW';
    document.getElementById('cost-installation').value = 8000;
    document.getElementById('cost-transport').value = 2500;
    document.getElementById('cost-other').value = 0;
    document.getElementById('cost-other-label').value = 'Other Charges';
    document.getElementById('f-gstPercent').value = '18';
    document.getElementById('f-discountType').value = 'percent';
    document.getElementById('f-discountValue').value = 0;
    document.getElementById('f-tariff').value = 8;
    document.getElementById('f-subsidy').value = 78000;
    document.querySelectorAll('.field-error').forEach(e => e.textContent = '');
    document.querySelectorAll('.invalid').forEach(e => e.classList.remove('invalid'));
    document.getElementById('share-grid').classList.add('hidden');
    document.getElementById('btn-generate').classList.remove('hidden');
}

function openWizard() {
    resetWizardForm();
    currentStep = 1;
    goToStep(1);
    openModal('modal-wizard');
}
document.getElementById('btn-new-quotation').addEventListener('click', openWizard);

function goToStep(step) {
    currentStep = step;
    document.querySelectorAll('.step-panel').forEach(p => p.classList.toggle('active', Number(p.dataset.panel) === step));
    document.querySelectorAll('.step').forEach(s => {
        const n = Number(s.dataset.step);
        s.classList.toggle('active', n === step);
        s.classList.toggle('done', n < step);
    });
    document.getElementById('btn-prev').disabled = step === 1;
    document.getElementById('btn-next').classList.toggle('hidden', step === totalWizardSteps);
    document.getElementById('btn-generate').classList.toggle('hidden', step !== totalWizardSteps);

    if (step === 3) computeCosts();
    if (step === 4) computeGstSummary();
    if (step === 5) computeSavings();
    if (step === 6) renderWizardPreview();
}

document.getElementById('btn-next').addEventListener('click', () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    goToStep(Math.min(currentStep + 1, totalWizardSteps));
});
document.getElementById('btn-prev').addEventListener('click', () => goToStep(Math.max(currentStep - 1, 1)));
document.querySelectorAll('#stepper .step').forEach(s => {
    s.addEventListener('click', () => {
        const n = Number(s.dataset.step);
        if (n < currentStep) goToStep(n);
    });
});

function markError(fieldId, errId, message) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(errId);
    if (message) { field.classList.add('invalid'); err.textContent = message; return false; }
    field.classList.remove('invalid'); err.textContent = ''; return true;
}

function validateStep1() {
    let ok = true;
    const name = document.getElementById('f-customerName').value.trim();
    ok = markError('f-customerName', 'err-customerName', name ? '' : 'Customer name is required') && ok;

    const mobile = document.getElementById('f-mobile').value.trim();
    ok = markError('f-mobile', 'err-mobile', /^[6-9]\d{9}$/.test(mobile) ? '' : 'Enter a valid 10-digit mobile number') && ok;

    const email = document.getElementById('f-email').value.trim();
    ok = markError('f-email', 'err-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Enter a valid email address') && ok;

    const address = document.getElementById('f-address').value.trim();
    ok = markError('f-address', 'err-address', address ? '' : 'Installation address is required') && ok;

    const state = document.getElementById('f-state').value;
    ok = markError('f-state', 'err-state', state ? '' : 'Please select a state') && ok;

    const pincode = document.getElementById('f-pincode').value.trim();
    ok = markError('f-pincode', 'err-pincode', /^\d{6}$/.test(pincode) ? '' : 'Enter a valid 6-digit pincode') && ok;

    if (document.getElementById('f-commercial').checked) {
        const gst = document.getElementById('f-gst').value.trim();
        ok = markError('f-gst', 'err-gst', /^[0-9A-Z]{15}$/i.test(gst) ? '' : 'Enter a valid 15-character GSTIN') && ok;
    }

    if (!ok) showToast('Please fix the highlighted fields.', 'error');
    return ok;
}

function validateStep2() {
    let ok = true;
    const qty = parseFloat(document.getElementById('f-panelQty').value);
    ok = markError('f-panelQty', 'err-panelQty', (qty && qty > 0) ? '' : 'Enter a valid panel quantity') && ok;
    if (!ok) showToast('Please fix the highlighted fields.', 'error');
    return ok;
}

// Commercial toggle -> reveal GST field
document.getElementById('f-commercial').addEventListener('change', (e) => {
    document.getElementById('gst-field').classList.toggle('hidden', !e.target.checked);
});

/* ---------------- System Size dropdown with custom "Other" add ---------------- */
const sizeSelect = document.getElementById('f-systemSize');
sizeSelect.addEventListener('change', () => {
    if (sizeSelect.value === '__other__') {
        document.getElementById('other-size-wrap').classList.remove('hidden');
        document.getElementById('f-otherSize').focus();
    } else {
        document.getElementById('other-size-wrap').classList.add('hidden');
        applySizeDefaults(parseFloat(sizeSelect.value) || 3);
    }
});

document.getElementById('btn-add-size').addEventListener('click', () => {
    const input = document.getElementById('f-otherSize');
    const label = input.value.trim();
    if (!label) { showToast('Enter a system size to add.', 'error'); return; }
    const value = label.toLowerCase().replace(/\s+/g, '-');
    const otherOption = sizeSelect.querySelector('option[value="__other__"]');
    const newOption = document.createElement('option');
    newOption.value = value;
    newOption.dataset.custom = 'true';
    newOption.textContent = label;
    sizeSelect.insertBefore(newOption, otherOption);
    sizeSelect.value = value;
    document.getElementById('other-size-wrap').classList.add('hidden');
    input.value = '';
    const kwMatch = parseFloat(label);
    applySizeDefaults(kwMatch || 3);
    showToast(`Custom system size "${label}" added`, 'success');
});

function getSelectedSizeLabel() {
    const opt = sizeSelect.options[sizeSelect.selectedIndex];
    return opt ? opt.textContent : '3 kW';
}
function getSelectedSizeKw() {
    const val = sizeSelect.value;
    if (val === '__other__') return 3;
    const n = parseFloat(val);
    return isNaN(n) ? (parseFloat(getSelectedSizeLabel()) || 3) : n;
}

function applySizeDefaults(sizeKw) {
    const panelQty = Math.max(2, Math.round((sizeKw * 1000) / 550));
    document.getElementById('f-panelQty').value = panelQty;
    document.getElementById('f-invCapacity').value = `${sizeKw} kW`;
}

// Mounting structure highlight
document.querySelectorAll('#mount-group input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        document.querySelectorAll('.radio-card').forEach(card => card.classList.remove('active'));
        radio.closest('.radio-card').classList.add('active');
    });
});

/* ---------------- Cost Calculation (Step 3) ---------------- */
function getAccessoriesFromForm() {
    return [...document.querySelectorAll('#accessories-list .check-row')].map(row => ({
        name: row.dataset.name,
        checked: row.querySelector('input[type="checkbox"]').checked,
        qty: parseFloat(row.querySelector('.qty-input').value) || 0
    }));
}

function computeCosts() {
    const panelWattage = parseFloat(document.getElementById('f-panelWattage').value) || 550;
    const panelQty = parseFloat(document.getElementById('f-panelQty').value) || 0;
    const panelCost = panelWattage * panelQty * UNIT_PRICES.panelPerWatt;

    const sizeKw = getSelectedSizeKw();
    const inverterCost = sizeKw * UNIT_PRICES.inverterPerKw;
    const structureCost = panelQty * UNIT_PRICES.structurePerPanel;

    let accessoriesCost = 0;
    getAccessoriesFromForm().forEach(item => {
        if (item.checked && item.name !== 'Net Meter') accessoriesCost += (UNIT_PRICES.accessories[item.name] || 0) * item.qty;
    });

    document.getElementById('cost-panel').textContent = formatINR(panelCost);
    document.getElementById('cost-inverter').textContent = formatINR(inverterCost);
    document.getElementById('cost-structure').textContent = formatINR(structureCost);
    document.getElementById('cost-accessories').textContent = formatINR(accessoriesCost);

    const netMeterChecked = document.getElementById('f-netmeter').checked;
    document.getElementById('cost-netmeter').closest('tr').style.opacity = netMeterChecked ? '1' : '0.45';
}
['f-panelWattage', 'f-panelQty'].forEach(id => document.getElementById(id).addEventListener('input', computeCosts));
document.querySelectorAll('#accessories-list input').forEach(el => el.addEventListener('input', computeCosts));

function parseINR(str) { return Number(String(str).replace(/[₹,]/g, '')) || 0; }

function getCostTotalsFromForm() {
    const panel = parseINR(document.getElementById('cost-panel').textContent);
    const inverter = parseINR(document.getElementById('cost-inverter').textContent);
    const structure = parseINR(document.getElementById('cost-structure').textContent);
    const accessories = parseINR(document.getElementById('cost-accessories').textContent);
    const installation = parseFloat(document.getElementById('cost-installation').value) || 0;
    const transport = parseFloat(document.getElementById('cost-transport').value) || 0;
    const netmeter = document.getElementById('f-netmeter').checked ? (parseFloat(document.getElementById('cost-netmeter').value) || 0) : 0;
    const otherLabel = document.getElementById('cost-other-label').value || 'Other Charges';
    const other = parseFloat(document.getElementById('cost-other').value) || 0;
    return { panel, inverter, structure, accessories, installation, transport, netmeter, otherLabel, other };
}

/* ---------------- GST & Discount (Step 4) ---------------- */
function computeGstSummary() {
    const costs = getCostTotalsFromForm();
    const gstPercent = parseFloat(document.getElementById('f-gstPercent').value) || 0;
    const discountType = document.getElementById('f-discountType').value;
    const discountValue = parseFloat(document.getElementById('f-discountValue').value) || 0;
    const totals = computeTotals(costs, gstPercent, discountType, discountValue);

    document.getElementById('summary-gst').innerHTML = `
        <div class="row"><span>Sub Total</span><b>${formatINR(totals.subtotal)}</b></div>
        <div class="row"><span>Discount</span><b>- ${formatINR(totals.discountAmount)}</b></div>
        <div class="row"><span>SGST (${(gstPercent / 2).toFixed(1)}%)</span><b>${formatINR(totals.sgst)}</b></div>
        <div class="row"><span>CGST (${(gstPercent / 2).toFixed(1)}%)</span><b>${formatINR(totals.cgst)}</b></div>
        <div class="row total"><span>Total</span><b>${formatINR(totals.total)}</b></div>
    `;
    return { ...totals, gstPercent, costs };
}
['f-gstPercent', 'f-discountType', 'f-discountValue'].forEach(id => document.getElementById(id).addEventListener('input', computeGstSummary));

/* ---------------- Energy & Savings (Step 5) ---------------- */
function computeSavings() {
    const sizeKw = getSelectedSizeKw();
    const tariff = parseFloat(document.getElementById('f-tariff').value) || 0;
    const subsidy = parseFloat(document.getElementById('f-subsidy').value) || 0;
    const { total } = computeGstSummary();

    const annualUnits = sizeKw * 4 * 365;
    const annualSavings = annualUnits * tariff;
    const monthlySavings = annualSavings / 12;
    const finalPayable = Math.max(0, total - subsidy);

    document.getElementById('summary-savings').innerHTML = `
        <div class="row"><span>Estimated Annual Generation</span><b>${Math.round(annualUnits).toLocaleString('en-IN')} kWh</b></div>
        <div class="row"><span>Estimated Monthly Savings</span><b>${formatINR(monthlySavings)}</b></div>
        <div class="row"><span>Estimated Annual Savings</span><b>${formatINR(annualSavings)}</b></div>
        <div class="row"><span>Subsidy Applied</span><b>- ${formatINR(subsidy)}</b></div>
        <div class="row total"><span>Final Payable Amount</span><b>${formatINR(finalPayable)}</b></div>
    `;
}
['f-tariff', 'f-subsidy'].forEach(id => document.getElementById(id).addEventListener('input', computeSavings));

/* ---------------- Build draft record + render preview (Step 6) ---------------- */
function collectWizardRecord(quoteNo) {
    const costs = getCostTotalsFromForm();
    const gstPercent = parseFloat(document.getElementById('f-gstPercent').value) || 0;
    const discountType = document.getElementById('f-discountType').value;
    const discountValue = parseFloat(document.getElementById('f-discountValue').value) || 0;
    const totals = computeTotals(costs, gstPercent, discountType, discountValue);

    return {
        quoteNo,
        date: new Date().toISOString().slice(0, 10),
        status: 'Pending',
        customer: {
            name: document.getElementById('f-customerName').value.trim(),
            company: document.getElementById('f-companyName').value.trim(),
            mobile: document.getElementById('f-mobile').value.trim(),
            email: document.getElementById('f-email').value.trim(),
            address: document.getElementById('f-address').value.trim(),
            city: document.getElementById('f-city').value.trim(),
            state: document.getElementById('f-state').value,
            pincode: document.getElementById('f-pincode').value.trim(),
            consumerNo: document.getElementById('f-consumerNo').value.trim(),
            commercial: document.getElementById('f-commercial').checked,
            gst: document.getElementById('f-gst').value.trim()
        },
        systemSizeKw: getSelectedSizeKw(),
        systemSizeLabel: getSelectedSizeLabel(),
        panel: {
            brand: document.getElementById('f-panelBrand').value,
            model: document.getElementById('f-panelModel').value,
            wattage: parseFloat(document.getElementById('f-panelWattage').value) || 550,
            qty: parseFloat(document.getElementById('f-panelQty').value) || 0,
            warranty: document.getElementById('f-panelWarranty').value
        },
        inverter: {
            brand: document.getElementById('f-invBrand').value,
            capacity: document.getElementById('f-invCapacity').value,
            type: document.getElementById('f-invType').value,
            warranty: document.getElementById('f-invWarranty').value
        },
        mounting: document.querySelector('#mount-group input:checked')?.nextElementSibling?.textContent || 'RCC Roof',
        accessories: getAccessoriesFromForm(),
        costs,
        gstPercent, discountType, discountValue,
        tariff: parseFloat(document.getElementById('f-tariff').value) || 0,
        subsidy: parseFloat(document.getElementById('f-subsidy').value) || 0,
        advance: 0,
        ...totals,
        amount: Math.round(totals.total),
        balance: Math.round(totals.total)
    };
}

let draftQuoteNo = null;

function renderWizardPreview() {
    draftQuoteNo = draftQuoteNo || nextQuoteNo();
    const record = collectWizardRecord(draftQuoteNo);
    document.getElementById('invoice-preview').innerHTML = buildInvoiceMarkup(record);
}

document.getElementById('btn-generate').addEventListener('click', () => {
    const record = collectWizardRecord(draftQuoteNo || nextQuoteNo());
    quotations.unshift(record);
    draftQuoteNo = null;

    document.getElementById('share-grid').classList.remove('hidden');
    document.getElementById('btn-generate').classList.add('hidden');
    document.getElementById('invoice-preview').innerHTML = buildInvoiceMarkup(record);

    showToast(`Quotation ${record.quoteNo} generated successfully`, 'success');
    renderTable();

    setTimeout(() => {
        closeModal('modal-wizard');
    }, 900);
});

/* ---------------- Init ---------------- */
renderTable();