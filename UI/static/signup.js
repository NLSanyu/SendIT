function signUp(){
  let username = document.getElementById("uname1").value;
  let email = document.getElementById("email1").value;
  let phoneNumber = document.getElementById("phone1").value;
  let password = document.getElementById("password1").value;
  let confirmPassword = document.getElementById("confirm-password1").value;

  if(password != confirmPassword){
      alert("Password not the same");
      return 0;
  }

  fetch('http://127.0.0.1:5000/api/v1/auth/signup', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    }, 
    body: JSON.stringify({username: username, email: email, phone_number: phoneNumber, password: password})
  })
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    alert(data['message']);
  })
  .catch((err) => console.log(err)) 

}



