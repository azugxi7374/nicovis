var nicoBaseURL = 'www.nicovideo.jp/watch/'

console.log("main.js!");
(function(){

    setTimeout(function(){

    var np = new NicoPlayer();
    // console.log(np.player.ext_getTotalTime());
    var cms = np.getComments(1000);
    console.log(cms);
    //console.log(mainThreadId);

    }, 5*1000);
})();

/*
chrome.webNavigation.onCommitted.addListener(function(e){
		chrome.pageAction.show(e.tabId)
		var idx = e.url.indexOf(nicoBaseURL)
		var videoID = e.url.substring(idx + nicoBaseURL.length)
		test(videoID)
	}, {url: [{urlContains: nicoBaseURL}]}
);
*/
function test(vid){
	
	//nico.getComments(vid, 100).then(function(data){
	//	console.log(data)
	//	$(data).find("chat").each(function(){
	//		console.log("vpos = " + $(this).attr("vpos"))
	//	});
	//});
};


