# chapter 5

##

```ts
type Color = 'Black' | 'White';
type File = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H';
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

class Position {
  constructor(private file: File, private rank: Rank) {}
}

class Piece {
  protected position: Position
  constructor(
    private readonly color: Color,
    file: File,
    rank: Rank
  ) {
    this.position = new Position(file, rank)
  }
}

Cherny, Boris. Programming TypeScript . O'Reilly Media. Kindle Edition.
```

#### private

- 다른 클래스에서 접근이 불가능하고 여기서 다른 class 란 subClass 도 포함한다.

#### protected

- 선언 당시에 값을 할당할 수 없고, constructor 에서 할당 가능하다. constructor에서 값을 할당하지 않은 경우 타입스크립트는 `not definitely assigned` 라고 말해준다.
- prtected의 타입은 선언당시에 정해지는데, constructor 에서 값이 할당되지 않으면 protected field는 `<T> | undefined` 가 되고, 이는 우리가 맨 처음 선언했던 Position type 이 아닐 수 있기에 singature를 업데이트 해야 한다.
- 내부 클래스와 자신의 subClass 에서는 접근이 가능

---

> #### TSC Flags: strictNullChecks and strictPropertyInitialization
>
> - 선언과 함께 초기화를 강제하려면 해당 옵션 들을 enable 해야 한다.

### Access Modifier

- `public` : Accessible from anywhere. This is the default access level.
- `protected` : Accessible from instances of this class and its subclasses.
- `private` : Accessible from instances of this class only.

### abstrac

- abstrac class를 정의하면 항상 subClass 로 구현해야 한다. direct 로 instance를 생성할 수 없다.
- abstrac method 의 경우 abstrac 키워드를 앞에 명시하여 사용할 수 있다.
- abstrac 을 쓰지 않은 method의 경우 default 메소드가 되며, default method 도 동일하게 overiding 이 가능하다.

### Using this as a Return Type

```ts
let set = new Set
set.add(1).add(2).add(3)
set.has(2) // true
set.has(4) // false Let’s define the Set class, starting with the has method: class Set {
  has(value: number): boolean {
    // ...
  }
}

class Set {
  has(value: number): boolean {
    // ...
  }
  add(value: number): Set {
    // ...
  }
}
 class MutableSet extends Set {
  delete(value: number): boolean {
    // ...
  }
}
class MutableSet extends Set {
  delete(value: number): boolean {
    // ...
  }
  add(value: number): MutableSet {
    // ...
  }
}
```

위 처럼 자기 자신을 return 할때 일일히 자신의 type을 명시하는, Return Type으로 this 를 쓰면 면하다. 편하다.

```ts
class Set {
  has(value: number): boolean {
    // ...
  }
  add(value: number): this {
    // ...
  }
}

class MutableSet extends Set {
  delete(value: number): boolean {
    // ...
  }
}
```

이제 MutableSet 에서 add 메소드 overriding 을 지울 수 있다.
타입스크립트가 자동으로 Set 일 때는 Set을, MutableSet 일때는 MutableSet을 가르키기 때문이다.

Chained API를 사용하는 Builder Pattern 을 사용하는 경우 Return Type을 this로 정의하면 편하다.

## Interface

### type alias vs interface

```ts
type Sushi = {
  calories: number
  salty: boolean
  tasty: boolean
}
//It’s easy to rewrite it as an interface:
interface Sushi {
  calories: number
  salty: boolean
  tasty: boolean
}

// 타입과 타입을 결합하여 다른 타입을 만들 때 차이점이 발생함
type Cake = {
  calories: number
  sweet: boolean
  tasty: boolean
}

type Food = {
  calories: number
  tasty: boolean
}

// type alias 의 경우 intersection type 연산자를 활용함
type Sushi = Food & {
  salty: boolean
}
type Cake = Food & {
  sweet: boolean
}

Food {
  calories: number
  tasty: boolean
}
// interface 는 상속을 통해 타입을 확장함
interface Sushi extends Food {
  salty: boolean
}
interface Cake extends Food {
  sweet: boolean
}
```

> #### note
>
> `interface` 는 다른 interface 만 상속받을 수 있다? 아니다. 어떤 shape( an object type, a class, or another interface.)든 상속 받을 수 있다

### Diffrence

#### 첫째

type aliase : 우변에 어떤 타입이든 관계 없이 올 수 있다. 심지어 type expression(|, & 등의 연사자가 쓰인식) 이 와도 된다.

interface: interface는 우변에 shape 가 와야 한다. 아래와 같은 형식을 interface 로는 쓸 수 없다.

```ts
type A = number;
type B = A | string;
```

#### 둘째

B가 A를 상속하여 만들어 졌다면 A는 B에 할당할 수 있어야 한다. 타입스크립트가 이런 type assignability 를 체크한다.

```ts
interface A {
  good(x: number): string;
  bad(x: number): string;
}

interface B extends A {
  good(x: string | number): string;
  bad(x: string): string; // Error TS2430: Interface 'B' incorrectly extends
} // interface 'A'. Type 'number' is not assignable
// to type 'string'.

// d
```

위 예제를 type alias의 &(intersection)을 활용해 표현하면 에러가 나지않는다. 타입스크립트가 bad 에 대한 overloaded signature를 만들기 때문이다.

```ts
type A {
  good(x: number): string
  bad(x: number): string
}

// no error
type B = A & {
  good(x: string | number): string
  bad(x: string): string
}
```

우리가 object type 에 대한 상속을 설계할 때, 타입스크립트가 하는 할당가능성 체크는 에러를 초기에 잡아내는데 큰 도움이 된다. (When you’re modeling inheritance for object types, the assignability check that TypeScript does for interfaces can be a helpful tool to catch errors.)

