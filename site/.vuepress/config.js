module.exports = {
  base: '/fe-attitude/',
  title: '我的前端知识体系',
  description: '记录自己的学习考古，会前端真的可以“为所欲为”maybe',
  themeConfig: {
    sidebar: [
      '/',
      ['/fe/html', 'Html'],
      ['/fe/css', 'CSS'],
      ['/fe/javascript', 'JavaScript'],
      ['/fe/write', '手写代码'],
      ['/fe/algorithm', '算法'],
      ['/fe/vue', 'Vue'],
      ['/fe/browser', '浏览器'],
      ['/fe/network', '计算机网络'],
      ['/fe/webpack', '工程化']
    ],
    sidebarDepth: 2,
    displayAllHeaders: true,
    repo: 'https://github.com/yanyue404/fe-attitude',
    repoLabel: '前往 Github！'
  }
}
