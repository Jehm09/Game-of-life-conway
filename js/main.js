"use strict";
const canvas = document.getElementById("tablero");
const pen = canvas.getContext("2d");
const size = 20;
const rowCount = canvas.height / size;
const colCount = canvas.width / size;
var stopped = true;
var intervalId;
var logicMatrix = [];
var logicMatrixCopy = [];

console.log(rowCount);
console.log(colCount);

function drawGame() {
  for (var row = 0; row < rowCount; row++) {
    for (var col = 0; col < colCount; col++) {
      let lives = countLivesCells(row, col, logicMatrix);
      logicGame(row, col, lives);

      if (logicMatrixCopy[row][col]) {
        drawLiveCell(row, col);
      } else {
        drawDeadCell(row, col);
      }
    }
  }
}

function getCanvasPosition(event) {
  if (event.button === 0) {
    let positions = getMousePos(event);
    let col = parseInt(positions.x / size);
    let row = parseInt(positions.y / size);
    if (logicMatrix[row][col]) {
      logicMatrix[row][col] = 0;
      logicMatrixCopy[row][col] = 0;
      drawDeadCell(row, col, logicMatrix);
    } else {
      logicMatrix[row][col] = 1;
      logicMatrixCopy[row][col] = 1;
      drawLiveCell(row, col, logicMatrix);
    }
  }
}

function changeGameStatus(event) {
  if (event.keyCode === 32) {
    if (stopped) {
      stopped = false;
      // draw the game every {intervalMs}
      var intervalMs = 500;
      intervalId = setInterval(step, intervalMs);
    } else {
      stopped = true;
      window.clearInterval(intervalId);
    }
    console.log(stopped);
  }
}

function drawLiveCell(row, col) {
  pen.fillStyle = "#FFFFFF";
  pen.fillRect(col * size, row * size, size, size);
}

function drawDeadCell(row, col) {
  pen.fillStyle = "#000000";
  pen.fillRect(col * size, row * size, size, size);
}

function getMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top,
  };
}

function initLogicalMatrix() {
  for (var row = 0; row < rowCount; row++) {
    logicMatrix[row] = [];
    logicMatrixCopy[row] = [];
    for (var col = 0; col < colCount; col++) {
      logicMatrix[row].push(0); // 0 dead cells 1 live cells
      logicMatrixCopy[row].push(0); // 0 dead cells 1 live cells
    }
  }
}

function countLivesCells(row, col, matrix) {
  let lives = 0;
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let tempI = mod(row + i, rowCount);
      let tempJ = mod(col + j, colCount);
      if (i === 0 && j === 0) {
        continue;
      } else if (matrix[tempI][tempJ]) {
        lives++;
      }
    }
  }

  return lives;
}

function logicGame(row, col, lives) {
  // Rule 1 si eres una celda muerta y tienes tres vecinas vivas revive
  // Rule 2 si eres una celda viva con menos de 2 o mas de 3 vecinos morira
  if (logicMatrix[row][col] === 0 && lives === 3) {
    logicMatrixCopy[row][col] = 1;
  } else if (logicMatrix[row][col] && (lives < 2 || lives > 3)) {
    logicMatrixCopy[row][col] = 0;
  }
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

function copyMatrix(matrixOrgin, matrixCopy) {
  for (var row = 0; row < rowCount; row++) {
    for (var col = 0; col < colCount; col++) {
      matrixCopy[row][col] = matrixOrgin[row][col];
    }
  }
}

var step = function () {
  drawGame();
  copyMatrix(logicMatrixCopy, logicMatrix);
};

initLogicalMatrix();
