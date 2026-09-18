document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // 1. KHAI BÁO CÁC ELEMENT
    // =========================================================

    const postActionCards = document.querySelectorAll(
        'input[name="post_action"]'
    );

    const accountActionCards = document.querySelectorAll(
        'input[name="acc_action"]'
    );

    const checkboxInputs = document.querySelectorAll(
        '.check-box-card input[type="checkbox"]'
    );

    const auditTextarea = document.querySelector(".textarea-audit");

    const revealMediaBtn = document.querySelector(".btn-reveal-media");

    const backBtn = document.querySelector(".back-btn");

    const profileBtn = document.querySelector(".btn-profile");

    const historyBtn = document.querySelector(
        '.icon-btn[aria-label="Lịch sử"]'
    );

    const optionsBtn = document.querySelector(
        '.icon-btn[aria-label="Tùy chọn"]'
    );

    const escalateBtn = document.querySelector(
        '.btn.btn-outline'
    );

    const applyBtn = document.querySelector(
        '.btn.btn-primary'
    );

    const maliciousLinks = document.querySelectorAll(
        ".malicious-link"
    );


    // =========================================================
    // 2. RADIO - PHẠM VI ẨN BÀI VIẾT
    // =========================================================

    postActionCards.forEach(function (radio) {

        radio.addEventListener("change", function () {

            // Tìm tất cả card chứa radio
            const cards = document.querySelectorAll(
                'input[name="post_action"]'
            );

            cards.forEach(function (item) {

                const card = item.closest(".radio-card");
                const customRadio = card.querySelector(".custom-radio");

                card.classList.remove("radio-card-active");

                // Xóa dấu chấm cũ
                const oldDot = customRadio.querySelector(".radio-dot");

                if (oldDot) {
                    oldDot.remove();
                }
            });


            // Card đang được chọn
            const selectedCard = radio.closest(".radio-card");

            selectedCard.classList.add("radio-card-active");

            const selectedRadio = selectedCard.querySelector(
                ".custom-radio"
            );

            // Tạo dấu chấm
            const dot = document.createElement("span");

            dot.classList.add("radio-dot");

            selectedRadio.appendChild(dot);


            // Cập nhật thông báo
            updateAutomaticNotice();
        });
    });


    // =========================================================
    // 3. RADIO - XỬ PHẠT TÀI KHOẢN
    // =========================================================

    accountActionCards.forEach(function (radio) {

        radio.addEventListener("change", function () {

            const cards = document.querySelectorAll(
                'input[name="acc_action"]'
            );

            cards.forEach(function (item) {

                const card = item.closest(".radio-card");

                const customRadio = card.querySelector(
                    ".custom-radio"
                );

                card.classList.remove("radio-card-active");

                const oldDot = customRadio.querySelector(
                    ".radio-dot"
                );

                if (oldDot) {
                    oldDot.remove();
                }
            });


            // Card được chọn
            const selectedCard = radio.closest(".radio-card");

            selectedCard.classList.add("radio-card-active");

            const selectedRadio = selectedCard.querySelector(
                ".custom-radio"
            );

            const dot = document.createElement("span");

            dot.classList.add("radio-dot");

            selectedRadio.appendChild(dot);


            // Cập nhật thông báo
            updateAutomaticNotice();
        });
    });


    // =========================================================
    // 4. CHECKBOX - LÝ DO VI PHẠM
    // =========================================================

    checkboxInputs.forEach(function (checkbox) {

        checkbox.addEventListener("change", function () {

            const card = checkbox.closest(".check-box-card");

            const customCheckbox = card.querySelector(
                ".custom-checkbox"
            );


            if (checkbox.checked) {

                card.classList.add(
                    "check-box-card-active"
                );

                customCheckbox.classList.add("checked");


                // Nếu chưa có icon check thì tạo
                if (!customCheckbox.querySelector("svg")) {

                    const svg = document.createElementNS(
                        "http://www.w3.org/2000/svg",
                        "svg"
                    );

                    svg.setAttribute("width", "14");
                    svg.setAttribute("height", "14");
                    svg.setAttribute("viewBox", "0 0 24 24");
                    svg.setAttribute("fill", "none");
                    svg.setAttribute("stroke", "currentColor");
                    svg.setAttribute("stroke-width", "3");

                    const polyline =
                        document.createElementNS(
                            "http://www.w3.org/2000/svg",
                            "polyline"
                        );

                    polyline.setAttribute(
                        "points",
                        "20 6 9 17 4 12"
                    );

                    svg.appendChild(polyline);

                    customCheckbox.appendChild(svg);
                }

            } else {

                card.classList.remove(
                    "check-box-card-active"
                );

                customCheckbox.classList.remove(
                    "checked"
                );

                const svg = customCheckbox.querySelector("svg");

                if (svg) {
                    svg.remove();
                }
            }
        });
    });


    // =========================================================
    // 5. TẠM HIỆN ẢNH GỐC
    // =========================================================

    if (revealMediaBtn) {

        revealMediaBtn.addEventListener(
            "click",
            function () {

                const mediaBox =
                    document.querySelector(
                        ".media-restricted-box"
                    );

                const currentState =
                    mediaBox.dataset.revealed === "true";


                if (!currentState) {

                    mediaBox.dataset.revealed = "true";

                    mediaBox.innerHTML = `
                        <div class="media-icon-ring">
                            <svg width="24" height="24"
                                 viewBox="0 0 24 24"
                                 fill="none"
                                 stroke="currentColor"
                                 stroke-width="2">
                                <path d="M1 12s4-8 11-8
                                         11 8 11 8
                                         -4 8-11 8
                                         -11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                            </svg>
                        </div>

                        <p class="media-title">
                            Ảnh gốc đang được tạm hiển thị
                        </p>

                        <button class="btn-reveal-media">
                            Ẩn ảnh lại
                        </button>
                    `;


                    // Gắn sự kiện cho nút mới
                    mediaBox
                        .querySelector(".btn-reveal-media")
                        .addEventListener(
                            "click",
                            hideMedia
                        );

                }
            }
        );
    }


    function hideMedia() {

        const mediaBox =
            document.querySelector(
                ".media-restricted-box"
            );

        mediaBox.dataset.revealed = "false";

        mediaBox.innerHTML = `
            <div class="media-icon-ring">
                <svg width="24" height="24"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                    <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                    <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                    <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                    <rect x="7" y="7"
                          width="10"
                          height="10"
                          rx="1"/>
                </svg>
            </div>

            <p class="media-title">
                Ảnh chứa mã QR & thông tin lừa đảo nạp tiền
            </p>

            <button class="btn-reveal-media">
                Tạm hiện ảnh gốc
            </button>
        `;


        mediaBox
            .querySelector(".btn-reveal-media")
            .addEventListener(
                "click",
                function () {

                    mediaBox.dataset.revealed = "true";

                    mediaBox.innerHTML = `
                        <div class="media-icon-ring">
                            👁
                        </div>

                        <p class="media-title">
                            Ảnh gốc đang được tạm hiển thị
                        </p>

                        <button class="btn-reveal-media">
                            Ẩn ảnh lại
                        </button>
                    `;

                    mediaBox
                        .querySelector(
                            ".btn-reveal-media"
                        )
                        .addEventListener(
                            "click",
                            hideMedia
                        );
                }
            );
    }


    // =========================================================
    // 6. XEM HỒ SƠ
    // =========================================================

    if (profileBtn) {

        profileBtn.addEventListener(
            "click",
            function () {

                showToast(
                    "Đang mở hồ sơ @hoangnam_tech...",
                    "info"
                );

                setTimeout(function () {

                    alert(
                        "HỒ SƠ THÀNH VIÊN\n\n" +
                        "Username: @hoangnam_tech\n" +
                        "Cấp: 1\n" +
                        "Vi phạm trước đó: 2 lần\n" +
                        "Trạng thái: Đang được kiểm duyệt"
                    );

                }, 500);
            }
        );
    }


    // =========================================================
    // 7. LỊCH SỬ
    // =========================================================

    if (historyBtn) {

        historyBtn.addEventListener(
            "click",
            function () {

                alert(
                    "LỊCH SỬ XỬ LÝ\n\n" +
                    "• 09:42 - Hệ thống AI phát hiện\n" +
                    "• 09:43 - Báo cáo đầu tiên\n" +
                    "• 09:51 - Nhận ý kiến thành viên\n" +
                    "• Hiện tại - Đang chờ Mod xử lý"
                );
            }
        );
    }


    // =========================================================
    // 8. MENU TÙY CHỌN
    // =========================================================

    if (optionsBtn) {

        optionsBtn.addEventListener(
            "click",
            function () {

                showToast(
                    "Menu tùy chọn đang được mở",
                    "info"
                );

                console.log(
                    "Moderation options clicked"
                );
            }
        );
    }


    // =========================================================
    // 9. QUAY LẠI
    // =========================================================

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                const confirmBack =
                    confirm(
                        "Bạn có chắc muốn quay lại?\n" +
                        "Các thay đổi chưa lưu sẽ bị mất."
                    );

                if (confirmBack) {

                    if (window.history.length > 1) {

                        window.history.back();

                    } else {

                        window.location.href = "#queue";
                    }
                }
            }
        );
    }


    // =========================================================
    // 10. CHUYỂN DUYỆT
    // =========================================================

    if (escalateBtn) {

        escalateBtn.addEventListener(
            "click",
            function () {

                const confirmEscalate =
                    confirm(
                        "Chuyển báo cáo #RP-8492 cho cấp duyệt cao hơn?\n\n" +
                        "Vụ việc sẽ được đánh dấu cần xem xét."
                    );

                if (confirmEscalate) {

                    showToast(
                        "Đã chuyển vụ việc cho cấp duyệt cao hơn.",
                        "success"
                    );

                    updateStatus(
                        "ĐÃ CHUYỂN DUYỆT",
                        "status-ai"
                    );
                }
            }
        );
    }


    // =========================================================
    // 11. ÁP DỤNG XỬ LÝ NGAY
    // =========================================================

    if (applyBtn) {

        applyBtn.addEventListener(
            "click",
            function () {

                // Kiểm tra ghi chú
                const note =
                    auditTextarea.value.trim();


                if (note === "") {

                    showToast(
                        "Vui lòng nhập ghi chú nội bộ trước khi xử lý.",
                        "error"
                    );

                    auditTextarea.focus();

                    auditTextarea.style.borderColor =
                        "var(--danger)";

                    return;
                }


                // Kiểm tra checkbox
                const selectedViolations =
                    document.querySelectorAll(
                        '.check-box-card input[type="checkbox"]:checked'
                    );


                if (selectedViolations.length === 0) {

                    showToast(
                        "Vui lòng chọn ít nhất một lý do vi phạm.",
                        "error"
                    );

                    return;
                }


                // Lấy hành động bài viết
                const selectedPostAction =
                    document.querySelector(
                        'input[name="post_action"]:checked'
                    );


                // Lấy hành động tài khoản
                const selectedAccountAction =
                    document.querySelector(
                        'input[name="acc_action"]:checked'
                    );


                const postText =
                    selectedPostAction
                        .closest(".radio-card")
                        .querySelector("strong")
                        .innerText;

                const accountText =
                    selectedAccountAction
                        .closest(".radio-card")
                        .querySelector("strong")
                        .innerText;


                const confirmApply =
                    confirm(
                        "XÁC NHẬN XỬ LÝ\n\n" +
                        "Bài viết:\n" +
                        postText +
                        "\n\n" +
                        "Tài khoản:\n" +
                        accountText +
                        "\n\n" +
                        "Bạn có chắc muốn áp dụng?"
                    );


                if (!confirmApply) {
                    return;
                }


                // Xử lý thành công
                showToast(
                    "Đã áp dụng xử lý thành công!",
                    "success"
                );


                // Đổi trạng thái
                updateStatus(
                    "ĐÃ XỬ LÝ",
                    "status-ai"
                );


                // Disable nút
                applyBtn.disabled = true;

                applyBtn.style.opacity = "0.6";

                applyBtn.style.cursor =
                    "not-allowed";


                applyBtn.innerHTML = `
                    <svg width="18" height="18"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         stroke-width="2">
                        <polyline
                            points="20 6 9 17 4 12">
                        </polyline>
                    </svg>

                    Đã xử lý
                `;
            }
        );
    }


    // =========================================================
    // 12. CHẶN LINK ĐỘC HẠI TRONG PREVIEW
    // =========================================================

    maliciousLinks.forEach(function (link) {

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showToast(
                    "Đây là liên kết được đánh dấu nguy hiểm. Không mở trực tiếp.",
                    "error"
                );
            }
        );
    });


    // Link "Xem bài gốc"
    const originalLink =
        document.querySelector(".link-original");

    if (originalLink) {

        originalLink.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                showToast(
                    "Đang mở bài viết trong chế độ kiểm duyệt.",
                    "info"
                );
            }
        );
    }


    // =========================================================
    // 13. CẬP NHẬT THÔNG BÁO TỰ ĐỘNG
    // =========================================================

    function updateAutomaticNotice() {

        const selectedAccountAction =
            document.querySelector(
                'input[name="acc_action"]:checked'
            );


        if (!selectedAccountAction) {
            return;
        }


        const actionText =
            selectedAccountAction
                .closest(".radio-card")
                .querySelector("strong")
                .innerText;


        const noticeBox =
            document.querySelector(
                ".auto-notice-box"
            );


        if (!noticeBox) {
            return;
        }


        let accountMessage = "";


        switch (actionText) {

            case "Cấm đăng bài 7 ngày":

                accountMessage =
                    "Tài khoản bị đình chỉ đăng bài 7 ngày.";

                break;


            case "Khóa vĩnh viễn":

                accountMessage =
                    "Tài khoản của bạn đã bị khóa vĩnh viễn.";

                break;


            case "Cảnh cáo & Trừ điểm":

                accountMessage =
                    "Tài khoản bị cảnh cáo và trừ 20 điểm uy tín.";

                break;


            case "Bác bỏ tố cáo":

                accountMessage =
                    "Sau khi xem xét, báo cáo đã được bác bỏ.";

                break;


            default:

                accountMessage =
                    "Tài khoản đã được xử lý theo quy định.";
        }


        noticeBox.querySelector("p").innerText =
            "Bài viết của bạn tại nhóm " +
            "[Giao Lưu Lập Trình Viên VN] " +
            "đã được xử lý do chứa nội dung vi phạm quy chuẩn. " +
            accountMessage;
    }


    // =========================================================
    // 14. UPDATE TRẠNG THÁI VỤ VIỆC
    // =========================================================

    function updateStatus(text, className) {

        const status =
            document.querySelector(
                ".status-urgent"
            );


        if (!status) {
            return;
        }


        status.classList.remove(
            "status-urgent"
        );

        status.classList.add(
            className
        );


        const pulse =
            status.querySelector(
                ".pulse-dot"
            );


        if (pulse) {
            pulse.remove();
        }


        status.innerText = text;
    }


    // =========================================================
    // 15. TOAST NOTIFICATION
    // =========================================================

    function showToast(message, type) {

        const oldToast =
            document.querySelector(
                ".custom-toast"
            );

        if (oldToast) {
            oldToast.remove();
        }


        const toast =
            document.createElement("div");


        toast.className =
            "custom-toast";


        toast.innerText = message;


        // Style bằng JS để không cần sửa CSS
        toast.style.position = "fixed";
        toast.style.right = "24px";
        toast.style.bottom = "24px";
        toast.style.zIndex = "9999";
        toast.style.padding = "14px 20px";
        toast.style.borderRadius = "10px";
        toast.style.background = "#0f172a";
        toast.style.color = "#ffffff";
        toast.style.fontFamily =
            "var(--font-body)";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "600";
        toast.style.boxShadow =
            "0 10px 25px rgba(0,0,0,0.15)";
        toast.style.maxWidth = "400px";
        toast.style.opacity = "0";
        toast.style.transform =
            "translateY(20px)";
        toast.style.transition =
            "all 0.25s ease";


        if (type === "success") {

            toast.style.borderLeft =
                "4px solid #22c55e";

        } else if (type === "error") {

            toast.style.borderLeft =
                "4px solid #dc2626";

        } else {

            toast.style.borderLeft =
                "4px solid #f97316";
        }


        document.body.appendChild(toast);


        // Animation xuất hiện
        setTimeout(function () {

            toast.style.opacity = "1";

            toast.style.transform =
                "translateY(0)";

        }, 10);


        // Tự động biến mất
        setTimeout(function () {

            toast.style.opacity = "0";

            toast.style.transform =
                "translateY(20px)";


            setTimeout(function () {

                toast.remove();

            }, 300);

        }, 3000);
    }


    // =========================================================
    // 16. XÓA BORDER ĐỎ KHI NHẬP GHI CHÚ
    // =========================================================

    if (auditTextarea) {

        auditTextarea.addEventListener(
            "input",
            function () {

                if (
                    auditTextarea.value.trim() !== ""
                ) {

                    auditTextarea.style.borderColor =
                        "";

                }
            }
        );
    }


    updateAutomaticNotice();


    console.log(
        "Report Resolution JS đã được khởi tạo."
    );

});