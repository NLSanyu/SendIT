var token;

function logIn(){
  document.getElementById("load").style.display = "block";
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
      if(user_info.username == "admin"){
        window.location.replace("../../templates/admin/admin_page.html");
      }
      else {
        window.location.replace("../../templates/user/profile.html")
      }
    }
    
  })
  .catch((err) => console.log(err)) 
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


