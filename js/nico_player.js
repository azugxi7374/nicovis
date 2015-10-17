//
// NicoPlayer.get().then(function(np){...});
var NicoPlayer = {
	get : function(){
		return NicoPlayerInitializer.get().then(function(player, tid) {

			return {
				// 長さ(ms)
				length : Math.ceil(player.ext_getTotalTime() * 1000),
				// play(true | false)
				play : function(b){
					player.ext_play(b);
				},
				// msに移動
				setTime : function(ms){
					player.ext_setPlayheadTime(~~(ms / 1000));
				},
				// 現在のms数
				getTime : function(){
					return player.ext_getPlayheadTime() * 1000;
				},

				// message, command, vpos, resNo, date
				getComments : function(num){
					num = num || 10000;
					return player.ext_getComments(tid, num);
				}
			};
		});
	},
	test : function(){
		this.get().then(function(np){
			console.log(
				np.length,
				np.getComments(100),
				np.getComments(),
				np.play(true),
				np.getTime(),
				np.setTime((120 + 53)*1000),
				np.getTime()
			)
		})
	}
};

// playerとthreadIDを取得
var NicoPlayerInitializer = new function(){
	var tmpTag = "tmp_nicovis_main_thread_id"; /////
	var getThreadInfo = "getThreadInfo";
	var extFuncList = [
		"ext_getThreads", "ext_play", "ext_setPlayheadTime", "ext_getPlayheadTime",
		"ext_getTotalTime", "ext_getComments"
	];
	var TLE = 3 * 60 * 1000
	var player, threadId;
	var pid = 0;

	// 準備ができたらnpを返すDeferred
	this.get = function(){
		var d = new $.Deferred;

		var time = 0;
		function tle(t){return t > TLE};
		function rec(i){
			if(trySet()){
				console.log("succeeded!! :) ("+i+")");
				d.resolve(player, threadId);
			}else{
				if(pid != i || tle(time)){
					console.log("reject :( ("+i+")");
					d.reject();
				}else{
					console.log("wait...("+i+")");
					setTimeout(function(){rec(i)}, 1000);
					time += 1000;
				}
			}
		}
		rec(++pid);

		return d.promise();
	}

	// set : player, threadId
	function trySet(){

		return (setPlayer() ? true : console.log("Faild : setPlayer")) &&
			(_.all(extFuncList, function(f){	return player[f];	}) ? true : console.log("Faild : functions")) &&
			(insertTmpDOM() && setMainThreadId(player) ? true : console.log("Faild : setMainThreadId")) &&
			(player.ext_getComments(threadId, 1).length == 1 ? true : console.log("Faild : getComments"));
	}

	// insertTmpDOM
	function insertTmpDOM(){
		///////////////////////////
		var js = documentHere(function(){// /*
			var mainThreadId;
			var ___ = function(param) {
			for (var i = 0, l = param.length; i < l; i++) {
					if (param[i].type == 'main') {
						mainThreadId = param[i].id;
					}
				}
				var mtag = document.getElementsByTagName("***")[0]
				mtag.innerHTML = mainThreadId
			}
			// */
		}).replace("***", tmpTag).replace("___", getThreadInfo);
		////////////////////
		
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
		player.ext_getThreads(getThreadInfo)
		threadId = $(tmpTag).text();
		return threadId && threadId.length > 0;
	}
}

























//
