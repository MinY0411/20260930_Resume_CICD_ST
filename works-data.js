// 第 5 课：作品数据（作品门户的**唯一数据源**）。
//
// 想加作品、改标题、换封面、调年份：只改这个文件，
// index.html 和 works-render.js 都不用动。
//
// 每个作品七个字段：
//   title        卡片标题
//   description  一句话说明
//   image        封面图路径
//   url          点击去哪
//   year         年份，用于排序和右上角徽标
//   tags         标签数组，用于筛选（可写多个）
//   theme        卡片主题类名，对应 styles.css 里 .work-xxx .work-cover 的封面色
const works = [
  {
    title: '长风成卷 · 博客应用',
    description: '文章展示、接口与数据库。',
    image: 'assets/work-blog.png',
    url: 'https://ffd-p2-blog.netlify.app/',
    year: 2026,
    tags: ['前端', '后端', '数据库'],
    theme: 'work-blog',
  },
  {
    title: '群像云图 · 社区应用',
    description: '内容发布与社区互动。',
    image: 'assets/work-community.png',
    url: 'https://ffd-p3-community.netlify.app/',
    year: 2026,
    tags: ['前端', '数据库', '部署'],
    theme: 'work-community',
  },
  {
    title: '一笺心意 · 祝福卡片',
    description: '卡片制作与作品分享。',
    image: 'assets/work-greeting-card.png',
    url: 'https://ffd-p4-greeting-card.netlify.app/',
    year: 2025,
    tags: ['前端', 'AI'],
    theme: 'work-greeting-card',
  },
  {
    title: '星声音乐站 · 音乐应用',
    description: '网页音频与交互实践。',
    image: 'assets/work-music-station.png',
    url: 'https://ffd-p5-music-station.netlify.app/',
    year: 2025,
    tags: ['前端', '测试'],
    theme: 'work-music-station',
  },
]
