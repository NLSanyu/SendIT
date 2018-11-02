var dest, p, node, tag_area;

function showTaglines(){
	var tags = ["A courier service you can trust", "Deliver parcels to different destinations", "Deliver parcels to different destinations", "Keep track of your deliveries", "Benefit from the best prices on the market"];
	for(i=0;i<tags.length;i++){
		setTimeout(function taglines(){
			tag_area = document.getElementById("tag");
			p = document.createElement("p");
			//node = document.createTextNode(tags[i]);
		    node = document.createTextNode("abc");
			p.appendChild(node);
			tag_area.appendChild(p);
		}, 2000);
	}
}

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

function cancelOrder(){
	alert("Order cancelled");
}

function validateParcelForm(){
	var val = document.forms["create_parcel_form"]["parcel_desc"].value;
    if (val == "") {
        alert("Description must be filled out");
        return false;
    }
}

function adminViewUsers(){
	document.getElementById('parcel-details').innerHTML = '<p>SendIT Users</p>';
}

function adminViewParcels(){
	document.getElementById('parcel-details').innerHTML = '<p>Parcel order deliveries</p>';
}


