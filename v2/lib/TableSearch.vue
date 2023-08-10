<script setup lang='ts'>
import type { searchFormType } from '@/interface';
import SearchFormItem from './SearchFormItem.vue';
import { NFormItem, NButton, NConfigProvider, type GlobalThemeOverrides, NSpace, NIconWrapper, NIcon, NPopselect } from 'naive-ui'
import { CloseSharp, AddSharp, RefreshSharp, ArrowDown, ArrowUp } from '@vicons/ionicons5'
import { computed, ref, type Ref } from 'vue';
import useTableSearchConfig from '../hooks/tableSearchConfig'
import DxTable from './DxTable.vue'


defineOptions({ name: 'TableSearch' })

type tableSearchProps = {
  tableRef?: InstanceType<typeof DxTable>,
  searchData: any,
  searchColumns: searchFormType[],
  needMore?: boolean,
  needStore?: boolean,
  storeName?: string,
  moreSearch?: Function,
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
  ).map(ele => {
    return {
      label: ele.label,
      value: ele.prop,
    }
  })
  return arr
})

const refreshTable = () => {
  props.tableRef?.refresh(true)
}
const showMoreSearch = () => {
  props.moreSearch?.()
}

// 是否默认折叠搜索项
const collapsed = ref(false);

</script>

<template>
  <div class="search">
    <template v-if="!collapsed">
      <div v-for="(item) in tableSearchColumns" :key="item.prop" class="item-box">
        <n-form-item :label="`${item.label}`" size="small" :show-feedback="false" label-placement="left">
          <SearchFormItem :column="item" :search-param="searchData" @value-change="refreshTable" />
        </n-form-item>
        <n-icon-wrapper :size="18" class="close-btn" color="#ccc" :border-radius="18" @click="removeSearchColumns(item)">
          <n-icon :size="18" :component="CloseSharp" />
        </n-icon-wrapper>
      </div>
      <n-popselect :options="hiddenColumsOptions" size="medium" scrollable :on-update:value="showSearchColumns"
        v-if="hiddenColumsOptions.length">
        <n-button quaternary size="small" class="search-button">
          <template #icon>
            <n-icon :component="AddSharp"></n-icon>
          </template>
        </n-button>
      </n-popselect>
      <n-button quaternary size="small" class="search-button" @click="refreshTable">
        <template #icon>
          <n-icon :component="RefreshSharp"></n-icon>
        </template>
      </n-button>
    </template>
    <div class="search-right">
      <n-button strong secondary type="info" size="small" class="search-button" v-if="moreSearch" @click="showMoreSearch" v-show="!collapsed">
        高级查询
      </n-button>
      <n-button icon-placement="right" type="primary" size="small" quaternary class="search-button" @click="collapsed = !collapsed">
        {{ collapsed ? "展开" : "收起" }}
        <template #icon>
          <n-icon>
            <component :is="collapsed ? ArrowDown : ArrowUp"></component>
          </n-icon>
        </template>
      </n-button>
    </div>
  </div>
</template>

<style scoped lang='scss'>
.search {
  overflow: hidden;
  background-color: #eaf1f3;
  padding: 8px 12px 0 4px;
  display: flex;
  flex-wrap: wrap;
}

.search-button {
  margin-bottom: 6px;
  margin-left: 6px;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.3),-2px -2px 2px rgba(255,255,255,0.7);
}

.item-box {
  position: relative;
  margin-bottom: 6px;
  margin-left: 6px;
  border-radius: 4px;
  // border: 1px solid #eee;
  box-shadow: 2px 2px 2px rgba(0,0,0,0.3),-2px -2px 2px rgba(255,255,255,0.7);
}

.item-box:hover {
  // border: 1px solid #aaa;
  // box-shadow: 2px 2px 2px rgba(0,0,0,0.3),-2px -2px 2px rgba(255,255,255,0.7);
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
.search-right{
  margin-left: auto;
}
</style>