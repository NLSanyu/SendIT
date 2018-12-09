function signUp(){
  let username = document.getElementById("uname1").value;
  let email = document.getElementById("email1").value;
  let phoneNumber = document.getElementById("phone1").value;
  let password = document.getElementById("password1").value;
  let confirmPassword = document.getElementById("confirm-password1").value;

  if(password != confirmPassword){
    let info = `Password not the same`;
    showModal(info);
  }
  else {
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
    let info = `${data['message']}`;
    showModal(info);
    window.setTimeout(function(){ window.location.replace("../../templates/user/sign_in.html"); }, 3000);
    ;
  })
  .catch((err) => console.log(err)) 
  }
}

function showModal(info){
  let modal = document.getElementById('myModal');
  let modalBody = document.getElementById('modal-body');
  modal.style.display = "block";
  modalBody.innerHTML = info;

  var span = document.getElementsByClassName("close")[0];

  span.onclick = function() {
      modal.style.display = "none";
  }

  window.onclick = function(event) {
      if (event.target == modal) {
      modal.style.display = "none";
      }
  }
}



