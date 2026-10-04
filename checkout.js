// ============================================================
// AURELLE - Checkout JavaScript
// ============================================================

// Get cart from localStorage
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!Array.isArray(cart)) {
        cart = [];
    }
} catch (error) {
    console.error("Unable to load cart:", error);
    cart = [];
}


// ============================================================
// DOM ELEMENTS
// ============================================================

const checkoutForm = document.getElementById("checkoutForm");
const totalPriceElement = document.getElementById("totalPrice");
const summaryTotalElement = document.getElementById("summaryTotal");
const paymentMethodElement = document.getElementById("paymentMethod");


// ============================================================
// CALCULATE CART TOTAL
// ============================================================

function calculateTotal() {

    return cart.reduce((total, item) => {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;

        return total + (price * quantity);

    }, 0);
}


// ============================================================
// DISPLAY TOTAL PRICE
// ============================================================

const totalPrice = calculateTotal();

if (totalPriceElement) {
    totalPriceElement.textContent = totalPrice.toFixed(2);
}

if (summaryTotalElement) {
    summaryTotalElement.textContent = `$${totalPrice.toFixed(2)}`;
}


// ============================================================
// CHECK EMPTY CART
// ============================================================

if (cart.length === 0) {

    if (checkoutForm) {

        const submitButton =
            checkoutForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
        }
    }

    if (totalPriceElement) {
        totalPriceElement.textContent = "0.00";
    }

    if (summaryTotalElement) {
        summaryTotalElement.textContent = "$0.00";
    }
}


// ============================================================
// PAYMENT METHOD DISPLAY
// ============================================================

if (paymentMethodElement) {

    paymentMethodElement.addEventListener("change", function () {

        const cardNumber =
            document.getElementById("cardNumber");

        if (!cardNumber) {
            return;
        }

        if (this.value === "card") {

            cardNumber.disabled = false;
            cardNumber.required = true;

        } else {

            cardNumber.disabled = true;
            cardNumber.required = false;
            cardNumber.value = "";
        }
    });
}


// ============================================================
// CHECKOUT FORM SUBMISSION
// ============================================================

if (checkoutForm) {

    checkoutForm.addEventListener("submit", function (event) {

        event.preventDefault();


        // ----------------------------------------------------
        // Prevent checkout with empty cart
        // ----------------------------------------------------

        if (cart.length === 0) {

            alert(
                "Your cart is empty. Please add a product before checkout."
            );

            return;
        }


        // ----------------------------------------------------
        // Get customer information
        // ----------------------------------------------------

        const name =
            document.getElementById("name")?.value.trim() || "";

        const address =
            document.getElementById("address")?.value.trim() || "";

        const email =
            document.getElementById("email")?.value.trim() || "";

        const paymentMethod =
            paymentMethodElement?.value || "";


        // ----------------------------------------------------
        // Get card number if available
        // ----------------------------------------------------

        const cardNumberElement =
            document.getElementById("cardNumber");

        const cardNumber =
            cardNumberElement?.value.trim() || "";


        // ----------------------------------------------------
        // Basic validation
        // ----------------------------------------------------

        if (!name || !address || !email || !paymentMethod) {

            alert(
                "Please complete all required checkout fields."
            );

            return;
        }


        // ----------------------------------------------------
        // Validate card payment
        // ----------------------------------------------------

        if (
            paymentMethod === "card" &&
            !cardNumber
        ) {

            alert(
                "Please enter your card number."
            );

            return;
        }


        // ----------------------------------------------------
        // Generate AURELLE order number
        // ----------------------------------------------------

        const orderNumber =
            "AU" +
            Date.now().toString().slice(-8);


        // ----------------------------------------------------
        // Create order details
        // ----------------------------------------------------

        const orderDetails = {

            orderNumber: orderNumber,

            totalPrice: totalPrice,

            customerEmail: email,

            customerName: name,

            customerAddress: address,

            paymentMethod: paymentMethod,

            items: cart.map(item => ({

                name: item.name,

                price: Number(item.price) || 0,

                quantity: Number(item.quantity) || 1,

                review: item.review || ""

            })),

            orderDate: new Date().toISOString()
        };


        // ----------------------------------------------------
        // Save order
        // ----------------------------------------------------

        localStorage.setItem(
            "orderDetails",
            JSON.stringify(orderDetails)
        );


        // ----------------------------------------------------
        // Clear cart after successful checkout
        // ----------------------------------------------------

        localStorage.removeItem("cart");


        // ----------------------------------------------------
        // Redirect to confirmation page
        // ----------------------------------------------------

        window.location.href = "confirmation.html";
    });
}