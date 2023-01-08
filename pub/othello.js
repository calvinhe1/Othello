//variable declarations.
var boardSize = 8;
var turn =  'Black';
var createdGameBoard = false;
var gameBoard;
var playAI = false;

//prevents clicking twice to replace AI color turn.
var playerColor = 'black';

//tile class 
class tile {
  constructor(row,col){
    this.row = row;
    this.col = col;
    this.id = String(row) + String(col);
    this.color = 'empty';

    if ( ((row == 4) && (col == 4) )|| ((row == 3) && (col== 3))) {
      this.color = 'White';
    }
    else if ( ((row == 3) && (col == 4) )|| ((row == 4) && (col== 3))) {
      this.color  = 'Black';
    }
  }
}

function isBoardFull(board) {
  var i, j;
    for (i= 0; i< boardSize; i++) {
        for (j = 0; j < boardSize; j++) {
            if (board[i][j].color == 'empty') {
                return false;
            }
        }
    }
    return true;
}

//create the game board 
function createBoard() {
  boardArray = [];
  var i, j;
  for (i = 0; i < boardSize; i++) {
      var array = [];
      for (j = 0; j < boardSize; j++) {
          array.push(new tile(i, j));
      }
      boardArray.push(array);
  }
  return boardArray;
}

function showTileCount() {
  var numberOfBlackTiles = countNumberOfBlackTiles(gameBoard);
  var numberOfWhiteTiles = countNumberOfWhiteTiles(gameBoard);

  var scoreBlack = document.getElementById('playerOne');
  var scoreWhite = document.getElementById('playerTwo');

  scoreBlack.removeChild(scoreBlack.childNodes[0]);
  scoreWhite.removeChild(scoreWhite.childNodes[0]);

  var blackTag = document.createTextNode('Black: ' + numberOfBlackTiles);
  var whiteTag = document.createTextNode('White: ' + numberOfWhiteTiles);

  scoreBlack.appendChild(blackTag);
  scoreWhite.appendChild(whiteTag);

}

//show currently playing turn
function showTurn() {
  var element = document.getElementById('turn');
  element.removeChild(element.childNodes[0]);
  var tag = document.createTextNode('Currently playing: ' + (turn));
  element.appendChild(tag);
}

//show currently playing gamemode
function showGameMode(gameMode) {
  var element = document.getElementById('gameMode');
  element.removeChild(element.childNodes[0]);
  var tag = document.createTextNode('Gamemode: ' + gameMode);
  element.appendChild(tag);
}

function resetBoard() {
  //delete old board
  if (createdGameBoard == true) {
    for (i = 0; i < boardSize; i++) {
      for (j = 0; j < boardSize; j++) {
          delete gameBoard[i][j];
      }
    }
  }
  //creates new board
  gameBoard = createBoard();
  createdGameBoard = true;

  displayPieces(gameBoard);
  turn = "Black";
  showTurn();
  showTileCount();
}

//play two player mode
function TwoPlayerMode() {
  playAI = false;
  resetBoard();
  showGameMode('2-Player Mode');
}
//play against an AI
function AIMode() {
  playAI = true;
  resetBoard();
  showGameMode('AI Mode');
}

//show winner
function displayWinner() {
  winner = determineWinner(gameBoard);
  var winMessage = document.getElementById('turn');
  winMessage.removeChild(winMessage.childNodes[0]);

  if (winner == 'draw') {
    console.log('The result is a ' + winner);
    var drawTag = document.createTextNode('The result is a ' + winner)
    winMessage.appendChild(drawTag);
  }
  else {

    console.log(winner + ' player wins!');
    var winTag = document.createTextNode(winner + ' player wins!');
    winMessage.appendChild(winTag);
  }
}


function availableMoveNotInDangerZone(color) {
  var i,j;

  for (i=0; i<boardSize; i++) {
    for (j=0; j<boardSize; j++)  {
      
    if (!(i== 1 && j== 1) && !(i==1&&j==6) &&!(i==6 && j==1) && !(i==6 && j ==6)) {
      if (gameBoard[i][j].color == 'empty' && checkAllLegalDirections(gameBoard, i, j, color)) 
        return true;
    }
  }
}
  return false;
}


function cornerTaken(row,col) {

  if ((row == 1 && col == 1)){
    if (gameBoard[0][0].color == 'empty') 
      return false;
  }
  else if ((row == 1 && col == 6)) {
    if (gameBoard[0][7].color == 'empty') 
      return false;
  }

  else if ((row == 6 && col == 1)) {
    if (gameBoard[7][0].color == 'empty') 
      return false;
  }

  else if ((row == 6 && col == 6)) {
    if (gameBoard[7][7].color == 'empty') 
      return false;
  }
  return true;
  
}

