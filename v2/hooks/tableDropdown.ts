
import { NDropdown } from 'naive-ui';
import type { RowData } from 'naive-ui/es/data-table/src/interface';
import { h, nextTick, reactive, ref, toRefs } from 'vue';
// import { useRoute } from 'vue-router';

export function useDropDown() {
  // const route = useRoute();
  const curSelection = ref()
  const curRow = ref()
  const curTableIndex = ref()
  // 等naiveui完善类型
  type setOptionsType = (arg: {
    /**
     * 当前光标选择
     */
    curSelection: string,
    row: RowData,
    index: number,
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
  function handleContextMenu(e: MouseEvent, row: RowData, index: number) {
    e.preventDefault();
    nextTick().then(() => {
      state.showDropdown = true;
      state.dropdownX = e.clientX;
      state.dropdownY = e.clientY;
    });
    curSelection.value = window.getSelection();
    curRow.value = row;
    curTableIndex.value = index;
    state.TabsMenuOptions = setOptions.value({ curSelection: curSelection.value?.toString(), row: curRow.value, index: curTableIndex.value })
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

