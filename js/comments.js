var Comments = function(_comments, videoLen){

	this.cmts = _.filter(_comments, function(c){return c.vpos < videoLen})

	/*
	// 画面に表示されている文字数(?)
	this.density = function(ms){
		var cnt = 0;
		_.each(cmts, function(cmt){
			cnt += this.visibleLength(cmt, ms);
		});
		return cnt;
	}

	this.visibleLength = function(cmt, time){
		// TODO shita, ue, big, small

		if(cmt.vpos - 1000 <= time && time <= cmt.vpos + 3000){
			return Math.min(40, cmt.message.length);
		}else{
			return 0;
		}
	}
	*/

	////////////////////////////////////////
	// createLayout (d3.layout.histogram()の拡張)
	// yAcs, yMin, yMax, cAcs, cMin, cMax
	this.histogramLayout = function(bin, params){
		bin = defval(bin, 100);
		params = defval({}, 0);
		var yAcs = defval(params.yAcs, function(d){return d.length});
		var yMin = defval(params.yMin, function(){return 0});
		var yMax = defval(params.yMax, function(data){return d3.max(data, yAcs)});
		var cAcs = defval(params.cAcs, function(d){return d.length});
		var cMin = defval(params.cMin, function(){return 0});
		var cMax = defval(params.cMax, function(data){return d3.max(data, cAcs)});

		var hist = d3.layout.histogram()
			.bins(bin)
  		.value(function(d){return d.vpos})
  		(this.cmts);

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

		// cnt, length, time, sum, avg, std, med, density
		// TODO shitaとかbigとかも考慮
		_.each(hist, function(d){
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

		var yScale = d3.scale.linear().domain([yMin(hist), yMax(hist)]).range([0, 1]);
		var cScale = d3.scale.linear().domain([cMin(hist), cMax(hist)]).range([0, 1]);

		_.each(hist, function(d){
			d.y = yScale(yAcs(d));
			d.c = cScale(cAcs(d));
		})

		return hist;
	}
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
//
//
//
//
//
//
//
//
//