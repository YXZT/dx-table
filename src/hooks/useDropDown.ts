
import { NDropdown } from 'naive-ui';
import { h, nextTick, reactive, ref, toRefs, watchEffect } from 'vue';
// import { useRoute } from 'vue-router';

export function useDropDown(options: any[]) {
  // const route = useRoute();

  const state = reactive({
    // activeKey: route.fullPath,
    scrollable: false,
    dropdownX: 0,
    dropdownY: 0,
    showDropdown: false,
    isMultiHeaderFixed: false,
    TabsMenuOptions: options
  });
  function onClickOutside() {
    state.showDropdown = false;
  }
  //tab 操作
  const closeHandleSelect = (key: string) => {
    const opt = options.find(ele => {
      return ele.key === key
    })
    if (opt) opt?.fn()
    state.showDropdown = false;
  };
  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
    nextTick().then(() => {
      state.showDropdown = true;
      state.dropdownX = e.clientX;
      state.dropdownY = e.clientY;
    });
  }
  function renderDropDown() {
    return h(NDropdown, {
      show: state.showDropdown, x: state.dropdownX, y: state.dropdownY, 'on-clickoutside': onClickOutside, 'on-select': closeHandleSelect
      , options: state.TabsMenuOptions
    })
  }
  return {
    ...toRefs(state),
    handleContextMenu,
    onClickOutside,
    closeHandleSelect,
    renderDropDown
  };
}

