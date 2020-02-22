# Unknown 
- 별도의 타입 체킹(`typeOf`, `instanceOf` - refine)을 하기 전 까지는 unkonwn type 을 사용하여 특정 연산을 할 수 없다.
- 단, `==`, `===`, `||`, `&&`, `||`, `?`, 비교 및 논리 연산자는 사용 가능하다. 
```ts
let a: unknown = 30         // unknown
let b = a === 123           // boolean
let c = a + 10              // Error TS2571: Object is of type 'unknown'.
if (typeof a === 'number') {
  let d = a + 10            // number
}
```

# Type Literal 
```ts
let a = true                // boolean
var b = false               // boolean
const c = true              // true
let d: boolean = true       // boolean
let e: true = true          // true
let f: true = false         // Error TS2322: Type 'false' is not assignable
                            // to type 'true'.
```
### `const c` 가 true 타입으로 결정되는 이유 ? 
const 를 통해 할당한 변수는 재할당이 불가하기 때문에 당시에 할당 된 타입을 보다 specific 하게  추론(infer) 하여 타입을 결정한다.

# Number type 
### tip 
긴 숫자를 사용할 때 numeric sperator를 사용해서 읽기 편하게 하자. 타입스크립트가 컴파일 할 당시에 numeric sperator 를 변환해준다. 
```ts
let oneMillion = 1_000_000 // Equivalent to 1000000
let twoMillion: 2_000_000 = 2_000_000

```

# Symbol 
`Symbol.hasInstance` 는 생성자 객체(class)가 특정 객체를 자신의 Instance로  인식하는지 확인하는 데 사용된다.`Symbol.hasInstance`를 통해  instanceof 연산자의 결과를 커스텀하게 변경할 수 있다. 아래 예제를 살펴보자
```js
class Array1 {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof Array1);
// expected output: true

```
### Symbol with const
- 심볼의 경우 고유한 값이기 때문에 `:unique symbol` 로 타입을 할당해도 `typeof f` 형식(`typeof [yourVariableName]`) 로 타입이 추론된다. (심볼 타입의 특성) 
- 심볼의 경우 let 의 선언한 변수에 할당이 불가하다. 심볼은 그 자체로 고유하기 때문이다.
```ts
const e = Symbol('e')                // typeof e
const f: unique symbol = Symbol('f') // typeof f
let g: unique symbol = Symbol('f')   // Error TS1332: A variable whose type is a
                                     // 'unique symbol' type must be 'const'.
let h = e === e             // boolean
let i = e === f             // Error TS2367: This condition will always return
                            // 'false' since the types 'unique symbol' and
                            // 'unique symbol' have no overlap.

```

# Object 

### type object 
- 단순히 object 타입을 선언하는 것은 any 와 비슷하며, 
- object 안에 어떤 structure인지 알 수 없다 
```ts
let a: object = {
  b: 'x'
}

a.b   // Error TS2339: Property 'b' does not exist on type 'object'.
```
- object 의 경우 별도의 type annotation 없이 compiler 가 object 의 구조를 파악해 type infer(추론)을 하게 하는 것도 object 타입을 정의하는 하나의 방법이다. 
  
```ts
let a = {
  b: 'x'
}            // {b: string}
a.b          // string

let b = {
  c: {
    d: 'f'
  }
}            // {c: {d: string}}
```

### Object Literal tpye
- null, undefined 외에 모든 값을 할당할 수 있는 타입이다.
```ts
let danger: {}
danger = {}
danger = {x: 1}
danger = []
danger = 2
```

### Type Inference When Declaring Objects with const
- object 타입의 경우 const와 함께 선언해도 타입을 type literal 로 추론하지 않는다. 해당 object의 filed 값은 언제든 재할당이 가능하기 때문이다. 
```ts
const a: {b: number} = {
  b: 12
}            // Still {b: number}
```
### Index Signature
- `[key: T]:` 형태로 정의 되는데 T 타입에는 `string, number` 만 할당 가능하다. 
- 보통 특정 형태(인덱스 시그니처에 정의한 형태로)로 확장 가능한 객체의 타입을 정의할 때 사용한다
```ts
let a: {
  b: number 
	c?: string 
	// 아래가 Index Signature 를 의미함
  [key: number]: boolean 
}
```


