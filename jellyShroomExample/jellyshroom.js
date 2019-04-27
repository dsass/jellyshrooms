let jellyShrooms = [];

function setup() {
  createCanvas(710, 400);
  jellyShrooms.push(
    // new JellyShroom(random(-500, 0), random(10, 100)),
    // new JellyShroom(random(-400, 0), random(10, 100)),
    // new JellyShroom(random(-300, 0), random(10, 100)),
    // new JellyShroom(random(-300, 0), random(10, 100)),
    // new JellyShroom(random(10, 100), random(10, 100)),
    new JellyShroom(random(10, 100), random(10, 100)),
    // new JellyShroom(random(200, 200), random(10, 100)),
    // new JellyShroom(random(300, 200), random(10, 100)),
  );
}
function draw() {
  background(0,0,0, 40);

  jellyShrooms.forEach(n => n.update());

  //- shell.stepAndDraw();
  //- tentacles.forEach(n => n.stepAndDraw());
}

class JellyShroom {
  constructor(startX = 100, startY = 100, startAngle = 0, 
    $shroomLuminscence = document.querySelector('.great'),
    $jellyfishLuminscence = document.querySelector('.jelly-great'),
    ) {
    this.$shroomLuminscence = $shroomLuminscence;
    this.$jellyfishLuminscence = $jellyfishLuminscence;
    this.coords = {
      x: startX,
      y: startY,
      angle: startAngle,
    };
    this.mode = 'mushroom'; // 'mushroom', 'jellyfish' or 'growth'

    this.shell = new Shell(200, 100, 0, this); // fix magic numbers
    this.tentacles = [
      new Tentacle(50, -190, 0, this),
      new Tentacle(20, -190, 0, this),
      new Tentacle(40, -190, 0, this),
      new Tentacle(70, -190, 0, this),
    ];
    this.phaseSeed = Math.random()*100;
    this.scale = random(0.2, 1.2);
    this.count = 0;
    window.wat = this
  }
  update() {
     switch (this.mode) {
       case 'mushroom':
         this._updateMushroom();
         break;
       case 'jellyfish':
         this._updateJellyfish();
         break;

     }
  }
  toJellyfish() {

  }
  toMushroom() {

  }

  _updateMushroom() {
    this.count += 0.1;
    push()
    scale(this.scale);
    // this.coords.x = this.coords.x - Math.sin(frameCount/10+this.phaseSeed)*10;
    // this.coords.y = this.coords.y - Math.cos(frameCount/4+this.phaseSeed)*10;
    this.shell.stepAndDraw();
    this.tentacles.forEach(n => n.stepAndDraw());
    pop();
  }
  _updateJellyfish() {
    this.count += 0.1;
    push()
    scale(this.scale);
    this.coords.x = this.coords.x - Math.sin(frameCount/10+this.phaseSeed)*10;
    this.coords.y = this.coords.y - Math.cos(frameCount/4+this.phaseSeed)*10;
    this.shell.stepAndDraw();
    this.tentacles.forEach(n => n.stepAndDraw());
    pop();
  }
}

class Shell {
  constructor(startX = 200, startY = 100, startAngle = 0, parent) {
    this.parent = parent;
    this.parentCoords = parent.coords;
    this.startX = startX; //+ parentCoords.x;
    this.startY = startY; //+ parentCoords.y;
    this.startAngle = startAngle;

    // Currently unused
    //- this.xt = startX;
    //- this.yt = startX;
    //- this.rt = startAngle;
  }

  stepAndDraw() {
    switch (this.parent.mode) {
       case 'mushroom':
         this._updateMushroom();
         break;
       case 'jellyfish':
         this._updateJellyfish();
         break;
    }
  }

  _updateMushroom() {
    const realX = this.startX + this.parentCoords.x;
    const realY = this.startY + this.parentCoords.y;
    push();
    strokeWeight(10);
    translate(realX + 200, realY + 100);
    // rotate(Math.cos(frameCount/40)/20);
    translate(-realX-150, -realY-160);
    if (frameCount < 3) {
      return;
    }
    fill(200, 200, 200, 150);
    bezier(
      100 + realX, // x1
      150 + realY, // y1
      50 + realX,// + Math.sin(frameCount/10)*10,  // cpx1
      250 + realY,// + Math.sin(frameCount/20)*5,  // cpy2
      250 + realX, //- Math.sin(frameCount/10)*10, // cpx2
      250 + realY,// + Math.sin(frameCount/20)*5,  // cpy2// cpy2
      200 + realX, // x2 
      150 + realY, // y2
    );
    pop();
  }

