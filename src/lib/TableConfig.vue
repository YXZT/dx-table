<template >
  <div>
    <n-button @click="activate" circle>
      <template #icon>
        <n-icon>
          <ArchiveSettings16Regular />
        </n-icon>
      </template>
    </n-button>
    <n-drawer v-model:show="active" :width="500" placement="right" :trap-focus="false" :block-scroll="false"
      :to="tableEl">
      <n-drawer-content title="表格列设置">
        <n-data-table :bordered="false" :single-line="false" :columns="columnsSetting" :data="dataSetting" />
      </n-drawer-content>
    </n-drawer>
  </div>
</template>
<script setup lang="ts">
import { ArchiveSettings16Regular } from '@vicons/fluent'
import { ref, computed, h } from 'vue'
import { NDataTable, NDrawer, NDrawerContent, NButton, NIcon, NSwitch } from "naive-ui";
import type { columnSetting } from "@/interface";

interface propsType {
  tableRef: InstanceType<typeof NDataTable> | null,
  tableCols: columnSetting[],
}
const props = defineProps<propsType>()
const emits = defineEmits(['change-show'])
const dataSetting = ref<columnSetting[]>([])
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
  key: 'fixed'
}])
const active = ref(false)
const activate = () => {
  dataSetting.value = props.tableCols
  active.value = true
}
const tableEl = computed(() => {
  console.log(props.tableRef);
  return props.tableRef && props.tableRef.$el
})
// todo完善类型
function changeColShow(e: any, col: any) {
  const newCol = {...col}
  newCol.isShow = e
  emits('change-show', newCol)
}
</script>
<style ></style>