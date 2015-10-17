// container : histogramを入れるdiv要素
// size : w, h
// cmts : Comments
// y,c : acs, min, max
// vlen
// funcs : getTime, setTime, play
var Histogram = function(container, size, cmts, yParams, cParams, vlen, funcs, timer){
    this.ID = _.uniqueId();

    var margin = {top: 10, right: 20, bottom: 30, left: 30};
    var bin = (size.w - margin.left - margin.right)/3; 

    var /*back,*/ bars_g, over, tip, xAxis;
    var curbar, pbar;

    function setDOM(ctn, wd, ht){

        var svg = ctn.append("svg").attr("width", size.w).attr("height", size.h);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //back = g.append("rect").call(Drawing.rectAttr(0,0, wd, ht, {"fill": "#808080"}));
        bars_g = g.append("g").attr("class", "bars");
        curbar = Drawing.createBar(g, "curbar", ht);
        pbar = Drawing.createBar(g, "pbar", ht);
        tip = Drawing.createTip(svg.node(), g.node(), "tip");
        over = g.append("rect").call(Drawing.rectAttr(0,0, wd, ht, {"opacity": 0.0}));
        xAxis = g.append("g").attr("class", "x axis").call(Drawing.addTranslate(0, ht));
        cAxis = svg.append("g").attr("class", "c-axis");
    }

    // reset
    this.draw = function(){
        var wd = size.w - margin.left - margin.right,
        ht = size.h - margin.top - margin.bottom;
        yParams = defval(yParams, Comments.hist.params.count);
        cParams = defval(cParams, Comments.hist.params.volume);
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
                        function(d){return xScale(d.x)}, function(d){return yScale(d.y)},
                        xScale(hData[0].dx), function(d) { return ht - yScale(d.y); }, {"fill": function(d){return Constant.spectral(d.c)}})
                    )//.call(
                    //Drawing.addTranslate(function(d){return [xScale(d.x), yScale(d.y)]}));

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

        // 右側のバー
        var cAxisCount = 32;
        var cAxisYScale = d3.scale.linear()
            .domain([0,1]).range([size.h - margin.bottom, margin.top]);
        cAxis.selectAll(".caxis")
            .data(_.map(_.range(cAxisCount), function(i){return 1- i/cAxisCount})).enter()
            .append("rect").attr("class", ".caxis")
            .call(Drawing.rectAttr(
                        size.w - margin.right, 
                        cAxisYScale,
                        margin.right,
                        Math.ceil((size.h - margin.top - margin.bottom)/ cAxisCount),
                        {"fill": function(v){ return Constant.spectral(v);}}));
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
                tip.show(true).set([d.time, ~~yParams.acs(d), ~~cParams.acs(d)].join("/"))
            },
            "mouseout" : function(){
                pbar.show(false);
                tip.show(false);
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














//
