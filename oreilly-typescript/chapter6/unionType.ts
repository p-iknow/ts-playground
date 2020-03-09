type UserTextEvent = {value: string, target: HTMLInputElement}
type UserMouseEvent = {value: [number, number], target: HTMLElement}

type UserEvent = UserTextEvent | UserMouseEvent

const $htmlElement = document.createElement("null")

const userEvent : UserEvent = {value: "textEvent", target:  $htmlElement}
// Type '{ value: string; target: HTMLElement; }' is not assignable to type 'UserEvent'.
// Type '{ value: string; target: HTMLElement; }' is not assignable to type 'UserMouseEvent'.
// Types of property 'value' are incompatible.
// Type 'string' is not assignable to type '[number, number]'.ts(2322)

