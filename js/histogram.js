// container : histogramを入れるdiv要素
// size : w, h
// cmts : Comments
// y,c : acs, min, max
// vlen
// funcs : getTime, setTime, play
var Histogram = function(container, size, cmts, yParams, cParams, vlen, funcs, timer){
	this.ID = _.uniqueId();

	var margin = {top: 10, right: 30, bottom: 30, left: 60};
	var bin = 120;

	var back, bars_g, over, tip, xAxis;
	var curbar, pbar;

	function setDOM(ctn, wd, ht){
		ctn.append("button").html("button1").on("click", button1);
		ctn.append("button").html("button2").on("click", function(){console.log('button2_clicked')});

		var svg = ctn.append("svg").attr("width", size.w).attr("height", size.h);
		var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		back = g.append("rect").call(Drawing.rectAttr(wd, ht, [{"fill": "#808080"}]));
		bars_g = g.append("g").attr("class", "bars");
		tip = g.append("text");
		curbar = Drawing.createBar(g, "curbar", ht);
		pbar = Drawing.createBar(g, "pbar", ht);
		over = g.append("rect").call(Drawing.rectAttr(wd, ht, [{"opacity": 0.0}]));
		xAxis = g.append("g").attr("class", "x axis").call(Drawing.addTranslate(0, ht));
	}

	// TODO
	function button1(){
		console.log("button1 clicked!");
	}

	// reset
	this.reset = function(){
		var wd = size.w - margin.left - margin.right,
			ht = size.h - margin.top - margin.bottom;
		yParams = defval(yParams, Comments.params.hist.count);
		cParams = defval(cParams, Comments.params.hist.volume);
		var hData = cmts.histogramLayout(bin, yParams, cParams);
		console.log(hData);
		var xScale = d3.scale.linear().domain([0, vlen]).range([0, wd]);
		var yScale = d3.scale.linear().domain([0, 1]).range([ht, 0]);
		var xInvScale = d3.scale.linear().domain([0, wd]).range([0, vlen]);

		container.html("");
		setDOM(container, wd, ht);

		// color bar
		bars_g.selectAll(".bar").data(hData).enter().append("g").attr("class", "bar")
			.append("rect").call(Drawing.rectAttr(
				xScale(hData[0].dx), function(d) { return ht - yScale(d.y); }, [{"fill": function(d){return d3ColorScale(d.c)}}])
			).call(
				Drawing.addTranslate(function(d){return [xScale(d.x), yScale(d.y)]}));

		// overlay bar
		var dAcs = function(x){ return searchData(hData, xInvScale(x))}
		_.each(actions(over, dAcs, tip, pbar), function(v,k){
			over = over.on(k, v);
		});

		// xAxis
		xAxis.call(d3.svg.axis().scale(xScale).tickFormat(function(d){return ms2str(d)}).orient("bottom"));

		// 再生位置監視
		// TODO 重い
		timer(function(){
			curbar.move(xScale(~~funcs.getTime()))
		});
	}

	// actions
	function actions(ctn, dAcs, tip, pbar){
		function getX(){ return d3.mouse(ctn.node())[0]};
		return {
			"mousemove" : function(){
				var x = getX();
				var d = dAcs(x);
				pbar.show(true);
				pbar.move(x);
				tip.attr("x", x).attr("y", 0).attr("fill", "#ffffff")
					.text(
						[d.time, ~~yParams.acs(d), ~~cParams.acs(d)].join("/")
					);
			},
			"mouseout" : function(){
				pbar.show(false);
				tip.text("");
			},
			"click" : function(){
				funcs.setTime(dAcs(getX()).x);
			},
			// TODO
			"drag" : function(){
				console.log("drag!!", getX());
				//funcs.setTime(d.x);
			},
			"dblclick" : function(){
				funcs.play();
			}
		}
	}

	// searchData
	function searchData(hist, ms){
		var idx = Math.max(0, _.sortedIndex(hist, {x: ms}, 'x') -1);
		return hist[idx];
	}
}

//////////////////////////////////////////
// Drawing Helper
var Drawing = new function(){
	var self = this;

	this.rectAttr = function(width, height, styles){
		return function(s){
			return s.attr("x", 0).attr("width", width).attr("height", height)
				.call(function(s){
					_.each(styles, function(obj){
						_.each(obj, function(v,k){
							s = s.style(k,v);
						});
					});
				});
		};
	};

	//
	this.addTranslate = function(p1, p2){
		return function(s){
			var f;
			if(typeof p1 === "function"){
				f = function(d){
					var a = p1(d); return "translate(" + a[0] + "," + a[1] + ")";
				};
			}else{
				f = function(d){
					return "translate(" + p1 + "," + p2 + ")";
				};
			}
			return s.attr("transform", f);
		}
	}

	this.createBar = function(par, cls, height){
		var bar = par.append("line").attr("class", cls).attr("y1", 0).attr("y2", height);
		return {
			move: function(x){
				bar.attr("x1", x).attr("x2", x)
			},
			show: function(b){
				bar.style("opacity", b ? 1.0 : 0.0);
			}
		};
	}
}
















//