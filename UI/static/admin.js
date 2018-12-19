function getAllParcels(status){
    auth = `Bearer ` + localStorage.getItem("access_token");

    fetch('https://nls-sendit.herokuapp.com/api/v1/parcels', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': auth
      }
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        console.log(data['message'])
        parcels = data['data'];
        let output = `
            <tr>
                <th>Id</th>
                <th>Owner_id</th>
                <th>Description</th>
                <th>Date created</th>
                <th>Pickup location</th>
                <th>Present location <i class="fas fa-edit"></i></th>
                <th>Destination</th>
                <th>Weight <i class="fas fa-edit"></i></th>
                <th>Price <i class="fas fa-edit"></i></th>
                <th>Status <i class="fas fa-edit"></i></th>
            </tr>`;
        parcels.forEach(function(parcel){
            if(parcel.status == status || status == "All"){
                output += `
                    <tr>
                        <td>${parcel.parcel_id}</td>
                        <td>${parcel.owner_id}</td>
                        <td>${parcel.description}</td>
                        <td>${parcel.date_created}</td>
                        <td>${parcel.pickup_location}</td>
                        <td contenteditable="true"
                        onblur="showConfirmModal('present location', ${parcel.parcel_id}, event.target.innerText)">${parcel.present_location}</td>
                        <td>${parcel.destination}</td>
                        <td contenteditable="true"
                        onblur="showConfirmModal('weight', ${parcel.parcel_id}, event.target.innerText)">${parcel.weight}</td>
                        <td contenteditable="true"
                        onblur="showConfirmModal('price', ${parcel.parcel_id}, event.target.innerText)">${parcel.price}</td>
                        <td>
                            <select onchange="showConfirmModal('status', ${parcel.parcel_id}, event.target.value)">
                                <option value="Current-status">${parcel.status}</option>
                                <option value="Pending">Pending</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </td>
                    </tr>`;
            }
        })
        document.getElementById('parcels_output').innerHTML = output;

        const statuses = ["Pending", "In Transit", "Delivered", "Cancelled"];
        for (const st of statuses){
            if(status == st){
                document.getElementById(status).style.backgroundColor = "#003366";
                document.getElementById(status).style.color = "white";
            }
            else {
                document.getElementById(st).style.backgroundColor = "#aaa";
                document.getElementById(st).style.color = "black";
            } 
        }
    })
    .catch((err) => console.log(err)) 
}

function getAllUsers(){
    auth = `Bearer ` + localStorage.getItem("access_token");

    fetch('https://nls-sendit.herokuapp.com/api/v1/users', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': auth
      }
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        console.log(data['message'])
        users = data['data'];
        //check if data['data'] exists or is defined
        let output = `
            <tr>
                <th>Id</th>
                <th>Full name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Password</th>
            </tr>`;
        users.forEach(function(user){
            output += `
                <tr>
                    <td>${user.user_id}</td>
                    <td>${user.full_name}</td>
                    <td>@${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.phone_number}</td>
                    <td>${user.password_hash}</td>
                </tr>
            `;
        })
        document.getElementById('parcels_output').innerHTML = output;
    })
    .catch((err) => console.log(err)) 
}

function changeStatus(parcel_id, val){
    let url = 'https://nls-sendit.herokuapp.com/api/v1/parcels/' + parcel_id + '/status';
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({status: val})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        let info = `${data['message']}`;
        showModal(info);
        getAllParcels("All"); 
    })
    .catch((err) => console.log(err)) 
}

function changePresentLocation(parcel_id, val){
    let url = 'https://nls-sendit.herokuapp.com/api/v1/parcels/' + parcel_id + '/presentLocation';
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({location: val})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        let info = `${data['message']}`;
        showModal(info);
        getAllParcels("All");   
    })
    .catch((err) => console.log(err)) 
}

function editPrice(parcel_id, val){
    let url = 'https://nls-sendit.herokuapp.com/api/v1/parcels/' + parcel_id + '/price';
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({price: val})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        let info = `${data['message']}`;
        showModal(info);
        getAllParcels("All"); 
    })
    .catch((err) => console.log(err)) 
}

function editWeight(parcel_id, val){
    let url = 'https://nls-sendit.herokuapp.com/api/v1/parcels/' + parcel_id + '/weight';
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({weight: val})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        let info = `${data['message']}`;
        showModal(info);
        getAllParcels("All"); 
    })
    .catch((err) => console.log(err)) 
}


function showConfirmModal(which, parcel_id, val) {
    let modal = document.getElementById("myModal");
    let modalBody = document.getElementById("modal-body");
    modalBody.innerHTML = "";
    let message = document.createElement("p");
    let confirm = document.createElement("button");
    let discard = document.createElement("button");
    confirm.innerText = "Confirm";
    discard.innerText = "Discard";
    message.innerText = "Confirm " + which;
    confirm.classList.add("confirm");
    discard.classList.add("discard");
    discard.onclick = function() {
        modalBody.removeChild(message);
        modalBody.removeChild(discard);
        modalBody.removeChild(confirm);
        modal.style.display = "none";
    }
    modalBody.appendChild(message);
    modalBody.appendChild(discard);
    modalBody.appendChild(confirm);
    modal.style.display = "block";

    switch(which) {
        case "present location":
            confirm.onclick = function() {
                changePresentLocation(parcel_id, val);
            }
            break;

        case "status": 
            confirm.onclick = function() {
                changeStatus(parcel_id, val);
            }
            break;

        case "weight": 
        confirm.onclick = function() {
            editWeight(parcel_id, val);
        }
        break;

        case "price": 
        confirm.onclick = function() {
            editPrice(parcel_id, val);
        }
        break;
    }
    
}

function logOut(){
    localStorage.removeItem("access_token");
    let info = `Logging out`;
    showModal(info);
    window.location.replace("../../templates/user/sign_in.html");
}

function showModal(info){
    let modal = document.getElementById('myModal');
    let modalBody = document.getElementById('modal-body');
    modal.style.display = "block";
    modalBody.innerHTML = info;

    var span = document.getElementsByClassName("close")[0];

    setTimeout(function(){ modal.style.display = "none"; modalBody.innerHTML = ""; }, 3000);

    span.onclick = function() {
        modal.style.display = "none";
        modalBody.innerHTML = "";
    }
  
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}








