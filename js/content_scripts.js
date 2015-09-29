var svgClass = "svg-nicovis"
var wrapperElem = d3.select("#playerContainerWrapper")

// reset button & svg
wrapperElem.append("button").html("reset").on("click", reset);
var svg = wrapperElem.append("svg").attr("class", svgClass);

reset();

// 読み込み & 書き直し
function reset(){
	console.log("reset!")
	NicoPlayer.get().then(function(np){
    svg.html("");
    new Graph( // svg, w0, h0, cmts, len, play, setTime, getTime
    	svg,
    	0, 0,
    	np.getComments(),
    	np.length,
    	function(){ np.play(true)},
    	function(ms){	np.setTime(~~ms)},
    	function(){ return np.getTime()}
    ).draw();

		disableAds();
	});
}

// 広告
function disableAds(){
	_.each([/*"#playerTabContainer .playerTabAds", */"#playerTabContainer .nicoSpotAds"], function(a){
		d3.select(a).style("display", "none");
	});
}


// Page Button clicked...
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.pageButtonClicked){
		console.log("pageButtonClicked!")
		NicoPlayer.get().then(function(np){
			console.log(JSON.stringify(np.getComments()));
		});
		sendResponse("ok");
	};
});


























//