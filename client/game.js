
var test='http://localhost:5000'
 var userCount = 2;

  var phase = 0;
   var counter = 0;
   var round =0;
   var global={};
   var player={};
   var local=[];
   var players=[];
   var roomData={}
   var connected=[]
   var startTimer=0;
   var theSinner={};
   var screen=0;
   var chatScreen=0;
   var soulcomm=[];
   var chatColor="#c7f2bc";
   var chatFontColor="#000000";
   var matchup=[]
   
   var interval=0;
   
  
   
      function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
      }
      
      
  
  //images
  var heart0 = new Image();
  heart0.src = "/public/heart0.png";
  
  var heart1 = new Image();
  heart1.src = "/public/heart1.png";

cloak.configure({

  // You'll add stuff here later.
  
   messages: {
    data: function(arg) {
      userCount=arg[0];
	  phase=arg[1];
	  counter=arg[2];
	  round=arg[3];
    },
	
	global: function(arg) {
      global=arg
	 
    },
	soulcomm: function(arg) {
      soulcomm.push(arg);
	 
    },
	selfSinner: function(arg) {
      theSinner=arg
	  
	 
    },
	
	oracleMatchup: function(arg) {
      matchup=arg
	  
	 
    },
	
	matchup: function(arg) {
      matchup=arg
	  
	 
    },
	
	
	mate: function(arg) {
      theSinner.mate=arg
	  
	 
    },
	
	
	updateSelf: function(arg) {
      player=arg
	 
    },
	
	timer: function(arg) {
      startTimer=arg
	 
    },
	localtxt: function(arg) {
      local.push(arg); 
	 
    },
	
	roomStatus: function(arg) {
		
		
			
      roomData.status=arg; 
		
		
	 
    },
	roomSinners: function(arg) {
	
			
      players=arg; 
		
	},
	
	roomMembers: function(arg) {
	
			
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
if(chatScreen==0) {	
if(theSinner.state!="dead") {
	if (phase==2) {
	cloak.message('battleTxt', msg);
	} else {
cloak.message('publicTxt', msg);
	}
}
}
if(chatScreen==1) {
	if(theSinner.state!="dead") {
	var name = theSinner.name
soulcomm.push({name,'arg':msg});
cloak.message('soulSend', msg);
	}
	
}


}
//Set
$('#input').val("");



    }
});

//buttons
var button1 = {
     x:900,
    y:550,
    width:200,
    height:100,
	text:"Soul Communication",
	font:"22px serif",
	fontcolor:"#000000",
	color:"#FFFFFF"
	
};

var resButton1 = {
     x:900,
    y:550,
    width:200,
    height:100,
	text:"CRUELTY",
	font:"22px serif",
	fontcolor:"#FFFFFF",
	color:"#FF0000"
	
};

var resButton0 = {
     x:900,
    y:450,
    width:200,
    height:100,
	text:"MERCY",
	font:"22px serif",
	fontcolor:"#FFFFFF",
	color:"#00FF00"
	
};

function drawButton(btn) {
context.fillStyle = btn.color;
	context.fillRect(btn.x,btn.y,btn.width,btn.height);
	context.fillStyle = btn.fontcolor;
	context.font = btn.font;
	context.fillText(btn.text,btn.x+10,btn.y+50);
	

	}

