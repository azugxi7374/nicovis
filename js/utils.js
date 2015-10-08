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

function allKeys(d){
	return _.chain(Object.keys(d))
		.filter(function(k){
			var k0 = k.charAt(0);
			return k0 < "0" || "9" < k0
		}).map(function(k){
			return k +":"+ d[k];
	}).value().join("/");
}

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
