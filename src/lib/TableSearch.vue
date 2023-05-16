<template>
  <div>
    <Grid ref="gridRef" :collapsed="collapsed" :gap="[20, 0]" :cols="searchCol">
      <GridItem v-for="(item, index) in searchColumns" :key="item.prop" v-bind="getResponsive(item)" :index="index">
        <el-form-item :label="`${item.label} :`">
          <SearchFormItem :column="item" :search-param="searchData" />
        </el-form-item>
      </GridItem>
      <GridItem suffix>
        <div class="operation">
          <n-button type="primary" @click="search">搜索</n-button>
          <n-button  @click="reset">重置</n-button>
        </div>
      </GridItem>
    </Grid>
  </div>
</template>

<script setup lang='ts' generic="T">
import Grid from "@/lib/Grid/index.vue";
import GridItem from "@/lib/Grid/components/GridItem.vue";
import type { BreakPoint, Responsive } from "@/lib/Grid/interface";
import { computed, ref } from "vue"
type searchFormType = {
  label: string,
  prop: string,
  search?: {
    order?: number; // 搜索项排序（从大到小）
    span?: number; // 搜索项所占用的列数，默认为1列
    offset?: number; // 搜索字段左侧偏移列数
    defaultValue?: string | number | boolean | any[]; // 搜索项默认值
  } & Partial<Record<BreakPoint, Responsive>>,
  [key: string]: any,
}
type tableSearchProps = {
  searchData: any,
  searchColumns: searchFormType[],
  searchCol: number | Record<BreakPoint, number>;
  search?: (params: any) => void; // 搜索方法
	reset?: (params: any) => void; // 重置方法
}
const props = defineProps<tableSearchProps>()
// 获取响应式设置
const getResponsive = (item: searchFormType) => {
  return {
    span: item.search?.span,
    offset: item.search?.offset ?? 0,
    xs: item.search?.xs,
    sm: item.search?.sm,
    md: item.search?.md,
    lg: item.search?.lg,
    xl: item.search?.xl
  };
};

// 是否默认折叠搜索项
const collapsed = ref(true);

// 获取响应式断点
const gridRef = ref();
const breakPoint = computed<BreakPoint>(() => gridRef.value?.breakPoint);

// 判断是否显示 展开/合并 按钮
const showCollapse = computed(() => {
  let show = false;
  props.searchColumns.reduce((prev, current) => {
    prev +=
      (current.search![breakPoint.value]?.span ?? current.search?.span ?? 1) +
      (current.search![breakPoint.value]?.offset ?? current.search?.offset ?? 0);
    if (typeof props.searchCol !== "number") {
      if (prev >= props.searchCol[breakPoint.value]) show = true;
    } else {
      if (prev >= props.searchCol) show = true;
    }
    return prev;
  }, 0);
  return show;
});
</script>
<style lang="scss" scoped></style>