function getUrlVar(requestedKey, url) {
	"use strict";
	var vars = [],
		hashes, hash, i;
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

function sendPostRequest(url, obj, callback) {
	const xhttp = new XMLHttpRequest();
	xhttp.onload = function () {
		if (xhttp.readyState === 4) {
			if (String(xhttp.status) === "200") {
				data = JSON.parse(xhttp.responseText);
				callback(data);
			} else if (String(xhttp.status) === "404") {
				data = { error: xhttp.statusText }
				callback(data);
			}
		}
	};

	xhttp.onerror = function (e) {
		console.log({ type: "error", error_code: "001", msg: "error in server call on error " + e });
	};

	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhttp.send(obj);
}

var serverIP = "https://dev-games.progaindia.com";
var loginURL = serverIP + "/src/slots/login.php";
var logoutURL = serverIP + "/src/slots/logout.php";

var userName = sessionStorage.userName;
var passWord = sessionStorage.passWord;
var isLoged = sessionStorage.isLoged;
var modal, loginBtn, logoutBtn, msgEle;

function setLoginState() {

	modal = document.getElementById('id01');
	loginBtn = document.getElementById('signIn');
	logoutBtn = document.getElementById('signOut');
	msgEle = document.getElementById('msg');

	isLoged = sessionStorage.isLoged;
	loginBtn.style.display = (isLoged == "true") ? 'none' : 'block';
	logoutBtn.style.display = (isLoged == "true") ? 'block' : 'none';
}

function showLoginPage() {
	modal.style.display = 'block';
	document.getElementById('username').focus();
	msgEle.style.display = 'none';
	msgEle.innerText = '';
}

function showLogoutPage() {
	var r = confirm("Are you sure you want to log out?");
	if (r == true) {
		var obj = "useName=" + userName + "&passWD=" + passWord;
		sendPostRequest(logoutURL, obj, onLogoutResponse);
	}
}

function onLogoutResponse(data) {
	sessionStorage.userName = userName = "";
	sessionStorage.passWord = passWord = "";
	sessionStorage.isLoged = isLoged = "false";

	loginBtn.style.display = 'block';
	logoutBtn.style.display = 'none';
}

window.onclick = function (event) {
	if (event.target == modal) {
		onLoginCancel()
	}
};

function onLoginCancel() {
	modal.style.display = 'none'
}

function onKeyPress() {
	if (event.keyCode == 13 || event.which == 13) {
		onLogin();
	}
}

function onLogin() {
	userName = document.getElementById('username').value.toLowerCase();
	passWord = document.getElementById('password').value;
	isLoged = "false";
	var obj = "useName=" + userName + "&passWD=" + passWord;
	sendPostRequest(loginURL, obj, onLoginResponse);
}

function onLoginResponse(data) {
	if (data.status) {
		isLoged = "true";
		loginBtn.style.display = 'none';
		logoutBtn.style.display = 'block';
		modal.style.display = 'none';
		msgEle.style.display = 'none';
		msgEle.innerText = '';
		sessionStorage.userName = userName;
		sessionStorage.passWord = passWord;
		sessionStorage.isLoged = isLoged;
		launchGame(userName);
		return;
	} else if (data.error) {
		msgEle.innerText = data.error;
	} else {
		msgEle.innerText = 'Invalid username and password';
	}

	isLoged = "false";
	msgEle.style.display = 'block';
	loginBtn.style.display = 'block';
	logoutBtn.style.display = 'none';

}




