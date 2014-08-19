var printf = require('printf');


var loadingPane;
var resultsPane;
var resultsTable;

init();

//

function init() {

	loadingPane = document.getElementById('loading');
	resultsPane = document.getElementById('results');
	resultsTable = resultsPane.querySelector('table');

	show(loadingPane);
	hide(resultsPane);

	loadBugs();
	
}

function loadBugs() {

	var query_url = 'https://bugzilla.mozilla.org/bzapi/bug?resolution=---&classification=Client%20Software&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=REOPENED&component=Developer%20Tools%3A%20Web%20Audio%20Editor&product=Firefox&include_fields=id&include_fields=assigned_to&include_fields=summary&include_fields=last_change_time';
	var request = new XMLHttpRequest();
	request.open("GET", query_url);
	request.setRequestHeader('Accept', 'application/json');
	request.setRequestHeader('Content-Type', 'application/json');
	request.responseType = 'json';
	request.addEventListener('load', onRequestLoad);
	request.addEventListener('error', onRequestError);
	request.send();

	function onRequestLoad() {
		console.log(request.response);
		
		var res = request.response;
		var bugs = res.bugs !== undefined ? res.bugs : [];
		resultsTable.innerHTML = '';

		if(bugs.length) {
			bugs.forEach(function(b) {
				var tr = resultsTable.insertRow(-1);
				addColumn(tr, linkBug(b.id));
				addColumn(tr, b.summary);
				addColumn(tr, b.assigned_to.name);
				addColumn(tr, b.last_change_time);
			});
		} else {
		}

		show(resultsPane);
		hide(loadingPane);
	}

	function onRequestError() {
		alert('bugzilla let us down. sad dinos');
	}

}


function show(el) {
	el.style.display = 'block';
}

function hide(el) {
	el.style.display = 'none';
}

function addColumn(row, txt) {
	var td = row.insertCell(-1);
	td.innerHTML = txt;
}

function linkBug(id) {
	return printf('<a target="_blank" href="https://bugzilla.mozilla.org/show_bug.cgi?id=%d">%d</a>', id, id);
}
