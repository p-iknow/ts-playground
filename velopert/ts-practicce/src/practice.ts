let count = 0;
count += 1;

const message: string = "hellow world";

const doen: boolean = true; 

const numbers: number [] = [1, 2, 3]; 
const messages: string [] = ["hello", "world"];


let mightBeUndefined: string | undefined = undefined;
let nullableNumber: number | null = null;

//let color: 'red' | 'orange' | 'yellow' = 'red';


function sum(x: number, y: number): number {
	return x + y;
}

function sumArray(numbers: number[]): number {
	return numbers.reduce((acc, current) => acc + current, 0);
}

interface Shape {
	getArea(): number;
}

class circle implements Shape {

	radius: number;

	constructor(radius: number) {
		this.radius = radius;
	}

	getArea() {
		return this.radius * this.radius * Math.PI;
	}
}

class Rectangle implements Shape {
	width: number;
	height: number;
	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}
	getArea() {
		return this.width * this.height;
	}
}

const shapes: Shape[] = [new circle(5), new Rectangle(10, 5)];

shapes.forEach(shape => {
	console.log(shape.getArea());
})

// 일반 객체를 interface 로 타입 설정하기 

//interface Person {
//	name: string;
//	age?: number; 
//}

//interface Developer extends Person {
//	skills: string[];
//}

//const person: Person = {
//	name: '김사람',
//	age: 20
//};

//const expert: Developer = {
//	name: '김개발',
//	skills: ['javascript', 'react']
//};

//const people: Person[] = [person, expert];


// Type Alias 사용하기 

type Person = {
	name: string;
	age?: number;
}

type Developer = Person & {
	skills: string[]
}

const person: Person = {
	name: '김개발'
}

const expert: Developer = {
  name: '김개발',
  skills: ['javascript', 'react']
};

type People = Person [];
const people: People = [person, expert];

type Color = 'red' | 'orange' | 'yellow';
const color: Color = 'red';
const colors: Color[] = ['red', 'orange'];

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

function merge<A, B>(a: A, b: B): A & B {
	return {
		...a,
		...b
	}
}

const merged = merge({ foo: 1 } , { bar: 1 });

function wrap<T>(param: T) {
	return {
		param
	}
}

const wrapped = wrap(10);

// interFace 에서 Generic 사용하기

/*interface Items<T> {
	list: T[];
}

const items: Items<string> = {
	list: ['a', 'b', 'c']
};

*/

// Type alias 에서 Generic 사용하기 

type Items<T> = {
  list: T[];
};

const items: Items<string> = {
  list: ['a', 'b', 'c']
};

// Class 에서 Generic 사용하기 
class Queue<T> {
	list: T[] = [];
	get length() {
		return this.list.length;
	}
	enqueue(item: T) {
		this.list.push(item);
	}
	dequeue() {
		return this.list.shift();
	}
}

const queue = new Queue<number>();
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