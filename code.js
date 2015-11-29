var myVersion = 0.44, myProductName = "1999client";
var urlMySocket = "ws://node.1999.io:5389/";
var urlHttpServer = "http://node.1999.io:1999/";
var nameChatLog = "scripting";
var ctMessagesFromServer = 0;
var whenStartup = new Date ();
var whenLastMessageReceived = whenStartup;
var myChatlogCopy = new Array ();
var mySocket = undefined;

function secondsSince (when) { 
	var now = new Date ();
	when = new Date (when);
	return ((now - when) / 1000);
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
function stringLower (s) {
	if (s === undefined) { //1/26/15 by DW
		return ("");
		}
	s = s.toString (); //1/26/15 by DW
	return (s.toLowerCase ());
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
function getChatLog (nameChatLog, callback) { 
	var apiUrl = urlHttpServer + "chatlog?chatLog=" + encodeURIComponent (nameChatLog), whenstart = new Date ();
	readHttpFile (apiUrl, function (data) {
		var jstruct = JSON.parse (data);
		console.log ("getChatLog: length == " + jstruct.chatLog.length);
		console.log ("getChatLog: metadata == " + JSON.stringify (jstruct.metadata, undefined, 4));
		callback (jstruct.chatLog, jstruct.metadata); //new metadata parameter -- 10/23/15 by DW
		});
	}
function gotMessage (s) {
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
	console.log ("\ngotMessage");
	console.log (s);
	$("#idWebSocketResult").text (s);
	$("#idCtMessagesFromServer").text (++ctMessagesFromServer);
	$("#idSecsLastCall").text (secondsSince (whenLastMessageReceived));
	whenLastMessageReceived = now;
	if (s !== undefined) { //no error
		var updatekey = "update\r";
		if (beginsWith (s, updatekey)) { 
			s = stringDelete (s, 1, updatekey.length);
			receivedChatItem (JSON.parse (s));
			}
		$("#idWebSocketResult").text (s);
		}
	}
function startConnection (s) {
	mySocket = new WebSocket (urlMySocket); 
	mySocket.onopen = function (evt) {
		console.log ("mySocket is open.");
		console.log ("sending: " + s);
		mySocket.send (s);
		};
	mySocket.onmessage = function (evt) {
		gotMessage (evt.data);
		};
	mySocket.onclose = function (evt) {
		console.log ("mySocket was closed.");
		mySocket = undefined;
		};
	mySocket.onerror = function (evt) {
		console.log ("mySocket received an error");
		};
	}
function everyMinute () {
	var now = new Date ();
	console.log ("\neveryMinute: " + now.toLocaleTimeString ());
	}
function everySecond () {
	if (mySocket === undefined) { //try to open the connection
		startConnection ("watch chatlog:" + nameChatLog);
		}
	$("#idItemsInChatLog").text (myChatlogCopy.length);
	}
function startup () {
	console.log ("startup");
	$("#idVersionNumber").html ("v" + myVersion);
	$("#idNameChatLog").html (nameChatLog);
	getChatLog (nameChatLog, function (myChatLog, myMetadata) {
		myChatlogCopy = myChatLog;
		self.setInterval (everySecond, 1000); 
		self.setInterval (everyMinute, 60000); 
		});
	}
