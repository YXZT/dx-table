<script setup lang='ts'>
import { ref, toRefs, toValue } from 'vue';
import { NForm, NFormItem, NInput, NCheckbox,NButton } from 'naive-ui';
import type { columnSetting, columnsSetting } from '@/interface';

const props = defineProps<{
  dataSetting: columnsSetting,
  fileName: String,
}>()
const emit = defineEmits<{
  (e: 'save', data: any): void
  (e: 'change-show', data: columnSetting): void
}>()
const saveName = ref(props.fileName)

let localDataSetting = ref(props.dataSetting.map(ele=>({...ele})))

function submitEvent(){
  emit('save', {
    dataSetting: localDataSetting,
    fileName: saveName.value,
  })
}
function changeColExport(e:any,col: columnSetting){
  col.isExport = e
  emit('change-show', {...col})
}
// todo 模板化设置文件名，比如单号、公司名、日期等
</script>
<template>
  <div>
    <n-form label-placement="left" label-width="200px">
      <n-form-item label="导出字段设置：">
        <div class="simple-table-sequence">
          <div v-for="(item) in localDataSetting" :key="item.titleString" class="simple-table-sequence-item">
            <n-checkbox :checked="item.isExport" :on-update:checked="(e: any)=>changeColExport(e, item)">
              {{ item.titleString }}</n-checkbox>
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