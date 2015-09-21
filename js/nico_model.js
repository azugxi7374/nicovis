/*
var mainThreadId;
var getThreadInfo = function(param) {
  for (var i = 0, l = param.length; i < l; i++) {
    if (param[i].type == 'main') {
      mainThreadId = param[i].id;
    }
  }
}
*/
//////////////////////////////////////////////////
// コメント、再生
var NicoPlayer = function(){
	this.player = $("#external_nicoplayer")[0];
	this.threadId = this.getMainThreadId();
	console.log(this.threadId)
};

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

    // 取得
    console.log(this.player);
    //console.log(
    this.player.ext_getThreads('getThreadInfo')
    //);
    var tid = $(tag).text()
    console.log("tid", $(tag).text());
    return tid;
};



























//