/* ===========================================================
   Purchase & Sales Record Module — JS
   Nested under Vendor Management. Demo data only (client-side).
   =========================================================== */

/* ---------- Company info (used as the "buyer" on purchase bills
   and the "seller" on sale invoices) — kept in sync with the
   Quotation module's COMPANY block ---------- */
const COMPANY = {
    name: 'SolarTech Renewables Pvt. Ltd.',
    address: '14, Industrial Estate Road, Pune, Maharashtra',
    phone: '+91 98765 43210',
    email: 'sales@solartechrenewables.in',
    gstin: '27ABCDE1234F1Z5',
    logo: '/img/logo.png'
};

/* ---------- Vendor directory (mirrors Vendor Management module) ---------- */
const vendors = [
    { id: 'V-001', name: 'SunTech Panels Pvt Ltd', phone: '9822011223', email: 'sales@suntechpanels.com', address: 'MIDC Bhosari, Pune', city: 'Pune', gst: '27ABCDE1234F1Z5' },
    { id: 'V-002', name: 'PowerCell Batteries', phone: '9765511220', email: 'contact@powercell.in', address: 'Ambad Industrial Area', city: 'Nashik', gst: '27PQRSX5678G1Z2' },
    { id: 'V-003', name: 'GridWave Inverters', phone: '9988112233', email: 'info@gridwave.co.in', address: 'Andheri MIDC', city: 'Mumbai', gst: '27LMNOQ9988H1Z9' },
    { id: 'V-004', name: 'SteelFrame Structures', phone: '9822334455', email: 'orders@steelframe.com', address: 'Shiroli MIDC', city: 'Kolhapur', gst: '27WXYZR3344K1Z6' },
    { id: 'V-005', name: 'WireLink Cables & Co.', phone: '9011223344', email: 'sales@wirelink.in', address: 'Chikalthana Industrial Area', city: 'Aurangabad', gst: '27ABWLK2211M1Z8' },
    { id: 'V-006', name: 'BrightRay Solar Panels', phone: '9765009988', email: 'hello@brightray.com', address: 'Hinjewadi Phase 2', city: 'Pune', gst: '27BRSP7766N1Z1' },
];

function itemsTotal(items) {
    return items.reduce((s, it) => s + it.qty * it.rate, 0);
}
function itemsGst(items) {
    return items.reduce((s, it) => s + (it.qty * it.rate * (it.gst || 0) / 100), 0);
}
function purchaseGrandTotal(p) {
    return itemsTotal(p.items) + itemsGst(p.items) + Number(p.otherCharges || 0);
}

/* ---------- Dummy Purchase data (what we bought from vendors) ---------- */
let purchases = [
    {
        id: 'PO-1001', vendorId: 'V-001', date: '2026-07-10', category: 'Solar Panels', paymentStatus: 'Paid', otherCharges: 1500, notes: 'Bulk order for July installs',
        items: [{ name: 'Monocrystalline Panel 550W', qty: 60, unit: 'Pcs', rate: 12500, gst: 12 }]
    },
    {
        id: 'PO-1002', vendorId: 'V-003', date: '2026-07-08', category: 'Inverters', paymentStatus: 'Partial', otherCharges: 800, notes: '',
        items: [{ name: 'String Inverter 5kW', qty: 10, unit: 'Unit', rate: 32000, gst: 18 }]
    },
    {
        id: 'PO-1003', vendorId: 'V-004', date: '2026-07-05', category: 'Mounting Structures', paymentStatus: 'Paid', otherCharges: 2200, notes: '',
        items: [{ name: 'RCC Roof Mounting Structure', qty: 120, unit: 'Panel', rate: 850, gst: 18 }]
    },
    {
        id: 'PO-1004', vendorId: 'V-005', date: '2026-07-02', category: 'Cables & Accessories', paymentStatus: 'Unpaid', otherCharges: 400, notes: 'Awaiting GST invoice from vendor',
        items: [
            { name: 'DC Cable 6 sq mm', qty: 500, unit: 'Mtr', rate: 42, gst: 18 },
            { name: 'AC Cable 4 sq mm', qty: 300, unit: 'Mtr', rate: 55, gst: 18 }
        ]
    },
    {
        id: 'PO-1005', vendorId: 'V-004', date: '2026-06-28', category: 'Mounting Structures', paymentStatus: 'Partial', otherCharges: 1000, notes: '',
        items: [{ name: 'Elevated Structure Kit', qty: 25, unit: 'Set', rate: 4200, gst: 18 }]
    },
    {
        id: 'PO-1006', vendorId: 'V-002', date: '2026-06-20', category: 'Batteries', paymentStatus: 'Paid', otherCharges: 0, notes: '',
        items: [{ name: 'Lithium Battery 5kWh', qty: 8, unit: 'Unit', rate: 68000, gst: 18 }]
    },
];

