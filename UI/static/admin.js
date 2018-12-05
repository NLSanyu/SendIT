function logIn(){
    let username = document.getElementById("uname2").value;
    let password = document.getElementById("password2").value;
  
    fetch('http://127.0.0.1:5000/api/v1/auth/login', {
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
      alert(data['message']);
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

    fetch('http://127.0.0.1:5000/api/v1/parcels', {
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
                <th>Present location</th>
                <th>Destination</th>
                <th>Price</th>
                <th>Status</th>
            </tr>`;
        parcels.forEach(function(parcel){
            output += `
                <tr>
                    <td>${parcel.parcel_id}</td>
                    <td>${parcel.owner_id}</td>
                    <td>${parcel.description}</td>
                    <td>${parcel.date_created}</td>
                    <td>${parcel.pickup_location}</td>
                    <td contenteditable="true" id="present_location" onclick="changePresentLocation(${parcel.parcel_id})">${parcel.present_location}</td>
                    <td>${parcel.destination}</td>
                    <td>${parcel.price}</td>
                    <td contenteditable="true" id="status" onclick="changeStatus(${parcel.parcel_id})">${parcel.status}</td>
                </tr>
            `;
        })
        document.getElementById('parcels_output').innerHTML = output;
    })
    .catch((err) => console.log(err)) 
}

function getAllUsers(){
    auth = `Bearer ` + localStorage.getItem("access_token");

    fetch('http://127.0.0.1:5000/api/v1/users', {
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
                <th>Password hash</th>
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

function changeStatus(parcel_id){
    let url = 'http://127.0.0.1:5000/api/v1/parcels/' + parcel_id + '/status';
    let st = document.getElementById('status').value;
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({status: st})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        alert(data['message']);   
    })
    .catch((err) => console.log(err)) 
}

function changePresentLocation(parcel_id){
    let url = 'http://127.0.0.1:5000/api/v1/parcels/' + parcel_id + '/presentLocation';
    let presentLocation = document.getElementById('present_location').value;
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({present_location: presentLocation})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        alert(data['message']);   
    })
    .catch((err) => console.log(err)) 
}





