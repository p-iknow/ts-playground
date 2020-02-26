interface A {
  good(x: number): string
  bad(x: number): string
}

interface B extends A {
  good(x: string | number): string
  bad(x: string): string  // Error TS2430: Interface 'B' incorrectly extends
}                         // interface 'A'. Type 'number' is not assignable
                          // to type 'string'.

type C {
  good(x: number): string
  bad(x: number): string
}

type D = C & {
  good(x: string | number): string
  bad(x: string): string  
}
