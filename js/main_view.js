var MainView = function(par_node, getComments, getPlayer){

	var par = d3.select(par_node);
	var cmts, player;
	var graphs;

	reset();

	function reset(){
		cmts = getComments();
		player = getPlayer();

		par.html("");
		par.append("button").html("reset").on("click", reset);

		new Histogram(
			par.append("div"),
			{w:800, h:200},
			cmts,
			undefined,
			undefined,
			cmts.videoLen,
			player,
			function(f){d3.timer(f, 500)}
		).draw();

		_.each(Comments.pie.params, function(acs){
			new Pie(
				par.append("span"),
				{w: 200, h: 200},
				cmts,
				acs
			).draw();
		});
	}
}
