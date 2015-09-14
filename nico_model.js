// Global...
var mainThreadId;
var getThreadInfo = function(param) {
  for (var i = 0, l = param.length; i < l; i++) {
    if (param[i].type == 'main') {
      mainThreadId = param[i].id;
    }
  }
}

//////////////////////////////////////////////////
// コメント、再生
var NicoPlayer = function(){
	this.player = $("#external_nicoplayer")[0];
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

NicoPlayer.prototype.length = function(){
	return this.player.ext_getTotalTime();
}

// message, command, vpos, resNo, date
NicoPlayer.prototype.getComments = function(num){
	this.player.ext_getThreads('getThreadInfo');
	return this.player.ext_getComments(mainThreadId, num);
}
