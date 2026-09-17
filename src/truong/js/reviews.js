/**
 * ComicHub / BookMooch - Quản lý đánh giá (Reviews Logic)
 * Phục vụ riêng cho: reviews.html
 * Các hiệu ứng:
 * 1. Rating bar animation: thanh progress % mỗi mức sao chạy animate từ 0% khi load trang
 * 2. Filter theo sao: click vào số sao -> highlight + lọc mượt fade in/out card
 * 3. "Xem thêm / Thu gọn" cho comment dài với transition mượt mà
 * 4. Optimistic UI khi gửi phản hồi đánh giá: hiển thị phản hồi lập tức trước khi server xác nhận
 * 5. Load more đánh giá dài với icon loading spinner
 */

document.addEventListener('DOMContentLoaded', () => {
  initReviewsModule();
});

function initReviewsModule() {
  initRatingBarsAnimation();
  initReviewStarFilter();
  initCommentTextClamping();
}

/**
 * 1. Thanh Rating progress bar chạy mượt mà khi tải trang
 */
function initRatingBarsAnimation() {
  const progressFills = document.querySelectorAll('.rating-bars .progress-fill');
  if (!progressFills.length) return;

  progressFills.forEach(fill => {
    const targetWidth = fill.style.width || '0%';
    fill.style.width = '0%';
    setTimeout(() => {
      fill.style.width = targetWidth;
    }, 200);
  });
}

/**
 * 2. Filter đánh giá theo số sao với hiệu ứng fade in/out card
 */
function initReviewStarFilter() {
  const tabsBar = document.querySelector('.filter-tabs-bar');
  const reviewCards = document.querySelectorAll('.review-card');

  if (!tabsBar || !reviewCards.length) return;

  if (typeof initSlidingTabs === 'function') {
    initSlidingTabs(tabsBar, (btn) => {
      applyReviewFilter(btn, reviewCards);
    });
  } else {
    tabsBar.querySelectorAll('.tab-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        tabsBar.querySelectorAll('.tab-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyReviewFilter(btn, reviewCards);
      });
    });
  }
}

function applyReviewFilter(btn, reviewCards) {
  const text = btn.textContent.toLowerCase();
  let starTarget = 0;
  if (text.includes('5 sao')) starTarget = 5;
  else if (text.includes('4 sao')) starTarget = 4;
  else if (text.includes('3 sao')) starTarget = 3;
  else if (text.includes('chưa phản hồi')) starTarget = -1;

  let matchIndex = 0;
  reviewCards.forEach(card => {
    const starIcons = card.querySelectorAll('.review-stars .material-symbols-outlined.fill');
    const starCount = starIcons.length;
    const needsReply = card.querySelector('.badge-danger');

    let match = false;
    if (starTarget === 0) {
      match = true;
    } else if (starTarget === -1) {
      match = !!needsReply;
    } else {
      match = (starCount === starTarget);
    }

    if (match) {
      card.style.display = 'block';
      card.classList.remove('card-fade-out');
      card.classList.remove('card-fade-in');
      void card.offsetWidth; // Force layout
      card.classList.add('card-fade-in');
      card.style.animationDelay = `${matchIndex * 35}ms`;
      matchIndex++;
    } else {
      card.classList.remove('card-fade-in');
      card.classList.add('card-fade-out');
      setTimeout(() => {
        if (card.classList.contains('card-fade-out')) {
          card.style.display = 'none';
        }
      }, 200);
    }
  });

  if (typeof showToast === 'function') {
    showToast(`Đã lọc đánh giá: ${btn.textContent.trim()}`, 'info');
  }
}

/**
 * 3. "Xem thêm / Thu gọn" cho bình luận dài (Tính toán ScrollHeight tự động mượt mà)
 */
