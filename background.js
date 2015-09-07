var prefixURL='www.nicovideo.jp/watch/'
function flapiURL(id){
	return "http://flapi.nicovideo.jp/api/getflv/"+id
}
function makeMesURL(url, tid, res_from){
	return url+"thread?version=20090904&thread="+tid+"&res_from=-"+res_from
}
var defaultResFrom = 1000


chrome.webNavigation.onCommitted.addListener(function(e){
        chrome.pageAction.show(e.tabId)
        var idx = e.url.indexOf(prefixURL)
        var videoId = e.url.substring(idx+prefixURL.length)
        vis(videoId)
}, {url: [{urlContains: prefixURL}]})


function vis(vid){
        console.log(vid)
        getFromURL(flapiURL(vid), function(str){
        	var sp = str.split("&")
        	var tid = 0
        	var mesURL = ""
        	for(var i=0; i<sp.length; i++){
        		var sp2 = sp[i].split("=")
        		if(sp2[0] === "thread_id"){
        			tid = sp2[1]
        		}else if(sp2[0] === "ms"){
        			mesURL = sp2[1]
        		}
        	}
        	console.log(tid+", "+ mesURL)
        
        	getFromURL(makeMesURL(mesURL, tid, 1000), function(m){
        		console.log(m)
        	})
        })
}

//function manageCookie(){
//        chrome.cookies.get({"url":"http://nicovideo.jp", "name": "user_session"}, function(c){
//                console.log("cookie!! : "+c.name+ "," + c.value )
//        })
//}


function getFromURL(url, callback){
        console.log(url)
        var request = new XMLHttpRequest()
        console.log(request)
        request.open("GET", url, true)
        request.onload = function(e){
                if(request.readyState === 4){
                        if(request.status === 200){
                                callback(unescape(request.responseText))
                        }else{
                                console.error(request.statusText)
                        }
                }
        }
        request.send()
}


//manageCookie()

