
function Grid(){

 
   if (arguments[0])
       this.matrix = arguments[0];
   else this.matrix = [ ['0','0','1','0','0','1','0','0','0','0','0','0','0','0'],
                        ['0','0','1','0','0','0','0','0','1','1','1','1','1','1'],
                        ['0','0','0','0','1','0','1','0','0','0','0','0','0','0'],
                        ['1','1','1','0','1','0','1','0','1','1','1','1','1','0'],
                        ['0','0','0','0','1','0','1','0','0','0','0','0','1','0'],
                        ['0','0','0','0','1','1','1','1','1','1','1','0','1','0'],
                        ['0','1','1','0','1','0','0','0','0','0','1','0','1','0'],
                        ['0','0','0','0','1','0','0','0','0','0','1','0','1','0'],
                        ['0','0','1','1','1','1','0','0','0','0','1','0','1','0'],  
                        ['0','0','1','1','0','1','0','0','0','0','1','0','1','0'],
                        ['0','0','1','1','0','1','0','0','0','0','1','0','1','0'],
                        ['0','0','1','1','0','1','1','0','0','1','1','0','1','0'],
                        ['0','0','1','1','0','0','0','0','0','0','0','0','1','0'],
                        ['0','0','0','0','0','0','0','0','1','1','1','0','1','0']];

    this.xSize = this.matrix[0].length;
    this.ySize = this.matrix.length;

    // visited matrix marks visited nodes
    this.visited = copy(this.matrix);

    this.predecessor = {};

    // print the matrix
    // optionally, include a list of moves to plot
    Grid.prototype.show = function(location,goal,moves){

        tempGrid = copy(this.matrix);

        for (var i = 0; i < tempGrid.length; i++){
            for (var j = 0; j < tempGrid[0].length; j++){
                if (tempGrid[i][j] == "0")
                    tempGrid[i][j] = " ";

                if (tempGrid[i][j] == "1")
                    tempGrid[i][j] = "X";
            }
        }

        //plot moves (if any)
        if (moves){
            for (var i = 0; i < moves.length; i++){
                var move = moves[i];

                tempGrid[move[1]][move[0]] = "."
            }
        }

        // plot start and goal
        tempGrid[location[1]][location[0]] = "@";
        tempGrid[goal[1]][goal[0]] = "!";


        for (var i = 0; i < tempGrid.length; i++){
            tmpStr = "";
            for (var j = 0; j < tempGrid.length; j++){
                tmpStr += tempGrid[i][j];
            }
            print('[' + tmpStr + ']');
        }
    }

    // return a list of all adjacent, unvisited nodes
    Grid.prototype.possibleMoves = function(p){

        x = p[0];
        y = p[1];
        var moves = [];

        for (var i=-1; i < 2; i++){
            for (var j=-1; j < 2; j++){

                xAdj = x+j;
                yAdj = y+i;

                if ((i !=0 || j!=0) 
                    && ((xAdj < this.xSize && xAdj > -1))
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

    // has this node been visited?
    Grid.prototype.checkVisited = function(position){

        x = position[0];
        y = position[1];

        return (this.visited[y][x]);
    }

    Grid.prototype.clearVisited = function(){
        this.visited = this.matrix;
    }

    Grid.prototype.visit = function(position){
        this.visited[position[1]][position[0]] = '2';
    }

        // Walk back along breadcrumb path from goal node 
    Grid.prototype.pathFrom = function(position){


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


// utility functions

// pretty-print an array of moves
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

// array copy
function copy(arr){
    var newArr = arr.slice(0);
    for(var i = newArr.length; i--;)
        if(newArr[i] instanceof Array)
            newArr[i] = copy(newArr[i]);
    return newArr;
}

// object clone 
function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

// check a move queue for equivalent move
function contains(queue,position){
    if (queue.length == 0)
        return 0;

    for (var i = 0; i < queue.length; i++){
        var item = queue[i];    
        if (item[0] == position[0] && item[1] == position[1]){
            return 1;
        }

    }
    return 0;
}

// construct key for hashes
function makeKey(position){

    var x = position[0];
    var y = position[1];
    return x+","+y;

}

// search functions
function Search(){

    //this.predecessor = {};
    this.debug = 0;
    this.count = 0;

    Search.prototype.depthFirstSearch = function(matrix,position,goal){

        this.count++;
        // Mark the current node as visited
        //matrix.visit(position);

        // Check if goal reached
        if (position[0] == goal[0] && position[1] == goal[1]){
            return matrix.pathFrom(goal);
        }

        // Get all possible moves from current node
        var moves = matrix.possibleMoves(position);

        if (this.debug)
            matrix.show(position,goal);

        for (var i = 0; i < moves.length ; i++){

                    var move = moves[i];
                    // Record breadcrumb path
                    matrix.predecessor[makeKey(move)] = position;
                    // Clone grid and recursively call DFS
                    newMatrix = clone(matrix);

                    // don't revisit this node during this iteration
                    newMatrix.visit(position);
                    if (this.depthFirstSearch(newMatrix,move,goal)){
                        return newMatrix.pathFrom(goal);
                    }

        }

    }
    Search.prototype.breadthFirstSearch = function(matrix,position,goal){

        // Set up queue 
        var queue = [[]];
        queue[0]=position;

        while (queue.length > 0){
            this.count++;

            // Take first element from queue for evaluation, then remove it
            var currentPosition = queue[0];
            queue.shift();

            // Check if goal is reached
            if (currentPosition[0] == goal[0] && currentPosition[1] == goal[1]){
                return matrix.pathFrom(goal);
            }
            matrix.visit(currentPosition);

            if (this.debug)
                matrix.show(currentPosition,goal);

            // Get all possible moves from current node 
            var moves = matrix.possibleMoves(currentPosition);
            for (var i = 0; i < moves.length; i++){
                if (!contains(queue,moves[i])){

                    // Add new moves found to the front of the queue
                    matrix.predecessor[makeKey(moves[i])] = currentPosition;
                    queue.push(moves[i]);
                }
            }
        }

    }

    Search.prototype.aStar = function(matrix,position,goal){

        // Function to calculate a node's score
        function calculateScore(move,goal){

            // Goal location 
            var goalX = goal[0];
            var goalY = goal[1];

            // Current location
            var x = move[0];
            var y = move[1];

            // cost to get here
            var g = depth[makeKey(move)];

            // Manhattan distance 
            deltaX = Math.abs(x - goalX);
            deltaY = Math.abs(y - goalY);
            

            var h = deltaY + deltaX; 
            // Combine known cost with estimate

            var score = h + g;
            return score;
        }
        var that = this;
        // Naive implementation of a priority queue
        function getBest(moves){
            var bestScore = 9999;
            var bestIndex = 0;

            for (var i = 0;i<moves.length;i++){

                if (score[makeKey(moves[i])] < bestScore){
                    bestIndex = i;
                    bestScore = score[makeKey(moves[i])];
                }
            }
           
            //print (that.predecessor[makeKey(moves[bestIndex])], moves[bestIndex]);
            return bestIndex;
        }

        // instatiate data structures
        var open = [[]];
        var closed = [[]];
        var score = {};
        var depth = {};

        // initialize data structures

        // Open holds nodes to be evaluated
        open[0]=position;
        //score[makeKey(position)] = calculateScore(position,goal);
        // Closed holds nodes that have been evaluated
        closed[0]=position;
        depth[makeKey(position)] = 0;

        while (open.length > 0){

            this.count++;
            // Get first item in priority queue
            var bestIndex = getBest(open);
            var currentPosition = open[bestIndex];
            // Goal reached
            if (currentPosition[0] == goal[0] && currentPosition[1] == goal[1]){
                return matrix.pathFrom(goal);
            }
    
            // Remove selected item from priority queue
            open.splice(bestIndex,1);
            // Add to closed nodes
            closed.push(currentPosition);

            // Record score
            var currentScore = calculateScore(currentPosition,goal);
            score[makeKey(currentPosition)] = currentScore;
            
            if (this.debug){
                print ("");
                matrix.show(currentPosition,goal);
            }

            // Get all possible moves for current node
            var moves = matrix.possibleMoves(currentPosition);
            var d = depth[makeKey(currentPosition)];
            for (var i = 0; i < moves.length; i++){
    
                // Increment length of path 
                var currDepth = d+1;
                move = moves[i];
                // closed nodes are ignored
                if(!contains(closed,move)){
                    // Update open nodes if the new estimated value is better
                    if(contains(open,move)){
                        var prior = score[makeKey(move)];
                        var currentScore = calculateScore(move,goal);
                        if  (currentScore < prior){
                            depth[makeKey(move)] = currDepth;
                            score[makeKey(move)] = currentScore;
                            matrix.predecessor[makeKey(move)] = currentPosition;
                        }
                    }else{
                    // Add previously unevaluated node to queue
                        depth[makeKey(move)] = currDepth;
                        score[makeKey(move)] = calculateScore(move,goal);
                        matrix.predecessor[makeKey(move)] = currentPosition; 
                        open.push(move);
                    }
                }

            }
        }

        return([]);
    }


}

// Demo 

// Demo 1 - small map
var myGrid = [  ['0','0','0','0','0'],
                ['0','0','1','0','1'],
                ['1','0','1','0','1'],
                ['0','0','1','0','0'],
                ['0','0','1','0','0']];

var s = new Search();
var g = new Grid(myGrid);

var moves = s.depthFirstSearch(g,[0,0],[4,4]);
g.show([0,0],[4,4],moves);
print ("Depth-First Search: [0,0],[4,4]");
showMoves (moves);
print (s.count + " steps");

s = new Search();
g = new Grid(myGrid);
moves = s.breadthFirstSearch(g,[0,0],[4,4]);
g.show([0,0],[4,4],moves);
print ("Breadth-First Search: [0,0],[4,4]");
showMoves (moves);
print (s.count + " steps");

s = new Search();
s.debug = 0;
g = new Grid(myGrid);
moves = s.aStar(g,[0,0],[4,4]);
g.show([0,0],[4,4],moves);
print ("A* Search: [0,0],[4,4]");
showMoves (moves);
print (s.count + " steps");

// Demo 2 - Larger map
var s = new Search();
s.debug = 0;
var g = new Grid();
moves = s.depthFirstSearch(g,[6,7],[13,13]);
g.show([6,7],[13,13],moves);
print ("Depth-First Search: [6,7],[13,13]");
showMoves (moves);
print (s.count + " steps");

s = new Search();
s.debug = 0;
g = new Grid();
moves = s.breadthFirstSearch(g,[6,7],[13,13]);
g.show([6,7],[13,13],moves);
print ("Breadth-First Search: [6,7],[13,13]");
showMoves (moves);
print (s.count + " steps");

s = new Search();
s.debug = 0;
g = new Grid();
moves = s.aStar(g,[6,7],[13,13]);
g.show([6,7],[13,13],moves);
print ("A* Search: [6,7],[13,13]");
showMoves (moves);
print (s.count + " steps");
