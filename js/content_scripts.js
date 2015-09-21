var svgModalId = "svg_modal";
var svgModal = documentHere(function(){/*
<link rel="stylesheet" type="text/css" href="css/bootstrap.min.css" media="all" />
<div id="***" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="svgModalLabel" style="display: none;">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
                        aria-hidden="true">×</span></button>
                <h4 class="modal-title" id="svgModalLabel">ここにグラフを書く</h4>
            </div>
            <div class="modal-body">
                <!--<svg></svg>-->
            </div>
        </div>
    </div>
</div>
*/
}).replace("***", svgModalId);

var svgModal = documentHere(function(){/*
<section class="modal-window" id="***">
<div class="modal-inner">
コンテンツ
</div>
<div class="modal-close">&times;</div>
</section>
*/
}).replace("***", svgModalId);

var svgModal = documentHere(function(){/*
<div id="***">
<div id="modal-content">
	<p>「閉じる」か「背景」をクリックするとモーダルウィンドウを終了します。</p>
	<p><a id="modal-close" class="button-link">閉じる</a></p>
</div></div>
*/
}).replace("***", svgModalId);


// bodyにsvgModal追加
d3.select("body").append("div").html(svgModal);

// onLoad...
onLoadNicoPlayer(function(np){

    // TODO
    var comes = np.getComments(1000);

    _.chain(comes).first(100).each(function(c){
        console.log(c.vpos + "," + c.message);
    });

    // TODO 広告
    if(true){
        _.each([/*"#playerTabContainer .playerTabAds", */"#playerTabContainer .nicoSpotAds"], function(a){
            d3.select(a).style("display", "none");
        });
    }
});

// onClick...
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.pageButtonClicked){
        onLoadNicoPlayer(function(np){

            //$(this).blur() ;	//ボタンからフォーカスを外す
            // TODO ↓
            //if($("#modal-overlay")[0]) return false ;		//新しくモーダルウィンドウを起動しない [下とどちらか選択]
            //if($("#modal-overlay")[0]) $("#modal-overlay").remove() ;		//現在のモーダルウィンドウを削除して新しく起動する [上とどちらか選択]

            //オーバーレイ用のHTMLコードを、[body]内の最後に生成する
            $("body").append('<div id="modal-overlay"></div>');

            //[$modal-overlay]をフェードインさせる
            $("#modal-overlay").fadeIn("slow");

            //[$modal-content]をフェードインさせる
            $("#modal-content").fadeIn("slow");

            centeringModalSyncer();

            //$("#"+svgModalId).modal();
            var comments = np.getComments(1000);

            d3.select("#" + svgModalId)
                .style("display", "block")
                .select(".modal-inner").append("div")
                .html(
                    _.chain(comments).first(10).map(function(c){return c.message}).join("<br>")
                );
        });

        sendResponse("ok");
    };
});

//センタリングをする関数
function centeringModalSyncer(){

	//画面(ウィンドウ)の幅を取得し、変数[w]に格納
	var w = $(window).width();

	//画面(ウィンドウ)の高さを取得し、変数[h]に格納
	var h = $(window).height();

	//コンテンツ(#modal-content)の幅を取得し、変数[cw]に格納
	var cw = $("#modal-content").outerWidth({margin:true});

	//コンテンツ(#modal-content)の高さを取得し、変数[ch]に格納
	var ch = $("#modal-content").outerHeight({margin:true});

	//コンテンツ(#modal-content)を真ん中に配置するのに、左端から何ピクセル離せばいいか？を計算して、変数[pxleft]に格納
	var pxleft = ((w - cw)/2);

	//コンテンツ(#modal-content)を真ん中に配置するのに、上部から何ピクセル離せばいいか？を計算して、変数[pxtop]に格納
	var pxtop = ((h - ch)/2);

	//[#modal-content]のCSSに[left]の値(pxleft)を設定
	$("#modal-content").css({"left": pxleft + "px"});

	//[#modal-content]のCSSに[top]の値(pxtop)を設定
	$("#modal-content").css({"top": pxtop + "px"});

}