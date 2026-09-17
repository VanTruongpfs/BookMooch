const accountsData = [
    { id: 'U-10231', name: 'Trần Đăng Khoa', email: 'khoa.tran@gmail.com', phone: '0912.***.881', role: 'seller', joined: '12/03/2023', total: '486 đơn · 128.4tr ₫', status: 'active', reported: false, verified: true },
    { id: 'U-10589', name: 'Nguyễn Thị Hồng', email: 'hong.nguyen@gmail.com', phone: '0987.***.204', role: 'buyer', joined: '04/07/2024', total: '38 đơn · 4.2tr ₫', status: 'active', reported: false, verified: true },
    { id: 'U-10902', name: 'Lê Văn Phát', email: 'phat.le@gmail.com', phone: '0933.***.552', role: 'seller', joined: '19/01/2024', total: '212 đơn · 56.7tr ₫', status: 'reported', reported: true, verified: true },
    { id: 'U-11045', name: 'Vũ Tuấn Kiệt', email: 'kiet.vu@gmail.com', phone: '0912.***.112', role: 'buyer', joined: '30/09/2024', total: '5 đơn · 480k ₫', status: 'active', reported: false, verified: false },
    { id: 'U-11290', name: 'Phạm Thị Ngọc', email: 'ngoc.pham@gmail.com', phone: '0977.***.331', role: 'seller', joined: '02/02/2022', total: '1.204 đơn · 340.6tr ₫', status: 'active', reported: false, verified: true },
    { id: 'U-11384', name: 'Hoàng Gia Bảo', email: 'bao.hoang@gmail.com', phone: '0909.***.774', role: 'buyer', joined: '15/05/2025', total: '2 đơn · 190k ₫', status: 'active', reported: false, verified: false },
    { id: 'U-11402', name: 'Đỗ Minh Anh', email: 'anh.do@gmail.com', phone: '0966.***.128', role: 'seller', joined: '21/11/2023', total: '89 đơn · 22.1tr ₫', status: 'banned', reported: true, verified: true },
    { id: 'U-11501', name: 'Bùi Thu Trang', email: 'trang.bui@gmail.com', phone: '0945.***.660', role: 'buyer', joined: '08/08/2024', total: '61 đơn · 7.8tr ₫', status: 'active', reported: false, verified: true },
    { id: 'U-11623', name: 'Ngô Hải Đăng', email: 'dang.ngo@gmail.com', phone: '0918.***.903', role: 'seller', joined: '17/06/2024', total: '154 đơn · 48.9tr ₫', status: 'active', reported: false, verified: true },
    { id: 'U-11740', name: 'Trịnh Bảo Châu', email: 'chau.trinh@gmail.com', phone: '0938.***.417', role: 'buyer', joined: '01/01/2025', total: '14 đơn · 1.6tr ₫', status: 'active', reported: false, verified: true },
];

const statusMeta = {
    active: { label: 'Hoạt động', badge: 'success' },
    reported: { label: 'Bị báo cáo', badge: 'warning' },
    banned: { label: 'Đã khoá', badge: 'danger' },
};

let currentBanTarget = null;

document.addEventListener('DOMContentLoaded', () => {
    renderAccounts();
    initSlidingTabs(document.getElementById('accFilterTabs'), applyFilters);
    document.getElementById('accountSearch').addEventListener('input', debounce(applyFilters, 200));
    document.getElementById('selectAllAcc').addEventListener('change', (e) => {
        document.querySelectorAll('.acc-checkbox').forEach((cb) => { cb.checked = e.target.checked; });
    });
});

function renderAccounts() {
    const body = document.getElementById('accountsTableBody');
    body.innerHTML = accountsData.map((acc) => {
        const meta = statusMeta[acc.status];
        const roleLabel = acc.role === 'seller' ? 'Người bán' : 'Người mua';
        const initials = acc.name.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase();
        return `
    <tr data-status="${acc.status}" data-role="${acc.role}" data-reported="${acc.reported}" data-name="${acc.name.toLowerCase()}" data-email="${acc.email.toLowerCase()}">
      <td><input type="checkbox" class="custom-checkbox acc-checkbox" data-id="${acc.id}"></td>
      <td>
        <div class="identity-cell">
          <div class="avatar-chip role-${acc.role}">${initials}</div>
          <div class="identity-text">
            <span class="identity-name">${escapeHtml(acc.name)} ${acc.verified ? '<span class="material-symbols-outlined" style="font-size:14px; color:var(--info); vertical-align:middle;" title="Đã xác minh">verified</span>' : ''}</span>
            <span class="identity-sub">${acc.id}</span>
          </div>
        </div>
      </td>
      <td><span class="badge badge-${acc.role === 'seller' ? 'primary' : 'secondary'}"><span class="badge-dot"></span>${roleLabel}</span></td>
      <td>
        <div class="identity-text">
          <span class="identity-sub">${escapeHtml(acc.email)}</span>
          <span class="identity-sub">${acc.phone}</span>
        </div>
      </td>
      <td style="color:var(--text-muted); white-space:nowrap;">${acc.joined}</td>
      <td style="white-space:nowrap;">${acc.total}</td>
      <td style="text-align:center;"><span class="badge badge-${meta.badge}"><span class="badge-dot"></span>${meta.label}</span></td>
      <td style="text-align:center;">
        <div style="display:flex; gap:6px; justify-content:center;">
          <button class="btn btn-outline btn-sm" onclick="viewAccountDetail('${acc.id}')">Xem</button>
          ${acc.status === 'banned'
            ? `<button class="btn btn-primary btn-sm" onclick="openBanModal('${acc.id}', 'unban')">Mở khoá</button>`
            : `<button class="btn btn-sm" style="background:var(--danger-bg); color:var(--danger-text);" onclick="openBanModal('${acc.id}', 'ban')">Khoá</button>`}
        </div>
      </td>
    </tr>`;
    }).join('');
}

