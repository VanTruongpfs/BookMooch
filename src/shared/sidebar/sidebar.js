// Renders shared navigation from the current role stored by the host application.
const commonGroups = [
    { title: "Tài khoản & Khám phá", items: [
        ["◈", "Trang Chủ ComicHub", "../../tin/html/home.html"],
        ["★", "Master Portal", "../../index.html"],
        ["◉", "Hồ sơ cá nhân", "../../vu/profile/profile.html"],
        ["⌂", "Quản lý địa chỉ", "../../vu/manage_address/manage_address.html"],
        ["¤", "Ví & Rút tiền", "../../truong/html/wallet.html"]
    ] },
    { title: "Mua hàng & Đơn hàng", items: [
        ["+", "Đăng tin tìm mua", "../../thuc/html/page1.html"],
        ["▣", "Quản lý đơn hàng mua", "../../thuc/html/page2.html"],
        ["↗", "Trạng thái đơn hàng GHN", "../../thuc/html/page3.html"],
        ["★", "Truyện yêu thích", "../../thuc/html/page6.html"]
    ] },
    { title: "Trao đổi & Đàm phán", items: [
        ["⇄", "Phòng trao đổi giá", "../../duy/html/dealing-room.html"],
        ["💬", "Chat đàm phán", "../../duy/html/dealing-chat.html"],
        ["≋", "Đơn hàng trao đổi", "../../duy/html/exchange-orders.html"]
    ] },
    { title: "Hỗ trợ & Chăm sóc", items: [
        ["!", "Gửi khiếu nại", "../../vu/complain/complain.html"],
        ["?", "Gửi yêu cầu hỗ trợ", "../../vu/request_support/request_support.html"],
        ["◷", "Đánh giá truyện", "../../thuc/html/page4.html"]
    ] }
];

const roleGroups = {
    SELLER: { title: "Giao diện Người bán", items: [
        ["◈", "Kênh Người Bán", "../../truong/html/index.html"],
        ["+", "Đăng bán truyện", "../../ttruongmap/dang-ban-truyen/index.html"],
        ["▤", "Quản lý bài đăng", "../../ttruongmap/quan-ly-bai-dang/index.html"],
        ["▣", "Đơn hàng bán", "../../truong/html/orders.html"],
        ["◇", "Voucher shop", "../../ttruongmap/quan-ly-voucher/index.html"],
        ["▥", "Thống kê doanh thu", "../../truong/html/revenue.html"]
    ] },
    ADMIN: { title: "Quản trị / Kiểm duyệt", items: [
        ["◆", "Admin Dashboard", "../../tu/html/dashboard.html"],
        ["✓", "Kiểm duyệt bài đăng", "../../Toan/html/postModeration.html"],
        ["!", "Khiếu nại & báo cáo", "../../Toan/html/report_resolution.html"],
        ["♙", "Quản lý tài khoản", "../../tu/html/accounts.html"],
        ["₫", "Cấu hình biểu phí", "../../tu/html/fees.html"],
        ["↥", "Bàn CSKH", "../../Toan/html/customer-support.html"]
    ] },
    MANAGER: { title: "Quản trị / Kiểm duyệt", items: [
        ["◆", "Admin Dashboard", "../../tu/html/dashboard.html"],
        ["✓", "Kiểm duyệt bài đăng", "../../Toan/html/postModeration.html"],
        ["!", "Khiếu nại & báo cáo", "../../Toan/html/report_resolution.html"],
        ["♙", "Quản lý tài khoản", "../../tu/html/accounts.html"],
        ["₫", "Cấu hình biểu phí", "../../tu/html/fees.html"],
        ["↥", "Bàn CSKH", "../../Toan/html/customer-support.html"]
    ] }
};

function getRole() { return localStorage.getItem("userRole") || "BUYER"; }

function renderGroup(group, currentPath) {
    const section = document.createElement("section");
    section.className = "sidebar-group";
    section.innerHTML = `<h2 class="sidebar-group-title">${group.title}</h2>`;
    group.items.forEach(([icon, label, href]) => {
        const link = document.createElement("a");
        link.className = `sidebar-link ${currentPath.includes(href) ? "active" : ""}`;
        link.href = href;
        link.innerHTML = `<span class="sidebar-link-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
        section.append(link);
    });
    return section;
}

export async function mountSidebar(mount = document.querySelector("[data-sidebar-mount]")) {
    if (!mount) return;
    let template = "";
    try {
        const response = await fetch("../../shared/sidebar/sidebar.html");
        if (response.ok) template = await response.text();
    } catch {
        try {
            const response = await fetch("/shared/sidebar/sidebar.html");
            if (response.ok) template = await response.text();
        } catch { }
    }
    if (!template) {
        template = `
        <aside class="app-sidebar" data-sidebar aria-label="Điều hướng chính">
            <div class="sidebar-brand">ComicHub <span>Hub</span></div>
            <div class="sidebar-profile"><span class="sidebar-avatar" data-sidebar-avatar>BM</span><div><strong data-sidebar-name>Thành viên</strong><small data-sidebar-role>BUYER</small></div></div>
            <nav data-sidebar-nav></nav>
        </aside>`;
    }
    mount.innerHTML = template;
    const role = getRole();
    const userName = localStorage.getItem("userName") || "Thành viên";
    const nameEl = mount.querySelector("[data-sidebar-name]");
    const roleEl = mount.querySelector("[data-sidebar-role]");
    const avatarEl = mount.querySelector("[data-sidebar-avatar]");
    if (nameEl) nameEl.textContent = userName;
    if (roleEl) roleEl.textContent = role;
    if (avatarEl) avatarEl.textContent = userName.slice(0, 2).toUpperCase();
    const currentPath = window.location.pathname;
    const navigation = mount.querySelector("[data-sidebar-nav]");
    if (navigation) {
        commonGroups.forEach((group) => navigation.append(renderGroup(group, currentPath)));
        if (roleGroups[role]) navigation.append(renderGroup(roleGroups[role], currentPath));
    }
}

mountSidebar();