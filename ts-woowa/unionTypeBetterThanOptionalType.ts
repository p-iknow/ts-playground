/* optional type 보단 Union Type 을 사용하기 */

/*
	Result1 은 optional type
	r1 의 data 가 있으면, error 는 null 이고 loading 은 false
*/

type Result1<T> = {
  data?: T;
  error?: Error;
  loading: boolean;
};

declare function getResult1(): Result1<string>;

const r1 = getResult1();
r1.data; // string | undefined
r1.error; // Error | undefined
r1.loading; // boolean


if (r1.data) {
	// 사실 데이터가 있는 경우 error 가 있을 수 없다.
  r1.error; // Error | undefined
  r1.loading; // boolean
}

/*
Result2 는 union type
`in` operator type guard 를 활용하여, r2 를 제한시켜 처리
*/

type Result2<T> =
  | { loading: true }
  | { data: T; loading: false }
  | { error: Error; loading: false };

declare function getResult2(): Result2<string>;

const r2 = getResult2();

r2.data; // error! Property 'data' does not exist on type 'Result2<string>'. Property 'data' does not exist on type '{ loading: true; }'.
r2.error; // error! Property 'error' does not exist on type 'Result2<string>'. Property 'error' does not exist on type '{ loading: true; }'.
r2.loading; // boolean

//  in 타입 가드를 통해서 분리하기가 편함
if ('data' in r2) {
  r2.error; // error! Property 'error' does not exist on type '{ data: string; loading: false; }'.
  r2.loading; // false
}

/*
Result3 는 union type
type guard 를 활용하여, r3 를 명시적으로 제한시켜 처리
*/

type Result3<T> =
  | { type: 'pending'; loading: true }
  | { type: 'success'; data: T; loading: false }
  | { type: 'fail'; error: Error; loading: false };

declare function getResult3(): Result3<string>;

const r3 = getResult3();

// type 가드를 활용하여 명시적으로 제힌시켜 처리하기
if (r3.type === 'success') {
  r3; // { type: 'success'; data: string; loading: false; }
}
if (r3.type === 'pending') {
  r3; // { type: 'pending'; loading: true; }
}
if (r3.type === 'fail') {
  r3; // { type: 'fail'; error: Error; loading: false; }
}


/* Union Type 과 Literal Type Guard */
interface Dog {
  kind: 'dog';
  eat: () => string;
}

interface Cat {
  kind: 'cat';
  jump: () => string;
}

interface Cow {
  kind: 'cow';
  milk: () => string;
}

type Pet = Dog | Cat | Cow;

function stringifyPaymentMethod(pet: Pet): string {
  switch (pet.kind) {
    case 'dog':
      return pet.eat();
    case 'cat':
      return pet.jump();
    case 'cow':
      return pet.milk();
  }
}
