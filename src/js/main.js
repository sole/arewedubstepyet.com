var query_url = 'https://bugzilla.mozilla.org/bzapi/bug?resolution=---&classification=Client%20Software&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=REOPENED&component=Developer%20Tools%3A%20Web%20Audio%20Editor&product=Firefox&include_fields=id&include_fields=assigned_to&include_fields=summary&include_fields=last_change_time';
var request = new XMLHttpRequest();
request.open("GET", query_url);
request.setRequestHeader('Accept', 'application/json');
request.setRequestHeader('Content-Type', 'application/json');
request.addEventListener('load', onRequestLoad);
request.addEventListener('error', onRequestError);
request.send();

function onRequestLoad(req) {
	console.log(request.response);
	var txt = request.response.toString();
	document.body.appendChild(document.createTextNode(txt));
}

function onRequestError() {
	alert('bugzilla let us down. sad dinos');
}


