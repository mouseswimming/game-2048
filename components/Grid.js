import Cell from "./Cell";

// const gridSize = 4;
// const cellSize = 20;
// const cellGap = 2;

let gridSize, cellGap, cellSize, fontSize;

export default class Grid {
  // make cells a private variables
  #cells;

  constructor(gridElement, _gridSize = 4) {
    gridSize = _gridSize;
    cellGap = gridSize > 6 ? 1 : 2;
    cellSize = Math.floor((90 - (gridSize - 1) * cellGap) / gridSize);
    fontSize = Math.round(((8 * 4) / gridSize) * 10) / 10;

    console.log({ gridSize, cellGap, cellSize, fontSize });

    gridElement.style.setProperty("--grid-size", gridSize);
    gridElement.style.setProperty("--cell-size", `${cellSize}vmin`);
    gridElement.style.setProperty("--cell-gap", `${cellGap}vmin`);
    gridElement.style.setProperty("--font-size", `${fontSize}vmin`);

    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % gridSize,
        Math.floor(index / gridSize)
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

  for (let i = 0; i < gridSize ** 2; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cells.push(cell);

    gridElement.append(cell);
  }

  return cells;
}
