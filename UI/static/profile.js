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
        getUserParcels();
    })
    .catch((err) => console.log(err)) 
  
}


function getUserParcels(status){
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
            <table class="parcel-table">
            <tr>
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
                        <td>${parcel.date_created}</td>
                        <td>${parcel.description}</td>
                        <td>${parcel.pickup_location}</td>
                        <td contenteditable="true"
                        onblur="changeDest(${parcel.parcel_id}, event.target.innerText)">${parcel.destination}</td>
                        <td>UGX 3000</td>
                        <td>${parcel.status}</td>
                        <td class="view" onclick="showParcelPopUp(${parcel.parcel_id})">View</td>
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
        console.log(statuses);
        for (const st of statuses){
            if(status == st){
                document.getElementById(status).style.backgroundColor = "#bbb";
            }
            else {
                document.getElementById(st).style.backgroundColor = "#ddd";
            } 
        }

        output += `</table>`;
        document.getElementById('parcels-div').innerHTML = output;

        if(showParcels == 1){
            window.setTimeout(showGuide, 3000);
            document.getElementById("All").innerHTML = "All orders: " + counter['All'];
            document.getElementById("Delivered").innerHTML = "Delivered: " + counter['Delivered'];
            document.getElementById("In Transit").innerHTML = "In transit: " + counter['In Transit'];
            document.getElementById("Cancelled").innerHTML = "Cancelled: " + counter['Cancelled'];
            document.getElementById("Pending").innerHTML = "Pending: " + counter['Pending'];
        }

    })
    .catch((err) => console.log(err)) 
}

function getOneParcel(parcel_id){
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
        if(data['message'] === 'parcel non-existent'){
            document.getElementById('parcels-div').innerHTML = "<br><p>This parcel does not exist</p>";
            return 0;
        }
        if(data['msg'] === 'Token has expired'){
            document.getElementById('parcels-div').innerHTML = "<br><p>Token expired</p>";
            return 0;
        }
        parcel = data['data'][0];

        output = `
            <div class="parcel-details">
            <p><strong>Date created </strong>: ${parcel.date_created}</p>
            <p><strong>Description</strong>: ${parcel.description}</p>
            <p><strong>Pickup location</strong>: ${parcel.pickup_location}</p>
            <p><strong>Destination</strong>: ${parcel.destination}</p>
            <p><strong>Price</strong>: UGX 3000</p>
            <p><strong>Status</strong>: ${parcel.status}</p>
            <button class="submit-button" id="cancel-btn" onclick="cancelParcel(${parcel.parcel_id})">Cancel parcel</button> 
            <div>`;
        
        document.getElementById('pop-up-info').innerHTML = output;
    })
    .catch((err) => console.log(err)) 
}


function changeDest(parcel_id, val){
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
        getUserParcels(); 
    })
    .catch((err) => console.log(err)) 
}


function cancelParcel(parcel_id){
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
        getUserParcels();   
    })
    .catch((err) => console.log(err)) 
}

function showUserInfo(){
    token = localStorage.getItem("acess_token");
    document.getElementById("uname").innerHTML = user.username;
    document.getElementById("email").innerHTML = user.email;
    document.getElementById("phone_number").innerHTML = user.phone_number;
    getUserParcels("All");
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

function showParcelPopUp(parcel_id) {
    document.getElementById('parcel-pop-up').style.display = "block";
    getOneParcel(parcel_id);
}

function hideParcelPopUp(){
document.getElementById('parcel-pop-up').style.display = "none";
}

function showGuide() {
    let info = `Columns with an edit icon (<i class="fas fa-edit"></i>) can be edited`;
    showModal(info);
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








