// https://bit.ly/3qT1OML  질문 정리 링크

/*
배경:
nullable 한 값과 conver 함수를 인자로 받아서 null 이면 null 을 리턴하고,
null 이 아닌 경우 convert callback을 받아서 해당 callback을 실행한 뒤 callback의 리턴값을 리턴하는 함수를 만들려고 합니다.

const convertNullableValue = (nullableValue, converFunc) => {
  if (nullableValue === null) return null
  return converFunc(nullableValue)
}
*/

type NullableValue = null | number | string;
type NullableNumber = null | number;
type NullableString = null | string;
type ConvertNullableValue<T extends any | null>= <R>(nullableValue: T , convertFunc: (s: NonNullable<T>) => R) => R | null;

const convertStringToNumber = (value: string): number => {
  return Number(value)
}

const convertNumberToString = (value: number): string => {
  return String(value);
}


// nullable 인 값과 convert callback을 인자로 받아
// return type이 null or converter 함수의 리턴타입인 함수
const convertNullableValue: ConvertNullableValue<NullableValue> = (value, convertFunc) => {
  if (value === null)  {
    return null;
  }
  return convertFunc(value);
}
// But 이 함수로는 convertStringToNumber, convertNumberToString을 자유롭게 받을 수 없음

// convertStringToNumber 은 stirng | number 타입을 인자로 받을 수 없기 때문 
const nullableNumberStringCase1: NullableString = null;
convertNullableValue(nullableNumberStringCase1, convertStringToNumber) // null

const nullableNumberStringCase2: NullableString = '2';
convertNullableValue(nullableNumberStringCase2, convertStringToNumber) // 2

// 마찬가지로 convertNumberToString 도 string | number를 인자로 받을 수 없음 
const nullableNumberCase1: NullableNumber = null;
convertNullableValue(nullableNumberCase1, convertNumberToString) // null
const nullableNumberCase2: NullableNumber = 2;
convertNullableValue(nullableNumberCase2, convertNumberToString) // '2'

// 위와 같은 이유로 nullableString , nullableNumber 별로 별도의 함수를 만들어서 처리해야 함
const convertNullableString: ConvertNullableValue<NullableString> = (value, converter) => {
  if (value === null)  {
    return null;
  }
  return converter(value);
}

convertNullableString(nullableNumberStringCase1, convertStringToNumber) // null
convertNullableString(nullableNumberStringCase2, convertStringToNumber) // 2


const convertNullableNumber: ConvertNullableValue<NullableNumber> = (value, converter) => {
  if (value === null)  {
    return null;
  }
  return converter(value);
}
convertNullableNumber(nullableNumberCase1, convertNumberToString) // null
convertNullableNumber(nullableNumberCase2, convertNumberToString) // '2'

/* 질문1
- 별도의 convertNullableString, convertNullableNumber를 만들지 않고
convertNullableValue 함수만으로 nullableString, 과 nullableNumber를 커버할 수 있을까요?
*/


/* 질문2
- converter function의 argument 에 따라 nullableValue 값을 제한할 수 있을까요?
- ex) conver function 의 인자에 따라
`convertStringToNumber 가 callback 으로 전달되면 ->  convertNullableValue 의 첫번재 인자로 `string | null`이 와야함
`convertNumberToString` 가 callback 으로 전달되면 ->  convertNullableValue 의 첫번째 인자로 `number | null`이 와야함
*/

/* 질문3
아에 함수의 설계부터가 잘못된 걸 수도 있으니, 좀 더 나은 방법이 있다면 알려주세요
*/
