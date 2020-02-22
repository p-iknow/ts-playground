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
