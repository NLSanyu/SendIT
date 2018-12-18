var auth = `Bearer ` + localStorage.getItem("access_token");
var user = JSON.parse(localStorage.getItem('user_info'));
var specific_parcel;
var counter = {"All": 0, "Delivered": 0, "In Transit": 0, "Cancelled": 0, "Pending": 0};
var showParcels = 0;

function createParcel(){
    let description = document.getElementById("desc").value;
    let pickupLocation = document.getElementById("pickup").value;
    let destination = document.getElementById("dest").value;
    document.getElementById("create-parcel-form").reset();
  
    fetch('https://nls-sendit.herokuapp.com/api/v1/parcels', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'Authorization': auth
      }, 
      body: JSON.stringify({description: description, pickup_location: pickupLocation, destination: destination})
    })
    .then((res) => res.json())
    .then((data) => {
        console.log(data);
        let info = `${data['message']}`;
        showModal(info);
        getUserParcels("All");
    })
    .catch((err) => console.log(err)) 
  
}


function getUserParcels(status){
    counter["All"] = 0; counter["Pending"] = 0; counter["In Transit"] = 0; counter["Delivered"] = 0; counter["Cancelled"] = 0;
    showParcels += 1;
    auth = `Bearer ` + localStorage.getItem("access_token");
    user_id = user.user_id;
    let url = 'https://nls-sendit.herokuapp.com/api/v1/users/' + user_id + '/parcels';
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
            <h3>My parcel delivery orders</h3>
            <table class="parcel-table">
            <tr>
                <th>Id</th>
                <th>Date created</th>
                <th>Description</th>
                <th>Pickup location</th>
                <th>Destination <i class="fas fa-edit"></th>
                <th>Price</th>
                <th>Status</th>
                <th></th>
            </tr>`;
        parcels.forEach(function(parcel){
            if(parcel.status == status || status == "All"){
                output += `
                    <tr>
                        <td>${parcel.parcel_id}</td>
                        <td>${parcel.date_created}</td>
                        <td>${parcel.description}</td>
                        <td>${parcel.pickup_location}</td>
                        <td contenteditable="true"
                        onblur="changeDest(${parcel.parcel_id}, event.target.innerText)">${parcel.destination}</td>
                        <td>UGX 3000</td>
                        <td>${parcel.status}</td>
                        <td class="view" onclick="showOneParcel(${parcel.parcel_id})">View</td>
                    </tr> `;
            }

            counter['All'] += 1;
            switch(parcel.status){
                case "Delivered": counter['Delivered'] += 1;
                case "In transit": counter['In Transit'] += 1;
                case "Cancelled": counter['Cancelled'] += 1;
                case "Pending": counter['Pending'] += 1; 
            }
            
        })

        const statuses = Object.keys(counter);
        for (const st of statuses){
            if(status == st){
                document.getElementById(status).style.backgroundColor = "#bbb";
            }
            else {
                document.getElementById(st).style.backgroundColor = "#ddd";
            } 
        }

        output += `</table>`;
        document.getElementById('all-parcels').innerHTML = output;
        document.getElementById("All").innerHTML = "All orders: " + counter['All'];
        document.getElementById("Delivered").innerHTML = "Delivered: " + counter['Delivered'];
        document.getElementById("In Transit").innerHTML = "In transit: " + counter['In Transit'];
        document.getElementById("Cancelled").innerHTML = "Cancelled: " + counter['Cancelled'];
        document.getElementById("Pending").innerHTML = "Pending: " + counter['Pending'];

        if(showParcels < 1){
            window.setTimeout(showGuide, 3000);
        }

    })
    .catch((err) => console.log(err)) 
}

function getOneParcel(){
    auth = `Bearer ` + localStorage.getItem("access_token");
    parcel_id = localStorage.getItem("parcel_id");
    console.log(parcel_id);
    let url = 'https://nls-sendit.herokuapp.com/api/v1/parcels/' + parcel_id;
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
        parcel = data['data'][0];
        output = `
            <h4>Id: ${parcel.parcel_id}</h4>
            <h4>Date created: </h4>${parcel.date_created}
            <h4>Description: </h4>${parcel.description}
            <h4>Pickup location: </h4>${parcel.pickup_location}
            <h4>Destination: </h4>${parcel.destination}
            <h4>Price: </h4>UGX 3000
            <h4>Status: </h4>${parcel.status}
            <br>
            <button class="submit-button" id="cancel-btn" onclick="cancelParcel(${parcel.parcel_id})">Cancel parcel</button>`;
        
        document.getElementById('one-parcel').innerHTML = output;
    })
    .catch((err) => console.log(err)) 
}

function searchForParcel() {
    parcel_id = document.getElementById("search-box").value;
    document.getElementById("search-box").value="";

    auth = `Bearer ` + localStorage.getItem("access_token");
    let url = 'https://nls-sendit.herokuapp.com/api/v1/parcels/' + parcel_id;
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
        if(data['message'] == 'no parcel with this id'){
            showModal("No parcel with this id");
        }
        else {
            if(data['msg'] == 'Token has expired'){
               showModal(data['msg']);
            }
            else {
                localStorage.setItem("parcel_id", parcel_id);
                window.open("../../templates/user/parcel.html", '_blank');
            }
        }
    });
}

function changeDest(parcel_id, val){
    //showParcelPopUp();
    let url = 'https://nls-sendit.herokuapp.com/api/v1/parcels/' + parcel_id + '/destination';
    fetch(url, {
        method: 'PUT',
        headers: {
        'Content-type': 'application/json',
        'Authorization': auth
        }, 
        body: JSON.stringify({destination: val})
    })
    .then((res) => res.json())
    .then(function(data){
        console.log(data);
        let info = `${data['message']}`;
        showModal(info);
        getUserParcels("All"); 
    })
    .catch((err) => console.log(err)) 
}


function cancelParcel(parcel_id){
    //showParcelPopUp();
    let url = 'https://nls-sendit.herokuapp.com/api/v1/parcels/' + parcel_id + '/cancel';
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
        let info = `${data['message']}`;
        showModal(info);
        getUserParcels("All");   
    })
    .catch((err) => console.log(err)) 
}

function showOneParcel(parcel_id) {
    localStorage.setItem("parcel_id", parcel_id);
    window.open("../../templates/user/parcel.html", '_blank')
}

function showUserInfo(){
    token = localStorage.getItem("acess_token");
    document.getElementById("uname").innerHTML = user.username;
    document.getElementById("email").innerHTML = user.email;
    document.getElementById("phone_number").innerHTML = user.phone_number;
    getUserParcels("All");
}

function showCreateForm() {
    let pickup = "pickup";
    let dest = "dest";
    document.getElementById('parcel-pop-up').style.display = "block";
    output = `<div class="create-form-div">
              <form class="create-form" id="create-parcel-form"> 
                <label for="desc">Description:</label><br>
                <input type="text" id="desc"><br>
                <label for="pickup">Pickup Location:</label><br>
                <input type="text" id="pickup" onclick="searchPlaces('${pickup}')"><br>
                <label for="dest">Destination:</label><br>
                <input type="text" id="dest" oninput="searchPlaces('${dest}')"><br><br>
                <button type="button" class="create-btn" id="create_parcel_btn" onclick="createParcel()">Create parcel</button> 
                <button type="button" class="create-btn" id="open-maps-btn" onclick="createMap(2)">Use Google Maps</button> 
              </form>
              </div>`;

    let popUp = document.getElementById("pop-up-info");
    popUp.innerHTML = output;
    var div = document.createElement("div");
    div.id = "map";
    div.style.marginLeft = "auto";
    div.style.marginRight = "auto";
    div.style.marginTop = "15px";
    popUp.appendChild(div);

}

function checkIfLoggedIn(){
    if(localStorage.getItem("access_token") == null){
        let info = `Not logged in`;
        showModal(info);
        return 0;
    }
}

function logOut(){
    localStorage.removeItem("access_token");
    let info = `Logging out`;
    showModal(info);
    window.location.replace("../../templates/user/sign_in.html");
}

function showParcelPopUp() {
    let confirm = 0;
    document.getElementById('parcel-pop-up').style.display = "block";
    let popUp = document.getElementById('pop-up-info');
    let output = `<div class="confirm">
                <p>Confirm</p>
                <button type="button" class="create-btn" onclick="confirm = 1">Confirm</button>
                <button type="button" class="create-btn" onclick="hideParcelPopUp()">Discard</button>
                <div>`;
    if(confirm == 1){console.log("confirm");}
    popUp.innerHTML = output;

}

function hideParcelPopUp(){
    document.getElementById('parcel-pop-up').style.display = "none";
}

function showGuide() {
    let info = `Columns with an edit icon (<i class="fas fa-edit"></i>) can be edited`;
    showModal(info);
}

function searchPlaces(place){
    var input = document.getElementById(place);
    new google.maps.places.Autocomplete(input);
}

function openMapPage(){
    window.open("../../templates/user/map.html", '_blank');
}

function showModal(info){
    let modal = document.getElementById('myModal');
    let modalBody = document.getElementById('modal-body');
    modal.style.display = "block";
    modalBody.innerHTML = info;

    var span = document.getElementsByClassName("close")[0];

    setTimeout(function(){ modal.style.display = "none"; }, 3000);

    span.onclick = function() {
        modal.style.display = "none";
    }
  
    window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
        }
    }
}








