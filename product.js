// ============================================================
// AURELLE - Product Add to Cart JavaScript
// ============================================================

// Product details
const product = {
    name: "Casual Jacket",
    sku: "12345",
    price: 85.00,
    quantity: 1,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrizoa7mxyjg6Ck20ms-8I9Bw0HZwkRUdctQ&s"
};


// ============================================================
// ADD TO CART BUTTON
// ============================================================

const addToCartButton = document.getElementById("addToCart");


if (addToCartButton) {

    addToCartButton.addEventListener("click", function () {

        // ----------------------------------------------------
        // Get existing cart
        // ----------------------------------------------------

        let cart = [];

        try {

            cart =
                JSON.parse(localStorage.getItem("cart")) || [];

            if (!Array.isArray(cart)) {
                cart = [];
            }

        } catch (error) {

            console.error(
                "Unable to load cart:",
                error
            );

            cart = [];
        }


        // ----------------------------------------------------
        // Check if product already exists
        // ----------------------------------------------------

        const existingProduct = cart.find(
            item => item.sku === product.sku
        );


        if (existingProduct) {

            // Increase quantity
            existingProduct.quantity =
                (Number(existingProduct.quantity) || 0) + 1;

        } else {

            // Add new product
            cart.push({
                name: product.name,
                sku: product.sku,
                price: product.price,
                quantity: product.quantity,
                image: product.image,
                review: ""
            });
        }


        // ----------------------------------------------------
        // Save cart
        // ----------------------------------------------------

        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        // ----------------------------------------------------
        // User notification
        // ----------------------------------------------------

        alert(
            `${product.name} has been added to your cart.`
        );


        // ----------------------------------------------------
        // Redirect to cart
        // ----------------------------------------------------

        window.location.href = "cart.html";
    });
}