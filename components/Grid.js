import Cell from "./Cell";

const GRID_SIZE = 4;
const CELL_SIZE = 20;
const CELL_GAP = 2;

export default class Grid {
  // make cells a private variables
  #cells;

  constructor(gridElement) {
    gridElement.style.setProperty("--grid-size", GRID_SIZE);
    gridElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`);
    gridElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`);

    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  get cellsByColumn() {
    return this.#cells.reduce((columnGrid, cell) => {
      columnGrid[cell.x] = columnGrid[cell.x] || [];
      // row-column
      columnGrid[cell.x][cell.y] = cell;
      return columnGrid;
    }, []);
  }

  get cellsByRow() {
    return this.#cells.reduce((rowGrid, cell) => {
      rowGrid[cell.y] = rowGrid[cell.y] || [];
      rowGrid[cell.y][cell.x] = cell;
      return rowGrid;
    }, []);
  }

  get cells() {
    return this.#cells;
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);
    return this.#emptyCells[randomIndex];
  }
}

function createCellElements(gridElement) {
  const cells = [];

  for (let i = 0; i < GRID_SIZE ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);

    gridElement.append(cell);
  }

  return cells;
}
