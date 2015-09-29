var Comments = function(comments){

	// 画面に表示されている文字数(?)
	this.density = function(ms){
		var cnt = 0;
		_.each(comments, function(cmt){
			cnt += this.visibleLength(cmt, ms);
		});
		return cnt;
	}

	this.visibleLength = function(cmt, time){
		// TODO shita, ue, big, small

		if(cmt.vpos - 1000 <= time && time <= cmt.vpos + 3000){
			return Math.min(40, cmt.message.length);
		}else{
			return 0;
		}
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