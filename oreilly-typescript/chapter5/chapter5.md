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
