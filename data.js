// ============================================================
// data.js - 所有动态内容数据（你只需改这个文件来更新内容）
// ============================================================

// 1. 最新动态数据
var logData = [
    { date: '2026-07-21', author: 'admin', tag: '更新', title: '产品图片支持真实图片链接' },
    { date: '2026-07-21', author: 'admin', tag: '更新', title: 'UI全面优化，按钮圆角适配' },
    { date: '2026-07-20', author: 'admin', tag: '更新', title: 'UI适配全面升级，体验更流畅' },
    { date: '2026-07-20', author: 'admin', tag: '更新', title: '首次发布' },
];

// 2. 产品数据（支持图片URL）
var productData = [
    {
        name: '品牌官网',
        desc: '专业级展示方案，支持自定义主题',
        img: 'https://picsum.photos/400/250?random=101',
        viewUrl: 'https://github.com/zirui6/zirui6.github.io',
        downloadUrl: 'https://codeload.github.com/zirui6/zirui6.github.io/zip/refs/heads/main'
    },
    {
        name: '智能助手 AI',
        desc: '基于大模型的智能问答与内容生成',
        img: 'https://picsum.photos/400/250?random=102',
        viewUrl: '#',
        downloadUrl: '#'
    },
    {
        name: '数据看板',
        desc: '实时数据监控与可视化分析工具',
        img: 'https://picsum.photos/400/250?random=103',
        viewUrl: '#',
        downloadUrl: '#'
    },
    {
        name: '移动应用 Kit',
        desc: '跨平台移动端开发套件',
        img: 'https://picsum.photos/400/250?random=104',
        viewUrl: '#',
        downloadUrl: '#'
    },
    {
        name: '云存储 S3',
        desc: '安全可靠的分布式文件存储服务',
        img: 'https://picsum.photos/400/250?random=105',
        viewUrl: '#',
        downloadUrl: '#'
    },
    {
        name: '身份认证 IAM',
        desc: '零信任架构的企业级身份管理',
        img: 'https://picsum.photos/400/250?random=106',
        viewUrl: '#',
        downloadUrl: '#'
    },
    {
        name: '内容管理 CMS',
        desc: '灵活易用的内容发布与管理系统',
        img: 'https://picsum.photos/400/250?random=107',
        viewUrl: '#',
        downloadUrl: '#'
    },
    {
        name: '分析引擎 AE',
        desc: '用户行为分析与智能推荐引擎',
        img: 'https://picsum.photos/400/250?random=108',
        viewUrl: '#',
        downloadUrl: '#'
    }
];

// 3. 文章数据
var articleData = [
    {
        date: '2026-07-21',
        author: '梓睿',
        tag: '技术',
        title: '产品图片展示优化',
        sub: '从 emoji 到真实图片的完整升级方案',
        url: 'https://example.com/article/image-optimization'
    },
    {
        date: '2026-07-20',
        author: '梓睿',
        tag: '技术',
        title: '前端性能优化',
        sub: '从加载速度到交互流畅度的全方位提升',
        url: 'https://example.com/article/optimization'
    },
    {
        date: '2026-07-20',
        author: '梓睿',
        tag: '更新',
        title: '首发！！！！！',
        sub: '全新体验上线',
        url: 'https://example.com/article/first-release'
    },
    {
        date: '2026-07-19',
        author: '梓睿',
        tag: '设计',
        title: 'UI设计系统',
        sub: '统一的视觉语言与组件体系',
        url: 'https://example.com/article/design-system'
    },
    {
        date: '2026-07-18',
        author: '梓睿',
        tag: '技术',
        title: 'Supabase 入门指南',
        sub: '从零搭建后端服务',
        url: 'https://example.com/article/supabase-guide'
    },
    {
        date: '2026-07-17',
        author: '梓睿',
        tag: '产品',
        title: '用户增长策略',
        sub: '从0到1000用户的核心方法',
        url: 'https://example.com/article/growth-strategy'
    },
    {
        date: '2026-07-16',
        author: '梓睿',
        tag: '技术',
        title: 'GitHub Pages 部署教程',
        sub: '免费托管你的静态网站',
        url: 'https://example.com/article/github-pages'
    },
    {
        date: '2026-07-15',
        author: '梓睿',
        tag: '管理',
        title: '远程团队协作指南',
        sub: '高效沟通与项目管理实践',
        url: 'https://example.com/article/remote-team'
    }
];

// 4. 五栏轮播数据（文案 + 图片）
var carouselData = [
    {
        badge: '新品首发',
        title: '下一代数字体验平台',
        desc: '为品牌与用户之间建立无缝连接，重新定义内容展示与交互方式。',
        image: 'https://picsum.photos/1920/600?random=1',
        link: '#'
    },
    {
        badge: '性能升级',
        title: '极速加载 · 流畅体验',
        desc: '采用边缘计算与智能缓存技术，页面加载速度提升 300%。',
        image: 'https://picsum.photos/1920/600?random=2',
        link: '#'
    },
    {
        badge: '设计系统',
        title: '模块化设计语言',
        desc: '统一的视觉体系，让品牌表达更一致、更专业。',
        image: 'https://picsum.photos/1920/600?random=3',
        link: '#'
    },
    {
        badge: '数据洞察',
        title: '智能分析看板',
        desc: '实时了解用户行为，用数据驱动决策。',
        image: 'https://picsum.photos/1920/600?random=4',
        link: '#'
    },
    {
        badge: '安全可信',
        title: '企业级安全防护',
        desc: '端到端加密 + 零信任架构，保障数据安全。',
        image: 'https://picsum.photos/1920/600?random=5',
        link: '#'
    }
];