// ==========================
// API URL
// ==========================
const API =
"https://amertak-backend.onrender.com";



// ==========================
// QR Images
// ==========================
const qrImages = {

    vip:
    "/qr/vip.png",

    mvp:
    "/qr/mvp.png",

    mvpplus:
    "/qr/mvpplus.png",

    epic:
    "/qr/epic.png",

    kingdom:
    "/qr/kingdom.png"

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
const rankSelect =
document.getElementById(
"rank"
);

const qrImg =
document.getElementById(
"qr-img"
);

const qrContainer =
document.getElementById(
"qr-container"
);

const loader =
document.getElementById(
"loader"
);

const rankError =
document.getElementById(
"rankError"
);

const fileUpload =
document.getElementById(
"fileUpload"
);

const filetxt =
document.getElementById(
"filetxt"
);

const usernameInput =
document.getElementById(
"username"
);

const paymentForm =
document.getElementById(
"paymentForm"
);

const errorBox =
document.querySelector(
".error"
);

const errorTitle =
document.querySelector(
".error-title"
);

const progressBorder =
document.querySelector(
".progress-border"
);

const errorInfo =
document.getElementById(
"error-info"
);

const submitBtn =
document.querySelector(
".button button:last-child"
);



// ==========================
// Error Messages
// ==========================
const errorPay = {

    qrcode:
    "Error generate QR code!",

    errorConnect:
    "Cannot connect to server!",

    username:
    "Please enter Minecraft username!",

    invoice:
    "Please upload invoice image!",

    choose:
    "Please select a rank!",

    success:
    "QR Code Generated!",

    ordered:
    "Order submitted successfully!"

};



// ==========================
// Show Error Popup
// ==========================
function showError(message){

    if(!errorBox) return;

    errorBox.classList.remove(
    "toggleError"
    );

    progressBorder.classList.remove(
    "toggleProgress"
    );

    void errorBox.offsetWidth;

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
// Remove Popup Animation
// ==========================
if(progressBorder){

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

}



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
if(fileUpload){

    fileUpload.addEventListener(

    "change",

    function(){

        if(this.files.length > 0){

            filetxt.textContent =
            this.files[0].name;

        }

        else{

            filetxt.textContent =
            "Upload invoice";

        }

    });

}



// ==========================
// Generate QR
// ==========================
function generateQR(){

    const rank =
    rankSelect.value;

    // ==========================
    // VALIDATION
    // ==========================
    if(!rank){

        rankError.style.display =
        "block";

        qrContainer.classList.add(
        "hidden"
        );

        showError(
        errorPay.choose
        );

        return;

    }

    rankError.style.display =
    "none";

    // ==========================
    // LOADER
    // ==========================
    loader.classList.remove(
    "hidden"
    );

    qrContainer.classList.add(
    "hidden"
    );

    const tempImg =
    new Image();

    tempImg.src =
    qrImages[rank];

    // ==========================
    // SUCCESS
    // ==========================
    tempImg.onload = ()=>{

        setTimeout(()=>{

            qrImg.src =
            tempImg.src;

            loader.classList.add(
            "hidden"
            );

            qrContainer.classList.remove(
            "hidden"
            );

            showError(
            errorPay.success
            );

        },500);

    };

    // ==========================
    // ERROR
    // ==========================
    tempImg.onerror = ()=>{

        loader.classList.add(
        "hidden"
        );

        showError(
        errorPay.qrcode
        );

        console.error(
        "QR image not found:",
        tempImg.src
        );

    };

}



// ==========================
// SEND ORDER
// ==========================
async function sendOrder(){

    const username =
    usernameInput.value.trim();

    const rank =
    rankSelect.value;

    const file =
    fileUpload.files[0];

    // ==========================
    // VALIDATION
    // ==========================
    if(!username){

        showError(
        errorPay.username
        );

        usernameInput.focus();

        return;

    }

    if(!rank){

        showError(
        errorPay.choose
        );

        rankSelect.focus();

        return;

    }

    if(!file){

        showError(
        errorPay.invoice
        );

        return;

    }

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
    submitBtn.disabled =
    true;

    submitBtn.textContent =
    "Sending...";

    try{

        // ==========================
        // FETCH API
        // ==========================
        const response =
        await fetch(

            API + "/submit-order",

            {

                method:"POST",

                body:formData

            }

        );

        // ==========================
        // DEBUG
        // ==========================
        console.log(
        "STATUS:",
        response.status
        );

        const data =
        await response.json();

        console.log(
        "RESPONSE:",
        data
        );

        // ==========================
        // SUCCESS
        // ==========================
        if(data.success){

            showError(
            errorPay.ordered
            );

            // RESET FORM
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

            showError(

            data.message ||

            "Failed to submit order!"

            );

        }

    }

    // ==========================
    // ERROR
    // ==========================
    catch(err){

        console.error(err);

        showError(
        errorPay.errorConnect
        );

    }

    // ==========================
    // RESET BUTTON
    // ==========================
    submitBtn.disabled =
    false;

    submitBtn.textContent =
    "Submit";

}



// ==========================
// AUTO FORM SUBMIT
// ==========================
if(paymentForm){

    paymentForm.addEventListener(

    "submit",

    (e)=>{

        e.preventDefault();

        sendOrder();

    });

}