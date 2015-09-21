//var nicoBaseURL = 'www.nicovideo.jp/watch/'

//console.log("main.js!");

onLoadNicoPlayer(function(np){
    var comes = np.getComments(1000);

    _.chain(comes).first(100).each(function(c){
        console.log(c.vpos + "," + c.message);
    });

});
