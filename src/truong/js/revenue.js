/**
 * ComicHub / BookMooch - Thống kê doanh thu (Revenue Logic)
 * Phục vụ riêng cho: revenue.html
 * Các hiệu ứng:
 * 1. Count-up animation cho các số KPI (doanh thu, đơn hàng, tỷ lệ hủy, rating) khi load trang
 * 2. Chart animate on load: cột mọc từ dưới lên, spline vẽ dần từ trái sang phải
 * 3. Toggle thời gian (7 ngày/30 ngày/Năm): chart re-render mượt với transition, không giật cục
 * 4. Hover tooltip trên chart: hiện chi tiết số liệu từng điểm
 * 5. Sort bảng Top sản phẩm bán chạy có icon và animation
 */

document.addEventListener('DOMContentLoaded', () => {
  initRevenueModule();
});

function initRevenueModule() {
  initRevenueChartAnimation();
  initChartHoverTooltips();
  initTopProductsSorting();
  initRevenueTabs();
}

function initRevenueTabs() {
  const chartTabsBar = document.querySelector('.chart-header .filter-tabs-bar');
  if (chartTabsBar && typeof initSlidingTabs === 'function') {
    initSlidingTabs(chartTabsBar, (btn) => {
      const mode = btn.textContent.toLowerCase().includes('tuần') ? 'weekly' : 'daily';
      toggleChartMode(btn, mode);
    });
  }
}

/**
 * 2. Chart animate on load: Cột mọc từ dưới lên, đường cong vẽ từ trái sang phải
 */
function initRevenueChartAnimation() {
  const chartWrapper = document.getElementById('chartWrapper');
  if (!chartWrapper) return;

  const bars = chartWrapper.querySelectorAll('rect[fill*="barGrad"]');
  bars.forEach((bar, index) => {
    const targetH = parseFloat(bar.getAttribute('height')) || 100;
    const targetY = parseFloat(bar.getAttribute('y')) || 160;

    const baseY = targetY + targetH;
    bar.setAttribute('height', '0');
    bar.setAttribute('y', baseY);
    bar.style.transition = `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.06}s`;

    setTimeout(() => {
      bar.setAttribute('height', targetH);
      bar.setAttribute('y', targetY);
    }, 150);
  });

  const splinePath = chartWrapper.querySelector('path[stroke="#0b1c30"]');
  if (splinePath) {
    const length = splinePath.getTotalLength ? splinePath.getTotalLength() : 800;
    splinePath.style.strokeDasharray = length;
    splinePath.style.strokeDashoffset = length;
    splinePath.style.transition = 'stroke-dashoffset 1.4s ease-out';

    setTimeout(() => {
      splinePath.style.strokeDashoffset = '0';
    }, 200);
  }
}

/**
 * 3. Toggle thời gian (Theo ngày / Theo tuần) với chuyển đổi mượt mà
 */
const chartDataPresets = {
  daily: {
    title: 'Theo ngày (30 ngày vừa qua)',
    bars: [100, 120, 140, 80, 150, 200, 170, 190],
    curve: 'M 97,175 C 145,150 160,110 197,125 C 240,140 260,95 297,85 C 340,75 360,170 397,185 C 440,200 460,130 497,95 C 540,60 560,140 597,55 C 640,30 660,130 697,60 C 740,20 760,120 797,75',
    points: [
      { cx: 97, cy: 175, date: '01/10', rev: '3.2Tr', orders: '18 đơn' },
      { cx: 197, cy: 125, date: '05/10', rev: '4.5Tr', orders: '26 đơn' },
      { cx: 297, cy: 85, date: '10/10', rev: '5.8Tr', orders: '34 đơn' },
      { cx: 397, cy: 185, date: '15/10', rev: '2.6Tr', orders: '14 đơn' },
      { cx: 497, cy: 95, date: '20/10', rev: '5.2Tr', orders: '30 đơn' },
      { cx: 597, cy: 55, date: '25/10 (Hội sách)', rev: '7.3Tr - Đỉnh điểm', orders: '48 đơn' },
      { cx: 697, cy: 60, date: '28/10', rev: '6.1Tr', orders: '38 đơn' },
      { cx: 797, cy: 75, date: '30/10', rev: '6.8Tr', orders: '42 đơn' }
    ]
  },
  weekly: {
    title: 'Theo tuần (4 tuần gần nhất)',
    bars: [140, 180, 220, 160, 190, 230, 210, 240],
    curve: 'M 97,140 C 150,110 200,90 297,70 C 350,120 400,100 497,60 C 550,40 600,80 697,50 C 750,30 780,45 797,40',
    points: [
      { cx: 97, cy: 140, date: 'Tuần 1', rev: '28.4Tr', orders: '152 đơn' },
      { cx: 197, cy: 105, date: 'Tuần 2', rev: '34.8Tr', orders: '190 đơn' },
      { cx: 297, cy: 70, date: 'Tuần 3', rev: '42.1Tr', orders: '235 đơn' },
      { cx: 397, cy: 90, date: 'Tuần 4', rev: '38.6Tr', orders: '204 đơn' },
      { cx: 497, cy: 60, date: 'Tuần 5', rev: '46.0Tr', orders: '260 đơn' },
      { cx: 597, cy: 45, date: 'Tuần 6', rev: '52.3Tr - Kỷ lục', orders: '310 đơn' },
      { cx: 697, cy: 50, date: 'Tuần 7', rev: '48.9Tr', orders: '280 đơn' },
      { cx: 797, cy: 40, date: 'Tuần 8', rev: '54.2Tr', orders: '325 đơn' }
    ]
  }
};

