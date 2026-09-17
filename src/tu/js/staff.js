const staffData = [
    { id: 'ST-001', name: 'Nguyễn Minh Admin', email: 'admin@bookmooch.vn', role: 'Super Admin', dept: 'Vận hành', lastLogin: 'Hôm nay, 09:42', status: 'active' },
    { id: 'ST-002', name: 'Trần Thị Quản Lý', email: 'manager@bookmooch.vn', role: 'Manager', dept: 'Vận hành', lastLogin: 'Hôm nay, 08:15', status: 'active' },
    { id: 'ST-003', name: 'Lê Văn Kiểm Duyệt', email: 'levankd@bookmooch.vn', role: 'Kiểm duyệt viên', dept: 'Kiểm duyệt nội dung', lastLogin: 'Hôm qua, 21:05', status: 'active' },
    { id: 'ST-004', name: 'Phạm Thị CSKH', email: 'phamthi.cs@bookmooch.vn', role: 'CSKH', dept: 'Chăm sóc khách hàng', lastLogin: 'Hôm qua, 17:20', status: 'active' },
    { id: 'ST-005', name: 'Đặng Quốc Huy', email: 'huy.dang@bookmooch.vn', role: 'Kiểm duyệt viên', dept: 'Kiểm duyệt nội dung', lastLogin: '2 ngày trước', status: 'active' },
    { id: 'ST-006', name: 'Vũ Thanh Tùng', email: 'tung.vu@bookmooch.vn', role: 'CSKH', dept: 'Chăm sóc khách hàng', lastLogin: '3 ngày trước', status: 'locked' },
];

const roleAvatarClass = {
    'Super Admin': 'role-admin',
    Manager: 'role-manager',
    'Kiểm duyệt viên': 'role-staff',
    CSKH: 'role-staff',
};

const permModules = [
    { key: 'accounts', label: 'Quản lý tài khoản' },
    { key: 'staff', label: 'Nhân sự & phân quyền' },
    { key: 'fees', label: 'Biểu phí & chính sách' },
    { key: 'vouchers', label: 'Voucher toàn hệ thống' },
    { key: 'finance', label: 'Doanh thu & dòng tiền' },
    { key: 'orders', label: 'Quản lý đơn hàng' },
];

// role -> module -> checked (Super Admin luôn true & disabled)
const permState = {
    'Super Admin': { accounts: true, staff: true, fees: true, vouchers: true, finance: true, orders: true },
    Manager: { accounts: true, staff: false, fees: true, vouchers: true, finance: true, orders: true },
    'Kiểm duyệt viên': { accounts: true, staff: false, fees: false, vouchers: false, finance: false, orders: true },
    CSKH: { accounts: true, staff: false, fees: false, vouchers: false, finance: false, orders: true },
};

let lockTarget = null;

document.addEventListener('DOMContentLoaded', () => {
    renderStaffTable();
    renderPermMatrix();
    initSlidingTabs(document.getElementById('staffSegControl'), (tab) => {
        const view = tab.dataset.view;
        document.getElementById('staffViewList').style.display = view === 'list' ? 'block' : 'none';
        document.getElementById('staffViewPermissions').style.display = view === 'permissions' ? 'block' : 'none';
    });
    document.getElementById('staffSearch').addEventListener('input', debounce(filterStaff, 200));
});

