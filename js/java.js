//indexed database creatation 
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || 
window.msIndexedDB;
 
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || 
window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || 
window.webkitIDBKeyRange || window.msIDBKeyRange
if (!window.indexedDB) {
   	window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
var db;
var request = window.indexedDB.open("PhoneFixBookingSystem", 1);
request.onsuccess = function(event){
	db = request.result;
	console.log("successs: " + db);
};
request.onerror = function(event) {
    console.log("error: ");
};

request.onupgradeneeded = function(event) {
	var db = event.target.result;
	var objectStore;
	if (!db.objectStoreNames.contains('invoice')) {
		//Only create "invoice" table when it doesn't exist
		objectStore = db.createObjectStore('invoice', {keyPath: "id"});
		alert("done");
	}   
}


//validation function when the submit button is clicked
function validateForm(){
	//retrieving the data from the form 
	var title = document.forms["repair_form"]["title"].value
	var fname = document.forms["repair_form"]["Fname"].value
	var lname = document.forms["repair_form"]["Lname"].value
	var street = document.forms["repair_form"]["street"].value
	var suburb = document.forms["repair_form"]["sub"].value
	var city = document.forms["repair_form"]["city"].value
	var pcode = document.forms["repair_form"]["pc"].value
	var pnum = document.forms["repair_form"]["pn"].value
	var email = document.forms["repair_form"]["email"].value
	var purDate = new Date($("#pdate").val());
	var repDate = new Date($("#rdate").val());
	var warranty = document.forms["repair_form"]["warranty"].checked;
	var imei = document.forms["repair_form"]["imei"].value
	var make = document.forms["repair_form"]["make"].value
	var model = document.forms["repair_form"]["monum"].value
	var faultCat = document.forms["repair_form"]["fc"].value
	var des = document.forms["repair_form"]["desc"].value
	var bo = document.forms["repair_form"]["bond"].value
	var sf = document.forms["repair_form"]["service_fee"].value
	var to = document.forms["repair_form"]["total"].value
	var gst = document.forms["repair_form"]["gst"].value
	var togst = document.forms["repair_form"]["total_gst"].value
	var regname = /^[a-zA-Z- ]+$/;
	var regnum = /^[0-9()-+ ]+$/;
	//condition to check if it is empty
	if (fname == "" || lname == "" || street == "" || city == "" || pnum == "" || email == "" || imei == "" || des == ""){
		alert("All fields mrked with '*' are mandatory")
		return false;
	}

	//condition to check if repair date and purchase date is empty
	if($("#pdate").val() == "" || $("#rdate").val() == ""){
		alert("All fields mrked with '*' are mandatory");
		return false;
	}
	
	//condiiton to check firstname and last name
	if(regname.test(fname) == false || (regname.test(lname) == false)){
		alert("invalid charcters in first name or last name")
		return false;
	}
	
	//condition to check post code
	if(pcode.length != 4){
		alert("invalid post code")
		return false;
	}

	//condition to check phone number
	if(regnum.test(pnum) == false){
		alert("Invalid Phone number")
		return false;
	}
	
	//condition to check email
	/*var regemail = /^[a-zA-Z0-9.!#$%&@'*+/=?^_`{|}~-]+@+{5,}$/;
	alert(email.match(regemail));
	if(email.match(regemail) == false){
		alert("Invalid Email address")
		return false;
	}*/

	//condition to check imei num
	if(imei.length > 15){
		alert("Invalid IMEI number")
		return false
	}

	//condition to check if repair date is later than purchase date
	if (purDate > repDate){
		alert("Repair date should be later than the purchase date")
		return false;
	}

	//code for adding the data to indexed db
	/*let invoiceID = 0;
	var tx = db.transaction("invoice", "readwrite");
	tx.objectStore("invoice").openCursor().onsuccess = function(event) {
		var cursor = event.target.result;
		//For each cursor (each invoice object)/
		if (cursor) {
			//Get id
			let id = cursor.key;
		 	if (id >= invoiceID) {
		 		invoiceID = id;
		 	}
			//Move to next object
			cursor.continue();
		} else{

		}
	};

	tx.oncomplete = function(){
		alert("in");
		db.transaction("invoice").objectStore("invoice").get(0).onsuccess = function(event) {
			invoiceID ++;
			alert("invoiceID: " + invoiceID);

			var request = db.transaction(["invoice"], "readwrite")
			.objectStore("invoice")
			.add({ id: invoiceID, title: title, firstname: fname, lastname: lname, street: street, 
			city: city, post_code: pcode, phone_number: pnum, email: email, purchase_date: purDate,
			repair_date: repDate, imei_num: imei, make: make, model: model,
			fault_category: faultCat, description: des});

			request.onsuccess = function(event) {
				alert("added");
			};
			request.onerror = function(event){
				alert("nope");
			}
		}

	}*/

	//code for displaying the job sheet
	var invoice_date = new Date();
	var payment_date = new Date();
	payment_date.setDate(invoice_date.getDate() + 7);
	
	var wa = "";
	if(warranty == false) { 
		wa = "No";
	}else{
		wa = "Yes";
	}


	var cellval = []
	var myTab = document.getElementById("co_table");
	var rowlength = myTab.rows.length;
	for(i = 0; i < rowlength; i++){
		var cells = myTab.rows.item(i).cells;
		var celllength = cells.length;
		for(var j = 0; j < celllength; j++){
			cellval[j] = cells.item(j).innerHTML;
		}
	}

	var invoice_window = window.open("","booking");
	invoice_window.document.write(
		`
		<html>
		<head>
			<title>Repair Booking</title>
			<link rel="stylesheet" href="css/style.css" type="text/css">
		</head>
		`
	);
	invoice_window.document.write(
		`
		<body>
			<header style="background-color: grey; color: black;">
				<div class=container> 
					<div class=item1>
						<h1> Repair Booking </h1>
					</div>
					<div class=item2>
						<p> Amount Due</p>
						<h3> ${togst}</h3>
					</div>
				</div>
			</header>
			<main>
				<div class="container">
            		<div class="item1">
               			<h2> CUSTOMER </h2>
               			<br>
               			<p> ${title}  ${fname} ${lname}</p>
               			<p> ${street}</p>
               			<p> ${suburb}, ${city} ${pcode}</p>
               			<p> ${pnum}</p>
               			<p> ${email} </p>
            		</div>
	            	<div class="item2">
	               		<h2> Repair Job </h2>
	               		<br>
	               		<p> <b>Job Number:</b> ${0001}</p>
	               		<p> <b>Invoice Date:</b> ${invoice_date.getDate()}/${invoice_date.getMonth()}/${invoice_date.getYear()}</p>
	               		<p> <b>Payment Date:</b> ${payment_date} </p>
	            	</div>
        		</div>
        		<hr>
        		<div id ="rep_details">
	        		<h2> Repair Details </h2>
	        		<br>
	        		<p> <b>Purchase Date:</b> ${purDate.getDate()}/${purDate.getMonth()}/${purDate.getYear()}</p>
	        		<p> <b>Repair Date:</b> ${repDate.getDate()}/${repDate.getMonth()}/${repDate.getYear()} </p>
	        		<p> <b>Under Warranty:</b> ${wa} </p>
	        		<p> <b>IMEI Number:</b> ${imei} </p>
	        		<p> <b>Device Make:</b> ${make} </p>
	        		<p> <b>Model Number:</b> ${model} </p>
	        		<p> <b>Fault Category:</b> ${faultCat} </p>
	        		<p> <b>Description:</b> ${des} </p>
	        		<br><br>
	        	</div>
	        	<div id="loan_details">
	        		<h2> Courtesy Loan Device Details </h2>
	        		<br><br>
	        		<table id = "tab">
						<thead>
							<tr>
								<th> Item </th>
								<th> Cost </th>
							</tr>
							<tr>
								<td> ${cellval[0]} </td>
								<td> ${cellval[1]} </td>
							</tr>
						</thead>
						<tbody>
			
						</tbody>
					</table>
	        	</div>
	        	<div id="cost_details">
	        		<h2> Totals </h2>
	        		<p> <b>Bond:</b> &ensp; &ensp; &ensp; &ensp; &ensp; ${bo} </p>
	        		<p> <b>Service Fee:</b> &ensp; &ensp; ${sf} </p>
	        		<p> <b>Total:</b> &ensp; &ensp; &ensp; &ensp; &ensp; ${to} </p>
	        		<p> <b>GST:</b> &ensp; &ensp; &ensp; &ensp; &ensp; &ensp; ${gst} </p>
	        		<p> <b>Total(+GST):</b> &ensp; &ensp; ${togst} </p>
	        	</div>
			</main>
		</body>
		</html>
		`
		);
}

//jquery date picker for purchase and repair date 
$(function(){
	$("#pdate").datepicker({
		maxDate: 0,
		onClose: function(selectedDate){
			var date = new Date(selectedDate);
			var today = new Date();                                  
			var diff = (today - date)/(1000*3600*24);     
			if (diff > 365){
				$("#waran").prop("checked",false);
			} else{
				$("#waran").prop("checked",true);
				$("#waran").click();
			}
		}
	});

	$("#rdate").datepicker({
		maxDate: 0
	});
});


//function for FAQ page
function loadJSON(){
	$.ajax({
			method: 'GET',
			url: 'https://cors-anywhere.herokuapp.com/' + 'http://assignment.orgfree.com/faq.json',
			dataType: 'json', 
		//use of jquery
		success: function(data){
			//create a new window for FAQ and write data into it
			var newwindow = window.open("","FAQs");
			newwindow.document.write(
				`
				<html>
				<head>
					<title>FAQs</title>
					<link rel="stylesheet" href="css/style.css" type="text/css">
					<script src="js/java.js"></script>
				</head>
				`
			);
			newwindow.document.write(
				`
				<body>
				<header><h1 class="title_area"> Phone Fix Booking FAQs </h1> 
				</header>
				<main> 
				<br><br>
				Search: <input type="search" id="se"> 
				<input type="button" value="search" onclick="search()"">
				<p id="searchResult"> Search Results: <br><br></p>
				`
			);
			$.each(data, function(i, post){//i: index post: object
				newwindow.document.write(
					`
					<div class="example"> 
						<h3> ${post.Question} </h3>
						<br />
						<p> ${post.Answer} </p>
					</div>
					</main>
					`
				);
			});
			newwindow.document.write(
				`
				<footer> 
					<p> Advanced Web Design Copyright &copy; 2019 </p>
				</footer>
				</body>
				</html>
				<script>

				</script>
				`
			);
		}
	});
}

//function for search feature in the faq page 
function search(){
	var fqas = [{
		"Question": " Why do I have to pay a service fee?",
		"Answer": " A service fee is only charged for repairs to devices that are no longer under warran-ty. Business customers are not charged a service fee in accord with the terms of their contract "
	},
	{
		"Question": " What is the bond for?",
 		"Answer": " The bond is to cover any damage done to the courtesy phone and/or charger. The bond will be refunded upon the safe and undamaged return of the phone and charger."
 	},
 	{
 		"Question": "Do I need a charger with my courtesy phone?",
 		"Answer" : "No, a charger is optional. You can add one with the 'Add charger' button. If you don't want one but added one by accident, you can remove it by clicking on the 'Remove charger' button."
 	},

 	{
 		"Question": " Why isn't my phone under warranty?",
 		"Answer" : " The length of your phone's warranty depends on the warranty package you chose upon purchase. The standard is 24 months and is calculated from its purchase date."
 	},
 	
 	{
 		"Question": " How long will my repair take?",
 		"Answer" : " Depends on your phone broken status. It takes normally 5 to 7 working days."
 	},
 	
 	{
 		"Question": " How do you protect the private information in my phone?",
 		"Answer" : " We comply with all relevant laws regarding privacy and client confidentiality."
 	},
 
 	{
 		"Question": " Where do you get your replacement parts?",
 		"Answer" : " We will send you a quote of all possible vendors who supply replacement parts for your references and your choice."
 	},
 	
 	{
 		"Question": " What happens if my phone is further damage after leaving it with you?",
 		"Answer" : " We make sure that it never happens."
 	},
 	
 	{
 		"Question": " What kind of warranty do you offer and what does it cover?",
 		"Answer" : "1 month is the average warranty period. These warranties covers parts and service only."
 	},
 	
 	{
 		"Question": " What does the repair estimate include?",
 		"Answer" : " The repair price estimate includes both replacement parts and labor."
 	}
 	];

 	var search_term = document.getElementById("se").value;
 	var results = fqas.filter(function(fqas) {
 		return fqas.Question.indexOf(search_term) > -1;
 	});

 	//printing the results to the html page. 
 	if(results.length == 0) {
 		document.getElementById("searchResult").innerHTML = "Not found!";
 	} else {
 		for (var i=0; i< results.length; i++) {
 			document.getElementById("searchResult").innerHTML += results[i].Question + "<br>";//result.question
 			document.getElementById("searchResult").innerHTML += results[i].Answer + "<br><br>";//result.answer
 		}
 	}

}

//adding table in the coutesy phone area and calculating costs
function addItem(){
	var item = [
		{name:'iphone', cost:'275'},
		{name:'Other Phone', cost:'100'},
		{name:'Charger', cost:'30'}
	];
	var x = document.getElementById("itemtype");
	var itemType = x.options[x.selectedIndex].text;
	$.each(item, function(i, value){//i: index post: object
		var items = [];
		if(itemType == value.name){
			var addData = "<tr><td>" + value.name + "</td><td class=costt> $" + value.cost + "</td></tr>";
			$("table tbody").append(addData);
		}
	});

	var cost = [];
	$('#co_table tr').each(function(a,b){
		co = $('.costt', b).text();
		cost.push(String(co));
	});

	//calculating bond
	var bond = 0;
	for (i=1; i<cost.length; i++){
		bond = bond + parseInt(cost[i].substr(2));
	}

	//depending on the customer type adding bond to the total cost
	var custType = $("input[name=type]:checked").val();
	if (custType == "consumer"){
		document.getElementById("bond").value = ("$" + bond);
	} else{
		bond = 0;
		document.getElementById("bond").value = ("$" + bond);
	}

	var ser_fee = 85;

	if($("#waran").is(':checked') == false) { 
		document.getElementById("service_fee").value = ("$" + ser_fee);	
	} else{
		ser_fee = 0;
		document.getElementById("service_fee").value = ("$" + ser_fee);	
	}

	//caluclating total cost 
	tot = parseInt(bond) + parseInt(ser_fee);
	document.getElementById("total").value = ("$" + tot);

	document.getElementById("gst").value = ("$" + 0.15*tot);

	//calculating total cost plus gst
	tot_gst = tot + 0.15*tot;
	document.getElementById("total_gst").value = ("$" + tot_gst);
}

//function to get the location information 
window.onload = function get_location() {
	var x = document.getElementById("dem");
 	if (navigator.geolocation) {
 		navigator.geolocation.getCurrentPosition(showPosition);
 	} else {
 		x.innerHTML = "Geolocation is not supported by this browser.";
 	}
}

function showPosition(position) {
	var x = document.getElementById("dem");
	x.innerHTML = ("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude);
} 
