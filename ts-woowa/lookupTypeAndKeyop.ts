type Point = { x: number; y: number };
type P = keyof Point;
//   ^ = type P = "x" | "y"


// get array items type

type array =  (string | number | object) [];

type elTypeOfArr = array[number];

type tuple =  [string, number, object ];

type elTypeOfTuple = tuple[number];

// value of

type ValueOf<T> = T[keyof T];

type Foo = { a: string, b: number };
type ValueOfFoo = ValueOf<Foo>; // string | number
