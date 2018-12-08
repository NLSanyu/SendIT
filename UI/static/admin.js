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
                    <td>${parcel.price}</td>
                    <td contenteditable="true" 
                    onblur="changeStatus(${parcel.parcel_id}, event.target.innerText)">${parcel.status}</td>
                    <td class="edit">Edit</td>
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

function changeStatus(parcel_id, val){
    let url = 'http://127.0.0.1:5000/api/v1/parcels/' + parcel_id + '/status';
    //let st = document.getElementById("status"+parcel_id).value;
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
    let url = 'http://127.0.0.1:5000/api/v1/parcels/' + parcel_id + '/presentLocation';
    //let presentLocation = document.getElementById('present_location').value;
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({present_location: val})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        let info = `<br> ${data['message']} <br>`;
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


    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }
  
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}








