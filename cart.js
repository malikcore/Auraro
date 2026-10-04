// ============================================================
// AURELLE - Premium Cart JavaScript
// ============================================================

// Load cart from localStorage
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Make sure cart is an array
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

const cartItems = document.getElementById("cartItems");
const totalAmountElement = document.getElementById("totalAmount");
const cartEmptyMessage = document.getElementById("cartEmptyMessage");

const addToCartButton = document.getElementById("addToCart");
const proceedCheckoutButton = document.getElementById("proceedCheckout");

const reviewModalElement = document.getElementById("reviewModal");
const reviewText = document.getElementById("reviewText");
const saveReviewButton = document.getElementById("saveReview");


// Bootstrap review modal
let reviewModal = null;

if (reviewModalElement && typeof bootstrap !== "undefined") {
    reviewModal = new bootstrap.Modal(reviewModalElement);
}


// Stores the cart item currently being reviewed
let currentReviewIndex = null;


// ============================================================
// SAVE CART TO LOCAL STORAGE
// ============================================================

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// ============================================================
// FORMAT PRICE
// ============================================================

function formatPrice(price) {
    const number = Number(price) || 0;
    return `$${number.toFixed(2)}`;
}


// ============================================================
// CALCULATE CART TOTAL
// ============================================================

function calculateCartTotal() {
    return cart.reduce((total, item) => {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;

        return total + (price * quantity);

    }, 0);
}


// ============================================================
// UPDATE CART DISPLAY
// ============================================================

