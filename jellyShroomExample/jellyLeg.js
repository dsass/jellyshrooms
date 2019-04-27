      let s1, s2, s3, s4, s5;
      let s = [];
      let gravity = 5.0;
      let mass = 1.0;
      let ellipseCount = 10;

      function setup() {
        createCanvas(720, 400);
        fill(255, 126);
        // Inputs: x, y, mass, gravity
        
        for (i = 0; i < ellipseCount; i++) {
          s[i] = new Spring2D(0.0, width / 2, mass, gravity);
          

      }
      }

      function draw() {
        background(55);

        s.forEach((n, i, a) => {
          if (!i) {
            n.update(mouseX, mouseY);
            n.display(mouseX, mouseY);
            return;
          }
          n.update(a[i-1].x, a[i-1].y);
          n.display(a[i-1].x, a[i-1].y);
        });
        
      }

      function Spring2D(xpos, ypos, m, g) {
        this.x = xpos;// The x- and y-coordinates
        this.y = ypos;
        this.vx = 0; // The x- and y-axis velocities
        this.vy = 0;
        this.mass = m;
        this.gravity = g;
        this.radius = 1;
        this.stiffness = 0.7;
        this.damping = 0.2;

        this.update = function(targetX, targetY) {
          let forceX = (targetX - this.x) * this.stiffness;
          let ax = forceX / this.mass;
          this.vx = this.damping * (this.vx + ax);
          this.x += this.vx;
          let forceY = (targetY - this.y) * this.stiffness;
          forceY += this.gravity;
          let ay = forceY / this.mass;
          this.vy = this.damping * (this.vy + ay);
          this.y += this.vy;
        }

        this.display = function(nx, ny) {
          noStroke();
          ellipse(this.x, this.y, this.radius, this.radius);
          stroke(255);
          line(this.x, this.y, nx, ny);
        }
      }