setInterval(function() {
  //main
  context.clearRect(0, 0, canvas.width, canvas.height);
  ctx.clearRect(0, 0, txt.width, txt.height);
  
  
  
  if (theSinner.state!="dead") {
  context.fillStyle = "#000000";
context.fillRect(0,0,1400,1000);
  } else {
 context.fillStyle = "#FF0000";
context.fillRect(0,0,1400,1000);
  }
  
  //datasheet
if(typeof theSinner.role != 'undefined') {
	
  context.font = '30px serif';
      context.fillStyle = "#e5dc99";
  context.fillRect(600,0,650,300);
     context.fillStyle = "#000000";
	 
  context.fillText( theSinner.name + " " + theSinner.role.name,650,50);
 //  context.fillText( "name the role",650,50);
 
 
 if (theSinner.lives>=1) {
 for (i=0;i<theSinner.lives;i++) {
	 
	 if (Math.floor(interval)%2==0) {
	 context.drawImage(heart0, 645+50*i, 60);
	 } else {
     context.drawImage(heart1, 645+50*i, 60); 
	 }
	 
 }
 }
 

context.font = '20px serif';
 //var text= "Plagued by visions uninvited, you saw doom but were powerless against it. Your curse allows you to see conflict before it happens."
  wrapText(context, theSinner.role.desc , 625, 175, 550, 25);
  
}
  

   context.fillStyle = "#FFFFFF";
   context.font = '32px serif';
   
    if ( roomData.status=="running") {
		
		if (phase==0) {
			if(theSinner.state=="dead") {
context.fillText("You are DECEASED. Please await JUDGEMENT.",25,50);
			} else {
				
				if (round==0) {
  context.fillText("You are "+theSinner.role.name,25,50);
				}
  
			}
  
  
   } else if (phase==1) {
	   	if(theSinner.state=="dead") {
context.fillText("You are DECEASED. Please await JUDGEMENT.",25,50);
			} else {
	   context.fillText("Time for the Cleansing....",25,50);
			}
   }
   
   else if (phase==2) {
	     	if(theSinner.state=="dead") {
      context.fillText("You are DECEASED. Please await JUDGEMENT.",25,50);
			} else {
	  context.fillText("The Tribulations of Mortal Conflict..",25,50);
			}
   }
   
   context.font = '24px serif';
   if (phase==0&&round==0) {
    context.fillText("You are bound to "+theSinner.mate.name+" by the strings of fate",25,600);
   } else if (phase==1) {
	   if (theSinner.role.id==1) {
		   
		   
	   context.fillText("DESTINY calls! "+ matchup[0][0].name+ " and " + matchup[0][1].name + " will fight "+ matchup[1][0].name+ " and "+matchup[1][1].name + "tonight" ,25,600);
	   } else {
	   
	    context.fillText("/c [sinnerslotnumber] to condemn a sinner." ,25,600);
	   }
   }
   else if (phase==2) {
if (theSinner.id==matchup[0][0].id||theSinner.id==matchup[0][1].id||theSinner.id==matchup[1][0].id||theSinner.id==matchup[1][1].id) {
              context.fillText("You have been selected. How unlucky. Make your decision only after careful consideration." ,25,600);
		} else {
			
			 context.fillText("Who will live? Who will DIE? How exciting!" ,25,600);
		}
   }
	
	if (phase==2) {
		if (theSinner.id==matchup[0][0].id||theSinner.id==matchup[0][1].id||theSinner.id==matchup[1][0].id||theSinner.id==matchup[1][1].id) {
	drawButton(resButton0);
	drawButton(resButton1);	
		}
	} else {
	drawButton(button1);
	}
	
	}
	 
   
  //chatbox
    ctx.fillStyle = chatColor;
ctx.fillRect(0,0,1400,900);

    ctx.fillStyle = "#000000";
ctx.fillRect(500,0,400,900);

   ctx.fillStyle = "#000000";
   ctx.font = '21px serif';
	
   cloak.message('checkRoom',"hey" )
   
  if ( player.room=="lobby") {
	  ctx.fillText("/setname [name] to set name",25,50);
	  ctx.fillText("/join [0 - 5] to join room 0 to 5",25,100)
	  
	  for (i = 0; i < local.length; i++) {
	
	
ctx.fillText('localuser :' +local[i],25,200+25*i);
	
}
  }
  else {
ctx.fillStyle = "#FFFFFF";	
if ( roomData.status=="running") { 


ctx.fillText("The Sinners:",550,50);
//roster
	  for (i = 0; i < players.length; i++) {
	
ctx.fillStyle = "#FFFFFF";	
if (players[i].state=="dead") {
	if (phase==1) {
		if (theSinner.state!="dead") {
ctx.fillText("["+i+"]: "+players[i].name+" X "+players[i].votes,550,50+25*i+25);
		} else {
ctx.fillText("["+i+"]: "+players[i].name,550,50+25*i+25);
		}
	} 
	
	if (phase!=1) {
ctx.fillText("["+i+"]: "+players[i].name,550,50+25*i+25);
	}

var text = ctx.measureText("["+i+"]: "+players[i].name);
ctx.fillRect(550, 50+25*i+(Math.floor(20)), text.width, 2);
} else {
	
	if (phase==1) {
		if (theSinner.state!="dead") {
ctx.fillText("["+i+"]: "+players[i].name+" X "+players[i].votes,550,50+25*i+25);
		} else {
ctx.fillText("["+i+"]: "+players[i].name,550,50+25*i+25);
		}
	} 
	
	if (phase!=1) {
ctx.fillText("["+i+"]: "+players[i].name,550,50+25*i+25);
	}
	
}
}
}
else
{
ctx.fillText("Connected Players:",550,50);

	  for (i = 0; i < connected.length; i++) {
	
ctx.fillStyle = "#FFFFFF";	
ctx.fillText(connected[i].name,550,50+25*i+25);
	
}

}
ctx.fillStyle = "#000000";	

	  if(phase==2) {
		  chatScreen=0;
	  }
	  
	  if ( roomData.status=="running") {
		  
		  ctx.fillStyle = chatFontColor;	
ctx.fillText('Round: '+ round + ' Phase: '+phase+' Time:'+ (600-counter) , 25, 50);
	  } else if  (roomData.status=="starting") {
		  ctx.fillText('Starting in: '+ startTimer , 25, 50);
	  
		  
	  }
	  else {
		  ctx.fillStyle = "#000000";	
		  ctx.fillText('Users Connected:' +userCount + " Waiting for at least " + (8-userCount)+ " more players." , 25, 50);
		  ctx.fillText('The game will only start when the player count is even.', 25, 75);
		  
		  
	  }

if(chatScreen==0){
for (i = 0; i < global.length; i++) {
	 ctx.fillStyle = chatFontColor;
ctx.fillText(global[i].name +' : '+global[i].arg,25,100+25*i);
	
} 
}
else {
//soulcomm	
	for (i = 0; i < soulcomm.length; i++) {
	
	 ctx.fillStyle = chatFontColor;
ctx.fillText(soulcomm[i].name +' : '+soulcomm[i].arg,25,100+25*i);
	
} 
	
}

  }
  
  
  interval=interval+0.1;
  
  if (interval>= 100 ) {
	  interval = 0;
	  
  }
  

}, 100);


 function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}



canvas.addEventListener('click', function(evt) {
    var mousePos = getMousePos(canvas, evt);

    if (isInside(mousePos,button1) && roomData.status=="running" && phase!=2) {
        
		if(chatScreen==0) {
			chatScreen=1;
			button1.text="Public Chat";
			chatColor="#5e0303"
			chatFontColor="#FFFFFF"
			button1.font="28px serif"
			
			
		} else {
			chatScreen=0;
			button1.font="22px serif"
			button1.text="Soul Communication"
			chatColor="#c7f2bc"
			chatFontColor = "#000000"
		}
    }
	
	   if (isInside(mousePos,resButton0) && roomData.status=="running") {
        if(phase==2) {
		
		
			 cloak.message('resolution', "0");
			
		} 
    }
	
	 if (isInside(mousePos,resButton1) && roomData.status=="running") {
        if(phase==2) {
		
		
			 cloak.message('resolution', "1");
			
		} 
    }
	
}, false);


