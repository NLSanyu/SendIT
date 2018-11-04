var dest, signedIn=false
var sign = "Sign In"

function changeDestination(){
	document.getElementById('dest').innerHTML = '<form> <textarea name="parcel_details" rows="3"> </textarea>';
	dest = document.getElementById('button-dest');
	dest.innerHTML = '<input type="submit" name="new_dest" value="Confirm destination change" class="submit-button"> </form>';
	//dest.class="submit-button";
}

function changeStatus(){
	document.getElementById('dest').innerHTML = '<form> <textarea name="parcel_details" rows="3"> </textarea>';
	dest = document.getElementById('button-dest');
	dest.innerHTML = '<input type="submit" name="new_dest" value="Confirm destination change" class="submit-button"> </form>';
	//dest.class="submit-button";
}

function signIn(){
	signedIn = true;
	alert("Hey")
}

function signOut(){
	signedIn = false;
}

function showSignInOrOut(){
	var el = document.getElementById('sign'); 
	if(signedIn == true){
		el.innerHTML = "Sign Out";
	}
	else {
		el.innerHTML = "Sign In";
	}
}

function cancelOrder(){
	alert("Order cancelled");
}

function adminViewUsers(){
	document.getElementById('parcel-details').innerHTML = '<p>SendIT Users</p>';
}

function adminViewParcels(){
	document.getElementById('parcel-details').innerHTML = '<p>Parcel order deliveries</p>';
}


