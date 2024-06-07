import type { Ref } from 'vue';
import * as XLSX from 'xlsx';

interface excelType {
  json: object;
  name: string;
  titleArr: string[];
  sheetName: string;
}
function useTableExport() {
  

  const exportExcel = (params: excelType) => {
    const keyArray = [];
    const data = [];
    const getLength = function (obj: object) {
      let count = 0;
      for (const i in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, i)) {
          count++;
        }
      }
      return count;
    };


    for (const key1 in params.json) {
      if (Object.prototype.hasOwnProperty.call(params.json, key1)) {
        const element = (params.json as { [key: string]: object })[key1];
        const rowDataArray = [];
        for (const key2 in element) {
          if (Object.prototype.hasOwnProperty.call(element, key2)) {
            const element2 = (element as { [key: string]: object })[key2];
            rowDataArray.push(element2);
            if (keyArray.length < getLength(element)) {
              keyArray.push(key2);
            }
          }
        }
        data.push(rowDataArray);
      }
    }
    data.splice(0, 0, keyArray as any, params.titleArr as any);
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    // 隐藏英文字段表头
    const wsrows = [{ hidden: true }];
    /* 设置worksheet每列的最大宽度 */
    const colWidth = data.map((row) =>
      row.map((val) => {
        /* 先判断是否为null/undefined */
        if (val == null) {
          return {
            wch: 20,
          };
        } else if (val.toString().charCodeAt(0) > 255) {
          /* 再判断是否为中文 */
          return {
            wch: val.toString().length * 2,
          };
        } else {
          return {
            wch: val.toString().length * 2,
          };
        }
      })
    );
    /* 以第一行为初始值 */
    const result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j].wch < colWidth[i][j].wch) {
          result[j].wch = colWidth[i][j].wch;
        }
      }
    }
    ws['!cols'] = result;
    ws['!rows'] = wsrows; // ws - worksheet
    XLSX.utils.book_append_sheet(wb, ws, params.sheetName);
    /* generate file and send to client */
    XLSX.writeFile(wb, `${params.name}.xlsx`);
  };
  return {
    exportExcel
  }
}
export default useTableExport;