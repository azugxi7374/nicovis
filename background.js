var nicoBaseURL = 'www.nicovideo.jp/watch/'

chrome.webNavigation.onCommitted.addListener(function(e){
		chrome.pageAction.show(e.tabId)
		var idx = e.url.indexOf(nicoBaseURL)
		var videoID = e.url.substring(idx + nicoBaseURL.length)
		test(videoID)
	}, {url: [{urlContains: nicoBaseURL}]}
);

function test(vid){
	
	//nico.getComments(vid, 100).then(function(data){
	//	console.log(data)
	//	$(data).find("chat").each(function(){
	//		console.log("vpos = " + $(this).attr("vpos"))
	//	});
	//});
};


