function logIn(){
    document.getElementById("load").style.display = "block";
    let username = document.getElementById("uname2").value;
    let password = document.getElementById("password2").value;
  
    fetch('https://nls-sendit.herokuapp.com/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      }, 
      body: JSON.stringify({username: username, password: password})
    })
    .then((res) => res.json())
    .then(function(data){
      console.log(data);
      token = data['access_token'];
      user_info = data['user_info'];
      if(token){
        localStorage.setItem("access_token", token);
        localStorage.setItem("user_info", JSON.stringify(user_info));
        window.location.replace("../../templates/admin/admin_page.html");
      }
      
    })
    .catch((err) => console.log(err)) 
  }

function getAllParcels(){
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
        //check if data['data'] exists or is defined
        let output = `
            <tr>
                <th>Id</th>
                <th>Owner_id</th>
                <th>Description</th>
                <th>Date created</th>
                <th>Pickup location</th>
                <th>Present location <i class="fas fa-edit"></i></th>
                <th>Destination</th>
                <th>Price</th>
                <th>Status <i class="fas fa-edit"></i></th>
                <th></th>
            </tr>`;
        parcels.forEach(function(parcel){
            output += `
                <tr>
                    <td>${parcel.parcel_id}</td>
                    <td>${parcel.owner_id}</td>
                    <td>${parcel.description}</td>
                    <td>${parcel.date_created}</td>
                    <td>${parcel.pickup_location}</td>
                    <td contenteditable="true"
                    onblur="changePresentLocation(${parcel.parcel_id}, event.target.innerText)">${parcel.present_location}</td>
                    <td>${parcel.destination}</td>
                    <td>UGX 3000</td>
                    <td>
                        <select onchange="changeStatus(${parcel.parcel_id}, event.target.value)">
                            <option value="Current-status">${parcel.status}</option>
                            <option value="Pending">Pending</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </td>
                </tr>
            `;
        })
        document.getElementById('parcels_output').innerHTML = output;
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
                <th>Username</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Password</th>
                <th>Orders</th>
                <th>Delivered</th>
                <th>In transit</th>
            </tr>`;
        users.forEach(function(user){
            output += `
                <tr>
                    <td>${user.user_id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td>${user.phone_number}</td>
                    <td>${user.password_hash}</td>
                    <td>${user.orders}</td>
                    <td>${user.delivered}</td>
                    <td>${user.in_transit}</td>
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
        getAllParcels(); 
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
        getAllParcels();   
    })
    .catch((err) => console.log(err)) 
}

function logOut(){
    localStorage.removeItem("access_token");
    let info = `Logging out`;
    showModal(info);
    window.location.replace("../../templates/admin/admin_sign_in.html");
}

function showModal(info){
    let modal = document.getElementById('myModal');
    let modalBody = document.getElementById('modal-body');
    modal.style.display = "block";
    modalBody.innerHTML = info;

    var span = document.getElementsByClassName("close")[0];

    span.onclick = function() {
        modal.style.display = "none";
    }
  
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}








