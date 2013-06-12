/**
 * VARIABLES GLOBALES
 */
var canvas;
var ctx;
var black = "rgb(0,0,0)";
var red = "rgb(255,0,0)";
var green = "rgb(0,255,0)";
var blue = "rgb(0,0,255)";
var yellow = "rgb(255,255,0)";
var white = "rgb(255,255,255)";
var N = 15;// scene matrix dimension(15x15)
var CN = 6;// camps dimension
var HW; // height or width of a cell
var C; // scene center
var home_coords = new Object();
var GREEN_CAMP_CENTER = new Object();
var YELLOW_CAMP_CENTER = new Object();
var RED_CAMP_CENTER = new Object();
var BLUE_CAMP_CENTER = new Object();
var canvas_width;
var PLAYABLE_CELLS = new Array;
var GREEN_ENTRY_CENTER = new Object();
var YELLOW_ENTRY_CENTER = new Object();
var RED_ENTRY_CENTER = new Object();
var BLUE_ENTRY_CENTER = new Object();

var GREEN_CARPET_START_POINT = new Object();
var YELLOW_CARPET_START_POINT = new Object();
var RED_CARPET_START_POINT = new Object();
var BLUE_CARPET_START_POINT = new Object();

var PAWN_RADIUS;
var TARGET_PAWN = undefined;
var PAWNS = new Array;
//PAWNS.green = GREEN_PAWNS;
var PLAYER_TURN = "green"; //Defines the current player


function Coordinates(X,Y){
	this.X = X;
	this.Y = Y;
}

function Pawn(color,coords){
	this.color    = color;
	this.coords = coords;
}
//clear Scene
function clear(ctx) {	
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height); 
}

//draw Pawn
function drawPawn(pawn){
	ctx.save();
	ctx.beginPath();
	
//	 // create radial gradient
//    var grd = ctx.createRadialGradient(coords.X, coords.X, HW/2, coords.X, coords.X, HW/3);
//    // light blue
//    grd.addColorStop(0, color);
//    // dark blue
//    grd.addColorStop(1, color);
    
	ctx.fillStyle = pawn.color;
	//ctx.moveTo(coords.X, coords.Y);
    ctx.lineWidth = 2;
	ctx.arc(pawn.coords.X, pawn.coords.Y, PAWN_RADIUS, 0, 2*Math.PI, false);
    
    
    ctx.shadowColor = black;
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fill();
    
    //ctx.strokeStyle = "black";
    //ctx.stroke();
    ctx.restore();
	
}

// Draw triangle
// coords: array((x1,y1), (x2,y2))
function drawTriangle(color, coords) {
	// Filled triangle
	ctx.beginPath();
	ctx.fillStyle = color;
	ctx.moveTo(C, C);
	ctx.lineTo(coords.x1, coords.y1);
	ctx.lineTo(coords.x2, coords.y2);
	ctx.fill();

}

// Draw carpet
function drawCarpet(carpetStartPoint, campColor) {
	ctx.beginPath();
	ctx.fillStyle = campColor;
	ctx.fillRect(carpetStartPoint.X, carpetStartPoint.Y, carpetStartPoint.W,
			carpetStartPoint.H);
}

// Draw ENTRY
function drawEntry(entryCenter, campColor) {
	ctx.beginPath();
	ctx.fillStyle = campColor;
	ctx.fillRect(entryCenter.X - 0.5 * HW, entryCenter.Y - 0.5 * HW, HW, HW);
}

// Draw home
function drawHome() {
	// draw green triangle
	drawTriangle(green, home_coords.green);

	// draw blue triangle
	drawTriangle(blue, home_coords.blue);

	// draw red triangle
	drawTriangle(red, home_coords.red);

	// draw yellow triangle
	drawTriangle(yellow, home_coords.yellow);

}

