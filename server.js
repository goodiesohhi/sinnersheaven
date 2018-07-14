// Dependencies
var express = require('express');

var path = require('path');

var room={}
const PORT = process.env.PORT || 5000;
var app = express();
var server = require('http').createServer(app)
var cloak = require('cloak');
var staticPath = path.resolve(__dirname, '/client');
//app.use(express.static(staticPath));

app.get('/', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile(path.join(__dirname, 'index.html'))
})


app.get('/client/game.js', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile(path.join(__dirname, '/client/game.js'))
})

app.get('/client/lib/underscore-min.js', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile(path.join(__dirname, '/client/lib/underscore-min.js'))
})
app.get('/client/lib/socket.io.min.js', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile(path.join(__dirname, '/client/lib/socket.io.min.js'))
})
app.get('/client/lib/cloak-client.min.js', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile(path.join(__dirname, '/client/lib/cloak-client.min.js'))
})

app.get('/client/lib/jquery-3.3.1.min.js', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile(path.join(__dirname, '/client/lib/jquery-3.3.1.min.js'))
})


server.listen(PORT, function() {
  console.log('listening');
});

function createroom(num) {
room[num]=cloak.createRoom("room"+num);
room[num].data.round=0;
room[num].data.phase=0;
room[num].data.counter=0;
room[num].data.chatLog=[]
}





cloak.configure({
  express: server,
  
  
    messages: {
    publicTxt: function(arg, user) {
		console.log(arg);
		var name= user.id;
      user.getRoom().data.chatLog.push({name,arg}); 
    },
	
	 init: function(arg, user) {
     user.data={};
	 room[0].addMember(user)
	  console.log(arg+ 'created');
    },
	
	
  },
  socketIo: {
		origins:'*:*'
	},
  
   defaultRoomSize: 4,
   autoJoinLobby:false,
   pruneEmptyRooms:10000,

   minRoomMembers:1,
  
});




app.use('/static', express.static(__dirname + '/static'));


// Routing

cloak.run();
createroom(0)

createroom(1)




function update() {
	for (i = 0; i < cloak.roomCount(); i++) {
		
		var data={}
		data[0]=cloak.userCount()
		data[1]=room[i].data.phase
		data[2]=room[i].data.counter
	 cloak.messageAll('data', data );
	 cloak.messageAll('global', room[i].data.chatLog );
   if(room[i].data.phase==0)  {
	   
	   room[i].data.counter++;
	   if (room[i].data.counter>= 600)  {
		   room[i].data.phase=1;
		   room[i].data.counter=0;
	   }
   }
	   
   

   }

}

setInterval(function() {

 console.log(cloak.roomCount()+ " rooms.");
 console.log("Phase: "+room[0].data.phase);
 console.log("Time: "+room[0].data.counter);
 console.log(room[0].getMembers(true));
  console.log(room[0].data.chatLog);
 
 update()
}, 100);