const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let c = 1;
let d = 0;

const offCanvas = document.createElement('canvas');
offCanvas.width = 96;
offCanvas.height = 30;
const ctx2 = offCanvas.getContext('2d');
const sxArr = [0, 32, 64];


function offfDraw() {
    ctx2.save();
    ctx2.beginPath();
    ctx2.arc(16, 15, 0.75, 0, Math.PI * 2, false)
    ctx2.fillStyle = 'white';
    ctx2.shadowColor = '#E3EAEF';
    ctx2.shadowBlur = 14;
    ctx2.fill();
    ctx2.closePath();
    ctx2.restore();

    ctx2.save();
    ctx2.beginPath();
    ctx2.arc(48, 15, 1.5, 0, Math.PI * 2, false)
    ctx2.fillStyle = 'white';
    ctx2.shadowColor = '#E3EAEF';
    ctx2.shadowBlur = 14;
    ctx2.fill();
    ctx2.closePath();
    ctx2.restore();

    ctx2.save();
    ctx2.beginPath();
    ctx2.arc(80, 15, 2.5, 0, Math.PI * 2, false)
    ctx2.fillStyle = 'white';
    ctx2.shadowColor = '#E3EAEF';
    ctx2.shadowBlur = 14;
    ctx2.fill();
    ctx2.closePath();
    ctx2.restore();
}


window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})

// Object Circle
function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.dx = (Math.random() - 0.5) * 10;
    this.dy = 3;
    this.gravity = 2;
    this.friction = 0.8;
    this.dy2 = 0.5;
    this.dx2 = 0.2;
    this.sx = sxArr[Math.floor(Math.random() * 3)];
    this.sy = 0;
    this.sWidth = 32;
    this.sHeight = 30;
    this.dWidth = 32;
    this.dHeight = 30;

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
    if (this.y + this.radius + this.dy > canvas.height - groundHeight) {
        this.dy = -this.dy * this.friction;
        this.explode()
    } else {
        this.dy += this.gravity;
    }
    // When star hits left or right edge
    if (this.x > canvas.width - this.radius - this.dx || this.x < this.radius) {
        this.dx = -this.dx * this.friction;
        this.explode();
    }
    this.y += this.dy;
    this.x += this.dx;

}

Star.prototype.explode = function() {
    this.radius -= 3;
    for (let i = 0; i < 5; ++i) {
        miniStars[d] = new MiniStar(this.x, this.y, 2);
        d += 1;
    }
}

Star.prototype.rotate = function() {

     this.y += this.dy2;
     this.x -= this.dx2;
}

Star.prototype.offDraw = function() {
    ctx.drawImage(offCanvas, this.sx, this.sy, this.sWidth, this.sHeight, this.x, this.y, this.dWidth, this.dHeight);
    this.y += this.dy2;
    this.x -= this.dx2;
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
    if (this.y > canvas.height - this.radius - this.dy - groundHeight || this.y < this.radius) {
        this.dy = -this.dy * this.friction;
    } else {
        this.dy += this.gravity;
    }
    // When star hits left or right edge
    if (this.x > canvas.width - this.radius || this.x < this.radius) {
        this.dx = -this.dx;
    }
    this.y += this.dy;
    this.x += this.dx;
    this.halfLife -= 1;
    this.opacity -= 1 / this.halfLife;

}


function createMountainRange(mountainAmnt, height, range, color) {
    for (let i = 0; i < mountainAmnt; ++i) {
        mountainWidth = canvas.width / mountainAmnt;
        ctx.beginPath();
        ctx.moveTo(i * mountainWidth, canvas.height);
        ctx.lineTo(i * mountainWidth + mountainWidth + range, canvas.height);
        ctx.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
        ctx.lineTo(i * mountainWidth - range, canvas.height);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    }
}


const backgroundGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
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
        let radius = 12;
        let x = radius + Math.random() * (canvas.width - 2 * radius);
        let y = -100;
        let color = '#E3EAEF';
        stars[i] = new Star(x, y, radius, color);
    }

    for (let i = 0; i < 150; ++i) {
        let radius = 4;
        let x = radius + Math.random() * (canvas.width - 2 * radius);
        let y = radius + Math.random() * (canvas.height - 2 * radius);
        backgroundStars[i] = new Star(x, y, radius, 'white');
    }
}


function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let key in backgroundStars) {
        backgroundStars[key].offDraw();
        if (backgroundStars[key].y >= canvas.height - 20) {
            backgroundStars[key].y = -20;
        } else if (backgroundStars[key].x <= 20) {
            backgroundStars[key].x = canvas.width + 20;
        }
    }
    createMountainRange(1, canvas.height - 200, 500, '#384551');
    createMountainRange(2, canvas.height - 400, 600, '#2B3843');
    createMountainRange(3, canvas.height - 600, 325, '#26333E');
    ctx.fillStyle = '#182028';
    ctx.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight)

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
        c += 1;
        const radius = 12;
        let x = Math.max(radius, Math.random() * canvas.width - radius);
        let y = -100;
        let color = '#E3EAEF';
        stars[c] = new Star(x, y, radius, color);
    }

}

offfDraw();
init();
animate();
