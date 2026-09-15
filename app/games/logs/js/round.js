var serverIP = "https://dev-games.progaindia.com"; //https://dg-dev.dragongaming.com
var serverUrl = serverIP + "/server_logs/game_round_data.php"
var roundId = getParameterByName("gameRoundId");
var matrixHead = document.getElementById("matrixHead");
var accountId = getParameterByName("accountId");
var gameType = "slotgames"
function updateData(data) {
	var gameName = data.game_name;

	// updating table data
	var keywords = document.getElementById("keywords");
	keywords.style.display = "table";

	matrixHead.innerHTML = _lang[matrixHead.innerHTML];
	matrixHead.style.display = "block";

	var tableTitle = document.getElementById("tableTitle");
	var len = tableTitle.children.length;
	for (let i = 0; i < len; i++) {
		console.log(tableTitle.children[i].innerHTML);
		var content = tableTitle.children[i].innerHTML;
		content = content.replace("_", " ");
		tableTitle.children[i].innerHTML = _lang[tableTitle.children[i].innerHTML] || content;;
	}

	var dataCtn = document.getElementById("tbodyLogs");

	while (dataCtn.hasChildNodes()) {
		dataCtn.removeChild(dataCtn.firstChild);
	}

	var arr = [data.title, data.round_id, data.num_betlines, data.coin_value, data.num_coins,
	data.pre_balance, 
	data.amount_bet, data.amount_won,
	data.post_balance, data.num_win_lines, 
	data.currency, data.timestamp];

	var oth = document.getElementById("optional");
	oth.style.display = "none";

	if (data.bonus) {
		oth.style.display = "table-cell";
		arr.splice(arr.length - 1, 0, data.bonus);
	}
	var tr = document.createElement("tr");
	for (let o = 0; o < arr.length; o++) {
		var col1 = document.createElement("td");
		col1.innerHTML = arr[o];

		if (o == 0) {
			col1.innerHTML = arr[o] + " <sup> TM</sup>";
		}

		if (o === 5 || o === 6 || o === 7 || o === 8 || (data.bonus && o === 11)) {
			setCurrency(data.currency);
			col1.innerText = getFormattedAmount(arr[o], true);
		}

		if (gameName == "basketballlegends" && (o == 2 || o == 9)) {
			col1.innerText = "NA";
		}

		tr.appendChild(col1);
	}
	dataCtn.appendChild(tr);


	var matrixArr = [];

	if (data.matrix2.length > 5) {
		matrixArr = data.matrix2.split(";");
	} else if (data.matrix.length > 5) {
		matrixArr = data.matrix.split(";");
	} else {
		matrixArr = [];
	}

	var iLen = matrixArr.length;
	var formatArr = [];
	if (!data.format) {
		var mLen = matrixArr[0].length;
		var str = "";
		for (let i = 0; i < mLen; i++) {
			str += "1";
		}
		data.format = "";
		for (let i = 0; i < mLen; i++) {
			data.format += str + ";";
		}
	}
	formatArr = data.format.split(";");


	var matrixView = document.getElementById("matrixView");
	while (matrixView.hasChildNodes()) {
		matrixView.removeChild(matrixView.firstChild);
	}

	var nLetter = [];
	var fLetter = [];
	for (let i = 0; i < iLen; i++) {
		var mLetter = matrixArr[i].split("");
		if (formatArr.length > 0)
			var mFormat = formatArr[i].split("");

		var oLen = mLetter.length;
		for (let o = 0; o < oLen; o++) {
			if (!nLetter[o]) nLetter[o] = [];
			nLetter[o].push(mLetter[o]);

			if (mFormat) {
				if (!fLetter[o]) fLetter[o] = [];
				fLetter[o].push(mFormat[o]);
			}
		}
	}

	matrixHead.style.width = (114 * mFormat.length) + "px";
	matrixView.style.width = (114 * mFormat.length) + "px";
	var iLen = mLetter.length;
	for (let i = 0; i < iLen; i++) {
		var ul = document.createElement("ul");
		var oLen = mLetter.length;

		for (let o = 0; o < oLen; o++) {
			if (fLetter[i][o] === "1") {
				var li = document.createElement("li");
				li.innerHTML = '<img src="assets/images/' + gameType + '/' + gameName + "/" + nLetter[i][o] + '.png" alt="symbol" class="sym">';
				ul.appendChild(li);
			}
		}

		if (ul.children.length === 3 && fLetter[i].length === 4) {
			ul.style.marginTop = "50px";
		} else if (ul.children.length === 3 && ul.children.length != fLetter[i].length) {
			ul.style.marginTop = "100px";
		} else if (ul.children.length === 4 && ul.children.length != fLetter[i].length) {
			ul.style.marginTop = "50px";
		} else {
			ul.style.marginTop = "0px";
		}
		matrixView.appendChild(ul);
	}

	var gambleView = document.getElementById("gamble");
	if (data.gamble) {
		gambleView.style.display = "flow-root";

		var dataCtn = document.getElementById("gamble-tbodyLogs");

		while (dataCtn.hasChildNodes()) {
			dataCtn.removeChild(dataCtn.firstChild);
		}

		var len = data.gamble.length;
		for (let i = 0; i < len; i++) {
			var tr = document.createElement("tr");
			var gLen = data.gamble[i].length;
			for (let g = 0; g < gLen; g++) {
				var col1 = document.createElement("td");
				col1.innerHTML = data.gamble[i][g];
				if (g < 2) {
					col1.innerHTML = data.gamble[i][g].toFixed(2);
				}
				// console.log("data.gamble[i][g] = ", data.gamble[i][g]);
				tr.appendChild(col1);
			}
			dataCtn.appendChild(tr);
		}
	}

}
function goToLogs() {
	window.location.href = "../logs/?account_id=" + accountId + "&language=" + lang;
}
window.onload = function () {
	document.addEventListener('contextmenu', event => event.preventDefault());
	loadJSON("assets/lang/" + lang + ".json", function (data) {
		_lang = data;

		if (roundId) {
			postRequest(serverUrl, "gameRoundId=" + roundId + "&gameType=slots" + "&env=core&network=dg", updateData);
		}
	});

}



// window.onresize = function(){
    // var backButton =  document.getElementById("backButton");
	// if(backButton)
    // backButton.style.top = (window.innerHeight - 100) + "px";
// }