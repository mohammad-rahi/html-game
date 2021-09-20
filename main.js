'use strict';
let hero, score = 0;
const obstacles = [];
const coins = [];

function loadGame() {
  hero = new component(window.innerWidth / 2.5, 170, "angry1.png", 40, 40, "img");
  area.load();
}

function startGame(t) {
  t.parentElement.style.visibility = "hidden"
  document.querySelector('#bg').play();
  setInterval(() => score++, 350);
  area.start();
}

const area = {
  canvas: document.getElementById('canvas'),
  load: function() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = 300;
  },
  start: function() {
    this.context = this.canvas.getContext('2d');
    this.frameNo = 0;
    this.interval = setInterval(updateArea, 20);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function() {
    clearInterval(this.interval);
  }

}

function component(x, y, clr, w, h, type) {
  this.type = type;
  if (type == "img") {
    this.img = new Image();
    this.img.src = clr;
  }
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.update = function() {
    let ctx = area.canvas.getContext('2d');
    if (this.type == "img") {
      ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
    }
    else {
      ctx.fillStyle = clr;
      ctx.font = "30px Arial";
      ctx.fillText(`Score: ${score}`, 250, 50);
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }
  this.newPos = function() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
  this.crashWith = function(ob) {
    let hl = this.x;
    let hr = this.x + (this.w);
    let ht = this.y;
    let hb = this.y + (this.h);

    let obl = ob.x;
    let obr = ob.x + (ob.w);
    let obt = ob.y;
    let obb = ob.y + (ob.h);

    let crash = true;
    if (hl > obr || hr < obl || ht > obb || hb < obt) {
      crash = false;
    }
    return crash;
  }

  this.coinWith = function(coin) {
    let hL = this.x;
    let hR = this.x + (this.w);
    let hT = this.y;
    let hB = this.y + (this.h);

    let coinL = coin.x;
    let coinR = coin.x + (coin.w);
    let coinT = coin.y;
    let coinB = coin.y + (coin.h);

    let point = true;
    if (hL > coinR || hR < coinL || hT > coinB || hB < coinT) {
      point = false;
    }
    return point;
  }

}

function updateArea() {
  let i, x, height, gap, r, g, b, color;
  for (i = 0; i < obstacles.length; ++i) {
    if (hero.crashWith(obstacles[i])) {
      let overlay = document.querySelector('#overlay');
      overlay.style.visibility = "visible";
      overlay.querySelector('button').innerHTML = `Score: ${score} <br>  Restart`;
      document.getElementById('bg').pause();
      document.getElementById('over').play();
      area.stop();
      return;
    }
  }

  for (i = 0; i < coins.length; ++i) {
    if (hero.coinWith(coins[i])) {
      document.getElementById('coinSound').play();
      score += 20;
      coins.pop(i);
    }
  }

  area.clear();

  area.frameNo += 1;
  if (area.frameNo == 1 || everyInterval(150)) {
    x = area.canvas.width;
    height = Math.floor(Math.random() * (200 - 26) + 25);
    gap = Math.floor(Math.random() * (150 - 51) + 50);
    r = Math.floor(Math.random() * (255 - 1));
    g = Math.floor(Math.random() * (255 - 1));
    b = Math.floor(Math.random() * (255 - 1));
    color = `rgb(${r}, ${g}, ${b})`;
    obstacles.push(new component(x, 0, color, 10, height));
    coins.push(new component(x + height, height, "coins.png", 30, 30, "img"))
    obstacles.push(new component(x, height + gap + 50, color, 10, x - height - gap));
  }
  for (i = 0; i < obstacles.length; ++i) {
    obstacles[i].x -= 2.3;
    obstacles[i].update();
  }

  for (i = 0; i < coins.length; ++i) {
    coins[i].x -= 1;
    coins[i].update();
  }

  hero.x -= .5;
  hero.newPos();
  hero.update();
}

function everyInterval(n) {
  if ((area.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

function move(dir) {
  if (dir == "up") {
    hero.speedY -= 1;
  }
  if (dir == "down") {
    hero.speedY += 1;
  }
  if (dir == "left") {
    hero.img.src = "angry3.png";
    hero.speedX -= 1;
  }
  if (dir == "right") {
    hero.img.src = "angry2.png";
    hero.speedX += 1;
  }
}

function clearMove() {
  hero.img.src = "angry1.png";
  hero.speedX = 0;
  hero.speedY = 0;
}