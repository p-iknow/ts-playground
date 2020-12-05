/*
 할당 가능하다의 의미
 집합의 범위가 더 큰 집합에 범위가 더 작은 집합의 타입을 할당할 수 있다.
 Object Type 의 경우 property 가 많을 수록 집합의 범위가 더 작다고 말할 수 있다.
*/
function func1(a: number, b: number | string) {
  const v1: number | string = a;
  // 할당 할 수 없음
  const v2: number = b;
}

function func2(a: 1 | 2) {
  const v1: 1 | 3 = a;
  const v2: 1 | 2 | 3 = a;
}
/*  Structural Typeing example */
interface Person {
  name: string;
  age: number;
}

interface Product {
  name: string;
  age: number;
}

const person: Person = { name: 'mike', age: 23 };
const product: Product = person;

/*
 인터페이스 A 가 인터페이스 B에 할당 가능하기 위한 조건
 - B에 있는 모든 필수 속성의 이름이 A에도 존재해야 한다.
 - 같은 속성 이름에 대해, A의 속성이 B의 속성에 할당 가능해야 한다.
*/
interface Person1 {
  name: string;
}

interface Product2 {
  name: string;
  age: number;
}

const obj = { name: 'mike', age: '23', city: 'abc' };
// Persion1 의 name 조건을 만족하기 때문에 할당 가능,
// 추가로 property 에 대해서는 신경쓰지 않음, name 이 string 인 모든 집합을 의마히가 때문
const person1: Person1 = obj
// Product2 의 age 조건을 만족하지 않기 때문에 할당 불가능,
// property 가 많을 수록 더 좁은 타입이라고 말할 수 있음
const product1: Product2 = obj;

/*
	다음은 함수 타입 A가 함수 타입 B로 할당 가능하기 위한 조건이다.
	1. A의 매개변수 갯수가 B의 매개변수 갯수 보다 적어야 한다.
	2. 같은 위치의 매개변수에 대해 B의 매개 변수가 A의 매개변수로 할당 가능해야 한다. -> 매개변수 타입에 대해서만 반변
	3. A의 반환값은 B의 반환값으로 할당 가능해야 한다. -> 공변
*/

type F1 = (a: number, b: string) => string;
type F2 = (a: number, b: number | string ) => string;
type F3 = (a: number) => string;
type F4 = (a: number) => number | string;

let f1: F1 = (a, b) => `${a} ${b.length}`;
let f2: F2 = (a, b) => `${a} ${b}`;
let f3: F3 = a => `${a}`;
let f4: F4 = a => a < 10 ? a :  'too big';

f1 = f3;
f3 = f1;

f1 = f2;
f2 = f1;

f4 = f3;
f3 = f4;
