/**
 * ComicHub / BookMooch - Yêu cầu rút tiền (Withdrawal Logic)
 * Phục vụ riêng cho: withdraw.html
 * Các hiệu ứng:
 * 1. Validate realtime: nhập số tiền vượt quá số dư -> border đỏ + shake animation + thông báo lỗi ngay
 * 2. Format số tự động: nhập số tự thêm dấu chấm ngăn cách hàng nghìn khi gõ
 * 3. Radio card selection: click chọn phương thức nhận tiền -> border/scale highlight card
 * 4. Button loading state: khi bấm "Xác nhận" -> spinner + disable tránh double-submit
 * 5. Progress stepper modal animation cho trạng thái yêu cầu (4 bước Napas 24/7)
 */

const MAX_AVAILABLE_BALANCE = 48650000;

document.addEventListener('DOMContentLoaded', () => {
  initWithdrawModule();
});

function initWithdrawModule() {
  const input = document.getElementById('withdrawAmountInput');
  if (!input) return;

  // Realtime validate + auto-format number khi gõ
  input.addEventListener('input', () => {
    const rawValue = typeof parseFormattedNumber === 'function' ? parseFormattedNumber(input.value) : parseInt(input.value.replace(/\D/g, '') || 0, 10);
    input.value = rawValue > 0 ? (typeof formatNumber === 'function' ? formatNumber(rawValue) : rawValue) : '';
    validateWithdrawAmount(rawValue);
  });

  validateWithdrawAmount(typeof parseFormattedNumber === 'function' ? parseFormattedNumber(input.value) : 5000000);
}

/**
 * 1. Validate realtime: Shake error animation + border đỏ
 */
function validateWithdrawAmount(amount) {
  const input = document.getElementById('withdrawAmountInput');
  const errorHint = document.getElementById('withdrawErrorHint');
  const successHint = document.getElementById('withdrawSuccessHint');
  const remainText = document.getElementById('withdrawRemainText');
  const submitBtn = document.getElementById('submitWithdrawBtn');

  if (!input) return;

  if (amount > MAX_AVAILABLE_BALANCE) {
    input.classList.add('shake-error');
    if (errorHint) errorHint.style.display = 'flex';
    if (successHint) successHint.style.display = 'none';
    if (submitBtn) submitBtn.disabled = true;

    setTimeout(() => {
      input.classList.remove('shake-error');
      input.style.borderColor = '#ef4444';
    }, 450);
  } else {
    input.style.borderColor = '';
    if (errorHint) errorHint.style.display = 'none';

    if (amount >= 50000) {
      if (successHint) successHint.style.display = 'flex';
      const remain = MAX_AVAILABLE_BALANCE - amount;
      const formattedRemain = typeof formatNumber === 'function' ? formatNumber(remain) : remain;
      if (remainText) remainText.textContent = `Số dư còn lại dự kiến: ${formattedRemain} ₫`;
      if (submitBtn) submitBtn.disabled = false;
    } else {
      if (successHint) successHint.style.display = 'none';
    }
  }
}

/**
 * 2. Nút cộng nhanh số tiền
 */
function addAmount(amount) {
  const input = document.getElementById('withdrawAmountInput');
  if (!input) return;
  const current = typeof parseFormattedNumber === 'function' ? parseFormattedNumber(input.value) : 0;
  const next = current + amount;
  input.value = typeof formatNumber === 'function' ? formatNumber(next) : next;
  validateWithdrawAmount(next);
  if (typeof showToast === 'function') {
    showToast(`Đã thêm +${typeof formatNumber === 'function' ? formatNumber(amount) : amount} ₫ vào số tiền rút`, 'info');
  }
}

function setAllAmount(total) {
  const input = document.getElementById('withdrawAmountInput');
  if (!input) return;
  input.value = typeof formatNumber === 'function' ? formatNumber(total) : total;
  validateWithdrawAmount(total);
  if (typeof showToast === 'function') {
    showToast(`Đã chọn rút toàn bộ số dư: ${typeof formatNumber === 'function' ? formatNumber(total) : total} ₫`, 'info');
  }
}

/**
 * 3. Radio card selection
 */
