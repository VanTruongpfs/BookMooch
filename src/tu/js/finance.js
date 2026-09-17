const revenueWeeks = [
    { label: 'Tuần 1', gmv: 62, commission: 5 },
    { label: 'Tuần 2', gmv: 78, commission: 6.4 },
    { label: 'Tuần 3', gmv: 70, commission: 5.7 },
    { label: 'Tuần 4', gmv: 92, commission: 7.4 },
    { label: 'Tuần 5', gmv: 100, commission: 8.1 },
];

const revenueByCategory = [
    { name: 'Manga / Comic', percent: 38, value: '1.628.700.000 ₫' },
    { name: 'Văn học trong nước', percent: 24, value: '1.028.760.000 ₫' },
    { name: 'Sách dịch / Ngoại văn', percent: 18, value: '771.570.000 ₫' },
    { name: 'Giáo trình / Tham khảo', percent: 12, value: '514.380.000 ₫' },
    { name: 'Ấn bản hiếm / Sưu tầm', percent: 8, value: '343.090.000 ₫' },
];

const topSellers = [
    { name: 'Phạm Thị Ngọc', revenue: '340.600.000 ₫' },
    { name: 'Trần Đăng Khoa', revenue: '128.400.000 ₫' },
    { name: 'Ngô Hải Đăng', revenue: '48.900.000 ₫' },
    { name: 'Lê Văn Phát', revenue: '56.700.000 ₫' },
    { name: 'Đỗ Minh Anh', revenue: '22.100.000 ₫' },
];

const withdrawRequests = [
    { id: 'WD-88231', seller: 'Tiệm Truyện Vũ Trụ', amount: 12000000, bank: 'Vietcombank •••• 8829', time: '09:42 hôm nay', status: 'pending' },
    { id: 'WD-88229', seller: 'Nhà Sách Ngọc Anh', amount: 8500000, bank: 'Techcombank •••• 2201', time: '08:55 hôm nay', status: 'pending' },
    { id: 'WD-88220', seller: 'Comic Corner HN', amount: 24000000, bank: 'MB Bank •••• 5567', time: 'Hôm qua, 20:12', status: 'pending' },
    { id: 'WD-88218', seller: 'Sách Cũ Sài Gòn', amount: 3200000, bank: 'ACB •••• 9081', time: 'Hôm qua, 16:40', status: 'pending' },
    { id: 'WD-88215', seller: 'Kho Sách Miền Tây', amount: 15600000, bank: 'Vietinbank •••• 3345', time: 'Hôm qua, 14:05', status: 'pending' },
    { id: 'WD-88205', seller: 'Tiệm Truyện Vũ Trụ', amount: 9800000, bank: 'Vietcombank •••• 8829', time: '2 ngày trước', status: 'approved' },
    { id: 'WD-88198', seller: 'Nhà Sách Ngọc Anh', amount: 5400000, bank: 'Techcombank •••• 2201', time: '2 ngày trước', status: 'approved' },
    { id: 'WD-88190', seller: 'Comic Corner HN', amount: 41000000, bank: 'MB Bank •••• 5567', time: '3 ngày trước', status: 'rejected' },
];

const cashflowDays = [
    { label: 'T2', inflow: 68, outflow: 40 },
    { label: 'T3', inflow: 74, outflow: 52 },
    { label: 'T4', inflow: 60, outflow: 38 },
    { label: 'T5', inflow: 88, outflow: 61 },
    { label: 'T6', inflow: 95, outflow: 70 },
    { label: 'T7', inflow: 100, outflow: 55 },
    { label: 'CN', inflow: 82, outflow: 46 },
];

const cashflowEntries = [
    { time: '09:42 hôm nay', type: 'Thanh toán đơn hàng', desc: '#ORD-90512 · Buyer thanh toán qua Ví', amount: 890000, dir: 'in' },
    { time: '09:15 hôm nay', type: 'Hoa hồng sàn', desc: 'Trích hoa hồng 7.5% đơn #ORD-90512', amount: 66750, dir: 'in' },
    { time: '08:50 hôm nay', type: 'Rút tiền người bán', desc: '#WD-88205 · Tiệm Truyện Vũ Trụ', amount: 9800000, dir: 'out' },
    { time: 'Hôm qua, 22:10', type: 'Hoàn tiền đơn huỷ', desc: '#ORD-90211 · Hoàn về ví buyer', amount: 45000, dir: 'out' },
    { time: 'Hôm qua, 19:30', type: 'Thanh toán đơn hàng', desc: '#ORD-90480 · Thanh toán COD đối soát', amount: 1240000, dir: 'in' },
    { time: 'Hôm qua, 15:02', type: 'Phí rút tiền', desc: 'Phí giao dịch #WD-88198', amount: 27000, dir: 'in' },
];

