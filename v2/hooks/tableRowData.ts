import { nextTick, ref } from "vue";

function useTableRowData(rowModel:any) {
  /**
   * 生成表格所需要的空白行
   * @param {Number} lineNum 行数
   * @return {Array} 数组
  */
  function generateBlankLine(lineNum = 1) {
    const arr = []
    for (let index = 0; index < lineNum; index++) {
      arr.push({
        ...rowModel,
        _isBlank: true, // 标志是否是空的行，校验时这行不需要校验，调接口时这行也不需要
      })
    }
    return arr
  }
  function fillRow(data:any[],index:number,rowData: any) {
    // todo rowData支持数组
    const row = { ...rowData }
    const _X_ROW_RECORD = data[index]._X_ROW_RECORD
    
    if (row._isBlank) {
      delete row._isBlank
    }
    // rowData可能是从别的表格带过来的，所以它的_X_ROW_RECORD可能引用地址不一样
    if (row._X_ROW_RECORD && row._X_ROW_RECORD == _X_ROW_RECORD) {
      // 
    }else{
      row._X_ROW_KEY = _X_ROW_RECORD.recordKeyIndex
      row._X_ROW_RECORD = _X_ROW_RECORD
      _X_ROW_RECORD.recordKeyIndex ++
    }
    data.splice(index, 1 , row)
  }
  return { generateBlankLine,fillRow }
}

export default useTableRowData