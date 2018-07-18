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

app.get('/public/heart0.png', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile(path.join(__dirname, '/public/heart0.png'))
})

app.get('/public/heart1.png', function (req, res) {
  // render/ejs is now easier to use since
  // sendFile has security restrictions on relative pathing
  res.sendFile(path.join(__dirname, '/public/heart1.png'))
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

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
} 

server.listen(PORT, function() {
 
});

function createroom(num) {
room[num]=cloak.createRoom("room"+num);
room[num].data.round=0;
room[num].data.phase=0;
room[num].data.counter=0;
room[num].data.chatLog=[];
room[num].data.battleLog=[];
room[num].data.sinners=[];
room[num].data.sinnersPublic=[];
room[num].data.initialized=false;
room[num].data.startTimer=100;
room[num].data.roomnumber=num;

room[num].data.roster=[];
room[num].data.teams=[];
room[num].data.cleanseTarget = "none";
room[num].data.resolution=[];
room[num].data.match=[];
}


function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}



cloak.configure({
  express: server,
  
  
    messages: {
    publicTxt: function(arg, user) {
		
		var name= user.name;
      user.getRoom().data.chatLog.push({name,arg}); 
	 
    },
	
	 battleTxt: function(arg, user) {
		
		var name= user.name;
		var id=user.id;
		var matchup=[];
	  
	matchup[0] = [user.getRoom().data.sinnersPublic[ user.getRoom().data.match[0][0]],user.getRoom().data.sinnersPublic[ user.getRoom().data.match[0][1]]];
	matchup[1] = [user.getRoom().data.sinnersPublic[ user.getRoom().data.match[1][0]],user.getRoom().data.sinnersPublic[ user.getRoom().data.match[1][1]]];
		
		
		
		if (id==matchup[0][0].id||id==matchup[0][1].id||id==matchup[1][0].id||id==matchup[1][1].id) {
      user.getRoom().data.battleLog.push({name,arg}); 
		}
	 
    },
	
		 resolution: function(arg, user) {
		
		console.log("command recieved");
		var name= user.name;
		var id=user.id;
		var matchup=[];
	    var sinner = user.getRoom().data.sinners.find(x => x.id === user.id );
		
		var arg2 = arg;
		console.log("sinnerid: "+sinner.id);
	    console.log("userid: "+user.id);
	
	
	matchup[0] = [user.getRoom().data.sinnersPublic[ user.getRoom().data.match[0][0]],user.getRoom().data.sinnersPublic[ user.getRoom().data.match[0][1]]];
	matchup[1] = [user.getRoom().data.sinnersPublic[ user.getRoom().data.match[1][0]],user.getRoom().data.sinnersPublic[ user.getRoom().data.match[1][1]]];
		

	
		if (id==matchup[0][0].id||id==matchup[0][1].id) {
			console.log("phase1");
			if (sinner.voted==false) {
					console.log(arg2);
				if (arg2=="1") {
					
						console.log("final");
					sinner.voted=true;
					if (sinner.mate.state=="dead") {
					 user.getRoom().data.resolution[0]==2;
					} else {
      user.getRoom().data.resolution[0]++;
					}
				} else {
					sinner.voted=true;
					
				}
			}
		}
		 
		 if (id==matchup[1][0].id||id==matchup[1][1].id) {
			 	console.log("phase1");
      if (sinner.voted==false) {
		  	console.log(arg2);
    if (arg2=="1") {
			console.log("final");
				console.log(arg2);
					sinner.voted=true;
     if (sinner.mate.state=="dead") {
					 user.getRoom().data.resolution[1]==2;
					} else {
      user.getRoom().data.resolution[1]++;
					}
				} else {
					sinner.voted=true;
					
				}
			}
		}
		
    },
	

	soulSend: function(arg, user) {
		var find = user.getRoom().data.sinners.find(x => x.id === user.id );
		
		if(find.state=="alive") {
		
		var target = find.mate.id;
		var name = user.name;
		var message = {name,arg};
		if (find.mate.state=="alive") {
			if(typeof cloak.getUser(target).message == 'function')  {
       cloak.getUser(target).message("soulcomm",message);
			}
		}
		}
    },
	command: function(arg, user) {
		
		var words = arg.split(" ");
		if (user.getRoom().isLobby) {
		if (words[0]=="/setname") {
			user.name = words[1];
			user.message('localtxt', "Name SET")
		}
		if (words[0]=="/join"&&user.data.room=="lobby") {
			if(user.name=="Nameless User") { 
			user.message('localtxt', "Please set name first")
			}
			else{
				
				if (room[ parseInt(words[1])].data.status!="running") {
				
				
			room[ parseInt(words[1])].addMember(user);
				
			var id = user.id
			var name = user.name
				} else {
					user.message('localtxt', "Game has started. Failed to join")
				}
			}
		}
		} else {
			
			
			if (user.getRoom().data.status=="running"&&user.getRoom().data.phase==1) {
				
			if (words[0]=="/c") {
			
			if (user.getRoom().data.sinners.find(x => x.id === user.id ).voted==false && user.getRoom().data.sinners.find(x => x.id === user.id ).state!="dead") {
				
		
		if (user.getRoom().data.sinnersPublic[words[1]].state=="alive") {
		
			
		var target = user.getRoom().data.sinners.find(x => x.slot === parseInt(words[1]));
	
		target.votes++;
		user.getRoom().data.sinners.find(x => x.id === user.id ).voted=true
		} 
	}
		}
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
	 
	  
    },
	
	
	
	
	
  },
  room: {
	  pulse: function() {

		  update(this)
		  
	  },
	  
	  memberLeaves: function() {
 
		  //this.data.sinners.find(x => x.id === arg.id ).lives= -666;
	  },
	  
	  
  },
  socketIo: {
		origins:'*:*'
	},
  
   defaultRoomSize: 4,
   autoJoinLobby:true,
   pruneEmptyRooms:null,

   minRoomMembers:null,
   reconnectWait:1000,
  
});




app.use('/static', express.static(__dirname + '/static'));


// Routing

cloak.run();
createroom(0)

createroom(1)

createroom(2)

createroom(3)
createroom(4)

createroom(5)

//generic
function messageRole (roleid,message,data,obj) {
	var targets = obj.data.sinners.filter(function(v){return v.role.id==roleid})
	for (i=0;i<targets.length;i++) {
		targetID=targets[i].id;
		if(typeof cloak.getUser(targetID).message == 'function')  {
       cloak.getUser(targetID).message(message,data);
			}
	}
	
}
	
	
	


function update(obj) {
	
	
	
	if (obj.data.status=="running"&&obj.getMembers().length==0)  {
		var number = obj.data.roomnumber
		createroom(number);
		obj.delete()
	}
	//intialized
	if (!obj.data.initialized)
	{
		
		if(obj.getMembers().length % 2  == 0 && obj.getMembers().length >= 4){
			
	     obj.data.status="starting";
		 
		 if (obj.data.startTimer>0) {
			 obj.data.startTimer--;
		 } else {
			 
			 var adding = obj.getMembers(true);
			for (i = 0; i < obj.getMembers().length; i++) {
				var id= adding[i].id
				var name= adding[i].name
			 obj.data.sinners.push({id,name,'slot':i})	
			 obj.data.sinnersPublic.push({id,name,'slot':i})			 			 

			 
			};
			
			for (i = 0; i < obj.data.sinners.length; i++) {
				obj.data.sinners[i].role= rolelist[randint(1,(rolelist.length-1))];
				obj.data.sinners[i].role= rolelist[randint(1,(rolelist.length-1))];
				obj.data.sinners[i].role= rolelist[randint(1,(rolelist.length-1))];
			 	obj.data.sinners[i].votes=0;
			    obj.data.sinners[i].voted=false;
				obj.data.sinners[i].state="alive";
				if (obj.data.sinners[i].role.id==0) {
					obj.data.sinners[i].lives=0;
				} else if (obj.data.sinners[i].role.id==9) {
				 obj.data.sinners[i].lives=9;
				}
				else {
				obj.data.sinners[i].lives=3;
				}
			 
			}
			
			
		
			obj.data.sinners[ randint(0,(obj.data.sinners.length-1))].role=rolelist[0];
			
			var numbers=[]
			for (i = 0; i < obj.data.sinnersPublic.length; i++) {
			
			 numbers.push(obj.data.sinnersPublic[i].slot)
			 
			 
			};
			
			numbers=shuffle(numbers);
			
			
			for (i = 0; i < obj.data.sinnersPublic.length; i++) {
			
			 obj.data.sinnersPublic[i].slot=numbers[i];
			 
			 
			};
			
			for (i = 0; i < obj.data.sinnersPublic.length; i++) {
			
			 obj.data.roster[obj.data.sinnersPublic[i].slot]=obj.data.sinnersPublic[i];
			 
			 
			};
			
			var teamgen=[]
			for (i = 0; i < obj.data.sinnersPublic.length; i++) {
			
			 teamgen.push(obj.data.sinnersPublic[i].slot)
			 
			 
			};
			
			teamgen=shuffle(teamgen);
			for (i = 0; i < teamgen.length; i++) {
		    obj.data.teams[Math.floor(i/2)]=[];
			}
			
			for (i = 0; i < teamgen.length; i++) {
		   
			obj.data.teams[Math.floor(i/2)].push(teamgen[i]);
			
			}
			
		    for (i=0;i<obj.data.teams.length;i++) {
			 
		   obj.data.sinners[obj.data.teams[i][0]].mate=obj.data.sinnersPublic[obj.data.teams[i][1]];
		   obj.data.sinners[obj.data.teams[i][1]].mate=obj.data.sinnersPublic[obj.data.teams[i][0]];
		   }
		
			
			
			 
			 
			 obj.data.status="running";
			 obj.data.initialized=true;
		 }
		 
			
		} else {
			if ( obj.data.startTimer<100) {
				 obj.data.startTimer = obj.data.startTimer +0.25
			}
			obj.data.status="wfp";
		}
		
		
	}
	
	sendStatus=obj.data.status
		obj.messageMembers('roomStatus', sendStatus, "status" );
		
		var data={}
		data[0]= obj.getMembers().length;
		data[1]=obj.data.phase;
		data[2]=obj.data.counter;
		data[3]=obj.data.round;
		
	obj.messageMembers('data', data );
	
	
	
	obj.messageMembers('roomSinners', obj.data.sinnersPublic);
	
	
	 obj.messageMembers('roomMembers', obj.getMembers(true));
	 
	
		obj.messageMembers('timer', obj.data.startTimer);
   
   
   //run 
   if(obj.data.initialized){
	   
	   if (obj.data.phase==2) {
		 
	   obj.messageMembers('global', obj.data.battleLog);
	   } else {
	 obj.messageMembers('global', obj.data.chatLog);
	   }
	   
	  for (i=0;i<obj.data.sinners.length;i++) {
		var user = obj.data.sinners[i];
		var found = obj.data.sinnersPublic.find(x => x.id === user.id );
			var mate= {}
		mate.name= obj.data.sinners[i].mate.name;
		mate.id= obj.data.sinners[i].mate.id;
		mate.state= obj.data.sinners[i].mate.state;
		
		found.state=user.state;
		found.mate=mate;
		found.role=user.role;
		found.votes=user.votes;
		
		var send = {};
		send.role=obj.data.sinners[i].role;
		send.name=obj.data.sinners[i].name;
		send.id=obj.data.sinners[i].id;
		send.votes=obj.data.sinners[i].votes;
		send.state=obj.data.sinners[i].state;
		send.lives=obj.data.sinners[i].lives;
		
	
if(typeof cloak.getUser(found.id).message == 'function') {	

 cloak.getUser(found.id).message('selfSinner', send);
 
  cloak.getUser(found.id).message('mate', mate);
}

	}
		
	
	
	   //phase 0
   if(obj.data.phase==0)  {
	   for (i = 0; i < obj.data.sinners.length; i++) {
				
			 	obj.data.sinners[i].votes=0;
			    obj.data.sinners[i].voted=false;
				
				
			 
			}
			
			obj.data.battleLog=[];
			
			
			
			
			
			
	   
	   obj.data.counter++;
	   if (obj.data.counter>= 600)  {
		   
		   obj.data.match=[];
		   var hat=obj.data.teams;
		   var pickone=randint(0,(obj.data.teams.length-1));
		   var picktwo;
		   
		   
		   var sentinel=false;
		   while (!sentinel) {
			   picktwo = randint(0,(obj.data.teams.length-1));
			   if (picktwo == pickone) {
				   sentinel=false;
			   } else {
				   sentinel=true;
			   }
		   }
		   obj.data.match[0]=  hat[pickone];
		   obj.data.match[1]=  hat[picktwo];
		   
		   
	
			   
		   
		    obj.data.counter=0;
		   obj.data.phase=1;
		  
	   
   }
   }
   
    if(obj.data.phase==1)  {
		
		var oracleData = [];
		
		oracleData[0] = [obj.data.sinnersPublic[ obj.data.match[0][0]],obj.data.sinnersPublic[ obj.data.match[0][1]]];
	    oracleData[1] = [obj.data.sinnersPublic[ obj.data.match[1][0]],obj.data.sinnersPublic[ obj.data.match[1][1]]];
		
		
		messageRole(1,"oracleMatchup",oracleData,obj);
		
	   if(obj.data.round==0) {
		   //skip cleansing
		   	obj.data.resolution[0]=0;
		obj.data.resolution[1]=0;
		   obj.data.phase=2;
	   } else {
		   
		   if (obj.data.cleanseTarget=="none") {
		for (i=0;i<obj.data.sinners.length;i++) {
			if(obj.data.sinners[i].votes>Math.floor(obj.data.sinners.filter(function(v){return v.state=="alive"}).length/2)) {
				
				obj.data.cleanseTarget = obj.data.sinners[i];
				
			}
			
		}  
		   }
		  
		   
	   obj.data.counter++;
	   if (obj.data.counter>= 600)  {
		         if (obj.data.cleanseTarget !="none") {
		
			obj.data.cleanseTarget.state="dead";
			obj.data.cleanseTarget ="none";
		}  
		  for (i = 0; i < obj.data.sinners.length; i++) {
				
			 	obj.data.sinners[i].votes=0;
			    obj.data.sinners[i].voted=false;
				
				
			 
			}
			
		obj.data.resolution[0]=0;
		obj.data.resolution[1]=0;
		  obj.data.counter=0;
		   obj.data.phase=2;
		 
		   
	   } else {
		   
		
		
		   }
		  
		   
	   }
   }
   
   if(obj.data.phase==2) {
	   var matchdata=[];
	   	matchdata[0] = [obj.data.sinners[ obj.data.match[0][0]],obj.data.sinners[ obj.data.match[0][1]]];
	    matchdata[1] = [obj.data.sinners[ obj.data.match[1][0]],obj.data.sinners[ obj.data.match[1][1]]];
		
		
		obj.messageMembers('matchup', matchdata );
		
	    obj.data.counter++;
		
	      if (obj.data.counter>= 600)  {
			  
			  if( obj.data.resolution[0]>=1 ) {
				  if (matchdata[1][0].lives>0) {
				  matchdata[1][0].lives--;
				  }
				  if (matchdata[1][1].lives>0) {
				  matchdata[1][1].lives--;	
				  }				  
				 }
				 
				   if( obj.data.resolution[1]>=1 ) {
					   if (matchdata[0][0].lives>0) {
				  matchdata[0][0].lives--;
					   }
					   if (matchdata[0][1].lives>0) {
				  matchdata[0][1].lives--;	
					   }
				 }
				 
				 
				 for (i=0;i<obj.data.sinners.length;i++) {
					 if (obj.data.sinners[i].lives <= 0 ) {
						 
						 if(obj.data.sinners[i].role.id!=0) {
						 
						 obj.data.sinners[i].state="dead";
						 }
						 
					 }
					 
					 
				 }
				 
				
			  
		      obj.data.round++;
			  obj.data.counter=0;
	   obj.data.phase=0;
		   
	   } else {
		   
		console.log(obj.data.resolution);
		
		   }
	 
   }
	}
	   
   
   

   

}

setInterval(function() {
	

	

}, 2000);



var roles={}
//Antichrist
roles.ac={}
roles.ac.id=0;
roles.ac.name="the Antichrist"
roles.ac.immunity=2
roles.ac.desc =  "placeholder.lore"
//Oracle
roles.oc={}
roles.oc.id=1;
roles.oc.name="the Oracle"
roles.oc.immunity=0
roles.oc.desc = "Plagued by visions uninvited, you saw doom but were powerless against it. Your curse allows you to see conflict before it happens."

//changeling
roles.cg={}
roles.cg.id=2;
roles.cg.name="the Changeling"
roles.cg.immunity=0
roles.cg.desc =  "placeholder.lore"
//Medium
roles.me={}
roles.me.id=3;
roles.me.name="the Medium"
roles.me.immunity=0
roles.me.desc =  "placeholder.lore"
//Detonator
roles.dt={}
roles.dt.id=4;
roles.dt.name="the Detonator"
roles.dt.immunity=0
roles.dt.desc =  "placeholder.lore"

//Lunatic
roles.lu={}
roles.lu.id=5;
roles.lu.name="the Lunatic"
roles.lu.immunity=0
roles.lu.desc =  "placeholder.lore"

//Purger
roles.pg={}
roles.pg.id=6;
roles.pg.name="the Purger"
roles.pg.immunity=0
roles.pg.desc =  "placeholder.lore"

//Judicator

roles.jd={}
roles.jd.id=7;
roles.jd.name="the Judicator"
roles.jd.immunity=0
roles.jd.desc =  "placeholder.lore"




//Traveler

roles.tv={}
roles.tv.id=8;
roles.tv.name="the Traveler"
roles.tv.immunity=0
roles.tv.desc =  "placeholder.lore"


//Cat

roles.cat={}
roles.cat.id=9;
roles.cat.name="a Cat"
roles.cat.immunity=0
roles.cat.desc =  "A Cat. Has 9 lives. (Obviously.)"


var rolelist=[]
rolelist[0]=roles.ac;
rolelist[1]=roles.oc;
rolelist[2]=roles.cg;
rolelist[3]=roles.me;
rolelist[4]=roles.dt;
rolelist[5]=roles.lu;
rolelist[6]=roles.pg;
rolelist[7]=roles.jd;
rolelist[8]=roles.tv;
rolelist[9]=roles.cat;





