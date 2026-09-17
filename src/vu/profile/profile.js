import { setFieldError, showToast, validateEmail } from "../../vu/auth/shared/auth-shared.js";

const PROFILE_KEY = "bookmooch_profile";
const roles = { BUYER: ["Khách hàng", "U", "Mở kênh Người bán", "#seller-channel"], SELLER: ["Người bán", "S", "Mở kênh Người bán", "#seller-channel"], ADMIN: ["Quản trị viên", "A", "Trang Quản trị Admin", "#admin-dashboard"], MANAGER: ["Quản trị viên", "M", "Trang Quản trị Admin", "#admin-dashboard"] };
const role = localStorage.getItem("userRole") || "BUYER";
const fields = { fullName: document.querySelector("#full-name"), email: document.querySelector("#email"), phone: document.querySelector("#phone"), address: document.querySelector("#address") };
const saved = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") || { fullName: localStorage.getItem("userName") || "Thành viên", email: "member@example.com", phone: "", address: "" };
const roleInfo = roles[role] || roles.BUYER;

function renderProfile() { Object.entries(fields).forEach(([name, input]) => { input.value = saved[name] || ""; }); document.querySelector("[data-display-name]").textContent = saved.fullName; document.querySelector("[data-display-email]").textContent = saved.email; document.querySelector("[data-role-badge]").textContent = roleInfo[0]; document.querySelector("[data-role-label]").textContent = roleInfo[0]; document.querySelector("[data-role-symbol]").textContent = roleInfo[1]; const action = document.querySelector("[data-role-action]"); action.textContent = roleInfo[2]; action.href = roleInfo[3]; }
renderProfile();

document.querySelector("#avatar-input").addEventListener("change", (event) => { const file = event.target.files[0]; if (!file) return; const reader = new FileReader(); reader.addEventListener("load", () => { document.querySelector("[data-avatar]").innerHTML = `<img src="${reader.result}" alt="Ảnh đại diện">`; localStorage.setItem("bookmooch_avatar", reader.result); }); reader.readAsDataURL(file); });
const savedAvatar = localStorage.getItem("bookmooch_avatar");
if (savedAvatar) document.querySelector("[data-avatar]").innerHTML = `<img src="${savedAvatar}" alt="Ảnh đại diện">`;

document.querySelector("#profile-form").addEventListener("submit", (event) => { event.preventDefault(); const emailError = validateEmail(fields.email.value.trim()) ? "" : "Vui lòng nhập email hợp lệ."; const nameError = fields.fullName.value.trim() ? "" : "Vui lòng nhập tên đăng nhập."; setFieldError(fields.email, document.querySelector("[data-error-for='email']"), emailError); setFieldError(fields.fullName, document.querySelector("[data-error-for='fullName']"), nameError); if (emailError || nameError) return; const profile = Object.fromEntries(Object.entries(fields).map(([name, input]) => [name, input.value.trim()])); localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); localStorage.setItem("userName", profile.fullName); saved.fullName = profile.fullName; saved.email = profile.email; document.querySelector("[data-display-name]").textContent = profile.fullName; document.querySelector("[data-display-email]").textContent = profile.email; showToast("Thông tin hồ sơ đã được lưu.", "success"); });