/* =====================================================
   PHÒNG TRAO ĐỔI GIÁ — dealing-chat.js
   2 góc nhìn: "proposer" (người đề nghị) và "owner" (chủ sở hữu)
   Đổi vai trò: nút "Góc nhìn" trên trang hoặc ?role=owner | ?role=proposer

   Quy ước tiền (money) trong mỗi đề xuất:
     money > 0  → Người đề nghị bù thêm cho chủ sở hữu
     money < 0  → Chủ sở hữu bù thêm cho người đề nghị
     money = 0  → Không bù tiền
===================================================== */
(function () {
    'use strict';

    /* ---------- CẤU HÌNH ---------- */
    var ORDER_PAGE = 'negotiation-order.html';   // trang "Tạo đơn hàng đàm phán"
    var DEAL_CODE = 'NG-2298';                   // mã đơn sinh ra sau khi chốt deal
    var MAX_MONEY = 100000000;

    /* ---------- DỮ LIỆU MẪU (thay bằng dữ liệu từ backend) ---------- */
    var USERS = {
        owner: {
            key: 'owner', name: 'Minh Thư Comics', short: 'Minh Thư', initials: 'MT',
            roleLabel: 'Chủ sở hữu', verified: true, rating: 4.9, reviews: 218,
            deals: 186, successRate: 98, response: '~10 phút',
            location: 'Q.5, TP. Hồ Chí Minh', since: '03/2022'
        },
        proposer: {
            key: 'proposer', name: 'Huy Dương', short: 'Huy Dương', initials: 'HD',
            roleLabel: 'Người đề nghị', verified: true, rating: 4.7, reviews: 41,
            deals: 32, successRate: 94, response: '~25 phút',
            location: 'Q. Hải Châu, Đà Nẵng', since: '09/2023'
        }
    };

    var ITEM = {
        title: 'One Piece — Trọn bộ tập 1–10',
        cover: 'https://placehold.co/240x320/1e293b/FDBA74?text=ONE+PIECE',
        price: 320000,
        tags: ['Manga', 'Bìa mềm', '10 tập'],
        specs: [
            ['Tình trạng', 'Đã đọc · còn ~90%'],
            ['Nhà xuất bản', 'NXB Kim Đồng'],
            ['Năm in', '2019'],
            ['Ngôn ngữ', 'Tiếng Việt'],
            ['Số tập', '10 tập (1–10)'],
            ['Đăng lúc', '20/09/2026']
        ],
        note: 'Sách giữ gáy tốt, không rách bìa. Có 1 tập hơi ố nhẹ ở mép trang. Có thể gửi thêm ảnh thực tế.',
        wants: ['Naruto', 'Bleach', 'Dragon Ball', 'Tiền mặt']
    };

    var INVENTORY = [
        { id: 'c1', title: 'Naruto', vol: 'Tập 1–10', cond: '85%', value: 180000, series: 'Naruto', bg: 'C2410C' },
        { id: 'c2', title: 'Bleach', vol: 'Tập 1–8', cond: '90%', value: 130000, series: 'Bleach', bg: '334155' },
        { id: 'c3', title: 'Dragon Ball', vol: 'Tập 1–12', cond: '80%', value: 200000, series: 'Dragon Ball', bg: 'B45309' },
        { id: 'c4', title: 'Doraemon Đại tuyển tập', vol: 'Tập 1–3', cond: '95%', value: 90000, series: 'Doraemon', bg: '0F172A' },
        { id: 'c5', title: 'Thám Tử Conan', vol: 'Tập 40–45', cond: '88%', value: 110000, series: 'Conan', bg: '1E293B' },
        { id: 'c6', title: 'Attack on Titan', vol: 'Tập 1–5', cond: '92%', value: 150000, series: 'Attack on Titan', bg: '64748B' }
    ];

    var STATUS_LABEL = { pending: 'Đang chờ', accepted: 'Đã đồng ý', declined: 'Đã từ chối', superseded: 'Đã thay thế' };
    var QUICK = {
        proposer: ['Cho mình xin thêm ảnh thực tế nhé', 'Bạn giữ bộ này đến khi nào?', 'Mình có thể nhận trực tiếp không?'],
        owner: ['Mình đang tìm Naruto / Bleach', 'Bạn gửi thêm ảnh tình trạng các tập nhé', 'Mình chỉ đổi khi có bù thêm tiền']
    };

    /* ---------- TRẠNG THÁI ---------- */
    var params = new URLSearchParams(location.search);
    var state = {
        role: params.get('role') === 'owner' ? 'owner' : 'proposer',
        room: { code: '#PT2049', status: 'negotiating' },
        offers: [
            { id: 1, by: 'proposer', comics: ['c1'], money: 60000, note: 'Mình bù thêm chút tiền nhé.', status: 'superseded', edited: false, time: '14:07' },
            { id: 2, by: 'owner', comics: ['c1'], money: 140000, note: 'Bộ của mình còn rất mới, bạn bù giúp mình mức này nha.', status: 'pending', edited: false, time: '14:10' }
        ],
        messages: [
            { type: 'system', text: 'Phòng được tạo lúc 14:02 · Giá niêm yết 320.000₫' },
            { type: 'text', by: 'owner', text: 'Chào bạn, bộ One Piece này còn nhé. Bạn muốn đổi bằng truyện nào?', time: '14:02' },
            { type: 'text', by: 'proposer', text: 'Mình có Naruto 1–10, bù thêm ít tiền được không ạ?', time: '14:05' },
            { type: 'offer', offerId: 1, by: 'proposer' },
            { type: 'offer', offerId: 2, by: 'owner' }
        ],
        draft: { mode: 'both', comics: ['c1'], money: 100000 },
        modal: null,
        focusKey: null
    };

    /* ---------- TIỆN ÍCH ---------- */
    var $ = function (s) { return document.querySelector(s); };
    var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
    var fmt = function (n) { return Math.abs(n).toLocaleString('vi-VN') + '₫'; };
    var esc = function (s) {
        return String(s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    };
    var nowTime = function () { return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); };
    var other = function (r) { return r === 'owner' ? 'proposer' : 'owner'; };
    var comicById = function (id) { return INVENTORY.filter(function (c) { return c.id === id; })[0]; };
    var cover = function (c, w, h) {
        var t = encodeURIComponent(c.title.split(' ').slice(0, 2).join('+'));
        return 'https://placehold.co/' + w + 'x' + h + '/' + c.bg + '/FFF7ED?text=' + t;
    };
    var who = function (r) { return r === state.role ? 'Bạn' : USERS[r].short; };
    var latestOffer = function () { return state.offers[state.offers.length - 1]; };
    var offerById = function (id) { return state.offers.filter(function (o) { return o.id === Number(id); })[0]; };
    var roomClosed = function () { return state.room.status === 'locked'; };

    function comicsValue(ids) { return ids.reduce(function (s, id) { return s + comicById(id).value; }, 0); }
    function offerValue(o) { return comicsValue(o.comics) + o.money; }
    function moneyText(m) {
        if (m === 0) return 'Không bù thêm tiền';
        var payer = m > 0 ? 'proposer' : 'owner';
        return who(payer) + ' bù ' + fmt(m);
    }
    function signed(dir, amount, role) {
        if (role === 'proposer') return dir === 'pay' ? amount : -amount;
        return dir === 'pay' ? -amount : amount;
    }
    function dirOf(money, role) {
        if (money === 0) return 'pay';
        return role === 'proposer' ? (money > 0 ? 'pay' : 'get') : (money > 0 ? 'get' : 'pay');
    }
    function myPending() {
        var l = latestOffer();
        return l && l.status === 'pending' && l.by === state.role ? l : null;
    }
    function lastProposerComics() {
        for (var i = state.offers.length - 1; i >= 0; i--) {
            if (state.offers[i].by === 'proposer') return state.offers[i].comics.slice();
        }
        return [];
    }
    function isWanted(c) { return ITEM.wants.indexOf(c.series) > -1; }

    function addSystem(text) { state.messages.push({ type: 'system', text: text }); }
    function toast(msg) {
        var t = $('#toast');
        t.textContent = msg;
        t.classList.add('is-show');
        clearTimeout(toast._t);
        toast._t = setTimeout(function () { t.classList.remove('is-show'); }, 2600);
    }

    /* ---------- THANH ĐO GIÁ TRỊ ---------- */
    function meterHTML(value, label) {
        var diff = ITEM.price - value;
        var pct = Math.max(0, Math.min(100, (value / ITEM.price) * 100));
        var cls, note;
        if (Math.abs(diff) <= ITEM.price * 0.02) { cls = 'ok'; note = 'Cân bằng giá trị với bộ truyện'; }
        else if (diff > 0) { cls = 'low'; note = 'Còn thiếu ' + fmt(diff) + ' so với giá trị bộ truyện'; }
        else { cls = 'high'; note = 'Vượt ' + fmt(-diff) + ' so với giá trị bộ truyện'; }
        return '<div class="dc-meter dc-meter--' + cls + '">' +
            '<div class="dc-meter-top"><span>' + (label || 'Giá trị đề xuất') + '</span><strong>' + fmt(Math.max(value, 0)) + ' / ' + fmt(ITEM.price) + '</strong></div>' +
            '<div class="dc-meter-bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(pct) + '"><span style="width:' + pct + '%"></span></div>' +
            '<div class="dc-meter-note">' + note + '</div></div>';
    }

    function miniComics(ids) {
        if (!ids.length) return '<div class="dc-nocomic"><i class="fa-solid fa-ban"></i> Không đổi bằng truyện</div>';
        return '<ul class="dc-minis">' + ids.map(function (id) {
            var c = comicById(id);
            return '<li class="dc-mini"><img src="' + cover(c, 72, 96) + '" alt=""><span><strong>' + esc(c.title) + '</strong><small>' + c.vol + ' · ' + c.cond + '</small></span><em>' + fmt(c.value) + '</em></li>';
        }).join('') + '</ul>';
    }

    /* ---------- RENDER: 2 BÊN ---------- */
    function personCard(u) {
        var you = u.key === state.role ? '<span class="dc-you">Bạn</span>' : '';
        return '<article class="dc-person dc-person--' + u.key + '">' +
            '<div class="dc-avatar">' + u.initials + '<span class="dc-avatar-dot" title="Đang online"></span></div>' +
            '<div class="dc-person-body">' +
            '<div class="dc-person-role">' + u.roleLabel + you + '</div>' +
            '<h3 class="dc-person-name">' + u.name + (u.verified ? ' <i class="fa-solid fa-circle-check dc-verified" title="Đã xác minh"></i>' : '') + '</h3>' +
            '<div class="dc-rating"><i class="fa-solid fa-star"></i> ' + u.rating + ' <span>(' + u.reviews + ' đánh giá)</span></div>' +
            '<ul class="dc-person-stats">' +
            '<li><strong>' + u.deals + '</strong> giao dịch</li>' +
            '<li><strong>' + u.successRate + '%</strong> thành công</li>' +
            '<li>Phản hồi <strong>' + u.response + '</strong></li></ul>' +
            '<div class="dc-person-meta"><span><i class="fa-solid fa-location-dot"></i> ' + u.location + '</span><span><i class="fa-regular fa-calendar"></i> Tham gia ' + u.since + '</span></div>' +
            '</div></article>';
    }

    function statusInfo() {
        switch (state.room.status) {
            case 'agreed': return { cls: 'agreed', icon: 'fa-handshake', text: 'Hai bên đã đồng ý · chờ chốt' };
            case 'locked': return { cls: 'locked', icon: 'fa-lock', text: 'Đã chốt · phòng đã khóa' };
            default: return { cls: 'negotiating', icon: 'fa-comments', text: 'Đang thương lượng' };
        }
    }

    function renderHero() {
        var s = statusInfo();
        $('#hero').innerHTML =
            personCard(USERS.owner) +
            '<div class="dc-link">' +
            '<div class="dc-link-icon"><i class="fa-solid fa-arrow-right-arrow-left"></i></div>' +
            '<div class="dc-room-code">Phòng ' + state.room.code + '</div>' +
            '<div class="dc-status dc-status--' + s.cls + '"><i class="fa-solid ' + s.icon + '"></i> ' + s.text + '</div>' +
            '</div>' +
            personCard(USERS.proposer);
    }

    /* ---------- RENDER: SẢN PHẨM ---------- */
    function renderItem() {
        $('#itemCard').innerHTML =
            '<div class="dc-item-cover"><img src="' + ITEM.cover + '" alt="' + esc(ITEM.title) + '"><span class="dc-item-flag"><i class="fa-solid fa-book-open"></i> Món muốn trao đổi</span></div>' +
            '<div class="dc-item-body">' +
            '<div class="dc-item-tags">' + ITEM.tags.map(function (t) { return '<span class="dc-tag">' + t + '</span>'; }).join('') + '</div>' +
            '<h2 class="dc-item-title">' + ITEM.title + '</h2>' +
            '<dl class="dc-specs">' + ITEM.specs.map(function (s) { return '<div class="dc-spec"><dt>' + s[0] + '</dt><dd>' + s[1] + '</dd></div>'; }).join('') + '</dl>' +
            '<p class="dc-item-note"><i class="fa-regular fa-note-sticky"></i> ' + ITEM.note + '</p>' +
            '<div class="dc-wants"><span>Chủ sở hữu đang tìm:</span>' + ITEM.wants.map(function (w) { return '<b>' + w + '</b>'; }).join('') + '</div>' +
            '</div>' +
            '<div class="dc-item-price">' +
            '<span class="dc-price-label">Giá niêm yết</span>' +
            '<div class="dc-price-value">' + fmt(ITEM.price) + '</div>' +
            '<span class="dc-price-sub">Có thể đổi bằng truyện, tiền hoặc cả hai</span>' +
            '<ul class="dc-price-ways"><li><i class="fa-solid fa-book"></i> Truyện</li><li><i class="fa-solid fa-coins"></i> Tiền</li><li><i class="fa-solid fa-layer-group"></i> Cả hai</li></ul>' +
            '</div>';
    }

    /* ---------- RENDER: TIẾN TRÌNH ---------- */
    function renderSteps() {
        var names = ['Thương lượng', 'Hai bên đồng ý', 'Chủ sở hữu chốt & khóa', 'Tạo đơn hàng'];
        var stage = state.room.status === 'locked' ? 3 : state.room.status === 'agreed' ? 2 : 0;
        $('#steps').innerHTML = names.map(function (n, i) {
            var cls = i < stage ? 'is-done' : i === stage ? 'is-active' : '';
            return '<li class="' + cls + '"><span class="dc-step-dot">' + (i < stage ? '<i class="fa-solid fa-check"></i>' : i + 1) + '</span><span class="dc-step-name">' + n + '</span></li>';
        }).join('');
    }

    /* ---------- RENDER: CHAT ---------- */
    function offerCardHTML(o, forSide) {
        var mine = o.by === state.role;
        var value = offerValue(o);
        var head = '<div class="dc-offer-head"><span class="dc-offer-tag"><i class="fa-solid fa-tag"></i> Đề xuất #' + o.id + ' · ' + (mine ? 'Của bạn' : USERS[o.by].short) + '</span>' +
            '<span class="dc-badge dc-badge--' + o.status + '">' + STATUS_LABEL[o.status] + '</span></div>';
        var body = '<div class="dc-offer-block"><span class="dc-offer-label">Người đề nghị đưa</span>' + miniComics(o.comics) + '</div>' +
            '<div class="dc-offer-money ' + (o.money === 0 ? 'is-zero' : '') + '"><i class="fa-solid fa-coins"></i><span>' + moneyText(o.money) + '</span></div>' +
            meterHTML(value) +
            (o.note ? '<p class="dc-offer-note">“' + esc(o.note) + '”</p>' : '') +
            (o.edited ? '<span class="dc-edited"><i class="fa-solid fa-pen"></i> Đã chỉnh sửa</span>' : '');
        return '<div class="dc-offer dc-offer--' + (mine ? 'mine' : 'them') + ' dc-offer--' + o.status + '">' + head + body + offerActions(o, forSide) + '</div>';
    }

    function offerActions(o, big) {
        if (roomClosed() || state.room.status === 'agreed') return '';
        if (o.status !== 'pending' || latestOffer().id !== o.id) return '';
        var cls = big ? ' dc-btn--block' : '';
        if (o.by === state.role) {
            return '<div class="dc-offer-actions"><span class="dc-wait"><i class="fa-regular fa-clock"></i> Chờ ' + USERS[other(state.role)].short + ' phản hồi</span>' +
                '<button type="button" class="dc-btn dc-btn--outline dc-btn--sm" data-act="edit"><i class="fa-solid fa-pen"></i> Chỉnh sửa số tiền</button></div>';
        }
        return '<div class="dc-offer-actions dc-offer-actions--3">' +
            '<button type="button" class="dc-btn dc-btn--danger dc-btn--sm' + cls + '" data-act="decline" data-id="' + o.id + '">Từ chối</button>' +
            '<button type="button" class="dc-btn dc-btn--outline dc-btn--sm' + cls + '" data-act="counter">Ra giá lại</button>' +
            '<button type="button" class="dc-btn dc-btn--primary dc-btn--sm' + cls + '" data-act="accept" data-id="' + o.id + '">Đồng ý</button></div>';
    }

    function renderChat() {
        var s = statusInfo();
        $('#chatHead').innerHTML =
            '<div><h3>Phòng đàm phán ' + state.room.code + '</h3><div class="dc-chat-sub"><span class="dc-live"></span> ' + USERS[other(state.role)].name + ' đang online</div></div>' +
            '<span class="dc-status dc-status--' + s.cls + '"><i class="fa-solid ' + s.icon + '"></i> ' + s.text + '</span>';

        $('#chatScroll').innerHTML = state.messages.map(function (m) {
            if (m.type === 'system') return '<span class="dc-system">' + esc(m.text) + '</span>';
            var mine = m.by === state.role;
            var u = USERS[m.by];
            var inner = m.type === 'offer'
                ? offerCardHTML(offerById(m.offerId), false)
                : '<div class="dc-bubble">' + esc(m.text) + '</div>';
            var time = m.type === 'offer' ? offerById(m.offerId).time : m.time;
            return '<div class="dc-msg ' + (mine ? 'dc-msg--me' : 'dc-msg--them') + '">' +
                '<div class="dc-msg-avatar dc-msg-avatar--' + m.by + '">' + u.initials + '</div>' +
                '<div class="dc-msg-body"><div class="dc-msg-name">' + (mine ? 'Bạn' : u.name) + '</div>' + inner + '<span class="dc-msg-time">' + time + '</span></div></div>';
        }).join('');
        var sc = $('#chatScroll');
        sc.scrollTop = sc.scrollHeight;

        var closed = roomClosed();
        $('#quickReplies').innerHTML = closed ? '' : QUICK[state.role].map(function (q) {
            return '<button type="button" class="dc-chip" data-act="quick" data-text="' + esc(q) + '">' + esc(q) + '</button>';
        }).join('');
        $('#messageInput').disabled = closed;
        $('#messageInput').placeholder = state.room.status === 'locked' ? 'Phòng đã được khóa' : 'Nhập tin nhắn…';
        $('#sendBtn').disabled = closed;
        $('#composerOffer').disabled = closed || state.room.status === 'agreed';
        $('#composerOffer').innerHTML = '<i class="fa-solid fa-coins"></i> ' + (myPending() ? 'Sửa số tiền' : 'Đề xuất tiền');
    }

    /* ---------- RENDER: PANEL BÊN PHẢI ---------- */
    function onTableCard() {
        var l = latestOffer();
        if (!l) {
            return '<div class="dc-side-card"><div class="dc-empty"><i class="fa-regular fa-comments"></i><p>Chưa có đề xuất nào trên bàn.</p></div></div>';
        }
        var extra = '';
        if (l.status === 'accepted') {
            extra = '<div class="dc-notice dc-notice--ok"><i class="fa-solid fa-handshake"></i><span>Hai bên đã đồng ý đề xuất này. ' +
                (state.room.status === 'locked' ? 'Phòng đã được khóa.' : 'Đang chờ chủ sở hữu chốt giá & khóa phòng.') + '</span></div>';
        }
        return '<div class="dc-side-card dc-side-card--accent"><div class="dc-side-head"><h3>Đề xuất đang trên bàn</h3></div>' + offerCardHTML(l, true) + extra + '</div>';
    }

    function builderCard() {
        if (state.room.status === 'agreed') {
            return '<div class="dc-side-card"><div class="dc-side-head"><h3>Đề nghị của bạn</h3></div><div class="dc-notice"><i class="fa-solid fa-lock"></i><span>Đề xuất đã được hai bên đồng ý nên không thể chỉnh sửa. Đang chờ chủ sở hữu chốt giá.</span></div></div>';
        }
        var d = state.draft;
        var showComics = d.mode !== 'money';
        var showMoney = d.mode !== 'comic';
        var selIds = showComics ? d.comics : [];
        var money = showMoney ? d.money : 0;
        var total = comicsValue(selIds) + money;
        var editing = !!myPending();

        var modes = [['comic', 'fa-book', 'Truyện'], ['money', 'fa-coins', 'Tiền'], ['both', 'fa-layer-group', 'Cả hai']];
        var seg = '<div class="dc-seg dc-seg--3" role="tablist" aria-label="Hình thức trao đổi">' + modes.map(function (m) {
            return '<button type="button" role="tab" aria-selected="' + (d.mode === m[0]) + '" class="' + (d.mode === m[0] ? 'is-on' : '') + '" data-act="mode" data-mode="' + m[0] + '"><i class="fa-solid ' + m[1] + '"></i> ' + m[2] + '</button>';
        }).join('') + '</div>';

        var inv = '';
        if (showComics) {
            var sorted = INVENTORY.slice().sort(function (a, b) { return Number(isWanted(b)) - Number(isWanted(a)); });
            inv = '<div class="dc-block-title">Kệ truyện của bạn <small>' + selIds.length + ' đã chọn</small></div><div class="dc-inv-list">' + sorted.map(function (c) {
                var on = d.comics.indexOf(c.id) > -1;
                return '<label class="dc-inv ' + (on ? 'is-selected' : '') + '">' +
                    '<input type="checkbox" data-act="pick" data-comic="' + c.id + '"' + (on ? ' checked' : '') + '>' +
                    '<img class="dc-inv-cover" src="' + cover(c, 72, 96) + '" alt="">' +
                    '<span class="dc-inv-info"><strong>' + esc(c.title) + '</strong><small>' + c.vol + ' · ' + c.cond + '</small>' +
                    (isWanted(c) ? '<span class="dc-wanted"><i class="fa-solid fa-heart"></i> Chủ truyện đang tìm</span>' : '') + '</span>' +
                    '<span class="dc-inv-value">' + fmt(c.value) + '</span></label>';
            }).join('') + '</div>';
        }

        var moneyRow = '';
        if (showMoney) {
            moneyRow = '<div class="dc-block-title">Tiền bù</div><div class="dc-money-row"><div><span class="dc-money-cap">Số tiền của bạn</span><strong>' + moneyText(d.money) + '</strong></div>' +
                '<button type="button" class="dc-btn dc-btn--outline dc-btn--sm" data-act="draft-money"><i class="fa-solid fa-pen"></i> ' + (d.money ? 'Chỉnh sửa' : 'Đặt số tiền') + '</button></div>';
        }

        return '<div class="dc-side-card"><div class="dc-side-head"><h3>Đề nghị của bạn</h3><span class="dc-side-sub">' + (editing ? 'Đang chỉnh sửa đề xuất #' + latestOffer().id : 'Chọn cách bạn muốn trao đổi') + '</span></div>' +
            seg + inv + moneyRow + meterHTML(total, 'Tổng giá trị bạn đưa ra') +
            '<button type="button" class="dc-btn dc-btn--primary dc-btn--block dc-btn--lg" data-act="send-draft"><i class="fa-solid fa-paper-plane"></i> ' + (editing ? 'Cập nhật đề xuất' : 'Gửi đề xuất') + '</button></div>';
    }

    function lockCard() {
        var l = latestOffer();
        var ready = l && (l.status === 'accepted' || (l.status === 'pending' && l.by === 'proposer'));
        var hint = !l ? 'Chưa có đề xuất nào để chốt.'
            : ready ? 'Chốt đề xuất #' + l.id + ' sẽ khóa phòng chat và không thể thay đổi.'
            : 'Đề xuất #' + l.id + ' là của bạn — cần chờ ' + USERS.proposer.short + ' đồng ý trước khi chốt.';
        return '<div class="dc-side-card dc-side-card--lock"><div class="dc-side-head"><h3><i class="fa-solid fa-lock"></i> Chốt giá & khóa phòng</h3></div>' +
            '<p class="dc-hint">Chỉ chủ sở hữu mới có thể xác nhận chốt giá.</p>' +
            '<p class="dc-hint dc-hint--strong">' + hint + '</p>' +
            '<button type="button" class="dc-btn dc-btn--dark dc-btn--block dc-btn--lg" data-act="lock"' + (ready ? '' : ' disabled') + '><i class="fa-solid fa-lock"></i> Chốt giá & khóa phòng</button></div>';
    }

    function lockedCard() {
        var acc = state.offers.filter(function (o) { return o.status === 'accepted'; }).pop() || latestOffer();
        var cta = state.role === 'proposer'
            ? '<button type="button" class="dc-btn dc-btn--primary dc-btn--block dc-btn--lg" data-act="create-order">Tạo đơn hàng đàm phán <i class="fa-solid fa-arrow-right"></i></button>'
            : '<div class="dc-notice"><i class="fa-regular fa-clock"></i><span>Đang chờ ' + USERS.proposer.short + ' tạo đơn hàng đàm phán.</span></div>';
        return '<div class="dc-side-card dc-side-card--done"><div class="dc-done-icon"><i class="fa-solid fa-lock"></i></div>' +
            '<h3 class="dc-done-title">Deal đã được chốt</h3><p class="dc-hint">Đề xuất #' + acc.id + ' · Phòng chat đã khóa.</p>' +
            '<div class="dc-offer-block"><span class="dc-offer-label">' + USERS.proposer.short + ' đưa</span>' + miniComics(acc.comics) + '</div>' +
            '<div class="dc-offer-money ' + (acc.money === 0 ? 'is-zero' : '') + '"><i class="fa-solid fa-coins"></i><span>' + moneyText(acc.money) + '</span></div>' +
            '<div class="dc-offer-block"><span class="dc-offer-label">' + USERS.owner.short + ' đưa</span><ul class="dc-minis"><li class="dc-mini"><img src="' + ITEM.cover + '" alt=""><span><strong>' + ITEM.title + '</strong><small>' + ITEM.tags[1] + ' · ~90%</small></span><em>' + fmt(ITEM.price) + '</em></li></ul></div>' +
            cta + '<p class="dc-hint dc-hint--center">Giá chốt chưa bao gồm phí vận chuyển.</p></div>';
    }

    function historyCard() {
        var items = state.offers.slice().reverse().map(function (o) {
            var parts = [];
            if (o.comics.length) parts.push(o.comics.length + ' bộ truyện');
            if (o.money) parts.push(moneyText(o.money));
            return '<li class="dc-hist"><span class="dc-hist-dot dc-hist-dot--' + o.by + '"></span><div><strong>#' + o.id + ' · ' + who(o.by) + (o.edited ? ' <em>(đã sửa)</em>' : '') + '</strong><small>' + (parts.join(' + ') || 'Không có nội dung') + ' · ' + o.time + '</small></div>' +
                '<span class="dc-badge dc-badge--' + o.status + '">' + STATUS_LABEL[o.status] + '</span></li>';
        }).join('');
        return '<div class="dc-side-card"><div class="dc-side-head"><h3>Lịch sử đề xuất</h3><span class="dc-side-sub">' + state.offers.length + ' đề xuất</span></div><ul class="dc-hist-list">' + items + '</ul></div>';
    }

    function renderSide() {
        var html = '';
        if (state.room.status === 'locked') html += lockedCard();
        else {
            html += onTableCard();
            html += state.role === 'proposer' ? builderCard() : lockCard();
        }
        html += historyCard();
        $('#sidePanel').innerHTML = html;
        if (state.focusKey) {
            var el = $('[data-comic="' + state.focusKey + '"]') || $('[data-mode="' + state.focusKey + '"]');
            if (el) el.focus();
            state.focusKey = null;
        }
    }

    function renderRole() {
        $$('.dc-roleswitch button').forEach(function (b) {
            var on = b.getAttribute('data-role') === state.role;
            b.classList.toggle('is-on', on);
            b.setAttribute('aria-selected', String(on));
        });
    }

    function renderAll() {
        renderRole(); renderHero(); renderItem(); renderSteps(); renderChat(); renderSide();
    }

    /* ---------- LOGIC ĐỀ XUẤT ---------- */
    function syncDraft() {
        if (state.role !== 'proposer') return;
        var mine = myPending();
        if (!mine) return;
        state.draft = {
            mode: mine.comics.length && mine.money !== 0 ? 'both' : mine.comics.length ? 'comic' : 'money',
            comics: mine.comics.slice(),
            money: mine.money
        };
    }

    function supersedePending() {
        state.offers.forEach(function (o) { if (o.status === 'pending') o.status = 'superseded'; });
    }

    function commitOffer(p) {
        var mine = myPending();
        if (mine) {
            mine.comics = p.comics; mine.money = p.money;
            if (p.note !== undefined && p.note !== '') mine.note = p.note;
            mine.edited = true;
            addSystem(who(state.role) + ' đã chỉnh sửa đề xuất #' + mine.id);
            toast('Đã cập nhật đề xuất của bạn.');
        } else {
            supersedePending();
            var o = { id: state.offers.length + 1, by: state.role, comics: p.comics, money: p.money, note: p.note || '', status: 'pending', edited: false, time: nowTime() };
            state.offers.push(o);
            state.messages.push({ type: 'offer', offerId: o.id, by: state.role });
            toast('Đã gửi đề xuất.');
        }
        syncDraft();
        renderAll();
    }

    function sendDraft() {
        var d = state.draft;
        var needComics = d.mode !== 'money';
        var needMoney = d.mode !== 'comic';
        if (needComics && !d.comics.length) { toast('Hãy chọn ít nhất 1 bộ truyện để trao đổi.'); return; }
        if (needMoney && d.mode === 'money' && d.money === 0) { openModal('send'); return; }
        commitOffer({ comics: needComics ? d.comics.slice() : [], money: needMoney ? d.money : 0 });
    }

    function acceptOffer(id) {
        var o = offerById(id);
        if (!o || o.status !== 'pending' || o.by === state.role || roomClosed()) return;
        o.status = 'accepted';
        state.room.status = 'agreed';
        addSystem(who(state.role) + ' đã đồng ý đề xuất #' + o.id + '. Chờ chủ sở hữu chốt giá & khóa phòng.');
        toast('Bạn đã đồng ý đề xuất #' + o.id);
        renderAll();
    }

    function declineOffer(id) {
        var o = offerById(id);
        if (!o || o.status !== 'pending' || o.by === state.role || roomClosed()) return;
        o.status = 'declined';
        addSystem(who(state.role) + ' đã từ chối đề xuất #' + o.id);
        toast('Đã từ chối đề xuất #' + o.id);
        renderAll();
    }

    function sendMessage(text) {
        text = (text || '').trim();
        if (!text || roomClosed()) return;
        state.messages.push({ type: 'text', by: state.role, text: text, time: nowTime() });
        renderChat();
    }

    /* ---------- CHỐT & KHÓA PHÒNG ---------- */
    function openLockModal() {
        var l = latestOffer();
        $('#lockSummary').innerHTML =
            '<div class="dc-offer-block"><span class="dc-offer-label">' + USERS.proposer.short + ' đưa</span>' + miniComics(l.comics) + '</div>' +
            '<div class="dc-offer-money ' + (l.money === 0 ? 'is-zero' : '') + '"><i class="fa-solid fa-coins"></i><span>' + moneyText(l.money) + '</span></div>' +
            meterHTML(offerValue(l));
        $('#lockConfirm').checked = false;
        $('#lockSubmit').disabled = true;
        showModal('#lockModal');
    }

    function lockRoom() {
        var l = latestOffer();
        if (state.role !== 'owner' || !l) return;
        if (l.status === 'pending' && l.by === 'proposer') l.status = 'accepted';
        if (l.status !== 'accepted') return;
        state.room.status = 'locked';
        addSystem(USERS.owner.short + ' đã chốt đề xuất #' + l.id + ' và khóa phòng chat.');
        closeModals();
        toast('Đã chốt giá và khóa phòng.');
        renderAll();
    }

    /* ---------- POPUP NHẬP SỐ TIỀN ---------- */
    function parseAmount(v) { return Math.min(MAX_MONEY, parseInt(String(v).replace(/\D/g, ''), 10) || 0); }

    function openModal(kind) {
        var mine = myPending();
        var money = 0, title = 'Đưa ra số tiền', submit = 'Gửi đề xuất';
        if (kind === 'edit' && mine) { money = mine.money; title = 'Chỉnh sửa số tiền của bạn'; submit = 'Lưu chỉnh sửa'; }
        else if (kind === 'draft') { money = state.draft.money; title = 'Đặt số tiền bù'; submit = 'Lưu số tiền'; }
        else if (kind === 'counter') { money = latestOffer().money; title = 'Ra giá lại'; }
        else if (state.role === 'proposer') { money = mine ? mine.money : state.draft.money; if (mine) { kind = 'edit'; title = 'Chỉnh sửa số tiền của bạn'; submit = 'Lưu chỉnh sửa'; } }
        else if (mine) { money = mine.money; kind = 'edit'; title = 'Chỉnh sửa số tiền của bạn'; submit = 'Lưu chỉnh sửa'; }
        else { money = latestOffer() ? latestOffer().money : 0; }

        state.modal = { kind: kind, dir: dirOf(money, state.role) };
        $('#offerModalTitle').textContent = title;
        $('#offerSubmit').textContent = submit;
        $('#amountInput').value = money ? Math.abs(money).toLocaleString('vi-VN') : '';
        $('#offerNote').value = '';
        $('#offerNoteField').hidden = kind === 'draft';
        updateModalUI();
        showModal('#offerModal');
        setTimeout(function () { $('#amountInput').focus(); }, 30);
    }

    function modalComics() {
        if (state.role === 'owner') return lastProposerComics();
        var d = state.draft;
        return d.mode === 'money' ? [] : d.comics.slice();
    }

    function updateModalUI() {
        var m = state.modal;
        var me = USERS[state.role].short, them = USERS[other(state.role)].short;
        var amount = parseAmount($('#amountInput').value);
        $$('#dirSeg button').forEach(function (b) { b.classList.toggle('is-on', b.getAttribute('data-dir') === m.dir); });
        var comics = modalComics();
        $('#offerModalSummary').innerHTML = '<span class="dc-offer-label">Kèm theo đề xuất</span>' + miniComics(comics);
        var money = signed(m.dir, amount, state.role);
        var txt = amount === 0 ? 'Bạn chưa nhập số tiền — đề xuất sẽ không bù tiền.'
            : m.dir === 'pay' ? 'Bạn bù ' + fmt(amount) + ' cho ' + them + '.' : 'Bạn nhận thêm ' + fmt(amount) + ' từ ' + them + '.';
        $('#offerPreview').innerHTML = '<div class="dc-preview-text"><i class="fa-solid fa-circle-info"></i> ' + txt + '</div>' + meterHTML(comicsValue(comics) + money);
        $('#dirPay').textContent = 'Tôi bù thêm tiền';
        $('#dirGet').textContent = 'Tôi muốn nhận thêm';
    }

    function submitModal() {
        var m = state.modal;
        var amount = parseAmount($('#amountInput').value);
        var money = signed(m.dir, amount, state.role);
        var note = $('#offerNote').value.trim();

        if (state.role === 'proposer') {
            if (m.kind === 'draft') {
                state.draft.money = money;
                if (state.draft.mode === 'comic' && money !== 0) state.draft.mode = 'both';
                closeModals(); renderSide(); return;
            }
            if (state.draft.mode === 'comic' && money !== 0) state.draft.mode = 'both';
            var comics = state.draft.mode === 'money' ? [] : state.draft.comics.slice();
            if (!comics.length && money === 0) { toast('Đề xuất cần có truyện hoặc số tiền.'); return; }
            if (state.draft.mode === 'money' && money === 0) { toast('Hãy nhập số tiền bạn muốn đưa ra.'); return; }
            state.draft.money = money;
            closeModals();
            commitOffer({ comics: comics, money: money, note: note });
            return;
        }
        // owner
        var oc = lastProposerComics();
        closeModals();
        commitOffer({ comics: oc, money: money, note: note });
    }

    function showModal(sel) { var el = $(sel); el.hidden = false; document.body.classList.add('dc-noscroll'); }
    function closeModals() { $$('.dc-modal').forEach(function (m) { m.hidden = true; }); document.body.classList.remove('dc-noscroll'); state.modal = null; }

    /* ---------- SỰ KIỆN ---------- */
    document.addEventListener('click', function (e) {
        var role = e.target.closest('[data-role]');
        if (role) {
            state.role = role.getAttribute('data-role');
            history.replaceState(null, '', '?role=' + state.role);
            syncDraft(); renderAll();
            toast('Đang xem với vai trò: ' + USERS[state.role].roleLabel);
            return;
        }
        if (e.target.closest('[data-close]')) { closeModals(); return; }
        var dir = e.target.closest('#dirSeg button');
        if (dir) { state.modal.dir = dir.getAttribute('data-dir'); updateModalUI(); return; }
        var chip = e.target.closest('#amountChips button');
        if (chip) {
            var cur = parseAmount($('#amountInput').value);
            var add = chip.getAttribute('data-add');
            var next = add === 'reset' ? 0 : cur + Number(add);
            $('#amountInput').value = next ? Math.min(next, MAX_MONEY).toLocaleString('vi-VN') : '';
            updateModalUI(); return;
        }

        var btn = e.target.closest('[data-act]');
        if (!btn || btn.disabled) return;
        var act = btn.getAttribute('data-act');
        var id = btn.getAttribute('data-id');
        switch (act) {
            case 'accept': acceptOffer(id); break;
            case 'decline': declineOffer(id); break;
            case 'counter': openModal('counter'); break;
            case 'edit': openModal('edit'); break;
            case 'mode':
                state.draft.mode = btn.getAttribute('data-mode');
                if (state.draft.mode === 'comic') state.draft.money = 0;
                state.focusKey = state.draft.mode; renderSide(); break;
            case 'draft-money': openModal('draft'); break;
            case 'send-draft': sendDraft(); break;
            case 'lock': openLockModal(); break;
            case 'quick': sendMessage(btn.getAttribute('data-text')); break;
            case 'create-order': location.href = ORDER_PAGE + '?deal=' + DEAL_CODE; break;
        }
    });

    document.addEventListener('change', function (e) {
        var pick = e.target.closest('[data-act="pick"]');
        if (pick) {
            var cid = pick.getAttribute('data-comic');
            var i = state.draft.comics.indexOf(cid);
            if (i > -1) state.draft.comics.splice(i, 1); else state.draft.comics.push(cid);
            state.focusKey = cid; renderSide(); return;
        }
        if (e.target.id === 'lockConfirm') $('#lockSubmit').disabled = !e.target.checked;
    });

    $('#amountInput').addEventListener('input', function () {
        var v = parseAmount(this.value);
        this.value = v ? v.toLocaleString('vi-VN') : '';
        updateModalUI();
    });
    $('#offerSubmit').addEventListener('click', submitModal);
    $('#lockSubmit').addEventListener('click', lockRoom);
    $('#composer').addEventListener('submit', function (e) {
        e.preventDefault();
        var inp = $('#messageInput');
        sendMessage(inp.value);
        inp.value = '';
    });
    $('#composerOffer').addEventListener('click', function () { openModal('send'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModals(); });

    /* ---------- KHỞI TẠO ---------- */
    syncDraft();
    renderAll();
})();
