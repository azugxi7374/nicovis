var Constant = new function(){


	function makeColors(category){
		var color = category();
		return _.map(_.range(20), function(i){
			return color(i);
		});
	};

	var pieColors = (function(){
		var color = makeColors(d3.scale.category10);
		return _.union(
			_.map(_.first(color, 7),function(c){return d3.rgb(c).brighter(0.5)})
			, [d3.rgb("#ddf")]);

	})();

	this.piePalette = function(v){
		if(isNumber(v)){
			var size = pieColors.length
			return pieColors[~~((v+size)%size)];
		}else{
			return v;
		}
	}

	//this. スペクトラル






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
