var appPath = "";

function getUrlVar(requestedKey, url) {
	"use strict";
	var vars = [], hashes, hash, i;
	var path = url || window.location.href;
	var temp_hashes = path.slice(path.indexOf('?') + 1);


	temp_hashes = temp_hashes.replace("#", "");
	hashes = temp_hashes.split('&');
	for (i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	if (typeof requestedKey === ' undefined') {
		return vars;
	} else {
		return vars[requestedKey];
	}
}

function addCSS(path, callback) {
	var head = document.getElementsByTagName('head')[0];
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.type = 'text/css';
	link.href = path;
	link.media = 'all';
	head.appendChild(link);
}

function addScript(path, callback) {
	var el = document.createElement("script");
	document.getElementsByTagName("body")[0].appendChild(el);
	el.onload = function (data) { if (callback) callback(data); };
	el.src = path + '?ver=' + version;
	el.type = 'text/javascript';
}

var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
var isDesktop = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent));
var mainPath = document.getElementById("mainJS").src;
var version = "__version__";
var gameName = "sugarbox5000gold";
var lang = (getUrlVar('user_locale') || "en").split("-")[0].toLowerCase();
var integrator = getUrlVar("integrator") || "mock";
var operator = getUrlVar("operator") || "mock";
var sessionId = getUrlVar("session_id") || crypto.randomUUID();
var internal_session_id = crypto.randomUUID();
var userName = getUrlVar("user_id") || crypto.randomUUID();
var adaptor_currency = (getUrlVar('currency') || "xts").toLowerCase();

var siteCode = "SCNCSSC";
var env = "lcl";           //Using variable in CoreApp.js in loadLiteralFiles function
var _ng = _ng || {};
var desktopFullScreen = false;
if (siteCode === "test") {
	desktopFullScreen = true;
}

if (isDesktop) {
	desktopFullScreen = true;
}


var jsArr = [];
var jsCount = 0;

if (env === "lcl" || env === "local") {
	env = "lcl"
	appPath = "app/";
	jsArr.push("app/core/configs/CoreConfig.js");
	jsArr.push("app/core/app/CoreApp.js");
} else {
	appPath = "";
	var sMin = (env === "" || env === "stg") ? "-min" : "";
	jsArr.push(appPath + "core/vgLib" + sMin + ".js");
	jsArr.push(appPath + "core/vgCore" + sMin + ".js");
	jsArr.push(appPath + "core/vgSlot" + sMin + ".js");
	jsArr.push(appPath + "core/" + (isMobile ? "vgMobileAddons" : "vgDesktopAddons") + sMin + ".js");
	jsArr.push(appPath + "games/" + gameName + "/game" + sMin + ".js");
}

onJSLoad = function () {
	if (jsCount < jsArr.length - 1) {
		jsCount++;
		loadGameFile();
	} else {
		onLoadedGame();
	}
}

function generate18DigitNumber(input) {
	const hash = CryptoJS.MD5(input).toString();
	let intValue = BigInt("0x" + hash);
	return intValue.toString().slice(-18); // Ensure it stays within 18 digits
}
loadGameFile = function () {
	// Check if in history mode (round_id exists in URL)
	var roundId = getUrlVar("round_id");
	var isHistoryMode = !!roundId;

	// If in history mode, don't save credentials in session
	// If session is empty, then save credentials (same as normal behavior)
	if (!isHistoryMode) {
		if (sessionId === "") {
			sessionStorage.userID = 43;
			sessionStorage.userName = "pg2";
			sessionStorage.passWord = "pg2";
		} else {
			sessionStorage.userID = userName;
			var newCreds = generate18DigitNumber(userName);

			sessionStorage.userName = newCreds;
			sessionStorage.passWord = newCreds;
		}
	}

	sessionStorage.setItem("adaptor_currency", adaptor_currency);
	sessionStorage.setItem("integrator", integrator);
	sessionStorage.setItem("gameName", gameName);
	sessionStorage.setItem("operator", operator);
	sessionStorage.setItem("sessionId", sessionId);
	sessionStorage.setItem("internal_session_id", internal_session_id);
	sessionStorage.setItem("Language", lang);
	sessionStorage.setItem("siteCode", "SCNCSSC");
	sessionStorage.setItem("isLoged", "true");

	addScript(jsArr[jsCount], onJSLoad);
	// addCSS(appPath + "games/" + gameName + "/dist/gameStyle.css");
}
//loadGameFile();

var closeBtn = document.getElementById("closeBtn");
closeBtn.src = appPath + "games/rules/en/images/" + gameName + "/closeBtn.png";

// -----------------------
function onLoadedGame() {
	"use strict";

	if (env === "lcl") {
		coreApp = new _ng.CoreApp(gameName);
	} else {
		_ng.CoreApp.prototype.loadJSFiles = function (loadingIndex) { }
		coreApp = new _ng.CoreApp(gameName);
		coreApp.mergeConfig();
		coreApp.initializeGame();
	}

	if (desktopFullScreen == false || desktopFullScreen == "false") {
		var elm = document.getElementById("containerbg");
		elm.src = appPath + "games/" + gameName + "/dist/containerbg.jpg";
		elm.width = "100%";
		elm.height = "100%";
	}
}

function onGameRulesToggle(bool) {
	if (!bool && isMobile) {
		_mediator.publish(_events.core.onResize);
	}
	_sndLib.play(_sndLib.sprite.btnClick);
	var gameRulesElement = document.getElementById("gameRules");
	gameRulesElement.style.display = bool ? "block" : "none";
}

// function onGamePaytableToggle(bool) {
// 	if (!bool && isMobile) {
// 		_mediator.publish(_events.core.onResize);
// 	}
// 	_sndLib.play(_sndLib.sprite.btnClick);
// 	var gamePaytableElement = document.getElementById("gamePaytable");
// 	gamePaytableElement.style.display = bool ? "block" : "none";
// }

function setupFullscreenMode() {

	if (desktopFullScreen == true || desktopFullScreen == "true") {

		let renderer = pixiLib.getRenderer();
		let newWidth, newHeight;

		renderer.view.style.width = "100%";
		renderer.view.style.height = "100%";

		// Get the game resolution (or max size) 
		const maxWidth = _ng.GameConfig.gameLayout["VD"].width;
		const maxHeight = _ng.GameConfig.gameLayout["VD"].height;

		// Get window dimensions 
		const wWidth = window.innerWidth;
		const wHeight = window.innerHeight;

		// Maintain aspect ratio 
		const aspectRatio = maxWidth / maxHeight;

		if (wWidth / wHeight > aspectRatio) {
			// Window is wider, scale based on height 
			newHeight = wHeight;
			newWidth = newHeight * aspectRatio;
		} else {
			// Window is taller, scale based on width 
			newWidth = wWidth;
			newHeight = newWidth / aspectRatio;
		}
		document.getElementById("canvasContainer").style.width = `${newWidth}px`;
		document.getElementById("canvasContainer").style.height = `${newHeight}px`;
	}
}

function stopAutospins() {
	_mediator.publish("cancelAutoSpin");
}

// --------------------------------------
document.addEventListener('gesturestart', function (e) {
	e.preventDefault();
});

var doubleTouchStartTimestamp = 0;
document.addEventListener("touchstart", function (event) {
	var now = +(new Date());
	if (doubleTouchStartTimestamp + 500 > now) {
		event.preventDefault();
	}
	doubleTouchStartTimestamp = now;
});
