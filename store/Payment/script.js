// ==========================
// QR Images
// ==========================
const qrImages = {
    vip: "qr/vip.png",
    mvp: "qr/mvp.png",
    mvpplus: "qr/mvpplus.png",
    epic: "qr/epic.png",
    kingdom: "qr/kingdom.png"
};

// ==========================
// Rank Prices
// ==========================
const rankPrices = {
    vip: "$2",
    mvp: "$3.5",
    mvpplus: "$5",
    epic: "$6.5",
    kingdom: "$8"
};

// ==========================
// Elements
// ==========================
const rankSelect = document.getElementById("rank");
const qrImg = document.getElementById("qr-img");
const qrContainer = document.getElementById("qr-container");
const loader = document.getElementById("loader");
const rankError = document.getElementById("rankError");

const fileUpload = document.getElementById("fileUpload");
const filetxt = document.getElementById("filetxt");

const usernameInput =
document.getElementById("username");

const paymentForm =
document.getElementById("paymentForm");

const errorBox =
document.querySelector(".error");

const errorTitle =
document.querySelector(".error-title");

const progressBorder =
document.querySelector(".progress-border");

const errorInfo =
document.getElementById("error-info");

const submitBtn =
document.querySelector(
".button button:last-child"
);

// ===================
// API URL
// ===================
const API =
"https://amertak-backend.onrender.com";

// ===================
// Error Payment Popup
// ===================
const errorPay = {

    qrcode:
    "Error generate Khqr!",

    errorConnect:
    "Error sending order! Check your connection and try again.",

    username:
    "Please enter the Minecraft username!",

    invoice:
    "Please upload the Invoice!",

    choose:
    "Please select a rank!",

    sucess:
    "Sucessfuly created KHQR!",

    ordered:
    "Ordered! We're checking your rank order."

};

// ===================
// Error Animation
// ===================
function showError(message) {

    // Reset animation
    errorBox.classList.remove(
    "toggleError"
    );

    progressBorder.classList.remove(
    "toggleProgress"
    );

    // Trigger reflow
    void errorBox.offsetWidth;

    // Start animation
    errorBox.classList.add(
    "toggleError"
    );

    progressBorder.classList.add(
    "toggleProgress"
    );

    errorInfo.innerHTML =
    `<span>${message}</span>`;

}

// ==========================
// Remove Animation
// ==========================
progressBorder.addEventListener(

"animationend",

()=>{

    errorBox.classList.remove(
    "toggleError"
    );

    progressBorder.classList.remove(
    "toggleProgress"
    );

});

// ==========================
// Preload QR Images
// ==========================
Object.values(qrImages).forEach(
(src)=>{

    const img =
    new Image();

    img.src = src;

});

// ==========================
// File Upload UI
// ==========================
fileUpload.addEventListener(

"change",

function () {

    if (this.files.length > 0) {

        filetxt.textContent =
        "Uploaded ✓";

    }

    else {

        filetxt.textContent =
        "Upload invoice";

    }

});

// ==========================
// Create QR
// ==========================
function generateQR() {

    const rank =
    rankSelect.value;

    // ==========================
    // Validation
    // ==========================
    if (!rank) {

        rankError.style.display =
        "block";

        qrContainer.classList.add(
        "hidden"
        );

        errorTitle.innerHTML = `
            <h1 style="
            color:#da0000;
            text-shadow:0 0 15px #da0000">

            Error

            </h1>
        `;

        progressBorder.style.background =
        "#da0000";

        showError(errorPay.choose);

        return;

    }

    rankError.style.display =
    "none";

    // ==========================
    // Show Loader
    // ==========================
    qrContainer.classList.add(
    "hidden"
    );

    loader.classList.remove(
    "hidden"
    );

    const tempImg =
    new Image();

    tempImg.src =
    qrImages[rank];

    // ==========================
    // QR Loaded
    // ==========================
    tempImg.onload = function () {

        setTimeout(()=>{

            qrImg.src =
            tempImg.src;

            loader.classList.add(
            "hidden"
            );

            qrContainer.classList.remove(
            "hidden"
            );

            errorTitle.innerHTML = `
                <h1 style="
                color:#1f9000;
                text-shadow:0 0 15px #1f9000">

                sucessfully

                </h1>
            `;

            progressBorder.style.background =
            "#1f9000";

            showError(errorPay.sucess);

        },700);

    };

    // ==========================
    // QR Error
    // ==========================
    tempImg.onerror = function () {

        loader.classList.add(
        "hidden"
        );

        errorTitle.innerHTML = `
            <h1 style="
            color:#da0000;
            text-shadow:0 0 15px #da0000">

            Error

            </h1>
        `;

        progressBorder.style.background =
        "#da0000";

        showError(errorPay.qrcode);

    };

}

