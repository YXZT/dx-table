<script setup lang='ts'>
import type { searchFormType } from '@/interface';
import SearchFormItem from './SearchFormItem.vue';
import { NFormItem, NButton, NConfigProvider, type GlobalThemeOverrides, NSpace, NIconWrapper, NIcon,NPopselect } from 'naive-ui'
import { CloseSharp, AddSharp } from '@vicons/ionicons5'
import { computed } from 'vue';
import useTableSearchConfig from '../hooks/tableSearchConfig'


defineOptions({ name: 'TableSearch' })


type tableSearchProps = {
  searchData: any,
  searchColumns: searchFormType[],
  needMore?: boolean,
  needStore?: boolean,
  storeName?: string,
}

const props = withDefaults(defineProps<tableSearchProps>(), {
  needMore: false,
  needStore: true,
  storeName: 'default',
})

const {
  init,
  tableSearchColumns,
  removeSearchColumns,
  showSearchColumns
} = useTableSearchConfig({ tableSearchProps: props })

const {
  localColums
} = init()

const hiddenColumsOptions = computed(() => {
  const arr = localColums.value.filter(
    col => !col.isShow,
  ).map(ele=>{
    return {
      label: ele.label,
      value: ele.prop,
    }
  })
  return arr
})
</script>

<template>
  <div class="search">
    <div v-for="(item) in tableSearchColumns" :key="item.prop" class="item-box">
      <n-form-item :label="`${item.label} :`" size="small" :show-feedback="false" label-placement="left">
        <SearchFormItem :column="item" :search-param="searchData" />
      </n-form-item>
      <n-icon-wrapper :size="18" class="close-btn" color="#ccc" :border-radius="18" @click="removeSearchColumns(item)">
        <n-icon :size="18" :component="CloseSharp" />
      </n-icon-wrapper>
    </div>
    <n-popselect :options="hiddenColumsOptions" size="medium" scrollable :on-update:value="showSearchColumns" v-if="hiddenColumsOptions.length">
      <n-button quaternary size="small" class="search-button">
        <template #icon>
          <n-icon :component="AddSharp"></n-icon>
        </template>
      </n-button>
    </n-popselect>

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
.search-button {
  margin-bottom: 4px;
  margin-left: 6px;
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