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
