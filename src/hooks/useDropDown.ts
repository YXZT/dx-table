
import { NDropdown } from 'naive-ui';
import { h, nextTick, reactive, ref, toRefs, watchEffect } from 'vue';
// import { useRoute } from 'vue-router';

export function useDropDown() {
  // const route = useRoute();
  const curSelection = ref()
  // 等naiveui完善类型
  type setOptionsType = (arg: {
    /**
     * 当前光标选择
     */
    curSelection: string
  }) => any[]
  const setOptions = ref<setOptionsType>(() => {
    return []
  })
  const state = reactive({
    // activeKey: route.fullPath,
    scrollable: false,
    dropdownX: 0,
    dropdownY: 0,
    showDropdown: false,
    isMultiHeaderFixed: false,
    TabsMenuOptions: [] as any
  });
  function onClickOutside() {
    state.showDropdown = false;
  }
  //tab 操作
  const closeHandleSelect = (key: string) => {
    const opt = state.TabsMenuOptions.find((ele: any) => {
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
    curSelection.value = window.getSelection();
    state.TabsMenuOptions = setOptions.value({ curSelection:curSelection.value?.toString() })
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
    renderDropDown,
    setOptions
  };
}

