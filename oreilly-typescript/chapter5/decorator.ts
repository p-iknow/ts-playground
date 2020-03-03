type ClassConstructor<T> = new(...args: any[]) => T  // 1

function serializable<
  T extends ClassConstructor<{
    getValue(): Payload 
  }>
>(Constructor: T) { 
  return class extends Constructor { 
    serialize() {
      return this.getValue().toString()
    }
  }
}

@serializable
class APIPayload {
  getValue(): Payload {
    // ...
  }
}


let payload = new APIPayload
let serialized = payload.serialize() // Error TS2339: Property 'serialize' does
                                     // not exist on type 'APIPayload'.