// drawCamp
function drawCamp(campCenter, campColor) {
	var baseHW = 0.5 * CN * HW;// from camp center
	var base_whiteHW = 2 * baseHW / 3;
	var base_tokenHW = 1.5 * HW;

	// Camp base color
	ctx.beginPath();
	ctx.fillStyle = campColor;
	ctx.moveTo(campCenter.X - baseHW, campCenter.Y + baseHW);
	ctx.lineTo(campCenter.X + baseHW, campCenter.Y + baseHW);
	ctx.lineTo(campCenter.X + baseHW, campCenter.Y - baseHW);
	ctx.lineTo(campCenter.X - baseHW, campCenter.Y - baseHW);
	ctx.fill();

	// camp white spaces
	ctx.beginPath();
	ctx.fillStyle = white;
	ctx.moveTo(campCenter.X - base_whiteHW, campCenter.Y + base_whiteHW);
	ctx.lineTo(campCenter.X + base_whiteHW, campCenter.Y + base_whiteHW);
	ctx.lineTo(campCenter.X + base_whiteHW, campCenter.Y - base_whiteHW);
	ctx.lineTo(campCenter.X - base_whiteHW, campCenter.Y - base_whiteHW);
	ctx.fill();

	// draw token's place
	ctx.beginPath();
	ctx.fillStyle = campColor;
	ctx.fillRect(campCenter.X - base_tokenHW, campCenter.Y + base_tokenHW - HW,
			HW, HW);
	ctx.fillRect(campCenter.X + base_tokenHW - HW, campCenter.Y + base_tokenHW
			- HW, HW, HW);
	ctx.fillRect(campCenter.X + base_tokenHW - HW, campCenter.Y - base_tokenHW,
			HW, HW);
	ctx.fillRect(campCenter.X - base_tokenHW, campCenter.Y - base_tokenHW, HW,
			HW);
	
	//Create Pawns
	//top-left
	PAWNS.push(new Pawn(campColor, new Coordinates(campCenter.X - HW, campCenter.Y - HW)));	
	//top-right
	PAWNS.push(new Pawn(campColor, new Coordinates(campCenter.X + HW, campCenter.Y - HW)));
	//bottom-right
	PAWNS.push(new Pawn(campColor, new Coordinates(campCenter.X - HW, campCenter.Y + HW)));
	//bottom-left
	PAWNS.push(new Pawn(campColor, new Coordinates(campCenter.X + HW, campCenter.Y + HW)));
}

// draw all bases or camps
function drawAllBases() {

	// draw green camp
	drawCamp(GREEN_CAMP_CENTER, green);
	drawEntry(GREEN_ENTRY_CENTER, green);
	drawCarpet(GREEN_CARPET_START_POINT, green);

	// draw red camp
	drawCamp(RED_CAMP_CENTER, red);
	drawEntry(RED_ENTRY_CENTER, red);
	drawCarpet(RED_CARPET_START_POINT, red);

	// draw blue camp
	drawCamp(BLUE_CAMP_CENTER, blue);
	drawEntry(BLUE_ENTRY_CENTER, blue);
	drawCarpet(BLUE_CARPET_START_POINT, blue);

	// draw yellow camp
	drawCamp(YELLOW_CAMP_CENTER, yellow);
	drawEntry(YELLOW_ENTRY_CENTER, yellow);
	drawCarpet(YELLOW_CARPET_START_POINT, yellow);
}

function drawGrid(){
	for ( var i = 0; i < 15; i++) {
		for ( var j = 0; j < 15; j++) {
			if ((((j <= 5 || j >= 9) && (i > 5 && i < 9)) || ((i <= 5 || i >= 9) && (j > 5 && j < 9)))) {
				ctx.strokeStyle = black;
				ctx.lineWidth = 0.1;
				ctx.strokeRect(i * HW, j * HW, HW, HW);
			}

		}

	}
}

function drawAllPawns(){
	for(var i=0; i<16;i++){
		drawPawn(PAWNS[i]);
	}
}

function drawScene() {
	// draw home
	drawHome();
	
	// draw all cells of # colors
	drawAllBases();
	
	// Draw black grid
	drawGrid();
}

/**
 * Initialisation du game
 */
