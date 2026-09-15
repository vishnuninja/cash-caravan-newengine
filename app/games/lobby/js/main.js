var gameList = {
	slots: [
		{ name: "Wild West Legends", id: "wildwestlegends" },
		{ name: "Wild West Legends V2", id: "wildwestlegendsV2" },
		{ name: "Terracotta Warrior", id: "terracottawarrior" },
		{ name: "Mystical Forest Adventure", id: "mysticalforestadventure" },
		{ name: "sweetBonza", id: "sweetBonza" },
		{ name: "The Dragon Warriors", id: "thedragonwarriors" },
		{ name: "Queen Sakura", id: "queensakura" },
		{ name: "Magic Wings", id: "magicalwings" },
		{ name: "Ninja Gold", id: "ninjagold" },
		{ name: "Prosperous Bloom", id: "prosperousbloom" },
		{ name: "Raiden", id: "raiden" },
		{ name: "Wild Star Stacks", id: "wildstarstacks" },
		{ name: "Black Jack", id: "blackjack" }
	],
	roulette: [
		{ name: "Table game", id: "tablegame" }
		// { name: "European Roulette", id: "europeanroulette" },
		// { name: "American Roulette", id: "americanroulette" },
	],
	blackjack: [
		{ name: "Table game", id: "tablegame" }
		// { name: "Blackjack", id: "blackjack" }
	]
}

var langList = [
	{ value: "en", text: "English" },
];

var env = getUrlVar("env") || "stg";
var gameName = ""
var category = "";

function onPageLoad() {
		
	var langEl = document.getElementById("langSelect");
	var len = langList.length;
	for (var i = 0; i < len; i++) {
		langEl.options[i] = new Option(langList[i].text + " - " + langList[i].value, i)
	}

	addSlotGames();
	 //addTableGames();
	setLoginState();
}

function addSlotGames() {

	var parent = document.getElementById('slotGameList');
	var original = parent.children[0];
	parent.removeChild(original);

	for (let i = 0; i < gameList.slots.length; i++) {
		const game = gameList.slots[i];
		game.type = "slots";
		var clone = original.cloneNode(true);
		clone.children[0].children[0].src = "assets/images/slotgames/" + game.id + ".jpg";
		clone.children[0].children[1].addEventListener("click", function () { openGame(game.id, game.type); });
		parent.appendChild(clone);
	}
}
function showGames(evt, category) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
	if (category === "gameList") {
		document.getElementById("slotGameList").style.display = "flex";
		// document.getElementById("tableGameList").style.display = "flex";
	} else {
		document.getElementById(category).style.display = "flex";
	}
	evt.currentTarget.className += " active";
}

function openGame(gameName, category) {
	this.gameName = gameName;
	this.category = category;
	if (isLoged == "true") {
		launchGame();
	} else {
		this.showLoginPage();
	}
}

function launchGame() {
	
	if(this.gameName == 'tablegame'){
		window.location.href = "../tablegames/tablegamelauncher.html";
		return;
	}
	
	if (this.gameName === "") return;

	var langEl = document.getElementById("langSelect");
	var langCode = langList[langEl.selectedIndex].value;

	var gamePath = "";
	var type = "slots";
	var siteCode = "";

	if (this.category == "table_games") {
		type = (this.gameName == "blackjack") ? "blackjack" : "roulette";
	}

	switch (env) {
		case "lcl":
			gamePath = "/../../../games/" + type + "/gameLauncher.html";
			break;
		case "bld":
			gamePath = "/../../../build/" + type + "/gameLauncher.html";
			break;
		case "dev":
		case "stg":
		case "dmo":
			gamePath = "/../games/" + type + "/gameLauncher.html";
			break;
		default:
			// gamePath = "/game_launcher.php"
			gamePath = "../../../gameLauncher.html";
			break;
	}
	

	siteCode = "eg" + env + "es";
	gamePath += "?amount_type=1";
	// if (env == "" || env == "stg")
		gamePath += "&session_id=&channel=&reality_check=60";
	gamePath += "&full_site_code=" + siteCode + "&username=" + userName + "&category=" + category + "&language=" + langCode + "&game_name=" + this.gameName;
	if (env != "") gamePath += "&env=" + env;

	window.location.href = gamePath;
}