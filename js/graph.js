// graph
var Graph = function(svg, w0, h0, _cmts, videoLen, play, setTime, getTime){

	var margin = {top: 10, right: 30, bottom: 30, left: 60};
	var bin = 120;
	var w0 = 800;
	var h0 = 100;
	var cmts = new Comments(_cmts, videoLen);

	var histParams = {
		yAcs : function(d){return d.length},
		cAcs : function(d){return d.density},
	}
	histParams = _.extend(histParams, {
		yMin : function(){return 0},
  	yMax : function(data){return d3.max(data, histParams.yAcs)},
		cMin : function(){return 0},
		cMax : function(data){return d3.max(data, histParams.cAcs)},
	});


	function funcs(container, tip){
		return {
			"mousemove" : function(d, instance){
				d3.select(instance).style({"opacity": 0.75})
				var xy = d3.mouse(container.node())
				tip.attr("x", xy[0]).attr("y", 0).attr("fill", "#ffffff")
					.text(
						[d.time, ~~histParams.yAcs(d), ~~histParams.cAcs(d)].join("/")
						//allKeys(d)
					);
				//console.log(allKeys(d));
			},
			"mouseout" : function(d, instance){
				d3.select(instance).style({"opacity": 0})
				tip.text("");
			},
			"click" : function(d, instance){
				setTime(d.x);
			},
			// ???
			"drag" : function(d, instance){
				console.log("drag!!", d);
				setTime(d.x);
			},
			"dblclick" : function(d,instance){
				play(d.x);
			}
		}
	}

	function drawCurrentBar(curbar, x, height){
		//console.log(curbar,x,height);
		curbar.attr("x1", x).attr("x2", x)
	}

	//
	this.draw = function(){
		svg.html("");

		var container = svg.attr("width", w0).attr("height", h0)
			.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var hData = cmts.histogramLayout(bin, histParams);
		console.log(hData);

		var width = w0 - margin.left - margin.right;
		var height = h0 - margin.top - margin.bottom;

		var xScale = d3.scale.linear().domain([0, videoLen]).range([0, width]);
		var yScale = d3.scale.linear().domain([0, 1]).range([height, 0]);

		var back = container.append("g").attr("class", "background");
		var bars = container.append("g").attr("class", "bars");
		var tip = container.append("text").attr("class", "tip");
		var curbar = container.append("line").attr("class", "curbar")
			.attr("y1", 0).attr("y2", height)
			.style("stroke", d3.rgb(192, 127, 255))
			// .style("stroke-width", 1)

		// background
		Drawing.appendRect(back, width, height, [{"fill": "#808080"}])

		Drawing.drawBar(bars, hData, xScale, yScale, height, function(d){return d3ColorScale(d.c)}, funcs(container, tip));

		// xAxis
		Drawing.drawXAxis(container, height, xScale);

		// 再生位置監視
		d3.timer(function(){
			drawCurrentBar(curbar, xScale(~~getTime()), height)
		}, 500);
		
		var colg = svg.append("g").attr("transform", "translate(" + (1+margin.left + width ) + "," + margin.top + ")")
		Drawing.appendRect(colg, 10, height, []); // TODO

		// overlay
		//Drawing.appendRect(container.append("g"), width, height, [{"opacity":0}])
			//.on('mouseover', function(d, i){console.log(d,i)});
	}

	//
	function data2color(d){
		var c = colorScale(
			d3.scale.linear().clamp(true)
 				.domain([1, 36*13])
 				.range([0,1])(d.density))
 		return d3.rgb(c[0], c[1], c[2]);
 	}
}

//////////////////////////////////////////
// Drawing Helper
var Drawing = new function(){
	// drawBar
	this.drawBar = function(ctn, hData, xScale, yScale, height, colorConverter, funcs){
		ctn.html("");
		var bar = ctn.selectAll(".bar").data(hData).enter().append("g")
			.attr("class", "bar")

		this.appendRect(
			bar, xScale(hData[0].dx), function(d) { return height - yScale(d.y); },[{"fill": colorConverter}])
			.attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; });
		var overs = this.appendRect(
			bar, xScale(hData[0].dx), height, [{"stroke": "#ffffff"}, {"opacity": 0}])
			.attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + 0 + ")"; })

		_.each(funcs, function(f, k){
			overs = overs.on(k, function(d){
				f(d, this);
			});
		});
	}

	// drawXAxis
	this.drawXAxis = function(ctn, height, xScale){
		var xAxis = d3.svg.axis()
  		.scale(xScale)
  		.tickFormat(function(d){return ms2str(d)})
  		.orient("bottom");
		ctn.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
	}

	// appendRect
	this.appendRect = function(ctn, width, height, styles){
		var r = ctn.append("rect").attr("x", 0).attr("width", width).attr("height", height);
		_.each(styles, function(obj){
			_.each(obj, function(v,k){
				r = r.style(k,v);
			});
		});
		return r;
	}
}
















//