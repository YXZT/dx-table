import { ref } from "vue";

function useTableRowData(rowModel:Object) {
  /**
   * 生成表格所需要的空白行
   * @param {Number} lineNum 行数
   * @return {Array} 数组
  */
  function generateBlankLine(lineNum = 1) {
    const arr = []
    for (let index = 0; index < lineNum; index++) {
      arr.push({
        ...rowModel
      })
    }
    return arr
  }
  return { generateBlankLine }
}

export default useTableRowData