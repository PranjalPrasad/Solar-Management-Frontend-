/* ===========================================================
   Vendor Management Module — JS
   =========================================================== */

/* ---------- Sample data (replace with API calls) ---------- */
let vendors = [
    { id: 'V-001', name: 'SunTech Panels Pvt Ltd', contact: 'Rajesh Mehta', phone: '9822011223', email: 'sales@suntechpanels.com', city: 'Pune', address: 'MIDC Bhosari, Pune', category: 'Solar Panels', gst: '27ABCDE1234F1Z5', status: 'Active', notes: '' },
    { id: 'V-002', name: 'PowerCell Batteries', contact: 'Anjali Deshmukh', phone: '9765511220', email: 'contact@powercell.in', city: 'Nashik', address: 'Ambad Industrial Area', category: 'Batteries', gst: '27PQRSX5678G1Z2', status: 'Active', notes: '' },
    { id: 'V-003', name: 'GridWave Inverters', contact: 'Suresh Iyer', phone: '9988112233', email: 'info@gridwave.co.in', city: 'Mumbai', address: 'Andheri MIDC', category: 'Inverters', gst: '27LMNOQ9988H1Z9', status: 'Inactive', notes: 'GST verification pending' },
    { id: 'V-004', name: 'SteelFrame Structures', contact: 'Vikram Rane', phone: '9822334455', email: 'orders@steelframe.com', city: 'Kolhapur', address: 'Shiroli MIDC', category: 'Mounting Structures', gst: '27WXYZR3344K1Z6', status: 'Active', notes: '' },
    { id: 'V-005', name: 'WireLink Cables & Co.', contact: 'Farhan Shaikh', phone: '9011223344', email: 'sales@wirelink.in', city: 'Aurangabad', address: 'Chikalthana Industrial Area', category: 'Cables & Accessories', gst: '27ABWLK2211M1Z8', status: 'Active', notes: '' },
    { id: 'V-006', name: 'BrightRay Solar Panels', contact: 'Neha Kulkarni', phone: '9765009988', email: 'hello@brightray.com', city: 'Pune', address: 'Hinjewadi Phase 2', category: 'Solar Panels', gst: '27BRSP7766N1Z1', status: 'Inactive', notes: '' },
];

/* ---------- State ---------- */
let state = { search: '', category: '', status: '', sortKey: 'name', sortDir: 'asc', page: 1, pageSize: 10 };

function pillClass(status) { return status === 'Active' ? 'pill-active' : 'pill-inactive'; }
function initials(name) { return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase(); }

/* ---------- Rendering ---------- */
function getFiltered() {
    let rows = vendors.filter(v => {
        const haystack = (v.name + v.contact + v.city).toLowerCase();
        const matchesSearch = !state.search || haystack.includes(state.search.toLowerCase());
        const matchesCategory = !state.category || v.category === state.category;
        const matchesStatus = !state.status || v.status === state.status;
        return matchesSearch && matchesCategory && matchesStatus;
    });
    rows.sort((a, b) => {
        let av = a[state.sortKey], bv = b[state.sortKey];
        if (typeof av === 'string') { av = av.toLowerCase(); bv = bv.toLowerCase(); }
        if (av < bv) return state.sortDir === 'asc' ? -1 : 1;
        if (av > bv) return state.sortDir === 'asc' ? 1 : -1;
        return 0;
    });
    return rows;
}

