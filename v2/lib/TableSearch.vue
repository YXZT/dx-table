<script setup lang='ts'>
import type { searchFormType } from '@/interface';
import SearchFormItem from './SearchFormItem.vue';
import { NFormItem, NButton, NConfigProvider, type GlobalThemeOverrides, NSpace } from 'naive-ui'

defineOptions({ name: 'TableSearch' })


type tableSearchProps = {
  searchData: any,
  searchColumns: searchFormType[],
  needMore?: boolean,
}

const props = withDefaults(defineProps<tableSearchProps>(), {
  needMore: false,
})



</script>

<template>
  <div class="search">
    <div v-for="(item, index) in searchColumns" :key="item.prop" class="item-box">
      <n-form-item :label="`${item.label} :`" size="small"
      :show-feedback="false" label-placement="left">
      <SearchFormItem :column="item" :search-param="searchData" />
      </n-form-item>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.search {
  overflow: hidden;
  background-color: #F2F2F2;
  padding: 10px 12px 0 4px;
  display: flex;
  flex-wrap: wrap;
}
.item-box{
  margin-bottom: 4px;
  margin-left: 6px;
  border: 1px solid #eee;
}
.item-box:hover{
  border: 1px solid #aaa;
}
</style>