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
		[0,0,0],
		[0,0,255],
		[0,255,255],
		[0,255,0],
		[255,255,0],
		[255,0,0],
		[255,255,255]
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





















//
