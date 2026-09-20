
    const dealPrice = 1650000;

    /*
     * Mock dữ liệu phí vận chuyển.
     * Sau này có thể thay bằng API/backend.
     */
    const shippingMethods = {
        19000: {
            name: "Tiết kiệm",
            days: "4–6 ngày"
        },

        32000: {
            name: "Giao nhanh",
            days: "2–3 ngày"
        },

        58000: {
            name: "Hoả tốc",
            days: "Trong ngày"
        }
    };


    /*
     * Format tiền Việt Nam
     */
    function formatMoney(value) {

        return value.toLocaleString("vi-VN") + "đ";

    }


    /*
     * Chọn phương thức vận chuyển
     */
    document
        .querySelectorAll('input[name="shipping"]')
        .forEach(function (radio) {

            radio.addEventListener("change", function () {

                document
                    .querySelectorAll(".shipping-option")
                    .forEach(function (option) {

                        option.classList.remove("selected");

                    });


                const currentOption =
                    radio.closest(".shipping-option");

                currentOption.classList.add("selected");


                updateShippingPrice(
                    Number(radio.value)
                );

            });

        });


    /*
     * Cập nhật phí ship + tổng tiền
     */
    function updateShippingPrice(fee) {

        const method = shippingMethods[fee];

        document.getElementById("shippingFee").textContent =
            formatMoney(fee);


        document.getElementById("selectedFee").textContent =
            formatMoney(fee);


        document.getElementById("totalPrice").textContent =
            formatMoney(dealPrice + fee);


        const selectedDescription =
            document.querySelector(
                ".shipping-option.selected .shipping-date"
            );


        if (selectedDescription) {

            document.querySelector(
                ".action-info small"
            ).textContent =
                method.name + " · " + method.days;

        }

    }


    /*
     * Mock tính lại phí vận chuyển
     */
    function calculateShipping() {

        const weight =
            Number(document.getElementById("weight").value);


        if (!weight || weight <= 0) {

            alert("Vui lòng nhập khối lượng hợp lệ.");

            return;

        }


        /*
         * Mock:
         * <= 1kg  : 19.000đ
         * <= 3kg  : 32.000đ
         * > 3kg   : 58.000đ
         */

        let fee;

        if (weight <= 1) {

            fee = 19000;

        } else if (weight <= 3) {

            fee = 32000;

        } else {

            fee = 58000;

        }


        const radio =
            document.querySelector(
                'input[name="shipping"][value="' + fee + '"]'
            );


        if (radio) {

            radio.checked = true;

            document
                .querySelectorAll(".shipping-option")
                .forEach(function (option) {

                    option.classList.remove("selected");

                });

            radio
                .closest(".shipping-option")
                .classList.add("selected");

        }


        updateShippingPrice(fee);

        alert(
            "Đã tính lại phí vận chuyển: "
            + formatMoney(fee)
        );

    }


    /*
     * Xác nhận phí vận chuyển
     */
    function confirmShipping() {

        const selected =
            document.querySelector(
                'input[name="shipping"]:checked'
            );

        if (!selected) {

            alert("Vui lòng chọn phương thức vận chuyển.");

            return;

        }


        const fee =
            Number(selected.value);

        const method =
            shippingMethods[fee];


        /*
         * Sau này có thể chuyển sang:
         * /negotiation-order/create
         * và truyền shippingFee + shippingMethod
         */

        alert(
            "Đã xác nhận phí vận chuyển "
            + formatMoney(fee)
            + " (" + method.name + ").\n\n"
            + "Hệ thống sẽ chuyển sang quản lý đơn hàng trao đổi."
        );
        window.location.href = "exchange-orders.html";
    }

