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

		setTimeout(function(){
			_.each(pData, function(o){
				o.padAngle = 0.5;
			});
		}, 1000);

		var palette = Constant.piePalette;

		// set dom
		container.html("");
		var svg = container.append("svg").attr("width", size.w).attr("height", size.h).attr("class", "pie").attr("id", _.uniqueId("svg_"));
		var g = svg.append("g").call(Drawing.addTranslate(cx, cy));
			var title = Drawing.createLabel(g, 0, 10, "title")

		var data_g = g.selectAll("g .data").data(pData).enter().append("g").attr("class", "data")

		var tip = Drawing.createTip(svg.node(), g.node());

		var paths = data_g.append("path").attr("d", arc).style("fill", function(d, i) { return palette(d.data.color); })

		var labels = Drawing.createLabel(data_g, 0, 2, "label").set(function(d) {return d.data.disp;}, 0, 0);
        labels.g.call(Drawing.addTranslate(function(d) { return arc.centroid(d)}))
				.call(Drawing.setOpacity(function(d){return d.data.rate < 0.03? 0: 1}));

		title.set(acs.name,0,0)
		.g.call(Drawing.addTranslate(0,0))

		var over = g.append("g").attr("class", "over").selectAll("path").data(pData).enter().append("path").attr("d", arc).style("opacity", 0)
		.on("mousemove", function(d){
			//console.log("move");
			tip.show(true)
				.set([d.data.disp, numeral(d.data.rate).format("0.0%"), d.data.count+"件"].join("/"))
		}).on("mouseon", function(d){
			//console.log("on");
			tip.show(true)
				.set(d.data.disp)
		}).on("mouseout", function(d){
			//console.log("out");
			tip.show(false);
		});

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
