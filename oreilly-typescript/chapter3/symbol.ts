const e = Symbol('e')                // typeof e
const f: unique symbol = Symbol('f') // typeof f
let g: unique symbol = Symbol('f')   // Error TS1332: A variable whose type is a
                                     // 'unique symbol' type must be 'const'.
let h = e === e             // boolean
let i = e === f             // Error TS2367: This condition will always return
                            // 'false' since the types 'unique symbol' and
                            // 'unique symbol' have no overlap.

