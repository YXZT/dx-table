<template>
  <div>
    <div class="table-title">
      <div class="table-info">
        <slot></slot>
      </div>
      <n-button @click="activate" quaternary>
        <template #icon>
          <n-icon>
            <ArchiveSettings16Regular />
          </n-icon>
        </template>
      </n-button>
    </div>
    <n-drawer v-model:show="isActive" :width="900" placement="right" :trap-focus="false" :block-scroll="false"
      :to="tableEl">
      <n-drawer-content>
        <n-tabs type="line" animated>
          <n-tab-pane name="表格列设置" tab="表格列设置" display-directive="show">
            <div class="s-flex-between">
              <div>
                <n-button quaternary type="info" @click="colShowDefault">
                  默认设置
                </n-button>|
                <n-button quaternary type="info" @click="colShowAll">
                  全选
                </n-button>|
                <n-button quaternary type="info" @click="colNotShowAll">
                  全不选
                </n-button>
              </div>
              <n-checkbox :checked="tableConfig.isAdvancedSetting" :on-update-checked="updateIsAdvancedSetting">
                高级设置
              </n-checkbox>
            </div>
            <n-data-table ref="dataTable" :bordered="false" :single-line="false" :columns="columnsSettingColumns"
              :data="dataSetting" :rowProps="rowProps" size="small" v-show="tableConfig.isAdvancedSetting" />
            <div v-show="!tableConfig.isAdvancedSetting" class="simple-table-sequence" ref="simpleTableSequence">
              <div v-for="(item) in dataSetting" :key="item.titleString" class="simple-table-sequence-item">
                <n-checkbox :checked="item.isShow" :on-update:checked="(e: any) => changeColShow(e, item)">{{
        item.titleString }}</n-checkbox>
              </div>
            </div>
          </n-tab-pane>
          <n-tab-pane name="排序设置" tab="排序设置" display-directive="show">
            <n-data-table ref="sortDataTable" :bordered="false" :single-line="false" :columns="columnsSortSetting"
              :data="sortData" :rowProps="rowProps" size="small" />
          </n-tab-pane>
          <n-tab-pane name="其他设置" tab="其他设置" display-directive="show">
            <n-form label-placement="left" label-width="auto">
              <n-form-item label="">
                <n-checkbox :checked="tableConfig.moneySplit" :on-update-checked="updateMoneySplit">
                  金额是否以逗号分隔
                </n-checkbox>
              </n-form-item>
              <n-form-item label="">
                <n-checkbox :checked="tableConfig.inplutFocusSelectAll" :on-update-checked="updateMoneyInplutFocus">
                  点击输入框后直接全选内容
                </n-checkbox>
              </n-form-item>
              <n-form-item label="" v-if="loadType === 'request'">
                <n-checkbox :checked="tableConfig.refreshTableWhileActive" :on-update-checked="updateRefreshTable">
                  重新进入该页面时自动刷新表格
                </n-checkbox>
              </n-form-item>
            </n-form>
            <i style="margin-top:20px">
              以上配置需刷新页面后生效
            </i>
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
import { ArchiveSettings16Regular, Drag24Filled } from '@vicons/fluent'
import { ref, computed, h, nextTick, inject, type Ref } from 'vue'
import { NDataTable, NDrawer, NDrawerContent, NButton, NIcon, NSwitch, NRadioGroup, NRadioButton, NTabs, NTabPane, NForm, NFormItem, NCheckbox, NTooltip, NCard } from "naive-ui";
import type { columnSetting, columnsSetting, tableConfigType } from "@/interface";
import Sortable from "sortablejs";
import { setPageModalCount } from '../utils/globalStore'

interface propsType {
  tableRef: InstanceType<typeof NDataTable> | null,
  dataSetting: columnsSetting,
  sortData: columnsSetting,
}

// 接收注入tableConfig
let tableConfig: Ref<tableConfigType> = ref(inject('tableConfig') || {})
const setTableConfig = inject('setTableConfig') as (data: any) => void

const loadType = inject('loadType') as 'data' | 'request'

const props = defineProps<propsType>()


// const emits = defineEmits(['change-show', 'change-sequence','change-sort-order', 'change-fixed', 'reset-conf'])
const emits = defineEmits<{
  'change-show': [col: columnSetting],
  'change-sequence': [oldIndex: number, newIndex: number],
  'change-sort-order': [oldIndex: number, newIndex: number],
  'change-fixed': [col: columnSetting],
  'change-ellipsis': [col: columnSetting],
  'reset-conf': [],
}>()

const renderTooltip = (trigger: any, content: any) => {
  return h(NTooltip, null, {
    trigger: () => trigger,
    default: () => content
  })
}

