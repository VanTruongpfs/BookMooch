
    /* =========================
       FORMAT MONEY
    ========================= */

    function formatMoney(value) {

        return value.toLocaleString("vi-VN") + "₫";

    }


    /* =========================
       ACCEPT OFFER
    ========================= */

    function acceptOffer(price) {

        document.getElementById("currentPrice").textContent =
            formatMoney(price);

        alert(
            "Bạn đã đồng ý mức giá "
            + formatMoney(price)
            + ".\n\n"
            + "Nếu người bán cũng xác nhận, Deal sẽ được chốt."
        );

    }


    /* =========================
       REJECT OFFER
    ========================= */

    function rejectOffer(price) {

        alert(
            "Bạn đã từ chối mức giá "
            + formatMoney(price)
            + "."
        );

    }


    /* =========================
       QUICK OFFER
    ========================= */

    function quickOffer(price) {

        const message =
            "Mình đề nghị mức giá "
            + formatMoney(price)
            + " được không ạ?";

        addMessage(message);

    }


    /* =========================
       ADD MESSAGE
    ========================= */

    function addMessage(text) {

        const chat =
            document.getElementById("chat");

        const message =
            document.createElement("div");

        message.className =
            "message me";

        message.innerHTML = `
            <div class="message-content">

                <div class="message-name">
                    Bạn
                </div>

                <div class="bubble">
                    ${text}
                </div>

                <span class="message-time">
                    Vừa xong
                </span>

            </div>
        `;

        chat.appendChild(message);

        chat.scrollTop =
            chat.scrollHeight;

    }


    /* =========================
       SEND MESSAGE
    ========================= */

    function sendMessage() {

        const input =
            document.getElementById("messageInput");

        const text =
            input.value.trim();

        if (!text) {
            return;
        }

        addMessage(text);

        input.value = "";

    }


    /* =========================
       ENTER TO SEND
    ========================= */

    function handleEnter(event) {

        if (event.key === "Enter") {

            event.preventDefault();

            sendMessage();

        }

    }


    /* =========================
       PRICE BUTTON
    ========================= */

    function focusPrice() {

        const price =
            prompt("Nhập mức giá bạn muốn đề nghị:");

        if (!price) {
            return;
        }

        const numericPrice =
            Number(price);

        if (
            isNaN(numericPrice) ||
            numericPrice <= 0
        ) {

            alert("Vui lòng nhập mức giá hợp lệ.");

            return;

        }

        addMessage(
            "Mình đề nghị mức giá "
            + formatMoney(numericPrice)
            + " được không ạ?"
        );

    }


    /* =========================
       OTHER OFFER
    ========================= */

    function showOfferInput() {

        focusPrice();

    }


    /* =========================
       CURRENT DEAL
    ========================= */

    function acceptCurrentDeal() {

        const price =
            document
                .getElementById("currentPrice")
                .textContent;

        const confirmed =
            confirm(
                "Bạn có muốn chốt Deal ở mức "
                + price
                + " không?"
            );

        if (!confirmed) {
            return;
        }

        // Hai bên đã thống nhất giá -> sang bước tạo đơn hàng đàm phán.
        window.location.href =
            "negotiation-order.html?deal=PT2049";

    }


    /* =========================
       CREATE ORDER
    ========================= */

    function createOrder() {

        window.location.href =
            "negotiation-order.html?deal=PT2049";

    }


