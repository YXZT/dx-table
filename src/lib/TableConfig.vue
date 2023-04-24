<template >
  <div>
    <div class="table-title">
      <div class="table-info">
        <slot></slot>
      </div>
      <n-button @click="activate" circle>
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
        <template #header>
          <div class="s-flex-between">
            <div>表格列设置</div>
            <n-button size="small" @click="resetConf">
              重置
            </n-button>
          </div>
        </template>
        <n-data-table ref="dataTable" :bordered="false" :single-line="false" :columns="columnsSetting" :data="dataSetting"
          :rowProps="rowProps" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import { ArchiveSettings16Regular } from '@vicons/fluent'
import { ref, computed, h, nextTick } from 'vue'
import { NDataTable, NDrawer, NDrawerContent, NButton, NIcon, NSwitch, NRadioGroup, NRadioButton } from "naive-ui";
import type { columnSetting } from "@/interface";
import Sortable from "sortablejs";

interface propsType {
  tableRef: InstanceType<typeof NDataTable> | null,
  tableCols: columnSetting<any>[],
}
const props = defineProps<propsType>()
const emits = defineEmits(['change-show', 'change-sequence', 'change-fixed','reset-conf'])
const dataSetting = ref<columnSetting<any>[]>([])
const columnsSetting = ref([{
  title: '列名',
  key: 'title'
}, {
  title: '显示',
  key: 'isShow',
  render: (row: { isShow: boolean }) => {
    const isShow = row.isShow
    return h(NSwitch, { value: isShow, 'onUpdateValue': (e: any) => changeColShow(e, row) })
  }
}, {
  title: '固定',
  key: 'fixed',
  render: (row: { isShow: boolean, fixed: any }) => {
    const fixed = row.fixed || 'none'
    const buttons = () => [
      h(NRadioButton, { value: 'left', label: '左' }),
      h(NRadioButton, { value: 'none', label: '无' }),
      h(NRadioButton, { value: 'right', label: '右' }),
    ]
    return h(NRadioGroup, { value: fixed, 'onUpdateValue': (e: any) => changeColFixed(e, row) }, buttons)
  }
}])
const isActive = ref(false)
const activate = () => {
  dataSetting.value = props.tableCols
  isActive.value = true
  !dataTable.value && nextTick(() => {
    columnDrop()
  })
}
const tableEl = computed(() => {
  return props.tableRef && props.tableRef.$el
})
// todo完善类型
function changeColShow(e: any, col: any) {
  const newCol = { ...col }
  newCol.isShow = e
  emits('change-show', newCol)
}
function changeColFixed(e: 'left' | 'none' | 'right', col: any) {
  const newCol = { ...col }
  newCol.fixed = e
  emits('change-fixed', newCol)
}
const dataTable = ref<InstanceType<typeof NDataTable> | null>(null)
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
}
const rowProps = () => {
  return {
    style: 'cursor: move;',
  }
}
function resetConf(){
  isActive.value = false
  emits('reset-conf')
}
// todo 重置配置
</script>
<style scoped lang="scss">
.table-title {
  display: flex;
  align-items: center;
  background-color: rgba(250, 250, 252, 1);
  padding: 0 12px;
}

.table-info {
  width: 100%;
}

::v-deep{
  .n-drawer-header__main{
    flex:1
  }
}
</style>