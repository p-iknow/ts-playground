type ElementType<T> = T extends unknown[] ? T[number] : T
type A = ElementType<number[]> // number

type B = ElementType<boolean>

type ElementType1 = string[][number]