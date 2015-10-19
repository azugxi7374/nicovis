// container : pieを入れるdiv要素
// size : w, h
// cmts : Comments
// acs : acs, min, max
var Pie = function(container, size, acs){
    var margin = {top: 10, right: 10, bottom: 10, left: 10};

    var palette = Constant.piePalette;

    var svg, g_svg, tip, paths, labels, overs;
    var radius;
    init();

    function init(){
        svg = container.append("svg").attr("class", "pie");
        g_svg = svg.append("g");

        var g_paths = g_svg.append("g").classed("paths", true);
        paths = function(){ return g_paths.selectAll("path")};

        var g_labels = g_svg.append("g").classed("labels", true);
        labels = function(){ return g_labels.selectAll("g");};

        var lTitle = D.Label.create(g_svg, "title", 0, Style.pie_title_m)
            .set(acs.name)
            .g.call(D.addTranslate(0,0));

        tip = D.createTip(svg.node(), g_svg.node());

        var g_overs = g_svg.append("g").classed("overs overlay", true);
        overs = function(){ return g_overs.selectAll("path");};

    }


    this.draw = function(cmts){
        update(size, cmts);
    }


    function update(_size, cmts){
        size = _size
        var wd = size.w - margin.left - margin.right;
        var ht = size.h - margin.top - margin.bottom;

        radius = Math.min(wd, ht)/2 - 5;

        var cx = wd/2 + margin.left;
        var cy = ht/2 + margin.top;

        svg.attr({width: size.w, height: size.h});
        g_svg.call(Drawing.addTranslate(cx, cy));

        _bind(cmts);
        drawData();
    };

    function _bind(cmts){
        var data = cmts.pieLayout(acs, function(p){
            return p.sort(Comments.pie.sort);
        });
        console.log(data);

        _.each([paths(), labels(), overs()], function(e, i){
            var dt = e.data(data);
            dt.exit().remove();
            if(i==1){
                D.Label.create(dt.enter(), "label", 0, Style.pie_label_m);
                //dt.enter().append("g").classed("label",true);
            }else{
                dt.enter().append("path");
            }
        });
    }

    
    function drawData(){
        var _arc = function(){
            return d3.svg.arc().innerRadius(radius * Style.innerRadiusRate).outerRadius(radius);
        };
        //var arc0 = _arc().startAngle(0.1).endAngle(0.2);
        //var arc0 = _arc().endAngle(function(d){return d.startAngle});
        var arc0 = _arc().innerRadius(0.1).outerRadius(0.2);
        var arc = _arc();

        paths().style("fill", function(d, i) { return palette(d.data.color); })
            .attr("d", arc0)
            .transition().duration(Constant.drawDuration).attr("d", arc);

        D.Label.toLabel(labels())
            .set(function(d) {return d.data.disp;})
            .g.call(D.addTranslate(function(d) { return arc.centroid(d)}))
            .call(Drawing.setOpacity(function(d){return d.data.rate < 0.03? 0: 1}));
        /*
        labels().html("");
        console.log(labels().size(), labels());
        var lb = Drawing.createLabel(labels(), 0, 2, "")
            .set(function(d) {return d.data.disp;}, 0, 0);
        lb.g.call(Drawing.addTranslate(function(d) { return arc.centroid(d)}))
            .call(Drawing.setOpacity(function(d){return d.data.rate < 0.03? 0: 1}));
            */

        overs().attr("d", arc).style("opacity", 0)
            .on("mousemove", function(d){
                //console.log("move");
                tip.show(true)
                    .set([d.data.disp, numeral(d.data.rate).format("0.0%"), d.data.count+"件"].join("/"))
            }).on("mouseon", function(d){
                //console.log("on");
                tip.show(true)
                    .set(d.data.disp)
            }).on("mouseout", function(d){
                //console.log("out");
                tip.show(false);
            });
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
