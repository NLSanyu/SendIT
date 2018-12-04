auth = `Bearer ` + localStorage.getItem("access_token");
click2 = 0;

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

    //decode token here to get user and include it in the url
    //decoded_token = decodeToken(access_token);

    fetch('http://127.0.0.1:5000/api/v1/users/2/parcels', {
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
                    <td contenteditable="true" id="dest" oninput="changeDest()">${parcel.destination}</td>
                    <td>${parcel.price}</td>
                    <td>${parcel.status}</td>
                    <td><i class="fas fa-times" onclick="cancelParcel()"></i></td>
                </tr>
            `;
        })
        document.getElementById('parcels_dd').innerHTML = output;
    })
    .catch((err) => console.log(err)) 
}

function createParcelForm(){
    click2 += 1;
    if(click2 > 1){
        return 0;
    }

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
    
    var div = document.createElement("div");
    div.innerHTML = form_string;
    var el = document.getElementById('profile-details');
    el.appendChild(div);

}

function changeDest(){
    let dest = document.getElementById("dest").value;
    fetch('http://127.0.0.1:5000/api/v1/parcels/1/destination', {
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
    })
    .catch((err) => console.log(err)) 
}


function cancelParcel(){
    fetch('http://127.0.0.1:5000/api/v1/parcels/1/cancel', {
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
    })
    .catch((err) => console.log(err)) 
}

function getUserInfo(){
    user_info = localStorage.getItem("user_info");
    var user = JSON.parse(localStorage.getItem('user_info'));
    //username = document.getElementById("uname");
    document.getElementById("uname").innerHTML = user.username;
    document.getElementById("email").innerHTML = user;
    document.getElementById("phone_number").innerHTML = user_info['phone_number'];
    document.getElementById("orders").innerHTML = user_info['orders'];
    document.getElementById("delivered").innerHTML = user_info['delivered'];
    document.getElementById("in_transit").innerHTML = user_info['in_transit'];
}


function decodeToken(token){
	var playload = JSON.parse(atob(token.split('.')[1]));
    console.log(playload);
    
};