function initCommentTextClamping() {
  const commentTexts = document.querySelectorAll('.review-content-text');
  commentTexts.forEach(p => {
    if (p.textContent.trim().length > 120 && !p.nextElementSibling?.classList.contains('btn-see-more')) {
      p.classList.add('clamped');
      const seeMoreBtn = document.createElement('span');
      seeMoreBtn.className = 'btn-see-more';
      seeMoreBtn.textContent = 'Xem thêm ▾';
      seeMoreBtn.onclick = () => {
        if (p.classList.contains('clamped')) {
          // Mở rộng mượt mà
          p.classList.remove('clamped');
          p.style.maxHeight = '44px';
          p.style.overflow = 'hidden';
          const fullH = p.scrollHeight;
          p.style.transition = 'max-height 0.35s cubic-bezier(0.2, 0.9, 0.3, 1)';
          requestAnimationFrame(() => {
            p.style.maxHeight = `${fullH}px`;
          });
          seeMoreBtn.textContent = 'Thu gọn ▴';
          setTimeout(() => {
            p.classList.add('expanded');
            p.style.maxHeight = 'none';
          }, 360);
        } else {
          // Thu gọn mượt mà
          const currentH = p.scrollHeight;
          p.style.maxHeight = `${currentH}px`;
          p.style.overflow = 'hidden';
          p.classList.remove('expanded');
          void p.offsetHeight; // Force reflow
          p.style.transition = 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
          requestAnimationFrame(() => {
            p.style.maxHeight = '44px';
          });
          seeMoreBtn.textContent = 'Xem thêm ▾';
          setTimeout(() => {
            p.classList.add('clamped');
            p.style.maxHeight = '';
          }, 300);
        }
      };
      p.parentNode.insertBefore(seeMoreBtn, p.nextSibling);
    }
  });
}

/**
 * 4. Mở form phản hồi đánh giá
 */
function toggleReplyForm(btn) {
  const card = btn.closest('.review-card');
  if (!card) return;

  let formContainer = card.querySelector('.inline-reply-container');
  if (!formContainer) {
    formContainer = document.createElement('div');
    formContainer.className = 'inline-reply-container open';
    formContainer.innerHTML = `
      <div style="font-weight: 700; font-size: 0.85rem; margin-bottom: 6px; color: var(--text-main);">
        Viết phản hồi công khai từ Gian Hàng:
      </div>
      <textarea class="inline-reply-textarea" placeholder="Nhập lời cảm ơn hoặc giải đáp của shop dành cho độc giả..."></textarea>
      <div style="display: flex; justify-content: flex-end; gap: 8px;">
        <button class="btn btn-outline btn-sm" onclick="this.closest('.inline-reply-container').classList.remove('open')">Hủy bỏ</button>
        <button class="btn btn-primary btn-sm" onclick="submitOptimisticReply(this)">
          <span class="material-symbols-outlined" style="font-size: 16px;">send</span>
          Gửi phản hồi ngay
        </button>
      </div>
    `;
    card.appendChild(formContainer);
    formContainer.querySelector('textarea').focus();
  } else {
    formContainer.classList.toggle('open');
    if (formContainer.classList.contains('open')) {
      formContainer.querySelector('textarea').focus();
    }
  }
}

/**
 * 5. Optimistic UI: Phản hồi xuất hiện ngay lập tức trước khi server xác nhận
 */
