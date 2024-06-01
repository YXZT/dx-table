import { watch } from "vue";

const globalModalCount:Array<() => boolean> = []

export function getPageModalCount() {
  return globalModalCount.length;
}

export function setPageModalCount(visible: () => boolean) {
  watch(visible, (newValue) => {
    // 更新全局计数器
    if (newValue) {
      globalModalCount.push(visible);
    } else {
      globalModalCount.splice(globalModalCount.indexOf(visible), 1);
    }
  })
}