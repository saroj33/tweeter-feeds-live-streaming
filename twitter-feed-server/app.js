var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  ,Twit = require('twit')
  ,nconf = require('nconf')
  , io = require('socket.io').listen(server);

server.listen(3000);

// routing
app.get('/', function (req, res) {
res.send('no direct access');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});


watchList = ['angular7','java','react'];
nconf.file({ file: 'config.json' }).env();
 const T = new Twit({
  consumer_key: nconf.get('TWITTER_CONSUMER_KEY'),
  consumer_secret: nconf.get('TWITTER_CONSUMER_SECRET'),
  access_token: nconf.get('TWITTER_ACCESS_TOKEN'),
  access_token_secret: nconf.get('TWITTER_ACCESS_TOKEN_SECRET'),
});

io.sockets.on('connection', function (socket) {
  console.log('Connected');
var stream = T.stream('statuses/filter', { track: watchList })
streamerTwitter(io,stream);
//receive the sockets add message
socket.on('addMessage', function (addMessage) {
    //console.log(addMessage);
    if(addMessage.length>0){
      var oldWatchList=watchList;
          watchList=addMessage.split(',');
          console.log(oldWatchList);
          console.log(watchList);
          stream.stop();
          
          stream = T.stream('statuses/filter', { track: watchList })
          streamerTwitter(io,stream);
 
    }
 });
 
    
 });

function streamerTwitter(io,stream){
    stream.on('tweet', function (tweet) {
    //console.log(tweet);
    var tweetData={ 
                    text:tweet.text, 
                    userName:tweet.user.name, 
                    userImage:tweet.user.profile_image_url, 
                    created:tweet.user.created_at
                  };
    io.sockets.emit('stream',JSON.stringify(tweetData));


  }); 
}