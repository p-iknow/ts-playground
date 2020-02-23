# Chatper4 Function

## Rest Parameters
- 유동적인 갯수의 parameter를 받으면서 타입 안전성을 확보하려 할때 rest parameter가 도움이 된다. 
```ts
function sumVariadic(): number {
  return Array
    .from(arguments)
    .reduce((total, n) => total + n, 0)
}

sumVariadic(1, 2, 3) // expeted 0 parameter but got 3 

// restParameter 가 쓰이는 경우 

function sumVariadicSafe(...numbers: number[]): number {
  return numbers.reduce((total, n) => total + n, 0)
}

sumVariadicSafe(1, 2, 3) // evaluates to 6

```

### rest paramter를 다른 paramter 와 함께 쓸 경우
- 가장 마지막에 res paramter를 위치 시켜야 한다. 
```ts
interface Console {
  log(message?: any, ...optionalParams: any[]): void
}

```

## Typing this 
- 타입스크립트에서는 함수 선언시에 가장 첫번째 paramter로 this에 대한 타입을 정의할 수 있다. 
- this 에 대한 paramter는 다른 parameter 와 다르게 다뤄지는데 this 는 예약어로 function signautre 의 일부로 사용된다. 
```ts
function fancyDate(this: Date) {
  return `${this.getDate()}/${this.getMonth()}/${this.getFullYear()}`
}

fancyDate.call(new Date) // evaluates to "6/13/2008"

fancyDate() // Error TS2684: The 'this' context of type 'void' is
            // not assignable to method's 'this' of type 'Date'.
```
- this에 대한 타입을 제공하면 컴파일 타임에 해당 오류에 대해 경고를 받을 수 있다. 

### `noImplicitThis` 
- `tsconfig.json` 에서 `noImplicitThis` 을 `enable` 하면 항상 명시적으로 this 타입을 적어야 하는 환경을 만들 수 있다. 
- 이 옵션은 `class` 나 객체 리터럴안의 `method` 에는 적용되지 않는 옵션이니 참고해야 한다. 

## Generator Function
 - 타입 스크립트에서 generator 함수를 타입을 어떻게 처리하는지 확인해보자. 
```ts
function* createNumbers(): IterableIterator<number> {
  let n = 0
  while (1) {
    yield n++
  }
}

let numbers = createNumbers()
numbers.next()  // evaluates to {value: 0, done: false}
numbers.next()  // evaluates to {value: 1, done: false}
numbers.next()  // evaluates to {value: 2, done: false}
```
### iterable, iterator 
- `iterable:` `Symbol.iterator` 라는 프로퍼티를 가지고 해당 프로퍼티의 값은 iterator 를 리턴하는 함수여야 한다. 
- `iterator:` `next` 라는 메소드를 가지는데 이 메소드가 리턴하는 객체는 `value`, `done` property를 가지고 있다. 

>### TSC FLAG: `downLevelIteration` 
> - 타입스크립트 compile 시에 ES2015 버전 보다 낮은 JS 버전으로 compile 할 경우가 있는데, `downLevelIteration` 플래그를 옵션을 사용하여 custom iterator 를 사용할 수 있다. 
>- bundle size에 민감하다면 해당 옵셤을 disable 할 수도 있다. 옛날 버전에서도 동작하는 custom iterator 를 만들기 위해서는 상당히 많은 량의 코드가 필요하기 때문이다. 
>- 예를 들어 앞단에 다루었던 numbers iterator 의 경우 거의 1kb 코드를 생산한다. (gzip 압축을 했을 경우) 

## Call Signature 
아래와 같은 함수의 타입을 뭐라고 정의할 수 있을까? `Function` type?
```ts
function sum(a: number, b: number): number {
  return a + b
}
```
`Funtion` type 은 `object` type이 그랬던 것 처럼 `Function` type은 우리에게 어떤 정보도 제공하지 않는다.(이것이 함수라는 사실을 제외하고는) 그렇다면 우리는 `sum` 함수의 타입에 대해 어떻게 표현할 수 있을까? 

이렇게 표현할 수도 있을 것이다. `sum` 은 함수이며, a, b 두개의 `number` type 의 `parameter` 를 가지고, `number` type 를 리턴하는 함수이다. 이를 typescript 로 표현하면 아래와 같다. 

```ts
(a: number, b: number) => number
```

우리가 함수를 함수를 인자(argument)로 전달할 때 혹은 다른 함수로 부터  함수를 return 할 때 Call Signature를 사용할 수 있다. 

