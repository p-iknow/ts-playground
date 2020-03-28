"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var count = 0;
count += 1;
var message = "hellow world";
var doen = true;
var numbers = [1, 2, 3];
var messages = ["hello", "world"];
var mightBeUndefined = undefined;
var nullableNumber = null;
//let color: 'red' | 'orange' | 'yellow' = 'red';
function sum(x, y) {
    return x + y;
}
function sumArray(numbers) {
    return numbers.reduce(function (acc, current) { return acc + current; }, 0);
}
var circle = /** @class */ (function () {
    function circle(radius) {
        this.radius = radius;
    }
    circle.prototype.getArea = function () {
        return this.radius * this.radius * Math.PI;
    };
    return circle;
}());
var Rectangle = /** @class */ (function () {
    function Rectangle(width, height) {
        this.width = width;
        this.height = height;
    }
    Rectangle.prototype.getArea = function () {
        return this.width * this.height;
    };
    return Rectangle;
}());
var shapes = [new circle(5), new Rectangle(10, 5)];
shapes.forEach(function (shape) {
    console.log(shape.getArea());
});
var person = {
    name: '김개발'
};
var expert = {
    name: '김개발',
    skills: ['javascript', 'react']
};
var people = [person, expert];
var color = 'red';
var colors = ['red', 'orange'];
// Generic 
// 타입 추론이 깨지는 상황
/*

function merge(a: any, b: any): any {
    return {
        ...a,
        ...b
    };
}

const merged = merge({ foo: 1 }, { bar: 1 });

*/
function merge(a, b) {
    return __assign(__assign({}, a), b);
}
var merged = merge({ foo: 1 }, { bar: 1 });
function wrap(param) {
    return {
        param: param
    };
}
var wrapped = wrap(10);
var items = {
    list: ['a', 'b', 'c']
};
// Class 에서 Generic 사용하기 
var Queue = /** @class */ (function () {
    function Queue() {
        this.list = [];
    }
    Object.defineProperty(Queue.prototype, "length", {
        get: function () {
            return this.list.length;
        },
        enumerable: true,
        configurable: true
    });
    Queue.prototype.enqueue = function (item) {
        this.list.push(item);
    };
    Queue.prototype.dequeue = function () {
        return this.list.shift();
    };
    return Queue;
}());
var queue = new Queue();
queue.enqueue(0);
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
queue.enqueue(4);
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
console.log(queue.dequeue());
