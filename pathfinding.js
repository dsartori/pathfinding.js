function Grid(){

/*
this.matrix = [['0','1','0','0','0'],
				['0','1','0','0','0'],
				['0','1','0','1','0'],
				['0','0','0','1','0'],
				['0','0','0','1','0']];
*/
this.matrix = [	['0','0','1','0','0','1','0','0','0','0','0','0','0','0'],
				['0','0','1','0','0','0','0','0','1','1','1','1','1','1'],
				['0','0','0','0','1','0','1','0','0','0','0','0','0','0'],
				['1','1','1','0','1','0','1','0','1','1','1','1','1','0'],
				['0','0','0','0','1','0','1','0','0','0','0','0','1','0'],
				['0','0','0','0','1','0','1','1','1','1','0','0','1','1'],
				['0','1','1','0','1','1','1','0','0','0','1','0','1','0'],
				['0','0','0','0','1','0','0','0','0','0','1','0','1','0'],
				['0','0','0','0','1','0','1','0','1','0','1','0','0','0'],	
				['0','0','0','0','0','0','0','0','1','0','1','1','1','0'],
				['0','0','0','0','0','0','0','0','1','0','0','0','1','0'],
				['0','0','0','0','0','0','0','0','1','0','0','0','0','0'],
				['0','0','0','0','0','0','0','0','1','0','0','0','0','0'],
				['0','0','0','0','0','0','0','0','1','0','0','0','0','0']];

    this.xSize = this.matrix[0].length;
    this.ySize = this.matrix.length;


	this.visited = copy(this.matrix);

	this.show = function(){

		for (var i = 0; i < this.visited.length; i++){
			print('[' + this.visited[i] + ']');
		}
	}

	this.possibleMoves = function(p){

		x = p[0];
		y = p[1];
		var moves = [];
		for (var i=-1; i < 2; i++){
			for (var j=-1; j < 2; j++){
				
				xAdj = x+j;
				yAdj = y+i;

				if ((i !=0 || j!=0) 
					&& ((xAdj > -1 && xAdj < this.xSize))
					&& ((yAdj < this.ySize && yAdj > -1))){ 

					if (this.visited[yAdj][xAdj] == 0){
						var m = new Array()
						m[0] = xAdj;
						m[1] = yAdj;
						moves.push(m);
					}
				}
			}
		}
		return moves;
	}

	this.checkVisited = function(position){

		x = position[0];
		y = position[1];

		return (this.visited[y][x]);
	}

	this.clearVisited = function(){
		this.visited = this.matrix;
	}

	this.visit = function(position){
		this.visited[position[1]][position[0]] = '2';
	}
}


// utility functions
function showMoves(arr){
var str = arr.length + ' moves:';
	for (var i = 0; i < arr.length ; i++){
		if (i > 0){ 
			str += ',';
		}
		str += '{' + arr[i] + '}';
	}
print(str);
}

function copy(arr){
	var newArr = arr.slice(0);
	for(var i = newArr.length; i--;)
		if(newArr[i] instanceof Array)
			newArr[i] = copy(newArr[i]);
	return newArr;
}

function clone(obj){
	if(obj == null || typeof(obj) != 'object')
		return obj;

	var temp = new obj.constructor(); 
	for(var key in obj)
		temp[key] = clone(obj[key]);

	return temp;
}

function contains(queue,position){

	if (queue.length ==0)
		return 0;

	for (var i = 0; i < queue.length; i++){
		var item = queue[i];	
		if (item[0] == position[0] && item[1] == position[1]){
			return 1;
		}

	}
	return 0;
}


function makeKey(position){

	var x = position[0];
	var y = position[1];
 	return x+","+y;

}