> ### Note
> `parameter` a, b 라는 name 은 단순히 문서(documentation) 으로서의 기능할 뿐 할당(assignability)에는 영향을 미치지 않는다. 

Function call signature 는 type-level code 만 포함하므로(value가 없고 오로지 타입만을 기술함), deafault value에 대해서는 표현할 수 없다. 왜냐면 default value는 value 이기 때문이다. 또한 call signature 에는 function body 가 포함되지 않기 때문에 함수의 return type 에 대해 추론할 수 없고 이 때문에 명시적으로 타입을 적어야 한다.

```ts
type Log = (message: string, userId?: string) => void

let log: Log = ( 
  message, 
  userId = 'Not signed in' 
) => { 
  let time = new Date().toISOString()
  console.log(time, message, userId)
}
```
call signature 를 구체적으로 적용해보자. call signature를 어떻게 적용해야 할까? 함수 표현식과 함께 call signature 를 사용할 수 있다. 

call signature `Log` 에서 해당 함수의 paramter 와 return 값의 type을 미리 정의했기 때문에 표현식을 쓸 때는 별도 작성이 필요없다. 다만 default value는 call signature 에서 표현할 수 없으므로 표현식에서 별도 표기해야한다. 

## Contextual Typing(상황적 타이핑)
위의 예제에서 함수 표현식을 기술할 때 message 에 대한 type을 별도로 정의하지 않았다. 이미 call signature 에서 정의를 했기 때문이다. 그런데 타입스크립트는 어떻게 call signature에 정의된 내용을 함수 표현식에 적용할 수 있었을까? 이것이 바로 `contextual typing` 이라는 타입 스크립트의 강력한 기능이다. 

```ts
function times(
  f: (index: number) => void,
  n: number
) {
  for (let i = 0; i < n; i++) {
    f(i)
  }
}

times(n => console.log(n), 4)
```
우리가 times 함수를 호출할 때 익명함수를 inline 으로 전달한다면 별도의 타입을 정의할 필요가 없다. 타입스크립트는 문맥(context)을 참고하여 인자로 전달되는 inline 함수의 인자와 리턴값에 대해 추론할 수 있다. 다만 인자로 전달하는 함수를 inline 이 아닌 별도 변수에 선언(선언 당시에 type 정의를 하지 않았을 경우)하여 전달하는 경우 compile error 가 발생한다. 
```ts
function f(n) { // Error TS7006: Parameter 'n' implicitly has an 'any' type.
  console.log(n)
}

times(f, 4)
```

## Overloaded Function Types 

`overloaded function` 이란 여러개의 call signature 를 갖는 function 이라 할 수 있다. 

call signature 에는 2가지 종류가 있는데, 
```ts 
// short hand
type Log = (message: string, userId?: string) => void

// Full call signature
type Log = {
  (message: string, userId?: string): void
}
```
`Full call signature`가 필요할 때가 있는데 바로, `overloaded function type` 을 사용할 때이다. 

자바스크립트는 동적 언어(dynamic language)이기 때문에 주어진 함수를 호출하는 다양한 패턴을 가진다. 즉 input tpye 에 따라 output type 이 바뀐다. 

타입스크립트는 이런 동적인 특성을 `overloaded function` 을 통해 표현한다.

여행 예약시스템의 예를 들어 overloaded function을 살펴보자. 

