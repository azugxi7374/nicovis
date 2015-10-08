// container : pieを入れるdiv要素
// size : w, h
// cmts : Comments
// acs : acs, min, max
var Pie = function(container, size, cmts, acs){
	var margin = {top: 10, right: 10, bottom: 10, left: 10};
	// acs = defval(acs, Comments.pie.params.size);

	this.draw = function(){
		var wd = size.w - margin.left - margin.right,
			ht = size.h - margin.top - margin.bottom,
			radius = Math.min(wd, ht)/2 - 5;

		var cx = wd/2 + margin.left,
			cy = ht/2 + margin.top;

		var arc = d3.svg.arc()
			.innerRadius(radius - 40)
			.outerRadius(radius);

		var pData = cmts.pieLayout(acs, function(p){
			return p.sort(Comments.pie.sort)//.padAngle(.02)
		});
		console.log(pData);

		var palette = Constant.piePalette;

		// set dom
		container.html("");
		var svg = container.append("svg").attr("width", size.w).attr("height", size.h)
		var back = svg.append("rect").call(
			Drawing.rectAttr(0,0, size.w, size.h, [{"fill": "#a0a0a0"}])
		);
		var g = svg.append("g").call(Drawing.addTranslate(cx, cy));
		var title = g.append("text")

		var data_g = g.selectAll("g").data(pData).enter().append("g")

		var tip = Drawing.createTip(svg, g, "tip");
		//var over = g.append("rect").style("opacity", 0);

		var paths = data_g.append("path").attr("d", arc).style("fill", function(d, i) { return palette(d.data.color); })

		var labels = data_g.append("text")
			.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) {return d.data.disp; })
			.call(Drawing.setOpacity(function(d){return d.data.rate < 0.1 ? 0 : 1}));

		var over = g.append("g").selectAll("path").data(pData).enter().append("path").attr("d", arc).style("opacity", 0)
		.on("mousemove", function(d){
			//console.log("move");
			tip.show(true);
			tip.set([d.data.disp, numeral(d.data.rate).format("0.0%")].join("/"))
		}).on("mouseon", function(d){
			//console.log("on");
			tip.show(true);
			tip.set(d.data.disp)
		}).on("mouseout", function(d){
			//console.log("out");
			tip.show(false);
		});
		title.call(Drawing.addTranslate(0,0))
			.attr("dy", ".35em").style("text-anchor", "middle").text(acs.name);

	};
}
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