function toggleChartMode(btn, mode) {
  const container = btn.closest('.filter-tabs-bar');
  if (container) {
    container.querySelectorAll('.tab-chip').forEach(b => b.classList.remove('active'));
  }
  btn.classList.add('active');

  const chartWrapper = document.getElementById('chartWrapper');
  if (!chartWrapper) return;

  const data = chartDataPresets[mode] || chartDataPresets.daily;

  const path = chartWrapper.querySelector('path[stroke="#0b1c30"]');
  if (path) {
    path.style.transition = 'all 0.5s ease-in-out';
    path.setAttribute('d', data.curve);
  }

  const bars = chartWrapper.querySelectorAll('rect[fill*="barGrad"]');
  bars.forEach((bar, idx) => {
    const h = data.bars[idx] || 120;
    const y = 260 - h;
    bar.style.transition = 'all 0.4s ease-in-out';
    bar.setAttribute('height', h);
    bar.setAttribute('y', y);
  });

  const points = chartWrapper.querySelectorAll('.chart-point');
  points.forEach((point, idx) => {
    const pData = data.points[idx];
    if (pData) {
      point.setAttribute('cx', pData.cx);
      point.setAttribute('cy', pData.cy);
      point.setAttribute('data-date', pData.date);
      point.setAttribute('data-rev', pData.rev);
      point.setAttribute('data-orders', pData.orders);
    }
  });

  if (typeof showToast === 'function') {
    showToast(`Chế độ xem biểu đồ: ${data.title}`, 'info');
  }
}

/**
 * 4. Hover tooltip chi tiết trên điểm biểu đồ
 */
function initChartHoverTooltips() {
  const points = document.querySelectorAll('.chart-point');
  const tooltip = document.getElementById('chartTooltip');

  if (!points.length || !tooltip) return;

  points.forEach(point => {
    point.addEventListener('mouseenter', () => {
      const date = point.getAttribute('data-date') || '';
      const rev = point.getAttribute('data-rev') || '';
      const orders = point.getAttribute('data-orders') || '';

      tooltip.innerHTML = `
        <div style="font-weight:700; color:#fb923c; margin-bottom:2px;">${date}</div>
        <div>Doanh thu: <strong>${rev}</strong></div>
        <div style="color:#94a3b8; font-size:0.75rem;">Sản lượng: ${orders}</div>
      `;

      const rect = point.getBoundingClientRect();
      const parentWrapper = point.closest('.chart-wrapper');
      if (!parentWrapper) return;
      const parentRect = parentWrapper.getBoundingClientRect();

      const left = rect.left - parentRect.left + rect.width / 2;
      const top = rect.top - parentRect.top - 10;

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.classList.add('show');
    });

    point.addEventListener('mouseleave', () => {
      tooltip.classList.remove('show');
    });
  });
}

/**
 * 5. Sắp xếp bảng Top sản phẩm bán chạy có animation
 */
function initTopProductsSorting() {
  const table = document.querySelector('.content-card .data-table');
  if (!table) return;

  const ths = table.querySelectorAll('thead th');
  ths.forEach((th, colIdx) => {
    const title = th.textContent.trim();
    if (!title || title === 'Thứ hạng' || title === 'Trạng thái tồn kho') return;

    th.classList.add('sortable');
    if (!th.querySelector('.sort-icon')) {
      const icon = document.createElement('span');
      icon.className = 'material-symbols-outlined sort-icon';
      icon.textContent = 'arrow_upward';
      th.appendChild(icon);
    }

    th.addEventListener('click', () => {
      const isAsc = th.classList.contains('sort-asc');
      ths.forEach(t => t.classList.remove('sort-asc', 'sort-desc'));

      if (isAsc) {
        th.classList.add('sort-desc');
      } else {
        th.classList.add('sort-asc');
      }

      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      const rows = Array.from(tbody.querySelectorAll('tr'));
      rows.sort((a, b) => {
        const aVal = typeof parseFormattedNumber === 'function' ? parseFormattedNumber(a.cells[colIdx]?.textContent || '') : 0;
        const bVal = typeof parseFormattedNumber === 'function' ? parseFormattedNumber(b.cells[colIdx]?.textContent || '') : 0;

        if (aVal > 0 && bVal > 0) {
          return !isAsc ? aVal - bVal : bVal - aVal;
        }
        return (a.cells[colIdx]?.textContent || '').localeCompare(b.cells[colIdx]?.textContent || '', 'vi');
      });

      // Cập nhật lại số thứ hạng
      rows.forEach((row, idx) => {
        tbody.appendChild(row);
        const rankSpan = row.querySelector('.rank-badge');
        if (rankSpan) {
          rankSpan.textContent = idx + 1;
          rankSpan.className = `rank-badge rank-${idx + 1 <= 3 ? idx + 1 : 'other'}`;
        }
      });

      if (typeof showToast === 'function') {
        showToast(`Đã sắp xếp top sản phẩm theo: ${title}`, 'info');
      }
    });
  });
}
