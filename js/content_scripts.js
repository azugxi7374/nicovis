// onLoad...
NicoPlayer.get().then(function(np){

	var comes = np.getComments();
	_.chain(comes).first(10).each(function(c){
		console.log(c.vpos + "," + c.message);
	});

	// TODO 広告
	if(true){
		_.each([/*"#playerTabContainer .playerTabAds", */"#playerTabContainer .nicoSpotAds"], function(a){
			d3.select(a).style("display", "none");
		});
	}
});

var svgModalId = "svg_modal";
var svgModal = documentHere(function(){/*
<div id="***" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="svgModalLabel" style="display: none;">
	<div class="modal-dialog" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
						aria-hidden="true">×</span></button>
				<h4 class="modal-title" id="svgModalLabel">ここにグラフを書く</h4>
			</div>
			<div class="modal-body">
				<svg></svg>
			</div>
		</div>
	</div>
</div>
*/
}).replace("***", svgModalId);

d3.select("body").append("div").html(svgModal);

// onClick...
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.pageButtonClicked){
		NicoPlayer.get().then(function(np){
			$("#"+svgModalId).modal();

			console.log(np.length);
			console.log("[",
			_.chain(np.getComments()).map(function(c){
				return "{vpos : "+ c.vpos + ", message : '" + c.message+"'}";
			}).value().join(","),
			"]");


			var graph = new Graph();
			graph.draw(
				d3.select("#" + svgModalId).select(".modal-body").select("svg"),
				np.getComments(),
				np.length,
				np.play)
		});

		sendResponse("ok");
	};
});


























//