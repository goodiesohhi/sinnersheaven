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
		var name= user.name;
      user.getRoom().data.chatLog.push({name,arg}); 
    },
	command: function(arg, user) {
		
		var words = arg.split(" ");
		if (words[0]=="/setname") {
			user.name = words[1];
			user.message('localtxt', "Name SET")
		}
		if (words[0]=="/join"&&user.data.room=="lobby") {
			if(user.name=="Nameless User") { 
			user.message('localtxt', "Please set name first")
			}
			else{
			room[ parseInt(words[1])].addMember(user)
			}
		}
    },
	
	checkRoom: function(arg, user) {
		
		if (user.getRoom().isLobby) {
      user.data.room="lobby";
		} else {
	   user.data.room="room";		
			
		}
		
		cloak.messageAll('updateSelf', user.data);

    },
	
	 init: function(arg, user) {
     user.data.room="lobby";
	 
	  console.log(arg+ 'created');
    },
	
	
	
	
  },
  room: {
	  pulse: function() {
		  console.log(this.data.chatLog)
		  update(this)
		  
	  },
	  
	  
  },
  socketIo: {
		origins:'*:*'
	},
  
   defaultRoomSize: 4,
   autoJoinLobby:true,
   pruneEmptyRooms:null,

   minRoomMembers:null,
  
});




app.use('/static', express.static(__dirname + '/static'));


// Routing

cloak.run();
createroom(0)

createroom(1)


	
	
	


function update(obj) {
	
		
		var data={}
		data[0]=cloak.userCount()
		data[1]=obj.data.phase
		data[2]=obj.data.counter
	obj.messageMembers('data', data );
	 
	 
	obj.messageMembers('global', obj.data.chatLog);
   if(obj.data.phase==0)  {
	   
	   obj.data.counter++;
	   if (obj.data.counter>= 600)  {
		   obj.data.phase=1;
		   obj.data.counter=0;
	   }
   }
	   
   

   

}

setInterval(function() {
	
	console.log(cloak.roomCount()+" rooms running.");
	

}, 2000);