document.addEventListener('DOMContentLoaded', () => {
    renderRevenueChart();
    renderRevenueByCategory();
    renderTopSellers();
    renderWithdrawTable();
    renderCashflowChart();
    renderCashflowTable();

    initSlidingTabs(document.getElementById('financeSegControl'), (tab) => {
        const view = tab.dataset.view;
        document.getElementById('financeViewOverview').style.display = view === 'overview' ? 'block' : 'none';
        document.getElementById('financeViewWithdraw').style.display = view === 'withdraw' ? 'block' : 'none';
        document.getElementById('financeViewCashflow').style.display = view === 'cashflow' ? 'block' : 'none';
    });

    initSlidingTabs(document.getElementById('withdrawFilterTabs'), applyWithdrawFilter);

    if (window.location.hash === '#withdraw') {
        setTimeout(() => document.getElementById('withdrawTabBtn').click(), 80);
    }
});

function renderRevenueChart() {
    const el = document.getElementById('revenueChart');
    el.innerHTML = revenueWeeks.map((w) => `
    <div class="mini-bar-col">
      <div class="mini-bar-stack" style="height:${w.gmv}%;">
        <div class="mini-bar-in" style="height:100%; background: linear-gradient(180deg, var(--primary-container), var(--primary));"></div>
      </div>
      <div class="mini-bar-label">${w.label}</div>
    </div>
  `).join('');
}

function renderRevenueByCategory() {
    const el = document.getElementById('revenueByCategory');
    el.innerHTML = revenueByCategory.map((c) => `
    <div class="category-row">
      <div class="cat-name">${c.name}</div>
      <div class="cat-track"><div class="cat-fill" style="width:${c.percent}%;"></div></div>
      <div class="cat-value">${c.value}</div>
    </div>
  `).join('');
}

function renderTopSellers() {
    const body = document.getElementById('topSellersBody');
    body.innerHTML = [...topSellers].sort((a, b) => parseFormattedNumber(b.revenue) - parseFormattedNumber(a.revenue)).map((s, i) => `
    <tr>
      <td><strong>#${i + 1}</strong> &nbsp; ${escapeHtml(s.name)}</td>
      <td style="text-align:right; font-weight:700; color:var(--text-main);">${s.revenue}</td>
    </tr>
  `).join('');
}

const withdrawStatusMeta = {
    pending: { label: 'Chờ duyệt', badge: 'warning' },
    approved: { label: 'Đã duyệt', badge: 'success' },
    rejected: { label: 'Từ chối', badge: 'danger' },
};

let withdrawTarget = null;

function renderWithdrawTable() {
    const body = document.getElementById('withdrawTableBody');
    body.innerHTML = withdrawRequests.map((w) => {
        const meta = withdrawStatusMeta[w.status];
        return `
    <tr data-status="${w.status}">
      <td><strong>${escapeHtml(w.seller)}</strong><div class="identity-sub">${w.id}</div></td>
      <td style="font-weight:700; color:var(--text-main); white-space:nowrap;">${formatNumber(w.amount)} ₫</td>
      <td style="white-space:nowrap;">${w.bank}</td>
      <td style="color:var(--text-muted); white-space:nowrap;">${w.time}</td>
      <td style="text-align:center;"><span class="badge badge-${meta.badge}"><span class="badge-dot"></span>${meta.label}</span></td>
      <td style="text-align:center;">
        ${w.status === 'pending' ? `
        <div style="display:flex; gap:6px; justify-content:center;">
          <button class="btn btn-primary btn-sm" onclick="openWithdrawAction('${w.id}', 'approve')">Duyệt</button>
          <button class="btn btn-sm" style="background:var(--danger-bg); color:var(--danger-text);" onclick="openWithdrawAction('${w.id}', 'reject')">Từ chối</button>
        </div>` : `<button class="btn btn-outline btn-sm" onclick="showToast('Xem chi tiết yêu cầu ${w.id}')">Chi tiết</button>`}
      </td>
    </tr>`;
    }).join('');
}

