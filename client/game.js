
var test='http://localhost:5000'
 var userCount = 2;

  var phase = 0;
   var counter = 0;
   var global={};
   var player={};
   var local=[];
   var roomData={}
   var connected=[]
   
cloak.configure({

  // You'll add stuff here later.
  
   messages: {
    data: function(arg) {
      userCount=arg[0];
	  phase=arg[1]
	  counter=arg[2]
    },
	
	global: function(arg) {
      global=arg
	 
    },
	
	updateSelf: function(arg) {
      player=arg
	 
    },
	localtxt: function(arg) {
      local.push(arg); 
	 
    },
	
	roomStatus: function(arg) {
		
		
			
      roomData.status=arg; 
		
		
	 
    },
	roomSinners: function(arg) {
	
			
      connected=arg; 
		
	},
	
	
	
  },
  //events
   serverEvents: {
    begin: function() {
		  console.log('init');
    cloak.message('init', " ");
	
    }
  }
  
});


//cloak.run(test);

cloak.run(location.protocol + '//' + location.host);
console.log(location.protocol + '//' + location.host)

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var txt = document.getElementById("txtcanvas");
var ctx = txt.getContext("2d");


  context.fillStyle = "#000000";
context.fillRect(0,0,1400,800);

$(document).keypress(function(e) {
	
    if(e.which == 13) {
		
       

//Get
var msg = $('#input').val();

if ( msg.charAt(0)=="/") {
	
	cloak.message('command', msg);
	local.push(msg); 
	
}
 else
{
cloak.message('publicTxt', msg);
local.push("not connected"); 
}
//Set
$('#input').val("");



    }
});

setInterval(function() {
  
  
    ctx.fillStyle = "#c7f2bc";
ctx.fillRect(0,0,1400,800);

    ctx.fillStyle = "#000000";
ctx.fillRect(500,0,400,800);

   ctx.fillStyle = "#000000";
   ctx.font = '21px serif';
	
   cloak.message('checkRoom',"hey" )
   
  if ( player.room=="lobby") {
	  ctx.fillText("/setname [name] to set name",25,50);
	  ctx.fillText("/join [0 / 1] to join either room 0 or 1",25,100)
	  
	  for (i = 0; i < local.length; i++) {
	
	
ctx.fillText('localuser :' +local[i],25,200+25*i);
	
}
  }
  else {
ctx.fillStyle = "#FFFFFF";	
ctx.fillText("Connected Players:",550,50);
	  for (i = 0; i < connected.length; i++) {
	
ctx.fillStyle = "#FFFFFF";	
ctx.fillText(connected[i].name,550,50+25*i+25);
	
}

ctx.fillStyle = "#000000";	

	  
	  
	  if (roomData.status=="starting"|| roomData.status=="running") {
ctx.fillText('Users Connected:' +userCount + ' Phase: '+phase+' Time:'+ (600-counter) , 25, 50);
	  } else {
		  
		  ctx.fillText('Users Connected:' +userCount + " Waiting for more players." , 25, 50);
		  
	  }


for (i = 0; i < global.length; i++) {
	
	if (typeof global[i] == "undefined" ) {
		ctx.fillText("error",25,100+25*i);
	} 
	else 
	{
ctx.fillText(global[i].name +' : '+global[i].arg,25,100+25*i);
	}
}
  }

}, 100);


