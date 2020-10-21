/* ReadOnly */

interface IPerson {
  name: string;
  age: number;
}

// Readonly 타입은 사실 Object.freeze 를 한 것과 동일한 결과를 보여준다.
type ReadonlyPerson = Readonly<IPerson>;

//  실제로 Object.freeze 가 lib 안에 선언부를 보면, 받은 타입타입을 모두 readonly 로 바꿔준다.
const person: ReadonlyPerson = Object.freeze<IPerson>({
  name: "Mark",
  age: 38,
});

// readonly 를 했기 때문에 새로운 할당이 불가하다.
person.name = "Hanna"; // error!
person.age = 27; // error!

/* Nullable */
type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};


/* Sringify */
type Stringify<T> = {
  [P in keyof T]: string;
};



/* PartialNullablePerson */
// 아래 Partial 은 각 prop 을 optional(?) 하게 바꿔주는 mapped type 이다
type PartialNullablePerson = Partial<Nullable<Stringify<IPerson>>>;
/*
type PartialNullablePerson = {
    name?: string | null | undefined;
    age?: string | null | undefined;
}
*/

let pnp: PartialNullablePerson;
pnp = { name: 'Mark', age: '38' };
pnp = { name: 'Mark' };
pnp = { name: undefined, age: null };


/*  내장 Mapped Types */

// Make all properties in T optional
type Partial<T> = {
    [P in keyof T]?: T[P];
};

// Make all properties in T required
type Required<T> = {
    [P in keyof T]-?: T[P];
};

// Make all properties in T readonly
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

// From T, pick a set of properties whose keys are in the union K
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};

// Construct a type with a set of properties K of type T
type Record<K extends keyof any, T> = {
    [P in K]: T;
};


/* ReadOnly */
interface Book {
  title: string;
  author: string;
}

interface IRootState {
  book: {
    books: Book[];
    loading: boolean;
    error: Error | null;
  };
}

type IReadonlyRootState = Readonly<IRootState>;
const state1: IReadonlyRootState = {} as IReadonlyRootState;
const book1 = state1.book.books[0];
// title 을 바꾸면 바뀐다. shallow readonly 이기 때문이다.
book1.title = 'new';


/* DeepReadOnly */
type DeepReadonly<T> = T extends (infer E)[]
  ? ReadonlyArray<DeepReadonlyObject<E>>
  : T extends object
  ? DeepReadonlyObject<T>
  : T;

type DeepReadonlyObject<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };

type IDeepReadonlyRootState = DeepReadonly<IRootState>;
const state2: IDeepReadonlyRootState = {} as IDeepReadonlyRootState;
const book2 = state2.book.books[0];
book2.title = 'new'; // error! Cannot assign to 'title' because it is a read-only property.


/*  readonly keyword in return type */

// array and tuple literal types.
function freturn1(): string[] {
  return ['readonly'];
}

const fr1 = freturn1();
fr1[0] = 'hello';

// 리턴 타입에 readonly 를 붙여서 immutable 하게 쓰도록 강제하기
function freturn2(): readonly string[] {
  return ['readonly'];
}

const fr2 = freturn2();
fr2[0] = 'hello'; // error! Index signature in type 'readonly string[]' only permits reading.
