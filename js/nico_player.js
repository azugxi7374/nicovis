var NicoPlayer = NicoPlayer || new function(){
    this.get = function(){
        return NicoPlayerInitializer.get().then(function(player, tid) {

            return {
                // 長さ
                length : Math.ceil(player.ext_getTotalTime() * 1000),
                // play(true | false)
                play : function(b){
                    player.ext_play(b);
                },
                // sec秒に移動
                setTime : function(sec){
                    player.ext_setPlayheadTime(sec);
                },
                // 現在の秒数
                getTime : function(){
                    return player.ext_getPlayheadTime();
                },

                // message, command, vpos, resNo, date
                getComments : function(num){
                    return player.ext_getComments(tid, num);
                }
            };
        });
    };
};

var NicoPlayerInitializer = NicoPlayerInitializer || new function(){
    var tmpTag = "tmp_nicovis_main_thread_id"; /////
    var extFuncList = [
        "ext_getThreads", "ext_play", "ext_setPlayheadTime", "ext_getPlayheadTime",
        "ext_getTotalTime", "ext_getComments"
    ];
    var player, threadId;

    insertTmpDOM();

    this.get = function(){
        var d = new $.Deferred;

        function rec(){
            if(trySet()){
                console.log("set!!!")
                d.resolve(player, threadId);
            }else{
                console.log("wait...")
                setTimeout(rec, 1000);
            }
        }
        rec();

        return d.promise();
    }

    // set : player, threadId
    function trySet(){
        return setPlayer() &&
            _.all(extFuncList, function(f){
                return player[f];
            }) &&
            setMainThreadId(player);
    }

    // insertTmpDOM
    function insertTmpDOM(){
        var js = documentHere(function(){// /*
            var mainThreadId;
            var getThreadInfo = function(param) {
            for (var i = 0, l = param.length; i < l; i++) {
                    if (param[i].type == 'main') {
                        mainThreadId = param[i].id;
                    }
                }
                var mtag = document.getElementsByTagName("***")[0]
                mtag.innerHTML = mainThreadId
            }
            // */
        }).replace("***", tmpTag);

        if(d3.select(tmpTag).empty()){
            d3.select("body").append(tmpTag).style("display","none");
            d3.select("body").append("script").attr("type", "text/javascript").text(js);
        }
        return true;
    }

    // player
    function setPlayer(){
        player = $("#external_nicoplayer")[0];
        return player;
    }

    // threadId
    // require : DOM挿入積み, playerあり
    function setMainThreadId(player){
        player.ext_getThreads('getThreadInfo')
        threadId = $(tmpTag).text();
        return threadId && threadId.length > 0;
    }
}

























//