// search functions
function Search(){

	this.predecessor = {};
	this.debug = 0;
	this.count = 0;

	this.depthFirstSearch = function(matrix,position,goal){

		this.count++;
		matrix.visit(position);

		if (position[0] == goal[0] && position[1]==goal[1]){
			return this.pathFrom(goal);
		}

		var moves = matrix.possibleMoves(position);

		if (this.debug)
			matrix.show();

		for (var i = 0; i < moves.length ; i++){

					if (this.debug)
						print ("move = " + moves[i]);

					this.predecessor[makeKey(moves[i])] = position;
					newMatrix = clone(matrix);
					if (this.depthFirstSearch(newMatrix,moves[i],goal)){
						return this.pathFrom(goal);
					}

		}

	}
 	this.breadthFirstSearch = function(matrix,position,goal){

 		
 		var queue = [[]];
 		queue[0]=position;

 		while (queue.length > 0){
 			this.count++;
 			var currentPosition = queue[0];
 			queue.shift();

					if (this.debug){
						print ("move = " + currentPosition);
	
						print ("predecessor = " + this.predecessor[makeKey(currentPosition)]);
					}
			
 			if (currentPosition[0] == goal[0] && currentPosition[1] == goal[1]){
 				return this.pathFrom(goal);
 			}
 			matrix.visit(currentPosition);

 			if (this.debug)
 				matrix.show();

 			var moves = matrix.possibleMoves(currentPosition);
 			for (i = 0; i < moves.length; i++){
 				if (!contains(queue,moves[i])){

					this.predecessor[makeKey(moves[i])] = currentPosition;
					queue.push(moves[i]);
				}
			}
 		}

	}

 	this.aStar = function(matrix,position,goal){

 		var that = this;
 		function calculateScore(move,g){

 			var goalX = g[0];
 			var goalY = g[1];

 			var x = move[0];
			var y = move[1];

			// cost to get here
 			g = depth[makeKey(move)];

 			// heuristic
 			deltaX = Math.abs(x - goalX);
 			deltaY = Math.abs(y - goalY);

 			var h =  Math.sqrt(( deltaX * deltaX )+ (deltaY * deltaY ) );

 			var s = h + g;
 			return -s;
 		}
 		
 		function getBest(moves){
 			var bestScore = -1000;
 			var bestIndex = 0;

 			for (var i = 0;i<moves.length;i++){

 				if (score[makeKey(moves[i])] > bestScore){
 					bestIndex = i;
 					bestScore = score[makeKey(moves[i])];
 				}
 			}
 			return bestIndex;
 		}

 		// instatiate data structures
 		var open = [[]];
 		var closed = [[]];
 		var score = {};
 		var depth = {};

 		// initialize data structures
 		open[0]=position;
 		closed[0]=position;
 		depth[makeKey(position)] = 0;

 		while (open.length > 0){

 			this.count++;
 			var bestIndex = getBest(open);
 			var currentPosition = open[bestIndex];

 			open.splice(bestIndex);

 			if (!contains(closed,currentPosition)){
 				closed.push(currentPosition);

 			}
			var currentScore = calculateScore(currentPosition,goal);

			if(score[makeKey(currentPosition)]){
				if(currentScore < score[makeKey(currentPosition)]){
					score[makeKey(currentPosition)] = currentScore;
				}
			}else{
				score[makeKey(currentPosition)] = currentScore;
			}
			
 			if (currentPosition[0] == goal[0] && currentPosition[1] == goal[1]){
 				return this.pathFrom(goal);
 			}
 	
 			if (this.debug){
 				print ("");
 				matrix.show();
 			}
 			var moves = matrix.possibleMoves(currentPosition);


 			for (var i = 0; i < moves.length; i++){

 					this.count++;
 					var d = depth[makeKey(currentPosition)];	

 					x = moves[i][0];
 					y = moves[i][1];
 					depth[x+","+y] = d+1;

 				if(contains(closed,moves[i])){
 					var prior = score[makeKey(moves[i])];
					var currentScore = calculateScore(moves[i],goal);
 					if  (currentScore > prior){
 						score[makeKey(moves[i])] = currentScore;
 						closed.splice(closed.indexOf(moves[i]));
 						if (!contains(open,moves[i])){
							this.predecessor[makeKey(moves[i])] = currentPosition;
							open.push(moves[i]);
						};
 					}
 				}else{

 					if (!contains(open,moves[i])){
						this.predecessor[makeKey(moves[i])] = currentPosition;
						score[makeKey(moves[i])] = calculateScore(moves[i],goal);

						open.push(moves[i]);
					}
				}

			}
 		}



 		return([]);
	}

	this.pathFrom = function(position){


		flag = 1;
		var moves = [];
		var x = position[0];
		var y = position[1];
		while (flag){
			if (this.predecessor[x+","+y] ){
				moves.unshift(this.predecessor[x+","+y] );
				var newX = this.predecessor[x+","+y][0];
				var newY = this.predecessor[x+","+y][1];

				x = newX;
				y = newY;
			}else{
				flag = 0;
			}

		}

		return moves;
	}
}

// Demo 


var s = new Search();
s.debug = 1;
var g = new Grid();
g.show();
print ("Depth-First Search: ");
showMoves (s.depthFirstSearch(g,[6,7],[13,13]));
print (s.count + " steps");


s = new Search();
s.debug = 0;
g = new Grid();
g.show();
print ("Breadth-First Search: ");
showMoves (s.breadthFirstSearch(g,[6,7],[13,13]));
print (s.count + " steps");


s = new Search();
s.debug = 0;
g = new Grid();
g.show();
print ("A* Search: ");
showMoves (s.aStar(g,[6,7],[13,13]));
print (s.count + " steps");
