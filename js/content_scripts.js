//var svgClass = "svg-nicovis";
var containerClass = "container-nicovis"
var containerWrapperID = "container-nicovis-wrapper-1"

function getContainerWrapper(){ return d3.select("#"+containerWrapperID)};
function getPlayerContainerWrapper(){ return d3.select("#playerContainerWrapper")};

var mainView;


function init(){
    // container
    console.log("init!");

    if(getContainerWrapper().empty()){
        var w = getPlayerContainerWrapper().append("div").attr("id", containerWrapperID);
        var foldButton = w.append("button");
        var resetButton = w.append("button");

        var container = w.append("div").attr("class", containerClass);
        mainView = new MainView(container.node());

        w.foldFlg = 0;
        function fold(flg){
            container.style("display", [null, "none"][flg] );
            var pm = ["-","+"][flg];
            foldButton.text("Nico-Vis "+["▲","▼"][flg]);
        }
        fold(w.foldFlg);
        foldButton.on("click", function(){
            w.foldFlg = 1 - w.foldFlg;
            fold(w.foldFlg);
        });
        resetButton.text("reset").on("click", function(){
            reset();
        });
    }
    reset()
}

function clear(){
    getContainerWrapper().remove();
}

function reset(){
    // nicoPlayer, graph
    NicoPlayer.get().then(function(np){

        mainView.draw(
                new Comments(np.getComments(), np.length),
                {
                    getTime: np.getTime,
                    setTime: function(ms){np.setTime(~~ms)},
                    play: function(){np.play(true)},
                });

        disableAds();
        chrome.runtime.sendMessage({message:"complete"});
    });
}


// 広告
function disableAds(){
    _.each([/*"#playerTabContainer .playerTabAds", */"#playerTabContainer .nicoSpotAds"], function(a){
        d3.select(a).style("display", "none");
    });
}


/////////////////////////////////////////////////////////////////
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("request : " , request, request.message, request.valid, sender);

    if(_.contains(["onCommitted", "onCompleted", "onHistoryStateUpdated"], request.message)){
        if(request.valid){
            init();
        }else{
            clear();
        }
    }
    /*
    // Page Button
    if(request.pageButtonClicked){
    console.log("pageButtonClicked!")
    NicoPlayer.get().then(function(np){
    console.log(JSON.stringify(np.getComments()));
    });
        //sendResponse("ok");
        };
        */

});


























//
