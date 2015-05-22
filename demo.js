var pathfinding = require('./pathfinding.js');

// Demo 

// Demo 1 - small map
/*var myGrid = [  ['0','0','0','0','0'],
                ['0','0','1','0','1'],
                ['1','0','1','0','1'],
                ['0','0','1','0','0'],
                ['0','0','1','0','0']];

var s = new Search();
var g = new Grid(myGrid);

var moves = s.depthFirstSearch(g,[0,0],[4,4]);
g.show([0,0],[4,4],moves);
console.log ("Depth-First Search: [0,0],[4,4]");
showMoves (moves);
console.log (s.count + " steps");

s = new Search();
g = new Grid(myGrid);
moves = s.breadthFirstSearch(g,[0,0],[4,4]);
g.show([0,0],[4,4],moves);
console.log ("Breadth-First Search: [0,0],[4,4]");
showMoves (moves);
console.log (s.count + " steps");

s = new Search();
s.debug = 0;
g = new Grid(myGrid);
moves = s.aStar(g,[0,0],[4,4]);
g.show([0,0],[4,4],moves);
console.log ("A* Search: [0,0],[4,4]");
showMoves (moves);
console.log (s.count + " steps");
*/

// Demo 2 - Larger map
var u = new pathfinding.Utility();
var s = new pathfinding.Search();
s.debug = 0;
var g = new pathfinding.Grid();
moves = s.depthFirstSearch(g,[6,7],[13,13]);
g.show([6,7],[13,13],moves);
console.log ("Depth-First Search: [6,7],[13,13]");
u.showMoves (moves);
console.log (s.count + " steps");

s = new pathfinding.Search();
s.debug = 0;
g = new pathfinding.Grid();
moves = s.breadthFirstSearch(g,[6,7],[13,13]);
g.show([6,7],[13,13],moves);
console.log ("Breadth-First Search: [6,7],[13,13]");
u.showMoves (moves);
console.log (s.count + " steps");

s = new pathfinding.Search();
s.debug = 0;
g = new pathfinding.Grid();
moves = s.aStar(g,[6,7],[13,13]);
g.show([6,7],[13,13],moves);
console.log ("A* Search: [6,7],[13,13]");
u.showMoves (moves);
console.log (s.count + " steps");