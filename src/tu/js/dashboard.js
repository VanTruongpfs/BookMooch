document.addEventListener('DOMContentLoaded', () => {
    const name = localStorage.getItem('bm_admin_name') || 'Admin';
    const greetEl = document.getElementById('greetName');
    if (greetEl) greetEl.textContent = name.split(' ').slice(-1)[0];

    const usersEl = document.getElementById('kpiUsers');
    const revenueEl = document.getElementById('kpiRevenue');
    if (usersEl) animateCountUp(usersEl, 128940, 1100, false);
    if (revenueEl) animateCountUp(revenueEl, 86400000, 1300, true);

    renderActivity();
});

const activityLog = [
    { time: '09:42 hôm nay', admin: 'Nguyễn Minh Admin', action: 'Duyệt yêu cầu rút tiền', target: '#WD-88231 · 12.000.000 ₫', status: 'success' },
    { time: '09:10 hôm nay', admin: 'Trần Thị Quản Lý', action: 'Khoá tài khoản vi phạm', target: 'seller_truyenxua92', status: 'danger' },
    { time: '08:47 hôm nay', admin: 'Nguyễn Minh Admin', action: 'Cập nhật biểu phí hoa hồng', target: 'Danh mục Manga: 8% → 7.5%', status: 'info' },
    { time: 'Hôm qua, 21:05', admin: 'Lê Văn Kiểm Duyệt', action: 'Tạo voucher toàn hệ thống', target: 'SACH9 · Giảm 9% tối đa 50k', status: 'success' },
    { time: 'Hôm qua, 17:30', admin: 'Trần Thị Quản Lý', action: 'Thêm nhân viên mới', target: 'pham.van.duy@bookmooch.vn · Kiểm duyệt viên', status: 'success' },
    { time: 'Hôm qua, 14:12', admin: 'Nguyễn Minh Admin', action: 'Từ chối yêu cầu rút tiền', target: '#WD-88190 · Nghi vấn gian lận', status: 'danger' },
];

function renderActivity() {
    const body = document.getElementById('activityTableBody');
    if (!body) return;
    body.innerHTML = activityLog.map((row) => `
    <tr>
      <td style="color: var(--text-muted); white-space:nowrap;">${row.time}</td>
      <td><strong>${escapeHtml(row.admin)}</strong></td>
      <td>${escapeHtml(row.action)}</td>
      <td style="color: var(--text-muted);">${escapeHtml(row.target)}</td>
      <td style="text-align:center;">
        <span class="badge badge-${row.status === 'success' ? 'success' : row.status === 'danger' ? 'danger' : 'info'}">
          <span class="badge-dot"></span>${row.status === 'success' ? 'Hoàn tất' : row.status === 'danger' ? 'Từ chối/Khoá' : 'Cập nhật'}
        </span>
      </td>
    </tr>
  `).join('');
}