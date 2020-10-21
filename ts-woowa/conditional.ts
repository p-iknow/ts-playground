/*
 Item<T> - T 에 따라 달라지는 container
*/

interface StringContainer {
  value: string;
  format(): string;
  split(): string[];
}

interface NumberContainer {
  value: number;
  nearestPrime: number;
  round(): number;
}

type Item1<T> = {
  id: T,
  container: any;
};

const item1: Item1<string> = {
  id: "aaaaaa",
  container: null
};

/*
 Item<T> T 가 string 이면 StringContainer, 아니면 NumberContainer
*/

type Item2<T> = {
  id: T;
  container: T extends string ? StringContainer : NumberContainer;
};

const item2: Item2<string> = {
  id: 'aaaaaa',
  container: null, // Type 'null' is not assignable to type 'StringContainer'.
};


const item2Right: Item2<string> = {
  id: 'aaaaaa',
  container: {
		value: "value",
		format(){return "format"},
		split(){ return ["split", "split"]}
	}
};


/*
Item<T>
T 가 string 이면 StringContainer
T 가 number 면 NumberContainer
아니면 사용 불가
*/

type Item3<T> = {
  id: T extends string | number ? T : never;
  container: T extends string
    ? StringContainer
    : T extends number
    ? NumberContainer
    : never;
};

const item3: Item3<boolean> = {
  id: true, // Type 'boolean' is not assignable to type 'never'.
  container: null, // Type 'null' is not assignable to type 'never'.
};


/* ArrayFilter<T> */

/*
T extends any[] ? 의미는 T가 배열타입인지를 검사하는 것임
*/
type ArrayFilter<T> = T extends any[] ? T : never;

type StringsOrNumbers = ArrayFilter<string | number | string[] | number[]>;

/*
conditional 이 type 이 연산되는 과정
*/

// 1. string | number | string[] | number[]
// 2. never | never | string[] | number[]
// 3. string[] | number[]


/*
 generic 선언부에 제약 걸기
*/

interface Table {
  id: string;
  chairs: string[];
}

interface Dino {
  id: number;
  legs: number;
}

interface World {
	// 아래 T extends string | number 가 바로 제약을 거는 것이라고 볼 수 있음
  getItem<T extends string | number>(id: T): T extends string ? Table : Dino;
}

const world: World = null as any;

const dino = world.getItem(10);
const what = world.getItem(true); // Error! Argument of type 'boolean' is not assignable to parameter of type 'string | number'.ts(2345)

/*  Flatten  */

type Flatten<T> = T extends any[]
  ? T[number]
  : T extends object
  ? T[keyof T]
  : T;


const numbers = [1, 2, 3];
type NumbersArrayFlattened = Flatten<typeof numbers>;
// 1. number[]
// 2. number

const person = {
  name: 'Mark',
  age: 38
};

type SomeObjectFlattened = Flatten<typeof person>;
// 1. keyof T --> "id" | "name"
// 2. T["id" | "name"] --> T["id"] | T["name"] --> number | string

const isMale = true;
type SomeBooleanFlattened = Flatten<typeof isMale>;
// true


/*
 infer
*/

type UnpackPromise<T> = T extends Promise<infer K>[] ? K : any;
const promises = [Promise.resolve('Mark'), Promise.resolve(38)];

type Expected = UnpackPromise<typeof promises>; // string | number


/*
	함수의 리턴 타입 알아내기 - MyReturnType
*/
function plus1(seed: number): number {
  return seed + 1;
}

// 함수로 제한하기
type MyReturnType<T extends (...args: any) => any > = T extends (
  ...args: any
) => infer R
  ? R
  : any;

// typeof 가 compile 타임에 사용되는 경우
type Id = MyReturnType<typeof plus1>;


lookupEntity(plus1(10));

// 이미 있는 소스코드의 타입을 얻어서 타입을 만드는 것
// lookupEntity 인자의 타입을 정의할 때 함수의 리턴타입을 얻어내서 정의하는 경우
// 이렇게 하면 타입안정성을 더 지킬 수 있다.
function lookupEntity(id: Id) {
  // query DB for entity by ID
}
