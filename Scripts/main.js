"use strict"
var bd = {};
var state;
var neighbor;
var ctx;
var canvas;
var liveCondition = [2,3]
var reproCondition =[3];
var simulation = false;
var random = false;
var brush = [];

window.onload = function(){
	//Get the canvas
	canvas = document.getElementById("canvas");
	canvas.onmousemove = mouseInput;
	canvas.onmousedown = mouseInput;
	ctx = canvas.getContext("2d");
	bd = {
		width : canvas.width,
		height: canvas.height, 
	}
	//Set Default grid size
	setGrid(400,400);
}

function mouseInput(mD){
	if(mD.buttons !=1)
		return;

		var x = Math.floor(mD.offsetX/bd.cellWidth);
		var y = Math.floor(mD.offsetY/bd.cellHeight);
		var erase = false;
		if(mD.altKey){
			erase = true;
		}
		if(mD.ctrlKey){
			changeCell(brush,x,y,erase);
		} else {
			changeCell([[true]],x,y,erase);
		}
}

function changeCell(pattern,xMouse,yMouse,erase){
	var mX = Math.floor(pattern.length/2);
	var mY = Math.floor(pattern[0].length/2);
	for(var x = 0; x < pattern.length; x ++){
		for(var y = 0; y < pattern[x].length;y ++){
			var xPos = xMouse + x - mX;
			var yPos = yMouse + y - mY;
			if(pattern[x][y] && xPos>=0 && yPos>=0 && xPos <bd.x && yPos < bd.y){
				if(erase){
					state[xPos][yPos] = false;
					ctx.clearRect(xPos*bd.cellWidth,yPos*bd.cellHeight,bd.cellWidth,bd.cellHeight);
				} else {
					state[xPos][yPos] = true;
					ctx.fillRect(xPos*bd.cellWidth,yPos*bd.cellHeight,bd.cellWidth,bd.cellHeight);
				}
			}
		}
	}
}

function setGrid(width,height){
	bd.cellWidth = bd.width/width;
	bd.cellHeight = bd.height/height;
	bd.x = width;
	bd.y = height;

	ctx.clearRect(0,0,bd.width,bd.height);
	//Initalizes the grid
	state = new Array(width);
	neighbor = new Array(width);
	for(var x = 0; x < width; x ++){
		state[x] = new Array(height);
		neighbor[x] = new Array(height);
		for(var y  = 0; y < height; y ++){
			if(random && Math.random()>0.5)
			state[x][y] = true;
			else state[x][y] = false;
			neighbor[x][y] = 0;
		}
	}
}

function update(){
	for(var x = 0; x < bd.x; x++){
		for(var y  = 0; y< bd.y; y++){
			if(state[x][y]){
				for(var xN = -1; xN<=1; xN++){
					for(var yN = -1; yN<=1;yN++){
						if((xN == 0 && yN == 0))
							continue;
						if(xN+x<0 ||xN+x>=bd.x)
							continue;
						if(yN+y<0 ||yN+y>=bd.y)
							continue;
							neighbor[x+xN][y+yN]++;
					}
				}
			}
		}
	}
	ctx.clearRect(0,0,bd.width,bd.height);

	for(var x = 0; x < bd.x; x++){
		for(var y  = 0; y< bd.y; y++){
			if(state[x][y]){
				if(liveCondition.indexOf(neighbor[x][y])>=0){
					//console.log("Cell " + x + " " + y + "lives!");
					ctx.fillRect(x*bd.cellWidth,y*bd.cellHeight,bd.cellWidth,bd.cellHeight);
					state[x][y] = true;
				} else {
					//console.log("Cell " + x + " " + y + "Dies!");
					state[x][y] = false;
				}
			} else if(reproCondition.indexOf(neighbor[x][y])>=0){
				//console.log("Cell " + x + " " + y + "reproduces!");
				ctx.fillRect(x*bd.cellWidth,y*bd.cellHeight,bd.cellWidth,bd.cellHeight);
				state[x][y] = true;
			}
			neighbor[x][y] = 0;
		}
	}
	if(simulation){
		requestAnimationFrame(update)
	}
}

function playButton(){
	if(simulation){
		simulation = false;
		document.getElementById("play").value = "Start";
	}
	else {
		simulation = true;
		update();
		document.getElementById("play").value = "Stop";

	}
}
function changeSettings(){
	var gridField = document.getElementById("gridSize");
	var dim = parse(gridField.value,",",true);
	setGrid(dim[0],dim[1]);

	var rules = parse(document.getElementById("rules").value,"/",false);
	liveCondition = parse(rules[0],",",true);
	reproCondition = parse(rules[1],",",true);
}
function parse(text, key , number){
	var returnArray = [];

	while(true){
		var pos = text.indexOf(key);
		if(pos < 0){
			if(number)
			returnArray.push(Number(text));
		else returnArray.push(text);
			break;
		} else {
			if(number)
				returnArray.push(Number(text.substring(0,pos)));
			else returnArray.push(text.substring(0,pos));
			text = text.substring(pos+1,text.length);
		}
	}
	return returnArray;
}
function setBrush(){
	brush = new Array(state.length);
	
	for(var x = 0; x < brush.length; x++){
		brush[x] = state[x].slice();
	}
}