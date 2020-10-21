// sub4 타입은 sup4 타입의 서브 타입이다.
let sub4 = 1;
const sup4: any = sub4;
sub4 = sup4;

// sub5 타입은 sup5 타입의 서브 타입이다.
let sub5: never = 0 as never;
const sup5: number = sub5;
sub5 = sup5; // error! Type 'number' is not assignable to type 'never'.

class SubAnimal {}
class SubDog extends SubAnimal {
  eat() {}
}

// sub6 타입은 sup6 타입의 서브 타입이다.
let sub6: SubDog = new SubDog();
const sup6: SubAnimal = sub6;
sub6 = sup6;

/ sub4 타입은 sup4 타입의 서브 타입이다.
// sup4 타입은 sub4 타입의 슈퍼 타입이다.
let sub4: number = 1;
let sup4: any = sub4;
sub4 = sup4;

// sub5 타입은 sup5 타입의 서브 타입이다.
// sup5 타입은 sub5 타입의 슈퍼 타입이다.
let sub5: never = 0 as never;
let sup5: number = sub5;
sub5 = sup5; // error! Type 'number' is not assignable to type 'never'.

class SubAnimal {}
class SubDog extends SubAnimal {
  eat() {}
}

// sub6 타입은 sup6 타입의 서브 타입이다.
// sup6 타입은 sub6 타입의 슈퍼 타입이다.
let sub6: SubDog = new SubDog();
let sup6: SubAnimal = sub6;
sub6 = sup6; // error! Property 'eat' is missing in type 'SubAnimal' but required in type 'SubDog'.