### 정리 
![object-type-table](https://imgur.com/CBrSKXc.png)

# Type Alias
- type alias 선언의 경우에도 javascript const, let과 같이 block scope 를 가지며, shadow도 동일하게 적용된다.
```ts
type Color = 'red'

let x = Math.random() < .5

if (x) {
  type Color = 'blue'  // This shadows the Color declared above.
  let b: Color = 'blue'
} else {
  let c: Color = 'red'
}

```

# Array

```ts
let a = [1, 2, 3]           // number[]
var b = ['a', 'b']          // string[]
let c: string[] = ['a']     // string[]
let d = [1, 'a']            // (string | number)[]
const e = [2, 'b']          // (string | number)[]

let f = ['red']
f.push('blue')
f.push(true)                // Error TS2345: Argument of type 'true' is not
                            // assignable to parameter of type 'string'.

let g = []                  // any[]
g.push(1)                   // number[]
g.push('red')               // (string | number)[]

let h: number[] = []        // number[]
h.push(1)                   // number[]
h.push('red')               // Error TS2345: Argument of type '"red"' is not
                            // assignable to parameter of type 'number'.
```
- `f case` 타입스크립트는 초기 선언 당시에 할당한 값을 배열의 타입으로 지정하고, 이후에 다른 타입이 push 되면 컴파일 에러가 발생한다. 
- `g case` 빈 배열로 초기화 할 경우 타입스크립트는 어떤 타입이 들어올지 추론(infer) 할 수 없고, 초기 배열에 any 타입을 부여하고, 값이 들어올 때 마다 해당 값에 따라 타입을 확장해 나간다. 

- 배열의 타입이 Union 일 경우 배열의 값을 사용하기전에 항상 타입체크를 한 뒤 사용해야 하는데, 이는 값이 어떤 타입으로 결정될지 런타임에만 알 수 있기 때문이다. 따라서 런타임에 해당 값이 가진 메소도를 안전하게 사용하기 위해서는 타입체크가 꼭 필요하다. 
```ts
let d = [1, 'a']

d.map(_ => {
  if (typeof _ === 'number') {
    return _ * 3
  }
  return _.toUpperCase()
})


```

- 배열이 정의된 scope를 벗어나면 해당 배열은 더 이상 확장할 수 없게 된다.(예를 들어 함수에서 배열을 선언 한 다음 해당 배열을 반환 한 경우가 그렇다)
```ts
function buildArray() {
  let a = []                // any[]
  a.push(1)                 // number[]
  a.push('x')               // (string | number)[]
  return a
}

let myArray = buildArray()  // (string | number)[]
myArray.push(true)          // Error 2345: Argument of type 'true' is not
                            // assignable to parameter of type 'string | number'.

```
# Tuple
- 대다수의 다른 타입과 다르게 튜플은 타입 추론을 할 수 없고 선언 당시에 타입을 꼭 명시해야 한다. 이는 자바스크립트의 문법이 array 와 tuple 에 대해 `[] ` 로 모두 동일하고, 타입스크립트에는 `[]` 에서 배열을 추론하는 규칙이 이미 있기 때문이다.  
  
```ts
let a: [number] = [1]

// A tuple of [first name, last name, birth year]
let b: [string, string, number] = ['malcolm', 'gladwell', 1963]

b = ['queen', 'elizabeth', 'ii', 1926]  // Error TS2322: Type 'string' is not
                                        // **assignable** to type 'number'.
```
### Tuple, optional support
```ts
// An array of train fares, which sometimes vary depending on direction
let trainFares: [number, number?][] = [
  [3.75],
  [8.25, 7.70],
  [10.50]
]

// Equivalently:
let moreTrainFares: ([number] | [number, number])[] = [
  // ...
]

```
### Tuple, rest element support
```ts
// A list of strings with at least 1 element
let friends: [string, ...string[]] = ['Sara', 'Tali', 'Chloe', 'Claire']

// A heterogeneous list
let list: [number, boolean, ...string[]] = [1, false, 'a', 'b', 'c']
```

### Tuple, lenght
- Tuple type 은 list의 length 값 또한 capture 한다.  

### Read-only array and Tuple 
- `readonly` 키워드를 통해 immutable 한 array 를 만들 수 있다.
- readonly array type 에 대해서는 `.concat, .slice` 와 같은 immutable method 만 사용할 수 있다. 
```ts
let as: readonly number[] = [1, 2, 3]     // readonly number[]
let bs: readonly number[] = as.concat(4)  // readonly number[]
let three = bs[2]                         // number
as[4] = 5            // Error TS2542: Index signature in type
                     // 'readonly number[]' only permits reading.
as.push(6)           // Error TS2339: Property 'push' does not
                     // exist on type 'readonly number[]'.
```
long form 으로 readonly array와 tuple 을 사용할 수도 있다.
```ts
type A = readonly string[]           // readonly string[]
type B = ReadonlyArray<string>       // readonly string[]
type C = Readonly<string[]>          // readonly string[]

type D = readonly [number, string]   // readonly [number, string]
type E = Readonly<[number, string]>  // readonly [number, string]

Cherny, Boris. Programming TypeScript . O'Reilly Media. Kindle Edition. 
```
- readonly array를 남용한다면 작은 업데이트에도 매번 값 복사가 일어나고 이는 runtime performance 를 해칠 수 있다. 
- 작은 사이즈의 배열인 경우 오버 헤드가 거의 눈에 띄지 않지만 더 큰 배열의 경우 오버 헤드가 상당히 커질 수 있다.

# null, undefined, void, and never

```ts
// (a) A function that returns a number or null
function a(x: number) {
  if (x < 10) {
    return x
  }
  return null
}

// (b) A function that returns undefined
function b() {
  return undefined
}

// (c) A function that returns void
function c() {
  let a = 2 + 2
  let b = a * a
}

// (d) A function that returns never
function d() {
  throw TypeError('I always error')
}

// (e) Another function that returns never
function e() {
  while (true) {
    doSomething()
  }
}
```
- `e` 영원히 return 하지 않고 계속해서 반복하므로 `nerver` type 으로 정의 된다. 
- `unknown`type 이 모든 type 의 super tpye 이라면 `never` type은 모든 type의 subtype 이다.   
- 즉 다른 모든 타입에 never type 인 값을 지정할 수 있다는 의미이다. 

# Enum
- 타입스크립트는 자동으로 enum의 value 를 추론(index 0 ~ ++1) 하는데, 타입을 명시적으로 선언할 수 있다.
```ts
enum Language {
  English = 0,
  Spanish = 1,
  Russian = 2
}
```
### unsafe acess
```ts
enum Color {
  Red = '#c10000',
  Blue = '#007ac1',
  Pink = 0xc10050,        // A hexadecimal literal
  White = 255             // A decimal literal
}

let red = Color.Red       // Color
let pink = Color.Pink     // Color

let a = Color.Red         // Color
let b = Color.Green       // Error TS2339: Property 'Green' does not exist
                          // on type 'typeof Color'.
let c = Color[0]          // string
let d = Color[6]          // string (!!!)

Cherny, Boris. Programming TypeScript . O'Reilly Media. Kindle Edition. 
```
- 접근시에 편의상 key, value 를 통해 모두 접근 가능하다. 
- 다만 `let d = Color[6]` 처럼 존재하지 않는 value 에도 접근이 가능하다는 점을 주의해야 한다. 이를 방지하기 위해서는 enum을 const 와 함께 써야 한다. 

```ts
const enum Language {
  English,
  Spanish,
  Russian
}

// Accessing a valid enum key
let a = Language.English  // Language

// Accessing an invalid enum key
let b = Language.Tagalog  // Error TS2339: Property 'Tagalog' does not exist
                          // on type 'typeof Language'.

// Accessing a valid enum value
let c = Language[0]       // Error TS2476: A const enum member can only be
                          // accessed using a string literal.

// Accessing an invalid enum value
let d = Language[6]       // Error TS2476: A const enum member can only be
                          // accessed using a string literal.
```
- `const enum` 의 경우 `reverse lookup(값을 통해 enum에 접근하는 것)` 을 지원하지 않아, js 의 object 타입 처럼 작동한다. 

### enum 의 취약점 
```ts
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
- enum의 value 가 'string' 이 아닌 경우 enum 에 숫자 값을 대입할 수 있다. 이를 고치기 위해서는 enum value가 'string' 이어야 한다. 

```ts
const enum Flippable {
  Burger = 'Burger',
  Chair = 'Chair',
  Cup = 'Cup',
  Skateboard = 'Skateboard',
  Table = 'Table'
}

function flip(f: Flippable) {
  return 'flipped it'
}

flip(Flippable.Chair)     // 'flipped it'
flip(Flippable.Cup)       // 'flipped it'
flip(12)                  // Error TS2345: Argument of type '12' is not
                          // assignable to parameter of type 'Flippable'.
flip('Hat')               // Error TS2345: Argument of type '"Hat"' is not
                          // assignable to parameter of type 'Flippable'.
```
- 단 하나의 숫자로 인해 전체 enum이 망가질 수 있다. 때문에 enum 사용을 피하고, 어쩔 수 없이 enum을 사용해야 하는 순간에는 numeric enmu 고= 

### const enum 자바스크립트로 컴파일 됬을 때 
- enmu 의 경우 자바스크립트로 컴파일 됬을 때 해당 enum의 number's value 값으로 바뀌게 되고, 별도 자바스크립트 코드를 생성하지 않는다. 
```ts
const enum Language {
  English,
  Spanish,
  Russian
}
```
- 예를 들면 코드에 쓰인 모든 Language.Spanish 는 1로 변환된다.
### 일반적인 enum 의 경우 다음과 같이 컴파일 된다. 
- 일반적인 enum 의 경우 inline 이 발생하지 않고 아래와 같은 객체를 만들어 reverse lookup 이 가능하다. 
```ts
// ts
enum JustEnumNumber {
  zero,
  one
}

console.log(JustNumber.one); // 1

//js

var JustEnumNumber;
(function(JustEnumNumber) {
  JustEnumNumber[(JustEnumNumber["zero"] = 0)] = "zero";
  JustEnumNumber[(JustEnumNumber["one"] = 1)] = "one";
})(JustEnumNumber || (JustEnumNumber = {}));

console.log(JustNumber.one); // 1
```

### const enum을 사용할 때 문제점 
- const 와 함께 선언된 enum을 다른 파일로 부터 import 해서 사용할 때 우리가 이미 컴파일을 끝낸 뒤에 enum의 작성자가 enum을 업데이트 한다면 우리가 사용하는 enum의 version 과 작성자의 enum version 이 다르다. 타입스크립트는 이 문제를 해결해주지 못한다. 
- const 와 함께 enum을 사용하려 한다면 inlining 을 피하고 자신의 컨트롤 영역에 있는(import 되거나 npm 에 퍼블리싱 하지 않을)코드에만 사용하라

# Summary 
- 타입스크립트가 타입을 추론하게 할 수도 있고 명시적으로 타입을 적어 수도 있다.
- const 키워드를 적으면 타입스크립트가 보다 세부적인 타입(type literal)을 추론(infer) 하고, var 혹은 let 키워드의 경우 보다 general 한 타입을 추론한다. 
- 대다수의 타입은 general 한 부분과 sepecific 한 부분이 있는데, specific 한 부분을 general 한 부분의 `subtype` 이라 한다. 

![Types and their more specific subtypes](https://imgur.com/6RXN3rg.png)