function submitOptimisticReply(submitBtn) {
  const container = submitBtn.closest('.inline-reply-container');
  const card = submitBtn.closest('.review-card');
  if (!container || !card) return;

  const textarea = container.querySelector('textarea');
  const message = textarea ? textarea.value.trim() : '';

  if (!message) {
    if (typeof showToast === 'function') {
      showToast('Vui lòng nhập nội dung phản hồi!', 'warning');
    }
    return;
  }

  // Chèn ngay khối phản hồi vào DOM tức thì
  let existingReply = card.querySelector('.shop-reply-box');
  if (!existingReply) {
    existingReply = document.createElement('div');
    existingReply.className = 'shop-reply-box';
    card.insertBefore(existingReply, container);
  }

  const safeMessage = typeof escapeHtml === 'function' ? escapeHtml(message) : message;
  existingReply.innerHTML = `
    <div class="shop-reply-header">
      <div class="shop-reply-author">
        <span class="material-symbols-outlined" style="font-size: 16px;">storefront</span>
        Phản hồi từ Shop: Tiệm Truyện Vũ Trụ
      </div>
      <span class="shop-reply-time">Vừa xong (Optimistic UI)</span>
    </div>
    <p class="shop-reply-text">${safeMessage}</p>
  `;
  existingReply.style.animation = 'fadeIn 0.3s ease';

  // Cập nhật nhãn trạng thái sang "Đã phản hồi"
  const dangerBadge = card.querySelector('.badge-danger');
  if (dangerBadge) {
    dangerBadge.className = 'badge badge-success';
    dangerBadge.innerHTML = '<span class="badge-dot"></span> Đã phản hồi';
  }

  container.classList.remove('open');
  textarea.value = '';

  if (typeof showToast === 'function') {
    showToast('✅ Đã gửi phản hồi thành công! Độc giả sẽ nhận được thông báo.', 'success');
  }
}

/**
 * 6. Load more đánh giá dài với loading spinner
 */
function loadMoreReviews(btn) {
  if (!btn) return;
  btn.classList.add('btn-loading');

  setTimeout(() => {
    btn.classList.remove('btn-loading');

    const cardContainer = btn.closest('.content-body') || document.querySelector('.content-body');
    if (!cardContainer) return;

    const newCard = document.createElement('div');
    newCard.className = 'review-card';
    newCard.style.animation = 'slideDownFade 0.3s ease';
    newCard.innerHTML = `
      <div class="review-card-header">
        <div class="reviewer-profile">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" alt="Avatar Lan" class="reviewer-avatar">
          <div class="reviewer-info">
            <h4>
              Mai Phương Lan
              <span class="badge badge-success" style="font-size: 0.72rem; padding: 2px 7px;">Đã mua hàng</span>
            </h4>
            <div class="meta-time">5 phút trước • Đơn hàng #CH-99280</div>
          </div>
        </div>
        <button class="nav-icon-btn" style="width: 32px; height: 32px;"><span class="material-symbols-outlined">more_horiz</span></button>
      </div>
      <div class="review-stars">
        <span class="material-symbols-outlined fill">star</span>
        <span class="material-symbols-outlined fill">star</span>
        <span class="material-symbols-outlined fill">star</span>
        <span class="material-symbols-outlined fill">star</span>
        <span class="material-symbols-outlined fill">star</span>
      </div>
      <div class="review-product-attached">
        <span class="material-symbols-outlined" style="font-size: 16px;">menu_book</span>
        Chainsaw Man – Thợ Săn Quỷ Tập 11 &nbsp;|&nbsp; Phân loại: Bản Bìa Giới Hạn
      </div>
      <p class="review-content-text">
        Chất lượng truyện của tiệm chưa bao giờ làm mình thất vọng! Truyện mới tinh nguyên seal nilon, màng bọc khí rất dày. Bạn chủ shop còn tặng kèm 2 sticker Makima siêu nét. Sẽ tiếp tục theo dõi các đợt phát hành mới của tiệm.
      </p>
      <div class="shop-reply-box">
        <div class="shop-reply-header">
          <div class="shop-reply-author">
            <span class="material-symbols-outlined" style="font-size: 16px;">storefront</span>
            Phản hồi từ Shop: Tiệm Truyện Vũ Trụ
          </div>
          <span class="shop-reply-time">Vừa xong</span>
        </div>
        <p class="shop-reply-text">Tiệm cảm ơn bạn Lan nhiều nhé! Chúc bạn có trải nghiệm đọc truyện tuyệt vời nha.</p>
      </div>
    `;

    const pagination = cardContainer.querySelector('.pagination-wrapper');
    if (pagination) {
      cardContainer.insertBefore(newCard, pagination);
    } else {
      cardContainer.appendChild(newCard);
    }

    if (typeof showToast === 'function') {
      showToast('✅ Đã tải thêm đánh giá mới thành công!', 'success');
    }
  }, 500);
}
