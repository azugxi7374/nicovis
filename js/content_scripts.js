//var svgClass = "svg-nicovis";
var containerID = "container-nicovis-1"
function getContainer(){ return d3.select("#"+containerID)};
function getPlayerContainerWrapper(){ return d3.select("#playerContainerWrapper")};
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
	//container.append("svg");

  // nicoPlayer, graph
	NicoPlayer.get().then(function(np){
		var cmts = new Comments(np.getComments(), np.length);

		new Histogram(
			getContainer().append("div"),
			{w:800, h:100},
			cmts,
			undefined,
			undefined,
			np.length,
			{
				getTime: np.getTime,
				setTime: function(ms){np.setTime(~~ms)},
				play: function(){np.play(true)},
			},
			function(f){d3.timer(f, 500)}
		).draw();

		_.each(Comments.params.pie, function(acs){
			new Pie(
				getContainer().append("span"),
				{w: 200, h: 200},
				cmts,
				acs
			).draw();
		});

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
	// Page Button
	if(request.pageButtonClicked){
		console.log("pageButtonClicked!")
		NicoPlayer.get().then(function(np){
			console.log(JSON.stringify(np.getComments()));
		});
		//sendResponse("ok");
	};
	*/

});


























//