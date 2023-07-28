<script setup lang='ts'>
import type { searchFormType } from '@/interface';
import SearchFormItem from './SearchFormItem.vue';
import { NFormItem, NButton, NConfigProvider, type GlobalThemeOverrides, NSpace, NIconWrapper, NIcon } from 'naive-ui'
import { CloseSharp } from '@vicons/ionicons5'
import { computed } from 'vue';
import useTableSearchConfig from '../hooks/tableSearchConfig'


defineOptions({ name: 'TableSearch' })


type tableSearchProps = {
  searchData: any,
  searchColumns: searchFormType[],
  needMore?: boolean,
}

const props = withDefaults(defineProps<tableSearchProps>(), {
  needMore: false,
})

const {
  init,
  tableSearchColumns
} = useTableSearchConfig({ searchColumns: props.searchColumns })

init()
</script>

<template>
  <div class="search">
    <div v-for="(item) in tableSearchColumns" :key="item.prop" class="item-box">
      <n-form-item :label="`${item.label} :`" size="small" :show-feedback="false" label-placement="left">
        <SearchFormItem :column="item" :search-param="searchData" />
      </n-form-item>
      <n-icon-wrapper :size="18" class="close-btn" color="#ccc" :border-radius="18">
        <n-icon :size="18" :component="CloseSharp" />
      </n-icon-wrapper>
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

.item-box {
  position: relative;
  margin-bottom: 4px;
  margin-left: 6px;
  border: 1px solid #eee;
}

.item-box:hover {
  // border: 1px solid #aaa;
}

.close-btn {
  visibility: hidden;
  position: absolute;
  right: -8px;
  top: -8px;
}

.item-box:hover .close-btn {
  visibility: visible;
}
</style>