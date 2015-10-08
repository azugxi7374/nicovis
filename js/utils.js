//////////////////
// utils
function ms2str(ms){
	var min = ~~(ms/1000/60);
	var sec = ~~(ms/1000%60);
	return ("00"+min).slice(-2) + ":" + ("00"+sec).slice(-2);
}

function documentHere(func){
	var str = func.toString()
	return str.slice(str.indexOf("/*")+2, str.lastIndexOf("*/"));
}

/*
function allKeys(d){
	return _.chain(Object.keys(d))
		.filter(function(k){
			var k0 = k.charAt(0);
			return k0 < "0" || "9" < k0
		}).map(function(k){
			return k +":"+ d[k];
	}).value().join("/");
}*/

function defval(v1, v2){
	if(v1 !== undefined){
		return v1;
	}else{
		return v2;
	}
}


// サーモグラフィ的な色を返す
// v : [0,1]
function colorScale(v){
	var base = [
		[127,0,127],
		[0,0,255],
		[0,127,255],
		[0,255,0],
		[255,255,0],
		[255,0,0],
//		[255,255,255]
	];

	function hokan(x, a, b){
		return _.map([0,1,2], function(i){
			return a[i] * (1 - x) + b[i] * x;
		});
	}

	if(v <= 0) return base[0];
	else if(1 <= v) return base[base.length -1];
	else{
		var vv = v * (base.length -1)
		var ai = ~~vv;

		return hokan(vv - ai, base[ai], base[ai+1]);
	}
}
function d3ColorScale(v){
	var c = colorScale(v);
	return d3.rgb(c[0], c[1], c[2]);
}

function isNumber(x){
	return (typeof(x) == 'number' /* || typeof(x) == 'string' */) && x == parseFloat(x) && isFinite(x);
}

function identity(x){
	return x;
}

function isUndefined(obj){
	return obj === undefined;
}

function optMap(obj, f){
	if(isUndefined(obj)){
		return obj;
	}else{
		return f(obj);
	}
}



//////////////////////////////////////////
// Drawing Helper
var Drawing = new function(){
	var self = this;

	this.rectAttr = function(x, y, w, h, styles){
		return function(s){
			return s.attr("x", x).attr("y", y).attr("width", w).attr("height", h)
				.call(function(s){
					_.each(defval(styles, []), function(obj){
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
	this.createTip = function(svg, par, cls){
		var m = 5;
		var rect = par.append("rect").call(this.rectAttr(0, 0, 0, 0, [{"fill": "white"}]))
			.attr("rx", 10).attr("ry", 10);
		var text = par.append("text").attr("class", cls).attr("fill", "#101010")//.style("text-anchor", "middle")
		return {
			set: function(s){
				var mxy = d3.mouse(par.node());
				var x = mxy[0], y = mxy[1];
				var sxy = d3.mouse(svg.node());
				var sdx = sxy[0] - x, sdy = sxy[1] - y;

				text.text(s)

				var svgW = svg.node().offsetWidth, svgH = svg.node().offsetHeight;
				var w = text.node().offsetWidth, h = text.node().offsetHeight;
				var rw = w + 2 * m, rh = h + 2 * m;
				var rx = x, ry = y - h - 2 * m;
				var tx = x + m, ty = y - h * 0.33 - m;
				rect.attr("width", rw).attr("height", rh);

				var off = [[0, 0],[0, rh],[-rw, 0],[-rw, rh]];
				var xy = _.find(off, function(xy){
					var x = rx + xy[0] + sdx, y = ry + xy[1] + sdy;
					return 0 <= x && 0 <= y && x + rw <= svgW && y + rh <= svgH;
				});
				xy = defval(xy, _.first(off));
				text.call(self.setXY(tx + xy[0], ty + xy[1]));
				rect.call(self.setXY(rx + xy[0], ry + xy[1]));

			},
			show: function(b){
				text.style("opacity", b ? 1 : 0.0);
				rect.style("opacity", b ? 0.75 : 0.0);
			}
		}
	}
	this.setOpacity = function(v){
		return function(s){
			return s.style("opacity", v);
		}
	};
	this.setXY = function(x, y){
		return function(s){
			return s.attr("x", x).attr("y", y);
		}
	}
}



















//
