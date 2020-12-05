export {}

interface Person1 {
	name: string;
	age: number;
}

interface Person2 {
	name: string;
	age: number;
	language: string;
}

/*  in */
type MakeBoolean<T> =  { [P in keyof T]?: boolean};

const pMap: MakeBoolean<Person1> = {};
pMap.name = true;
pMap.age = true


type T1 = Person1['name'];

/* Readonly */
type Readonly<T> = { readonly [P in keyof T]: T[P] };
type T2 = Readonly<Person1>;

/* Partial */
type Partial<T> = { [P in keyof T]?: T[P] };
type T3 = Partial<Person1>;

/* Pick */
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
type T4 = Pick<Person2, 'name' | 'language'>;

/* Record */
type Record<K extends string, T> = { [P in K]: T };
type T5 = Record<'p1' | 'p2', Person1>;
type T6 = Record<'p1' | 'p2', number>;

/* apply mapped Type to Enum */
enum Fruit {
	Apple,
	Banana,
	Orange,
}

const FRUIT_PRICE: { [key in Fruit]: number } = {
	[Fruit.Apple]: 1000,
	[Fruit.Banana]: 1400,
	[Fruit.Orange]: 2000,

}