/* ---------- Dummy Sales data (what was sold to customers) ----------
   In production this list would be sourced live from accepted
   Quotations; kept as an editable local record here so a sale can
   also be logged directly (e.g. a counter/cash sale). ---------- */
let sales = [
    { id: 'SL-2001', customer: 'Amit Sharma', item: '3 kW Rooftop Solar System', qty: 1, amount: 165000, date: '2026-07-15', status: 'Pending', quoteNo: 'SQ-1001' },
    { id: 'SL-2002', customer: 'Priya Enterprises', item: '10 kW Commercial Solar System', qty: 1, amount: 540000, date: '2026-07-14', status: 'Accepted', quoteNo: 'SQ-1000' },
    { id: 'SL-2003', customer: 'Ravi Constructions', item: '5 kW Rooftop Solar System', qty: 1, amount: 275000, date: '2026-07-14', status: 'Rejected', quoteNo: 'SQ-0999' },
    { id: 'SL-2004', customer: 'Meena Textiles', item: '25 kW Industrial Solar System', qty: 1, amount: 1320000, date: '2026-07-13', status: 'Delivered', quoteNo: 'SQ-0998' },
    { id: 'SL-2005', customer: 'Sunrise Apartments', item: '15 kW GHS Solar System', qty: 1, amount: 795000, date: '2026-07-10', status: 'Accepted', quoteNo: 'SQ-0993' },
    { id: 'SL-2006', customer: 'Kavita Rao', item: '3 kW Rooftop Solar System', qty: 1, amount: 162000, date: '2026-07-08', status: 'Delivered', quoteNo: 'SQ-0991' },
];

const STATUS_OPTIONS = {
    purchase: ['Paid', 'Partial', 'Unpaid'],
    sale: ['Accepted', 'Pending', 'Delivered', 'Rejected']
};

/* ---------- State ---------- */
let activeTab = 'purchase';
let state = { search: '', status: '', page: 1, pageSize: 10 };

function formatINR(n) { return '₹' + Math.round(Number(n) || 0).toLocaleString('en-IN'); }
function formatDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function vendorById(id) { return vendors.find(v => v.id === id); }
function pillClassPurchase(s) { return { Paid: 'pill-paid', Partial: 'pill-partial', Unpaid: 'pill-unpaid' }[s] || 'pill-partial'; }
function pillClassSale(s) { return { Accepted: 'pill-accepted', Pending: 'pill-pending', Rejected: 'pill-rejected', Delivered: 'pill-delivered' }[s] || 'pill-pending'; }

/* ===========================================================
   Tabs
   =========================================================== */
document.querySelectorAll('.record-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        activeTab = tab.getAttribute('data-tab');
        document.querySelectorAll('.record-tab').forEach(t => t.classList.toggle('active', t === tab));
        state.search = ''; state.status = ''; state.page = 1;
        document.getElementById('searchInput').value = '';
        refreshStatusFilterOptions();
        document.getElementById('addRecordBtnLabel').textContent = activeTab === 'purchase' ? 'Add Purchase' : 'Add Sale';
        renderTableHead();
        renderTable();
    });
});

function refreshStatusFilterOptions() {
    const sel = document.getElementById('statusFilter');
    const opts = STATUS_OPTIONS[activeTab];
    sel.innerHTML = `<option value="">All Status</option>` + opts.map(o => `<option value="${o}">${o}</option>`).join('');
}

function renderTableHead() {
    const row = document.getElementById('tableHeadRow');
    if (activeTab === 'purchase') {
        row.innerHTML = `
            <th data-sort="id">PO No. <i class="fas fa-sort sort-ic"></i></th>
            <th data-sort="vendor">Vendor <i class="fas fa-sort sort-ic"></i></th>
            <th>Items</th>
            <th data-sort="amount">Amount <i class="fas fa-sort sort-ic"></i></th>
            <th data-sort="paymentStatus">Payment <i class="fas fa-sort sort-ic"></i></th>
            <th data-sort="date">Date <i class="fas fa-sort sort-ic"></i></th>
            <th class="text-right">Actions</th>`;
    } else {
        row.innerHTML = `
            <th data-sort="id">Invoice No. <i class="fas fa-sort sort-ic"></i></th>
            <th data-sort="customer">Customer <i class="fas fa-sort sort-ic"></i></th>
            <th>Item</th>
            <th data-sort="amount">Amount <i class="fas fa-sort sort-ic"></i></th>
            <th data-sort="status">Status <i class="fas fa-sort sort-ic"></i></th>
            <th data-sort="date">Date <i class="fas fa-sort sort-ic"></i></th>
            <th class="text-right">Actions</th>`;
    }
    wireSortHeaders();
}

