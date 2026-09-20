/**
 * BookMooch Admin Console - Quản lý đơn hàng (orders.html)
 * Danh sách đơn toàn sàn, lọc theo trạng thái, xem chi tiết & hoà giải tranh chấp.
 */

const ordersData = [
    { code: 'ORD-90512', buyer: 'Nguyễn Thị Hồng', seller: 'Trần Đăng Khoa', product: 'Doraemon - Trọn bộ 45 tập', amount: 890000, status: 'processing', placed: 'Hôm nay, 09:15' },
    { code: 'ORD-90498', buyer: 'Vũ Tuấn Kiệt', seller: 'Phạm Thị Ngọc', product: 'Nhà Giả Kim (bìa cứng)', amount: 145000, status: 'processing', placed: 'Hôm nay, 08:40' },
    { code: 'ORD-90480', buyer: 'Hoàng Gia Bảo', seller: 'Ngô Hải Đăng', product: 'Sapiens - Lược sử loài người', amount: 1240000, status: 'shipping', placed: 'Hôm qua, 19:30' },
    { code: 'ORD-90465', buyer: 'Bùi Thu Trang', seller: 'Lê Văn Phát', product: 'Conan - Tập 1 đến 20', amount: 620000, status: 'shipping', placed: 'Hôm qua, 15:05' },
    { code: 'ORD-90441', buyer: 'Trịnh Bảo Châu', seller: 'Đỗ Minh Anh', product: 'Atomic Habits (bản dịch)', amount: 128000, status: 'completed', placed: '2 ngày trước' },
    { code: 'ORD-90420', buyer: 'Đỗ Minh Anh', seller: 'Trần Đăng Khoa', product: 'One Piece - Tập 90-100', amount: 340000, status: 'completed', placed: '2 ngày trước' },
    { code: 'ORD-90402', buyer: 'Ngô Hải Đăng', seller: 'Phạm Thị Ngọc', product: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', amount: 98000, status: 'completed', placed: '3 ngày trước' },
    { code: 'ORD-90211', buyer: 'Lê Văn Phát', seller: 'Bùi Thu Trang', product: 'Harry Potter - Trọn bộ 7 tập', amount: 1560000, status: 'disputed', placed: '3 ngày trước', disputeReason: 'Người mua báo nhận sách bị rách bìa, sai mô tả tình trạng.' },
    { code: 'ORD-90188', buyer: 'Phạm Thị Ngọc', seller: 'Vũ Tuấn Kiệt', product: 'Đắc Nhân Tâm', amount: 76000, status: 'disputed', placed: '4 ngày trước', disputeReason: 'Người bán khiếu nại người mua yêu cầu hoàn tiền sau khi đã nhận hàng đúng mô tả.' },
    { code: 'ORD-90150', buyer: 'Nguyễn Thị Hồng', seller: 'Ngô Hải Đăng', product: 'Cây Cam Ngọt Của Tôi', amount: 89000, status: 'cancelled', placed: '5 ngày trước' },
];

const orderStatusMeta = {
    processing: { label: 'Đang xử lý', badge: 'info', icon: 'hourglass_top' },
    shipping: { label: 'Đang giao', badge: 'warning', icon: 'local_shipping' },
    completed: { label: 'Hoàn tất', badge: 'success', icon: 'check_circle' },
    disputed: { label: 'Tranh chấp', badge: 'danger', icon: 'gavel' },
    cancelled: { label: 'Đã huỷ', badge: 'secondary', icon: 'cancel' },
};

let disputeTargetCode = null;

document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
    initSlidingTabs(document.getElementById('orderFilterTabs'), applyOrderFilter);
    document.getElementById('orderSearch').addEventListener('input', debounce(applyOrderFilter, 200));

    if (window.location.hash === '#disputes') {
        setTimeout(() => document.getElementById('disputedTabBtn').click(), 80);
    }
});

function renderOrders() {
    const body = document.getElementById('ordersTableBody');
    body.innerHTML = ordersData.map((o) => {
        const meta = orderStatusMeta[o.status];
        return `
    <tr data-status="${o.status}" data-code="${o.code.toLowerCase()}" data-buyer="${o.buyer.toLowerCase()}" data-seller="${o.seller.toLowerCase()}">
      <td>
        <div class="order-id-cell">
          <div class="order-code">${o.code} <button class="copy-btn" onclick="copyText('${o.code}')" title="Sao chép mã đơn"><span class="material-symbols-outlined" style="font-size:15px;">content_copy</span></button></div>
          <div class="order-date"><span class="material-symbols-outlined" style="font-size:13px;">schedule</span> ${o.placed}</div>
        </div>
      </td>
      <td>${escapeHtml(o.buyer)}</td>
      <td>${escapeHtml(o.seller)}</td>
      <td style="color:var(--text-muted); max-width:220px;">${escapeHtml(o.product)}</td>
      <td style="text-align:right; font-weight:700; color:var(--text-main); white-space:nowrap;">${formatNumber(o.amount)} ₫</td>
      <td style="text-align:center;">
        <span class="badge badge-${meta.badge}"><span class="badge-dot"></span>${meta.label}</span>
      </td>
      <td style="text-align:center;">
        <div style="display:flex; gap:6px; justify-content:center;">
          <button class="btn btn-outline btn-sm" onclick="viewOrderDetail('${o.code}')">Xem</button>
          ${o.status === 'disputed' ? `<button class="btn btn-primary btn-sm" onclick="openDisputeModal('${o.code}')">Hoà giải</button>` : ''}
        </div>
      </td>
    </tr>`;
    }).join('');
}

