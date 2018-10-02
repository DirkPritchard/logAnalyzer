/*
Title:logAnalyzer
Author: Dirk Pritchard
Version: 0.0.1
Date: 2018-10-01
License: ???
Purpose: Analyze MySQL and Apache logs.
*/

var logFile = null;
var logContents = null;
var reader = new FileReader;

jQuery(document).ready(function() {
	uploadEvent();
	analyzeEvent();
});

// utility functions ------------------------------------------------

function loopScan(sample, key, value){
	for(i = 0; i < sample.length; i++){
		if(sample[i].key == value){
			return i;
		}
	}
	return false;
}

function uploadEvent(){
	//set log file when the file input is set
	jQuery('#logUploader').on('change', function(){
		logFile = jQuery('#logUploader')[0].files;
	});
}

function analyzeEvent(){
	//begin initialization upon user request
	jQuery('#analyzeButton').on('click', function(){
		if (logFile != null){
			analyze();
		} else {
			alert('You must upload a log before analysis.');
		}
	});
}

function analyze(){
	//read the file as text
	reader.readAsText(logFile[0]);
	jQuery(reader).on('loadend', function(){
		//it's done loading, we can continue
		var type = jQuery('input[name="logType"]:checked').val();
		switch(type){
			case 'apacheAccessLog':
				analyzeApacheAcessLog(reader.result);
				break;
			default:
				alert('You must select a log type before analysis.');
				break;
		}
	});
}

// analysis functions ------------------------------------------------

function analyzeApacheAcessLog(log){
	/* capture group notes:
			0: entire line
			1: IP
			2: Client Identity
			3: Client userid
			4: Datetime
			5: HTTP Method/URL/HTTP protocol
			6: Status Code
			7: Size Requested
			8: Refferer
			9: Agent
	*/
	var accessReg = /\((.+?)\) (.+?) (.+?) \[(.+?)\] "(.+?)" ([0-9]+|-) ([0-9]+|-) "(.+?)" "(.+?)"/;
	var accessRegGlobal = /\((.+?)\) (.+?) (.+?) \[(.+?)\] "(.+?)" ([0-9]+|-) ([0-9]+|-) "(.+?)" "(.+?)"/g;
	var accessLines  = [];
	matchCount = log.match(accessRegGlobal).length;
	for(i = 0; i < matchCount; i++){
		accessLines.push(accessReg.exec(log));
		log = log.replace(accessReg, '');
	}
	//Assemble data by IP
	var IPInfo = [];
	for(i = 0; i < accessLines.length; i++){
		IPObject = loopScan(IPInfo, IP, accessLines[i][1]);
		if(IPObject){
			IPInfo[IPObject].IP = IPInfo[IPObject].IP++
		} else {
			IPInfo.push({IP: accessLines[1]})
		}
	}
}

function analyzeApacheErrorLog(log){
	
}

function analyzeMySQLLog(log){
	
}

function analyzeMySQLErrorLog(log){
	
}