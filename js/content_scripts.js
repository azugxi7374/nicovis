//var svgClass = "svg-nicovis";
var containerID = "container-nicovis-1"
var containerClass = "container-nicovis"
function getContainer(){ return d3.select("#"+containerID)};
function getPlayerContainerWrapper(){ return d3.select("#playerContainerWrapper")};

function init(){
	// container
	console.log("init!");

	var container = getContainer();
	if(container.empty()){
		var w = getPlayerContainerWrapper().append("div");
		var button = w.append("button")
		container = w.append("div").attr("id", containerID).attr("class", containerClass);

		w.foldFlg = 0;
		function fold(flg){
			container.style("display", [null, "none"][flg] );
			var pm = ["-","+"][flg];
			button.text("Nico-Vis "+["▲","▼"][flg]);
		}
		fold(w.foldFlg);
		button.on("click", function(){
			w.foldFlg = 1 - w.foldFlg;
			fold(w.foldFlg);
		});
	}

	// button, svg
	container.html("");

  // nicoPlayer, graph
	NicoPlayer.get().then(function(np){

		new MainView(container.node(),
			function(){return new Comments(np.getComments(), np.length)},
			function(){return {
					getTime: np.getTime,
					setTime: function(ms){np.setTime(~~ms)},
					play: function(){np.play(true)},
				};
			}
		);

		disableAds();
		chrome.runtime.sendMessage({message:"complete"});
	});
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
