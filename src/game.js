import { Player } from './player.js';
import { Invader } from './invader.js';
import { Bullet } from './bullet.js';

export class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.player = new Player(canvas.width / 2, canvas.height - 60);
    this.bullets = [];
    this.invaders = this.createInvaders();
    this.score = 0;
    this.gameOver = false;
    this.shootSound = new Audio('/sounds/shoot.wav');
    this.explosionSound = new Audio('/sounds/explosion.wav');
    
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.gameLoop();
  }

  createInvaders() {
    const invaders = [];
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        invaders.push(new Invader(col * 50 + 100, row * 50 + 50));
      }
    }
    return invaders;
  }

  handleKeyDown(e) {
    if (this.gameOver) return;

    switch (e.key) {
      case 'ArrowLeft':
        this.player.moveLeft();
        break;
      case 'ArrowRight':
        this.player.moveRight(this.canvas.width);
        break;
      case ' ':
        this.shoot();
        break;
    }
  }

  shoot() {
    if (this.bullets.length < 3) {
      this.bullets.push(new Bullet(this.player.x + this.player.width / 2, this.player.y));
      this.shootSound.currentTime = 0;
      this.shootSound.play();
    }
  }

  checkCollisions() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      for (let j = this.invaders.length - 1; j >= 0; j--) {
        if (this.bullets[i] && this.invaders[j] && this.checkCollision(this.bullets[i], this.invaders[j])) {
          this.explosionSound.currentTime = 0;
          this.explosionSound.play();
          this.bullets.splice(i, 1);
          this.invaders.splice(j, 1);
          this.score += 100;
          break;
        }
      }
    }
  }

  checkCollision(bullet, invader) {
    return bullet.x < invader.x + invader.width &&
           bullet.x + bullet.width > invader.x &&
           bullet.y < invader.y + invader.height &&
           bullet.y + bullet.height > invader.y;
  }

  update() {
    this.bullets = this.bullets.filter(bullet => bullet.y > 0);
    this.bullets.forEach(bullet => bullet.update());
    
    if (this.invaders.length === 0) {
      this.gameOver = true;
    }

    this.checkCollisions();
  }

  draw() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.player.draw(this.ctx);
    this.bullets.forEach(bullet => bullet.draw(this.ctx));
    this.invaders.forEach(invader => invader.draw(this.ctx));

    this.ctx.fillStyle = 'white';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);

    if (this.gameOver) {
      this.ctx.fillStyle = 'white';
      this.ctx.font = '40px Arial';
      this.ctx.fillText('Game Over!', this.canvas.width / 2 - 100, this.canvas.height / 2);
    }
  }

  gameLoop() {
    if (!this.gameOver) {
      this.update();
    }
    this.draw();
    requestAnimationFrame(this.gameLoop.bind(this));
  }
}
