import { deepCopy } from "@/utils";

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
    const nextIndex = setCurrentRowData(data, index, rowData)
    const addRows = checkNeedCreateNewLine(data)
    if (addRows.length) {
      addRows.forEach((row) => {
        const _X_ROW_RECORD = data[index]._X_ROW_RECORD
        const _row = setRowKey(_X_ROW_RECORD,row)
        data.push(_row)
      })
    }
    return {
      nextIndex
    }
  }
  function setCurrentRowData(data: any[], index: number, rowData: any) {
    // todo rowData支持数组
    let arr = []
    if (Array.isArray(rowData)) {
      arr = rowData
    } else {
      arr = [rowData]
    }
    const fillArr = []
    const _X_ROW_RECORD = data[index]._X_ROW_RECORD
    // 清空当前填充项
    _X_ROW_RECORD.fillKey = []
    for (let i = 0; i < arr.length; i++) {
      const row = arr[i]
      _X_ROW_RECORD.fillKey.push(1 + index + i)

      if (row._isBlank) {
        delete row._isBlank
      }
      // rowData可能是从别的表格带过来的，所以它的_X_ROW_RECORD可能引用地址不一样
      if (row._X_ROW_RECORD && row._X_ROW_RECORD == _X_ROW_RECORD) {
        const _row = {...row}
        fillArr.push(_row)
      } else {
        // todo 待观察是否深拷贝成功
        const _row = setRowKey(_X_ROW_RECORD,row)
        fillArr.push(_row)
      }
    }
    data.splice(index, 1, ...fillArr)
    return index + arr.length
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
  
  /**
   * 给该行赋予自动生成的key
   * @param _X_ROW_RECORD 行信息(会被改变)
   * @param row 要添加的行
   */
  function setRowKey(_X_ROW_RECORD:any,row:any) {
    const _row = {...row}
    _row._X_ROW_KEY = _X_ROW_RECORD.recordKeyIndex
    
    _row._X_ROW_RECORD = _X_ROW_RECORD
    _X_ROW_RECORD.recordKeyIndex++
    return _row
  }
  /**
   * 获取表格数据中非空白行
   * @param data 表格数据
   * @returns 过滤之后的表格数据（注意是引用地址）
   */
  function getTableFillData(data: any[]){
    return data.filter(item=>!item._isBlank)
  }
  /**
   * 获取第一个空白行
   * @param {Array} 表格数据
   * @return {Number} index
   */
  function searchInsert(data: any[]) {
    return data.findIndex((ele) => {
      return ele._isBlank === true
    })
  }
  return { generateBlankLine, fillRow, getTableFillData, searchInsert }
}

export default useTableRowData