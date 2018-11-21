const canvas = document.querySelector('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let c = 0;
let d = 1;
let e;

// Object Circle
function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = 3;
    this.gravity = 1.3;
    this.friction = 0.8;
    this.dy2 = 0.5;
}

Star.prototype.draw = function() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = this.color;
    ctx.shadowColor = '#E3EAEF';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

Star.prototype.update = function() {
    this.draw();

    // When star hits bottom or upper edge
    if (this.y + this.radius + this.dy > innerHeight - groundHeight) {
        this.dy = -this.dy * this.friction;
        this.explode()
    } else {
        this.dy += this.gravity;
    }
    // When star hits left or right edge
    if (this.x > innerWidth - this.radius - this.dx || this.x < this.radius) {
        this.dx = -this.dx * this.friction;
        this.explode();
    }
    this.y += this.dy;
    this.x += this.dx;

}

Star.prototype.explode = function() {
    this.radius -= 2;
    for (let i = 0; i < 8; ++i) {
        miniStars[c] = new MiniStar(this.x, this.y, 2);
        c += 1;
    }
}

Star.prototype.rotate = function() {
     this.draw();
     this.y += this.dy2;

}


// MiniStar object
function MiniStar(x, y, radius, color) {
    // Inheriting from Star object
    Star.call(this, x, y, radius, color)
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = (Math.random() - 0.5) * 50;
    this.gravity = 0.4;
    this.friction = 0.8;
    this.halfLife = 100;
    this.opacity = 1;
}

MiniStar.prototype.draw = function() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
    ctx.fillStyle = `rgba(227, 234, 239, ${this.opacity}`;
    ctx.shadowColor = '#E3EAEF';
    ctx.shadowBlur = 20;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
}

MiniStar.prototype.update = function() {
    this.draw();

    // When star hits bottom or upper edge
    if (this.y > innerHeight - this.radius - this.dy - groundHeight || this.y < this.radius) {
        this.dy = -this.dy * this.friction;
    } else {
        this.dy += this.gravity;
    }
    // When star hits left or right edge
    if (this.x > innerWidth - this.radius || this.x < this.radius) {
        this.dx = -this.dx;
    }
    this.y += this.dy;
    this.x += this.dx;
    this.halfLife -= 1;
    this.opacity -= 1 / this.halfLife;

}


function createMountainRange(mountainAmnt, height, range, color) {
    for (let i = 0; i < mountainAmnt; ++i) {
        mountainWidth = innerWidth / mountainAmnt;
        ctx.beginPath();
        ctx.moveTo(i * mountainWidth, innerHeight);
        ctx.lineTo(i * mountainWidth + mountainWidth + range, innerHeight);
        ctx.lineTo(i * mountainWidth + mountainWidth / 2, innerHeight - height);
        ctx.lineTo(i * mountainWidth - range, innerHeight);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}


const backgroundGradient = ctx.createLinearGradient(0, 0, 0, innerHeight);
backgroundGradient.addColorStop(0, '#171e26');
backgroundGradient.addColorStop(1, '#3f586b');

let stars;
let miniStars;
let backgroundStars;
let randomNum = 75;
let randomShower = 0;
const groundHeight = 100;
function init() {
    stars = {};
    miniStars = {};
    backgroundStars = {};
    for (let i = 0; i < 1; ++i) {
        // let radius = Math.random() * 7 + 3;
        let radius = 12;
        let x = radius + Math.random() * (innerWidth - 2 * radius);
        let y = -100;
        let color = '#E3EAEF';
        stars[i] = new Star(x, y, radius, color);
    }

    for (let i = 0; i < 150; ++i) {
        let radius = Math.random() * 3;
        let x = radius + Math.random() * (innerWidth - 2 * radius);
        let y = radius + Math.random() * (innerHeight - 2 * radius);
        // let color = randColors[Math.floor(Math.random() * 6)];
        backgroundStars[i] = new Star(x, y, radius, 'white');
    }


}


function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    for (let key in backgroundStars) {
        backgroundStars[key].rotate();
        if (backgroundStars[key].y >= innerHeight - 20) {
            backgroundStars[key].y = -20;
        }
    }
    createMountainRange(1, innerHeight - 200, 500, '#384551');
    createMountainRange(2, innerHeight - 400, 600, '#2B3843');
    createMountainRange(3, innerHeight - 600, 325, '#26333E');
    ctx.fillStyle = '#182028';
    ctx.fillRect(0, innerHeight - groundHeight, innerWidth, groundHeight)

    for (let star in stars) {
        stars[star].update();
        if (stars[star].radius <= 0) {
            delete stars[star];
        }
    }
    for (let miniStar in miniStars) {
        miniStars[miniStar].update();
        if (miniStars[miniStar].halfLife == 0) {
            delete miniStars[miniStar];
        }
    }

    randomShower ++;

    if (randomShower % randomNum == 0) {
        const radius = 12;
        let x = Math.max(radius, Math.random() * canvas.width - radius);
        let y = -100;
        let color = '#E3EAEF';
        stars[d] = new Star(x, y, radius, color);
        d ++;
    }

}

init();
animate();
