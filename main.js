import "./style.css";
import Grid from "./components/Grid";
import Tile from "./components/Tile";

const gameBoard = document.getElementById("game-board");
let grid;
initGame(4);

function initGame(gridSize) {
  grid = new Grid(gameBoard, gridSize);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);

  setupInput();
}

const gridOptions = document.querySelector(".grid-options");
gridOptions.addEventListener("click", (e) => {
  if (!e.target.classList.contains("grid-size")) return;

  const gridSize = parseInt(e.target.getAttribute("data-grid-size"), 10);

  e.target.parentElement
    .querySelectorAll(".grid-size")
    .forEach((button) => button.classList.remove("selected"));
  e.target.classList.add("selected");

  gameBoard.innerHTML = "";
  initGame(gridSize);
});

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowDown":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowLeft":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowRight":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;

    default:
      // return if user input is not any of up/down/left/right
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;

  // console.log(
  //   "left: ",
  //   canMoveLeft(),
  //   " ,right: ",
  //   canMoveRight(),
  //   ", up: ",
  //   canMoveUp(),
  //   ", down: ",
  //   canMoveDown()
  // );

  if (!canMoveLeft() && !canMoveRight() && !canMoveDown() && !canMoveUp()) {
    console.log("can not move anymore");
    newTile.waitForTransition(true).then(() => {
      alert("You lose!");
    });
    return;
  }

  setupInput();
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column.reverse()]));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row.reverse()]));
}

function canMove(cells) {
  return cells.some((columnGrid) => {
    return columnGrid.some((cell, index) => {
      // can't move the first cell
      if (index === 0) return false;
      // can't move an empty cell
      if (cell.tile == null) return false;

      const targetCell = columnGrid[index - 1];
      return targetCell.canAccept(cell.tile);
    });
  });
}

function moveUp() {
  slideTiles(grid.cellsByColumn);
}

function moveDown() {
  slideTiles(grid.cellsByColumn.map((column) => [...column.reverse()]));
}

function moveLeft() {
  slideTiles(grid.cellsByRow);
}

function moveRight() {
  slideTiles(grid.cellsByRow.map((row) => [...row.reverse()]));
}

function slideTiles(cells) {
  const promises = [];
  cells.forEach((group) => {
    // start from second cell
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];
      // if the cell has no tile, don't do anything
      if (cell.tile == null) continue;
      let lastValidCell;
      // check all the cell above i, to see can we move up
      for (let j = i - 1; j >= 0; j--) {
        const targetCell = group[j];
        // start from the cell closest to the org cell
        // check whether it can accept the org cell's tile
        // if can not, there is no need to continue
        if (!targetCell.canAccept(cell.tile)) break;
        lastValidCell = targetCell;
      }

      if (lastValidCell != null) {
        promises.push(cell.tile.waitForTransition());
        if (lastValidCell.tile != null) {
          // when lastValidCell has tile already, merge happens
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }

        cell.tile = null;
      }
    }
  });

  return Promise.all(promises);
}
