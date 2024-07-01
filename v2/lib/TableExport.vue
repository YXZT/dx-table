<script setup lang='ts'>
import { computed, ref, toRefs, toValue } from 'vue';
import { NForm, NFormItem, NInput, NCheckbox, NButton } from 'naive-ui';
import type { columnSetting, columnsSetting } from '@/interface';
import { useThemeVars } from 'naive-ui'
const props = defineProps<{
  dataSetting: columnsSetting,
  fileName: String,
}>()
const emits = defineEmits<{
  (e: 'save', data: any): void
  (e: 'change-show', data: columnSetting): void
}>()
const saveName = ref(props.fileName)

let localDataSetting = computed(() => props.dataSetting.map(ele => ({ ...ele })).filter(ele=>{
  // 以后再改
  return ele.titleString !== '[行操作]' && ele.titleString !== '[勾选框]'
}))

function submitEvent() {
  emits('save', {
    tHeader: localDataSetting.value.filter(ele=>ele.isExport).map(ele=>ele.titleString),
    filterVal: localDataSetting.value.filter(ele=>ele.isExport).map(ele=>ele.key),
    fileName: saveName.value,
  })
}
function changeColExport(e: any, col: columnSetting) {
  col.isExport = e
  emits('change-show', { ...col })
}
function colShowDefault() {
  props.dataSetting.forEach(ele => {
    if (ele._isExport) {
      ele.isExport = true
      emits('change-show', ele)
    } else {
      ele.isExport = false
      emits('change-show', ele)
    }
  })
}
function colShowAll() {
  props.dataSetting.forEach(ele => {
    ele.isExport = true
    emits('change-show', ele)
  })
}
function colNotShowAll() {
  props.dataSetting.forEach(ele => {
    ele.isExport = false
    emits('change-show', ele)
  })
}
const baseColor = useThemeVars().value.primaryColor
const checkboxThemeOverrides = {
  textColor: baseColor,
  labelFontWeight: 600,
}
// todo 模板化设置文件名，比如单号、公司名、日期等
</script>
<template>
  <div>
    <n-form label-placement="left" label-width="200px">
      <n-form-item label="导出字段设置：">
        <div style="width:100%">
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
          <div class="simple-table-sequence">
            <div v-for="(item) in localDataSetting" :key="item.titleString" class="simple-table-sequence-item">
              <n-checkbox :checked="item.isExport" :on-update:checked="(e: any) => changeColExport(e, item)"
                :theme-overrides="item._isExport ? checkboxThemeOverrides : undefined">
                {{ item.titleString }}</n-checkbox>
            </div>
          </div>
        </div>
      </n-form-item>
      <n-form-item label="文件名：">
        <n-input v-model:value="saveName">
        </n-input>
      </n-form-item>
    </n-form>
    <div style="text-align: center;">
      <n-button type="primary" @click="submitEvent">确定</n-button>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.simple-table-sequence {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  padding: 5px;
  width: 100%;

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