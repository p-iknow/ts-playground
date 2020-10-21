/*
 ReadonlyArray<T> 와 as const
*/
class Layer {
  id!: string;
  name!: string;
  x = 0;
  y = 0;
  width = 0;
  height = 0;
}

// 사실 우리가 기대하는 타입은 'x' 리터럴 타입이나, keyof 연산의 결과인 유니온타입이 나오고 있음
const LAYER_DATA_INITIALIZE_INCLUDE_KEYS: ReadonlyArray<keyof Layer> = [
  'x',
  'y',
  'width',
  'height',
];
const x = LAYER_DATA_INITIALIZE_INCLUDE_KEYS[0]; // "id" | "name" | "x" | "y" | "width" | "height"

// as const 를 통해 우리가 기대했던 대로 'id' 리터럴 타입이 나오게 됨
const LAYER_DATA_INITIALIZE_EXCLUDE_KEYS = ['id', 'name'] as const;
const id = LAYER_DATA_INITIALIZE_EXCLUDE_KEYS[0]; // "id"


/*
	ReadonlyArray<T>
*/

const weekdays: ReadonlyArray<string> = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

weekdays[0]; // readonly string[]
weekdays[0] = 'Fancyday'; // error! Index signature in type 'readonly string[]' only permits reading.


/*
	as const
*/
const weekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

weekdays[0]; // "Sunday"
weekdays[0] = 'Fancyday'; // error! Cannot assign to '0' because it is a read-only property.
