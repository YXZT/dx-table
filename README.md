## dx-table

这是基于Naive UI的数据表格Data Table组件进行二次封装的表格组件，是个人在工作中对实际需求做的实现，有以下亮点

- 使用TS
- 兼容所有原本的[表格功能](https://www.naiveui.com/zh-CN/os-theme/components/data-table#API "表格功能")，包括虚拟滚动
- 自定义列的显示隐藏
- 自定义列的fixed位置
- 改变列的顺序
- 配置持久化存储
- 封装请求逻辑简化代码
- 无限滚动的支持

### 说明

主要是展示思想为主，当初就是感觉Naive UI这个表格组件做的挺好的，所以在此基础上开发，把这套逻辑搬到element-plus的[表格](https://element-plus.gitee.io/zh-CN/component/table.html "表格")或者[vxe-table](https://vxetable.cn/#/table/start/install "vxe-table")都是可以的。

封装过后灵活性就降低了，所以就不做成npm包了，主要文件在lib文件夹下，有需要的自行复制