var auth = `Bearer ` + localStorage.getItem("access_token");
var user = JSON.parse(localStorage.getItem('user_info'));
var click2 = 0;

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
        console.log(data['message'])
        if(data['message'] === 'no parcels for this user'){
            document.getElementById('parcels-dd').innerHTML = "<p>This user has no parcels yet</p>";
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
            </tr>`;
        parcels.forEach(function(parcel){
            output += `
                <tr>
                    <td>${parcel.date_created}</td>
                    <td>${parcel.description}</td>
                    <td>${parcel.pickup_location}</td>
                    <td contenteditable="true" id="dest" oninput="changeDest(${parcel.parcel_id})">${parcel.destination}</td>
                    <td>${parcel.price}</td>
                    <td>${parcel.status}</td>
                    <td><i class="fas fa-times" onclick="cancelParcel(${parcel.parcel_id})"></i></td>
                </tr>
            `;
        })
        output += `</table>`;
        document.getElementById('parcels-dd').innerHTML = output;
    })
    .catch((err) => console.log(err)) 
}

function createParcelForm(){
    form_string = `
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
			<!-- <input name="submit_button" type="submit" value="Create" class="button-right" onclick="createParcel()"> -->
			<button type="button" class="submit-button" id="create_parcel_btn" onclick="createParcel()">Create parcel</button> 

		</form>
    </div>`;

    // let formDiv = document.getElementById('parcel-form-div');
    // formDiv.style.display = "block";
    
    // var div = document.createElement("div");
    // div.innerHTML = form_string;
    // var el = document.getElementById('profile-details');
    // el.appendChild(div);

    document.getElementById('parcels-dd').innerHTML = form_string;

}

function changeDest(parcel_id){
    let dest = document.getElementById("dest").value;
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
    let orders = user.orders == null ? 0 : user.orders; 
    document.getElementById("orders").innerHTML = "All orders: " + orders;
    let delivered = user.delivered == null ? 0 : user.delivered; 
    document.getElementById("delivered").innerHTML = "Delivered: " + delivered;
    let inTransit = user.in_transit == null ? 0 : user.in_transit; 
    document.getElementById("in_transit").innerHTML = "In transit: " + inTransit;
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


