var nicoBaseURL = 'www.nicovideo.jp/watch/'

chrome.webNavigation.onCommitted.addListener(function(e){
		console.log("ok")
		chrome.pageAction.show(e.tabId)
		var idx = e.url.indexOf(nicoBaseURL)
		var videoId = e.url.substring(idx + nicoBaseURL.length)
		vis(videoId)
	}, {url: [{urlContains: nicoBaseURL}]}
);

function vis(vid){
	console.log(vid)
	var nico = new Nico();
	console.log(nico.getComments(vid, 1000));
}

//function manageCookie(){
//        chrome.cookies.get({"url":"http://nicovideo.jp", "name": "user_session"}, function(c){
//                console.log("cookie!! : "+c.name+ "," + c.value )
//        })
//}

//manageCookie()

// Model Nico
var Nico = function(){
	// const...
	this.msgVersion = '20090904'
	this.defautMsgResNum = 1000
}

Nico.prototype.flapiURL = function(vid){ // (sm9)
	return "http://flapi.nicovideo.jp/api/getflv/"+vid;
}

Nico.prototype.msgURL = function(msgServURL, threadID, msgResNum){ // 
	return msgServURL+"thread?"+
		"version="+this.msgVersion +
		"&thread="+threadID+
		"&res_from=-" + msgResNum;
}
	
// flapiから動画情報取得. 
// return : Promise { thread_id, ms, ... }
Nico.prototype.getVideoInfo = function(vid){
	return $.get(this.flapiURL(vid)).then(function(data){
		console.log(data)
		var obj = {};
		_.each(data.split("&"), function(args){
				var kv = args.split("=")
				obj[kv[0]]=kv[1]
		});
		console.log("obj = "+ obj)
		return obj;
	});
}
	

// 動画情報(videoInfo)からコメント取得
Nico.prototype.getCommentsFromVideoInfo = function(info, num){
	console.log(info.thread_id)
	console.log(info.ms)
	console.log(this.msgURL(info.ms, info.thread_id, num))
	return $.get(this.msgURL(info.ms, info.thread_id, num));
};

// getComments(最新N件表示)
Nico.prototype.getComments = function(vid, num){
	var self = this
	return this.getVideoInfo(vid).then(function(info){
		console.log(info.thread_id)
		console.log(info.ms)
		return self.getCommentsFromVideoInfo(info, num)
	});
}