function init() {
	canvas = document.getElementById('scene');
	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
		canvas_width = canvas.width;
		HW = canvas_width / N;
		PAWN_RADIUS = HW/2 - 2;
		C = 0.5 * canvas_width;
		var camp_center = 0.5 * CN * HW;

		// Get each camp center coords
		GREEN_CAMP_CENTER.X = camp_center;
		GREEN_CAMP_CENTER.Y = canvas_width - camp_center;
		YELLOW_CAMP_CENTER.X = canvas_width - camp_center;
		YELLOW_CAMP_CENTER.Y = canvas_width - camp_center;
		RED_CAMP_CENTER.X = camp_center;
		RED_CAMP_CENTER.Y = camp_center;
		BLUE_CAMP_CENTER.X = canvas_width - camp_center;
		BLUE_CAMP_CENTER.Y = camp_center;

		// Get each camp entry center coords
		// green
		GREEN_ENTRY_CENTER.X = GREEN_CAMP_CENTER.X + 3.5 * HW;
		GREEN_ENTRY_CENTER.Y = GREEN_CAMP_CENTER.Y + 1.5 * HW;
		// yellow
		YELLOW_ENTRY_CENTER.X = YELLOW_CAMP_CENTER.X + 1.5 * HW;
		YELLOW_ENTRY_CENTER.Y = YELLOW_CAMP_CENTER.Y - 3.5 * HW;
		// red
		RED_ENTRY_CENTER.X = RED_CAMP_CENTER.X - 1.5 * HW;
		RED_ENTRY_CENTER.Y = RED_CAMP_CENTER.Y + 3.5 * HW;
		// blue
		BLUE_ENTRY_CENTER.X = BLUE_CAMP_CENTER.X - 3.5 * HW;
		BLUE_ENTRY_CENTER.Y = BLUE_CAMP_CENTER.Y - 1.5 * HW;

		// Get each camp carpet start point coords
		// green
		GREEN_CARPET_START_POINT.X = GREEN_CAMP_CENTER.X + 4 * HW;
		GREEN_CARPET_START_POINT.Y = GREEN_CAMP_CENTER.Y - 3 * HW;
		GREEN_CARPET_START_POINT.W = HW;
		GREEN_CARPET_START_POINT.H = 5 * HW;
		// yellow
		YELLOW_CARPET_START_POINT.X = YELLOW_CAMP_CENTER.X - 3 * HW;
		YELLOW_CARPET_START_POINT.Y = YELLOW_CAMP_CENTER.Y - 5 * HW;
		YELLOW_CARPET_START_POINT.W = 5 * HW;
		YELLOW_CARPET_START_POINT.H = HW;
		// red
		RED_CARPET_START_POINT.X = RED_CAMP_CENTER.X - 2 * HW;
		RED_CARPET_START_POINT.Y = RED_CAMP_CENTER.Y + 4 * HW;
		RED_CARPET_START_POINT.W = 5 * HW;
		RED_CARPET_START_POINT.H = HW;
		// blue
		BLUE_CARPET_START_POINT.X = BLUE_CAMP_CENTER.X - 5 * HW;
		BLUE_CARPET_START_POINT.Y = BLUE_CAMP_CENTER.Y - 2 * HW;
		BLUE_CARPET_START_POINT.W = HW;
		BLUE_CARPET_START_POINT.H = 5 * HW;

		var homeHW = 1.5 * HW;

		var redBlueX = C - homeHW;
		var redBlueY = C - homeHW;

		var redGreenX = C - homeHW;
		var redGreenY = C + homeHW;

		var greenYellowX = C + homeHW;
		var greenYellowY = C + homeHW;

		var yellowBlueX = C + homeHW;
		var yellowBlueY = C - homeHW;

		var green_coords_obj = new Object();
		var blue_coords_obj = new Object();
		var red_coords_obj = new Object();
		var yellow_coords_obj = new Object();

		// calculate green home coords
		green_coords_obj.x1 = greenYellowX;
		green_coords_obj.y1 = greenYellowY;
		green_coords_obj.x2 = redGreenX;
		green_coords_obj.y2 = redGreenY;
		home_coords.green = green_coords_obj;

		// calculate yellow home coords
		yellow_coords_obj.x1 = greenYellowX;
		yellow_coords_obj.y1 = greenYellowY;
		yellow_coords_obj.x2 = yellowBlueX;
		yellow_coords_obj.y2 = yellowBlueY;
		home_coords.yellow = yellow_coords_obj;

		// calculate blue home coords
		blue_coords_obj.x1 = redBlueX;
		blue_coords_obj.y1 = redBlueY;
		blue_coords_obj.x2 = yellowBlueX;
		blue_coords_obj.y2 = yellowBlueY;
		home_coords.blue = blue_coords_obj;

		// calculate red home coords
		red_coords_obj.x1 = redBlueX;
		red_coords_obj.y1 = redBlueY;
		red_coords_obj.x2 = redGreenX;
		red_coords_obj.y2 = redGreenY;
		home_coords.red = red_coords_obj;
		
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 2*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 3*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 4*HW));
		//virage gauche
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 2*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 3*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 4*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 5*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 6*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		//up toward red camp
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 6*HW, GREEN_ENTRY_CENTER.Y - 6*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 6*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		//right red camp
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 5*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 4*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 3*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - 2*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X - HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		//up toward blue camp
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 8*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 9*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 10*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 11*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 12*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y - 13*HW));
		//right blue camp
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + HW, GREEN_ENTRY_CENTER.Y - 13*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 13*HW));
		//down blue camp
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 12*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 11*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 10*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 9*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 8*HW));
		//right blue
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 3*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 4*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 5*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 6*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 7*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 8*HW, GREEN_ENTRY_CENTER.Y - 7*HW));
		
		//down yellow
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 8*HW, GREEN_ENTRY_CENTER.Y - 6*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 8*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		//left yellow
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 7*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 6*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 5*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 4*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 3*HW, GREEN_ENTRY_CENTER.Y - 5*HW));
		//down green
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 4*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 3*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 2*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y - 0*HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + 2*HW, GREEN_ENTRY_CENTER.Y + HW));
		//left green
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X + HW, GREEN_ENTRY_CENTER.Y + HW));
		PLAYABLE_CELLS.push(new Coordinates(GREEN_ENTRY_CENTER.X, GREEN_ENTRY_CENTER.Y + HW));
		
		
		

		// drawScene
		drawScene();
		
		
		
		//draw all pawns
		drawAllPawns();
		
		// Add Mouse Event Listener to canvas
		// we find if the mouse down position is on any circle 
	    // and set that circle as target dragging circle.
	    $("#scene").mousedown(function(e) {
	    	var canvasPosition = $(this).offset();
//	    	var mouseX = e.layerX || 0;
//	    	var mouseY = e.layerY || 0;	
	    	var mouseX = e.pageX || 0;
	    	var mouseY = e.pageY || 0;	
	    
	    	
			for(var i=0;i<16;i++)
			{
				var circleX = PAWNS[i].coords.X;
				var circleY = PAWNS[i].coords.Y;
//				console.log(Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2));
//				console.log(Math.pow(PAWN_RADIUS,2));
				if (Math.pow(mouseX-circleX,2) + Math.pow(mouseY-circleY,2) < Math.pow(PAWN_RADIUS,2))
				{
					TARGET_PAWN = i;
					break;
				}
			}
	    });
		    
		// we move the target dragging circle when the mouse is moving
	    $("#scene").mousemove(function(e) {
	    	var canvasPosition = $(this).offset();
	    	//alert("mouse move");
	    	if (TARGET_PAWN != undefined)
	    	{
//				var mouseX = e.layerX || 0;
//				var mouseY = e.layerY || 0;
	    		var mouseX = e.pageX || 0;
		    	var mouseY = e.pageY || 0;
				PAWNS[TARGET_PAWN] = new Pawn(PAWNS[TARGET_PAWN].color, new Coordinates(mouseX, mouseY));		
					    	
	    	}
	    });
	    
	    // We clear the dragging circle data when mouse is up
	    $("#scene").mouseup(function(e) {
	    	TARGET_PAWN = undefined;
	    });
	    
	    // setup an interval to loop the game loop
	    setInterval(gameLoop, 30);	
		
		

	} else {
		alert("Your browser does not support this game");
	}
}

function gameLoop(){
	// clear the canvas before re-drawing.
	clear(ctx);
	//redraw scene
	drawScene();
	//redraw all pawns
	drawAllPawns();
	
	for(i=0;i<PLAYABLE_CELLS.length;i++)
	{
		drawPawn(new Pawn(black,PLAYABLE_CELLS[i]));
	}
	
}