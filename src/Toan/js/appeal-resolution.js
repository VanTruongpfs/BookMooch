document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // 1. LẤY CÁC PHẦN TỬ HTML
    // =========================================================

    const backBtn = document.querySelector(".back-btn");

    const historyBtn = document.querySelector(
        '.icon-btn[aria-label="Lịch sử thay đổi"]'
    );

    const optionBtn = document.querySelector(
        '.icon-btn[aria-label="Tùy chọn"]'
    );

    const originalCaseLink = document.querySelector(".link-original-case");

    const decisionCards = document.querySelectorAll(".decision-card");

    const macroChips = document.querySelectorAll(".chip-macro");

    const replyTextarea = document.querySelector(".textarea-reply");

    const charCount = document.querySelector(".char-count");

    const auditTextarea = document.querySelector(".textarea-audit");

    const saveDraftBtn = document.querySelector(".btn-outline-action");

    const publishBtn = document.querySelector(".btn-primary-action");

    const readyTitle = document.querySelector(".ready-title");

    const readyDesc = document.querySelector(".ready-desc");

    const actionReadyCard = document.querySelector(".action-ready-card");


    // =========================================================
    // 2. HÀM HIỂN THỊ THÔNG BÁO
    // =========================================================

    function showToast(message, type) {

        const oldToast = document.querySelector(".vanguard-toast");

        if (oldToast) {
            oldToast.remove();
        }

        const toast = document.createElement("div");

        toast.className = "vanguard-toast";

        let background = "#0f172a";

        if (type === "success") {
            background = "#16a34a";
        }

        if (type === "danger") {
            background = "#dc2626";
        }

        if (type === "warning") {
            background = "#f59e0b";
        }

        toast.style.position = "fixed";
        toast.style.right = "24px";
        toast.style.bottom = "24px";
        toast.style.zIndex = "9999";
        toast.style.padding = "14px 18px";
        toast.style.borderRadius = "10px";
        toast.style.background = background;
        toast.style.color = "#ffffff";
        toast.style.fontFamily = "var(--font-body)";
        toast.style.fontSize = "14px";
        toast.style.fontWeight = "600";
        toast.style.boxShadow = "0 10px 25px rgba(15, 23, 42, 0.15)";
        toast.style.maxWidth = "420px";
        toast.style.transition = "all 0.3s ease";

        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(function () {
            toast.style.opacity = "0";
            toast.style.transform = "translateY(10px)";

            setTimeout(function () {
                toast.remove();
            }, 300);

        }, 3000);
    }


    // =========================================================
    // 3. CHỌN PHƯƠNG ÁN PHÁN QUYẾT
    // =========================================================

    decisionCards.forEach(function (card) {

        card.addEventListener("click", function () {

            // Bỏ active ở tất cả card
            decisionCards.forEach(function (item) {

                item.classList.remove("decision-card-active");

                const radio = item.querySelector(
                    'input[type="radio"]'
                );

                if (radio) {
                    radio.checked = false;
                }

                const customRadio = item.querySelector(".custom-radio");

                if (customRadio) {
                    customRadio.innerHTML = "";
                }
            });


            // Active card đang chọn
            card.classList.add("decision-card-active");

            const radio = card.querySelector(
                'input[type="radio"]'
            );

            if (radio) {
                radio.checked = true;
            }


            // Tạo dấu chấm bên trong radio
            const customRadio = card.querySelector(".custom-radio");

            if (customRadio) {

                const dot = document.createElement("span");

                dot.className = "radio-inner-dot";

                customRadio.appendChild(dot);
            }


            // Cập nhật nội dung khu vực ban hành
            updateDecisionStatus();

        });

    });


    // =========================================================
    // 4. CẬP NHẬT TRẠNG THÁI PHÁN QUYẾT
    // =========================================================

    function updateDecisionStatus() {

        const selectedCard = document.querySelector(
            ".decision-card-active"
        );

        if (!selectedCard) {
            return;
        }

        const titleElement = selectedCard.querySelector(
            ".decision-title-row strong"
        );

        if (!titleElement) {
            return;
        }

        const decisionText = titleElement.textContent.trim();


        // Chấp thuận & mở khóa
        if (decisionText === "Chấp thuận & Mở khóa ngay") {

            readyTitle.textContent =
                "Sẵn sàng ban hành phán quyết #APL-8921";

            readyDesc.textContent =
                "Gửi email tự động và cập nhật trạng thái án phạt: gỡ bỏ hoàn toàn.";

            actionReadyCard.style.background = "#dcfce7";
            actionReadyCard.style.borderColor = "#16a34a";

            return;
        }


        // Giảm án
        if (decisionText === "Giảm nhẹ án phạt xuống 24 giờ") {

            readyTitle.textContent =
                "Sẵn sàng ban hành phán quyết #APL-8921";

            readyDesc.textContent =
                "Gửi email tự động và cập nhật trạng thái án phạt xuống còn 24 giờ.";

            actionReadyCard.style.background = "var(--primary-light)";
            actionReadyCard.style.borderColor = "var(--primary)";

            return;
        }


        // Bác bỏ
        if (decisionText === "Bác bỏ khiếu nại & Giữ y án") {

            readyTitle.textContent =
                "Sẵn sàng ban hành phán quyết #APL-8921";

            readyDesc.textContent =
                "Gửi email tự động và duy trì án phạt hiện hành 7 ngày.";

            actionReadyCard.style.background = "#fee2e2";
            actionReadyCard.style.borderColor = "#dc2626";

            return;
        }


        // Chuyển cấp cao
        if (decisionText === "Chuyển Thẩm định Cấp cao") {

            readyTitle.textContent =
                "Sẵn sàng chuyển hồ sơ #APL-8921";

            readyDesc.textContent =
                "Hồ sơ sẽ được chuyển đến bộ phận thẩm định cấp cao Tier-3.";

            actionReadyCard.style.background = "#eff4ff";
            actionReadyCard.style.borderColor = "#1e40af";
        }
    }


    // =========================================================
    // 5. MACRO CHIPS - MẪU PHẢN HỒI
    // =========================================================

    macroChips.forEach(function (chip) {

        chip.addEventListener("click", function () {

            // Bỏ active tất cả
            macroChips.forEach(function (item) {
                item.classList.remove("chip-macro-active");
            });

            // Active chip hiện tại
            chip.classList.add("chip-macro-active");


            const chipText = chip.textContent.trim();


            // ---------------------------------------------
            // Mẫu: Giảm án
            // ---------------------------------------------

            if (chipText === "Giảm án") {

                replyTextarea.value =
                    "Chào bạn @hoangnam_tech, Bộ phận Kiểm duyệt An toàn Cộng đồng đã tiếp nhận và rà soát kháng nghị #APL-8921. Sau khi đối chiếu nhật ký truyền tải mạng, chúng tôi nhận thấy hành động gửi lặp của bạn không mang tính chất lừa đảo, tuy nhiên vẫn vi phạm chính sách chống rác dữ liệu. Chúng tôi quyết định giảm mức phạt xuống còn 24h.";

                updateCharCount();

                showToast(
                    "Đã áp dụng mẫu phản hồi: Giảm án",
                    "success"
                );

                return;
            }


            // ---------------------------------------------
            // Mẫu: Bác bỏ
            // ---------------------------------------------

            if (chipText === "Bác bỏ (Tái phạm)") {

                replyTextarea.value =
                    "Chào bạn @hoangnam_tech, chúng tôi đã tiếp nhận kháng nghị #APL-8921 và hoàn tất quá trình đối soát. Qua kiểm tra lịch sử vi phạm và dữ liệu hệ thống, hành vi spam tự động đã được ghi nhận trước đó. Vì vậy, khiếu nại chưa đủ cơ sở để thay đổi quyết định ban đầu và án phạt 7 ngày sẽ được giữ nguyên.";

                updateCharCount();

                showToast(
                    "Đã áp dụng mẫu phản hồi: Bác bỏ",
                    "warning"
                );

                return;
            }


            // ---------------------------------------------
            // Mẫu: Yêu cầu CCCD
            // ---------------------------------------------

            if (chipText === "Yêu cầu CCCD") {

                replyTextarea.value =
                    "Chào bạn @hoangnam_tech, để tiếp tục quá trình xác minh kháng nghị #APL-8921, vui lòng cung cấp thông tin định danh theo yêu cầu của bộ phận Kiểm duyệt An toàn Cộng đồng. Hồ sơ sẽ được tiếp tục xử lý sau khi thông tin xác minh được tiếp nhận.";

                updateCharCount();

                showToast(
                    "Đã áp dụng mẫu yêu cầu xác minh",
                    "success"
                );
            }

        });

    });


    // =========================================================
    // 6. ĐẾM SỐ KÝ TỰ PHẢN HỒI
    // =========================================================

    function updateCharCount() {

        if (!replyTextarea || !charCount) {
            return;
        }

        const count = replyTextarea.value.length;

        charCount.textContent = count + " ký tự";
    }


    if (replyTextarea) {

        replyTextarea.addEventListener(
            "input",
            updateCharCount
        );

        updateCharCount();
    }


    // =========================================================
    // 7. LINK ÁN PHẠT GỐC
    // =========================================================

    if (originalCaseLink) {

        originalCaseLink.addEventListener("click", function (event) {

            event.preventDefault();

            showToast(
                "Đang mở hồ sơ án phạt gốc #RP-8492...",
                "warning"
            );

            setTimeout(function () {

                alert(
                    "HỒ SƠ ÁN PHẠT GỐC\n\n" +
                    "Mã hồ sơ: #RP-8492\n" +
                    "Hình thức: Khóa tính năng đăng bài 7 ngày\n" +
                    "Lý do: Nghi vấn spam tự động bot v3\n" +
                    "Trạng thái: Có hiệu lực"
                );

            }, 300);

        });

    }


    // =========================================================
    // 8. NÚT LỊCH SỬ THAY ĐỔI
    // =========================================================

    if (historyBtn) {

        historyBtn.addEventListener("click", function () {

            alert(
                "LỊCH SỬ THAY ĐỔI #APL-8921\n\n" +
                "09:42 - Bot Sentinel tạo án phạt #RP-8492\n" +
                "10:15 - Người dùng gửi kháng nghị\n" +
                "10:18 - Hồ sơ được chuyển sang Mod cấp 2\n" +
                "10:25 - Bắt đầu đối soát telemetry\n" +
                "Hiện tại - Đang chờ ban hành phán quyết"
            );

        });

    }


    // =========================================================
    // 9. NÚT TÙY CHỌN
    // =========================================================

    if (optionBtn) {

        optionBtn.addEventListener("click", function () {

            const choice = prompt(
                "TÙY CHỌN HỒ SƠ\n\n" +
                "Nhập lựa chọn:\n" +
                "1 - Đánh dấu cần kiểm tra thêm\n" +
                "2 - Chuyển Mod khác\n" +
                "3 - Sao chép mã hồ sơ"
            );


            if (choice === "1") {

                showToast(
                    "Đã đánh dấu hồ sơ cần kiểm tra thêm.",
                    "warning"
                );

            }
            else if (choice === "2") {

                showToast(
                    "Đã gửi yêu cầu chuyển hồ sơ.",
                    "success"
                );

            }
            else if (choice === "3") {

                copyCaseId();

            }
            else if (choice !== null && choice !== "") {

                showToast(
                    "Lựa chọn không hợp lệ.",
                    "danger"
                );

            }

        });

    }


    // =========================================================
    // 10. COPY MÃ HỒ SƠ
    // =========================================================

    function copyCaseId() {

        const caseId = "#APL-8921";


        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            navigator.clipboard.writeText(caseId)
                .then(function () {

                    showToast(
                        "Đã sao chép mã hồ sơ " + caseId,
                        "success"
                    );

                })
                .catch(function () {

                    showToast(
                        "Không thể sao chép mã hồ sơ.",
                        "danger"
                    );

                });

        }
        else {

            showToast(
                "Trình duyệt không hỗ trợ sao chép tự động.",
                "danger"
            );

        }
    }


    // =========================================================
    // 11. NÚT QUAY LẠI
    // =========================================================

    if (backBtn) {

        backBtn.addEventListener("click", function () {

            const confirmed = confirm(
                "Bạn có chắc muốn quay lại hàng đợi?\n\n" +
                "Các thay đổi chưa lưu sẽ không được ban hành."
            );


            if (!confirmed) {
                return;
            }


            if (window.history.length > 1) {

                window.history.back();

            }
            else {

                showToast(
                    "Không có trang trước để quay lại.",
                    "warning"
                );

            }

        });

    }


    // =========================================================
    // 12. CÁC FILE ĐÍNH KÈM
    // =========================================================

    const attachmentChips =
        document.querySelectorAll(".attachment-chip");


    attachmentChips.forEach(function (attachment) {

        attachment.addEventListener("click", function (event) {

            event.preventDefault();

            const fileNameElement =
                attachment.querySelector("span");

            let fileName = "Tệp đính kèm";

            if (fileNameElement) {
                fileName = fileNameElement.textContent.trim();
            }

            showToast(
                "Đang mở tệp: " + fileName,
                "warning"
            );


            setTimeout(function () {

                alert(
                    "FILE PREVIEW\n\n" +
                    fileName +
                    "\n\n" +
                    "Demo: Tệp được mô phỏng trong giao diện quản trị."
                );

            }, 300);

        });

    });


    // =========================================================
    // 13. TEXTAREA AUDIT - KIỂM TRA GHI CHÚ NỘI BỘ
    // =========================================================

    if (auditTextarea) {

        auditTextarea.addEventListener("input", function () {

            const text = auditTextarea.value.trim();

            if (text.length === 0) {

                auditTextarea.style.borderColor =
                    "var(--danger)";

            }
            else {

                auditTextarea.style.borderColor =
                    "var(--neutral-200)";

            }

        });

    }


    // =========================================================
    // 14. LƯU NHÁP
    // =========================================================

    if (saveDraftBtn) {

        saveDraftBtn.addEventListener("click", function () {

            const selectedDecision =
                getSelectedDecision();

            const reply =
                replyTextarea
                    ? replyTextarea.value.trim()
                    : "";

            const audit =
                auditTextarea
                    ? auditTextarea.value.trim()
                    : "";


            if (!selectedDecision) {

                showToast(
                    "Vui lòng chọn phương án phán quyết trước khi lưu.",
                    "danger"
                );

                return;
            }


            if (audit.length === 0) {

                showToast(
                    "Vui lòng nhập ghi chú kiểm duyệt nội bộ.",
                    "danger"
                );

                auditTextarea.focus();

                return;
            }


            // Mô phỏng lưu dữ liệu
            const draftData = {
                caseId: "#APL-8921",
                decision: selectedDecision,
                reply: reply,
                audit: audit,
                savedAt: new Date().toLocaleString("vi-VN")
            };


            console.log(
                "DRAFT SAVED:",
                draftData
            );


            showToast(
                "Đã lưu bản nháp phán quyết #APL-8921.",
                "success"
            );


            // Đổi trạng thái nút trong thời gian ngắn
            const originalText =
                saveDraftBtn.textContent;

            saveDraftBtn.textContent =
                "Đã lưu nháp";

            setTimeout(function () {

                saveDraftBtn.textContent =
                    originalText;

            }, 2000);

        });

    }


    // =========================================================
    // 15. LẤY PHÁN QUYẾT ĐANG CHỌN
    // =========================================================

    function getSelectedDecision() {

        const selectedCard =
            document.querySelector(
                ".decision-card-active"
            );


        if (!selectedCard) {
            return null;
        }


        const titleElement =
            selectedCard.querySelector(
                ".decision-title-row strong"
            );


        if (!titleElement) {
            return null;
        }


        return titleElement.textContent.trim();
    }


    // =========================================================
    // 16. BAN HÀNH PHÁN QUYẾT
    // =========================================================

    if (publishBtn) {

        publishBtn.addEventListener("click", function () {

            const selectedDecision =
                getSelectedDecision();


            const reply =
                replyTextarea
                    ? replyTextarea.value.trim()
                    : "";


            const audit =
                auditTextarea
                    ? auditTextarea.value.trim()
                    : "";


            // ---------------------------------------------
            // Kiểm tra phương án
            // ---------------------------------------------

            if (!selectedDecision) {

                showToast(
                    "Vui lòng chọn phương án phán quyết.",
                    "danger"
                );

                return;
            }


            // ---------------------------------------------
            // Kiểm tra phản hồi
            // ---------------------------------------------

            if (reply.length === 0) {

                showToast(
                    "Phản hồi người dùng không được để trống.",
                    "danger"
                );

                replyTextarea.focus();

                return;
            }


            // ---------------------------------------------
            // Kiểm tra audit
            // ---------------------------------------------

            if (audit.length === 0) {

                showToast(
                    "Vui lòng nhập ghi chú kiểm duyệt nội bộ.",
                    "danger"
                );

                auditTextarea.focus();

                return;
            }


            // ---------------------------------------------
            // Hiển thị xác nhận
            // ---------------------------------------------

            const confirmed = confirm(

                "XÁC NHẬN BAN HÀNH PHÁN QUYẾT\n\n" +

                "Hồ sơ: #APL-8921\n" +

                "Phán quyết:\n" +
                selectedDecision +
                "\n\n" +

                "Hệ thống sẽ:\n" +
                "- Cập nhật trạng thái án phạt\n" +
                "- Gửi phản hồi vào Inbox\n" +
                "- Gửi email cho người dùng\n" +
                "- Lưu log kiểm duyệt\n\n" +

                "Bạn có chắc muốn ban hành?"
            );


            if (!confirmed) {
                return;
            }


            executeResolution(
                selectedDecision,
                reply,
                audit
            );

        });

    }


    // =========================================================
    // 17. THỰC THI PHÁN QUYẾT
    // =========================================================

    function executeResolution(
        selectedDecision,
        reply,
        audit
    ) {

        // Disable nút
        publishBtn.disabled = true;
        saveDraftBtn.disabled = true;

        publishBtn.style.opacity = "0.6";
        saveDraftBtn.style.opacity = "0.6";
        publishBtn.style.cursor = "not-allowed";
        saveDraftBtn.style.cursor = "not-allowed";


        // Hiển thị đang xử lý
        publishBtn.textContent =
            "Đang ban hành...";


        readyTitle.textContent =
            "Đang ban hành phán quyết #APL-8921";

        readyDesc.textContent =
            "Hệ thống đang cập nhật trạng thái và gửi thông báo người dùng.";


        showToast(
            "Đang xử lý phán quyết...",
            "warning"
        );


        // Mô phỏng API xử lý
        setTimeout(function () {

            const resolutionData = {

                caseId: "#APL-8921",

                decision: selectedDecision,

                reply: reply,

                audit: audit,

                moderator: "Mod_Agent_442",

                resolvedAt:
                    new Date().toLocaleString("vi-VN")

            };


            console.log(
                "RESOLUTION PUBLISHED:",
                resolutionData
            );


            // ---------------------------------------------
            // Cập nhật giao diện
            // ---------------------------------------------

            publishBtn.disabled = true;

            publishBtn.style.opacity = "1";
            publishBtn.style.cursor = "default";

            publishBtn.innerHTML =
                `
                <svg width="18" height="18"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     stroke-width="2.5">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Đã ban hành
                `;


            readyTitle.textContent =
                "Đã ban hành phán quyết #APL-8921";

            readyDesc.textContent =
                "Phán quyết đã được ghi nhận và thông báo đã được gửi đến người dùng.";


            actionReadyCard.style.background =
                "#dcfce7";

            actionReadyCard.style.borderColor =
                "#16a34a";


            const readyDot =
                document.querySelector(".ready-dot");

            if (readyDot) {

                readyDot.style.background =
                    "#16a34a";

            }


            showToast(
                "Phán quyết #APL-8921 đã được ban hành thành công.",
                "success"
            );


            // ---------------------------------------------
            // Khóa form sau khi ban hành
            // ---------------------------------------------

            decisionCards.forEach(function (card) {

                card.style.pointerEvents =
                    "none";

                card.style.opacity =
                    "0.7";

            });


            macroChips.forEach(function (chip) {

                chip.style.pointerEvents =
                    "none";

                chip.style.opacity =
                    "0.7";

            });


            if (replyTextarea) {
                replyTextarea.readOnly = true;
            }

            if (auditTextarea) {
                auditTextarea.readOnly = true;
            }


        }, 1800);

    }


    // =========================================================
    // 18. CẢNH BÁO KHI RỜI TRANG NẾU CÓ THAY ĐỔI
    // =========================================================

    let formChanged = false;


    decisionCards.forEach(function (card) {

        card.addEventListener("click", function () {

            formChanged = true;

        });

    });


    macroChips.forEach(function (chip) {

        chip.addEventListener("click", function () {

            formChanged = true;

        });

    });


    if (replyTextarea) {

        replyTextarea.addEventListener("input", function () {

            formChanged = true;

        });

    }


    if (auditTextarea) {

        auditTextarea.addEventListener("input", function () {

            formChanged = true;

        });

    }


    // =========================================================
    // 19. KHỞI TẠO TRẠNG THÁI BAN ĐẦU
    // =========================================================

    function initializeDecisionCards() {

        decisionCards.forEach(function (card) {

            const radio =
                card.querySelector(
                    'input[type="radio"]'
                );

            const customRadio =
                card.querySelector(".custom-radio");


            if (
                radio &&
                radio.checked
            ) {

                card.classList.add(
                    "decision-card-active"
                );


                if (
                    customRadio &&
                    !customRadio.querySelector(
                        ".radio-inner-dot"
                    )
                ) {

                    const dot =
                        document.createElement("span");

                    dot.className =
                        "radio-inner-dot";

                    customRadio.appendChild(dot);
                }

            }
            else {

                card.classList.remove(
                    "decision-card-active"
                );

            }

        });


        updateDecisionStatus();

    }


    initializeDecisionCards();


    // =========================================================
    // 20. LOG KIỂM TRA
    // =========================================================

    console.log(
        "Vanguard Appeal Resolution UI đã khởi tạo thành công."
    );

});