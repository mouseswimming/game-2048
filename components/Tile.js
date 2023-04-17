export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(tileContainer, value = Math.random() > 0.5 ? 2 : 4) {
    this.#tileElement = document.createElement("div");
    this.#tileElement.classList.add("tile");

    this.value = value;
    tileContainer.append(this.#tileElement);
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#tileElement.textContent = v;
    this.#value = v;
    const power = Math.log2(v);

    const bgLightness = 100 - power * 9;
    this.#tileElement.style.setProperty(
      "--cell-bg-lightness",
      `${bgLightness}%`
    );
    this.#tileElement.style.setProperty(
      "--cell-text-lightness",
      `${bgLightness <= 50 ? 90 : 0}%`
    );
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty("--x", value);
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty("--y", value);
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition(isAnimation = false) {
    return new Promise((resolove) => {
      this.#tileElement.addEventListener(
        isAnimation ? "animationend" : "transitionend",
        resolove,
        {
          once: true,
        }
      );
    });
  }
}
