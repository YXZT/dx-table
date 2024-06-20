import { deepCopy } from "@/utils";
import { nextTick, ref } from "vue";

function useTableRowData(rowModel: any, blankLineNum = 3) {
  /**
   * 生成表格所需要的空白行
   * @param {Number} lineNum 行数
   * @return {Array} 数组
  */
  function generateBlankLine(lineNum = blankLineNum) {
    const arr = []
    for (let index = 0; index < lineNum; index++) {
      arr.push({
        ...rowModel,
        _isBlank: true, // 标志是否是空的行，校验时这行不需要校验，调接口时这行也不需要
      })
    }
    return arr
  }
  function fillRow(data: any[], index: number, rowData: any) {
    setCurrentRowData(data, index, rowData)
    const addRows = checkNeedCreateNewLine(data)
    if (addRows.length) {
      console.log('addRows', addRows);
      // 添加的行应该也是空的，考虑改造这个函数
      setCurrentRowData(data, index, addRows, true)
    }
  }
  function setCurrentRowData(data: any[], index: number, rowData: any, isAdd: boolean = false) {
    // todo rowData支持数组
    let arr = []
    if (Array.isArray(rowData)) {
      arr = rowData
    } else {
      arr = [rowData]
    }
    const fillArr = []
    for (let i = 0; i < arr.length; i++) {
      const row = arr[i]
      const _X_ROW_RECORD = data[index]._X_ROW_RECORD

      if (row._isBlank) {
        delete row._isBlank
      }
      // rowData可能是从别的表格带过来的，所以它的_X_ROW_RECORD可能引用地址不一样
      if (row._X_ROW_RECORD && row._X_ROW_RECORD == _X_ROW_RECORD) {
        const _row = deepCopy(row)
        fillArr.push(_row)
      } else {
        // todo 待观察是否深拷贝成功
        const _row = deepCopy(row)
        _row._X_ROW_KEY = _X_ROW_RECORD.recordKeyIndex
        _row._X_ROW_RECORD = _X_ROW_RECORD
        _X_ROW_RECORD.recordKeyIndex++
        fillArr.push(_row)
      }
    }
    if (isAdd) {
      data.push(...fillArr)
    } else {
      data.splice(index, 1, ...fillArr)
    }
  }
  /**
   * 获取最后一个空白行位置，如果小于3，则添加新的行
   * 如果大于3 删除多余的行
   * @param {Array} 表格数据
   */
  function checkNeedCreateNewLine(arr: any[]) {
    let index = 0;
    let addRows = []
    for (let i = arr.length - 1; i >= 0; i--) {
      if (arr[i]._isBlank) {
        index++
      } else {
        break;
      }
    }
    if (index < blankLineNum) {
      addRows = generateBlankLine(blankLineNum - index)
    }
    return addRows
  }
  return { generateBlankLine, fillRow }
}

export default useTableRowData