  _updateJellyfish() {
    const realX = this.startX + this.parentCoords.x;
    const realY = this.startY + this.parentCoords.y;
    push();
    strokeWeight(10);
    translate(realX + 200, realY + 100);
    rotate(Math.cos(frameCount/40)/20);
    translate(-realX-150, -realY-160);
    if (frameCount < 3) {
      return;
    }
    fill(200, 200, 200, 150);
    bezier(
      100 + realX, // x1
      150 + realY, // y1
      50 + realX + Math.sin(frameCount/10)*10,  // cpx1
      250 + realY + Math.sin(frameCount/20)*5,  // cpy2
      250 + realX - Math.sin(frameCount/10)*10, // cpx2
      250 + realY + Math.sin(frameCount/20)*5,  // cpy2// cpy2
      200 + realX, // x2 
      150 + realY, // y2
    );
    pop();
  }
}


class Tentacle {
  constructor(startX, startY, startAngle, parent) {
      this.parent = parent;
      this.parentCoords = parent.coords;
      this.numSegments = 8;
      this.x = [];
      this.y = [];
      this.angle = [];
      this.segLength = 26;
      this.targetX;
      this.targetY;
      this.ballX = startX;
      this.ballY = 196;
      this.xt = startX;
      this.yt = startY;
      this.rt = startAngle;
      this.startX = startX;
      this.startY = startY;
      this.startAngle = startAngle;
      this.phaseSeed = Math.random()*100;
      window.wat = this;      
      this._initCoords();
  }
  _initCoords() {
    for (let i = 0; i < this.numSegments; i++) {
      this.x[i] = 0;
      this.y[i] = 0;
      this.angle[i] = 0;
    }
    this.x[this.x.length - 1] = 
      width / 2; // Set base x-coordinate
    this.y[this.x.length - 1] = 
      height; // Set base y-coordinate
  }
  stepAndDraw() {
    switch (this.parent.mode) {
       case 'mushroom':
         this._updateMushroom();
         break;
       case 'jellyfish':
         this._updateJellyfish();
         break;
    }

  }

  _updateMushroom() {
     const realX = this.startX + this.parentCoords.x;
     const realY = this.startY + this.parentCoords.y;
     push();
     stroke(255, 100);
     // this._moveBall();
     this.ballX = 355;
     // this.ballX = 355;

     this.ballY = 180;
     this.xt = realX; //+ Math.sin((frameCount + 100 + this.phaseSeed)/10)*4;
     this.yt = realY; //+ Math.sin((frameCount-10 + this.phaseSeed)/20)*4;

     strokeWeight(10);
     //- ellipse(this.ballX+this.xt, this.ballY+this.yt, 10, 10);

     this.reachSegment(0, this.ballX, this.ballY);
     for (let i = 1; i < this.numSegments; i++) {
       this.reachSegment(i, this.targetX, this.targetY);
     }
     for (let j = this.x.length - 1; j >= 1; j--) {
       this.positionSegment(j, j - 1);
     }
     for (let k = 0; k < this.x.length; k++) {
       this.segment(this.x[k], this.y[k], this.angle[k], (k + 1) * 2);
     }
     pop();

  }

  _updateJellyfish() {
    const realX = this.startX + this.parentCoords.x;
    const realY = this.startY + this.parentCoords.y;
    push();
    stroke(255, 100);
    this._moveBall();
    this.xt = realX + Math.sin((frameCount + 100 + this.phaseSeed)/10)*4;
    this.yt = realY + Math.sin((frameCount-10 + this.phaseSeed)/20)*4;

    strokeWeight(10);
    //- ellipse(this.ballX+this.xt, this.ballY+this.yt, 10, 10);

    this.reachSegment(0, this.ballX, this.ballY);
    for (let i = 1; i < this.numSegments; i++) {
      this.reachSegment(i, this.targetX, this.targetY);
    }
    for (let j = this.x.length - 1; j >= 1; j--) {
      this.positionSegment(j, j - 1);
    }
    for (let k = 0; k < this.x.length; k++) {
      this.segment(this.x[k], this.y[k], this.angle[k], (k + 1) * 2);
    }
    pop();
  }

  _moveBall() {
    this.ballX = 355 + Math.sin(frameCount/10 + this.phaseSeed)*44;
    this.ballY = 196;
  }

  positionSegment(a, b) {
    this.x[b] = this.x[a] + cos(this.angle[a]) * this.segLength;
    this.y[b] = this.y[a] + sin(this.angle[a]) * this.segLength;
  }

  reachSegment(i, xin, yin) {
    const dx = xin - this.x[i];
    const dy = yin - this.y[i];
    this.angle[i] = atan2(dy, dx);
    this.targetX = xin - cos(this.angle[i]) * this.segLength;
    this.targetY = yin - sin(this.angle[i]) * this.segLength;
  }

  segment(x, y, a, sw) {
    strokeWeight(sw);
    push();
    translate(x + this.xt, y + this.yt);
    rotate(a + this.rt);
    if (frameCount < 3) {
      return;
    }
    line(0, 0, this.segLength, 0);
    pop();
  }
}