const columnsSettingColumns = ref([{
  title: '列名',
  key: 'titleString'
}, {
  key: 'isShow',
  title() {
    return renderTooltip(
      h(
        'div',
        {},
        '显示'
      ),
      '控制是否显示该列，注意列没有显示有可能是因为缺少了某些权限'
    )
  },
  render: (row: columnSetting) => {
    const isShow = row.isShow
    return h(NSwitch, { value: isShow, 'onUpdate:value': ((e: any) => changeColShow(e, row)), size: 'small' })
  }
}, {
  key: 'fixed',
  title() {
    return renderTooltip(
      h(
        'div',
        {},
        '固定'
      ),
      '当宽度不足时，是否固定在左侧或右侧，不建议一个表格中设置多个'
    )
  },
  render: (row: columnSetting) => {
    const fixed = row.fixed || 'none'
    const buttons = () => [
      h(NRadioButton, { value: 'left', label: '左' }),
      h(NRadioButton, { value: 'none', label: '无' }),
      h(NRadioButton, { value: 'right', label: '右' }),
    ]
    return h(NRadioGroup, { value: fixed, 'onUpdate:value': (e: any) => changeColFixed(e, row), size: 'small' }, buttons)
  }
}, {
  key: 'ellipsis',
  title() {
    return renderTooltip(
      h(
        'div',
        {},
        '省略'
      ),
      '当宽度不足时，是否用省略号代替'
    )
  },
  render: (row: columnSetting) => {
    const isEllipsis = row.ellipsis as boolean
    return h(NSwitch, { value: isEllipsis, 'onUpdate:value': ((e: any) => changeEllipsis(e, row)), size: 'small' })
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
    key: 'titleString'
  }, {
    key: 'fixed',
    title() {
      return renderTooltip(
        h(
          'div',
          {},
          '次序'
        ),
        '排序的方式，不建议同时设置多个'
      )
    },
    render: (row: columnSetting) => {
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
function changeColShow(e: any, col: columnSetting) {
  const newCol = { ...col }
  newCol.isShow = e
  emits('change-show', newCol)
}
function changeEllipsis(e: any, col: columnSetting) {
  const newCol = { ...col }
  newCol.ellipsis = e
  emits('change-ellipsis', newCol)
}
function changeColFixed(e: 'left' | 'none' | 'right', col: columnSetting) {
  const newCol = { ...col }
  newCol.fixed = e
  emits('change-fixed', newCol)
}

function changeColSort(e: any, col: columnSetting) {
  const newCol = { ...col }
  newCol.sortOrder = e
  emits('change-fixed', newCol)
}
const dataTable = ref<InstanceType<typeof NDataTable>>()
const sortDataTable = ref<InstanceType<typeof NDataTable>>()
const simpleTableSequence = ref()
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
  if (!el2) return
  const wrapperTr2 = el2.querySelector(".n-data-table-tbody");
  if (!wrapperTr2) return
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
  const el3 = simpleTableSequence?.value

  Sortable.create(el3, {
    animation: 180,
    delay: 0,
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
function resetConf() {
  isActive.value = false
  emits('reset-conf')
  tableConfig.value = {}
  setTableConfig({})
}
setPageModalCount(() => isActive.value)

function updateMoneySplit(val: boolean) {
  tableConfig.value.moneySplit = val
  setTableConfig(tableConfig)
}
function updateMoneyInplutFocus(val: boolean) {
  tableConfig.value.inplutFocusSelectAll = val
  setTableConfig(tableConfig)
}
function updateRefreshTable(val: boolean) {
  tableConfig.value.refreshTableWhileActive = val
  setTableConfig(tableConfig)
}
function updateIsAdvancedSetting(val: boolean) {
  tableConfig.value.isAdvancedSetting = val
  setTableConfig(tableConfig)
}
function colShowDefault() {
  props.dataSetting.forEach(ele => {
    if (ele._isShow) {
      ele.isShow = true
      emits('change-show', ele)
    } else {
      ele.isShow = false
      emits('change-show', ele)
    }
  })
}
function colShowAll() {
  props.dataSetting.forEach(ele => {
    ele.isShow = true
    emits('change-show', ele)
  })
}
function colNotShowAll() {
  props.dataSetting.forEach(ele => {
    ele.isShow = false
    emits('change-show', ele)
  })
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

.simple-table-sequence {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 5px;

  .simple-table-sequence-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0 8px 5px;
    box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.1);
  }

  .simple-table-sequence-item:hover {
    box-shadow: 2px 2px 5px 0px rgba(0, 0, 0, 0.3);
  }
}
</style>