function applyOrderFilter() {
    const activeTab = document.querySelector('#orderFilterTabs .tab-chip.active');
    const filter = activeTab ? activeTab.dataset.filter : 'all';
    const query = document.getElementById('orderSearch').value.trim().toLowerCase();

    document.querySelectorAll('#ordersTableBody tr').forEach((row) => {
        let visible = filter === 'all' || row.dataset.status === filter;
        if (visible && query) {
            visible = row.dataset.code.includes(query) || row.dataset.buyer.includes(query) || row.dataset.seller.includes(query);
        }
        row.classList.toggle('row-hidden', !visible);
    });
}

const orderStepsByStatus = {
    processing: 1,
    shipping: 2,
    completed: 3,
    disputed: 2,
    cancelled: 0,
};

function viewOrderDetail(code) {
    const o = ordersData.find((x) => x.code === code);
    if (!o) return;
    const meta = orderStatusMeta[o.status];
    const step = orderStepsByStatus[o.status];
    const stepLabels = ['Đặt hàng', 'Người bán xác nhận', 'Đang giao', 'Hoàn tất'];

    document.getElementById('orderDetailBody').innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:18px;">
      <div class="order-code" style="font-size:1.05rem;">${o.code}</div>
      <span class="badge badge-${meta.badge}"><span class="badge-dot"></span>${meta.label}</span>
    </div>
    <div class="stat-mini-row" style="margin-bottom:18px;">
      <div class="stat-mini"><h5>Người mua</h5><div class="val" style="font-size:.86rem;">${escapeHtml(o.buyer)}</div></div>
      <div class="stat-mini"><h5>Người bán</h5><div class="val" style="font-size:.86rem;">${escapeHtml(o.seller)}</div></div>
      <div class="stat-mini"><h5>Sản phẩm</h5><div class="val" style="font-size:.86rem;">${escapeHtml(o.product)}</div></div>
      <div class="stat-mini"><h5>Giá trị đơn</h5><div class="val" style="font-size:.86rem;">${formatNumber(o.amount)} ₫</div></div>
    </div>
    ${o.status !== 'cancelled' ? `
    <div class="stepper-progress">
      <div class="stepper-line"><div class="stepper-line-fill" style="width:${(step / 3) * 100}%;"></div></div>
      ${stepLabels.map((label, i) => `
        <div class="stepper-step ${i < step ? 'completed' : i === step ? 'active' : ''}">
          <div class="step-circle">${i < step ? '<span class="material-symbols-outlined" style="font-size:16px;">check</span>' : i + 1}</div>
          <div class="step-label">${label}</div>
        </div>
      `).join('')}
    </div>` : `<div style="padding:14px 16px; background:var(--surface-bg); border-radius:var(--radius-md); color:var(--text-muted); font-size:.84rem;">Đơn hàng đã bị huỷ, không còn tiến trình giao vận.</div>`}
    ${o.status === 'disputed' ? `<div style="margin-top:18px; background:var(--danger-bg); border:1px solid #fecaca; border-radius:var(--radius-md); padding:12px 14px; font-size:.82rem; color:var(--danger-text); line-height:1.55;"><strong>Lý do tranh chấp:</strong> ${escapeHtml(o.disputeReason || '—')}</div>` : ''}
  `;
    openModal('orderDetailModal');
}

function openDisputeModal(code) {
    const o = ordersData.find((x) => x.code === code);
    if (!o) return;
    disputeTargetCode = code;
    document.getElementById('disputeOrderCode').textContent = code;
    document.getElementById('disputeModalDesc').innerHTML = `Đơn <strong>${code}</strong> đang có khiếu nại: <em>${escapeHtml(o.disputeReason || 'Không có mô tả')}</em>. Vui lòng chọn hướng xử lý sau khi xem xét bằng chứng hai bên.`;
    document.getElementById('disputeNote').value = '';
    openModal('disputeModal');
}

function resolveDispute(favor) {
    if (!disputeTargetCode) return;
    const o = ordersData.find((x) => x.code === disputeTargetCode);
    if (o) {
        o.status = 'completed';
        renderOrders();
        applyOrderFilter();
        showToast(`Đã hoà giải đơn ${o.code}, quyết định nghiêng về ${favor === 'buyer' ? 'người mua' : 'người bán'}`, 'success');
    }
    closeModal('disputeModal');
    disputeTargetCode = null;
}