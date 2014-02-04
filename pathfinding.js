// use Grid.prototype.show = function(){ }

/*
print = function(){
    if (print !=null){
        return print;
    }else{
        return console.log;
    }
*/

function Grid(){


this.matrix = [ ['0','0','1','0','0','1','0','0','0','0','0','0','0','0'],
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

    // visited matrix marks visited nodes
    this.visited = copy(this.matrix);


    // print the matrix
    Grid.prototype.show = function(){

        for (var i = 0; i < this.visited.length; i++){
            print('[' + this.visited[i] + ']');
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

// object clone XXX
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

// construct key for hashes
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


    Search.prototype.depthFirstSearch = function(matrix,position,goal){

        this.count++;

        // Mark the current node as visited
        matrix.visit(position);

        // Check if goal reached
        if (position[0] == goal[0] && position[1] == goal[1]){
            return this.pathFrom(goal);
        }

        // Get all possible moves from current node
        var moves = matrix.possibleMoves(position);

        if (this.debug)
            matrix.show();

        for (var i = 0; i < moves.length ; i++){

                    if (this.debug)
                        print ("move = " + moves[i]);

                    // Record breadcrumb path
                    this.predecessor[makeKey(moves[i])] = position;

                    // Clone grid and recursively call DFS
                    newMatrix = clone(matrix);
                    if (this.depthFirstSearch(newMatrix,moves[i],goal)){
                        return this.pathFrom(goal);
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

                    if (this.debug){
                        print ("move = " + currentPosition);
    
                        print ("predecessor = " + this.predecessor[makeKey(currentPosition)]);
                    }
            // Check if goal is reached
            if (currentPosition[0] == goal[0] && currentPosition[1] == goal[1]){
                return this.pathFrom(goal);
            }
            matrix.visit(currentPosition);

            if (this.debug)
                matrix.show();

            // Get all possible moves from current node 
            var moves = matrix.possibleMoves(currentPosition);
            for (i = 0; i < moves.length; i++){
                if (!contains(queue,moves[i])){

                    // Add new moves found to the front of the queue
                    this.predecessor[makeKey(moves[i])] = currentPosition;
                    queue.push(moves[i]);
                }
            }
        }

    }

    Search.prototype.aStar = function(matrix,position,goal){

        // Function to calculate a node's score
        function calculateScore(move,g){

            // Goal location 
            var goalX = g[0];
            var goalY = g[1];

            // Current location
            var x = move[0];
            var y = move[1];

            // cost to get here
            g = depth[makeKey(move)];

            // Manhattan heuristic
            deltaX = Math.abs(x - goalX);
            deltaY = Math.abs(y - goalY);

            var h =  Math.sqrt(( deltaX * deltaX ) + (deltaY * deltaY ) );

            // Combine known cost with estimate 
            var score = h + g;
            return -score;
        }
        
        // Naive implementation of a priority queue
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

        // Open holds nodes to be evaluated
        open[0]=position;

        // Closed holds nodes that have been evaluated
        closed[0]=position;
        depth[makeKey(position)] = 0;

        while (open.length > 0){
            this.count++;

            // Get first item in priority queue
            var bestIndex = getBest(open);
            var currentPosition = open[bestIndex];

            // Remove selected item from priority queue
            open.splice(bestIndex);

            // Add to evaluated nodes
            if (!contains(closed,currentPosition)){
                closed.push(currentPosition);

            }
            var currentScore = calculateScore(currentPosition,goal);

            // If this node has been scored, check if new score is better
            if(score[makeKey(currentPosition)]){
                if(currentScore > score[makeKey(currentPosition)]){
                    score[makeKey(currentPosition)] = currentScore;
                }
            }else{
            // Record score
                score[makeKey(currentPosition)] = currentScore;
            }
            
            // Goal reached
            if (currentPosition[0] == goal[0] && currentPosition[1] == goal[1]){
                return this.pathFrom(goal);
            }
    
            if (this.debug){
                print ("");
                matrix.show();
            }

            // Get all possible moves for current node
            var moves = matrix.possibleMoves(currentPosition);

            for (var i = 0; i < moves.length; i++){

                    this.count++;
                    var d = depth[makeKey(currentPosition)];    

                    x = moves[i][0];
                    y = moves[i][1];

                    // Increment length of path 
                    depth[x+","+y] = d+1;

                // Re-evaluate closed nodes if the new estimated value is better
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

                    // Add previously unevaluated node to queue
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

    // Walk back along breadcrumb path from goal node 
    Search.prototype.pathFrom = function(position){


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
s.debug = 0;
var g = new Grid();
g.show();
print ("Depth-First Search: [6,7],[13,13]");
showMoves (s.depthFirstSearch(g,[6,7],[13,13]));
print (s.count + " steps");


s = new Search();
s.debug = 0;
g = new Grid();
//g.show();
print ("Breadth-First Search: [6,7],[13,13]");
showMoves (s.breadthFirstSearch(g,[6,7],[13,13]));
print (s.count + " steps");


s = new Search();
s.debug = 0;
g = new Grid();
//g.show();
print ("A* Search: [6,7],[13,13]");
showMoves (s.aStar(g,[6,7],[13,13]));
print (s.count + " steps");
