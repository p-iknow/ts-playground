import React from 'react';

/* Toast 는 모두 type 을 가지고 type 은 enum 중 하나를 가진다.*/
enum ToastType {
	AFTER_SAVED,
	AFTER_PUBLISHED,
	AFTER_RESTORE,
}

interface Toast {
	type: ToastType,
	createdAt: string,
}

const toasts: Toast[] = [...];


/* if 와 else if 로 이루어진 잘못된 추론 */
// toastNodes1 -> (JSX.Element | undefined)[]
// 우리는 JSX.ELement 가 return 되길 원하지만, case 가 안맞아서 undefined 가 리턴될 수 있음
const toastNodes1 = toasts.map((toast) => {
  if (toast.type === ToastType.AFTER_SAVED)
    return (
      <div key={toast.createdAt}>
        <AfterSavedToast />
      </div>
    );
  else if (toast.type === ToastType.AFTER_PUBLISHED)
    return (
      <div key={toast.createdAt}>
        <AfterPublishedToast />
      </div>
    );
  else if (toast.type === ToastType.AFTER_RESTORE)
    return (
      <div key={toast.createdAt}>
        <AfterRestoredToast />
      </div>
    );
});

/* if, else if, else 로 작동하는 추론 */
// toastNodes2 -> JSX.Element[]
// 잘 추론은 되지만 작성자 입장에서 새로운 toast 타입이 추가 될 때 문제가 됨
const toastNodes2 = toasts.map((toast) => {
  if (toast.type === ToastType.AFTER_SAVED)
    return (
      <div key={toast.createdAt}>
        <AfterSavedToast />
      </div>
    );
  else if (toast.type === ToastType.AFTER_PUBLISHED)
    return (
      <div key={toast.createdAt}>
        <AfterPublishedToast />
      </div>
    );
  else
    return (
      <div key={toast.createdAt}>
        <AfterRestoredToast />
      </div>
    );
});

/* 마지막 else 에 never 를 검사함 */
// toastNodes3 -> JSX.Element[]
const toastNodes3 = toasts.map((toast) => {
  if (toast.type === ToastType.AFTER_SAVED)
    return (
      <div key={toast.createdAt}>
        <AfterSavedToast />
      </div>
    );
  else if (toast.type === ToastType.AFTER_PUBLISHED)
    return (
      <div key={toast.createdAt}>
        <AfterPublishedToast />
      </div>
    );
  else if (toast.type === ToastType.AFTER_RESTORE)
    return (
      <div key={toast.createdAt}>
        <AfterRestoredToast />
      </div>
    );
  else return neverExpected(toast.typs);
});

function neverExpected(value: never): never {
	// throw 는 컴파일타임을 위해 작성한 것임
  throw new Error(`Unexpected value : ${value}`);
}


/* if + return 과 마지막에 never 를 검사함  */
// toastNodes4 -> JSX.Element[]
const toastNodes4 = toasts.map((toast) => {
  if (toast.type === ToastType.AFTER_SAVED)
    return (
      <div key={toast.createdAt}>
        <AfterSavedToast />
      </div>
    );
  if (toast.type === ToastType.AFTER_PUBLISHED)
    return (
      <div key={toast.createdAt}>
        <AfterPublishedToast />
      </div>
    );
  if (toast.type === ToastType.AFTER_RESTORE)
    return (
      <div key={toast.createdAt}>
        <AfterRestoredToast />
      </div>
    );

  return neverExpected(toast.typs);
});


/* switch 와 default never 를 통한 처리 */
const toastNodes5 = toasts.map((toast) => {
  switch (toast.type) {
    case ToastType.AFTER_SAVED:
      return (
        <div key={toast.createdAt}>
          <AfterSavedToast />
        </div>
      );
    case ToastType.AFTER_PUBLISHED:
      return (
        <div key={toast.createdAt}>
          <AfterPublishedToast />
        </div>
      );
    case ToastType.AFTER_RESTORE:
      return (
        <div key={toast.createdAt}>
          <AfterRestoredToast />
        </div>
      );
    default:
      return neverExpected(toast.type);
  }
});
