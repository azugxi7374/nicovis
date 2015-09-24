var Graph = function(){

	var margin = {top: 10, right: 30, bottom: 30, left: 30};
	var w0 = 800;
	var h0 = 100;
	var bin = 120;

	this.draw = function(svg, cmts, len, play){
		var svg = svg || d3.select("svg");
		var cmts = cmts || [];
		var len = len || 0;
		var play = play || function(){};

		svg.html("");

		var data = createLayout(cmts, len, bin);
		console.log(data);

		// svg
		var content = svg.attr("width", w0).attr("height", h0)
			.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		f(content, data, len, play, w0 - margin.left - margin.right,  h0 - margin.top - margin.bottom);
	}

	function f(content, data, len, play, width, height){

		var x = d3.scale.linear()
					.domain([0, len])
					.range([0, width]);

		var y = d3.scale.linear()
					.domain([0, d3.max(data, function(d) { return d.y; })])
					.range([height, 0]);

		var xAxis = d3.svg.axis()
			.scale(x)
			.tickFormat(function(d){return ms2str(d)})
			.orient("bottom");

		content.append("g").append("rect").attr("x", 1).attr("width", width).attr("height", height)
			.style("fill", "#000020")

		// bar
		var bar = content.selectAll(".bar")
				.data(data)
			.enter().append("g")
				.attr("class", "bar")
				.attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

		bar.append("rect")
			.attr("x", 1)
			.attr("width", x(data[0].dx))
			.attr("height", function(d) { return height - y(d.y); })
			.style("fill", function(d){
				var sc = d3.scale.linear().clamp(true)
        	.domain([1, 50])
        	.range([180, 0]);
				var v = sc(d.avg);
				return d3.hsl(v, 1, 0.5)
			});

		content.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		content.append("g").append("rect").attr("x", 1).attr("width", width).attr("height", height)
			.style("opacity", 0)
			.on('mouseover', function(d, i){console.log(d,i)});
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

		// y, length, time, sum, avg, std, med
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
		});

		return hist;
	}
}



















//