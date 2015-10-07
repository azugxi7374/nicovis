var nicoBaseURL = "www.nicovideo.jp/watch/"
var validReg = new RegExp("^.*www\\.nicovideo\\.jp/watch/[^/]+$")

// onInstalled
chrome.runtime.onInstalled.addListener(function(){
});

function sendMes(obj, callback){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, obj, callback);
    });
}
function alf(s, f){
    chrome.webNavigation[s].addListener(f, {url: [{urlContains: nicoBaseURL}]});
    //chrome.webNavigation[s].addListener(f);
}
function isValidURL(url){
    console.log(url, validReg.test(url));
    return validReg.test(url);
}


// onCompleted
alf("onCompleted", function(d){
    console.log("oc");
    //sendMes("completed");
    sendMes({ message: "onCompleted", valid: isValidURL(d.url)});
});

//

alf("onBeforeNavigate", function(d){
    console.log("obn");
    //sendMes("before");
    sendMes({ message: "onBeforeNavigate", valid: isValidURL(d.url)},function(){});
});

alf("onCommitted", function(d){
    console.log("ocm");
    //sendMes("commit");
    sendMes({ message: "onCommitted", valid: isValidURL(d.url),function(){}});
});

alf("onHistoryStateUpdated", function(d){
    console.log("oh");
    //sendMes("hist");
    sendMes({ message: "onHistoryStateUpdated", valid: isValidURL(d.url),function(){}});
});



// onClicked
chrome.pageAction.onClicked.addListener(function(tab){
    sendMes({ message: "onClicked"}, function() {});
});

// ボタン表示
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.message === "complete"){
        chrome.pageAction.show(sender.tab.id);
    }
});

