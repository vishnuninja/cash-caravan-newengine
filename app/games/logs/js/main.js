// main code
var serverIP = "https://dev-games.progaindia.com"; //https://dg-dev.dragongaming.com
var serverUrl = serverIP + "/server_logs/getLogs.php";
var accountId = getParameterByName("account_id");
var curPage = 1;
var totalPages = 1;
var perPage = 50;
var data = {};
var pagination = document.getElementById("pagination");

function updateData(data) {
	this.data = data;
	// this.data.length = 99;
	var keywords = document.getElementById("keywords");
	keywords.style.display = "table";

	var tableTitle = document.getElementById("tableTitle");
	var len = tableTitle.children.length;
	for (let i = 0; i < len; i++) {
		tableTitle.children[i].innerHTML = _lang[tableTitle.children[i].innerHTML];
	}
	createPagination();
	updatePageData(1);

}

function updatePageData(page) {
	this.curPage = page;
	// var i = 0;
	// var len = this.data.length;
	var tbodyLogs = document.getElementById("tbodyLogs");
	while (tbodyLogs.hasChildNodes()) {
		tbodyLogs.removeChild(tbodyLogs.firstChild);
	}

	setCurrency(this.data[0][5]);
	for (var o = (curPage - 1) * perPage; o < (curPage * perPage) && o < this.data.length; o++) {
		// for (let o = 0; o < len; o++) {
	
	
		//console.log("====>before ", this.data[o]);
		this.data[o].splice(4, 0, "test");
		//console.log("====>after ", this.data[o]);
		
		var tr = document.createElement("tr");
		for (let i = 0; i < 8; i++) {

			var col1 = document.createElement("td");
			if (i === 2) {
				col1.className = "cLink";
				col1.val = this.data[o][i];
				col1.addEventListener("click", function (e) {
					openPopup(e.target.val);
				}.bind(this));
			}

			col1.innerText = this.data[o][i];
			if (i === 4) {
				var lose = (this.data[o][3] - this.data[o][5])<0 ? 0 : this.data[o][3] - this.data[o][5];
				col1.innerText = getFormattedAmount(lose, true);
			}
			
			
			if (i === 3 || i === 5) {
				col1.innerText = getFormattedAmount(this.data[o][i], true);
			}
			if (i == 1) {
				col1.innerHTML = this.data[o][i] + " <sup> TM</sup>";
			}
			tr.appendChild(col1);
		}

		tbodyLogs.appendChild(tr);
	}
}

function createPagination() {
	this.totalPages = Math.ceil(this.data.length / this.perPage);

	if (this.totalPages < 2) {
		pagination.style.display = "none";
		return;
	} else {
		for (var i = 0; i < this.totalPages; i++) {
			var btn = document.createElement("div");
			btn.innerHTML = i + 1;
			if (i == 0) {
				btn.classList.add('active');
			}
			if (i > 9) {
				btn.classList.add("hideItem");
			}
			btn.addEventListener('click', function (e) {
				this.curPage = e.target.innerHTML;
				this.updatePageIndex();
			}.bind(this));
			pagination.appendChild(btn);
		}
		var nextBtn = document.getElementById("nextBtn");
		pagination.appendChild(nextBtn);
	}
}
function updatePageIndex() {
	this.removeActiveClass();
	pagination.children[this.curPage].classList.add('active');
	// this.updatePageBtns();	
	pagination.children[this.curPage].classList.remove('hideItem');
	this.updatePageData(this.curPage);
}


function updatePageBtns() {
	for (var i = 1; i < pagination.children.length; i++) {
		if (this.curPage > 9) {
			if (i < this.curPage) {
				pagination.children[i].classList.add('hideItem');
			} else {
				pagination.children[i].classList.remove('hideItem');
			}
		}
		// if(i <= this.curPage-5 && i <= this.curPage+5){
		// pagination.children[i].classList.add('hideItem');
		// }else {
		// pagination.children[i].classList.remove('hideItem');
		// }

	}
}
function removeActiveClass() {
	for (var i = 0; i < pagination.children.length; i++) {
		pagination.children[i].classList.remove('active');
	}
}

function nextPage() {
	if (this.curPage > this.totalPages - 1) return;
	this.curPage++;
	this.updatePageIndex();
	if (this.curPage > 10) {
		pagination.children[this.curPage - 10].classList.add('hideItem');
	}
}

function previousPage() {
	if (this.curPage < 2) return;
	this.curPage--;
	this.updatePageIndex();
	if (this.curPage < 10) {
		pagination.children[this.curPage + 10].classList.add('hideItem');
	}
}


function openPopup(roundId) {
	window.location.href = "../logs/round.html?gameRoundId=" + roundId + "&gameType=slots&language=" + lang + "&accountId=" + accountId;
	//    window.open("round.html?gameRoundId="+roundId+"&gameType=slots&language="+lang + "&accountId=" + accountId);
	//    window.open("round.html?gameRoundId="+roundId+"&gameType=slots&language="+lang + "&accountId=" + accountId, 'targetWindow', "toolbar = no, location = no, status = no, menubar = no, scrollbars = yes, resizable = yes, width = 920, height = 720");
}


window.onload = function () {
	document.addEventListener('contextmenu', event => event.preventDefault());
	// lang = lang.length > 2 ? lang.slice(-2): lang;
	loadJSON("assets/lang/" + lang + ".json", function (data) {
		_lang = data;
		if (accountId) {
			postRequest(serverUrl, "account_id=" + accountId + "&env=core&network=dg", updateData);
		}
	});
}