function applyFilters() {
    const activeTab = document.querySelector('#accFilterTabs .tab-chip.active');
    const filter = activeTab ? activeTab.dataset.filter : 'all';
    const query = document.getElementById('accountSearch').value.trim().toLowerCase();

    document.querySelectorAll('#accountsTableBody tr').forEach((row) => {
        let visible = true;
        if (filter === 'buyer') visible = row.dataset.role === 'buyer';
        else if (filter === 'seller') visible = row.dataset.role === 'seller';
        else if (filter === 'reported') visible = row.dataset.reported === 'true';
        else if (filter === 'banned') visible = row.dataset.status === 'banned';

        if (visible && query) {
            visible = row.dataset.name.includes(query) || row.dataset.email.includes(query);
        }

        row.classList.toggle('row-hidden', !visible);
    });
}

function viewAccountDetail(id) {
    const acc = accountsData.find((a) => a.id === id);
    if (!acc) return;
    const meta = statusMeta[acc.status];
    document.getElementById('accountDetailBody').innerHTML = `
    <div style="display:flex; gap:14px; align-items:center; margin-bottom:18px;">
      <div class="avatar-chip role-${acc.role}" style="width:56px; height:56px; font-size:1.1rem;">${acc.name.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase()}</div>
      <div>
        <div style="font-weight:800; font-size:1.05rem; color:var(--text-main);">${escapeHtml(acc.name)}</div>
        <div style="font-size:.8rem; color:var(--text-muted);">${acc.id} • ${acc.role === 'seller' ? 'Người bán' : 'Người mua'}</div>
      </div>
      <span class="badge badge-${meta.badge}" style="margin-left:auto;"><span class="badge-dot"></span>${meta.label}</span>
    </div>
    <div class="stat-mini-row">
      <div class="stat-mini"><h5>Email</h5><div class="val" style="font-size:.86rem;">${escapeHtml(acc.email)}</div></div>
      <div class="stat-mini"><h5>Số điện thoại</h5><div class="val" style="font-size:.86rem;">${acc.phone}</div></div>
      <div class="stat-mini"><h5>Ngày tham gia</h5><div class="val" style="font-size:.86rem;">${acc.joined}</div></div>
      <div class="stat-mini"><h5>Tổng giao dịch</h5><div class="val" style="font-size:.86rem;">${acc.total}</div></div>
    </div>
    ${acc.reported ? `<div style="margin-top:16px; background:var(--warning-bg); border:1px solid #fde68a; border-radius:var(--radius-md); padding:12px 14px; font-size:.82rem; color:var(--warning-text);">⚠️ Tài khoản này hiện có báo cáo vi phạm đang chờ xác minh từ đội kiểm duyệt.</div>` : ''}
  `;
    const primaryBtn = document.getElementById('detailPrimaryAction');
    primaryBtn.textContent = acc.verified ? 'Đã xác minh' : 'Xác minh tài khoản';
    primaryBtn.disabled = acc.verified;
    primaryBtn.onclick = () => { showToast(`Đã xác minh tài khoản ${acc.name}`, 'success'); closeModal('accountDetailModal'); };
    openModal('accountDetailModal');
}

function openBanModal(id, mode) {
    const acc = accountsData.find((a) => a.id === id);
    if (!acc) return;
    currentBanTarget = { id, mode };
    document.getElementById('banModalUser').textContent = `${acc.name} (${acc.id})`;
    document.getElementById('banReasonWrap').style.display = mode === 'ban' ? 'block' : 'none';
    document.getElementById('banModalTitle').textContent = mode === 'ban' ? 'Xác nhận khoá tài khoản' : 'Xác nhận mở khoá tài khoản';
    document.getElementById('banModalDesc').innerHTML = mode === 'ban'
        ? `Bạn có chắc chắn muốn khoá tài khoản <strong id="banModalUser2">${acc.name}</strong> không? Người dùng sẽ không thể đăng nhập cho đến khi được mở khoá lại.`
        : `Mở khoá tài khoản <strong>${acc.name}</strong> và cho phép người dùng đăng nhập trở lại?`;
    openModal('banConfirmModal');
}

function confirmBanAction() {
    if (!currentBanTarget) return;
    const acc = accountsData.find((a) => a.id === currentBanTarget.id);
    if (acc) {
        acc.status = currentBanTarget.mode === 'ban' ? 'banned' : 'active';
        renderAccounts();
        applyFilters();
        showToast(currentBanTarget.mode === 'ban' ? `Đã khoá tài khoản ${acc.name}` : `Đã mở khoá tài khoản ${acc.name}`, currentBanTarget.mode === 'ban' ? 'danger' : 'success');
    }
    closeModal('banConfirmModal');
    currentBanTarget = null;
}

function createManualAccount() {
    const name = document.getElementById('newAccName').value.trim();
    const email = document.getElementById('newAccEmail').value.trim();
    const role = document.getElementById('newAccRole').value;
    if (!name || !email) {
        showToast('Vui lòng nhập đầy đủ họ tên và email', 'warning');
        return;
    }
    accountsData.unshift({
        id: `U-${Math.floor(10000 + Math.random() * 9999)}`, name, email, phone: '0900.***.000',
        role, joined: new Date().toLocaleDateString('vi-VN'), total: '0 đơn · 0 ₫', status: 'active', reported: false, verified: false,
    });
    renderAccounts();
    applyFilters();
    closeModal('createStaffAccModal');
    showToast(`Đã tạo tài khoản mới cho ${name}`, 'success');
}