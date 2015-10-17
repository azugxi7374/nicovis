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

    // spectral([0~1]) => d3.color
    this.spectral = function(v){
        var base =[
            [127,0,127],
            [0,0,255],
            [0,255,255],
            [0,255,0],
            [255,255,0],
            [255,127,0],
            [255,0,0]];
            //[255,255,255]];

        //var base = _.map(colorbrewer.RdYlBu[11], function(s){
        //return d3.rgb(s);
        //}).reverse();

        function comp(x, a, b){
            return _.map([0,1,2], function(i){
                return a[i] * (1 - x) + b[i] * x;
            });
        }
        function comp2(v, base){
            if(v <= 0) return base[0];
            else if(1 <= v) return base[base.length -1];
            else{
                var vv = v * (base.length -1);
                var ai = ~~vv;

                return comp(vv - ai, base[ai], base[ai+1]);
            }
        }
        var a = comp2(v, base);
        return colorControl(d3.rgb(a[0], a[1], a[2]), 0.75, 1.1);
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