let sortKey = 'date', sortDir = 'desc';
function wireSortHeaders() {
    document.querySelectorAll('[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const key = th.getAttribute('data-sort');
            if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
            else { sortKey = key; sortDir = 'asc'; }
            renderTable();
        });
    });
}

/* ===========================================================
   Filtering / sorting / stats
   =========================================================== */
function getRows() {
    if (activeTab === 'purchase') {
        return purchases.map(p => ({
            ...p,
            vendor: (vendorById(p.vendorId) || {}).name || 'Unknown Vendor',
            amount: purchaseGrandTotal(p),
            itemsSummary: p.items.map(it => it.name).join(', ')
        }));
    }
    return sales.map(s => ({ ...s }));
}

function getFiltered() {
    let rows = getRows();
    rows = rows.filter(r => {
        const haystack = activeTab === 'purchase'
            ? (r.id + r.vendor + r.itemsSummary).toLowerCase()
            : (r.id + r.customer + r.item).toLowerCase();
        const matchesSearch = !state.search || haystack.includes(state.search.toLowerCase());
        const statusVal = activeTab === 'purchase' ? r.paymentStatus : r.status;
        const matchesStatus = !state.status || statusVal === state.status;
        return matchesSearch && matchesStatus;
    });
    rows.sort((a, b) => {
        let av = a[sortKey], bv = b[sortKey];
        if (sortKey === 'date') { av = new Date(av).getTime(); bv = new Date(bv).getTime(); }
        else if (sortKey === 'amount') { /* numeric */ }
        else { av = String(av ?? '').toLowerCase(); bv = String(bv ?? '').toLowerCase(); }
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ? 1 : -1;
        return 0;
    });
    return rows;
}

function renderStats() {
    document.getElementById('statTotalPurchases').textContent = purchases.length;
    document.getElementById('statPurchaseValue').textContent = formatINR(purchases.reduce((s, p) => s + purchaseGrandTotal(p), 0));
    document.getElementById('statTotalSales').textContent = sales.length;
    document.getElementById('statSalesValue').textContent = formatINR(sales.reduce((s, r) => s + Number(r.amount || 0), 0));
    document.getElementById('tabCountPurchase').textContent = purchases.length;
    document.getElementById('tabCountSale').textContent = sales.length;
}

/* ===========================================================
   Table render
   =========================================================== */
function actionIconsHtml(id) {
    const editAction = activeTab === 'purchase' ? 'editPurchase' : 'editSale';
    return `
        <div class="icon-row" onclick="event.stopPropagation()">
            <button class="icon-btn-tip" data-tooltip="View Invoice" onclick="viewInvoice('${activeTab}','${id}')"><i class="fas fa-eye"></i></button>
            <button class="icon-btn-tip" data-tooltip="Edit" onclick="${editAction}('${id}')"><i class="fas fa-pen"></i></button>
            <button class="icon-btn-tip" data-tooltip="Download PDF" onclick="downloadInvoiceDirect('${activeTab}','${id}')"><i class="fas fa-download"></i></button>
            <button class="icon-btn-tip danger" data-tooltip="Delete" onclick="askDelete('${activeTab}','${id}')"><i class="fas fa-trash"></i></button>
        </div>`;
}

