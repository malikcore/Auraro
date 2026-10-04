// ============================================================
// AURELLE - Contact / Inquiry Form JavaScript
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("inquiryForm");
    const responseDiv = document.getElementById("response");


    // Make sure the form exists
    if (!form) {
        console.error("Inquiry form was not found.");
        return;
    }


    // ========================================================
    // FORM SUBMISSION
    // ========================================================

    form.addEventListener("submit", async function (event) {

        event.preventDefault();


        // Clear previous response
        if (responseDiv) {
            responseDiv.textContent = "";
            responseDiv.className = "";
        }


        // Collect form data
        const formData = new FormData(form);


        try {

            // Send data to PHP backend
            const response = await fetch(
                "submit_inquiry.php",
                {
                    method: "POST",
                    body: formData
                }
            );


            // Check server response
            if (!response.ok) {
                throw new Error(
                    `Server error: ${response.status}`
                );
            }


            // Read PHP response
            const result = await response.text();


            // Display response
            if (responseDiv) {

                responseDiv.textContent =
                    result || "Your inquiry was submitted successfully.";

                responseDiv.classList.add(
                    "inquiry-success"
                );
            }


            // Clear form after successful submission
            form.reset();


        } catch (error) {

            console.error(
                "Inquiry submission failed:",
                error
            );


            // Display error message
            if (responseDiv) {

                responseDiv.textContent =
                    "There was an error submitting your inquiry. Please try again.";

                responseDiv.classList.add(
                    "inquiry-error"
                );
            }
        }
    });
});