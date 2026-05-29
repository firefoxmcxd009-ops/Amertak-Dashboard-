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



            const email =
            document.getElementById(
            "email"
            ).value;



            const password =
            document.getElementById(
            "password"
            ).value;



            try{

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

                            email,
                            password

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

            }

            catch(err){

                console.log(err);

                alert(
                "Login failed"
                );

            }

        }

    );

}



// ====================
// DASHBOARD
// ====================
const ordersContainer =
document.getElementById(
"orders"
);

if(ordersContainer){

    const token =
    localStorage.getItem(
    "token"
    );



    // ====================
    // CHECK LOGIN
    // ====================
    if(!token){

        location.href =
        "login.html";

    }



    // ====================
    // LOAD ORDERS
    // ====================
    async function loadOrders(){

        try{

            const response =
            await fetch(

                API + "/orders",

                {

                    headers:{

                        Authorization:
                        `Bearer ${token}`

                    }

                }

            );



            const orders =
            await response.json();



            // ====================
            // INVALID TOKEN
            // ====================
            if(

            orders.success === false

            ){

                localStorage.removeItem(
                "token"
                );

                location.href =
                "login.html";

                return;

            }



            ordersContainer.innerHTML =
            "";



            orders.forEach(order=>{

                let statusColor =
                "#1e293b";



                if(
                order.status ===
                "approved"
                ){

                    statusColor =
                    "#00ff99";

                }



                if(
                order.status ===
                "rejected"
                ){

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



                            <button
                            class="delete"

                            onclick="deleteOrder(
                            '${order._id}'
                            )">

                            Delete

                            </button>

                        </div>

                    </div>

                </div>

                `;

            });

        }

        catch(err){

            console.log(err);

            alert(
            "Failed to load orders"
            );

        }

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

    const token =
    localStorage.getItem(
    "token"
    );



    try{

        await fetch(

            API + "/update-status",

            {

                method:"POST",

                headers:{

                    "Content-Type":
                    "application/json",

                    Authorization:
                    `Bearer ${token}`

                },

                body:JSON.stringify({

                    id,
                    status

                })

            }

        );



        location.reload();

    }

    catch(err){

        console.log(err);

        alert(
        "Update failed"
        );

    }

}



// ====================
// DELETE ORDER
// ====================
async function deleteOrder(id){

    const token =
    localStorage.getItem(
    "token"
    );



    const confirmDelete =
    confirm(
    "Delete this order?"
    );



    if(!confirmDelete){

        return;

    }



    try{

        await fetch(

            API +
            "/delete-order/" +
            id,

            {

                method:"DELETE",

                headers:{

                    Authorization:
                    `Bearer ${token}`

                }

            }

        );



        location.reload();

    }

    catch(err){

        console.log(err);

        alert(
        "Delete failed"
        );

    }

}



// ====================
// LOGOUT
// ====================
function logout(){

    localStorage.removeItem(
    "token"
    );

    location.href =
    "login.html";

}