function renderTable() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.pageSize;
    const pageRows = filtered.slice(start, start + state.pageSize);

    const tbody = document.getElementById('tableBody');
    const emptyState = document.getElementById('emptyState');

    if (pageRows.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        if (activeTab === 'purchase') {
            tbody.innerHTML = pageRows.map(r => `
                <tr data-id="${r.id}">
                    <td><span class="font-semibold">${r.id}</span></td>
                    <td>${r.vendor}</td>
                    <td class="text-[#4B5694]" style="max-width:220px;">${escapeHtml(r.itemsSummary)}</td>
                    <td class="font-semibold">${formatINR(r.amount)}</td>
                    <td><span class="pill ${pillClassPurchase(r.paymentStatus)}">${r.paymentStatus}</span></td>
                    <td>${formatDate(r.date)}</td>
                    <td class="text-right">${actionIconsHtml(r.id)}</td>
                </tr>`).join('');
        } else {
            tbody.innerHTML = pageRows.map(r => `
                <tr data-id="${r.id}">
                    <td><span class="font-semibold">${r.id}</span></td>
                    <td>${r.customer}</td>
                    <td class="text-[#4B5694]">${escapeHtml(r.item)}</td>
                    <td class="font-semibold">${formatINR(r.amount)}</td>
                    <td><span class="pill ${pillClassSale(r.status)}">${r.status}</span></td>
                    <td>${formatDate(r.date)}</td>
                    <td class="text-right">${actionIconsHtml(r.id)}</td>
                </tr>`).join('');
        }
        tbody.querySelectorAll('tr').forEach(tr => tr.addEventListener('click', () => viewInvoice(activeTab, tr.getAttribute('data-id'))));
    }

    document.getElementById('pageInfo').textContent = `· ${filtered.length} result${filtered.length !== 1 ? 's' : ''}`;
    renderPagination(totalPages);
    renderStats();
}

function renderPagination(totalPages) {
    const el = document.getElementById('pagination');
    let html = `<button class="page-btn" ${state.page === 1 ? 'disabled' : ''} onclick="gotoPage(${state.page - 1})"><i class="fas fa-chevron-left text-[10px]"></i></button>`;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || Math.abs(i - state.page) <= 1) {
            html += `<button class="page-btn ${i === state.page ? 'active' : ''}" onclick="gotoPage(${i})">${i}</button>`;
        } else if (Math.abs(i - state.page) === 2) {
            html += `<span class="text-[#7288AE] text-xs px-1">…</span>`;
        }
    }
    html += `<button class="page-btn" ${state.page === totalPages ? 'disabled' : ''} onclick="gotoPage(${state.page + 1})"><i class="fas fa-chevron-right text-[10px]"></i></button>`;
    el.innerHTML = html;
}
function gotoPage(p) { state.page = p; renderTable(); }

function escapeHtml(str) {
    return String(str ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/* ---------- Filters ---------- */
document.getElementById('searchInput').addEventListener('input', e => { state.search = e.target.value; state.page = 1; renderTable(); });
document.getElementById('statusFilter').addEventListener('change', e => { state.status = e.target.value; state.page = 1; renderTable(); });
document.getElementById('pageSizeSelect').addEventListener('change', e => { state.pageSize = Number(e.target.value); state.page = 1; renderTable(); });

/* ===========================================================
   Modal helpers
   =========================================================== */
function openModal(id) { document.getElementById(id).classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); document.body.style.overflow = ''; }
document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => { btn.closest('.modal-overlay').classList.add('hidden'); document.body.style.overflow = ''; }));
document.querySelectorAll('.modal-overlay').forEach(ov => ov.addEventListener('click', e => { if (e.target === ov) { ov.classList.add('hidden'); document.body.style.overflow = ''; } }));
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('.modal-overlay:not(.hidden)').forEach(ov => { ov.classList.add('hidden'); document.body.style.overflow = ''; });
});

/* ===========================================================
   Add / Edit Purchase
   =========================================================== */
const purchaseForm = document.getElementById('purchaseForm');
const pItemsTbody = document.getElementById('pItemsTbody');
let purchaseItemIdSeq = 1;
let currentPurchaseItems = [];

function populateVendorSelect() {
    const sel = document.getElementById('pVendor');
    sel.innerHTML = `<option value="">Select vendor</option>` + vendors.map(v => `<option value="${v.id}">${v.name}</option>`).join('');
}

function blankItem() { return { rowId: 'r' + (purchaseItemIdSeq++), name: '', qty: 1, unit: 'Pcs', rate: 0, gst: 18 }; }

