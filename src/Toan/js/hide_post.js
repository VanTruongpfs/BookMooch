document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // 1. LẤY CÁC PHẦN TỬ TRÊN TRANG
    // =========================================================

    const backBtn = document.querySelector(".back-btn");

    const historyBtn = document.querySelector(
        '.icon-btn[aria-label="Lịch sử"]'
    );

    const viewPostBtn = document.querySelector(".view-link");

    const changeTemplateBtn = document.querySelector(".btn-text");

    const cancelBtn = document.querySelector(
        ".bottom-action-bar .btn-outline"
    );

    const confirmBtn = document.querySelector(
        ".bottom-action-bar .btn-danger"
    );

    const optionCards = document.querySelectorAll(".option-card");

    const checkItems = document.querySelectorAll(".check-item");

    const textarea = document.querySelector(".textarea-input");

    const authorNameElement = document.querySelector(".author-name");

    const postMeta = document.querySelector(".post-meta");


    // =========================================================
    // 2. HÀM HIỂN THỊ TOAST
    // =========================================================

    function showToast(message, type = "normal") {

        // Xóa toast cũ
        const oldToast =
            document.querySelector(".hide-post-toast");

        if (oldToast) {
            oldToast.remove();
        }


        // Tạo toast
        const toast = document.createElement("div");

        toast.className = "hide-post-toast";

        toast.textContent = message;


        // CSS cho toast
        toast.style.position = "fixed";
        toast.style.right = "24px";
        toast.style.bottom = "24px";

        toast.style.zIndex = "9999";

        toast.style.padding = "12px 18px";

        toast.style.borderRadius = "8px";

        toast.style.background = "#FFFFFF";

        toast.style.color = "#0F172A";

        toast.style.fontSize = "14px";

        toast.style.fontWeight = "600";

        toast.style.border = "1px solid #E2E8F0";

        toast.style.boxShadow =
            "0 8px 20px rgba(15, 23, 42, 0.15)";


        // Màu theo loại thông báo
        if (type === "success") {

            toast.style.borderColor = "#16A34A";

        } else if (type === "danger") {

            toast.style.borderColor = "#EF4444";

        } else if (type === "warning") {

            toast.style.borderColor = "#F59E0B";
        }


        document.body.appendChild(toast);


        // Tự xóa sau 2.5 giây
        setTimeout(function () {

            if (toast) {
                toast.remove();
            }

        }, 2500);
    }


    // =========================================================
    // 3. CHỌN PHẠM VI XỬ LÝ
    // =========================================================

    optionCards.forEach(function (card) {

        card.addEventListener("click", function () {

            // Tìm radio bên trong card
            const radio =
                card.querySelector('input[type="radio"]');


            if (!radio) {
                return;
            }


            // Chọn radio
            radio.checked = true;


            // Xóa trạng thái active của tất cả card
            optionCards.forEach(function (otherCard) {

                otherCard.classList.remove(
                    "option-card-active"
                );


                // Xóa chấm tròn
                const indicator =
                    otherCard.querySelector(
                        ".radio-indicator"
                    );


                if (indicator) {

                    indicator.innerHTML = "";
                }
            });


            // Active card hiện tại
            card.classList.add(
                "option-card-active"
            );


            // Thêm chấm tròn
            const indicator =
                card.querySelector(
                    ".radio-indicator"
                );


            if (indicator) {

                indicator.innerHTML =
                    '<span class="inner-dot"></span>';
            }


            // Cập nhật thông báo
            updateAlertMessage();


            showToast(
                "Đã chọn phạm vi xử lý."
            );
        });
    });


    // =========================================================
    // 4. CHỌN / BỎ CHỌN LÝ DO VI PHẠM
    // =========================================================

    checkItems.forEach(function (item) {

        item.addEventListener("click", function () {

            const checkBox =
                item.querySelector(".check-box");


            if (!checkBox) {
                return;
            }


            // Kiểm tra trạng thái hiện tại
            const isChecked =
                checkBox.classList.contains("checked");


            if (isChecked) {

                // Bỏ chọn
                checkBox.classList.remove("checked");

                item.classList.remove(
                    "check-item-active"
                );

                checkBox.innerHTML = "";

            } else {

                // Chọn
                checkBox.classList.add("checked");

                item.classList.add(
                    "check-item-active"
                );


                // Thêm dấu tick
                checkBox.innerHTML = `
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="3"
                    >
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                `;
            }


            // Cập nhật nội dung thông báo
            updateAlertMessage();
        });
    });


    // =========================================================
    // 5. CẬP NHẬT NỘI DUNG CẢNH BÁO
    // =========================================================

    function updateAlertMessage() {

        const selectedOption =
            document.querySelector(
                ".option-card-active strong"
            );


        const alertTitle =
            document.querySelector(".alert-title");


        const alertDesc =
            document.querySelector(".alert-desc");


        if (!selectedOption) {
            return;
        }


        const selectedText =
            selectedOption.textContent.trim();


        if (selectedText.includes("24h")) {

            alertTitle.textContent =
                "Ẩn bài đăng tạm thời";


            alertDesc.textContent =
                "Bài viết sẽ được ẩn khỏi bảng tin trong 24 giờ và tự động khôi phục nếu không phát hiện thêm vi phạm.";

        } else if (
            selectedText.includes("vĩnh viễn")
        ) {

            alertTitle.textContent =
                "Ẩn bài đăng vĩnh viễn";


            alertDesc.textContent =
                "Bài viết sẽ bị xóa khỏi hệ thống và mọi tương tác với bài đăng sẽ bị khóa.";

        } else {

            alertTitle.textContent =
                "Hành động kỷ luật bắt buộc";


            alertDesc.textContent =
                "Hành động này sẽ gỡ bài viết khỏi bảng tin công khai và gửi thông báo kỷ luật chính thức đến thành viên.";
        }
    }


    // =========================================================
    // 6. ĐỔI MẪU TIN NHẮN
    // =========================================================

    if (changeTemplateBtn) {

        changeTemplateBtn.addEventListener(
            "click",
            function () {

                const templates = [

                    {
                        name:
                            "Mẫu: Tiêu chuẩn cộng đồng Khoản 4.2 (Tài chính)",

                        message:
                            "Chào bạn @hoangnam_tech, bài viết của bạn đã bị ẩn do vi phạm Tiêu chuẩn Cộng đồng - Khoản 4.2 về việc chèn liên kết tài chính độc hại/lôi kéo mạo hiểm..."
                    },

                    {
                        name:
                            "Mẫu: Spam và liên kết độc hại",

                        message:
                            "Chào bạn @hoangnam_tech, bài viết của bạn đã bị ẩn vì chứa liên kết có dấu hiệu spam hoặc gây ảnh hưởng đến sự an toàn của cộng đồng. Vui lòng kiểm tra lại nội dung trước khi đăng lại..."
                    },

                    {
                        name:
                            "Mẫu: Nội dung không phù hợp",

                        message:
                            "Chào bạn @hoangnam_tech, bài viết của bạn đã bị ẩn do vi phạm quy định nội dung của cộng đồng. Bạn vui lòng xem lại Tiêu chuẩn Cộng đồng trước khi tiếp tục đăng bài..."
                    }

                ];


                // Lấy mẫu hiện tại
                let currentTemplate =
                    textarea.dataset.templateIndex;


                if (
                    currentTemplate === undefined
                ) {

                    currentTemplate = 0;

                } else {

                    currentTemplate =
                        parseInt(currentTemplate) + 1;
                }


                // Nếu vượt quá số mẫu
                if (
                    currentTemplate >= templates.length
                ) {

                    currentTemplate = 0;
                }


                // Lưu index
                textarea.dataset.templateIndex =
                    currentTemplate;


                // Lấy mẫu
                const template =
                    templates[currentTemplate];


                // Cập nhật textarea
                textarea.value =
                    template.message;


                // Cập nhật tên mẫu
                const templateStatus =
                    document.querySelector(
                        ".template-status-bar span:first-child"
                    );


                if (templateStatus) {

                    templateStatus.textContent =
                        template.name;
                }


                showToast(
                    "Đã đổi sang mẫu tin nhắn khác.",
                    "success"
                );
            }
        );
    }


    // =========================================================
    // 7. NÚT XEM BÀI GỐC
    // =========================================================

    if (viewPostBtn) {

        viewPostBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                showToast(
                    "Đang mở bài đăng gốc..."
                );


                // Demo
                setTimeout(function () {

                    alert(
                        "Đây là bài đăng gốc của @hoangnam_tech."
                    );

                }, 300);
            }
        );
    }


    // =========================================================
    // 8. NÚT LỊCH SỬ
    // =========================================================

    if (historyBtn) {

        historyBtn.addEventListener(
            "click",
            function () {

                alert(
                    "LỊCH SỬ KIỂM DUYỆT\n\n" +
                    "• 2 lần vi phạm trước đó\n" +
                    "• 14 báo cáo xấu\n" +
                    "• AI đánh giá: 87% rủi ro"
                );
            }
        );
    }


    // =========================================================
    // 9. NÚT QUAY LẠI
    // =========================================================

    if (backBtn) {

        backBtn.addEventListener(
            "click",
            function () {

                const confirmed = confirm(
                    "Bạn có muốn quay lại hàng đợi không?"
                );


                if (!confirmed) {
                    return;
                }


                // Quay lại trang trước
                if (window.history.length > 1) {

                    window.history.back();

                } else {

                    showToast(
                        "Không tìm thấy trang hàng đợi.",
                        "warning"
                    );
                }
            }
        );
    }


    // =========================================================
    // 10. NÚT HỦY BỎ THAO TÁC
    // =========================================================

    if (cancelBtn) {

        cancelBtn.addEventListener(
            "click",
            function () {

                const confirmed = confirm(
                    "Bạn có chắc muốn hủy thao tác hiện tại?"
                );


                if (!confirmed) {
                    return;
                }


                // Reset radio
                resetOptions();


                // Reset checkbox
                resetCheckboxes();


                // Reset textarea
                if (textarea) {

                    textarea.value =
                        "Chào bạn @hoangnam_tech, bài viết của bạn đã bị ẩn do vi phạm Tiêu chuẩn Cộng đồng - Khoản 4.2 về việc chèn liên kết tài chính độc hại/lôi kéo mạo hiểm...";
                }


                showToast(
                    "Đã hủy thao tác.",
                    "warning"
                );
            }
        );
    }


    // =========================================================
    // 11. RESET RADIO
    // =========================================================

    function resetOptions() {

        optionCards.forEach(
            function (card, index) {

                const radio =
                    card.querySelector(
                        'input[type="radio"]'
                    );


                const indicator =
                    card.querySelector(
                        ".radio-indicator"
                    );


                if (index === 0) {

                    // Card đầu tiên được chọn
                    card.classList.add(
                        "option-card-active"
                    );


                    if (radio) {
                        radio.checked = true;
                    }


                    if (indicator) {

                        indicator.innerHTML =
                            '<span class="inner-dot"></span>';
                    }

                } else {

                    card.classList.remove(
                        "option-card-active"
                    );


                    if (radio) {
                        radio.checked = false;
                    }


                    if (indicator) {

                        indicator.innerHTML = "";
                    }
                }
            }
        );
    }


    // =========================================================
    // 12. RESET CHECKBOX
    // =========================================================

    function resetCheckboxes() {

        checkItems.forEach(
            function (item, index) {

                const checkBox =
                    item.querySelector(".check-box");


                // Mặc định chọn lý do đầu tiên
                if (index === 0) {

                    item.classList.add(
                        "check-item-active"
                    );


                    checkBox.classList.add(
                        "checked"
                    );


                    checkBox.innerHTML = `
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="3"
                        >
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    `;

                } else {

                    item.classList.remove(
                        "check-item-active"
                    );


                    checkBox.classList.remove(
                        "checked"
                    );


                    checkBox.innerHTML = "";
                }
            }
        );
    }


    // =========================================================
    // 13. XÁC NHẬN ẨN BÀI ĐĂNG
    // =========================================================

    if (confirmBtn) {

        confirmBtn.addEventListener(
            "click",
            function () {

                // Lấy phạm vi xử lý
                const selectedOption =
                    document.querySelector(
                        ".option-card-active strong"
                    );


                // Lấy các lý do đã chọn
                const selectedReasons = [];


                checkItems.forEach(
                    function (item) {

                        const checkBox =
                            item.querySelector(
                                ".check-box"
                            );


                        if (
                            checkBox &&
                            checkBox.classList.contains(
                                "checked"
                            )
                        ) {

                            const label =
                                item.querySelector(
                                    ".check-label"
                                );


                            if (label) {

                                selectedReasons.push(
                                    label.textContent.trim()
                                );
                            }
                        }
                    }
                );


                // Kiểm tra phạm vi
                if (!selectedOption) {

                    showToast(
                        "Vui lòng chọn phạm vi xử lý.",
                        "danger"
                    );

                    return;
                }


                // Kiểm tra lý do
                if (selectedReasons.length === 0) {

                    showToast(
                        "Vui lòng chọn ít nhất một lý do vi phạm.",
                        "danger"
                    );

                    return;
                }


                // Lấy tên tác giả
                let authorName =
                    "@hoangnam_tech";


                if (authorNameElement) {

                    authorName =
                        authorNameElement.textContent.trim();
                }


                // Hiển thị thông tin xác nhận
                const confirmMessage =
                    "XÁC NHẬN XỬ LÝ\n\n" +

                    "Tác giả: " +
                    authorName +
                    "\n\n" +

                    "Phạm vi: " +
                    selectedOption.textContent.trim() +
                    "\n\n" +

                    "Lý do:\n" +
                    selectedReasons.join("\n") +
                    "\n\n" +

                    "Bài đăng sẽ bị ẩn và tác giả sẽ nhận được thông báo.";


                const confirmed =
                    confirm(confirmMessage);


                if (!confirmed) {
                    return;
                }


                // Thực hiện xử lý
                executeHidePost(
                    selectedOption.textContent.trim(),
                    selectedReasons
                );
            }
        );
    }


    // =========================================================
    // 14. THỰC HIỆN ẨN BÀI
    // =========================================================

    function executeHidePost(
        scope,
        reasons
    ) {

        // Khóa nút
        if (confirmBtn) {

            confirmBtn.disabled = true;

            confirmBtn.style.opacity = "0.6";

            confirmBtn.style.cursor =
                "not-allowed";
        }


        if (cancelBtn) {

            cancelBtn.disabled = true;

            cancelBtn.style.opacity = "0.6";

            cancelBtn.style.cursor =
                "not-allowed";
        }


        // Đổi text nút
        if (confirmBtn) {

            confirmBtn.innerHTML = `
                <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                >
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
                Đã xử lý
            `;
        }


        // Đổi alert
        const alertTitle =
            document.querySelector(".alert-title");


        const alertDesc =
            document.querySelector(".alert-desc");


        if (alertTitle) {

            alertTitle.textContent =
                "Đã ẩn bài đăng";
        }


        if (alertDesc) {

            alertDesc.textContent =
                "Bài đăng đã được xử lý thành công và thông báo kỷ luật đã được chuẩn bị cho tác giả.";
        }


        // Hiển thị toast
        showToast(
            "Đã xác nhận ẩn bài đăng thành công.",
            "success"
        );


        console.log(
            "=== MODERATION RESULT ==="
        );

        console.log(
            "Phạm vi:",
            scope
        );

        console.log(
            "Lý do:",
            reasons
        );

        console.log(
            "Tác giả:",
            authorNameElement
                ? authorNameElement.textContent.trim()
                : "Không xác định"
        );


        // Demo: làm mờ form
        setTimeout(function () {

            const form =
                document.querySelector(".action-form");


            if (form) {

                form.style.transition =
                    "opacity 0.5s";

                form.style.opacity = "0.65";
            }

        }, 500);
    }


    // =========================================================
    // 15. KHÔNG CHO LINK ĐỘC HẠI MỞ THẬT
    // =========================================================

    const linkBox =
        document.querySelector(".link-flag-box");


    if (linkBox) {

        linkBox.addEventListener(
            "click",
            function () {

                showToast(
                    "Liên kết này đã được hệ thống đánh dấu là độc hại.",
                    "danger"
                );
            }
        );
    }


    // =========================================================
    // 16. KHỞI TẠO TRANG
    // =========================================================

    updateAlertMessage();


    console.log(
        "Hide Post JavaScript đã được tải thành công."
    );

});