function renderStaffTable() {
    const body = document.getElementById('staffTableBody');
    body.innerHTML = staffData.map((s) => {
        const initials = s.name.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();
        return `
    <tr data-name="${s.name.toLowerCase()}" data-email="${s.email.toLowerCase()}">
      <td>
        <div class="identity-cell">
          <div class="avatar-chip ${roleAvatarClass[s.role] || 'role-staff'}">${initials}</div>
          <div class="identity-text"><span class="identity-name">${escapeHtml(s.name)}</span><span class="identity-sub">${escapeHtml(s.email)}</span></div>
        </div>
      </td>
      <td><span class="badge badge-${s.role === 'Super Admin' ? 'primary' : 'info'}"><span class="badge-dot"></span>${s.role}</span></td>
      <td>${s.dept}</td>
      <td style="color:var(--text-muted);">${s.lastLogin}</td>
      <td style="text-align:center;"><span class="badge badge-${s.status === 'active' ? 'success' : 'danger'}"><span class="badge-dot"></span>${s.status === 'active' ? 'Hoạt động' : 'Đã khoá'}</span></td>
      <td style="text-align:center;">
        <div style="display:flex; gap:6px; justify-content:center;">
          <button class="btn btn-outline btn-sm" onclick="showToast('Đang mở chỉnh sửa hồ sơ ${escapeHtml(s.name)}')">Sửa</button>
          ${s.status === 'active'
            ? `<button class="btn btn-sm" style="background:var(--danger-bg); color:var(--danger-text);" onclick="openLockModal('${s.id}', 'lock')" ${s.role === 'Super Admin' ? 'disabled title="Không thể khoá Super Admin"' : ''}>Khoá</button>`
            : `<button class="btn btn-primary btn-sm" onclick="openLockModal('${s.id}', 'unlock')">Mở khoá</button>`}
        </div>
      </td>
    </tr>`;
    }).join('');
}

function filterStaff() {
    const query = document.getElementById('staffSearch').value.trim().toLowerCase();
    document.querySelectorAll('#staffTableBody tr').forEach((row) => {
        const visible = !query || row.dataset.name.includes(query) || row.dataset.email.includes(query);
        row.classList.toggle('row-hidden', !visible);
    });
}

function openLockModal(id, mode) {
    const staff = staffData.find((s) => s.id === id);
    if (!staff) return;
    lockTarget = { id, mode };
    document.getElementById('lockStaffTitle').textContent = mode === 'lock' ? 'Xác nhận khoá tài khoản nhân viên' : 'Xác nhận mở khoá tài khoản nhân viên';
    document.getElementById('lockStaffDesc').innerHTML = mode === 'lock'
        ? `Khoá tài khoản của <strong>${staff.name}</strong>? Nhân viên sẽ không thể đăng nhập hệ thống quản trị.`
        : `Mở khoá tài khoản của <strong>${staff.name}</strong> và cho phép đăng nhập trở lại?`;
    openModal('lockStaffModal');
}

function confirmLockStaff() {
    if (!lockTarget) return;
    const staff = staffData.find((s) => s.id === lockTarget.id);
    if (staff) {
        staff.status = lockTarget.mode === 'lock' ? 'locked' : 'active';
        renderStaffTable();
        showToast(lockTarget.mode === 'lock' ? `Đã khoá tài khoản ${staff.name}` : `Đã mở khoá tài khoản ${staff.name}`, lockTarget.mode === 'lock' ? 'danger' : 'success');
    }
    closeModal('lockStaffModal');
    lockTarget = null;
}

function addStaff() {
    const name = document.getElementById('newStaffName').value.trim();
    const email = document.getElementById('newStaffEmail').value.trim();
    const role = document.getElementById('newStaffRole').value;
    const dept = document.getElementById('newStaffDept').value;
    if (!name || !email) {
        showToast('Vui lòng nhập đầy đủ họ tên và email nội bộ', 'warning');
        return;
    }
    staffData.push({ id: `ST-${Math.floor(100 + Math.random() * 899)}`, name, email, role, dept, lastLogin: 'Chưa đăng nhập', status: 'active' });
    renderStaffTable();
    closeModal('addStaffModal');
    showToast(`Đã thêm nhân viên ${name} với vai trò ${role}`, 'success');
}

function renderPermMatrix() {
    const body = document.getElementById('permMatrixBody');
    const roles = ['Super Admin', 'Manager', 'Kiểm duyệt viên', 'CSKH'];
    body.innerHTML = permModules.map((mod) => `
    <tr>
      <td class="perm-group-label">${mod.label}</td>
      ${roles.map((role) => {
        const checked = permState[role][mod.key];
        const disabled = role === 'Super Admin';
        return `<td><input type="checkbox" class="perm-check" data-role="${role}" data-mod="${mod.key}" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}></td>`;
    }).join('')}
    </tr>
  `).join('');
}

function savePermissions() {
    document.querySelectorAll('#permMatrixBody .perm-check:not(:disabled)').forEach((cb) => {
        permState[cb.dataset.role][cb.dataset.mod] = cb.checked;
    });
    showToast('Đã lưu thay đổi ma trận phân quyền', 'success');
}