// ==========================
// SEND ORDER
// ==========================
async function sendOrder() {

    const username =
    usernameInput.value.trim();

    const rank =
    rankSelect.value;

    const file =
    fileUpload.files[0];

    // ==========================
    // VALIDATION
    // ==========================
    if (!username) {

        errorTitle.innerHTML = `
            <h1 style="
            color:#da0000;
            text-shadow:0 0 15px #da0000">

            Error

            </h1>
        `;

        progressBorder.style.background =
        "#da0000";

        showError(errorPay.username);

        usernameInput.focus();

        return;

    }

    if (!rank) {

        rankError.style.display =
        "block";

        errorTitle.innerHTML = `
            <h1 style="
            color:#da0000;
            text-shadow:0 0 15px #da0000">

            Error

            </h1>
        `;

        progressBorder.style.background =
        "#da0000";

        showError(errorPay.choose);

        rankSelect.focus();

        return;

    }

    if (!file) {

        errorTitle.innerHTML = `
            <h1 style="
            color:#da0000;
            text-shadow:0 0 15px #da0000">

            Error

            </h1>
        `;

        progressBorder.style.background =
        "#da0000";

        showError(errorPay.invoice);

        return;

    }

    rankError.style.display =
    "none";

    // ==========================
    // FORM DATA
    // ==========================
    const formData =
    new FormData();

    formData.append(
    "username",
    username
    );

    formData.append(
    "rank",
    rank
    );

    formData.append(
    "image",
    file
    );

    // ==========================
    // BUTTON LOADING
    // ==========================
    submitBtn.disabled = true;

    submitBtn.textContent =
    "Sending...";

    // ==========================
    // SEND TO BACKEND
    // ==========================
    try{

        const response =
        await fetch(

            API + "/submit-order",

            {

                method:"POST",

                body:formData

            }

        );

        const data =
        await response.json();

        // ==========================
        // SUCCESS
        // ==========================
        if(data.success){

            errorTitle.innerHTML = `
                <h1 style="
                color:#1f9000;
                text-shadow:0 0 15px #1f9000">

                sucessfully

                </h1>
            `;

            progressBorder.style.background =
            "#1f9000";

            showError(errorPay.ordered);

            // Reset Form
            paymentForm.reset();

            filetxt.textContent =
            "Upload invoice";

            qrContainer.classList.add(
            "hidden"
            );

            rankError.style.display =
            "none";

        }

        // ==========================
        // FAILED
        // ==========================
        else{

            errorTitle.innerHTML = `
                <h1 style="
                color:#da0000;
                text-shadow:0 0 15px #da0000">

                Error

                </h1>
            `;

            progressBorder.style.background =
            "#da0000";

            showError(
            "Failed to send order!"
            );

        }

    }

    // ==========================
    // SERVER ERROR
    // ==========================
    catch(err){

        console.error(err);

        errorTitle.innerHTML = `
            <h1 style="
            color:#da0000;
            text-shadow:0 0 15px #da0000">

            Error

            </h1>
        `;

        progressBorder.style.background =
        "#da0000";

        showError(
        errorPay.errorConnect
        );

    }

    // ==========================
    // RESET BUTTON
    // ==========================
    submitBtn.disabled = false;

    submitBtn.textContent =
    "Submit";

}