var auth = `Bearer ` + localStorage.getItem("access_token");
var user = JSON.parse(localStorage.getItem('user_info'));
var click2 = 0;
var counter = {orders: 0, delivered: 0, in_transit: 0};

function createParcel(){
    let description = document.getElementById("desc").value;
    let pickupLocation = document.getElementById("pickup").value;
    let destination = document.getElementById("dest").value;
  
    fetch('http://127.0.0.1:5000/api/v1/parcels', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': auth
      }, 
      body: JSON.stringify({description: description, pickup_location: pickupLocation, destination: destination})
    })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err)) 
  
}

function createParcelForm(){
    formString = `
	<div class="create-parcel-form">
		<form name="create_parcel_form" class="form"> 
			<table class="parcel-form-table">
				<tr> 
					<td>Description</td> 
					<td class="colon">:</td> 
					<td> <textarea name="parcel_desc" rows="3" id="desc"> </textarea> </td> 
				</tr>  
				<tr> 
					<td>Pickup location</td> 
					<td class="colon">:</td> 
					<td> <textarea name="parcel_pickup" rows="3" id="pickup"> </textarea> </td> 
				</tr>  
				<tr> 
					<td>Destination</td> 
					<td class="colon">:</td> 
					<td> <textarea name="parcel_destination" rows="3" id="dest"> </textarea> </td> 
				</tr>
			</table>
			<button type="button" class="submit-button" id="create_parcel_btn" onclick="createParcel()">Create parcel</button> 

		</form>
    </div>`;

    document.getElementById('create-parcel-div').innerHTML = formString;

}

function getUserParcels(){
    auth = `Bearer ` + localStorage.getItem("access_token");
    user_id = user.user_id;
    let url = 'http://127.0.0.1:5000/api/v1/users/' + user_id + '/parcels';
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': auth
      }
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if(data['message'] === 'no parcels for this user'){
            document.getElementById('parcels-div').innerHTML = "<br><p>This user has no parcels yet</p>";
            return 0;
        }
        if(data['msg'] === 'Token has expired'){
            document.getElementById('parcels-div').innerHTML = "<br><p>Token expired</p>";
            return 0;
        }
        parcels = data['data'];
        let output = `
            <table class="parcel-table">
            <tr>
                <th>Date created</th>
                <th>Description</th>
                <th>Pickup location</th>
                <th>Destination</th>
                <th>Price</th>
                <th>Status</th>
                <th>Cancel</th>
                <th></th>
            </tr>`;
        parcels.forEach(function(parcel){
            output += `
                <tr>
                    <td>${parcel.date_created}</td>
                    <td>${parcel.description}</td>
                    <td>${parcel.pickup_location}</td>
                    <td id="dest">${parcel.destination}</td>
                    <td>${parcel.price}</td>
                    <td>${parcel.status}</td>
                    <td><i class="fas fa-times" onclick="cancelParcel(${parcel.parcel_id})"></i></td>
                    <td class="edit" onclick="storeParcelId(${parcel.parcel_id})">View</td>
                </tr> 
            `;
            counter['orders'] += 1;
            switch(parcel.status){
                case "Delivered": counter['delivered'] += 1;
                case "In transit": counter['in_transit'] += 1;
            }
        })
        output += `</table>`;
        document.getElementById('parcels-div').innerHTML = output;
        document.getElementById("orders").innerHTML = "All orders: " + counter['orders'];
        document.getElementById("delivered").innerHTML = "Delivered: " + counter['delivered'];
        document.getElementById("in_transit").innerHTML = "In transit: " + counter['in_transit'];

    })
    .catch((err) => console.log(err)) 
}

function storeParcelId(parcel_id){
    localStorage.setItem("parcel_id", parcel_id);
    //window.location.replace("../../templates/user/parcel.html");
    window.location.href = "../../templates/user/parcel.html";
}

function getOneParcel(){
    parcel_id = localStorage.getItem("parcel_id");
    auth = `Bearer ` + localStorage.getItem("access_token");
    let url = 'http://127.0.0.1:5000/api/v1/parcels/' + parcel_id;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        'Authorization': auth
      }
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        if(data['message'] === 'parcel non-existent'){
            document.getElementById('parcels-div').innerHTML = "<br><p>This parcel does not exist</p>";
            return 0;
        }
        if(data['msg'] === 'Token has expired'){
            document.getElementById('parcels-div').innerHTML = "<br><p>Token expired</p>";
            return 0;
        }
        parcel = data['data'];
        parcel.forEach(function(parcel){
            output += `
                    <p>${parcel.date_created}</p>
                    <p>${parcel.description}</p>
                    <p>${parcel.pickup_location}</p>
                    <p id="dest">${parcel.destination}</p>
                    <p>${parcel.price}</p>
                    <p>${parcel.status}</p>
                    <p><i class="fas fa-times" onclick="cancelParcel(${parcel.parcel_id})"></i></p>
                    <p class="edit" onclick="showOneParcel()">Edit</p> 
            `;
        })
        document.getElementById('one-parcel-details').innerHTML = output;
    })
    .catch((err) => console.log(err)) 
}


function changeDest(parcel_id){
    let dest = prompt("Enter a new destination");
    //let dest = document.getElementById("dest").value;
    let url = 'http://127.0.0.1:5000/api/v1/parcels/' + parcel_id + '/destination';
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({destination: dest})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        alert(data['message']);  
        getUserParcels(); 
    })
    .catch((err) => console.log(err)) 
}


function cancelParcel(parcel_id){
    let url = 'http://127.0.0.1:5000/api/v1/parcels/' + parcel_id + '/cancel';
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        alert(data['message']);
        getUserParcels();   
    })
    .catch((err) => console.log(err)) 
}

function showUserInfo(){
    token = localStorage.getItem("acess_token");
    if(token == null || token == undefined){

    }
    document.getElementById("uname").innerHTML = user.username;
    document.getElementById("email").innerHTML = user.email;
    document.getElementById("phone_number").innerHTML = user.phone_number;
    // let orders = user.orders == null ? 0 : user.orders; 
    // document.getElementById("orders").innerHTML = "All orders: " + orders;
    // let delivered = user.delivered == null ? 0 : user.delivered; 
    // document.getElementById("delivered").innerHTML = "Delivered: " + delivered;
    // let inTransit = user.in_transit == null ? 0 : user.in_transit; 
    // document.getElementById("in_transit").innerHTML = "In transit: " + inTransit;

    getUserParcels();
}

function checkIfLoggedIn(){
    if(localStorage.getItem("access_token") == null){
        alert("Not logged in");
        return 0;
    }
}

function logOut(){
    localStorage.removeItem("access_token");
    alert("Logged out");
    window.location.replace("../../templates/user/index.html");
}


function decodeToken(token){
	var playload = JSON.parse(atob(token.split('.')[1]));
    console.log(playload);
    
};






