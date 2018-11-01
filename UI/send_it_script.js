var destination, order_canceled;
//var create = '';
//var view = '';

function createDelivery(){
	document.getElementById('parcel-details').innerHTML = '<p>Create parcel order</p>';
}

function viewDeliveries(){
	document.getElementById('parcel-details').innerHTML = '<p>Parcel order deliveries</p>';
}

function changeDestination(){
	destination = prompt("Change destination");
}

function cancelOrder(){
	if(status != "delivered"){
		order_canceled = alert("Cancel order");
	}
}

