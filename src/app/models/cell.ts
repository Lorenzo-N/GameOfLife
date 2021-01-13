export class Cell {
  private neighbors = 0;

  constructor(public value: number) {
  }

  toggle(): void {
    this.value = (this.value + 1) % 2;
  }

  setNeighbors(neighbors: number): void {
    this.neighbors = neighbors;
  }

  update(): void {
    if (this.value === 1 && this.neighbors <= 1) {
      // isolation
      this.value = 0;
    } else if (this.value === 1 && this.neighbors >= 4) {
      // overpopulation
      this.value = 0;
    } else if (this.value === 1) {
      // survive
      this.value = 1;
    } else if (this.value === 0 && this.neighbors === 3) {
      // born
      this.value = 1;
    }
  }
}
