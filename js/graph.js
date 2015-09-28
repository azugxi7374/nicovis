// graph
var Graph = function(svg, w0, h0, cmts, len, play, setTime, getTime){

	var margin = {top: 10, right: 30, bottom: 30, left: 60};
	var bin = 120;

	var w0 = 800;
	var h0 = 100;

	function funcs(container, tip){
		return {
			"mousemove" : function(d, instance){
				d3.select(instance).style({"opacity": 0.75})
				var xy = d3.mouse(container.node())
				tip.attr("x", xy[0]).attr("y", 0).attr("fill", "#ffffff")
					.text(
						[d.time, ~~d.density].join("/")
						//allKeys(d)
					);
				console.log(allKeys(d));
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

	// setSize TODO
//	this.setSize = function(_w0, _h0){
//		w0 = _w0;
//		h0 = _h0;
//		reset();
//	}

	//
	this.draw = function(){
		svg.html("");

		var container = svg.attr("width", w0).attr("height", h0)
			.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		var hData = createLayout(cmts, len, bin);
		console.log(hData);

		var width = w0 - margin.left - margin.right;
		var height = h0 - margin.top - margin.bottom;

		var xScale = d3.scale.linear().domain([0, len]).range([0, width]);
		var yScale = d3.scale.linear().domain([0, d3.max(hData, function(d) { return d.y; })]).range([height, 0]);

		var back = container.append("g").attr("class", "background");
		var bars = container.append("g").attr("class", "bars");
		var tip = container.append("text").attr("class", "tip");
		var curbar = container.append("line").attr("class", "curbar")
			.attr("y1", 0).attr("y2", height)
			.style("stroke", d3.rgb(192, 127, 255))
			// .style("stroke-width", 1)

		// background
		Drawing.appendRect(back, width, height, [{"fill": "#808080"}])

		Drawing.drawBar(bars, hData, xScale, yScale, height, data2color, funcs(container, tip));

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

	////////////////////////////////////////
	// createLayout (d3.layout.histogram()の拡張)
	function createLayout(cmts, len, bin){
		var values = _.chain(cmts).filter(function(c){return c.vpos < len}).value();
		var hist = d3.layout.histogram()
			//.bins(x.ticks(bin))
			.bins(bin)
  		.value(function(d){return d.vpos})
  		(values);

		// initialCount
		_.each(hist, function(d){
			d.initialCount = d.length;
		});

		// 3秒間たたみこみ
		_.each(hist, function(d, i){
			_.each(d, function(c){
				if(i+1 < hist.length && hist[i+1].x <= c.vpos + 3000){
					hist[i+1].push(c);
				}
			});
		});

		// y, length, time, sum, avg, std, med, density
		// TODO shitaとかbigとかも考慮
		_.each(hist, function(d){
			d.y = d.length; // y
			_.each(d, function(c){
				c.length = c.message.length; // length
			});
			_.sortBy(d, function(c){return c.length});
			d.time = ms2str(d.x);
			d.sum = _.chain(d)
				.map(function(c){return c.length})
				.reduce(function(a,b){return a + b})
				.value();
			d.avg = d.sum / d.length;
			d.std = Math.sqrt(
				_.chain(d)
					.map(function(c){return Math.pow(c.length - d.avg, 2)})
					.reduce(function(a,b){return a+b}).value()
				);
			d.med = d.length == 0 ? 0: d[~~(d.length/2)].length;
			d.density = d.sum / d.dx * 1000
		});

		return hist;
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
			//bar, xScale(hData[0].dx), function(d) { return height - yScale(d.y); },[{"fill": colorConverter}])
			bar, xScale(hData[0].dx), function(d) { return height - yScale(d.y); },[{"fill": colorConverter}])
			.attr("transform", function(d) { return "translate(" + xScale(d.x) + "," + yScale(d.y) + ")"; });
		var overs = this.appendRect(
			bar, xScale(hData[0].dx), height, [{"fill": "#ffffff"}, {"opacity": 0}])
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