function renderStats() {
    document.getElementById('statTotal').textContent = vendors.length;
    document.getElementById('statActive').textContent = vendors.filter(v => v.status === 'Active').length;
    document.getElementById('statInactive').textContent = vendors.filter(v => v.status === 'Inactive').length;
    document.getElementById('statCategories').textContent = new Set(vendors.map(v => v.category)).size;
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
        tbody.innerHTML = pageRows.map(v => `
            <tr data-id="${v.id}">
                <td>
                    <div class="flex items-center gap-2.5">
                        <div class="avatar-circle">${initials(v.name)}</div>
                        <div>
                            <div class="font-semibold">${v.name}</div>
                            <div class="text-[10px] text-[#7288AE]">${v.id}</div>
                        </div>
                    </div>
                </td>
                <td>${v.contact}</td>
                <td>
                    <div>${v.phone}</div>
                    <div class="text-[10px] text-[#7288AE]">${v.email || '—'}</div>
                </td>
                <td><span class="tag">${v.category}</span></td>
                <td>${v.city}</td>
                <td><span class="pill ${pillClass(v.status)}">${v.status}</span></td>
                <td class="text-right" onclick="event.stopPropagation()">
                    <div class="row-actions inline-block">
                        <button class="w-8 h-8 rounded-lg hover:bg-[#4B5694]/10 text-[#4B5694]" onclick="toggleActionMenu(event, '${v.id}')">
                            <i class="fas fa-ellipsis-vertical"></i>
                        </button>
                        <div class="action-menu hidden" id="menu-${v.id}">
                            <button onclick="viewVendor('${v.id}')"><i class="fas fa-eye w-4"></i> View</button>
                            <button onclick="editVendor('${v.id}')"><i class="fas fa-pen w-4"></i> Edit</button>
                            <button onclick="toggleStatus('${v.id}')"><i class="fas fa-power-off w-4"></i> Toggle Status</button>
                            <div class="divider"></div>
                            <button class="danger" onclick="askDelete('${v.id}')"><i class="fas fa-trash w-4"></i> Delete</button>
                        </div>
                    </div>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('tr').forEach(tr => tr.addEventListener('click', () => viewVendor(tr.getAttribute('data-id'))));
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

/* ---------- Action menu ---------- */
function toggleActionMenu(e, id) {
    e.stopPropagation();
    document.querySelectorAll('.action-menu').forEach(m => { if (m.id !== `menu-${id}`) m.classList.add('hidden'); });
    document.getElementById(`menu-${id}`).classList.toggle('hidden');
}
document.addEventListener('click', () => document.querySelectorAll('.action-menu').forEach(m => m.classList.add('hidden')));

/* ---------- Sorting ---------- */
document.querySelectorAll('[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
        const key = th.getAttribute('data-sort');
        if (state.sortKey === key) { state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc'; }
        else { state.sortKey = key; state.sortDir = 'asc'; }
        renderTable();
    });
});

/* ---------- Filters ---------- */
document.getElementById('searchInput').addEventListener('input', e => { state.search = e.target.value; state.page = 1; renderTable(); });
document.getElementById('categoryFilter').addEventListener('change', e => { state.category = e.target.value; state.page = 1; renderTable(); });
document.getElementById('statusFilter').addEventListener('change', e => { state.status = e.target.value; state.page = 1; renderTable(); });
document.getElementById('pageSizeSelect').addEventListener('change', e => { state.pageSize = Number(e.target.value); state.page = 1; renderTable(); });

/* ---------- Modal helpers ---------- */
function openModal(id) { document.getElementById(id).classList.remove('hidden'); }
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
document.querySelectorAll('[data-close-modal]').forEach(btn => btn.addEventListener('click', () => btn.closest('.modal-overlay').classList.add('hidden')));
document.querySelectorAll('.modal-overlay').forEach(ov => ov.addEventListener('click', e => { if (e.target === ov) ov.classList.add('hidden'); }));

/* ---------- Add / Edit vendor ---------- */
const vendorForm = document.getElementById('vendorForm');

document.getElementById('newVendorBtn').addEventListener('click', () => {
    document.getElementById('modalTitle').textContent = 'Add Vendor';
    vendorForm.reset();
    document.getElementById('vendorId').value = '';
    document.getElementById('fStatus').checked = true;
    openModal('vendorModal');
});

function editVendor(id) {
    const v = vendors.find(x => x.id === id);
    if (!v) return;
    document.getElementById('modalTitle').textContent = `Edit Vendor — ${v.id}`;
    document.getElementById('vendorId').value = v.id;
    document.getElementById('fName').value = v.name;
    document.getElementById('fContact').value = v.contact;
    document.getElementById('fPhone').value = v.phone;
    document.getElementById('fEmail').value = v.email;
    document.getElementById('fCity').value = v.city;
    document.getElementById('fAddress').value = v.address;
    document.getElementById('fCategory').value = v.category;
    document.getElementById('fGst').value = v.gst;
    document.getElementById('fStatus').checked = v.status === 'Active';
    document.getElementById('fNotes').value = v.notes;
    openModal('vendorModal');
}

function nextId() {
    const nums = vendors.map(v => Number(v.id.split('-')[1]) || 0);
    return 'V-' + String(Math.max(...nums, 0) + 1).padStart(3, '0');
}

function toggleStatus(id) {
    const v = vendors.find(x => x.id === id);
    if (!v) return;
    v.status = v.status === 'Active' ? 'Inactive' : 'Active';
    renderTable();
    showToast('success', `${v.name} marked ${v.status}`);
}

vendorForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    ['fName', 'fContact', 'fPhone', 'fCity'].forEach(id => {
        const el = document.getElementById(id);
        if (!el.value) { el.classList.add('field-error'); valid = false; }
        else el.classList.remove('field-error');
    });
    if (!valid) { showToast('error', 'Please fill all required fields'); return; }

    const id = document.getElementById('vendorId').value;
    const payload = {
        name: document.getElementById('fName').value,
        contact: document.getElementById('fContact').value,
        phone: document.getElementById('fPhone').value,
        email: document.getElementById('fEmail').value,
        city: document.getElementById('fCity').value,
        address: document.getElementById('fAddress').value,
        category: document.getElementById('fCategory').value,
        gst: document.getElementById('fGst').value,
        status: document.getElementById('fStatus').checked ? 'Active' : 'Inactive',
        notes: document.getElementById('fNotes').value,
    };

    if (id) {
        const idx = vendors.findIndex(v => v.id === id);
        vendors[idx] = { ...vendors[idx], ...payload };
        showToast('success', `${id} updated`);
    } else {
        const newId = nextId();
        vendors.unshift({ id: newId, ...payload });
        showToast('success', `${newId} added`);
    }
    closeModal('vendorModal');
    renderTable();
});

/* ---------- View vendor ---------- */
function viewVendor(id) {
    const v = vendors.find(x => x.id === id);
    if (!v) return;
    document.getElementById('viewBody').innerHTML = `
        <div class="flex items-center gap-3 mb-2">
            <div class="avatar-circle" style="width:44px;height:44px;font-size:14px;">${initials(v.name)}</div>
            <div>
                <div class="text-sm font-semibold text-[#111844]">${v.name}</div>
                <span class="pill ${pillClass(v.status)}">${v.status}</span>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
            <div><strong>Vendor ID:</strong> ${v.id}</div>
            <div><strong>Category:</strong> ${v.category}</div>
            <div><strong>Contact:</strong> ${v.contact}</div>
            <div><strong>Phone:</strong> ${v.phone}</div>
            <div class="col-span-2"><strong>Email:</strong> ${v.email || '—'}</div>
            <div class="col-span-2"><strong>Address:</strong> ${v.address || '—'}, ${v.city}</div>
            <div class="col-span-2"><strong>GST No.:</strong> ${v.gst || '—'}</div>
            ${v.notes ? `<div class="col-span-2"><strong>Notes:</strong> ${v.notes}</div>` : ''}
        </div>
    `;
    openModal('viewModal');
}

/* ---------- Delete ---------- */
let pendingDeleteId = null;
function askDelete(id) { pendingDeleteId = id; openModal('deleteModal'); }
document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    vendors = vendors.filter(v => v.id !== pendingDeleteId);
    closeModal('deleteModal');
    renderTable();
    showToast('success', 'Vendor deleted');
});

/* ---------- Toast ---------- */
function showToast(type, message) {
    const container = document.getElementById('toast-container');
    const icons = { success: 'fa-circle-check text-emerald-600', error: 'fa-circle-xmark text-red-600', info: 'fa-circle-info text-[#4B5694]' };
    const el = document.createElement('div');
    el.className = `toast ${type} toast-animate`;
    el.innerHTML = `<i class="fas ${icons[type]} mt-0.5"></i><span class="text-[#111844]">${message}</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

/* ---------- Sidebar / Topbar (shared behaviour) ---------- */
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

/* ---------- Init ---------- */
renderTable();