
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

export function moveElement(arr:any[], oldIndex:number, newIndex:number) {  
  const element = arr.splice(oldIndex, 1)[0];
  arr.splice(newIndex, 0, element);
}  