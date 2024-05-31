import { watch } from "vue";
import type { Ref } from "vue";

const globalModalCount = new WeakMap();

export function getPageModalCount() {
  return globalModalCount;
}

export function setPageModalCount(visible: Ref<boolean>) {
  watch(visible, (newValue) => {
    // 更新全局计数器
    if (newValue) {
      globalModalCount.set(visible, globalModalCount.get(visible) + 1);
    } else {
      globalModalCount.set(visible, globalModalCount.get(visible) - 1);
    }
  }
  )
}