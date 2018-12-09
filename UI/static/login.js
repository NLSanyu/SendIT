var token;

function logIn(){
  let username = document.getElementById("uname2").value;
  let password = document.getElementById("password2").value;

  fetch('https://nls-sendit.herokuapp.com/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    }, 
    body: JSON.stringify({username: username, password: password})
  })
  .then((res) => res.json())
  .then(function(data){
    console.log(data);
    token = data['access_token'];
    user_info = data['user_info'];
    let msg = data['message'];
    if(msg != "user logged in succesfully"){
      let info = `${data['message']}`;
      showModal(info);
      return 0;
    };
    if(token){
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_info", JSON.stringify(user_info));
      window.location.replace("../../templates/user/profile.html");
    }
    
  })
  .catch((err) => console.log(err)) 
}

function showModal(info){
  let modal = document.getElementById('myModal');
  let modalBody = document.getElementById('modal-body');
  modal.style.display = "block";
  modalBody.innerHTML = info;


  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
      modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
      if (event.target == modal) {
      modal.style.display = "none";
      }
  }
}


