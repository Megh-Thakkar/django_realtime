var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');

var cookie_reader = require('cookie');
var querystring = require('querystring');

http.listen(4000, function(){
  console.log('listening on *:4000');
});
var redis = require('redis');
var sub = redis.createClient({detect_buffers: true});
 
//Subscribe to the Redis chat channel
// sub.subscribe('chat');
 
//Configure socket.io to store cookie set by Django
// io.configure(function(){
//     io.set('authorization', function(data, accept){
//         if(data.headers.cookie){
//             data.cookie = cookie_reader.parse(data.headers.cookie);
//             return accept(null, true);
//         }
//         return accept('error', false);
//     });
//     io.set('log level', 1);
// });

// io.use(function(socket, next) {
//     var handshake = socket.request;

//     if (!handshake) {
//         return next(new Error('[[error:not-authorized]]'));
//     }

//     cookieParser(handshake, {}, function(err) {
//         if (err) {
//             return next(err);
//         }

//         var sessionID = handshake.signedCookies['express.sid'];

//         db.sessionStore.get(sessionID, function(err, sessionData) {
//             if (err) {
//                 return next(err);
//             }
//             console.log(sessionData);

//             next();
//         });
//     });
// }); 

io.on('connection', function (socket) {
    console.log('connected\n');
    //Grab message from Redis and send to client
    // sub.on('message', function(channel, message){
    //     socket.emit('message',{'message':message});
        
    // });
    
    //Client is sending message through socket.io
    socket.on('send_message', function (message) {
        // console.log(socket.request.headers);
        // console.log(12);
        if (message.secret == 'qwertyuiop'){

        message.secret1 = 'asdfghjkl'

        message.id = socket.id
        var options = {
            url:'http://localhost:8000/node_api/',
            form:message,
            // host: 'localhost',
            // port: 3000,
            // path: '/node_api',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        //Send message to Django server
        request(options, function(err, res, body){
            if (!err && res.statusCode == 200) {
                // Print out the response body
                // io.emit('send_message_indi', data)
                socket.emit('message', body)
                sub.get(socket.id,function(error, reply){
                    // console.log(typeof(reply));
            console.log(JSON.parse(reply));
        }) ;
            }
            // console.log(body);
        });
        // var req = http.get(options, function(res){
        //     res.setEncoding('utf8');
            
        //     //Print out error message
        //     res.on('data', function(message){
        //         if(message != 'Everything worked :)'){
        //             console.log('Message: ' + message);
        //         }
        //     });
        // });
        
        // req.write(values);
        // req.end();
    }
    });
});