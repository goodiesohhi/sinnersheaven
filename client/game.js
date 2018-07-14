
var test='http://localhost:5000'
 var userCount = 2;

  var phase = 0;
   var counter = 0;
   var global={};
   
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
	 
    }
	
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

cloak.message('publicTxt', msg);
//Set
$('#input').val("");



    }
});

setInterval(function() {
  
  
    ctx.fillStyle = "#c7f2bc";
ctx.fillRect(0,0,1400,800);
   ctx.fillStyle = "#000000";
   ctx.font = '21px serif';
  
ctx.fillText('Users Connected:' +userCount + ' Phase: '+phase+' Time:'+ (600-counter) , 25, 50);
for (i = 0; i < global.length; i++) {
	
	if (typeof global[i] == "undefined" ) {
		ctx.fillText("error",25,100+25*i);
	} 
	else 
	{
ctx.fillText(global[i].name +' : '+global[i].arg,25,100+25*i);
	}
}

}, 100);


