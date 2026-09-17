const toast = document.getElementById("toast");

function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}


// ==============================
// Toast buttons
// ==============================

document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => {
        showToast(button.dataset.toast);
    });
});


// ==============================
// Rating
// ==============================

const labels = [
    "",
    "Rất tệ",
    "Không hài lòng",
    "Bình thường",
    "Tốt",
    "Tuyệt vời"
];

document.querySelectorAll(".stars").forEach((group) => {

    const key = group.dataset.rating;
    const text = document.getElementById(key + "Text");

    group.querySelectorAll("button").forEach((button) => {

        button.addEventListener("click", () => {

            const value = Number(button.dataset.value);

            group.querySelectorAll("button").forEach((item) => {
                item.classList.toggle(
                    "selected",
                    Number(item.dataset.value) <= value
                );
            });

            group.dataset.value = value;

            text.textContent =
                `${value}/5 — ${labels[value]}`;
        });


        button.addEventListener("mouseenter", () => {

            const value = Number(button.dataset.value);

            group.querySelectorAll("button").forEach((item) => {
                item.classList.toggle(
                    "selected",
                    Number(item.dataset.value) <= value
                );
            });
        });

    });


    group.addEventListener("mouseleave", () => {

        const value = Number(group.dataset.value || 0);

        group.querySelectorAll("button").forEach((item) => {
            item.classList.toggle(
                "selected",
                Number(item.dataset.value) <= value
            );
        });

    });

});


// ==============================
// Review text counter
// ==============================

const reviewText = document.getElementById("reviewText");
const counter = document.getElementById("counter");

reviewText.addEventListener("input", () => {
    counter.textContent = reviewText.value.length;
});


// ==============================
// Review tags
// ==============================

document.querySelectorAll(".tags button").forEach((button) => {

    button.addEventListener("click", () => {
        button.classList.toggle("selected");
    });

});


// ==============================
// Image upload
// ==============================

const uploadBox = document.getElementById("uploadBox");
const input = document.getElementById("photoInput");
const previews = document.getElementById("previews");

let files = [];


uploadBox.addEventListener("click", () => {
    input.click();
});


input.addEventListener("change", () => {

    [...input.files].forEach((file) => {

        // Maximum 5MB
        if (file.size > 5 * 1024 * 1024) {
            showToast(`${file.name} vượt quá 5MB.`);
            return;
        }


        // Only JPG / PNG
        if (!["image/jpeg", "image/png"].includes(file.type)) {
            showToast(`${file.name} không đúng định dạng.`);
            return;
        }


        files.push(file);
    });


    renderPreviews();

    // Cho phép chọn lại cùng một file
    input.value = "";
});


function renderPreviews() {

    previews.innerHTML = "";

    files.forEach((file, index) => {

        const url = URL.createObjectURL(file);

        const wrap = document.createElement("div");

        wrap.className = "preview";

        wrap.innerHTML = `
            <img src="${url}" alt="Ảnh đánh giá">
            <button type="button" aria-label="Xóa">×</button>
        `;


        wrap.querySelector("button").addEventListener("click", () => {

            URL.revokeObjectURL(url);

            files.splice(index, 1);

            renderPreviews();

        });


        previews.appendChild(wrap);

    });
}


// ==============================
// Get review data
// ==============================

function getData() {

    return {

        quality:
            document
                .querySelector('[data-rating="quality"]')
                .dataset.value || "",

        packing:
            document
                .querySelector('[data-rating="packing"]')
                .dataset.value || "",

        seller:
            document
                .querySelector('[data-rating="seller"]')
                .dataset.value || "",

        text: reviewText.value,

        tags: [
            ...document.querySelectorAll(".tags .selected")
        ].map((element) => element.dataset.tag)

    };
}


// ==============================
// Apply saved data
// ==============================

function applyData(data) {

    ["quality", "packing", "seller"].forEach((key) => {

        if (data[key]) {

            const group =
                document.querySelector(
                    `[data-rating="${key}"]`
                );

            group.dataset.value = data[key];


            group.querySelectorAll("button").forEach((button) => {

                button.classList.toggle(
                    "selected",
                    Number(button.dataset.value) <= Number(data[key])
                );

            });


            document.getElementById(key + "Text").textContent =
                `${data[key]}/5 — ${labels[data[key]]}`;

        }

    });


    reviewText.value = data.text || "";

    counter.textContent = reviewText.value.length;


    (data.tags || []).forEach((tag) => {

        const button =
            document.querySelector(
                `.tags button[data-tag="${tag}"]`
            );

        if (button) {
            button.classList.add("selected");
        }

    });

}


// ==============================
// Save draft
// ==============================

document.getElementById("saveDraft").addEventListener("click", () => {

    localStorage.setItem(
        "mangatrade-review-draft",
        JSON.stringify(getData())
    );

    showToast(
        "Đã lưu bản nháp đánh giá trên thiết bị."
    );

});


// ==============================
// Restore draft
// ==============================

const draft =
    localStorage.getItem("mangatrade-review-draft");

if (draft) {

    try {

        applyData(JSON.parse(draft));

        showToast(
            "Đã khôi phục bản nháp đánh giá."
        );

    } catch (error) {

        console.error(
            "Không thể khôi phục bản nháp:",
            error
        );

    }

}


// ==============================
// Submit review
// ==============================

document
    .getElementById("submitReview")
    .addEventListener("click", () => {

        const data = getData();


        // Check rating
        if (
            !data.quality ||
            !data.packing ||
            !data.seller
        ) {

            showToast(
                "Vui lòng chấm đủ 3 tiêu chí trước khi gửi."
            );

            return;
        }


        // Check content
        if (
            !data.text.trim() &&
            !data.tags.length
        ) {

            showToast(
                "Hãy thêm cảm nhận hoặc ít nhất một điểm nổi bật."
            );

            return;
        }


        // Remove saved draft
        localStorage.removeItem(
            "mangatrade-review-draft"
        );


        // Success
        showToast(
            "Đã gửi đánh giá thành công. Cảm ơn bạn đã đóng góp cho cộng đồng!"
        );


        const submitButton =
            document.getElementById("submitReview");

        submitButton.disabled = true;

        submitButton.textContent = "✓ Đã gửi";

    });


// ==============================
// Search
// ==============================

document
    .getElementById("searchInput")
    .addEventListener("keydown", (event) => {

        if (
            event.key === "Enter" &&
            event.target.value.trim()
        ) {

            showToast(
                `Đang tìm kiếm: "${event.target.value.trim()}"`
            );

        }

    });


// ==============================
// Ctrl + K search shortcut
// ==============================

document.addEventListener("keydown", (event) => {

    if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
    ) {

        event.preventDefault();

        document
            .getElementById("searchInput")
            .focus();

    }

});


// ==============================
// Newsletter
// ==============================

document
    .getElementById("newsletter")
    .addEventListener("submit", (event) => {

        event.preventDefault();

        showToast(
            "Đăng ký bản tin thành công!"
        );

        document.getElementById("email").value = "";

    });