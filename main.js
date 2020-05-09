
// set up the canvas element

function setup()
{

  document.getElementById('play').addEventListener('click',play)
  document.getElementById('play').style.height = cellsize+'px';
  document.getElementById('restart').addEventListener('click',restart);
  document.getElementById('restart').style.height = cellsize+'px';
  document.getElementById('help').addEventListener('click',help);
  document.getElementById('help').style.height = cellsize+'px'
  document.getElementById('info').addEventListener('click',hideOverlay);
  
  emptyCell = new Image();
  emptyCell.src = 'img/empty.png';
  cell = new Image();
  cell.src = 'img/cell.png';
  searchedCell = new Image();
  searchedCell.src = 'img/searched.png';
  searchingCell = new Image();
  searchingCell.src = 'img/searching.png';
  originCell = new Image();
  originCell.src = 'img/origin.png'
  goalCell = new Image();
  goalCell.src = 'img/goal.png'

  var canvas_wrapper = document.getElementById('canvas-wrapper');
  //canvas_wrapper.innerHTML = ';
  var canvas = document.getElementById('board');
  canvas.addEventListener("mousedown",function(e){
    handleClick(canvas,e);
  })

	c = canvas.getContext('2d');
  
  renderer = setTimeout(function draw()
  {
    render();

    renderer = setTimeout(draw,interval);
  }, interval);

}

var render = function(){
	for (i = 0; i < g.matrix.length; i++){
		for (j = 0; j < g.matrix[0].length; j++){
		if (g.matrix[i][j]==1){
        	c.drawImage(cell,j*cellsize,i*cellsize,cellsize,cellsize);
      	}else{
        	c.drawImage(emptyCell,j*cellsize,i*cellsize,cellsize,cellsize);
      	}
	}



}
 	if (running){
		for (k = 0; k<=counter; k++){
			for (l = 0; l < s.searchedPositions[k].length; l++){
				var i = s.searchedPositions[k][l][1];
				var j = s.searchedPositions[k][l][0];
				if (k < counter){
					c.drawImage(searchedCell,j*cellsize,i*cellsize,cellsize,cellsize);
				}else{
					c.drawImage(searchingCell,j*cellsize,i*cellsize,cellsize,cellsize);
				}
			}
		}

		if (counter < s.count){	
		document.getElementById("steps").innerHTML = counter + " Steps";
		counter++;
		}else{
			if (path.length > 0){
				for (k = 0; k < path.length;k++){
				c.drawImage(searchingCell,path[k][0]*cellsize,path[k][1]*cellsize,cellsize,cellsize);
			}
			}
			if (typeof(m) !='undefined'){
				if (path.length < m.length){
					path.push(m[path.length]);
				};	
			}else{ // do nothing if there is no path from origin to goal
				;
			}
		}
	}

	c.drawImage(originCell,origin[0]*cellsize,origin[1]*cellsize,cellsize,cellsize);

	c.drawImage(goalCell,goal[0]*cellsize,goal[1]*cellsize,cellsize,cellsize);
	
}

function handleClick(c,e){
  var rect = c.getBoundingClientRect();
  var x = Math.floor((event.clientX - rect.left)/cellsize);
  var y = Math.floor((event.clientY - rect.top)/cellsize);
  console.log(x,y);
  if (!running){
    if (g.matrix[y][x]==0)
    {
    	g.updateMatrix(x,y,1);
    }else{
    	g.updateMatrix(x,y,0);
    };
  }
}

function hideOverlay(){
	document.getElementById("info").style.display="none";
}

function play(){
	if (!running){

  		var select = document.getElementById("presets");
  		var algorithm = select.options[select.selectedIndex].value;
  		if (algorithm == 'bfs'){
  			m = s.breadthFirstSearch(g,origin,goal);
  		}  		
  		if (algorithm == 'dfs'){
  			m = s.depthFirstSearch(g,origin,goal);
  		}
  		if (algorithm == 'astar'){
  			m = s.aStar(g,origin,goal);
  		}
  		running = 1;
  	}
}

function restart(){
	s = new Search();

	if (g){
		g = new Grid(g.matrix);
	}else{
		g = new Grid();
	}	

	path = [];
	counter = 0;
	running = 0; 
}
function help(){
  if (document.getElementById("info").style.display=="block"){
  document.getElementById("info").style.display="none";
  }else{
  document.getElementById("info").style.display="block";
}
}
function populateSelect(){

  var select = document.getElementById("presets");
  var options = {'bfs':'Breadth-First Search',
				 'dfs':'Depth-First Search',
				 'astar':'A*'}
  var i=0;
  var s=0;
  for (var key in options){
    var opt = document.createElement("option");
    opt.value = key;
    opt.innerHTML = options[key];
    presets.appendChild(opt);
    if(key=='bfs'){s=i};
    i++;
  }
  select.selectedIndex=s;
}

// initialize globals and set up UI
var s;
var g;
var m;
var path = [];
var running = 0;
var interval = 50;
var boardsize = 14;
var cellsize = 60;
var counter = 0;
var origin = [0,0];
var goal = [13,13];

restart();
setup();

populateSelect();


