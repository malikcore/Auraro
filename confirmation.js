// ============================================================
// AURELLE - Order Confirmation JavaScript
// ============================================================

// Retrieve order details from localStorage
let orderDetails = null;

try {
    orderDetails = JSON.parse(
        localStorage.getItem("orderDetails")
    );
} catch (error) {
    console.error("Unable to retrieve order details:", error);
}


// ============================================================
// CHECK ORDER DETAILS
// ============================================================

if (!orderDetails) {

    // No order found
    // Redirect user to homepage
    window.location.href = "index.html";

} else {

    // --------------------------------------------------------
    // Order Number
    // --------------------------------------------------------

    const orderNumberElement =
        document.getElementById("orderNumber");

    if (orderNumberElement) {
        orderNumberElement.textContent =
            orderDetails.orderNumber || "N/A";
    }


    // --------------------------------------------------------
    // Total Price
    // --------------------------------------------------------

    const totalPriceElement =
        document.getElementById("totalPrice");

    if (totalPriceElement) {

        const total =
            Number(orderDetails.totalPrice) || 0;

        totalPriceElement.textContent =
            total.toFixed(2);
    }


    // --------------------------------------------------------
    // Customer Email
    // --------------------------------------------------------

    const customerEmailElement =
        document.getElementById("customerEmail");

    if (customerEmailElement) {

        customerEmailElement.textContent =
            orderDetails.customerEmail || "N/A";
    }
}