//danger zone if one diagonal away from corner
function checkDangerZones(row,col) {

  if ((row == 1 && col == 1) || (row==1&&col==6) || (row==6 && col==1) || (row==6 && col ==6)) {
    return true;
  }

  return false;
}

function computerPlayTurn(color) {
  debugger;

  position = advancedComputerMove(gameBoard, color);
  rowComputer = position.row;
  colComputer = position.col;
  
  //play move
  gameBoard[rowComputer][colComputer].color  = color;
  flipTileDirections(gameBoard, rowComputer, colComputer,color);
  displayPieces(gameBoard);
  showTileCount();
}

function ComputerPlay(color) {
  //get move
   computerPlayTurn(turn);

  //check if game can still be played.
  if (isBoardFull(gameBoard) == false && (isValidMove(gameBoard,turn)|| isValidMove(gameBoard, oppositeColor(turn)))) {

    //if human player has a turn
    if (isValidMove(gameBoard, oppositeColor(turn))) {
      changeTurns();
      showTurn();

    }
    else if (isValidMove(gameBoard, turn)) {

        while(isValidMove(gameBoard,turn)) {
        
        currentTurn = turn;
        setTimeout(function() {computerPlayTurn(currentTurn) },1000);

        //check if opposing player can play
        if(isValidMove(gameBoard,oppositeColor(turn))) {
          changeTurns();
          showTurn();
          break;
        }
        //either no one has a turn or board full 
        else if (isBoardFull(gameBoard) == true || isValidMove(gameBoard,turn) == false) {
          displayWinner();
        }
      }
    }
  }
  else {
      displayWinner();
  }
}

function checkValidAndFlip (board, row, col,deltaRow, deltaCol) {
  var countTiles=0;
  var newRow, newCol;

  newRow = row + deltaRow;
  newCol = col + deltaCol;

  while (positionInBounds(board, newRow, newCol) && board[newRow][newCol].color == oppositeColor(turn)) {
    countTiles++;
    newRow += deltaRow;
    newCol += deltaCol;
}


return countTiles;
}

function isCorner(row,col) {
  if ((row == 0 && col == 0) || (row == 0 && col == 7) || (col == 0 && row==7) || (col==7 && row==7)) {
    return true;
  }
  return false;

}

function advancedComputerMove(board, color) {
  var i,j;
  
   var firstTime =true;
   var countTiles=0, maximumTiles=0, minimumTiles=0;
   var maxRowPosition=0, minRowPosition=0, maxColPosition=0, minColPosition=0;
   var topleft=0, top=0, topright=0, left=0, right=0, bottomleft=0, bottom=0, bottomright=0;

   const positionReturn ={};

   const corners = [];
   var cornerTiles= [];

  for (i = 0; i<boardSize; i++) {
      for (j=0; j<boardSize; j++) {

          if (board[i][j].color == 'empty') {

            //skip danger zone 
              if (checkDangerZones(i,j) && cornerTaken(i,j) == false) {
                if(availableMoveNotInDangerZone(turn)){
                  continue;
                }
              }

              deltaRow = -1;
              deltaCol = -1;
              legalNorthWest = checkLegalInDirection(board, i, j, deltaRow, deltaCol, color);
              if (legalNorthWest)
                  topleft = checkValidAndFlip (board, i, j,  deltaRow, deltaCol);

              deltaRow = -1;
              deltaCol = 0;
              legalNorth = checkLegalInDirection(board, i, j, deltaRow, deltaCol, color);
              if (legalNorth)
                  top = checkValidAndFlip (board, i, j,  deltaRow, deltaCol);

              deltaRow = -1;
              deltaCol = 1;
              legalNorthEast = checkLegalInDirection(board, i, j, deltaRow, deltaCol, color);
              if (legalNorthEast)
                  topright = checkValidAndFlip (board, i, j,  deltaRow, deltaCol);

              deltaRow = 0;
              deltaCol = -1;
              legalWest = checkLegalInDirection(board, i, j, deltaRow, deltaCol, color);
              if (legalWest)
                  left = checkValidAndFlip (board, i, j,  deltaRow, deltaCol);

              deltaRow = 0;
              deltaCol = 1;
              legalEast = checkLegalInDirection(board, i, j, deltaRow, deltaCol, color);
              if (legalEast)
                  right = checkValidAndFlip (board, i, j,  deltaRow, deltaCol);

              deltaRow = 1;
              deltaCol = -1;
              legalBottomWest = checkLegalInDirection(board, i, j, deltaRow, deltaCol, color);
              if (legalBottomWest)
                  bottomleft = checkValidAndFlip (board, i, j,  deltaRow, deltaCol);

              deltaRow = 1;
              deltaCol = 0;
              legalBottom = checkLegalInDirection(board, i, j, deltaRow, deltaCol, color);
              if (legalBottom)
                  bottom = checkValidAndFlip (board, i, j,  deltaRow, deltaCol);

              deltaRow = 1;
              deltaCol = 1;
              legalBottomEast =checkLegalInDirection(board, i, j, deltaRow, deltaCol, color);

              if (legalBottomEast)
                  bottomright = checkValidAndFlip (board, i, j,  deltaRow, deltaCol);

              countTiles = topleft + top + topright + left + right + bottomleft + bottom + bottomright;
            
              //push corner moves in an array
              if(countTiles > 0 && isCorner(i,j) == true) {
                const objectPosition = {};
                objectPosition.row = i;
                objectPosition.column = j;
                corners.push(objectPosition);
                cornerTiles.push(countTiles);

              }
                    
              if ((countTiles > maximumTiles)) {
                maximumTiles = countTiles;
                maxRowPosition = i; 
                maxColPosition = j;                                                                                                                                                                                                                      
              }
  
              countTiles = 0;
              topleft = 0, top = 0, topright = 0, left = 0, right = 0, bottomleft = 0, bottom = 0, bottomright = 0;
          }
         
      }
  }
if (corners.length != 0) {
   
  //if there are corners, take the corner with the most tiles you can flip
    var z;
    var maxTilesCorner=0;

  for (z=0; z<corners.length;z++) {
      if (cornerTiles[z] >maxTilesCorner)  {
        maxTilesCorner = cornerTiles[z];
        maxRowPosition = corners[z].row;
        maxColPosition = corners[z].column;
       
      }
    }

  }


positionReturn.row = maxRowPosition;
positionReturn.col = maxColPosition;

return positionReturn;

}

