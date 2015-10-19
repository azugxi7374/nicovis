// container : histogramを入れるdiv要素
// size : w, h
// cmts : Comments
// y,c : acs, min, max
// vlen
// funcs : getTime, setTime, play
var Histogram = function(container, size, yParams, cParams, timer){
    // this.ID = _.uniqueId();
    var aParams = Comments.hist.params.acmcome;
    var margin = Style.hist_margin;
    var getBin = function(){
        return (size.w - margin.left - margin.right)/3; 
    }

    var svg, bars, overs, areaPath, tip, xAxis, yAxis, cAxis;
    var curbar;
    var xScale, yScale, cAxisYScale;

    init();

    function init(){
        // container.html("");

        svg = container.append("svg").classed("histogram", true);
        var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var g_axis = g.append("g").classed("axis", true);

        var g_bars = g.append("g").attr("class", "bars");
        bars = function(){ return g_bars.selectAll("rect");};
        curbar = Drawing.createBar(g, "curbar");
        // pbar = Drawing.createBar(g, "pbar");
        tip = Drawing.createTip(svg.node(), g.node(), "tip");

        var g_area = g.append("g").classed("area", true);
        areaPath = g_area.append("path");

        var g_overs = g.append("g").attr("class", "bars overlay");
        overs = function(){ return g_overs.selectAll("rect");};

        xAxis = g_axis.append("g").attr("class", "x-axis");
        yAxis = g_axis.append("g").attr("class", "y-axis");
        cAxis = g_axis.append("g").attr("class", "c-axis");
        cAxis.append("g").classed("c-axis-axis", true);

        xAxis.append("text").classed("label", true);
        yAxis.append("text").classed("label", true);
        cAxis.append("text").classed("label", true);
        cAxis.append("g").classed("c-bar", true)
            .selectAll("rect").data(_.map(_.range(Style.histCAxisCount), function(i){
                return 1- i/Style.histCAxisCount;
            })).enter().append("rect")
        .style("fill", function(v){ return Constant.spectral(v)});
        

        xScale = d3.scale.linear();
        yScale = d3.scale.linear();
        cAxisYScale = d3.scale.linear();
    }

    this.draw = function(cmts, player){
        update(size, cmts, player);
    }

    function drawBars(ht, player){
        bars().attr({
            x: function(d){return xScale(d.x)}, 
            y: ht,
            width: function(d){return xScale(d.dx)},
            height: 0,
            fill: function(d){return Constant.spectral(d.c)}});
        bars().transition().duration(Constant.drawDuration).attr({
            y: function(d){return yScale(d.y)},
            height: function(d) { return ht - yScale(d.y); },
        });

        overs().attr({
            x: function(d){return xScale(d.x)}, 
            y: 0, 
            width: function(d){return xScale(d.dx)},
            height: ht,
        }).call(function(s){
            _.each(actions(tip, player), function(v,k){
                s.on(k, v);
            });
        });

        areaPath.attr("d", d3.svg.area()
                .x(function(d){ return xScale(d.x + d.dx)})
                   .y0(ht)
                   .y1(function(d){
                       var scale = d3.scale.linear()
                           .domain([0, 1]).range([ht, 0]);
                       return scale(d.a);
                   })
                );

    }

    function _bind(cmts){
        var data = cmts.histogramLayout(getBin(), yParams, cParams);
        console.log(data);
        _.each([bars(), overs()], function(bs){
            var bd = bs.data(data);
            bd.exit().remove();
            bd.enter().append("rect");
        });
        areaPath.datum(data);
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

        _bind(cmts);
        drawBars(ht, player);

        curbar.height(ht);
        timer.add("hist", function(){
            curbar.move(xScale(~~player.getTime()))
        });

        // Axis
        xAxis.call(D.trans(0, ht))
            .call(
                    d3.svg.axis().scale(
                        d3.scale.linear().domain([0, vlen/ 1000/ 60]).range([0, wd]))
                    .tickFormat(function(d){return ms2str(d*1000*60)})
                    .innerTickSize(-ht)
                    .outerTickSize(0)
                    .orient("bottom")
                 );
        xAxis.selectAll(".tick text").attr({
            x: "1.75em",
            y: ".35em",
            transform: "translate(0, 0) rotate(45)",
        });
        /*
        xAxis.select(".label").attr({
            transform: "translate(" + wd + ", " + (40) + ")",
            // transform: "translate(" + wd/2 + ", " + (margin.bottom - 20) + ")",
        }).style("text-anchor", "end").text("time");
        */

        yAxis.call(D.trans(0, 0))
            .call(
                    d3.svg.axis().scale(
                        d3.scale.linear().domain([
                            yParams.min(bars().data()), yParams.max(bars().data())
                        ]).range(yScale.range()))
                    .ticks(7)
                    .innerTickSize(-wd)
                    .outerTickSize(0)
                    .orient("left")
                 );
        yAxis.select(".label").attr({
            x: 0,
            y: ".5em",
            transform: "translate(" + -Style.histYAxisMargin + "," + ht/2 + ") rotate(-90)",
        }).style("text-anchor", "middle")
        .text(yParams.name);

        cAxisYScale.domain([0,1]).range([ht, 0]);
        cAxis.call(D.trans(wd, 0));
        
        cAxis.select(".c-axis-axis").call(D.trans(
                    Style.histCAxisMargin * 2 + Style.histCAxisWidth, 0))
            .call(
                    d3.svg.axis().scale(/*
                        d3.scale.linear().domain([
                            cParams.min(bars().data()), cParams.max(bars().data())
                        ]).range(yScale.range())*/
                        d3.scale.linear().range(yScale.range())
                        ).tickValues([0,1])
                    .tickFormat(function(d){return ["低", "高"][d]})
                    .innerTickSize(0)
                    .outerTickSize(0)
                    .orient("right")
                 );

        cAxis.select(".c-bar").selectAll("rect").attr({
            x: Style.histCAxisMargin,
            y: cAxisYScale,
            width: Style.histCAxisWidth,
            height: 1 + Math.ceil((size.h - margin.top - margin.bottom)/ Style.histCAxisCount)
        });
        cAxis.select(".label").attr({
            x: 0,
            y: ".5em",
            transform: "translate(" 
                    + (Style.histCAxisMargin * 2 + Style.histCAxisWidth + Style.histCAxisLabelMargin)
                    + "," + ht/2 +") rotate(90)",
        }).style("text-anchor", "middle")
        .text(cParams.name);
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
