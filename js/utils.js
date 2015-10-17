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
			return s.attr("x", x).attr("y", y).attr("width", w).attr("height", h).style(defval(styles, {}));
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
	this.createTip = function(svg_node, par_node){
		var obj = {};
		var m = 5;
		var label = self.createLabel(d3.select(par_node), 1, m, "tip");//{"fill": "#101010", "font-size": "x-small"}, {"fill": "white"});

		function check(sdx, sdy){
			var roff = $(label.rect.node()).offset();
			var lx1 = roff.left, ly1 = roff.top;
			var lx2 = lx1 + ~~label.rect.attr("width"), ly2 = ly1 + ~~label.rect.attr("height")
			var sq = $(svg_node);
			var sx1 = sq.offset().left, sy1 = sq.offset().top;
			var sx2 = sx1 + sq.width(), sy2 = sy1 + sq.height();
			return sx1 <= lx1 && lx2 <= sx2 && sy1 <= ly1 && ly2 <= sy2;
		}

		obj.set = function(s){
			var mxy = d3.mouse(par_node);
			label.set(s, mxy[0], mxy[1]);

			_.some([1,2,3,4,0], function(pos){
				label.pos(pos);
				return check();
			});
			return obj;
		};
		obj.show = function(b){
			label.g.style("opacity", b ? 1 : 0.0);
			return obj;
		};
		return obj;
	}
	this.createLabel = function(par, pos, m, cls){
		var obj = {};
		m = defval(m, 5);
		pos = defval(pos, 0);
		var g = par.append("g").attr("class", cls);
		var rect = g.append("rect").attr("rx", Math.min(m, 10)).attr("ry", Math.min(m, 10));
		var text = g.append("text").attr("dy", ".35em").style("text-anchor", "middle");
		var px = 0, py = 0;
		function off(pos, rw, rh){
			return [
				[0,0],
				[rw/2, -rh/2],
				[-rw/2, -rh/2],
				[rw/2, rh/2],
				[-rw/2, rh/2],
			][pos]
		};
		function move(x, y){
			x = defval(x, px);
			y = defval(y, py);
			g.each(function(d){
				var g = d3.select(this);
				var text = g.select("text"), rect = g.select("rect");
				var tw = text.node().offsetWidth, th = text.node().offsetHeight;
				var rw = tw + 2 * m, rh = th + 2 * m;
				var oxy = off(pos, rw, rh);

				var tx = x, ty = y;
				var rx = tx - tw/2 - m, ry = ty - th/2 - m;
				text.call(self.setXY(tx + oxy[0], ty + oxy[1]));
				rect.call(self.rectAttr(rx + oxy[0], ry + oxy[1], rw, rh))
			});
			px = x;
			py = y;
			return obj;
		}
		obj.set = function(s, x, y){
			text.text(s)
			move(x, y);
			return obj;
		};
		obj.pos = function(_pos){
			pos = _pos;
			move();
			return obj;
		};
		obj.style = function(tStyles, rStyles){
			text.style(tStyles);
			rect.style(rStyles);
			return obj;
		};
		obj.g = g;
		obj.rect = rect;
		obj.text = text;
		return obj;
	};//


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
