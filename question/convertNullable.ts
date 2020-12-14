/*
배경:
nullable 한 값과 conver 함수를 인자로 받아서 null 이면 null 을 리턴하고,
null 이 아닌 경우 convert callback을 받아서 해당 callback을 실행한 뒤 callback의 리턴값을 리턴하는 함수를 만들려고 합니다.

const convertNullableValue = (nullableValue, converFunc) => {
  if (nullableValue === null) return null
  return converFunc(nullableValue)
}
*/


/* 질문1
- converter function의 argument 에 따라 nullableValue 값을 제한할 수 있을까요?
- ex) conver function 의 인자에 따라
`convertStringToNumber 가 callback 으로 전달되면 ->  convertNullableValue 의 첫번재 인자로 `string | null`이 와야함
`convertNumberToString`가 callback 으로 전달되면 ->  convertNullableValue 의 첫번째 인자로 `number | null`이 와야함
*/

/* 질문2
동시에 리턴 값을 number | string | null 이 아닌, number | null, string | null 추론해줄 수 있을까요?
*/

type NullableNumber = null | number;
type NullableString = null | string;

const convertStringToNumber = (value: string): number => {
  return Number(value)
}

const convertNumberToString = (value: number): string => {
  return String(value);
}

type Nullable<T> = T | null | undefined;

export const convertNullableValue = <T, U> (value: Nullable<T>, convertFunc: (value: T) => U): U | null => {
	return value ? convertFunc(value) : null;
}


const nullableNumberCase1: NullableNumber = null;
convertNullableValue(nullableNumberCase1, convertNumberToString) // null


const nullableNumberCase2: NullableNumber = 2;
convertNullableValue(nullableNumberCase2, convertStringToNumber)  // error NullableNumber를 NullableString에 대입할 수 없음



const nullableNumberCase3: NullableString = '2';
convertNullableValue(nullableNumberCase3, convertStringToNumber) // 2
