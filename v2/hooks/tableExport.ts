import type { Ref } from 'vue';
import * as XLSX from 'xlsx';

interface excelType {
  data: Array<any>;
  tHeader: Array<string>;
  filterVal: Array<any>;
  filename: string;
}
function useTableExport() {
  function exportExcel(opt:excelType) {
    const { data, tHeader, filterVal, filename } = opt;
    if (!data) {
      throw new Error("data必须是返回promise的函数或者结果的数组");
    }
    import("../utils/Export2Excel").then((excel) => {
      const formatData = formatJson(filterVal, data);
      excel.export_json_to_excel({
        header: tHeader, // 表头 必填
        data: formatData, // 具体数据 必填
        filename: filename || "excel-list", // 非必填
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