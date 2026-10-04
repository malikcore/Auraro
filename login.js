// ============================================================
// AURELLE - Login JavaScript
// ============================================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        const emailElement = document.getElementById("email");
        const passwordElement = document.getElementById("password");

        const email = emailElement
            ? emailElement.value.trim()
            : "";

        const password = passwordElement
            ? passwordElement.value.trim()
            : "";


        // ----------------------------------------------------
        // Basic validation
        // ----------------------------------------------------

        if (!email || !password) {

            event.preventDefault();

            alert("Please fill in all fields.");

            return;
        }


        // ----------------------------------------------------
        // Email validation
        // ----------------------------------------------------

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            event.preventDefault();

            alert("Please enter a valid email address.");

            return;
        }


        // ----------------------------------------------------
        // Allow normal form submission
        // ----------------------------------------------------
        //
        // The form will now submit to:
        //
        // login.php
        //
        // using POST.
        //
        // Do NOT use event.preventDefault() here.
        // ----------------------------------------------------

    });
}