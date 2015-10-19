var Comments = function(_comments, _videoLen){
    var self = this;

    this.videoLen;
    this.cmts;
    init();
    console.log(this.cmts);

    function init(){
        self.videoLen = _videoLen;
        self.cmts = _.chain(_comments)
            .filter(function(c){
                return c.vpos < _videoLen // videoLenより前のもの
            }).map(function(c){
                var cmds = c.command.split(" ");
                c.width = cmtWidth(c);

                // 184, color, size, pos, device,...
                _.each(cmds, function(cmd){
                    optMap(Comments.getCmdProp(cmd, "key"), function(k){
                        c[k] = cmd;
                    });
                });
                return c;
            }).value();
    }

    // TODO small_big, shita_ue, 半角
    function cmtWidth(cmt){
        return cmt.message.length / 29.5 || 0;
    }

    // volume : [ams, bms]区間の総弾幕volume
    function danmakuVol(cmts, ams, bms){
        var ret = 0;
        _.each(cmts, function(cmt){
            ret += danmakuVol1(cmt, bms) - danmakuVol1(cmt, ams);
        });
        return ret;
    }

    // danmekuVol1 : msまでのcmtの弾幕volume
    function danmakuVol1(cmt, ms){
        if(_.contains(["ue", "shita"], cmt.pos)){
            var a = cmt.vpos, b = cmt.vpos + 3000;
            if(ms < a){
                return 0;
            }else{
                return (Math.min(b, ms) - a) * cmt.width
            }
        }else{
            var v = (1 + cmt.width) / 4.0
                var t = cmt.width / v;
            t = Math.min(t, 4000 - t);
            var a = cmt.vpos - 1000, b = cmt.vpos + 3000,
            x = a + t, y = b - t;
            var ret = 0;
            if(a <= ms){
                var p = Math.min(x, ms) - a;
                ret += p * (v * p) / 2;
            }
            if(x <= ms){
                var p = Math.min(y, ms) - x;
                ret += p * (v * t);
            }
            if(y <= ms){
                var q = b - Math.min(b, ms);
                ret += t * (v * t) / 2 - q * (v * q) / 2;
            }
            //console.log("ret", ret);
            return ret;
        }
    }

    // comeVol : [ams, bms]区間の総visibleCommentVolume
    function comeVol(cmts, ams, bms){
        var ret = 0;
        _.each(cmts, function(cmt){
            ret += comeVol1(cmt, bms) - comeVol1(cmt, ams);
        });
        return ret;
    }
    // comeVol1 : msまでのvisibleなcmtのvolume
    function comeVol1(cmt, ms){
        var a, b = cmt.vpos + 3000;
        if(_.contains(["ue", "shita"], cmt.pos)){
            a = cmt.vpos;
        }else{
            a = cmt.vpos - 1000;
        }

        return Math.max(0, Math.min(ms, b) - a);
    }

    ////////////////////////////////////////
    // createLayout (d3.layout.histogram()の拡張)
    this.histogramLayout = function(bin, yParams, cParams, aParams){
        aParams = defval(aParams, Comments.hist.params.acmcome);

        var hist = d3.layout.histogram()
            .bins(bin)
            .value(function(d){return d.vpos})
            (this.cmts);

        // cnt, length, time, sum, avg, std, med, density
        _.each(hist, function(d, i){
            _.each(d, function(c){
                c.length = c.message.length; // length
            });
            _.sortBy(d, function(c){return c.length});
            d.time = ms2str(d.x);
            d.sum = defval( _.chain(d)
                .map(function(c){return c.length})
                .reduce(function(a,b){return a + b})
                .value(), 0);
            d.avg = d.sum / d.length;
            d.std = Math.sqrt(
                    _.chain(d)
                    .map(function(c){return Math.pow(c.length - d.avg, 2)})
                    .reduce(function(a,b){return a+b}).value()
                    );
            d.med = d.length == 0 ? 0: d[~~(d.length/2)].length;
            // danmakuVol : 1ms で1行文なら 1
            // TODO ↓ 1sec で何文字分かに変換
            d.danmaku = danmakuVol(self.cmts, d.x, d.x+d.dx) / d.dx * 1000;
            d.viscome = comeVol(self.cmts, d.x, d.x+d.dx) / 1000 / d.dx * 1000;
            d.acmcome = (i==0? 0: hist[i-1].acmcome) + d.sum;
        });

        var yScale = d3.scale.linear().domain([yParams.min(hist), yParams.max(hist)]).range([0, 1]);
        var cScale = d3.scale.linear().domain([cParams.min(hist), cParams.max(hist)]).range([0, 1]);
        var aScale = d3.scale.linear().domain([aParams.min(hist), aParams.max(hist)]).range([0, 1]);

        _.each(hist, function(d){
            d.y = yScale(yParams.acs(d));
            d.c = cScale(cParams.acs(d));
            d.a = aScale(aParams.acs(d));
        })

        return hist;
    }

    // pieLayout
    // rateあり
    this.pieLayout = function(acs, opt){
        var data = _.chain(this.cmts).countBy(function(c){
            return acs.acs(c);
        }).pairs().map(function(a){
            var obj = {cmd: a[0], disp: a[0], color: -1, count: a[1]}
            optMap(Comments.getCmdProp(a[0]), function(e){
                obj.disp = e.disp(a[0]);
                obj.color =  e.color;
            });
            return obj;
        }).value();

        var sum = _.chain(data).map(function(d){
            return d.count;
        }).reduce(function(a,b){return a+b})
        .value();

        _.each(data, function(d){
            d.rate = d.count / sum;
        });

        return opt(
                d3.layout.pie().value(function(d){return d.count})
                )(data);
    }

    // command
    this.cmdRates = function(){
        return _.chain(this.cmts).map(function(cmt){
            return cmt.command.split(" ");
        }).flatten()
        .countBy(function(cmd){
            return cmd
        }).value();
    };

    console.log(this.cmdRates());
}