function applyWithdrawFilter() {
    const activeTab = document.querySelector('#withdrawFilterTabs .tab-chip.active');
    const filter = activeTab ? activeTab.dataset.filter : 'pending';
    document.querySelectorAll('#withdrawTableBody tr').forEach((row) => {
        row.classList.toggle('row-hidden', row.dataset.status !== filter);
    });
}

function openWithdrawAction(id, action) {
    const req = withdrawRequests.find((w) => w.id === id);
    if (!req) return;
    withdrawTarget = { id, action };
    const icon = document.getElementById('withdrawModalIcon');
    icon.className = `modal-icon-circle ${action === 'approve' ? 'success' : 'danger'}`;
    icon.querySelector('.material-symbols-outlined').textContent = action === 'approve' ? 'check_circle' : 'cancel';
    document.getElementById('withdrawModalTitle').textContent = action === 'approve' ? 'Duyệt yêu cầu rút tiền' : 'Từ chối yêu cầu rút tiền';
    document.getElementById('withdrawModalDesc').innerHTML = `Xác nhận ${action === 'approve' ? 'duyệt' : 'từ chối'} yêu cầu rút tiền của <strong>${req.seller}</strong> - ${formatNumber(req.amount)} ₫?`;
    document.getElementById('withdrawRejectReasonWrap').style.display = action === 'reject' ? 'block' : 'none';
    const confirmBtn = document.getElementById('confirmWithdrawActionBtn');
    confirmBtn.className = `btn ${action === 'approve' ? 'btn-primary' : 'btn-danger'}`;
    confirmBtn.textContent = action === 'approve' ? 'Xác nhận duyệt' : 'Xác nhận từ chối';
    openModal('withdrawActionModal');
}

function confirmWithdrawAction() {
    if (!withdrawTarget) return;
    const req = withdrawRequests.find((w) => w.id === withdrawTarget.id);
    if (req) {
        req.status = withdrawTarget.action === 'approve' ? 'approved' : 'rejected';
        renderWithdrawTable();
        applyWithdrawFilter();
        showToast(
            withdrawTarget.action === 'approve' ? `Đã duyệt rút tiền cho ${req.seller}` : `Đã từ chối yêu cầu rút tiền của ${req.seller}`,
            withdrawTarget.action === 'approve' ? 'success' : 'danger'
        );
    }
    closeModal('withdrawActionModal');
    withdrawTarget = null;
}

function renderCashflowChart() {
    const el = document.getElementById('cashflowChart');
    el.innerHTML = cashflowDays.map((d) => `
    <div class="mini-bar-col">
      <div style="display:flex; align-items:flex-end; gap:4px; height:100%;">
        <div class="mini-bar-stack" style="height:${d.inflow}%; width:16px;"><div class="mini-bar-in" style="height:100%;"></div></div>
        <div class="mini-bar-stack" style="height:${d.outflow}%; width:16px;"><div class="mini-bar-out" style="height:100%;"></div></div>
      </div>
      <div class="mini-bar-label">${d.label}</div>
    </div>
  `).join('');
}

function renderCashflowTable() {
    const body = document.getElementById('cashflowTableBody');
    body.innerHTML = cashflowEntries.map((c) => `
    <tr>
      <td style="color:var(--text-muted); white-space:nowrap;">${c.time}</td>
      <td>${c.type}</td>
      <td style="color:var(--text-muted);">${c.desc}</td>
      <td style="text-align:right; font-weight:700; color:${c.dir === 'in' ? 'var(--success-text)' : 'var(--danger-text)'};">${c.dir === 'in' ? '+' : '-'}${formatNumber(c.amount)} ₫</td>
      <td style="text-align:center;">
        <span class="badge badge-${c.dir === 'in' ? 'success' : 'danger'}">
          <span class="material-symbols-outlined" style="font-size:14px;">${c.dir === 'in' ? 'south_west' : 'north_east'}</span>
          ${c.dir === 'in' ? 'Vào' : 'Ra'}
        </span>
      </td>
    </tr>
  `).join('');
}