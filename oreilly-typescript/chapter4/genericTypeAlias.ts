type MyEvent<T> = {
  target: T;
  type: string;
};

// generic type alias in a function’s signature
function triggerEvent<T>(event: MyEvent<T>): void {
  // ...
}

triggerEvent({
  // T is Element | null
  target: document.querySelector('#myButton'),
  type: 'mouseover'
});

const a = document.querySelector('#myButton');
