var nicoBaseURL = 'www.nicovideo.jp/watch/'

chrome.webNavigation.onCommitted.addListener(function(e){
		chrome.pageAction.show(e.tabId)
		var idx = e.url.indexOf(nicoBaseURL)
		var videoID = e.url.substring(idx + nicoBaseURL.length)
		test(videoID)
	}, {url: [{urlContains: nicoBaseURL}]}
);

function test(vid){
	var nico = new Nico();
	nico.getComments(vid, 100).then(function(data){
		console.log(data)
		$(data).find("chat").each(function(){
			console.log("vpos = " + $(this).attr("vpos"))
		});
	});
}

// Model Nico
var Nico = function(){
	// const...
	this.msgVersion = '20090904'
	//this.defautMsgResNum = 1000
}

Nico.prototype.flapiURL = function(vid){ // (sm9)
	return "http://flapi.nicovideo.jp/api/getflv/"+vid;
}

Nico.prototype.msgURL = function(msgServURL, threadID, msgResNum){ // 
	var url = msgServURL+"thread?"+
		"version="+this.msgVersion +
		"&thread="+threadID+
		"&res_from=-" + msgResNum;
	console.log(url)
	return url;
}
	
// flapiから動画情報取得. 
// return : Promise { thread_id, ms, ... }
Nico.prototype.getVideoInfo = function(vid){
	return $.get(this.flapiURL(vid)).then(function(data){
		var obj = {};
		_.each(data.split("&"), function(args){
				var kv = args.split("=")
				obj[unescape(kv[0])]=unescape(kv[1])
		});
		return obj;
	});
}
	

// 動画情報(videoInfo)からコメント取得
Nico.prototype.getCommentsFromVideoInfo = function(info, num){
	return $.get(this.msgURL(info.ms, info.thread_id, num));
};

// getComments(最新num件表示)
Nico.prototype.getComments = function(vid, num){
	var self = this
	return this.getVideoInfo(vid).then(function(info){
		return self.getCommentsFromVideoInfo(info, num);
	});
}