function renderPurchaseItemsTable() {
    pItemsTbody.innerHTML = currentPurchaseItems.map(it => `
        <tr data-row="${it.rowId}">
            <td><input type="text" class="it-name" value="${escapeHtml(it.name)}" placeholder="Item name" /></td>
            <td><input type="number" class="it-qty" min="0.01" step="any" value="${it.qty}" /></td>
            <td><input type="text" class="it-unit" value="${escapeHtml(it.unit)}" /></td>
            <td><input type="number" class="it-rate" min="0" step="any" value="${it.rate}" /></td>
            <td><input type="number" class="it-gst" min="0" max="28" step="any" value="${it.gst}" /></td>
            <td class="item-total-cell">${formatINR(it.qty * it.rate)}</td>
            <td><button type="button" class="item-remove-btn" onclick="removePurchaseItemRow('${it.rowId}')"><i class="fas fa-xmark"></i></button></td>
        </tr>`).join('');

    pItemsTbody.querySelectorAll('tr').forEach(tr => {
        const rowId = tr.getAttribute('data-row');
        const item = currentPurchaseItems.find(i => i.rowId === rowId);
        tr.querySelector('.it-name').addEventListener('input', e => { item.name = e.target.value; });
        tr.querySelector('.it-unit').addEventListener('input', e => { item.unit = e.target.value; });
        tr.querySelector('.it-qty').addEventListener('input', e => { item.qty = parseFloat(e.target.value) || 0; updateRowTotal(tr, item); updatePurchaseTotalsBox(); });
        tr.querySelector('.it-rate').addEventListener('input', e => { item.rate = parseFloat(e.target.value) || 0; updateRowTotal(tr, item); updatePurchaseTotalsBox(); });
        tr.querySelector('.it-gst').addEventListener('input', e => { item.gst = parseFloat(e.target.value) || 0; updatePurchaseTotalsBox(); });
    });
    updatePurchaseTotalsBox();
}
function updateRowTotal(tr, item) { tr.querySelector('.item-total-cell').textContent = formatINR(item.qty * item.rate); }

function removePurchaseItemRow(rowId) {
    currentPurchaseItems = currentPurchaseItems.filter(i => i.rowId !== rowId);
    renderPurchaseItemsTable();
}

document.getElementById('pAddItemRow').addEventListener('click', () => {
    currentPurchaseItems.push(blankItem());
    renderPurchaseItemsTable();
});

function updatePurchaseTotalsBox() {
    const sub = itemsTotal(currentPurchaseItems);
    const gst = itemsGst(currentPurchaseItems);
    const other = parseFloat(document.getElementById('pOtherCharges').value) || 0;
    const grand = sub + gst + other;
    document.getElementById('purchaseTotalsBox').innerHTML = `
        <div class="row"><span>Items Subtotal</span><span>${formatINR(sub)}</span></div>
        <div class="row"><span>GST</span><span>${formatINR(gst)}</span></div>
        <div class="row"><span>Transport / Other Charges</span><span>${formatINR(other)}</span></div>
        <div class="row grand"><span>Grand Total</span><span>${formatINR(grand)}</span></div>`;
}
document.getElementById('pOtherCharges').addEventListener('input', updatePurchaseTotalsBox);

document.getElementById('addRecordBtn').addEventListener('click', () => {
    if (activeTab === 'purchase') openAddPurchase();
    else openAddSale();
});

function openAddPurchase() {
    purchaseForm.reset();
    document.getElementById('pId').value = '';
    document.getElementById('purchaseModalTitle').textContent = 'Add Purchase';
    document.getElementById('pDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('pOtherCharges').value = 0;
    populateVendorSelect();
    currentPurchaseItems = [blankItem()];
    clearFieldError('pVendor', 'err-pVendor');
    clearFieldError(null, 'err-pItems');
    renderPurchaseItemsTable();
    openModal('purchaseModal');
}

function editPurchase(id) {
    const p = purchases.find(x => x.id === id);
    if (!p) return;
    populateVendorSelect();
    document.getElementById('purchaseModalTitle').textContent = `Edit Purchase — ${p.id}`;
    document.getElementById('pId').value = p.id;
    document.getElementById('pVendor').value = p.vendorId;
    document.getElementById('pDate').value = p.date;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pPaymentStatus').value = p.paymentStatus;
    document.getElementById('pOtherCharges').value = p.otherCharges;
    document.getElementById('pNotes').value = p.notes || '';
    currentPurchaseItems = p.items.map(it => ({ rowId: 'r' + (purchaseItemIdSeq++), ...it }));
    renderPurchaseItemsTable();
    openModal('purchaseModal');
}

function clearFieldError(fieldId, errId) {
    if (fieldId) document.getElementById(fieldId).classList.remove('field-error');
    if (errId) document.getElementById(errId).textContent = '';
}
function setFieldError(fieldId, errId, message) {
    if (fieldId) document.getElementById(fieldId).classList.add('field-error');
    if (errId) document.getElementById(errId).textContent = message;
}

purchaseForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const vendorId = document.getElementById('pVendor').value;
    if (!vendorId) { setFieldError('pVendor', 'err-pVendor', 'Please select a vendor'); valid = false; }
    else clearFieldError('pVendor', 'err-pVendor');

    const cleanItems = currentPurchaseItems.filter(i => i.name.trim() && i.qty > 0);
    if (cleanItems.length === 0) { setFieldError(null, 'err-pItems', 'Add at least one valid item (name + quantity)'); valid = false; }
    else clearFieldError(null, 'err-pItems');

    if (!valid) { showToast('error', 'Please fix the highlighted fields'); return; }

    const id = document.getElementById('pId').value;
    const payload = {
        vendorId,
        date: document.getElementById('pDate').value,
        category: document.getElementById('pCategory').value,
        paymentStatus: document.getElementById('pPaymentStatus').value,
        otherCharges: parseFloat(document.getElementById('pOtherCharges').value) || 0,
        notes: document.getElementById('pNotes').value,
        items: cleanItems.map(({ rowId, ...rest }) => rest)
    };

    if (id) {
        const idx = purchases.findIndex(p => p.id === id);
        purchases[idx] = { ...purchases[idx], ...payload };
        showToast('success', `${id} updated`);
    } else {
        const newId = nextPurchaseId();
        purchases.unshift({ id: newId, ...payload });
        showToast('success', `${newId} added successfully`);
    }
    closeModal('purchaseModal');
    if (activeTab === 'purchase') renderTable(); else renderStats();
});