Comments.hist = {
    params : {
        viscome : {
            name : "コメント件数 / 秒",
            acs : function(d){return d.viscome},
            min : function(){return 0},
            max : function(data){return d3.max(data, function(d){return d.viscome})},
        },
        danmaku : {
            name : "弾幕密度",
            acs : function(d){return d.danmaku},
            min : function(){return 0},
            max : function(){return 12.5 * 1000},
        },
        acmcome : {
            name : "累積コメント件数",
            acs : function(d){return d.acmcome},
            min : function(){return 0},
            max : function(data){return d3.max(data, function(d){return d.acmcome})},
        },
    },
};

Comments.pie = {
    params : {
        color : {
            name : "COLOR",
            acs : function(d){return d.cmd_color}
        },
        size : {
            name : "SIZE",
            acs : function(d){return d.cmd_size}
        },
        position : {
            name : "POSITION",
            acs : function(d){return d.cmd_pos},
        },
        device : {
            name : "DEVICE",
            acs : function(d){return d.cmd_device}
        },
        _184 : {
            name : "184",
            acs : function(d){return d.cmd__184}
        },
    },
    sort : function(a, b){
        if(a.cmd == "undefined"){
            return 1
        }else if(b.cmd == "undefined"){
            return -1
        }else{
            return d3.descending(a.count, b.count);
        }
    },/*
         color : function(c, palette){ // palette : -1, 0~ ...
         return isNumber(c) ? palette(c) : c;
         },*/
};

// コマンド
// [{discrim : コマンド判別関数, key: dに付けるkey名, color : 色or色番号, disp : 表示名関数}]
Comments.cmd = cmtCmdFormatter({
    _184 : [
        ["184", ]
    ],
    size : [
        ["big", ],
        ["small", ]
    ],
    pos : [
        ["ue", ],
        ["shita", ],
        ["naka", ]
    ],
    device : [
        ["device:3DS", , function(s){return s.slice("device:".length)}],
        ["device:WiiU", ,function(s){return s.slice("device:".length)}],
        [function(s){return s.startsWith("device:")}, , function(s){return s.slice("device:".length)}],
    ],
    color : [
        ["white", "white"],
        ["red", "red"],
        ["pink", "pink"],
        ["orange", "orange"],
        ["yellow", "yellow"],
        ["green", "green"],
        ["cyan", "cyan"],
        ["blue", "blue"],
        ["purple", "purple"],
        ["black", "black"],
        ["niconicowhite", "#CCCC99"],
        ["white2", "#CCCC99"],
        ["truered", "#CC0033"],
        ["red2", "#CC0033"],
        ["pink2", "#FF33CC"],
        ["passionorange", "#FF6600"],
        ["orange2", "#FF6600"],
        ["madyellow", "#999900"],
        ["yellow2", "#999900"],
        ["elementalgreen", "#00CC66"],
        ["green2", "#00CC66"],
        ["marineblue", "#3399FF"],
        ["blue2", "#3399FF"],
        ["nobleviolet", "#6633CC"],
        ["purple2", "#6633CC"],
        ["black2", "#666666"],
        [function(s){return s.startsWith("#")}, -1],
        ],
});

function cmtCmdFormatter(o){
    var ret = [];
    _.each(o, function(a, k){
        _.each(a, function(e, i){

            // TODO ↓
            /*
               if(typeof(c) == 'string'){
               var hsl = d3.hsl(c);
               c = d3.hsl(hsl.h, hsl.s * 0.7, hsl.l * 1.25);
               }else{}*/

            ret.push({
                discrim : typeof(e[0]) == 'function' ? e[0] : function(s){return s == e[0]},
                key : "cmd_" + k,
                color : defval(e[1], i),
                disp : e[2] ? e[2] : identity,
            });
        });
    });
    return ret;
}

Comments.getCmdProp = function(s, k){
    var e = _.find(Comments.cmd, function(e){
        return e.discrim(s);
    });
    return isUndefined(k) ? e : optMap(e, function(e){return e[k]});
}

console.log(Comments.cmd);


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
