const API =
"https://amertak-backend.onrender.com";



// ====================
// LOGIN
// ====================

const loginForm =
document.getElementById(
"loginForm"
);

if(loginForm){

    loginForm.addEventListener(
    "submit",

    async(e)=>{

        e.preventDefault();

        const response =
        await fetch(

            API + "/admin-login",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json"

                },

                body:JSON.stringify({

                    email:
                    email.value,

                    password:
                    password.value

                })

            }

        );



        const data =
        await response.json();



        if(data.success){

            localStorage.setItem(

                "token",

                data.token

            );

            location.href =
            "dashboard.html";

        }

        else{

            alert(
                data.message
            );

        }

    });

}



// ====================
// DASHBOARD
// ====================

const ordersContainer =
document.getElementById(
"orders"
);

if(ordersContainer){

    if(!localStorage.getItem(
        "token"
    )){

        location.href =
        "login.html";

    }



    async function loadOrders(){

        const response =
        await fetch(
            API + "/orders"
        );

        const orders =
        await response.json();

        ordersContainer.innerHTML =
        "";



        orders.forEach(order=>{

            let statusColor =
            "#1e293b";



            if(order.status ===
            "approved"){

                statusColor =
                "#00ff99";

            }



            if(order.status ===
            "rejected"){

                statusColor =
                "#ff4d6d";

            }



            ordersContainer.innerHTML += `

            <div class="order-card">

                <img
                src="${API}/uploads/${order.image}">

                <div class="order-info">

                    <h3>
                    ${order.username}
                    </h3>

                    <p>
                    Rank:
                    ${order.rank}
                    </p>

                    <div
                    class="status"

                    style="background:${statusColor}">

                    ${order.status}

                    </div>



                    <div class="actions">

                        <button
                        class="approve"

                        onclick="updateStatus(
                        '${order._id}',
                        'approved'
                        )">

                        Approve

                        </button>



                        <button
                        class="reject"

                        onclick="updateStatus(
                        '${order._id}',
                        'rejected'
                        )">

                        Reject

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }



    loadOrders();

}



// ====================
// UPDATE STATUS
// ====================

async function updateStatus(
    id,
    status
){

    await fetch(

        API + "/update-status",

        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },

            body:JSON.stringify({

                id,
                status

            })

        }

    );

    location.reload();

}



// ====================
//