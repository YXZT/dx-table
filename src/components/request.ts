import type { ColumnProps, columnSetting, paginationType, resType } from "@/interface";
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
        rowData[column.dataKey] = `Row ${startIndex + rowIndex} - Col ${columnIndex}`
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
  type requestFnType = (params: any) => Promise<resType>
  const mockRequest:requestFnType=({pageNum,pageSize})=>{
    const list = generateData(columns, pageSize,'row-',pageNum)
    const res = new Promise<resType>((resolve,reject)=>{
      setTimeout(()=>{
        const res:resType = {
          status:0,
          data:{
            pageNum,
            pageSize,
            total:1000,
            records:list
          }
        }
        resolve(res)
      },2000)
    })
    return res
  }

 export {
  columns as mockColumns,
  data as mockData,
  mockRequest
 }