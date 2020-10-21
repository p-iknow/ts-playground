
// type Exclude<T, U> = T extends U ? never : T;
type Excluded = Exclude<string | number, string>; // number - diff

// type Extract<T, U> = T extends U ? T : never;
type Extracted = Extract<string | number, string>; // string - filter

// Pick<T, Exclude<keyof T, K>>; (Mapped Type)
type Picked = Pick<{name: string, age: number}, 'name'>;

// type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type Omited = Omit<{name: string, age: number}, 'name'>;

// type NonNullable<T> = T extends null | undefined ? never : T;
type NonNullabled = NonNullable<string | number | null | undefined>;

/*
type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any;
*/

/*
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
*/
type MyParameters = Parameters<(name: string, age: number) => void>; // [name: string, age: number]


interface Constructor {
  new (name: string, age: number): string;
}

/*
type ConstructorParameters<
  T extends new (...args: any) => any
> = T extends new (...args: infer P) => any ? P : never;
*/

type MyConstructorParameters = ConstructorParameters<Constructor>; // [name: string, age: number]

/*
type InstanceType<T extends new (...args: any) => any> = T extends new (
  ...args: any
) => infer R
  ? R
  : any;
*/