function displayPieces(board) {
  var i,j;

  for (i=0; i<boardSize; i++) {
    for (j=0; j<boardSize; j++) {
      if (board[i][j].color == 'Black')
        document.getElementById(String(i) + String(j)).firstChild.className = "Black";
      else if (board[i][j].color == 'White')
        document.getElementById(String(i) + String(j)).firstChild.className = "White";   
      else 
      //won't discard previous formatting.
        document.getElementById(String(i) + String(j)).firstChild.className = "empty"; 
      }
  }
}

function getRow(id, board) {
  var i,j;
  for (i=0; i<boardSize; i++) {
    for (j=0; j<boardSize;j++) {
        if (board[i][j].id == id) {
          return i; //return row
        }
    }
  }
}

function getColumn(id, board) {
  var i,j;
  for (i=0; i<boardSize; i++) {
    for (j=0; j<boardSize;j++) {
        if (board[i][j].id == id) {
          return j; //return column
        }
    }
  }
}

function positionInBounds(board, row, col){

  if (((row>=0)&&(col>=0)) && ((row<boardSize)&& (col<boardSize))) {
    //within bounds
    return true;
  }
  else {
    
    return false;
  }
}

function checkLegalInDirection(board, row, col, deltaRow, deltaCol, color){

  var newRow, newCol;

  newRow = row + deltaRow;
  newCol = col + deltaCol;

  while (positionInBounds(board, newRow, newCol) && board[newRow][newCol].color == oppositeColor(color)) {
   
    newRow += deltaRow;
    newCol += deltaCol;

    if(positionInBounds(board, newRow, newCol) && board[newRow][newCol].color == color) {
      return true;
    }
  }
    return false;

}

function checkAllLegalDirections(board, row, col, color) {

  deltaRow = -1;
  deltaCol = -1;

  legalNorthWest = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  deltaRow = -1;
  deltaCol = 0;

  legalNorth = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  deltaRow = -1;
  deltaCol = 1;

  legalNorthEast = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  deltaRow = 0;
  deltaCol = -1;

  legalWest = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  deltaRow = 0;
  deltaCol = 1;

  legalEast = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  deltaRow = 1;
  deltaCol = -1;

  legalBottomWest = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  deltaRow = 1;
  deltaCol = 0;

  legalBottom = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  deltaRow = 1;
  deltaCol = 1;

  legalBottomEast = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  if (legalBottomEast || legalBottom || legalBottomWest || legalWest || legalEast || legalNorthEast || legalNorth || legalNorthWest) {
      return true;
  }

  else {
      return false;
  }

}

function isValidMove(board, color) {
 
  var i,j;

  for (i=0; i<boardSize; i++) {
    for (j=0; j<boardSize; j++)  {
      
      if (board[i][j].color == 'empty' && checkAllLegalDirections(board, i, j, color)) 
        return true;
    }
  }
  return false;

}

function changeTurns (){
  if (turn == 'Black')
    turn = 'White';
  else
    turn = 'Black';
}

function oppositeColor(color) {
  if (color == 'Black')
    color = 'White';
  else
    color = 'Black';

  return color;
}

