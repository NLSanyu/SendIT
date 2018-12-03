function getUserInfo(){
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





