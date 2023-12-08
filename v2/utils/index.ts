
export function deepCopy<T>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  const copy: any = Array.isArray(obj) ? [] : {};

  Object.keys(obj).forEach((key) => {
    copy[key] = deepCopy(obj[key as keyof T]);
  });

  return copy as T;
}

export function moveElement(arr: any[], oldIndex: number, newIndex: number) {
  const element = arr.splice(oldIndex, 1)[0];
  arr.splice(newIndex, 0, element);
}

export function getParentTD(dom: any) {
  if (dom.nodeName === 'TD') return { dom }
  else if (dom.tagName === 'BODY') {
    return false
  } else if (dom.parentNode) {
    return getParentTD(dom.parentNode)
  } else return false
}