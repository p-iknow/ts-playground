let count = 0;
count += 1;

const message: string = "hellow world";

const doen: boolean = true; 

const numbers: number [] = [1, 2, 3]; 
const messages: string [] = ["hello", "world"];


let mightBeUndefined: string | undefined = undefined;
let nullableNumber: number | null = null;

let color: 'red' | 'orange' | 'yellow' = 'red';


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