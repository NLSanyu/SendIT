function createParcel(){
    let description = document.getElementById("desc").value;
    let pickupLocation = document.getElementById("pickup").value;
    let destination = document.getElementById("dest").value;
    auth = `Bearer ` + localStorage.getItem("access_token");
  
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

function getParcels(){
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
        let output = `
            <tr>
                <th>Description</th>
                <th>Pickup location</th>
                <th>Destination</th>
                <th>Price</th>
                <th>Status</th>
                <th>Cancel</th>
            </tr>
        `;
        data.forEach(function(parcel){
            output += `
                <tr>
                    <td>${parcel.description}</td>
                    <td>${parcel.pickup_location}</td>
                    <td contenteditable="true">${parcel.destination}</td>
                    <td>${parcel.price}</td>
                    <td>${parcel.status}</td>
                    <td><i class="fas fa-times"></i></td>
                </tr>
            `;
            document.getElementById('parcels_output').innerHTML = output;
        })
    })
    .catch((err) => console.log(err)) 
}





//'Authorization': `Bearer ${localStorage.getItem("access_token")}`