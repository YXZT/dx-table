import Mock from "mockjs";
Mock.setup({
  // 延迟时间200毫秒
  timeout: 2000,
});
// 生成subjects、grades数据
const { subjects, grades } = Mock.mock({
  "grades|3": [{
      // 属性 GradeId 是一个自增数，起始值为 1，每次增 1
      'GradeId|+1': 1,
      // @cname 随机生成一个常见的中文姓名。
      "GradeName": '@cname'
  }],
  // 随机生成一个5到10条的数组
  // 属性 subjects 的值是一个数组，其中含有 5 到 10 个元素
  "subjects|5-10": [{
      'SubjectId|+1': 1,
      // @ctitle 随机生成一句中文标题。
      SubjectName: '@ctitle(10,15)',
      // @integer( min, max )返回一个随机的整数。min最小值,max最大值
      ClassHour: '@integer(22,80)',
      GradeId: '@integer(1,3)',
  }]
});
// 给课程数组添加年级信息
subjects.forEach(r => {
  // 给每个课程信息，添加一个年级的完整信息
  r.Grade = {
      GradeId: r.GradeId,
      GradeName: grades.find(g => g.GradeId == r.GradeId).GradeName
  }
});

// 拦截查询所有年级信息的请求
Mock.mock('http://www.bingjs.com:81/Grade/GetAll', "get", () => {
    return grades;
});

// 拦截查询所有课程信息的请求
Mock.mock('http://www.bingjs.com:81/Subject/GetAll', "get", () => {
    return subjects;
});