export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 30;
    this.speed = 5;
  }

  moveLeft() {
    this.x = Math.max(0, this.x - this.speed);
  }

  moveRight(canvasWidth) {
    this.x = Math.min(canvasWidth - this.width, this.x + this.speed);
  }

  draw(ctx) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
