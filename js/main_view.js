var MainView = function(par_node){

    var par;
    var cmts, player;
    var hist, pies;

    init();

    function init(){
        par = d3.select(par_node);
        par.html("");

        hist = new Histogram(
                par.append("div"),
                {w:800, h:200},
                Comments.hist.params.viscome,
                Comments.hist.params.danmaku,
                Constant.Timer500 
                );

        pies = _.map(Comments.pie.params, function(acs){
            return new Pie(
                    par.append("span"),
                    {w: 200, h: 200},
                    acs
                    );
        });

    }

    this.draw = function(cmts, player){

        hist.draw(
                cmts,
                player
                );

        _.each(pies, function(pie){
            pie.draw(
                    cmts
                    );
        });
    }
}
