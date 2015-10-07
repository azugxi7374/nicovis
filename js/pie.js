// container : pieを入れるdiv要素
// size : w, h
// cmts : Comments
// acs : acs, min, max
var Pie = function(container, size, cmts, acs){
	var margin = {top: 10, right: 10, bottom: 10, left: 10};
	acs = defval(acs, Comments.params.pie.size);

	this.draw = function(){
		var wd = size.w - margin.left - margin.right,
			ht = size.h - margin.top - margin.bottom,
			radius = Math.min(wd, ht)/2 - 5;

		var cx = wd/2 + margin.left,
			cy = ht/2 + margin.top;

		var arc = d3.svg.arc()
			.innerRadius(radius - 40)
			.outerRadius(radius);

		var pData = cmts.pieLayout(acs);

		var color = d3.scale.category20();

		container.html("");
		// container.append("button").html("button1").on("click", function(){console.log('button1_clicked')});

		var svgg = container.append("svg").attr("width", size.w).attr("height", size.h)
			.append("g").call(Drawing.addTranslate(cx, cy));
		var g = svgg.selectAll("g").data(pData).enter().append("g")

		g.append("path").style("fill", function(d, i) { return color(i); }).attr("d", arc);

		// label
		g.append("text")
			.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(function(d) { return d.data.name; });

		svgg.append("text")
			.attr("transform", function(d) { return "translate(0,0)"; })
			.attr("dy", ".35em")
			.style("text-anchor", "middle")
			.text(acs.name);
	};
}