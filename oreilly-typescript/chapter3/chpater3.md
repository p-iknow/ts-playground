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

## Object 

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

## Type Alias
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

## Array

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

- 배열이 정의된 scope를 벗어나면 해당 배열은 더 이상 확장할 수 없게 된다.(예를 들어 함수에서 배열을 선언 한 다음 해당 배열을 반환 한 경우)
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
