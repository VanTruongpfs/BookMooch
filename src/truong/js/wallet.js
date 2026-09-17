/**
 * ComicHub / BookMooch - Quản lý ví & Ký quỹ Escrow (Wallet Logic)
 * Phục vụ riêng cho: wallet.html
 * Các hiệu ứng:
 * 1. Đếm số animate (Count-up): số dư khả dụng và số dư giam giữ tăng dần khi load trang
 * 2. Tooltip on hover: giải thích lý do tiền bị giam, thời hạn 72h và giải ngân dự kiến
 * 3. Chart tương tác hover: rê chuột vào biểu đồ dòng tiền hiển thị số liệu theo ngày
 * 4. Progress bar đếm ngược ngày giải ngân cho từng khoản đang giam trong bảng
 */

document.addEventListener('DOMContentLoaded', () => {
  initWalletModule();
});

function initWalletModule() {
  initWalletTooltip();
  initEscrowCountdownBars();
}

/**
 * 2. Tooltip on hover giải thích tiền giam
 */
function initWalletTooltip() {
  const escrowLabel = document.querySelector('.wallet-card.escrow .wallet-amount-label');
  if (escrowLabel) {
    escrowLabel.style.display = 'inline-flex';
    escrowLabel.style.alignItems = 'center';
    escrowLabel.style.gap = '6px';
    escrowLabel.innerHTML = `
      <span>Tổng số dư đang giam giữ</span>
      <span class="tooltip-container">
        <span class="material-symbols-outlined" style="font-size: 16px; color: #ea580c; cursor: pointer;">help</span>
        <span class="tooltip-bubble">
          <strong>Vì sao tiền bị giam?</strong><br>
          Tiền được bảo lưu trong tài khoản ký quỹ ComicHub Escrow 72h sau khi người mua nhận sách để đảm bảo quyền lợi khiếu nại cấn móp, tráo bìa. Hết thời hạn, tiền tự động mở khóa về Ví chính.
        </span>
      </span>
    `;
  }
}

/**
 * 3. Progress bar đếm ngược ngày giải ngân cho từng đơn đang giam
 */
function initEscrowCountdownBars() {
  const rows = document.querySelectorAll('#escrowTableSection table tbody tr');
  rows.forEach((row, idx) => {
    const timeCell = row.querySelector('td:nth-child(5)');
    if (!timeCell) return;

    const percent = idx === 0 ? 88 : idx === 1 ? 65 : 35;
    const hoursRemain = idx === 0 ? 'Còn 4 giờ nữa' : idx === 1 ? 'Còn 1 ngày nữa' : 'Còn 2 ngày nữa';

    const existingBadge = timeCell.querySelector('.badge');
    if (existingBadge) {
      existingBadge.remove();
    }

    const countdownBox = document.createElement('div');
    countdownBox.className = 'escrow-countdown-box';
    countdownBox.innerHTML = `
      <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
        <span style="color: #ea580c; font-weight: 700;">${hoursRemain}</span>
        <span>${percent}%</span>
      </div>
      <div class="countdown-track">
        <div class="countdown-fill" style="width: 0%;" data-target="${percent}%"></div>
      </div>
    `;
    timeCell.appendChild(countdownBox);
  });

  setTimeout(() => {
    document.querySelectorAll('.countdown-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-target') || '50%';
    });
  }, 250);
}
