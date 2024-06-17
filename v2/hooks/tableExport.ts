import { h, type Ref } from 'vue';
import * as XLSX from 'xlsx';
import { useModal, useMessage, NButton } from 'naive-ui'
import TableExport from '../lib/TableExport.vue'
import type { columnsSetting } from '@/interface';
interface excelType {
  data: Array<any>;
  tHeader: Array<string>;
  filterVal: Array<any>;
  fileName: string;
}
function useTableExport() {
  const modal = useModal()
  function exportExcel(opt:excelType,dataSetting:columnsSetting) {
    modal.create({
      title: '导出Excel',
      preset: 'dialog',
      style: {
        width: '80%',
        'min-width': '800px',
      },
      content: ()=>h(TableExport,{
        dataSetting:dataSetting,
        fileName:opt.fileName,
        onSave:(e)=>{
          // handleExportExcel(Object.assign({},opt,e))
          const download_path = document.getElementById('download-path').value;
          alert('Default download path: ' + download_path);
        }
      }),
    })
  }
  function handleExportExcel(opt:excelType) {
    const { data, tHeader, filterVal, fileName } = opt;
    if (!data) {
      throw new Error("data必须是返回promise的函数或者结果的数组");
    }
    import("../utils/Export2Excel").then((excel) => {
      const formatData = formatJson(filterVal, data);
      excel.export_json_to_excel({
        header: tHeader, // 表头 必填
        data: formatData, // 具体数据 必填
        filename: fileName || "excel-list", // 非必填
        autoWidth: true, // 非必填
        bookType: "xlsx" // 非必填
      });
    });
  }
  function formatJson(filterVal: any[], tableData: any[]) {
    return tableData.map((v: { [x: string]: any; }) => {
      return filterVal.map((j: string | number) => {
        return v[j];
      });
    });
  }
  return {
    exportExcel
  }
}
export default useTableExport;