function nextPurchaseId() {
    const nums = purchases.map(p => Number(String(p.id).split('-')[1]) || 0);
    return 'PO-' + String(Math.max(...nums, 1000) + 1);
}

/* ===========================================================
   Add / Edit Sale
   =========================================================== */
const saleForm = document.getElementById('saleForm');

function openAddSale() {
    saleForm.reset();
    document.getElementById('sId').value = '';
    document.getElementById('saleModalTitle').textContent = 'Add Sale';
    document.getElementById('sDate').value = new Date().toISOString().slice(0, 10);
    document.getElementById('sQty').value = 1;
    document.getElementById('sStatus').value = 'Pending';
    openModal('saleModal');
}

function editSale(id) {
    const s = sales.find(x => x.id === id);
    if (!s) return;
    document.getElementById('saleModalTitle').textContent = `Edit Sale — ${s.id}`;
    document.getElementById('sId').value = s.id;
    document.getElementById('sCustomer').value = s.customer;
    document.getElementById('sItem').value = s.item;
    document.getElementById('sQty').value = s.qty;
    document.getElementById('sAmount').value = s.amount;
    document.getElementById('sDate').value = s.date;
    document.getElementById('sStatus').value = s.status;
    document.getElementById('sQuoteNo').value = s.quoteNo || '';
    openModal('saleModal');
}

saleForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('sId').value;
    const payload = {
        customer: document.getElementById('sCustomer').value.trim(),
        item: document.getElementById('sItem').value.trim(),
        qty: parseFloat(document.getElementById('sQty').value) || 1,
        amount: parseFloat(document.getElementById('sAmount').value) || 0,
        date: document.getElementById('sDate').value,
        status: document.getElementById('sStatus').value,
        quoteNo: document.getElementById('sQuoteNo').value.trim()
    };
    if (!payload.customer || !payload.item || !payload.amount) {
        showToast('error', 'Please fill all required fields');
        return;
    }
    if (id) {
        const idx = sales.findIndex(s => s.id === id);
        sales[idx] = { ...sales[idx], ...payload };
        showToast('success', `${id} updated`);
    } else {
        const newId = nextSaleId();
        sales.unshift({ id: newId, ...payload });
        showToast('success', `${newId} added successfully`);
    }
    closeModal('saleModal');
    if (activeTab === 'sale') renderTable(); else renderStats();
});

function nextSaleId() {
    const nums = sales.map(s => Number(String(s.id).split('-')[1]) || 0);
    return 'SL-' + String(Math.max(...nums, 2000) + 1);
}

/* ===========================================================
   Invoice / Bill preview + PDF/print
   =========================================================== */