#### 셋째 declaration merging

같은 스코프 안에서 동일한 name 에 interface를 할당하면 자동으로 merge 가 이루어진다. 이를 declaration merging 이라 부른다
type alias 의 경우 같은 scope 내에서 동일한 name에 할당하면 compile-time error 가 발생한다.

### Declaration Merging

```ts
// User has a single field, name
interface User {
  name: string;
}

// User now has two fields, name and age
interface User {
  age: number;
}

let a: User = {
  name: 'Ashley',
  age: 30
};

// when we yose type alias, it throw error!!

type User = {
  // Error TS2300: Duplicate identifier 'User'.
  name: string;
};

type User = {
  // Error TS2300: Duplicate identifier 'User'.
  age: number;
};
```

충돌이 날 경우 declaration merging 이 안된다. 아래 예제를 참고하자

```ts
interface User {
  age: string;
}

interface User {
  age: number; // Error TS2717: Subsequent property declarations must have
} // the same type. Property 'age' must be of type 'string',
// but here has type 'number'.
```

만약에 interface 에 generic 을 사용하여 declaration merging을 하려한다면 merge 하고자 하는 generic 은 동일한 방식으로 정의되어(merge가 가능하도록)야 하며 generic 의 이름까지 같아야 한다.

```ts
interface User<Age extends number> {
  // Error TS2428: All declarations of 'User'
  age: Age; // must have identical type parameters.
}

interface User<Age extends string> {
  age: Age;
}
```

#### Implementation

다른 타입 annotation 처럼, type-level 의 제약을 거는 편리한 방법이다. implement 오류는 런타임에서 파악하기 어렵다. implement 키워드를 적용하면 컴파일 시에 implement 가 잘못된 경우 에러를 띄워, 나중에 런타임에서 implement를 잘못해서 발생할 수 있는 오류를 사전에 차단한다. 또한 adapters, factories, and strategies 패턴을 적용할 때 쓰인다.

```ts
interface Animal {
  eat(food: string): void;
  sleep(hours: number): void;
}

class Cat implements Animal {
  eat(food: string) {
    console.info('Ate some', food, '. Mmm!');
  }
  sleep(hours: number) {
    console.info('Slept for', hours, 'hours');
  }
}
```
위에서 Cat class 는 interface 에서 선언한 eat, sleep method를 모두 구현해야 한다. 또한 인터페이스에 없는 추가적인 메소드를 eat, sleep 위에 먼저 추가할 수 있다. 

interface 는 instance property 를 선언할 수 있지만, public, protected, private 등의 접근 제어자와 static 키워드를 쓸 수없다. 다만 read-only만 가능할 뿐이다.(chpater 3 object 처럼 이라는 수식이 붙었는데 무슨 말인지 모르겠음)
```ts
interface Animal {
  readonly name: string
  eat(food: string): void
  sleep(hours: number): void
}
```
implement 할 때 여러개의 interface를 적용할 수도 있다. 
```ts
iinterface Animal {
  readonly name: string
  eat(food: string): void
  sleep(hours: number): void
}

interface Feline {
  meow(): void
}

class Cat implements Animal, Feline {
  name = 'Whiskers'
  eat(food: string) {
    console.info('Ate some', food, '. Mmm!')
  }
  sleep(hours: number) {
    console.info('Slept for', hours, 'hours')
  }
  meow() {
    console.info('Meow')
  }
}
```


#### Implementing Interfaces Versus Extending Abstract Classes
##### `interface` 
- 보다 보편적이고 가볍다
- An interface is a way to model a shape. At the value level, that means an object, array, function, class, or class instance. ? 여기서 then === shape 이고, shpe로 표현할 수 있는 항목을 열거하고 있는 의미로 유추됨 
- interface 는 compile time 에만 존재하며 어떤 자바스크립트 코드도 생산하지 않는다. 
 
##### `abstract` : 
- 특정한 목적이 있고, feature-rich(기능이 풍부?) 하다.
- An abstract class can only model class 
- compile 이후 jvascript class 로 변환된다. 
- constructors, provide default implementations 을 활용할 수 있다.
- property 혹은 method 에 access modifier(접근 제어자)를 쓸 수 있다.
- interface는 위 열거된 항목을 적용할 수 없다. 

Which one you use depends on your use case. When an implementation is shared among multiple classes, use an abstract class. When you need a lightweight way to say “this class is a T,” use an interface.

### Classes Are Structurally Typed (구조 타이핑)
이름(nominal) 이 아니라 구조만 같으면 동일하게 간주한다. 
```ts
class Zebra {
  trot() {
    // ...
  }
}

class Poodle {
  trot() {
    // ...
  }
}

function ambleAround(animal: Zebra) {
  animal.trot()
}

let zebra = new Zebra
let poodle = new Poodle

ambleAround(zebra)   // OK
ambleAround(poodle)  // OK
```
Java, C++, 에서 `ambleAround(poodle)`은 에러가 났을 것이다. 이름이 다르기 때문이다. 

여기에도 예외가 있는데, field가 private, protected 를 썼을 때 이다. 이런 경우엔 아무리 구조가 같떠라도 A의 instance 이거나, Subclass(B) 가 아닌 경우에는 f 함수에 인자로 할당할 수 없다. 
```ts
class A {
  private x = 1
}
class B extends A {}
function f(a: A) {}

f(new A)   // OK
f(new B)   // OK

f({x: 1})  // Error TS2345: Argument of type '{x: number}' is not
           // assignable to parameter of type 'A'. Property 'x' is
           // private in type 'A' but not in type '{x: number}'.
```