function selectBank(card) {
  document.querySelectorAll('.bank-option-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  const bankTitle = card.querySelector('.bank-text h4');
  const bankName = bankTitle ? bankTitle.childNodes[0].textContent.trim() : 'Ngân hàng đã chọn';
  if (typeof showToast === 'function') {
    showToast(`Đã chọn phương thức: ${bankName}`, 'info');
  }
}

/**
 * 4. Xử lý Submit rút tiền với Button Loading + Progress Stepper Modal 4 bước
 */
function handleWithdrawSubmit() {
  const input = document.getElementById('withdrawAmountInput');
  const amount = typeof parseFormattedNumber === 'function' ? parseFormattedNumber(input ? input.value : 0) : 0;

  if (amount < 50000) {
    if (typeof showToast === 'function') {
      showToast('Số tiền rút tối thiểu là 50.000 ₫!', 'warning');
    }
    return;
  }

  if (amount > MAX_AVAILABLE_BALANCE) {
    if (typeof showToast === 'function') {
      showToast('Số tiền rút vượt quá số dư khả dụng!', 'danger');
    }
    return;
  }

  const submitBtn = document.getElementById('submitWithdrawBtn');
  if (submitBtn) {
    submitBtn.classList.add('btn-loading');
    submitBtn.disabled = true;
  }

  const selectedBank = document.querySelector('.bank-option-card.selected .bank-text h4');
  const bankName = selectedBank ? selectedBank.childNodes[0].textContent.trim() : 'Vietcombank';

  setTimeout(() => {
    if (submitBtn) {
      submitBtn.classList.remove('btn-loading');
      submitBtn.disabled = false;
    }
    openWithdrawStepperModal(amount, bankName);
  }, 400);
}

/**
 * 5. Progress Stepper Modal 4 bước Napas 24/7
 */
function openWithdrawStepperModal(amount, bankName) {
  const modal = document.getElementById('withdrawStepperModal');
  const formatted = typeof formatNumber === 'function' ? formatNumber(amount) : amount;

  if (!modal) {
    if (typeof showToast === 'function') {
      showToast(`✅ Lệnh rút ${formatted} ₫ về ${bankName} thành công qua Napas 247!`, 'success');
    }
    return;
  }

  const amountDisplay = document.getElementById('modalWithdrawAmount');
  const bankDisplay = document.getElementById('modalWithdrawBank');
  const lineFill = document.getElementById('stepperLineFill');
  const statusText = document.getElementById('stepperStatusText');
  const completeBtn = document.getElementById('stepperCompleteBtn');

  if (amountDisplay) amountDisplay.textContent = `${formatted} ₫`;
  if (bankDisplay) bankDisplay.textContent = `Về tài khoản: ${bankName}`;
  if (completeBtn) completeBtn.style.display = 'none';

  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('active'), 10);

  const steps = [
    document.getElementById('step1'),
    document.getElementById('step2'),
    document.getElementById('step3'),
    document.getElementById('step4')
  ];

  steps.forEach(s => {
    if (s) s.classList.remove('active', 'completed');
  });

  // Bước 1: Khởi tạo
  if (steps[0]) steps[0].classList.add('active');
  if (lineFill) lineFill.style.width = '0%';
  if (statusText) statusText.innerHTML = '🔄 <strong>Bước 1/4:</strong> Đang khởi tạo mã giao dịch bảo mật và xác thực OTP...';

  // Bước 2: Duyệt sàn
  setTimeout(() => {
    if (steps[0]) { steps[0].classList.remove('active'); steps[0].classList.add('completed'); }
    if (steps[1]) steps[1].classList.add('active');
    if (lineFill) lineFill.style.width = '33%';
    if (statusText) statusText.innerHTML = '🛡️ <strong>Bước 2/4:</strong> Hệ thống kiểm tra số dư và tự động duyệt lệnh...';
  }, 1000);

  // Bước 3: Napas 247
  setTimeout(() => {
    if (steps[1]) { steps[1].classList.remove('active'); steps[1].classList.add('completed'); }
    if (steps[2]) steps[2].classList.add('active');
    if (lineFill) lineFill.style.width = '66%';
    if (statusText) statusText.innerHTML = '⚡ <strong>Bước 3/4:</strong> Đang gửi lệnh chuyển tiền tức thì qua cổng Napas 24/7...';
  }, 2000);

  // Bước 4: Thành công
  setTimeout(() => {
    steps.forEach(s => { if (s) { s.classList.remove('active'); s.classList.add('completed'); } });
    if (lineFill) lineFill.style.width = '100%';
    if (statusText) statusText.innerHTML = '🎉 <strong style="color: var(--success);">Hoàn tất!</strong> Tiền đã chuyển thẳng vào tài khoản ngân hàng của bạn.';
    if (completeBtn) completeBtn.style.display = 'inline-flex';

    if (typeof showToast === 'function') {
      showToast(`✅ Đã giải ngân thành công ${formatted} ₫ vào tài khoản ${bankName}!`, 'success');
    }
  }, 3000);
}

function closeWithdrawModal() {
  const modal = document.getElementById('withdrawStepperModal');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
    }, 250);
  }
}
