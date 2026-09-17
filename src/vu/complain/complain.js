import { setFieldError, showToast } from "../../vu/auth/shared/auth-shared.js";

const STORAGE_KEY = "bookmooch_complaints";
const form = document.querySelector("#complain-form");
const list = document.querySelector("[data-complaint-list]");
const fileInput = document.querySelector("#evidence");
const fileNote = document.querySelector("[data-file-note]");
const readItems = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
const render = () => { const items = readItems(); list.replaceChildren(); if (!items.length) { list.innerHTML = "<p class='empty-state'>Chưa có khiếu nại nào được gửi.</p>"; return; } items.forEach((item) => { const article = document.createElement("article"); article.className = "history-item"; article.innerHTML = `<header><strong>${item.orderId} · ${item.issueType}</strong><span class="status-badge ${item.status === "Đang xử lý" ? "processing" : ""}">${item.status}</span></header><p>${item.description}</p><time>${item.createdAt}</time>`; list.append(article); }); };
fileInput.addEventListener("change", () => { fileNote.textContent = fileInput.files.length ? `${fileInput.files.length} tệp đã chọn` : "Chưa chọn tệp"; });
form.addEventListener("submit", (event) => { event.preventDefault(); const values = Object.fromEntries(new FormData(form).entries()); const orderError = values.orderId?.trim() ? "" : "Vui lòng nhập mã đơn hàng."; const descriptionError = values.description?.trim() ? "" : "Vui lòng mô tả sự cố."; setFieldError(document.querySelector("#order-id"), document.querySelector("[data-error-for='orderId']"), orderError); setFieldError(document.querySelector("#description"), document.querySelector("[data-error-for='description']"), descriptionError); if (orderError || descriptionError) return; const items = readItems(); items.unshift({ orderId: values.orderId.trim(), issueType: values.issueType, description: values.description.trim(), status: "Đang chờ", createdAt: new Date().toLocaleString("vi-VN") }); localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); form.reset(); fileNote.textContent = "Chưa chọn tệp"; render(); showToast("Khiếu nại đã được gửi.", "success"); });
render();