//game function

function flipTileInDirection(board, row, col, deltaRow, deltaCol) {

  var newRow, newCol;

  newRow = row + deltaRow;
  newCol = col + deltaCol;

  while (positionInBounds(board, newRow, newCol) && board[newRow][newCol].color == oppositeColor(turn)) {
   
    board[newRow][newCol].color = turn;
    newRow += deltaRow;
    newCol += deltaCol;
  }
}

function flipTileDirections(board, row, col, color) {

  deltaRow = -1;
  deltaCol = -1;
  legalNorthWest = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);

  if (legalNorthWest)
      flipTileInDirection(board, row, col, deltaRow, deltaCol);

  deltaRow = -1;
  deltaCol = 0;

  legalNorth = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);
  if (legalNorth)
      flipTileInDirection(board, row, col, deltaRow, deltaCol);

  deltaRow = -1;
  deltaCol = 1;

  legalNorthEast = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);
  if (legalNorthEast)
      flipTileInDirection(board, row, col, deltaRow, deltaCol);

  deltaRow = 0;
  deltaCol = -1;

  legalWest = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);
  if (legalWest)
    flipTileInDirection(board, row, col, deltaRow, deltaCol);

  deltaRow = 0;
  deltaCol = 1;

  legalEast = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);
  if (legalEast)
    flipTileInDirection(board, row, col, deltaRow, deltaCol);

  deltaRow = 1;
  deltaCol = -1;
  legalBottomWest =checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);
  if (legalBottomWest)
    flipTileInDirection(board, row, col, deltaRow, deltaCol);

  deltaRow = 1;
  deltaCol = 0;

  legalBottom = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);
  if (legalBottom)
    flipTileInDirection(board, row, col, deltaRow, deltaCol);

  deltaRow = 1;
  deltaCol = 1;

  legalBottomEast = checkLegalInDirection(board, row, col, deltaRow, deltaCol, color);
  if (legalBottomEast)
    flipTileInDirection(board, row, col, deltaRow, deltaCol);

}

function selectedEmptyCell(row, column, board) {
 
  if (board[row][column].color == 'empty')
    return true;
  else
    return false;
}

function gameFunction(clicked_id) {

  if (turn == 'Black' || playAI == false) {
 
    
  //create gameboard the first time.
  if (createdGameBoard == false) {
    gameBoard = createBoard();
    createdGameBoard = true;
    //displayPieces(gameBoard);
  }

  //accessing row,col position corresponding to clicked element
  row = getRow(clicked_id, gameBoard);
  column = getColumn(clicked_id, gameBoard);

  //While board is not full, and the selected move is legal

  if(isBoardFull(gameBoard) == false && checkAllLegalDirections(gameBoard, row, column, turn)== true && selectedEmptyCell(row, column, gameBoard) == true) {

    //flip tiles
    gameBoard[row][column].color = turn;
    flipTileDirections(gameBoard,row,column, turn);
    displayPieces(gameBoard);
    showTileCount();
    debugger;

    debugger;
    if (isBoardFull(gameBoard) == false && (isValidMove(gameBoard,turn)|| isValidMove(gameBoard, oppositeColor(turn)))) {
      //change turns if there's a possible move for other color
        debugger;
        if (isValidMove(gameBoard,oppositeColor(turn))) {
          
          //Change 'currently playing' color
          changeTurns();
          showTurn();
          
          if (playAI == true) {
            setTimeout(ComputerPlay, 1000);
          }

        }
    }
    //game's over
    else {
        displayWinner();
    }
  }
}
}


function countNumberOfBlackTiles(board) {

  var countBlackTiles=0;
  var i,j;

  for (i=0; i<boardSize; i++) {
    for (j=0; j<boardSize; j++){
      if (board[i][j].color == 'Black') {
        countBlackTiles++;
      }
    }
  }
  return countBlackTiles;

}

function countNumberOfWhiteTiles(board) {

  var countWhiteTiles=0;
  var i,j;

  for (i=0; i<boardSize; i++) {
    for (j=0; j<boardSize; j++){
      if (board[i][j].color == 'White') {
        countWhiteTiles++;
      }
    }
  }
  return countWhiteTiles;

}

function determineWinner(board) {

  var countBlackTiles=0;
  var countWhiteTiles =0;
  var i,j;

  for (i=0; i<boardSize; i++) {
    for (j=0; j<boardSize; j++){
      if (board[i][j].color == 'Black') {
        countBlackTiles++;
      }
      else if (board[i][j].color == 'White') {
        countWhiteTiles++;
      }
    }
  }
  if (countBlackTiles > countWhiteTiles) {
    return 'Black';
  }
  else if (countWhiteTiles > countBlackTiles) {
    return 'White';
  }
  else
    return 'draw';
  
}