function buildPurchaseInvoiceHtml(p) {
    const vendor = vendorById(p.vendorId) || {};
    const sub = itemsTotal(p.items);
    const gst = itemsGst(p.items);
    const grand = sub + gst + Number(p.otherCharges || 0);
    return `
    <div class="invoice-doc" id="invoiceDocInner">
        <div class="invoice-doc-head">
            <div>
                <img src="${COMPANY.logo}" alt="logo" />
                <div class="company-name">${COMPANY.name}</div>
                <div class="company-meta">${COMPANY.address}<br>${COMPANY.phone} · ${COMPANY.email}<br>GSTIN: ${COMPANY.gstin}</div>
            </div>
            <div class="doc-tag">
                <div class="doc-title">Purchase Bill</div>
                <div class="doc-no">${p.id}</div>
                <div class="doc-no">${formatDate(p.date)}</div>
                <span class="invoice-status-badge pill ${pillClassPurchase(p.paymentStatus)}">${p.paymentStatus}</span>
            </div>
        </div>
        <div class="invoice-parties">
            <div>
                <div class="party-label">Billed From (Vendor)</div>
                <div class="party-name">${vendor.name || '—'}</div>
                <div class="party-detail">${vendor.address || ''}, ${vendor.city || ''}<br>${vendor.phone || ''} · ${vendor.email || ''}<br>GSTIN: ${vendor.gst || '—'}</div>
            </div>
            <div>
                <div class="party-label">Billed To</div>
                <div class="party-name">${COMPANY.name}</div>
                <div class="party-detail">${COMPANY.address}<br>GSTIN: ${COMPANY.gstin}</div>
            </div>
        </div>
        <table class="invoice-items">
            <thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th class="num">Rate</th><th class="num">GST%</th><th class="num">Amount</th></tr></thead>
            <tbody>
                ${p.items.map(it => `<tr><td>${escapeHtml(it.name)}</td><td>${it.qty}</td><td>${escapeHtml(it.unit)}</td><td class="num">${formatINR(it.rate)}</td><td class="num">${it.gst}%</td><td class="num">${formatINR(it.qty * it.rate)}</td></tr>`).join('')}
            </tbody>
        </table>
        <div class="invoice-totals">
            <div class="row"><span>Items Subtotal</span><span>${formatINR(sub)}</span></div>
            <div class="row"><span>GST</span><span>${formatINR(gst)}</span></div>
            <div class="row"><span>Transport / Other Charges</span><span>${formatINR(p.otherCharges || 0)}</span></div>
            <div class="row grand"><span>Grand Total</span><span>${formatINR(grand)}</span></div>
        </div>
        <div class="invoice-footer">
            <div class="invoice-note">${p.notes ? `Note: ${escapeHtml(p.notes)}<br>` : ''}Generated on ${new Date().toLocaleString('en-IN')} · This is a system-generated purchase record.</div>
            <div class="invoice-sign"><div class="sign-line">Authorized Signature</div></div>
        </div>
    </div>`;
}

function buildSaleInvoiceHtml(s) {
    const rate = s.qty ? s.amount / s.qty : s.amount;
    return `
    <div class="invoice-doc" id="invoiceDocInner">
        <div class="invoice-doc-head">
            <div>
                <img src="${COMPANY.logo}" alt="logo" />
                <div class="company-name">${COMPANY.name}</div>
                <div class="company-meta">${COMPANY.address}<br>${COMPANY.phone} · ${COMPANY.email}<br>GSTIN: ${COMPANY.gstin}</div>
            </div>
            <div class="doc-tag">
                <div class="doc-title">Tax Invoice</div>
                <div class="doc-no">${s.id}</div>
                <div class="doc-no">${formatDate(s.date)}</div>
                <span class="invoice-status-badge pill ${pillClassSale(s.status)}">${s.status}</span>
            </div>
        </div>
        <div class="invoice-parties">
            <div>
                <div class="party-label">Billed From (Seller)</div>
                <div class="party-name">${COMPANY.name}</div>
                <div class="party-detail">${COMPANY.address}<br>GSTIN: ${COMPANY.gstin}</div>
            </div>
            <div>
                <div class="party-label">Billed To (Customer)</div>
                <div class="party-name">${s.customer}</div>
                <div class="party-detail">${s.quoteNo ? `Ref. Quotation: ${s.quoteNo}` : 'Direct Sale'}</div>
            </div>
        </div>
        <table class="invoice-items">
            <thead><tr><th>Description</th><th>Qty</th><th class="num">Rate</th><th class="num">Amount</th></tr></thead>
            <tbody>
                <tr><td>${escapeHtml(s.item)}</td><td>${s.qty}</td><td class="num">${formatINR(rate)}</td><td class="num">${formatINR(s.amount)}</td></tr>
            </tbody>
        </table>
        <div class="invoice-totals">
            <div class="row grand"><span>Grand Total</span><span>${formatINR(s.amount)}</span></div>
        </div>
        <div class="invoice-footer">
            <div class="invoice-note">Generated on ${new Date().toLocaleString('en-IN')} · This is a system-generated sales record.</div>
            <div class="invoice-sign"><div class="sign-line">Authorized Signature</div></div>
        </div>
    </div>`;
}

let currentInvoiceContext = null; // { type, id }

