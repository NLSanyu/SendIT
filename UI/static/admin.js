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
                    <td>${parcel.description}</td>
                    <td>${parcel.pickup_location}</td>
                    <td contenteditable="true">${parcel.destination}</td>
                    <td>${parcel.price}</td>
                    <td>${parcel.status}</td>
                    <td><i class="fas fa-times"></i></td>
                </tr>
            `;
        })
        document.getElementById('parcels_output').innerHTML = output;
    })
    .catch((err) => console.log(err)) 
}





//'Authorization': `Bearer ${localStorage.getItem("access_token")}`