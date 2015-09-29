// どのタグだとどこに挿入されるかのテストとか
_.each(["#playerContainerWrapper", "#playerAlignmentArea","#playerContainer", "#playerNicoplayer",
"#nicoplayerContainer", "#nicoplayerContainerInner","#external_nicoplayer"
], function(name){
	d3.select("#content "+name).append("div").html(name+"!!")
});

// modal あとで使うかも
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