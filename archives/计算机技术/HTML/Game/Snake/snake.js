var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var width = 20;
var height = 15;
var size = 30;
var length = 2; // 初始化长度
var interval = 200;

var grey = 'grey';
var green = 'green';
var red = 'red';
var orange = 'orange';
var pink = 'pink';
var transparent = 'transparent';

var line_color = grey;
var body_color = green;
var head_color = red;
var food_color = orange;
var next_color = pink;

function Box(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
}

Box.prototype.draw = function () {
    context.beginPath();
    context.fillStyle = this.color;
    context.rect(this.x * size, this.y * size, size, size);
    context.fill();
    if (this.color !== transparent)
        context.stroke();
};


function Snake() {
    this.body = [];
    for (var i = 0; i < length; i++) {
        this.body[i] = new Box(i, 0, body_color);
    }

    this.head = new Box(i, 0, head_color);
    this.next = null;
    this.skip = false;

    this.map = {};
    for (i = 0; i < width; i++) {
        for (var j = 0; j < height; j++) {
            key = i + '-' + j;
            this.map[key] = {};
            this.map[key].x = i;
            this.map[key].y = j;
        }
    }

    // 37 左，38 上，39 右，40 下
    this.direction = 39;
    this.direct = 39;
}


Snake.prototype.draw = function () {
    for (var i = 0; i < this.body.length; i++) {
        this.body[i].draw();
    }
    this.head.draw();
    if (this.next != null) this.next.draw();
    this.draw_line();
};

Snake.prototype.draw_line = function () {
    for (i = 0; i < height; i++) {
        context.strokeStyle = line_color;
        context.beginPath();
        context.moveTo(0, i * size);
        context.lineTo(canvas.width, i * size);
        context.closePath();
        context.stroke();
    }

    for (i = 0; i < width; i++) {
        context.strokeStyle = line_color;
        context.beginPath();
        context.moveTo(i * size, 0);
        context.lineTo(i * size, canvas.height);
        context.closePath();
        context.stroke();
    }
};


Snake.prototype.get_next_box = function () {
    // 37 左，38 上，39 右，40 下

    if (this.check()) return this.next;

    var x = this.head.x;
    var y = this.head.y;

    switch (this.direction) {
        case 37:
            x -= 1;
            break;
        case 38:
            y -= 1;
            break;
        case 39:
            x += 1;
            break;
        case 40:
            y += 1;
            break;
        default:
            break;
    }
    return new Box(x, y, next_color);
};

Snake.prototype.move = function () {
    this.direction = this.direct;
    if (this.check()) return;

    if (this.next == null)
        this.next = this.get_next_box();

    if (!this.eat()) {
        this.body.shift();
    }

    this.next.color = head_color;
    this.body.push(this.head);
    this.head.color = body_color;
    this.head = this.next;
    this.next = null;
};

Snake.prototype.check = function () {
    if (this.death()) {
        alert('Game Over');
        return true;
    }
    return false;
};

Snake.prototype.death = function () {
    // 撞墙
    if (this.head.x >= width) return true;
    if (this.head.y >= height) return true;
    if (this.head.x < 0) return true;
    if (this.head.y < 0) return true;

    for (var i = 0; i < this.body.length; i++) {
        var box = this.body[i];
        if (box.x != this.head.x) continue;
        if (box.y != this.head.y) continue;
        return true;
    }
    return false;
};

Snake.prototype.eat = function () {
    if (this.next.x == food.x && this.next.y == food.y) {
        food = get_random_food();
        this.eaten = true;
        return true;
    }
    this.eaten = false;
    return false;
};


function get_random_food() {
    var body = {};
    var remain = [];

    var key = snake.head.x + '-' + snake.head.y;
    body[key] = true;

    snake.body.forEach(function (box) {
        key = box.x + '-' + box.y;
        body[key] = true;
    });

    for (var name in snake.map) {
        if (name in body) continue;
        remain.push(snake.map[name]);
    }

    var value = remain[Math.round(Math.random() * (remain.length - 1))];
    var food = new Box(value.x, value.y, orange);
    return food;

}


var snake = new Snake();
var food = new get_random_food();


function running() {
    if (snake.check()) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    snake.draw();
    food.draw();
    snake.move();
    if (snake.eaten) {
        snake.eaten = false;
        setTimeout(running, interval + 100);
    } else {
        setTimeout(running, interval);
    }
}

document.onkeydown = function (e) {
    // 37 左，38 上，39 右，40 下
    var event = e || window.event;
    // if (snake.direction == event.keyCode) {
    //     snake.move();
    //     snake.draw();
    //     return;
    // }
    switch (event.keyCode) {
        case 37: {
            if (snake.direction == 39)
                break;
            snake.direct = 37;
            break;
        }
        case 38: {
            if (snake.direction == 40)
                break;
            snake.direct = 38;
            break;
        }
        case 39: {
            if (snake.direction == 37)
                break;
            snake.direct = 39;
            break;
        }
        case 40: {
            if (snake.direction == 38)
                break;
            snake.direct = 40;
            break;
        }
    }
    event.preventDefault();
};

window.onload = function () {
    this.canvas.width = this.width * this.size;
    this.canvas.height = this.height * this.size;
    this.running();
};