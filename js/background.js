var nicoBaseURL = 'www.nicovideo.jp/watch/'

// onInstalled
chrome.runtime.onInstalled.addListener(function(){
});

// onCompleted ボタン表示
chrome.webNavigation.onCompleted.addListener(function(e){
    chrome.pageAction.show(e.tabId)
}, {url: [{urlContains: nicoBaseURL}]}
);

// onClicked
chrome.pageAction.onClicked.addListener(function(tab){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { pageButtonClicked: "clicked"}, function() {});
    });
});
