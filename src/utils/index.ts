import { isRef,ref,type Ref } from "vue";

export function deepCopy<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const copy:any = Array.isArray(obj) ? [] : {};

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key as keyof T]);
  });

  return copy as T;
}

export function getRef<T>(a: T):Ref<T> {
  if (isRef(a)) {
    return a
  } else {
    return ref(a)
  }
}