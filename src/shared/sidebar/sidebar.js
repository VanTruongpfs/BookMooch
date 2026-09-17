// Renders shared navigation from the current role stored by the host application.
const commonGroups = [
    { title: "Tài khoản & Hồ sơ", items: [["◉", "Hồ sơ cá nhân", "/vu/profile/profile.html"], ["•", "Đổi mật khẩu", "/vu/auth/reset-password/reset-password.html"], ["¤", "Ví & Số dư", "#wallet"]] },
    { title: "Mua hàng & Đơn hàng", items: [["▣", "Quản lý đơn hàng mua", "#buy-orders"], ["↗", "Trạng thái đơn hàng", "#order-status"], ["★", "Truyện yêu thích", "#favorites"]] },
    { title: "Trao đổi & Đàm phán", items: [["⇄", "Phòng trao đổi giá", "#negotiations"], ["≋", "Đơn hàng đàm phán", "#negotiated-orders"]] },
    { title: "Hỗ trợ & Chăm sóc", items: [["!", "Gửi khiếu nại", "/vu/complain/complain.html"], ["?", "Gửi yêu cầu hỗ trợ", "/vu/request_support/request_support.html"], ["◷", "Lịch sử yêu cầu", "#support-history"]] }
];
const roleGroups = {
    SELLER: { title: "Giao diện Người bán", items: [["◈", "Kênh Người Bán", "#seller-channel"], ["+", "Đăng bán truyện", "#sell-book"], ["▤", "Quản lý bài đăng", "#seller-posts"], ["▣", "Đơn hàng bán", "#seller-orders"], ["◇", "Voucher shop", "#shop-vouchers"], ["▥", "Thống kê doanh thu", "#seller-stats"]] },
    ADMIN: { title: "Quản trị / Nhân viên", items: [["◆", "Admin Dashboard", "#admin-dashboard"], ["✓", "Kiểm duyệt bài đăng", "#moderation"], ["!", "Khiếu nại & báo cáo", "#admin-complaints"], ["♙", "Quản lý tài khoản", "#accounts"], ["₫", "Cấu hình biểu phí", "#fees"], ["↥", "Duyệt rút tiền", "#withdrawals"]] },
    MANAGER: { title: "Quản trị / Nhân viên", items: [["◆", "Admin Dashboard", "#admin-dashboard"], ["✓", "Kiểm duyệt bài đăng", "#moderation"], ["!", "Khiếu nại & báo cáo", "#admin-complaints"], ["♙", "Quản lý tài khoản", "#accounts"], ["₫", "Cấu hình biểu phí", "#fees"], ["↥", "Duyệt rút tiền", "#withdrawals"]] }
};

function getRole() { return localStorage.getItem("userRole") || "BUYER"; }
function renderGroup(group, currentPath) {
    const section = document.createElement("section");
    section.className = "sidebar-group";
    section.innerHTML = `<h2 class="sidebar-group-title">${group.title}</h2>`;
    group.items.forEach(([icon, label, href]) => {
        const link = document.createElement("a");
        link.className = `sidebar-link ${currentPath === href ? "active" : ""}`;
        link.href = href;
        link.innerHTML = `<span class="sidebar-link-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
        section.append(link);
    });
    return section;
}

export async function mountSidebar(mount = document.querySelector("[data-sidebar-mount]")) {
    if (!mount) return;
    const response = await fetch("/shared/sidebar/sidebar.html");
    mount.innerHTML = await response.text();
    const role = getRole();
    const userName = localStorage.getItem("userName") || "Thành viên";
    mount.querySelector("[data-sidebar-name]").textContent = userName;
    mount.querySelector("[data-sidebar-role]").textContent = role;
    mount.querySelector("[data-sidebar-avatar]").textContent = userName.slice(0, 2).toUpperCase();
    const currentPath = window.location.pathname;
    const navigation = mount.querySelector("[data-sidebar-nav]");
    commonGroups.forEach((group) => navigation.append(renderGroup(group, currentPath)));
    if (roleGroups[role]) navigation.append(renderGroup(roleGroups[role], currentPath));
}

mountSidebar();