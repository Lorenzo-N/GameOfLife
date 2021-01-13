export class Cell {
  constructor(public value: number) {
  }

  toggle(): void {
    this.value = (this.value + 1) % 2;
  }
}
