//////////////////////////////////////////////////
// コメント、再生
var NicoPlayer = function(){
    this.funcList = [
        "ext_getThreads", "ext_play", "ext_setPlayheadTime", "ext_getPlayheadTime",
        "ext_getTotalTime", "ext_getComments"
    ]
    this.ready = false;
    this.player;
    this.threadId;

    this.init();
};

NicoPlayer.prototype.init = function(){
    var self = this;
    self.player = $("#external_nicoplayer")[0];
    if (this.player === undefined || _.some(self.funcList, function(f){
        return self.player[f] === undefined
    })){
        return; // NG
    }
    this.threadId = this.getMainThreadId();
    if(this.threadId.length > 0){
        this.ready = true;
    }
}


// play, stop
NicoPlayer.prototype.play = function(b){
	this.player.ext_play(b);
	return this;
};

// sec秒に移動
NicoPlayer.prototype.setTime = function(sec){
	this.player.ext_setPlayheadTime(sec);
	return this;
};

// 現在の秒数
NicoPlayer.prototype.getTime = function(){
	return this.player.ext_getPlayheadTime();
}

// 長さ
NicoPlayer.prototype.length = function(){
	return Math.ceil(this.player.ext_getTotalTime()*1000);
}

// message, command, vpos, resNo, date
NicoPlayer.prototype.getComments = function(num){
	return this.player.ext_getComments(this.threadId, num);
};

// !!! DOMに依存
NicoPlayer.prototype.getMainThreadId = function(){
    var tag = "tmp_nicovis_main_thread_id"; /////
    d3.select("body").append(tag);
    d3.select("body").append("script").attr("type", "text/javascript").text(documentHere(function(){// /*
        var mainThreadId;
        var getThreadInfo = function(param) {
        for (var i = 0, l = param.length; i < l; i++) {
                if (param[i].type == 'main') {
                    mainThreadId = param[i].id;
                }
            }
            var mtag = document.getElementsByTagName("tmp_nicovis_main_thread_id")[0]
            mtag.innerHTML = mainThreadId
        }
        // */
    }));
    this.player.ext_getThreads('getThreadInfo')
    var tid = $(tag).text()
    return tid;
};

// あとで
function onLoadNicoPlayer(callback){
    var np = new NicoPlayer();
    if(np.ready){
        // console.log("np ok!")
        callback(np);
    }else{
        //console.log("wait...")
        setTimeout(function(){onLoadNicoPlayer(callback)}, 1000);
    }
}

























//