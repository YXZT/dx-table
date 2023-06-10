<template >
  <div>
    <div class="table-title">
      <div class="table-info">
        <slot></slot>
      </div>
      <n-button @click="activate" quaternary >
        <template #icon>
          <n-icon>
            <ArchiveSettings16Regular />
          </n-icon>
        </template>
      </n-button>
    </div>
    <n-drawer v-model:show="isActive" :width="500" placement="right" :trap-focus="false" :block-scroll="false"
      :to="tableEl">
      <n-drawer-content>
        <n-tabs type="line" animated>
          <n-tab-pane name="表格列设置" tab="表格列设置" display-directive="show">
            <n-data-table ref="dataTable" :bordered="false" :single-line="false" :columns="columnsSetting"
              :data="dataSetting" :rowProps="rowProps" size="small" />
          </n-tab-pane>
          <n-tab-pane name="排序设置" tab="排序设置" display-directive="show">
            <n-data-table ref="sortDataTable" :bordered="false" :single-line="false" :columns="columnsSortSetting"
              :data="sortData" :rowProps="rowProps" size="small" />
          </n-tab-pane>
          <template #suffix>
            <!-- 尽量不要在处理单据时修改表格配置，因为可能会造成未保存的数据丢失的情况 -->
            <n-button size="small" @click="resetConf">
              重置
            </n-button>
          </template>
        </n-tabs>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import { ArchiveSettings16Regular } from '@vicons/fluent'
import { ref, computed, h, nextTick } from 'vue'
import { NDataTable, NDrawer, NDrawerContent, NButton, NIcon, NSwitch, NRadioGroup, NRadioButton, NTabs, NTabPane } from "naive-ui";
import type { columnSetting } from "@/interface";
import Sortable from "sortablejs";

interface propsType {
  tableRef: InstanceType<typeof NDataTable> | null,
  dataSetting: columnSetting<any>[],
  sortData: columnSetting<any>[],
}
const props = defineProps<propsType>()
// const emits = defineEmits(['change-show', 'change-sequence','change-sort-order', 'change-fixed', 'reset-conf'])
const emits = defineEmits<{
  'change-show': [col: columnSetting<any>],
  'change-sequence': [oldIndex: number, newIndex: number],
  'change-sort-order': [oldIndex: number, newIndex: number],
  'change-fixed': [col: columnSetting<any>],
  'reset-conf': []
}>()
const columnsSetting = ref([{
  title: '列名',
  key: 'title'
}, {
  title: '显示',
  key: 'isShow',
  render: (row: columnSetting<any>) => {
    const isShow = row.isShow
    return h(NSwitch, { value: isShow, 'onUpdate:value': ((e: any) => changeColShow(e, row)), size: 'small' })
  }
}, {
  title: '固定',
  key: 'fixed',
  render: (row: columnSetting<any>) => {
    const fixed = row.fixed || 'none'
    const buttons = () => [
      h(NRadioButton, { value: 'left', label: '左' }),
      h(NRadioButton, { value: 'none', label: '无' }),
      h(NRadioButton, { value: 'right', label: '右' }),
    ]
    return h(NRadioGroup, { value: fixed, 'onUpdate:value': (e: any) => changeColFixed(e, row), size: 'small' }, buttons)
  }
}])
const columnsSortSetting = ref([
  {
    title: '顺序',
    key: 'key',
    render: (_: any, index: number) => {
      return `${index + 1}`
    }
  },
  {
    title: '列名',
    key: 'title'
  }, {
    title: '次序',
    key: 'fixed',
    render: (row: columnSetting<any>) => {
      const sortOrder = row.sortOrder || false
      const buttons = () => [
        h(NRadioButton, { value: 'ascend', label: '升序↑' }),
        h(NRadioButton, { value: 'descend', label: '降序↓' }),
        h(NRadioButton, { value: false, label: '不排序' }),
      ]
      return h(NRadioGroup, { value: sortOrder, 'onUpdate:value': (e: any) => changeColSort(e, row), size: 'small' }, buttons)
    }
  }])
const isActive = ref(false)
const activate = () => {
  isActive.value = true
  !dataTable.value && nextTick(() => {
    columnDrop()
  })
}

const tableEl = computed(() => {
  return props.tableRef && props.tableRef.$el
})
// todo完善类型
function changeColShow(e: any, col: columnSetting<any>) {
  const newCol = { ...col }
  newCol.isShow = e
  emits('change-show', newCol)
}
function changeColFixed(e: 'left' | 'none' | 'right', col: columnSetting<any>) {
  const newCol = { ...col }
  newCol.fixed = e
  emits('change-fixed', newCol)
}
function changeColSort(e: any, col: columnSetting<any>) {
  const newCol = { ...col }
  newCol.sortOrder = e
  emits('change-fixed', newCol)
}
const dataTable = ref<InstanceType<typeof NDataTable>>()
const sortDataTable = ref<InstanceType<typeof NDataTable>>()
function columnDrop() {
  const el = dataTable?.value?.$el
  const wrapperTr = el.querySelector(".n-data-table-tbody");
  Sortable.create(wrapperTr, {
    animation: 180,
    delay: 0,
    filter: ".drag-filtered",
    onEnd: (evt) => {
      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;
      if (oldIndex === undefined || newIndex === undefined) return
      emits('change-sequence', oldIndex, newIndex)
    }
  });
  const el2 = sortDataTable?.value?.$el
  const wrapperTr2 = el2.querySelector(".n-data-table-tbody");
  Sortable.create(wrapperTr2, {
    animation: 180,
    delay: 0,
    onEnd: (evt) => {
      const oldIndex = evt.oldIndex;
      const newIndex = evt.newIndex;
      if (oldIndex === undefined || newIndex === undefined) return
      const oldKey = props.sortData[oldIndex].key
      const newKey = props.sortData[newIndex].key

      const _oldIndex = props.dataSetting.findIndex(ele => ele.key === oldKey)
      const _newIndex = props.dataSetting.findIndex(ele => ele.key === newKey)

      emits('change-sort-order', _oldIndex, _newIndex)
    }
  });
}
const rowProps = () => {
  return {
    style: 'cursor: move;',
  }
}
function resetConf() {
  isActive.value = false
  emits('reset-conf')
}
</script>
<style scoped lang="scss">
.table-title {
  display: flex;
  align-items: center;
  background-color: rgba(250, 250, 252, 1);
}

.table-info {
  width: 100%;
}
</style>