function updateCartDisplay() {

    // Make sure cart container exists
    if (!cartItems) {
        console.error("cartItems element was not found.");
        return;
    }

    // Clear existing cart rows
    cartItems.innerHTML = "";

    // --------------------------------------------------------
    // EMPTY CART
    // --------------------------------------------------------

    if (cart.length === 0) {

        if (cartEmptyMessage) {
            cartEmptyMessage.classList.remove("d-none");
        }

        if (totalAmountElement) {
            totalAmountElement.textContent = "Total: $0.00";
        }

        saveCart();
        return;
    }

    // Hide empty cart message
    if (cartEmptyMessage) {
        cartEmptyMessage.classList.add("d-none");
    }


    // --------------------------------------------------------
    // DISPLAY CART PRODUCTS
    // --------------------------------------------------------

    cart.forEach((item, index) => {

        const price = Number(item.price) || 0;
        const quantity = Number(item.quantity) || 1;
        const itemTotal = price * quantity;

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${escapeHTML(item.name || "Product")}</strong>
            </td>

            <td>
                ${formatPrice(price)}
            </td>

            <td>
                <input
                    type="number"
                    class="form-control item-quantity"
                    data-index="${index}"
                    value="${quantity}"
                    min="1"
                    aria-label="Quantity"
                >
            </td>

            <td>
                <strong>${formatPrice(itemTotal)}</strong>
            </td>

            <td>
                <button
                    type="button"
                    class="btn btn-sm review-item"
                    data-index="${index}"
                    data-bs-toggle="modal"
                    data-bs-target="#reviewModal"
                >
                    Review
                </button>
            </td>

            <td>
                <button
                    type="button"
                    class="btn btn-sm remove-item"
                    data-index="${index}"
                >
                    Remove
                </button>
            </td>
        `;

        cartItems.appendChild(row);
    });


    // --------------------------------------------------------
    // UPDATE TOTAL
    // --------------------------------------------------------

    const totalAmount = calculateCartTotal();

    if (totalAmountElement) {
        totalAmountElement.textContent =
            `Total: ${formatPrice(totalAmount)}`;
    }


    // Save updated cart
    saveCart();
}


// ============================================================
// ESCAPE HTML
// Prevents product names/reviews from injecting HTML
// ============================================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value ?? "";

    return div.innerHTML;
}


// ============================================================
// UPDATE PRODUCT QUANTITY
// ============================================================

if (cartItems) {

    cartItems.addEventListener("change", function (event) {

        if (!event.target.classList.contains("item-quantity")) {
            return;
        }

        const index = Number(event.target.dataset.index);

        if (
            Number.isNaN(index) ||
            !cart[index]
        ) {
            return;
        }

        let newQuantity = parseInt(event.target.value, 10);

        // Prevent invalid quantity
        if (Number.isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
        }

        cart[index].quantity = newQuantity;

        updateCartDisplay();
    });
}


// ============================================================
// REMOVE PRODUCT
// ============================================================

if (cartItems) {

    cartItems.addEventListener("click", function (event) {

        const removeButton =
            event.target.closest(".remove-item");

        if (!removeButton) {
            return;
        }

        const index = Number(removeButton.dataset.index);

        if (
            Number.isNaN(index) ||
            !cart[index]
        ) {
            return;
        }

        // Remove product
        cart.splice(index, 1);

        // Save and refresh
        saveCart();
        updateCartDisplay();
    });
}


// ============================================================
// OPEN REVIEW MODAL
// ============================================================

if (cartItems) {

    cartItems.addEventListener("click", function (event) {

        const reviewButton =
            event.target.closest(".review-item");

        if (!reviewButton) {
            return;
        }

        const index = Number(reviewButton.dataset.index);

        if (
            Number.isNaN(index) ||
            !cart[index]
        ) {
            return;
        }

        currentReviewIndex = index;

        // Load existing review
        if (reviewText) {
            reviewText.value = cart[index].review || "";
        }
    });
}


// ============================================================
// SAVE PRODUCT REVIEW
// ============================================================

if (saveReviewButton) {

    saveReviewButton.addEventListener("click", function () {

        // No selected product
        if (
            currentReviewIndex === null ||
            !cart[currentReviewIndex]
        ) {
            return;
        }

        const review =
            reviewText ? reviewText.value.trim() : "";

        // Save review
        cart[currentReviewIndex].review = review;

        saveCart();
        updateCartDisplay();

        // Close modal
        if (reviewModal) {
            reviewModal.hide();
        }

        // Reset
        currentReviewIndex = null;
    });
}


// ============================================================
// ADD PRODUCT TO CART
// ============================================================
//
// This function is designed to work with product pages.
//
// Example:
//
// addProductToCart({
//     name: "Trousers",
//     price: 55.00,
//     quantity: 1
// });
//
// ============================================================

function addProductToCart(product) {

    if (!product || !product.name) {
        console.error("Invalid product data.");
        return;
    }

    const productName = String(product.name);

    const productPrice = Number(product.price) || 0;

    const quantity =
        Number(product.quantity) > 0
            ? Number(product.quantity)
            : 1;


    // Check if product already exists
    const existingItem = cart.find(
        item => item.name === productName
    );


    if (existingItem) {

        existingItem.quantity =
            (Number(existingItem.quantity) || 0) + quantity;

    } else {

        cart.push({
            name: productName,
            price: productPrice,
            quantity: quantity,
            review: ""
        });
    }


    // Save cart
    saveCart();

    // Update display
    updateCartDisplay();

    console.log(`${productName} added to cart.`);
}


// ============================================================
// ADD TO CART BUTTON
// ============================================================
//
// If cart.html contains #addToCart, this provides a simple
// demo/add-product action.
//
// For actual product pages, call addProductToCart(product).
//
// ============================================================

if (addToCartButton) {

    addToCartButton.addEventListener("click", function () {

        /*
         * Default AURELLE demo product.
         *
         * If your product page already has its own Add to Cart
         * JavaScript, you do NOT need this section.
         */

        addProductToCart({
            name: "AURELLE Fashion Item",
            price: 85.00,
            quantity: 1
        });
    });
}


// ============================================================
// PROCEED TO CHECKOUT
// ============================================================

if (proceedCheckoutButton) {

    proceedCheckoutButton.addEventListener("click", function (event) {

        // Prevent checkout if cart is empty
        if (cart.length === 0) {

            event.preventDefault();

            alert("Your cart is empty. Please add a product before checkout.");

            return;
        }

        // Save latest cart
        saveCart();

        // Allow normal link/form behavior
        window.location.href = "checkout.html";
    });
}


// ============================================================
// SYNCHRONIZE CART WITH OTHER TABS
// ============================================================
//
// If cart is changed in another browser tab, update this page.
// ============================================================

window.addEventListener("storage", function (event) {

    if (event.key !== "cart") {
        return;
    }

    try {

        cart = JSON.parse(event.newValue) || [];

        if (!Array.isArray(cart)) {
            cart = [];
        }

        updateCartDisplay();

    } catch (error) {

        console.error(
            "Unable to synchronize cart:",
            error
        );

        cart = [];

        updateCartDisplay();
    }
});


// ============================================================
// INITIALIZE CART
// ============================================================

updateCartDisplay();


// ============================================================
// OPTIONAL GLOBAL FUNCTION
// ============================================================
//
// This allows product pages to use:
//
// addProductToCart({
//     name: "Trousers",
//     price: 55,
//     quantity: 1
// });
//
// ============================================================

window.addProductToCart = addProductToCart;