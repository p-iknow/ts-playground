/*오버로딩이 불가능한 자바스크립트에 타입을 붙이는 경우 */

function shuffle(value: string | any[]): string | any[] {
  if (typeof value === 'string')
    return value
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  return value.sort(() => Math.random() - 0.5);
}

// string 이 기대 되지만 리턴 타입은 우리가 기대하는 바와는 다르게 추론됨  string | any[]
const res1 = shuffle('Hello, Mark!'); // string | any[]
const res2 = shuffle(['Hello', 'Mark', 'long', 'time', 'no', 'see']); // string | any[]
const res3 = shuffle([1, 2, 3, 4, 5]); // string | any[]


/* 제네릭과  conditional type 활용*/
function shuffle2<T extends string | any[]>(
  value: T,
): T extends string ? string : T;
function shuffle2(value: any) {
  if (typeof value === 'string')
    return value
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  return value.sort(() => Math.random() - 0.5);
}

// function shuffle2<"Hello, Mark!">(value: "Hello, Mark!"): string
const res4 = shuffle2('Hello, Mark!');

// function shuffle2<string[]>(value: string[]): string[]
const res5 = shuffle2(['Hello', 'Mark', 'long', 'time', 'no', 'see']);

// function shuffle2<number[]>(value: number[]): number[]
const res6 = shuffle2([1, 2, 3, 4, 5]);

// error! Argument of type 'number' is not assignable to parameter of type 'string | any[]'.
const res7 = shuffle2(1);


/* 오버로딩을 활용하자 !! */
function shuffle3(value: string): string;
function shuffle3<T>(value: T[]): T[];
function shuffle3(value: string | any[]): string | any[] {
  if (typeof value === 'string')
    return value
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  return value.sort(() => Math.random() - 0.5);
}

const res8 = shuffle3('Hello, Mark!');
const res9 = shuffle3(['Hello', 'Mark', 'long', 'time', 'no', 'see']);
const res10 = shuffle3([1, 2, 3, 4, 5]);


/* 클래스 메서드 오버로딩: 작성자 */

class ExportLibraryModal {
	// 시그니처 1
  public openComponentsToLibrary(
    libraryId: string,
    componentIds: string[],
	): void;
	// 시그니처 2
	public openComponentsToLibrary(componentIds: string[]): void;
	// 실제 구현부
  public openComponentsToLibrary(
    libraryIdOrComponentIds: string | string[],
    componentIds?: string[],
  ): void {

    if (typeof libraryIdOrComponentIds === 'string') {
			// libraryIdOrComponentIds === 'string' 이면 자동으로 componentIds 를 추론해주면 좋겠지만
			// 타입스크립트는 이를 자동으로 지원하지 않는다. 그래서 좀 별로라고 쓴 것이다.
      if (componentIds !== undefined) { // 이건 좀 별루지만,
        // 첫번째 시그니처
        libraryIdOrComponentIds;
        componentIds;
      }
    }

    if (componentIds === undefined) { // 이건 좀 별루지만,
      // 두번째 시그니처
      libraryIdOrComponentIds;
    }
  }
}

/* 클래스 메서드 오버로딩: 사용자 */

const modal = new ExportLibraryModal();

modal.openComponentsToLibrary()

modal.openComponentsToLibrary(
  'library-id',
  ['component-id-1', 'component-id-1'],
);

modal.openComponentsToLibrary(['component-id-1', 'component-id-1']);
