# Chapter6 

## Relationships Between Types

### Subtype and Supertypes
#### subtype 
타입 A와 B가 있고, B가 A의 Subptype 이라면, A 타입이 요구되는 장소 모두에서 B를 안전하게 사용할 수 있다. 
![subptype](https://imgur.com/AmfOjAO.png)

그림 3-1 을 살펴보면 typescript 에 내장된 subtype 관게가 무엇인지 이해할 수 있다.
![subptype](https://imgur.com/w3aKxgs.png)

- Array is a subtype of Object.  
- Tuple is a subtype of Array.  
- Everything is a subtype of any.  
- never is a subtype of everything.  
- If you have a class Bird that extends Animal, then Bird is a subtype of Animal.

이로 부터 도출된 정의는 다음과 같다.

- Anywhere you need an Object you can also use an Array.  
- Anywhere you need an Array you can also use a Tuple.  
- Anywhere you need an any you can also use an Object.  
- You can use a never anywhere.  
- Anywhere you need an Animal you can also use a Bird.

#### supertype
If you have two types A and B, and B is a supertype of A, then you can safely use an A anywhere a B is required (Figure 6-2).

![supertype](https://imgur.com/WOUpYgZ.png)
Again from the flowchart in Figure 3-1: 
- Array is a supertype of Tuple.  
- Object is a supertype of Array. 
- Any is a supertype of everything.
- Never is a supertype of nothing.  
- Animal is a supertype of Bird.

### Varience 
[공변성에 관한 번역 글, 용균님 블로그](https://edykim.com/ko/post/what-is-coercion-and-anticommunism/)
number 나 string 같은 type의 경우 subtype 관계를 쉽게 유추할 수 있지만, generic 이나 다른 여타의 복잡한 타입의 경우 타입관의 관계를 유추하기 힘들다. 예를 들면 아래와 같은 상황은 판단하기가 힘들다.
- When is `Array<A>` a subtype of `Array<B>`?  
- When is a `shape A` a subtype of another `shape B`?  
- When is a `function (a: A) => B` a subtype of another `function (c: C) => D`?
  

type parameter `Array<A>`, shape `{a: number}`, function`(a:A) => B)` 같은 부류는 답이 딱 떨어지지도 않고 타입간의 관계를 파악하기 어렵다. 사실 앞서 열거한 복잡한 타입에 대한 subtyping rule은 언어마다 달라서 서로 일치하지 않는다. 

그래서 이런 타입관계를 보다 정확하고 간결하게 표현하기 위해 별도의 문법을 도입하려한다. 이 문법은 타입스크립트에 적용되는 문법은 아니다. 타입을 보다 잘 설명하기 위한 것임을 참고하자.

- `A <: B` means "A is a subtype of or the same as the type B.”  
- `A >: B` means "A is a supertype of or the same as the type B.”

#### Shape and array variance 
```ts
// An existing user that we got from the server
type ExistingUser = {
  id: number
  name: string
}

// A new user that hasn't been saved to the server yet
type NewUser = {
  name: string
}
function deleteUser(user: {id?: number, name: string}) {
  delete user.id
}

let existingUser: ExistingUser = {
  id: 123456,
  name: 'Ima User'
}

deleteUser(existingUser)

```
existingUser 는 추후에 id가 필수적으로 있을거라고 기대 되지만, deletUser에 전달되고 난 뒤에 id는 삭제된다. 타입스크립트는 당연히 id가 있을 것이라고 기대하기 때문에 문제가 생긴다. 

super type `{id? : number, name: string}` 이 예상되는 곳에 object type `{id: number, name: string}` 을 사용하는 것은 안전하지 않다. 

그렇다면 타입스크립트가 왜 이런 상황을 허용했을가? 타입스크립트는 완벽한 안전을 위해 고안되지 않았기 때문이다. 타입스크립트는 사용성과 예기치 못한 실수를 잡아내는 두가지 목적의 벨런스를 맞추는데 초점을 맞추고 있다. 

위에서 언급했던 케이스는 안전하지 않지만 객체의 field를 제거하는 방식의 update는 그렇게 자주 발생하는 일은 아니다. 그렇다면 반대는 어떨까? subtype 이 예상되는 곳에 object type을 할당할 수 있을까 다음 예제를 살펴보자. 

```ts
type LegacyUser = {
  id?: number | string
  name: string
}

let legacyUser: LegacyUser = {
  id: '793331',
  name: 'Xin Yang'
}

deleteUser(legacyUser) // Error TS2345: Argument of type 'LegacyUser' is not
                       // assignable to parameter of type '{id?: number |
                       // undefined, name: string}'. Type 'string' is not
                       // assignable to type 'number | undefined'.
```
위 결과를 미루어 볼때 다음과 같은 결론을 도출할 수 있다.
super type 이 예상되는 곳에 해당 타입의 sub type은 할당 가능하다. 그러나 sub type 이 예상되는 곳에 해당 type 의 super type은 할당할 수 없다.

convariant 의 뜻, 즉 객체 A를 객체 B에 할당할 수 있으려면, 객체 A의 각 속성(property)이 B의 각 속성의 subtype(<:) 이어야 한다는 것이다.  (When talking about types, we say that TypeScript shapes (objects and classes) are covariant in their property types. That is, for an object A to be assignable to an object B, each of its properties must be <: its corresponding property in B.)

More generally, covariance is just one of four sorts of variance:
- `Invariance` : You want exactly a T. 
- `Covariance` : You want a <:T.  a는 T의 subtype 이다.
- `Contravariance` : You want a >:T. a는 T의 superType 이다.
- `Bivariance` : You’re OK with either <:T or >:T. 서로 subtpye 이거나 supertype 인 관계 

#### function Variance 
A function A is a subtype of function B if A has the same or lower arity (number of parameters) than 
1. B and: A’s this type either isn’t specified, or is >: B’s this type. 
2. Each of A’s parameters is >: its corresponding parameter in B.  
3. A’s return type is <: B’s return type.

왜 함수의 variance 는 object, class 처럼 일관성있게 covaraince 가 아닐까? 예제를 들어서 살펴보자. 명확성을 위해 예제에서는 class를 사용했으나 `A <: B <: C` 관계인 모든 타입에도 모두 적용되는 내용이다. 

```ts
// Crow <: Bird <: Animal.

class Animal {}
class Bird extends Animal {
  chirp() {}
}
class Crow extends Bird {
  caw() {}
}

function chirp(bird: Bird): Bird {
  bird.chirp()
  return bird
}

chirp(new Animal) // Error TS2345: Argument of type 'Animal' is not assignable
chirp(new Bird)   // to parameter of type 'Bird'.
chirp(new Crow)
```
`Animal` 에는 `chirp` 메소드가 없으니 `Animal` 을 전달하면 오류가 발생한다. subtype 혹은 동일한 타입을 전달하는 것이 합당하다. 그런데 다른 예제를 한번 보자.

```ts
function clone(f: (b: Bird) => Bird): void {
  // ...
}

function birdToBird(b: Bird): Bird {
  // ...
}
clone(birdToBird) // OK

function birdToCrow(d: Bird): Crow {
  // ...
}
clone(birdToCrow) // OK

function birdToAnimal(d: Bird): Animal {
  // ...
}
clone(birdToAnimal) // Error TS2345: Argument of type '(d: Bird) => Animal' is
                    // not assignable to parameter of type '(b: Bird) => Bird'.
                    // Type 'Animal' is not assignable to type 'Bird'.
```
왜 return 이 Animal을 return 하면 안될까 ?
```ts
function clone(f: (b: Bird) => Bird): void {
  let parent = new Bird
  let babyBird = f(parent)
  babyBird.chirp()
}
```
위와 같은 함수를 가정하자.  Animal을 reutnr 하는 함수 f를 clone의 인자로 전달하면 chirp가 없기 때문에 에러가 발생할 것이다. 때문에 타입스크립트는 함수 f가 최소 Bird 혹으 Bird의 subtype을 return 할 것을 요구한다. 그래서 

We say that **functions are covariant in their return types**, which is a fancy way of saying that for a function to be a subtype of another function, **its return type has to be <: the other function’s return type.**

parmater type에 관해서도 살펴보자
```ts
function animalToBird(a: Animal): Bird {
  // ...
}
clone(animalToBird) // OK

function crowToBird(c: Crow): Bird {
  // ...
}
clone(crowToBird) // Error TS2345: Argument of type '(c: Crow) => Bird' is not
                  // assignable to parameter of type '(b: Bird) => Bird'.

```
For a function to be assignable to another function, **its parameter types (including this) all have to be >: their corresponding parameter types in the other function.**

왜 function paramter에 이런 제약이 생겼는지 파악해보자. clone 함수에 전달하기 전에  crowToBird 를 아래와 같이 implement 하는 사용자를 파악해보자. 
```ts
function crowToBird(c: Crow): Bird {
  c.caw()
  return new Bird
}

function clone(f: (b: Bird) => Bird): void {
  let parent = new Bird
  let babyBird = f(parent)
  babyBird.chirp()
}

clone(crowToBird) // Error TS2345: Argument of type '(c: Crow) => Bird' is not
                  // assignable to parameter of type '(b: Bird) => Bird'.
```
f에 인자로 넘겨진 crowToBird 함수는 `Crow` Type을 기대하고 `c.caw()`를 호출하지만  crowToBird 에 넘겨진 `Bird` Type에는 해당 method 가 없다. 그래서 

This means **functions are contravariant in their parameter and this types.** That is, **for a function to be a subtype of another function, each of its parameters and its this type must be >: its corresponding parameter in the other function.**

> #### TSC Flag: strictFunctionTypes 
> For legacy reasons, **functions in TypeScript are actually covariant in their parameter and this types by default.** To opt into the safer, contravariant behavior we just explored, **be sure to enable the {"strictFunctionTypes": true} flag in your tsconfig.json.** strict mode includes strictFunctionTypes, so if you’re already using {"strict": true}, you’re good to go.

Cherny, Boris. Programming TypeScript . O'Reilly Media. Kindle Edition. 

### Assignability 
assignability refers to TypeScript’s rules for whether or not you can use a type A where another type B is required.

타입스크립트가 assignability 를 판단할 때 따르는 규칙이 있는데 다음과 같다. 

non-enum types(arrays, booleans, numbers, objects, functions, classes, class instances, and strings, including literal types) 에 관해서 다음 2 규칙이 성립하면 A는 B에 할당 할 수 있다. 

1.  `A <: B` 가 성립할 때 
2.  A is` any`

1번 룰의 경우 subtype 에 관한 내용이다. Rule 2는 1번 에 관한 예외 사항이다. A가 any 이면 어디든 할당 가능하다.  2번 룰을 자바스크립트와 interpolating(보간) 할 때 유용하다. 

`enum` 혹은 `const enum` 의 경우 다음 룰을 따른다.

 타입 A는 Enum B 에 할당할 수 있는데 그 때는 다음과 같다. 

1. A가 B의 멤버이다 
2. Enum B에 숫자인 멤버가 하나 이상 있으며, A가 숫자이다.  

2번 룰의 경우에 typescript 의 취약성의 원인이 됬고 저자는 enum의 장점을 차지하고서라도 enum 타입을 쓰지않기를 권고한다.

```ts
// enum type으 취약성
const enum Flippable {
  Burger,
  Chair,
  Cup,
  Skateboard,
  Table
}

function flip(f: Flippable) {
  return 'flipped it'
}

flip(Flippable.Chair)     // 'flipped it'
flip(Flippable.Cup)       // 'flipped it'
flip(12)                  // 'flipped it' (!!!)
```

### Type Widening

When you declare a variable in a way that allows it to be mutated later (e.g., with let or var), its type is widened from its literal value to the base type that literal belongs to:

```ts
let a = 'x'               // string
let b = 3                 // number
var c = true              // boolean
const d = {x: 3}          // {x: number}

enum E {X, Y, Z}
let e = E.X               // E 
```

Not so for immutable declarations: 

```ts
const a = 'x'             // 'x'
const b = 3               // 3
const c = true            // true

enum E {X, Y, Z}
const e = E.X             // E.X

```
You can use an explicit type annotation to prevent your type from being widened:

```ts
let a: 'x' = 'x'          // 'x'
let b: 3 = 3              // 3
var c: true = true        // true
const d: {x: 3} = {x: 3}  // {x: 3}
```

When you reassign a nonwidened type using let or var, TypeScript widens it for you. To tell TypeScript to keep it narrow, add an explicit type annotation to your original declaration:

```ts
const a = 'x'             // 'x'
let b = a                 // string

const c: 'x' = 'x'        // 'x'
let d = c                 // 'x'
```

null 로 초기화된 변수는 any 타입으로 확장된다. 
```ts
let a = null              // any
a = 3                     // any
a = 'b'                   // any 
```
null 로 초기화 된 변수 해당 변수가 선언된 scope를 벗어나면 type widening 이 발생한다. 예를 들면 해당 변수가 함수에서 리턴되는 상황의 예를 들어 볼 수 있다.
```ts
function x() {
  let a = null            // any
  a = 3                   // any
  a = 'b'                 // any
  return a
}

x()                       // string
```

#### the const type 
타입 확장을 해제할 때 쓸 수 있다.
```ts
let a = {x: 3}                // {x: number}
let b: {x: 3}                 // {x: 3}
let c = {x: 3} as const       // {readonly x: 3}

```
뎁스가 있는 배열, 객체에 `as const` 키워들를 사용했을 경우 recursive 하게 readonly 가 적용된다.
```ts
let d = [1, {x: 2}]           // (number | {x: number})[]
let e = [1, {x: 2}] as const  // readonly [1, {readonly x: 2}]
```

**type script 가 가장 narrowly 하게 추론하고자 할 때 as const 키워드를 사용하라** 

#### Excess property checking
type widening 은 한 객체의 타입이 다른 객체의 타입에 할당 가능한지 여부를 확인할 때도 쓰인다. "Shape and Array variance" 파트에서 다뤘던 내용을 상기해보면, object type은 covariant 이다. 그러나 typescript 가 별도의 추가적인 check 를 하지 않고 이 규칙을 고수하면 문제가 될 경우가 많다. 

클래스를 configure 하기 위해 전달하는 Option object 에 대해 생각해보자. 
```ts
type Options = {
  baseURL: string
  cacheSize?: number
  tier?: 'prod' | 'dev'
}

class API {
  constructor(private options: Options) {}
}

new API({
  baseURL: 'https://api.mysite.com',
  tier: 'prod'
})

```
이제 option 객체를 전달하는 과정에서 typo 가 발생하면 어떤일이 발생할까? 
```ts
new API({
  baseURL: 'https://api.mysite.com',
  tierr: 'prod'      // Error TS2345: Argument of type '{tierr: string}'
})                   // is not assignable to parameter of type 'Options'.
                     // Object literal may only specify known properties,
                     // but 'tierr' does not exist in type 'Options'.
                     // Did you mean to write 'tier'?
```
오류가 발생한다. 자바스크립트로 작업을 할 때 이 오류는 빈번하고, 타입스크립트가 이런 부분에서 큰 도움을 준다. 그러나 object type is covariant in their member 라면 타입스크립트가 어떻게 이 오류를 잡아낼 수 있을까?

```ts
// 기대되는 type
type {baseURL: string, cacheSize?: number, tier?: 'prod' | 'dev'}

// 실제 전달하는 type 
type {baseURL: string, tierr: string}.
```
우리가 실제 전달하는 타입은 기대되는 타입의 subtype 이기 때문에 오류가 발생하지 않아야 하는데 typescript 는 어떻게 오류를 잡아낼까? 

바로 excess property checking 때문이다. excess preoperty checking 의 작동방식에 대해 논하려면 우선 fresh object literal type 에 대해 먼저 알아야 한다.

#### fresh object literal type
object literal 로 부터 infer 되는 type이라고 정의한다. 만약 object literal 이 type assertion 을 사용했거나, variable 에 할당된 경우라면 fresh object literal type은 일반 객체 타입으로 widending 된다. 

이제 excess preoperty checking 의 동작방식에 대해 알아보자. 만약 fresh object literal type 인 T 를 다른 Type U 에 할당하려고 할 때, T 의 preoperty 중 U가 가지고 있지 않은 preoperty 가 있다면 typescript는 error 를 뿜는다. 이제 예제를 살펴보자.

아래와 같은 상황을 가정하자.
```ts
type Options = {
  baseURL: string
  cacheSize?: number
  tier?: 'prod' | 'dev'
}

class API {
  constructor(private options: Options) {}
}
```

```ts
// 문제 없이 작동하는 것이 예상된다. 
new API({ 
  baseURL: 'https://api.mysite.com',
  tier: 'prod'
})

// 전달하는 object 는 fresh object literal 이므로 excess preperty checking 이 발생하고 에러가 난다. 
new API({ 
  baseURL: 'https://api.mysite.com',
  badTier: 'prod'    // Error TS2345: Argument of type '{baseURL: string; badTier:
})                   // string}' is not assignable to parameter of type 'Options'.

// 전달하는 object literal 이 tpye assertion 을 사용했고 type widening 이 발생해 더 더 이상 fresh objecter literal 이 아니고 excess preoperty checking 이 발생하지 않아 오류가 나지 않는다.
new API({ 
  baseURL: 'https://api.mysite.com',
  badTier: 'prod'
} as Options)

// 전달하는 object literal 이 variable 에  할당됬고 type widening 이 발생해 더 더 이상 fresh objecter literal 이 아니고 excess preoperty checking 이 발생하지 않아 오류가 나지 않는다.
let badOptions = { 
  baseURL: 'https://api.mysite.com',
  badTier: 'prod'
}
new API(badOptions)

// 전달하는 object 는 fresh object literal 이므로 excess preperty checking 이 발생하고 에러가 난다. 다만 여기서 API에 인자로 전달할 때 에러가 나는 것이 아니라, varialbe 할당 과정에서 에러가 나는 것임을 명심하자.
let options: Options = { 
  baseURL: 'https://api.mysite.com',
  badTier: 'prod'    // Error TS2322: Type '{baseURL: string; badTier: string}'
}                    // is not assignable to type 'Options'.
new API(options)

```

### Refinement

TypeScript performs **flow-based type inference**, which is a kind of symbolic execution where the typechecker uses control flow statements like if, ?, ||, and switch, as well as type queries like typeof, instanceof, and in, to refine types as it goes, just like a programmer reading through the code would.

1. It’s an incredibly convenient feature for a typechecker to have, but is another one of those things that remarkably few languages support.

2. Let’s walk through an example. Say we’ve built an API for defining CSS rules in TypeScript, and a coworker wants to use it to set an HTML element’s width. They pass in the width, which we then want to parse and validate.

```ts
// We use a union of string literals to describe
// the possible values a CSS unit can have
type Unit = 'cm' | 'px' | '%'

// Enumerate the units
let units: Unit[] = ['cm', 'px', '%']

// Check each unit, and return null if there is no match
function parseUnit(value: string): Unit | null {
  for (let i = 0; i < units.length; i++) {
    if (value.endsWith(units[i])) {
      return units[i]
    }
  }
  return null
}


type Width = {
  unit: Unit,
  value: number
}
// 

function parseWidth(width: number | string | null | undefined): Width | null {
  // If width is null or undefined, return early
  // We say that the type was refined from `number | string | null | undefined` to `number | string`.

  if (width == null) { 
    return null
  }

  // If width is a number, default to pixels
  if (typeof width === 'number') { 
    // width : number 
    return {unit: 'px', value: width} 
  }


  //  width : string 
  // Try to parse a unit from width
  let unit = parseUnit(width)
  if (unit) { 
    return {unit, value: parseFloat(width)}
  }

  // Otherwise, return null
  // falsy, meaning it must be of type null refined from `Unit | null`.
  return null 
}
```
#### Discriminated union types
```ts
type UserTextEvent = {value: string}
type UserMouseEvent = {value: [number, number]}

type UserEvent = UserTextEvent | UserMouseEvent

function handle(event: UserEvent) {
  if (typeof event.value === 'string') {
    event.value  // string
    // ...
    return
  }
  event.value    // [number, number]
}
```

```ts
type UserTextEvent = {
  value: string, 
  target: HTMLInputElement
}

type UserMouseEvent = {
  value: [number, number], 
  target: HTMLElement
}

type UserEvent = UserTextEvent | UserMouseEvent

function handle(event: UserEvent) {
  if (typeof event.value === 'string') {
    event.value  // string
    event.target // HTMLInputElement | HTMLElement (!!!)
    // ...
    return
  }
  event.value    // [number, number]
  event.target   // HTMLInputElement | HTMLElement (!!!)
}
```
`event.value` 에 대해서는 refinement 가 작동했으나 `event.target` 에는 적용되지 않았다. 왜 그런가? `handle` 함수가 `UserEvent` 를 인자로 받을 때, 이게 의미하는 바가  `UserTextEvent` or `UserMouseEvent` 를 인자를 받을 수 있다는 의미는 아니다. 사실 union type 인 UserMouseEvent | UserTextEvent 은 `UserTextEvent` or `UserMouseEvent` 과는 의미가 다르다. 무슨 말이냐 하면 우리가 설정한  union type 이  overlap 될 수도 있기 때문이다. 

TypeScript needs a more reliable way to know when we’re in one case of a union type versus another case. 

The way to do this is to use a literal type to tag each case of your union type. A good tag is:

 - On the same place in each case of your union type. That means the same object field if it’s a union of object types, or the same index if it’s a union of tuple types. In practice, tagged unions usually use object types.  
 - Typed as a literal type (a literal string, number, boolean, etc.). You can mix and match different types of literals, but it’s good practice to stick to a single type; typically, that’s a string literal type.  
 - Not generic. Tags should not take any generic type arguments.  
 - Mutually exclusive (i.e., unique within the union type).

With that in mind, let’s update our event types again:

```ts
type UserTextEvent = {
  type: 'TextEvent', 
  value: string, 
  target: HTMLInputElement
}

type UserMouseEvent = {
  type: 'MouseEvent', 
  value: [number, number],
  target: HTMLElement
}

type UserEvent = UserTextEvent | UserMouseEvent

function handle(event: UserEvent) {
  if (event.type === 'TextEvent') {
    event.value  // string
    event.target // HTMLInputElement
    // ...
    return
  }
  event.value    // [number, number]
  event.target   // HTMLElement
}
```
Now when we refine event based on the value of its tagged field (event.type), TypeScript knows that in the if branch event has to be a UserTextEvent, and after the if branch it has to be a UserMouseEvent. Since the tag is unique per union type, TypeScript knows that the two are mutually exclusive.

**Use tagged unions when writing a function that has to handle the different cases of a union type. For example, they’re invaluable when working with Flux actions, Redux reducers, or React’s useReducer.**

## Totality

Totality, also called exhaustiveness checking, is what allows the typechecker to make sure you’ve covered all your cases.

타입스크립트는 모든 경우의 수를 검토하여, 오류가 있을 경우 경고를 해준다. 예를들면 다음과 같다. 

We clearly missed a few days (it’s been a long week). TypeScript comes to the rescue:

```ts
type Weekday = 'Mon' | 'Tue'| 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

function getNextDay(w: Weekday): Day {
  switch (w) {
    case 'Mon': return 'Tue'
  }
} 
// Error TS2366: Function lacks ending return statement and
// return type does not include 'undefined'.

```
아래와 같은 경우가 있어도 마찬가지다. no matter what kind of control structure you use — switch, if, throw, and so on — TypeScript will watch your back to make sure you have every case covered.


```ts
function isBig(n: number) {
  if (n >= 100) {
    return true
  }
}
// Error TS7030: Not all code paths return a value.
```

사실 우리가 선언한 변수에 접근할 때 typescript 가 우리가 놓친 부분을 찾아 오류를 뱉어주길 기대할 수도 있지만, 그보다 미리 안전하게 타입을 정의하는 방법도 있다. “The Record Type”, “Mapped Types”이 그것인데 그전에 object types 에 적용할 수 있는 type operators 를 먼저 살펴보고 가자.

## Advanced Object Types

### Type Operators for Object Types
intersection(&), union(|) 이외에 별도 type operator가 더 있다. 좀 더 배워보자.

#### The Keying-in operator
global social media GraphQL API 로 부터 받아야 중첩된 데이터를 model 한다고 가정해보자. 

```ts
type APIResponse = {
  user: {
    userId: string
    friendList: {
      count: number
      friends: {
        firstName: string
        lastName: string
      }[]
    }
  }
}
```
아마 우리는 해당 API로 부터 data를 fetch 해서 render 할 것이다. 

```ts
function getAPIResponse(): Promise<APIResponse> {
  // ...
}

// 아직 friendList의 타입을 정의하지 않음
function renderFriendList(friendList: unknown) {
  // ...
}

let response = await getAPIResponse()
renderFriendList(response.user.friendList)
```
`friendList`의 type은 무엇이어야 할까? 전체 객체 구조에서 해당하는 부분의 객체를 다시 정의한 타입을 만들 수 있을 것이다. 
```ts
type FriendList = {
  count: number
  friends: {
    firstName: string
    lastName: string
  }[]
}

type APIResponse = {
  user: {
    userId: string
    friendList: FriendList
  }
}

function renderFriendList(friendList: FriendList) {
  // ...
}

```
그러나 그렇게 할 필요가 없다. `key-in` opeerator를 쓰면 된다.

```ts
type APIResponse = {
  user: {
    userId: string
    friendList: {
      count: number
      friends: {
        firstName: string
        lastName: string
      }[]
    }
  }
}

type FriendList = APIResponse['user']['friendList']

function renderFriendList(friendList: FriendList) {
  // ...
}
```
key-in operator를 어떤 shape(object, class constructor, class instance), array 에도 사용할 수 있다. 예를들면 다음과 같이 friends 에서 각 friend를 key in 할 수도 있다.
```ts
type Friend = FriendList['friends'][number]
```
`[number]` 자리에 number literal을 사용해서 array type을 key in 할 수 있다. tuple 에 key in을 사용하기 위해 number literal(0, 1)을 사용하라.

key in을 사용하는 방법이 javascript에서 object를 조회할 때와 비슷한 대, key in을 사용할 때는 braket notation을 사용한다는 것을 꼭 명심하라. dot notation 은 사용하면 안된다. 

#### The keyof operator

keyof operator 를 사용하면 객체의 모든 key를 string literal 형태의 union type으로 얻을 수 있다.
```ts
type ResponseKeys = keyof APIResponse // 'user'
type UserKeys = keyof APIResponse['user'] // 'userId' | 'friendList'
type FriendListKeys =
  keyof APIResponse['user']['friendList'] // 'count' | 'friends'
```
keying-in, keyof operator를 활용하면 주어진 key를 통해 value를 찾는 type safe 한 getter function을 만들 수 있다.

```ts
function get< 
  O extends object,
  K extends keyof O 
>(
  o: O,
  k: K
): O[K] { 
  return o[k]
}
```
- get is a function that takes an object o and a key k.

- keyof O is a union of string literal types, representing all of o’s keys. The generic type K extends — and is a subtype of — that union. For example, if o has the type `{a: number, b: string, c: boolean}`, then keyof o is the type `'a' | 'b' | 'c'`, and K (which extends keyof o) could be the type `'a', 'b', 'a' | 'c'`, or any other subtype of keyof o.

- `O[K]` is the type you get when you look up K in O. Continuing the example from , if K is 'a', then we know at compile time that get returns a number. Or, if `K` is `'b' | 'c'`, then we know get returns `string | boolean`.

이런 type operator 의 장점은 shape 타입을 보다 안전하고 정확하게 표현할 수 있다는 점이다. 위애서 만든 get function을 사용해보자.
```ts
type ActivityLog = {
  lastEvent: Date
  events: {
    id: string
    timestamp: Date
    type: 'Read' | 'Write'
  }[]
}

let activityLog: ActivityLog = // ...
let lastEvent = get(activityLog, 'lastEvent') // Date
```
TypeScript는 컴파일 타임에 lastEvent 유형이 Date인지 확인한다. 물론 객체를 더 깊이 입력하기 위해 이것을 확장 할 수도 있다. 최대 3 개의 키를 받도록 overload 해보자 :

```ts
type Get = { // -1
  <
    O extends object,
    K1 extends keyof O
  >(o: O, k1: K1): O[K1] // -2
  <
    O extends object,
    K1 extends keyof O,
    K2 extends keyof O[K1] // -3
  >(o: O, k1: K1, k2: K2): O[K1][K2] // -4
  <
    O extends object,
    K1 extends keyof O,
    K2 extends keyof O[K1],
    K3 extends keyof O[K1][K2]
  >(o: O, k1: K1, k2: K2, k3: K3): O[K1][K2][K3] // -5
}

let get: Get = (object: any, ...keys: string[]) => {
  let result = object
  keys.forEach(k => result = result[k])
  return result
}

get(activityLog, 'events', 0, 'type') // 'Read' | 'Write'


get(activityLog, 'bad') // Error TS2345: Argument of type '"bad"'
                        // is not assignable to parameter of type
                        // '"lastEvent" | "events"'.
```

#### TSC Flag: keyofStringsOnly 

객체의 key는 number, symbol, string 이 될 수 있고 런타임에 모두 형변환되어 string 으로 변한다. 

이 때문에 key of 연산은 return 값이 `number | string | symbol` 이 될 수 있다. 그러나 keyof 연산을 할 때 다소 장황할 수 잇으므로, 이를 string으로 강제할 수 있는데,  tsconfig.json 에서 flag 인 `keyofStringsOnly` field를 enable 하면된다.  
(though if you call it on a more specific shape, TypeScript can infer a more specific subtype of that union). 

### The Record Type 

Record를 사용하여 각 요일에서 다음 요일까지 map을 작성해 볼 수 있다. Record를 사용하면 nextDay의 키와 값에 제약을 둘 수 있습니다.
Record 는 2개의 generic을 받는데 첫번째 제네릭이 key 로 쓰이고 두번째 generic이 value로 쓰인다. 


```ts
type Weekday = 'Mon' | 'Tue'| 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

let nextDay: Record<Weekday, Day> = {
  Mon: 'Tue'
}
// Error TS2739: Type '{Mon: "Tue"}' is missing the following properties from type 'Record<Weekday, Day>': Tue, Wed, Thu, Fri.
```
위에서 에러가 발생했는데, 첫번째 generic으로 전달된 부분에서 Tue, Wed, Thu, Fri 쪽에 대한 mapping 이 이루어지지 않아서 에러가 발생했다. 그 부분을 채우면 에러는 사라진다.
```ts
let nextDay: Record<Weekday, Day> = {
	Mon: 'Tue',
	Tue: 'Wed',
	Wed: 'Thu',
	Thu: 'Fri',
	Fri: 'Mon'
}
```
Record는 일반 object index signature왇 비교할 추가적인 기능을  제공한다. regular index signature 를 사용하면 object value의 type을 제한 할 수 있지만 key는 regular string, number 또는 Symbol 일 수 있습니다. Record를 사용하면 obejct key의 type을 string, number의 subtype 으로 제한 할 수 있다. 

#### 하기는 martin 블로그의 참고 내용이다.
https://velog.io/@zeros0623/TypeScript-%EA%B3%A0%EA%B8%89-%ED%83%80%EC%9E%85
Record 타입은 총 두개의 제네릭 타입을 받을 수 있다. 첫번째 제네릭 타입 K은 프로퍼티 타입으로, 두번째 제네릭 타입 T은 값의 타입으로 사용된다.

```ts
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```
Record 타입의 구조체를 살펴보면 일반적으로 사용하는 Object와 닮은 꼴을 하고 있다는 것을 알 수 있다. 아래와 같이 사용할 수 있다.
```ts
type IFooBar = {
  foo: string;
  bar: string;
};

type IHelloWorld = 'hello' | 'world';

const x: Record<IHelloWorld, IFooBar> = {
  hello: {
    foo: 'foo',
    bar: 'bar'
  },
  world: {
    foo: 'foo',
    bar: 'bar'
  }
}
```
### Mapped Type 
[mapped type에 대한 한국 블로그 글](https://velog.io/@zeros0623/TypeScript-%EA%B3%A0%EA%B8%89-%ED%83%80%EC%9E%85#mapped-types)
```ts
type Weekday = 'Mon' | 'Tue'| 'Wed' | 'Thu' | 'Fri'
type Day = Weekday | 'Sat' | 'Sun'

let nextDay: {[K in Weekday]: Day} = {
  Mon: 'Tue'
}
``` 
This is another way to get a helpful hint for how to fix what you missed: 
```ts
Error TS2739: Type '{Mon: "Tue"}' is missing the following properties
from type '{Mon: Weekday; Tue: Weekday; Wed: Weekday; Thu: Weekday;
Fri: Weekday}': Tue, Wed, Thu, Fri.
```

Record Type 은 내부적으로 mapped type을 쓰고 있음 
```ts
type Record<K extends keyof any, T> = {
  [P in K]: T
}

```
mapped type을 사용하면 object의 key와 value에 type을 부여 할 수있을뿐만 아니라 어떤 value type 에 어떤 key name 이 쓰여야 하는지 강제하기 때문에 더 강력하다.

또한 이 이외에 장점을 열거할 수 있는데, 그 장점은 다음과 같다. 
 
```ts
type Account = {
  id: number
  isEmployee: boolean
  notes: string[]
}

// Make all fields optional
type OptionalAccount = {
  [K in keyof Account]?: Account[K] 
}

// Make all fields nullable
type NullableAccount = {
  [K in keyof Account]: Account[K] | null 
}

// Make all fields read-only
type ReadonlyAccount = {
  readonly [K in keyof Account]: Account[K] 
}

// Make all fields writable again (equivalent to Account)
type Account2 = {
   // -(minus) operator 를 통해 readonly 속성을 제거할 수 있다.
  -readonly [K in keyof ReadonlyAccount]: Account[K] 
}

// Make all fields required again (equivalent to Account)
type Account3 = {
  // -(minus) operator 를 통해 optional 속성을 제거할 수 있다.
  [K in keyof OptionalAccount]-?: Account[K] 
}
```
#### `-`(minus) operator 
이는 `+` operator 의 반대인데, 우리가 보통 readonly, ? 등을 기술할 때 암묵적을 + 가 생략되므로 + operator 를 잘 쓰지 않는다.

### Built-in mapped types
```ts
Record<Keys, Values> 
// An object with keys of type Keys and values of type Values 

Partial<Object> 
// Marks every field in Object as optional 

Required<Object> 

// Marks every field in Object as nonoptional 

Readonly<Object> 
// Marks every field in Object as read-only 

Pick<Object, Keys> 
// Returns a subtype of Object, with just the given Keys
```

### Companion Object Pattern
보통은 objcect 와 class 가 같은 name 을 공유하는 pattern 이다. typescirpt 에서는 type과 object 가 같은 name 을 공유하는 pattern 을 말한다. 그 형태는 아래 코드와 같다.

```ts
type Currency = {
  unit: 'EUR' | 'GBP' | 'JPY' | 'USD'
  value: number
}

let Currency = {
  DEFAULT: 'USD',
  from(value: number, unit = Currency.DEFAULT): Currency {
    return {unit, value}
  }
}
```

TypeScript에서 type과 value은 별도의 name space 에 존재한다. 이에 대한 자세한 내용은 "Declaration Merging"에 나와 있다. 이것은 즉, 동일한 scope에서 type과 value에 동일한 name (이 예에서는 Currency)을 binding 할 수 있습니다. companion objcet pattern 을 사용하여이 별도의 name space를 활용하여 name 을  두 번, 즉 type으로, value 로 선언한다. 이 패턴에는 몇 가지 장점이 있다. Currency와 같이 단일 name에 type 과 value 정보를  의미론적(sementic) 하게 그룹화 할 수 있다. 또한 consumer 가 동시에 type 과 value 를 import 할 수 있다. 

```ts
import {Currency} from './Currency'

let amountDue: Currency = { 
  unit: 'JPY',
  value: 83733.10
}

let otherAmountDue = Currency.from(330, 'EUR')  

```
`import` 한번에 Currency 를 type 과 value 로 사용할 수 있었다. 

## Advanced Function Types

### Improving Type Inference for Tuples

TypeScript에서 Tuple을 선언하면 TypeScript는 해당 Tuple type을 infer하는 데 관대(lenient)하다. 튜플의 길이와 어떤 자리가 보다 정확하게 어떤 type을 가지는지를 무시하고, 우리가 기술한 것 에 따라 가장 general 하게 type을 infer한다.

```ts
let a = [1, true] // (number | boolean)[]
```
> type casting 이란 형 변환을 의마한다.

그러나 우리는 때론 엄격한 타입 추론을 원하는데, fixed lenght tuple 이라던가, type assertion 을 통해 tuple 을 tuple type으로 타입 캐스팅(형 변환) 하는 것이 이에 해당 한다. 또한 const 를 써서 tuple type 을 좀 더 narrowly 하며 추론할 수 있다. 동시에 해당 type 은 readonly 상태가 된다. 

그런데 만약 tuple 에 대해 tuple type을 정의하고 싶은데 type asserton 을 사용하거나, 그리고 const를 사용해서 해당 type 을 readonly 를 만들고 싶지는 않다. 그런 방법을 제외하고  목적을 달성하고 싶다면 어떻게 해야할까? 

그럴 때 우리는 rest parameter 를 활용할 수 있다.

```ts
function tuple<  // tuple function 을 선언했다.
  T extends unknown[] // unknown 의 subtype이란 뜻은 어떤 종류의 array 가 들어와도 된다는 뜻이다. 
>(
  ...ts: T // T 가 rest parmater의 type을 정의하고 있으므로, 타입스크립트가 rest paramter를 위한 tuple 타입을 infer 한다. 
): T { 
// tuple 함수는 ts를 유추 한 것과 동일한 튜플 유형의 값을 반환한다
  return ts 
}

let a = tuple(1, true) // [number, boolean]
```
위와 같이 tuple 함수를 사용하면 코드에서 많은 튜플 타입을 사용할 때 type assertion 을 일일히 선언하는 수고를 덜 수 있다. 

예전에 아래와 같은 내용을 살펴 본적 있다. 
#### Using bounded polymorphism to model arity

> ##### arity
>
> meaning: (logic, mathematics, computer science) The number of arguments or operands a function or operation takes. For a relation, the number of domains in the corresponding Cartesian product.
> argument 가 몇개 들어올지 예상하지 못하는 때에도 bounded polymorphism 이 쓰일 수 있다.

```ts
function call(f: (...args: unknown[]) => unknown, ...args: unknown[]): unknown {
  return f(...args);
}

function fill(length: number, value: string): string[] {
  return Array.from({ length }, () => value);
}

call(fill, 10, 'a'); // evaluates to an array of 10 'a's

function call<T extends unknown[], R>(f: (...args: T) => R, ...args: T): R {
  return f(...args);
}

// 이로써 타입 추론이 가능해지고, 잘못된 타입 이나 타입 갯수를 입력하면 오류를 발생시킨다.

let a = call(fill, 10, 'a'); // string[]
let b = call(fill, 10); // Error TS2554: Expected 3 arguments; got 2.
let c = call(fill, 10, 'a', 'z'); // Error TS2554: Expected 3 arguments; got 4.
```
### User-Defined Type Guards
boolean 을 return 하는 함수가 있다고 치자. 그런데 가끔은 boolean을 return 하는 함수가 boolean을 리턴한다는 정보를 말하는 것으로 충분하지 않은 상황이 있다. 다음 코드를 보며 이해하자.
```ts
function isString(a: unknown): boolean {
  return typeof a === 'string'
}

isString('a') // evaluates to true
isString([7]) // evaluates to false
```
위 함수가 리턴한 값의 type 은 함수 선언에 명시된 return type 에 따라 boolean 이다. 그런데 다음과 같이 isString 함수가 실제 코드에 쓰일 때는 어떨까? 
```ts
function parseInput(input: string | number) {
  let formattedInput: string
  if (isString(input)) {
    formattedInput = input.toUpperCase() // Error TS2339: Property 'toUpperCase'
  }                                      // does not exist on type 'number'.
}
```
`isString` 을 통과했다면 input 이 string type 으로 refinement 되는게 더 바람직하지 않은가? 하지만 scope를 벗어낫을 때 (function에서 return 이 된 경우)는 더 이상 type refinement 가 작동하지 않는다. 

이런 이슈를 어떻게 해결할 수 있을까? scope를 벗아난다 하더라도 refinement 된 string 타입을 얻고 싶다면? `user-defined type guard` 가 필요한 순간이다.

```ts
function isString(a: unknown): a is string {
  return typeof a === 'string'
}
```
Type Guard는 내장 TypeScript 기능이며 typeof 및 instanceof로 type을 refine 할 수 있는데, 가끔 사용자가 type guard를 스스로 써야 할 때가 있다. function 뒤에 is 연산자를 붙여서 user defined type guard를 만들 수 있다. is 연산자는 하나의 paramter 밖에 못 받을 뿐, 이것이 하나의 타입만으로 제한된 다는 뜻은 아니다. 다음 예제를 보자.

```ts
type LegacyDialog = // ...
type Dialog = // ...

function isLegacyDialog(
  dialog: LegacyDialog | Dialog
): dialog is LegacyDialog {
  // ...
}
```
user defined type guard를 쓸일이 그렇게 많지는 않겠지만, 그것이 필요한 순간에 코드를 클린하고, 재사용가능하게 짤 수 있다. user defined type guard 가 없다면 매 라인을 typeof, instanceof 연산자로 떡칠해야할 것이다. 


## Conditonal Types

### 참고한 내용 

- [조건부 타입 velol 블로그](https://velog.io/@zeros0623/TypeScript-%EA%B3%A0%EA%B8%89-%ED%83%80%EC%9E%85#%EC%A1%B0%EA%B1%B4%EB%B6%80-%ED%83%80%EC%9E%85conditional-types)

- [infer 에 대한 설명](https://dev.to/aexol/typescript-tutorial-infer-keyword-2cn)

Conditonal Type 는 타입을 간단히 말하면 이런 것이다. 타입 T를 선언하는데,  U 와 V 에 따라서 타입 T를 선언한다. 구체적으로 U <: V(U가 V의 subtype 공변)이면 타입 T를 A에 할당한다. 코드로 보면 다음과 같다.

```ts
type IsString<T> = T extends string // condition part 
  ? true 
  : false 

type A = IsString<string> // true
type B = IsString<number> // false
```
`T extends string ?` 는 타입 T가 `string`  type의 subtype 인지 검사한다. 

regular ternary expression 과 마찬가지로 conditonal type도 중첩 할 수 있다. conditional type에는 type alias 만 쓰도록 제한되지 않는다. iinterfaces, classes, parameter types, and generic defaults in functions and methods.를 사용할 수있는 거의 모든 곳에서 사용할 수 있다.

### Distributive Conditional 

예제와 같은 간단한 조건을 표현할 수 있지만 conditional types, overloaded function signatures, and mapped types 을 사용하여 TypeScript에서 다양한 방식으로 살펴본 결과, 조건부 유형을 통해 더 많은 작업을 수행 할 수 있다. 그 이유는 그들이 분배 법칙을 따르기 때문이다 . 즉, 조건부 유형 인 경우 오른쪽의 표현식은 표 6-1의 왼쪽 표현식과 동일하다.

![Distributing conditional type](https://imgur.com/7mR8iji.png)

예제를 통해 좀 더 구체적으로 살펴보자. 타입 T 변수를 받아 T 타입의 배열을 반환하는 함수가 있다고 가정해보자. 우리가 타입 T에 union 을 전달하면 어떻게 될까? 

```ts
type ToArray<T> = T[]
type A = ToArray<number>          // number[]
type B = ToArray<number | string> // (number | string)[]
```
결과는 직관적이다. 그렇다면 conditional type을 전달한다면 어떻게 될까? (conditional type의 경우 두 분기가 모두 T[]로 해석되므로 여기서 실제로 아무 작업도 수행하지 않는다. 여기서는 그저 TypeScript가 T를 튜플 타입에 분배(distribute) 하도록 지시한다 ) 결과는 다음과 같다. 

```ts

type ToArray<T> = T[]
type A = ToArray<number>          // number[]
type B = ToArray<number | string> // (number | string)[]

// Conditonal Type을 쓰는 경우 
type ToArray2<T> = T extends unknown ? T[] : T[]
type A = ToArray2<number> // number[]
type B = ToArray2<number | string> // number[] | string[]

```
conditional type 을 가져와 각 element 에 배포한다. `(number | string)[]`  가 아닌 `number[] | string[]`의 결과를 얻을 수 있다. 그런데 이걸 어디다 쓰는가? 안전하게 common operation(`&, |`과 같은 식) 을 표현할 수 있다. 예를들면 타입 T와 U 가 있을 때, T에는 있고, U에는 없는 타입을 선언할 수 있다. 
```ts
type Without<T, U> = T extends U ? never : T 

//You use Without like so: 
type A = Without<
  boolean | number | string, boolean
> // number | string
```
타입스크립트가 어떻게 이 타입을 계산하는지 함께 살펴보자.

1. Start with the inputs:  
```ts
type A = Without<boolean | number | string, boolean> 
```
2. Distribute the condition over the union:  
```ts
 type A = Without<boolean, boolean>
       | Without<number, boolean>
       | Without<string, boolean> 
```       
3. Substitute in Without’s definition and apply T and U:  
```ts
type A = (boolean extends boolean ? never : boolean)
       | (number extends boolean ? never : number)
       | (string extends boolean ? never : string) 
```       
4. Evaluate the conditions:  
```ts
type A = never
       | number
       | string 
```
5. Simplify:

```ts
type A = number | string
```

If it wasn’t for the distributive property of conditional types, we would have ended up with never (if you’re not sure why, walk through what would happen for yourself!).

### infer kewword

## Escape Hatches
## Simulating Nominal Types
## Safely Extending the Prototype