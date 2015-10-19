// container : histogramを入れるdiv要素
// size : w, h
// cmts : Comments
// y,c : acs, min, max
// vlen
// funcs : getTime, setTime, play
var Histogram = function(container, size, yParams, cParams, timer){
    // this.ID = _.uniqueId();

    var cAxisCount = 32;
    var margin = {left: 30, right: 30, top: 30, bottom: 30};
    var getBin = function(){
        return (size.w - margin.left - margin.right)/3; 
    }

    var svg, bars, overs, tip, xAxis, cAxis;
    var curbar;
    var xScale, yScale, cAxisYScale;

    init();

    function init(){
        // container.html("");

        svg = container.append("svg");
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var g_axis = g.append("g").classed("axis", true);

        var g_bars = g.append("g").attr("class", "bars");
        bars = function(){ return g_bars.selectAll("rect");};
        curbar = Drawing.createBar(g, "curbar");
        // pbar = Drawing.createBar(g, "pbar");
        tip = Drawing.createTip(svg.node(), g.node(), "tip");
        var g_overs = g.append("g").attr("class", "bars overlay");
        overs = function(){ return g_overs.selectAll("rect");};

        xAxis = g_axis.append("g").attr("class", "x-axis");
        cAxis = g_axis.append("g").attr("class", "c-axis")
            .selectAll(".caxis").data(_.map(_.range(cAxisCount), function(i){
                return 1- i/cAxisCount
            })).enter()
        .append("rect").attr("class", ".caxis")
            .style("fill", function(v){ return Constant.spectral(v)});


        xScale = d3.scale.linear();
        yScale = d3.scale.linear();
        cAxisYScale = d3.scale.linear();
    }

    this.draw = function(cmts, player){
        update(size, cmts, player);
    }

    function drawBars(player){
        bars().attr({
            x: function(d){return xScale(d.x)}, 
            y: yScale(0), 
            width: function(d){return xScale(d.dx)},
            height: 0,
            fill: function(d){return Constant.spectral(d.c)}});
        bars().transition().duration(Constant.drawDuration).attr({
            y: function(d){return yScale(d.y)},
            height: function(d) { return yScale(0) - yScale(d.y); },
        });

        overs().attr({
            x: function(d){return xScale(d.x)}, 
            y: 0, 
            width: function(d){return xScale(d.dx)},
            height: yScale(0) 
        }).call(function(s){
            _.each(actions(tip, player), function(v,k){
                s.on(k, v);
            });
        });

    }

    function _bind(cmts){
        var data = cmts.histogramLayout(getBin(), yParams, cParams);
        console.log(data);
        _.each([bars(), overs()], function(bs){
            var bd = bs.data(data);
            bd.exit().remove();
            bd.enter().append("rect");
        });
    }

    // draw
    function update(_size, cmts, player){
        size = _size;
        var wd = size.w - margin.left - margin.right;
        var ht = size.h - margin.top - margin.bottom;
        var vlen = cmts.videoLen;

        xScale.domain([0, vlen]).range([0, wd]);
        yScale.domain([0, 1]).range([ht, 0]);

        svg.attr("width", size.w).attr("height", size.h);

        xAxis.call(Drawing.addTranslate(0, ht))
            .call(d3.svg.axis().scale(xScale).tickFormat(function(d){return ms2str(d)}).orient("bottom"));

        _bind(cmts);
        drawBars(player);

        // pbar.height(ht);
        curbar.height(ht);
        timer.add("hist", function(){
            curbar.move(xScale(~~player.getTime()))
        });

        // 右側のバー
        cAxisYScale.domain([0,1]).range([ht, 0]);
        cAxis.attr({
            x: wd,
            y: cAxisYScale,
            width: margin.right -10,
            height: Math.ceil((size.h - margin.top - margin.bottom)/ cAxisCount)
        });
    }

    // actions
    function actions(tip, player){
        return {
            "mousemove" : function(d){
                d3.select(this).classed("current", true);
                tip.show(true).set([d.time, ~~yParams.acs(d), ~~cParams.acs(d)].join("/"))
            },
            "mouseout" : function(){
                d3.select(this).classed("current", false);
                tip.show(false);
            },
            "click" : function(d){
                player.setTime(d.x);
            },
            // TODO
            "drag" : function(){
                console.log("drag!!");
            },
            "dblclick" : function(){
                player.play();
            }
        }
    }

}
//
