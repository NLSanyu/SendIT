var dest, order_canceled;

function changeDestination(){
	document.getElementById('dest').innerHTML = '<form> <textarea name="parcel_details" rows="3"> </textarea>';
	dest = document.getElementById('button-dest');
	dest.innerHTML = '<input type="submit" name="new_dest" value="Confirm destination change" class="submit-button"> </input> </form>';
	//dest.class="submit-button";
}

function cancelOrder(){
	if(status != "delivered"){
		order_canceled = alert("Cancel order");
	}
}

function adminViewUsers(){
	document.getElementById('parcel-details').innerHTML = '<p>SendIT Users</p>';
}

function adminViewParcels(){
	document.getElementById('parcel-details').innerHTML = '<p>Parcel order deliveries</p>';
}


