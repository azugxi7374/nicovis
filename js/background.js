var nicoBaseURL = 'www.nicovideo.jp/watch/'

chrome.runtime.onInstalled.addListener(function(){

});

//chrome.webNavigation.onDOMContentLoaded.addListener(function(){
//    console.log("domContentLoaded!");
//});

console.log("background.js");
chrome.webNavigation.onCommitted.addListener(function(e){
    chrome.pageAction.show(e.tabId)
    console.log("committed");
    var idx = e.url.indexOf(nicoBaseURL)
    var videoID = e.url.substring(idx + nicoBaseURL.length)
    test(videoID)
}, {url: [{urlContains: nicoBaseURL}]}
);
