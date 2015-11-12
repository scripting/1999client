var version = 0.40, productName = "1999client";
var urlMySocket = "ws://node.1999.io:5389/";
var urlHttpServer = "http://node.1999.io:1999/";
var nameChatLog = "braintrust";
var ctSecondsTimeout = 75;
var myChatlogCopy = new Array ();
var pendingPolls = new Object ();
var whenLastCallInitiated;

function secondsSince (when) { 
	var now = new Date ();
	when = new Date (when);
	return ((now - when) / 1000);
	}
function stringLower (s) {
	if (s === undefined) { //1/26/15 by DW
		return ("");
		}
	s = s.toString (); //1/26/15 by DW
	return (s.toLowerCase ());
	}
function beginsWith (s, possibleBeginning, flUnicase) { 
	if (s === undefined) { //7/15/15 by DW
		return (false);
		}
	if (s.length == 0) { //1/1/14 by DW
		return (false);
		}
	if (flUnicase === undefined) {
		flUnicase = true;
		}
	if (flUnicase) {
		for (var i = 0; i < possibleBeginning.length; i++) {
			if (stringLower (s [i]) != stringLower (possibleBeginning [i])) {
				return (false);
				}
			}
		}
	else {
		for (var i = 0; i < possibleBeginning.length; i++) {
			if (s [i] != possibleBeginning [i]) {
				return (false);
				}
			}
		}
	return (true);
	}
function stringDelete (s, ix, ct) {
	var start = ix - 1;
	var end = (ix + ct) - 1;
	var s1 = s.substr (0, start);
	var s2 = s.substr (end);
	return (s1 + s2);
	}
function stringNthField (s, chdelim, n) {
	var splits = s.split (chdelim);
	if (splits.length >= n) {
		return splits [n-1];
		}
	return ("");
	}
function readHttpFile (url, callback, timeoutInMilliseconds, headers) { 
	if (timeoutInMilliseconds === undefined) {
		timeoutInMilliseconds = 30000;
		}
	var jxhr = $.ajax ({ 
		url: url,
		dataType: "text", 
		headers: headers,
		timeout: timeoutInMilliseconds 
		}) 
	.success (function (data, status) { 
		callback (data);
		}) 
	.error (function (status) { 
		console.log ("readHttpFile: url == " + url + ", error == " + jsonStringify (status));
		callback (undefined);
		});
	}
function callSocket (s, callback) {
	var mySocket = new WebSocket (urlMySocket); 
	mySocket.onopen = function (evt) {
		mySocket.send (s);
		};
	mySocket.onmessage = function (evt) {
		callback (evt.data);
		mySocket.close ();
		};
	}
function getChatLog (nameChatLog, callback) { 
	var apiUrl = urlHttpServer + "chatlog?chatLog=" + encodeURIComponent (nameChatLog), whenstart = new Date ();
	readHttpFile (apiUrl, function (data) {
		var jstruct = JSON.parse (data);
		console.log ("getChatLog: length == " + jstruct.chatLog.length);
		console.log ("getChatLog: metadata == " + JSON.stringify (jstruct.metadata, undefined, 4));
		callback (jstruct.chatLog, jstruct.metadata); //new metadata parameter -- 10/23/15 by DW
		});
	}
function watchForChange (urlToWatch, callback) {
	var now = new Date ();
	function receivedChatItem (item) {
		for (var i = 0; i < myChatlogCopy.length; i++) { //check for updates to items we already have
			if (myChatlogCopy [i].id == item.id) {
				myChatlogCopy [i] = item;
				return;
				}
			}
		myChatlogCopy [myChatlogCopy.length] = item; //it's a new item
		}
	for (var x in pendingPolls) {
		if (pendingPolls [x] < now) {
			console.log ("Expiring the pending poll for " + x);
			delete pendingPolls [x]; 
			}
		}
	if (pendingPolls [urlToWatch] === undefined) {
		pendingPolls [urlToWatch] = new Date (Number (now) + (ctSecondsTimeout * 1000));
		console.log ("watchForChange: urlToWatch == " + urlToWatch);
		whenLastCallInitiated = now;
		try {
			callSocket (urlToWatch, function (s) {
				console.log ("The server returned " + s);
				if (s !== undefined) { //no error
					var updatekey = "update\r";
					console.log ("watchForChange: " + stringNthField (s, "\r", 1) + " after " + secondsSince (now) + " secs.");
					if (beginsWith (s, updatekey)) { //it's an update -- 12/18/14 by DW
						s = stringDelete (s, 1, updatekey.length);
						receivedChatItem (JSON.parse (s));
						}
					}
				$("#idWebSocketResult").text (s);
				$("#spSecsLastCall").text (secondsSince (now));
				$("#idResultsFromCall").css ("display", "block");
				delete pendingPolls [urlToWatch];
				});
			}
		catch (err) {
			console.log ("watchForChange: error calling the socket.");
			delete pendingPolls [urlToWatch]; //so we'll try again
			}
		}
	}
function everyMinute () {
	var now = new Date ();
	console.log ("\neveryMinute: " + now.toLocaleTimeString ());
	}
function everySecond () {
	watchForChange ("chatlog:" + nameChatLog);
	$("#idItemsInChatLog").text (myChatlogCopy.length);
	$("#idWhenCallInitiated").text (stringNthField (secondsSince (whenLastCallInitiated).toString (), ".", 1));
	}
function startup () {
	console.log ("startup");
	getChatLog (nameChatLog, function (myChatLog, myMetadata) {
		myChatlogCopy = myChatLog;
		self.setInterval (everySecond, 1000); 
		self.setInterval (everyMinute, 60000); 
		});
	}