```ts
type Reserve = {
  (from: Date, to: Date, destination: string): Reservation;
  (from: Date, destination: string): Reservation;
};

let reserve: Reserve = (from, to, destination) => {
  //

};
```
![missing a combined overloaded signature](https://imgur.com/SzBZB5S.png)

위에 overloaded function을 실제 적용하는 영역에서 에러가 발생한다. 이는 typescript 에서 overloading 이 작동하는 방식 때문이다. 특정 함수 f 를 위해 overload signature type을 선언했다고 치자, 실제 signature를 적용하는 함수 f의 타입 관점에서 함수 f의 타입은 2가지 call signature의 union type 이다. 

그러나 함수 f를 적용하는 관점에서는 2가지의 union 타입이 아닌 두 union을 합친 하나의 타입이 되어야만 함수에 적용할 수 있다. 함수 f 에 overload signature를 도입할 때 이를 손수(manually) 정의 해야한다. 이런 상황에서 추론(infer)을 활용할 수 없다. 

문제를 해결하기 위해 함수 적용 부분을 업데이트 하면 다음과 같다. 
```ts
type Reserve = {
  (from: Date, to: Date, destination: string): Reservation
  (from: Date, destination: string): Reservation
} 

let reserve: Reserve = (
  from: Date,
  toOrDestination: Date | string,
  destination?: string
) => { 
  // ...
}
```
적용시점의 signature(implement's signature)는 2가지 overload signature를 조합한 결과이다. 여기서 주목해야 할게 있다. 이렇게 손수 조합한 siganture는 reserve 를 call 하는 소비자의 관점에서는 보이지 않는다. 
그렇다고 아래에서 처럼 손수 합친 signature를 overload siganture에 포함할수도 없는 노릇이다.

```ts
// Wrong!
type Reserve = {
  (from: Date, to: Date, destination: string): Reservation
  (from: Date, destination: string): Reservation
  (from: Date, toOrDestination: Date | string,
    destination?: string): Reservation
}
```
`reserve` 가 2가지 방식으로 불릴 수 있기 때문에, 실제 타입을 적용할 때에는 어떤 방식으로 호출되는지 검사 하는 로직을 넣어 타입의 안정성을 확보했다는 것을 타입스크립트 컴파일러에게 증명해야 한다. 아래와 같이 말이다. 
```ts
let reserve: Reserve = (
  from: Date,
  toOrDestination: Date | string,
  destination?: string
) => {
  if (toOrDestination instanceof Date && destination !== undefined) {
    // Book a one-way trip
  } else if (typeof toOrDestination === 'string') {
    // Book a round trip
  }
}

```
### Keeping `overloa signature` specific 
사실 함수 적용시에 signature를 재 작성할 때 overload 된 부분을 할당 가능하게끔만 하면 된다. 무슨 말인가 하면, 아래 처럼 각 paramter에 any 타입을 써도 oveload 된 signature를 적용할 수 있다는 말이다.
```ts
let reserve: Reserve = (
  from: any,
  toOrDestination: any,
  destination?: any
) => {
  // ...
}
```  
가능하더라도 위 처럼 쓰지는 말자. 위 처럼 쓰면 함수를 구현하는 쪽에서 힘들다. 

```ts
function getMonth(date: any): number | undefined {
  if (date instanceof Date) {
    return date.getMonth()
  }
}
```
any를 썻다면 함수 body에서 해당 타입이 Date 인지에 대해 다시 한번 검증하는 코드를 써야 한다. 타입을 specific 하게 정의했다면 아래와 같이 간다하게 적용할 수 있다. 

```ts
function getMonth(date: Date): number {
  return date.getMonth()
}
```
또한 이렇게 하면 editor의 autocomplete 혜택을 누릴 수도 있다.

### Ex, createElement DOM API

```ts
type CreateElement = {
  (tag: 'a'): HTMLAnchorElement 
  (tag: 'canvas'): HTMLCanvasElement
  (tag: 'table'): HTMLTableElement
  (tag: string): HTMLElement 
}

let createElement: CreateElement = (tag: string): HTMLElement => { 
  // ...
}
```
 'a', 'canvas', 'table' 이 `string` 의 subtype 이므로 함수 적용 시점에 `string` 을  쓸 수 있었다. 

 함수 선언식의 경우 아래와 같이 동일한 오버로딩 문법을 제공한다.
 ```ts
 function createElement(tag: 'a'): HTMLAnchorElement
function createElement(tag: 'canvas'): HTMLCanvasElement
function createElement(tag: 'table'): HTMLTableElement
function createElement(tag: string): HTMLElement {
  // ...
}
 ```
full type signature는 어떤 형태로든 함수를 호출 할 수 있도록 열려 있 된다. 즉 제한이 없다. 또한 함수 객체의 property에 대한 type 도 설정할 수 있다

```ts
type WarnUser = {
  (warning: string): void
  wasCalled: boolean
}

function warnUser(warning) {
  if (warnUser.wasCalled) {
    return
  }
  warnUser.wasCalled = true
  alert(warning)
}
warnUser.wasCalled = false

```

## Polymorphism 
```ts
// filter function body
function filter(array, f) {
  let result = []
  for (let i = 0; i < array.length; i++) {
    let item = array[i]
    if (f(item)) {
      result.push(item)
    }
  }
  return result
}

filter([1, 2, 3, 4], _ => _ < 3) // evaluates to [1, 2]

// filter type 
type Filter = {
  (array: number[], f: (item: number) => boolean): number[]
  (array: string[], f: (item: string) => boolean): string[]
  (array: object[], f: (item: object) => boolean): object[]
}

// filter use 
let result = filter(
  names,
  _ => _.firstName.startsWith('b')
) // Error TS2339: Property 'firstName' does not exist on type 'object'.

result[0].firstName // Error TS2339: Property 'firstName' does not exist
                    // on type 'object'.
```
- type object 는 그것이 object type 이라는 것 외에는 아무것도 알려주지 않는다. 그 안에 내부적으로 어떤 property or method 가 있는지는 알 수 없다. 
- 때문에 object type을 쓴 overload signature로는 filter 함수를 표현하기 어렵다. 
- 이럴때 필요한게 `generic type parameter` 이다.

### Generic Type Parameter
A placeholder type used to enforce a type-level constraint in multiple places. Also known as `polymorphic type parameter`.

```ts
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}

type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}

let filter: Filter = (array, f) => // ...

// (a) T is bound to number
filter([1, 2, 3], _ => _ > 2)

// (b) T is bound to string
filter(['a', 'b'], _ => _ !== 'b')

// (c) T is bound to {firstName: string}
let names = [
  {firstName: 'beth'},
  {firstName: 'caitlyn'},
  {firstName: 'xin'}
]
filter(names, _ => _.firstName.startsWith('b'))

```
### When Are Generics Bound?
generic type 을 어디 선언했는지는 tpye 의 scope 뿐만 아니라 언제 type이 binding 될지까지도 결정한다. 아래 예제를 살펴보자.
```ts
type Filter = {
  <T>(array: T[], f: (item: T) => boolean): T[]
}

let filter: Filter = (array, f) =>
  // ...
```
위 코드는 generic type 을 call signature (`()`의 앞에) 의 일부로 선언했으므로 함수를 call 할 때 type 이 binding 된다. 

만약 우리가 generic type 의 scope을 type alias 인 Filter 로 정의했다면, 우리는 Filter Type 을 사용할 때 generic type에 사용될 타입을 전달해야 한다. 아래 예제를 살펴보자
```ts
Filter: type Filter<T> = {
  (array: T[], f: (item: T) => boolean): T[]
}

let filter: Filter = (array, f) => // Error TS2314: Generic type 'Filter'
  // ...                           // requires 1 type argument(s).

type OtherFilter = Filter          // Error TS2314: Generic type 'Filter'
                                   // requires 1 type argument(s).

let filter: Filter<number> = (array, f) =>
  // ...

type StringFilter = Filter<string>
let stringFilter: StringFilter = (array, f) =>
  // ...
```
일반적으로, generic type을 사용하는 순간 concrete type bind 한다고 생각하면 된다. 예를 들어 보자. 함수라면 함수를 call 할때가 될 것이고, clsss 라면 생성자 함수를 호출할 때(instantiate) 이고, type aliases 혹은 interface 라면 그것들을 적용(implement)하는 순간에 concrete type 을 bind 한다.   

### Where Can You Declare Generics?
generic type 을 선언하는 여러 방식이 있는데 다음과 같다.
```ts
// 1 
type Filter = { 
  <T>(array: T[], f: (item: T) => boolean): T[]
}
let filter: Filter = // ...

// 2
type Filter<T> = { 
  (array: T[], f: (item: T) => boolean): T[]
}
let filter: Filter<number> = // ...

// 3
type Filter = <T>(array: T[], f: (item: T) => boolean) => T[] 
let filter: Filter = // ...

// 4
type Filter<T> = (array: T[], f: (item: T) => boolean) => T[] 
let filter: Filter<string> = // ...


// 5
function filter<T>(array: T[], f: (item: T) => boolean): T[] { 
  // ...
}
```
1. single signature 로 사용됬으며, 함수를 call 할때 binding 한다
2. type alias 로 사용됬으며, 함수를 선언할 때 binding 한다. 
3. 1와 동작은 같고, 단지 표기법이 short hand 일 뿐이다. 
4. 2와 동작은 같고, 단지 표기법이 short hand 일 뿐이다. 
5. named function signature(기명함수 표기)로 함수를 call 할 때 bind 하고, 각각의 함수 call 각 call 나름의 타입 binding을 갖느다. 

map function 을 가지고 예를 들어보자 
```ts
// sketch
function map(array: unknown[], f: (item: unknown) => unknown): unknown[] {
  let result = []
  for (let i = 0; i < array.length; i++) {
    result[i] = f(array[i])
  }
  return result
}

// 구현 
function map<T, U>(array: T[], f: (item: T) => U): U[] {
  let result = []
  for (let i = 0; i < array.length; i++) {
    result[i] = f(array[i])
  }
  return result
}
```

### Filter and Map in Standard Library 
`<T>` 의 경우 type alias에, `<U>` 의 경우 call signature의 scope 를 가지고 있는 것에 주목하자.
```ts
interface Array<T> {
  filter(
    callbackfn: (value: T, index: number, array: T[]) => any,
    thisArg?: any
  ): T[]
  map<U>(
    callbackfn: (value: T, index: number, array: T[]) => U,
    thisArg?: any
  ): U[]
}
```

### Generic Type Inference
기본적으로 generic type 은 전달된 paramter로 부터 추론을 통해 타입을 확정할 수 있지만, 함수 call 시에 타입을 명시적으로 정의할 수도 있다. 
```ts
function map<T, U>(array: T[], f: (item: T) => U): U[] {
  // ...
}

map(
  ['a', 'b', 'c'],  // An array of T
  _ => _ === 'a'    // A function that returns a U
)

//  You can, however, explicitly annotate your generics too. 
// Explicit annotations for generics are all-or-nothing; 
// either annotate every required generic type, or none of them: 

 map <string, boolean>(
  ['a', 'b', 'c'],
  _ => _ === 'a'
)

map   <string>( // Error TS2558: Expected 2 type arguments, but got 1.
  ['a', 'b', 'c'],
  _ => _ === 'a'
)
// OK, because boolean is assignable to boolean | string
map<string, boolean | string>(
  ['a', 'b', 'c'],
  _ => _ === 'a'
)

map<string, number>(
  ['a', 'b', 'c'],
  _ => _ === 'a'  // Error TS2322: Type 'boolean' is not assignable
)                 // to type 'number'.
```
그리고 타입 추론이 아닌 타입을 명시적으로 전달해야 하는 경우가 있는데 바로 Promise 를 사용할 때 이다. 아래 예제를 보자 

```ts
let promise = new Promise(resolve =>
  resolve(45)
)
promise.then(result => // Inferred as {}
  result * 4 // Error TS2362: The left-hand side of an arithmetic operation must
) 

let promise = new Promise<number>(resolve =>
  resolve(45)
)
promise.then(result => // number
  result * 4
)// be of type 'any', 'number', 'bigint', or an enum type.
```
`new Promise` 에 `<T>` type을 전달하지 않으면 default 로 `{}` 가 전달되고, 에러가 발생한다. 에러를 수정하기 위해 `<number>` 를 전달했다.

### Generic Type Alias

```ts
// generic type in a type alias: right after the type alias’s name, before its assignment (=).
type MyEvent<T> = {
  target: T
  type: string
} 

// you have to explicitly bind its type parameters when you use the type; they won’t be inferred for you: 
let myEvent: MyEvent<HTMLButtonElement | null> = {
  target: document.querySelector('#myButton'),
  type: 'click'
} 

type TimedEvent<T> = {
  event: MyEvent<T>
  from: Date
  to: Date
} 
```

function signature 일 때 typescirpt 의 동작 방식을 살펴볼 필요가 있다.
```ts
// generic type alias in a function’s signature
function triggerEvent<T>(event: MyEvent<T>): void {
  // ...
}

triggerEvent({ // T is Element | null
  target: document.querySelector('#myButton'),
  type: 'mouseover'
})
```
타입스크립트는 
- function signature 에 따라 triggerEvent 에 전달한 argument 는 `MyEvent<T>` 타입이어야 하는 것을 안다. 
- 또한 우리가 사전 정의한 `MyEvent<T>` 는 `{target: T, type: string}` 라는 것을 안다.
- 우리가 argument 로 전달한 객체의 target field 가 `document.querySelector('#myButton')` 라는 것을 알고, 그래서 `<T>` 은 `Element | null` 라는 것을 안다. 
- 그래서 모든 `<T>` 를 `Element | null` 로 대체한다. 
- 타입스크립트는 그 이후 모든 타입이 할당 가능성(assignability)을 충족하는지 체크한다. 
    
그렇게 타입 체크가 끝난다. 

### Bounded Polymorphism
`<T>` 타입을 그냥 T 타입 이라고 하지 못하고, 최소한 `<T>` 타입의 형태를 확장한 `<U>` 타입이라고 해야하는 경우가 있다. 도대체 무슨 말인가? 아래 binary Tree  예제에서 mapNode를 함수를 선언하는 경우를 살펴보자. 

#### binary tree 란 ?
- binary tree는 데이터 구조의 한 종류이다.
- binary tree는 node 들로 구성되어 있다. 
- node는 value filed 와 최대 2개 까지의 child node 에 대한 레퍼런스를 가지고 있다. 
- node는 2가지 type 중 하나로 결정되는데, 2가티 type은 leaf node(child node가 없음), inner node(child node가 있음) 이다. 

이를 코드로 표현하면 다음과 같다.

```ts
type TreeNode = {
  value: string
}
type LeafNode = TreeNode & {
  isLeaf: true
}
type InnerNode = TreeNode & {
  children: [TreeNode] | [TreeNode, TreeNode]
}
```

이제 mapNode 함수를 다뤄보자. mapNode 함수는 TreeNode 를 받아서 뭔가 변경을 한뒤에 다시 TreeNode 를 반환하는 함수이다.
```ts
let a: TreeNode = {value: 'a'}
let b: LeafNode = {value: 'b', isLeaf: true}
let c: InnerNode = {value: 'c', children: [b]}

let a1 = mapNode(a, _ => _.toUpperCase()) // TreeNode
let b1 = mapNode(b, _ => _.toUpperCase()) // LeafNode
let c1 = mapNode(c, _ => _.toUpperCase()) // InnerNode
```
mapNode 함수는 LeafNode 를 받으면 LeafNode를 리턴해야 하고, InnerNode를 받으면 InnerNode를 반환해야 한다. TreeNode 를 받으면 TreeNode 를 리턴해야 한다. 

어떻게 TreeNode 의 SubType 을 받아 같은 SubType을 리턴하는 함수를 만들 수 있을까? 

```ts
function mapNode<T extends TreeNode>( 
  node: T, 
  f: (value: string) => string
): T { 
  return {
    ...node,
    value: f(node.value)
  }
}
```
`<T>` 는 `Upper Bound of TreeNode` 를 가지는데, 이렇게 함으로써 return 할 때 `f()` 호출시에 `node.value` 처럼 value 값에 안전하게 접근할 수 있다.upper bound가 없으면 `<T>` 는 `number` type 이 될수도 있다. 그러나 value field에 접근하려면 T generic 은 최소 TreeNode 의 subType이어야 한다. 바로거 이것이 Bounded Polymorphism 이며, 최소한 `T` type 인 `U` 타입의 의미이다. 

혹자는 `mapNode` 를 `(node: TreeNode, f: (value: string) => string) => TreeNode,` 형식으로 정의할 수 있지 않을까 생각하지만, mapping 이후 a1, b1, c1의  결과 type은 모두 TreeNode 이며 우리는 더 자세한 정보(LeafNode, InnerNode)를 알 수 없다. 
결국 upper bound(`T extends TreeNode`) 를 하게 되면 우리는 보다 세부적인 Type 정보에 대해 알 수 있다.

#### Bounded polymorphism with multiple constraints

위에서는 하나의 type 제약을 가진 상황을 봣는데, 여러개의 제약조건을 가지는 상황이 있을 수 있고, 아래와 같이 표현할 수 있다. 
```ts
type HasSides = {numberOfSides: number}
type SidesHaveLength = {sideLength: number}

function logPerimeter< 
  Shape extends HasSides & SidesHaveLength 
>(s: Shape): Shape { 
  console.log(s.numberOfSides * s.sideLength)
  return s
}

type Square = HasSides & SidesHaveLength
let square: Square = {numberOfSides: 4, sideLength: 3}
logPerimeter(square) // Square, logs "12"
```

#### Using bounded polymorphism to model arity
> ##### arity 
> meaning: (logic, mathematics, computer science) The number of arguments or operands a function or operation takes. For a relation, the number of domains in the corresponding Cartesian product.
argument 가 몇개 들어올지 예상하지 못하는 때에도 bounded polymorphism 이 쓰일 수 있다. 
```ts
function call(
  f: (...args: unknown[]) => unknown,
  ...args: unknown[]
): unknown {
  return f(...args)
}

function fill(length: number, value: string): string[] {
  return Array.from({length}, () => value)
}

call(fill, 10, 'a') // evaluates to an array of 10 'a's
```
