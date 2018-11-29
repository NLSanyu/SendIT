function signUp(){
	postRequest('http://127.0.0.1:5000/api/v1/auth/signup', {username: 'Lydia', email: 'lydia@gmail.com', password: '123456789'})
    .then(data => console.log(data))
    .catch(error => console.error(error))
}

function postRequest(url, data) {
  return fetch(url, {
    credentials: 'same-origin', 
    method: 'POST', 
	mode: 'cors',
    body: JSON.stringify(data),
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
  });
  .then(response => response.json())
}


function signIn(){
}




