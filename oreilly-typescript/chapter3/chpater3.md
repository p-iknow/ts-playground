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