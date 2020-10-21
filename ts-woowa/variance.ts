/*
	1. 같거나 서브 타입인 경우, 할당이 가능하다. => 공변
*/

// primitive type
const sub7 = '';
const sup7: string | number = sub7;

// object - 각각의 프로퍼티가 대응하는 프로퍼티와 같거나 서브타입이어야 한다.
const sub8: { a: string; b: number } = { a: '', b: 1 };
const sup8: { a: string | number; b: number } = sub8;

// array - object 와 마찬가지
const sub9: Array<{ a: string; b: number }> = [{ a: '', b: 1 }];
const sup9: Array<{ a: string | number; b: number }> = sub8;


/*
	2. 함수의 매개변수 타입만 같거나 슈퍼타입인 경우, 할당이 가능하다. => 반병
*/

class Person {}
class Developer extends Person {
  coding() {}
}
class StartupDeveloper extends Developer {
  burning() {}
}

function tellme(f: (d: Developer) => Developer) {}

// Developer => Developer 에다가 Developer => Developer 를 할당하는 경우
tellme(function dToD(d: Developer): Developer {
  return new Developer();
});

// Developer => Developer 에다가 Person => Developer 를 할당하는 경우
tellme(function pToD(d: Person): Developer {
  return new Developer();
});

// Developer => Developer 에다가 StartipDeveloper => Developer 를 할당하는 경우
tellme(function sToD(d: StartupDeveloper): Developer {
  return new Developer();
});