function viewInvoice(type, id) {
    const record = type === 'purchase' ? purchases.find(p => p.id === id) : sales.find(s => s.id === id);
    if (!record) return;
    currentInvoiceContext = { type, id };
    document.getElementById('invoiceModalTitle').textContent = type === 'purchase' ? `Purchase Bill — ${id}` : `Sales Invoice — ${id}`;
    document.getElementById('invoicePreview').innerHTML = type === 'purchase' ? buildPurchaseInvoiceHtml(record) : buildSaleInvoiceHtml(record);
    openModal('invoiceModal');
}

document.getElementById('btnPrintInvoice').addEventListener('click', () => window.print());

document.getElementById('btnDownloadInvoice').addEventListener('click', () => {
    if (!currentInvoiceContext) return;
    downloadInvoiceDirect(currentInvoiceContext.type, currentInvoiceContext.id);
});

function downloadInvoiceDirect(type, id) {
    const record = type === 'purchase' ? purchases.find(p => p.id === id) : sales.find(s => s.id === id);
    if (!record) return;
    if (!window.html2pdf) { showToast('error', 'PDF library failed to load — check your connection'); return; }

    const wrapper = document.createElement('div');
    wrapper.style.width = '760px';
    wrapper.innerHTML = type === 'purchase' ? buildPurchaseInvoiceHtml(record) : buildSaleInvoiceHtml(record);
    document.body.appendChild(wrapper);

    html2pdf().set({
        margin: 10,
        filename: `${id}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    }).from(wrapper).save().then(() => {
        document.body.removeChild(wrapper);
        showToast('success', `Downloaded ${id}.pdf`);
    }).catch(() => {
        document.body.removeChild(wrapper);
        showToast('error', 'Could not generate PDF');
    });
}

/* ===========================================================
   Delete
   =========================================================== */
let pendingDelete = null; // { type, id }
function askDelete(type, id) { pendingDelete = { type, id }; openModal('deleteModal'); }
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === 'purchase') purchases = purchases.filter(p => p.id !== pendingDelete.id);
    else sales = sales.filter(s => s.id !== pendingDelete.id);
    closeModal('deleteModal');
    renderTable();
    showToast('success', `${pendingDelete.id} deleted`);
    pendingDelete = null;
});

/* ===========================================================
   Toast
   =========================================================== */
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-circle-check text-emerald-600', error: 'fa-circle-xmark text-red-600', info: 'fa-circle-info text-[#4B5694]' };
    const el = document.createElement('div');
    el.className = `toast ${type} toast-animate`;
    el.innerHTML = `<i class="fas ${icons[type]} mt-0.5"></i><span class="text-[#111844]">${message}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

/* ===========================================================
   Sidebar / Topbar (shared behaviour, matches other modules)
   =========================================================== */
let isCollapsed = false;
const sidebar = document.getElementById('sidebar');
const mainWrapper = document.getElementById('main-wrapper');
const sidebarToggle = document.getElementById('sidebar-toggle');
const overlay = document.getElementById('sidebar-overlay');

sidebarToggle?.addEventListener('click', () => {
    if (window.innerWidth < 1024) {
        sidebar.classList.toggle('sidebar-open');
        overlay?.classList.toggle('hidden');
    } else {
        isCollapsed = !isCollapsed;
        sidebar.classList.toggle('sidebar-collapsed', isCollapsed);
        mainWrapper.classList.toggle('main-expanded', isCollapsed);
    }
});
document.getElementById('mobile-sidebar-btn')?.addEventListener('click', () => {
    sidebar.classList.toggle('sidebar-open');
    overlay?.classList.toggle('hidden');
});
overlay?.addEventListener('click', () => { sidebar?.classList.remove('sidebar-open'); overlay.classList.add('hidden'); });

const userBtn = document.getElementById('user-menu-btn');
const userMenu = document.getElementById('user-menu');
userBtn?.addEventListener('click', e => { e.stopPropagation(); userMenu.classList.toggle('hidden'); });

const notifBtn = document.getElementById('notif-btn');
const notifMenu = document.getElementById('notif-menu');
notifBtn?.addEventListener('click', e => { e.stopPropagation(); notifMenu.classList.toggle('hidden'); userMenu?.classList.add('hidden'); });

document.addEventListener('click', e => {
    if (!userBtn?.contains(e.target) && !userMenu?.contains(e.target)) userMenu?.classList.add('hidden');
    if (!notifBtn?.contains(e.target) && !notifMenu?.contains(e.target)) notifMenu?.classList.add('hidden');
});

/* ===========================================================
   Init
   =========================================================== */
refreshStatusFilterOptions();
renderTableHead();
renderTable();
