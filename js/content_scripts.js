//var svgClass = "svg-nicovis";
var containerID = "container-nicovis-1"
function getContainer(){ return d3.select("#"+containerID)};
function getPlayerContainerWrapper(){ return d3.select("#playerContainerWrapper")};
function getSVG(){ return getContainer().select("svg");}
var reset = init;

function init(){
	// container
	console.log("init!");
	var container = getContainer();
	if(container.empty()){
		container = getPlayerContainerWrapper().append("div").attr("id", containerID);
	}

	// button, svg
	clear();
	container.append("button").html("reset").on("click", reset);
	container.append("svg");

  // nicoPlayer, graph
	NicoPlayer.get().then(function(np){
		new Graph( // svg, w0, h0, cmts, len, play, setTime, getTime
			getSVG(),
			0, 0,
			np.getComments(),
			np.length,
			function(){ np.play(true)},
			function(ms){	np.setTime(~~ms)},
			function(){ return np.getTime()}
		).draw();

		disableAds();
		chrome.runtime.sendMessage({message:"complete"});
	});
}

function clear(){
	console.log("clear!")
	getContainer().html("");
}


// 広告
function disableAds(){
	_.each([/*"#playerTabContainer .playerTabAds", */"#playerTabContainer .nicoSpotAds"], function(a){
		d3.select(a).style("display", "none");
	});
}


/////////////////////////////////////////////////////////////////
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log("request : " , request, request.message, request.valid, sender);

	if(_.contains(["onCommitted", "onCompleted", "onHistoryStateUpdated"], request.message)){
		if(request.valid){
			init();
		}else{
			clear();
		}
	}
	/*
	// onCompleted
	if(request.message === "onCompleted"){
		reset();
	}
	if(request.message === "onBeforeNavigate"){
		console.log(request.valid);
		if(request.valid){
			reset();
		}else{
			clear();
		}
	}
	// Page Button
	if(request.pageButtonClicked){
		console.log("pageButtonClicked!")
		NicoPlayer.get().then(function(np){
			console.log(JSON.stringify(np.getComments()));
		});
		//sendResponse("ok");
	};*/

});


























//