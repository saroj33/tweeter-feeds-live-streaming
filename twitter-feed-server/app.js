var express = require('express')
        , app = express()
        , http = require('http')
        , server = http.createServer(app)
        , Twit = require('twit')
        , nconf = require('nconf')
        , io = require('socket.io').listen(server);

server.listen(3000);

// routing
app.get('/', function (req, res) {
    res.send('no direct access');
});

//gloabal variables creates array per connected client
watchList = ['python', 'java']; //declaring a starting list. empty array is enough actually
oldWatchList = [];
stream = []; //holds the stream variable of each connected users

nconf.file({file: 'config.json'}).env(); //loading the config.json with twitter credentials

const T = new Twit({
    consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
    consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
    access_token: nconf.get('TWITTER_ACCESS_TOKEN'),
    access_token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET'),
});


//when a user is connected
io.sockets.on('connection', function (socket) {
    console.log(`Socket ${socket.id} connected.`);
    //send the socket_id to client immediatley after connection
    io.sockets.to(socket.id).emit('socket_id', socket.id);
    //create default list. associative array of socket id
    
    //*****serving clients with default array when they are connected
    watchList[socket.id] = ['python', 'java'];
    stream[socket.id] = T.stream('statuses/filter', {track: watchList[socket.id]})
    streamerTwitter(io, stream[socket.id], socket.id);
    //********the default feeds per client continues until the client emits a message with new filters*****//
    
    //when client emits a addMessage then feeds based on new filter should be served
    socket.on('addMessage', function (addMessage, sId) {
        console.log(sId);
        if (addMessage.length > 0) {
            oldWatchList[sId] = watchList[sId].join(',');
            if (oldWatchList[sId] !== addMessage.replace(/\s/g, '')) {
                watchList[sId] = addMessage.replace(/\s/g, '').split(',');
                console.log(`old watchlist for user id ${socket.id} = ${oldWatchList[sId]}`);
                console.log(`new watchlist for user id ${socket.id} = ${addMessage}`);
                stream[sId].stop();
                
                //new feed function is wrapped inside the setTimeout because the twit.stop() function doesnot have callback
                setTimeout(function () {
                    stream[sId] = T.stream('statuses/filter', {track: watchList[sId]})
                    streamerTwitter(io, stream[sId], sId);
                }, 3000);
            }
        }


    });
    //delete the stored client values when certain client is  disconnected
    socket.on('disconnect', function () {
        console.log(`Socket ${socket.id} disconnected.`);
        delete watchList[socket.id];
        delete oldWatchList[socket.id];
        stream[socket.id].stop();
    });
});

//function to stream and emitting the feeds based on filter applied before this call
function streamerTwitter(io, stream, socketId) {
    stream.on('tweet', function (tweet) {
        //console.log(tweet);
        var tweetData = {
            text: tweet.text,
            userName: tweet.user.name,
            userImage: tweet.user.profile_image_url,
            created: tweet.user.created_at
        };
        io.sockets.to(socketId).emit('stream', JSON.stringify(tweetData));
    });
}