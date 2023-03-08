const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }))

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-',
  startIndex = 0
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${startIndex + columnIndex}`
        return rowData
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      }
    )
  })

  const columns = generateColumns(10)
  const data = generateData(columns, 1000)

  function mockRequest(pageNum:number,pageSize:number){
    const list = generateData(columns, pageSize,'row-',pageNum-1)
    return {
      status:0,
      data:{
        pageNum,
        pageSize,
        records:list
      }
    }
  }

 export {
  columns as mockColumns,
  data as mockData,
  mockRequest
 }