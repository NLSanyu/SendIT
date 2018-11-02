var dest, p, node;

function showTaglines(){
	var tags = ["abc", "def"];
	var tag_area = document.getElementByClassName('home-tagline');
	for(i=0;i<tags.length;i++){
		p = document.createElement("p");
        node = document.createTextNode(tags[i]);
		p.appendChild(node);
		tag_area.appendChild(p);
	}
}

function changeDestination(){
	document.getElementById('dest').innerHTML = '<form> <textarea name="parcel_details" rows="3"> </textarea>';
	dest = document.getElementById('button-dest');
	dest.innerHTML = '<input type="submit" name="new_dest" value="Confirm destination change" class="submit-button"> </form>';
	//dest.class="submit-button";
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


