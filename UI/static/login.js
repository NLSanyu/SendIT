var token;

function logIn(){
  let username = document.getElementById("uname2").value;
  let password = document.getElementById("password2").value;

  fetch('http://127.0.0.1:5000/api/v1/auth/login', {
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
    console.log(data['user_info']);
    user_info = data['user_info'];
    alert(data['message']);
    if(token){
      localStorage.setItem("access_token", token);
      localStorage.setItem("user_info", user_info);
      //window.location.replace("../../templates/user/profile.html");
    }
    
  })
  .catch((err) => console.log(err)) 
}

function decodeToken(token){
	var playload = JSON.parse(atob(token.split('.')[1]));
    console.log(playload);
    
};


