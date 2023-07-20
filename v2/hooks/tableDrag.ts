import type { NDataTable } from "naive-ui"
import { onMounted, type Ref } from "vue";


type dragType = {
  tableRef: Ref<InstanceType<typeof NDataTable> | null>,
}
function useTableDrag({ tableRef }: dragType) {
  function dragEvent(){
    const target = tableRef.value?.$el
    console.log(target);
  }
  const columDragEnd = (resizedWidth: any, limitedWidth: any, column: any) => {
    console.log({ resizedWidth, limitedWidth, column })
  }
  onMounted(()=>{
    dragEvent()
  })
  return {
    dragEvent,
    columDragEnd
  }
}
export default useTableDrag