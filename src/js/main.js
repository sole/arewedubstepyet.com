var printf = require('printf');
// Map meta bug numbers to corresponding Firefox version milestone
var VERSIONS = {
	"980501": "32",
	"1022248": "33",
	"1040352": "34",
	"1055215": "35"
};
var metaBugs = Object.keys(VERSIONS);

var loadingPane;
var resultsPane;
var resultsTable;
var summary;

init();

//

function init() {

	loadingPane = document.getElementById('loading');
	resultsPane = document.getElementById('results');
	resultsTable = resultsPane.querySelector('table');
	summary = document.getElementById('summary');

	show(loadingPane);
	hide(resultsPane);

	loadBugs();

}

function loadBugs() {

	var bugzilla_url = 'https://bugzilla.mozilla.org/buglist.cgi?resolution=---&classification=Client%20Software&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&component=Developer%20Tools%3A%20Web%20Audio%20Editor&product=Firefox&list_id=11023580';
	var query_url = 'https://bugzilla.mozilla.org/bzapi/bug?resolution=---&classification=Client%20Software&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=REOPENED&component=Developer%20Tools%3A%20Web%20Audio%20Editor&product=Firefox&include_fields=id&include_fields=assigned_to&include_fields=summary&include_fields=last_change_time&include_fields=blocks';
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
			summary.innerHTML = printf('Found <a href="%s">%d bugs</a>.', bugzilla_url, bugs.length);
			bugs.forEach(function(b) {
				var tr = resultsTable.insertRow(-1);
				var assignedTo = b.assigned_to.name;

				if(assignedTo === 'nobody') {
					tr.classList.add('unassigned');
				}

				addColumn(tr, versionBadge(b.blocks));
				addColumn(tr, linkBug(b.id));
				addColumn(tr, linkBug(b.id, b.summary));
				addColumn(tr, assignedTo);
				addColumn(tr, b.last_change_time);
			});
		} else {
			summary.innerHTML = 'ZARRO BUGS FOUND';
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

function linkBug(id, linkText) {
	linkText = linkText !== undefined ? linkText : id;
	return printf('<a target="_blank" href="https://bugzilla.mozilla.org/show_bug.cgi?id=%d">%s</a>', id, linkText);
}

function versionBadge (blocks) {
	var blocker;
	for (var i = 0; i < blocks.length; i++) {
		blocker = blocks[i] + '';
		if (~metaBugs.indexOf(blocker)) {
			return printf('<a class="badge" target="_blank" href="https://bugzilla.mozilla.org/show_bug.cgi?id=%d">%s</a>', blocker, 'Fx' + VERSIONS[blocker]);
		}
	}
	return '';
}
