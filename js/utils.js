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

