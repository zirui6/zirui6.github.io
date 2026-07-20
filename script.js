// ============================================================
// 1. 数据源
// ============================================================
const logData = [
    { date: '2026-07-20', author: 'admin', tag: '更新', title: '首次发布' },
    { date: '2026-07-18', author: '李丽', tag: '更新', title: '移动端适配全面升级，体验更流畅' },
    { date: '2026-07-17', author: '王刚', tag: '活动', title: '限时优惠活动开启，新用户专享' },
    { date: '2026-07-16', author: '陈雪', tag: '公告', title: '关于隐私政策更新的重要通知' },
    { date: '2026-07-15', author: '赵磊', tag: '更新', title: '智能推荐算法升级，内容更精准' },
    { date: '2026-07-14', author: '刘芳', tag: '更新', title: '客服系统接入AI助手，7x24小时在线' },
    { date: '2026-07-13', author: '周涛', tag: '重要', title: '平台用户量突破 100 万' },
    { date: '2026-07-12', author: '吴迪', tag: '活动', title: '开发者大赛报名通道开启' },
    { date: '2026-07-11', author: '郑爽', tag: '更新', title: '数据看板新增实时监控功能' },
    { date: '2026-07-10', author: '林峰', tag: '公告', title: '系统维护通知：7月15日凌晨停机升级' },
    { date: '2026-07-09', author: '黄鑫', tag: '更新', title: '文件存储容量扩充至 10TB' },
    { date: '2026-07-08', author: '杨洋', tag: '重要', title: '获得年度最佳创新产品奖' },
];

const productData = [
    { name: '品牌官网 Pro', desc: '专业级品牌展示方案，支持自定义主题', img: '🏢' },
    { name: '智能助手 AI', desc: '基于大模型的智能问答与内容生成', img: '🤖' },
    { name: '数据看板', desc: '实时数据监控与可视化分析工具', img: '📊' },
    { name: '移动应用 Kit', desc: '跨平台移动端开发套件', img: '📱' },
    { name: '云存储 S3', desc: '安全可靠的分布式文件存储服务', img: '☁️' },
    { name: '身份认证 IAM', desc: '零信任架构的企业级身份管理', img: '🔐' },
    { name: '内容管理 CMS', desc: '灵活易用的内容发布与管理系统', img: '📝' },
    { name: '分析引擎 AE', desc: '用户行为分析与智能推荐引擎', img: '🧠' },
    { name: '实时通信 RTC', desc: '低延迟的音视频通信解决方案', img: '🎥' },
    { name: '物联网平台 IoT', desc: '设备连接与数据采集管理平台', img: '🌐' },
];

const articleData = [
    { date: '2026-07-19', author: '张小明', tag: '技术', title: '前端性能优化实战', sub: '从加载速度到交互流畅度的全方位提升策略' },
    { date: '2026-07-18', author: '李丽', tag: '设计', title: '设计系统构建指南', sub: '如何打造一套可扩展、可维护的企业级设计语言' },
    { date: '2026-07-17', author: '王刚', tag: '产品', title: '用户增长方法论', sub: '从0到100万用户的核心策略与实操案例' },
    { date: '2026-07-16', author: '陈雪', tag: '技术', title: '云原生架构演进', sub: '微服务、容器化与Kubernetes的落地实践' },
    { date: '2026-07-15', author: '赵磊', tag: '管理', title: '高效团队协作指南', sub: '远程办公与敏捷开发的最佳实践' },
    { date: '2026-07-14', author: '刘芳', tag: '技术', title: 'AI模型部署全流程', sub: '从训练到生产环境的完整链路解析' },
    { date: '2026-07-13', author: '周涛', tag: '安全', title: '零信任安全架构入门', sub: '基于零信任理念的网络安全防护体系' },
    { date: '2026-07-12', author: '吴迪', tag: '产品', title: '用户体验设计原则', sub: '以用户为中心的设计思维与实践方法' },
    { date: '2026-07-11', author: '郑爽', tag: '技术', title: 'WebAssembly 入门指南', sub: '高性能网页应用的新时代技术' },
    { date: '2026-07-10', author: '林峰', tag: '管理', title: '数据驱动决策体系', sub: '用数据支撑业务决策的完整框架' },
    { date: '2026-07-09', author: '黄鑫', tag: '技术', title: 'Rust 语言实践', sub: '安全、并发的系统编程语言实战' },
    { date: '2026-07-08', author: '杨洋', tag: '设计', title: '品牌视觉识别系统', sub: 'VI规范与品牌一致性设计指南' },
];

// ============================================================
// 2. 多语言词库
// ============================================================
const translations = {
    'zh-CN': {
        logsTitle: '最新动态',
        productsTitle: '产品中心',
        articlesTitle: '精选文章',
        contactTitle: '联系我们',
        moreBtn: '展示更多',
        loginBtn: '登录',
        settingsLabel: '快捷设置',
        themeLabel: '深色模式',
        notifLabel: '通知',
        langLabel: '语言',
        statsLabel: '数据统计',
        experimentLabel: '实验功能',
        backToTop: '回到顶部',
        goToBottom: '跳转到底部',
        contactPopupTitle: '联系方式',
        notifPopupTitle: '通知中心',
        statsPopupTitle: '数据统计',
        notifEmpty: '暂无更多通知',
        statsArticles: '文章总数',
        statsProducts: '产品总数',
        statsLogs: '动态总数',
        statsVisits: '页面访问量',
        statsUpdate: '数据更新于当前会话',
        loginAlert: '🔐 登录功能开发中...\n后续将对接用户认证系统。',
        allLoaded: '已全部加载',
    },
    'en': {
        logsTitle: 'Latest Updates',
        productsTitle: 'Products',
        articlesTitle: 'Featured Articles',
        contactTitle: 'Contact Us',
        moreBtn: 'Load More',
        loginBtn: 'Login',
        settingsLabel: 'Quick Settings',
        themeLabel: 'Dark Mode',
        notifLabel: 'Notifications',
        langLabel: 'Language',
        statsLabel: 'Statistics',
        experimentLabel: 'Experimental',
        backToTop: 'Back to Top',
        goToBottom: 'Go to Bottom',
        contactPopupTitle: 'Contact Info',
        notifPopupTitle: 'Notification Center',
        statsPopupTitle: 'Statistics',
        notifEmpty: 'No more notifications',
        statsArticles: 'Total Articles',
        statsProducts: 'Total Products',
        statsLogs: 'Total Updates',
        statsVisits: 'Page Views',
        statsUpdate: 'Data updated in current session',
        loginAlert: '🔐 Login feature coming soon...\nWill integrate with user authentication system.',
        allLoaded: 'All Loaded',
    }
};

let currentLang = 'zh-CN';

// ============================================================
// 3. 渲染函数
// ============================================================
function renderLogs(data, containerId, initialCount) {
    const container = document.getElementById(containerId);
    container.innerHTML = data.map((item, idx) => `
        <div class="log-item ${idx >= initialCount ? 'hidden' : ''}" data-index="${idx}">
            <div class="log-meta">
                <span>📅 ${item.date}</span>
                <span>👤 ${item.author}</span>
                <span class="tag">${item.tag}</span>
            </div>
            <div class="log-title"><span class="prefix">›</span> ${item.title}</div>
        </div>
    `).join('');
}

function renderProducts(data, containerId, initialCount) {
    const container = document.getElementById(containerId);
    container.innerHTML = data.map((item, idx) => `
        <div class="product-card ${idx >= initialCount ? 'hidden' : ''}" data-index="${idx}">
            <div class="img-wrap">${item.img}</div>
            <div class="info">
                <div class="name">${item.name}</div>
                <div class="desc">${item.desc}</div>
                <div class="actions">
                    <a href="#" class="view-btn">查看详情</a>
                    <a href="#" class="download-btn">下载</a>
                </div>
            </div>
        </div>
    `).join('');
}

function renderArticles(data, containerId, initialCount) {
    const container = document.getElementById(containerId);
    container.innerHTML = data.map((item, idx) => `
        <div class="article-item ${idx >= initialCount ? 'hidden' : ''}" data-index="${idx}">
            <div class="art-meta">
                <span>📅 ${item.date}</span>
                <span>👤 ${item.author}</span>
                <span class="art-tag">${item.tag}</span>
            </div>
            <div class="art-title">${item.title}</div>
            <div class="art-sub">${item.sub}</div>
        </div>
    `).join('');
    container.querySelectorAll('.article-item').forEach(el => {
        el.addEventListener('click', () => window.open('https://example.com/article', '_blank'));
    });
}

// ============================================================
// 4. 分页逻辑（修复：首屏固定，点击加载更多）
// ============================================================
const PAGE_SIZE = { logs: 5, products: 8, articles: 8 };
let currentPage = { logs: 1, products: 1, articles: 1 };
const totalCount = { logs: logData.length, products: productData.length, articles: articleData.length };

function getVisibleCount(type) {
    return Math.min(currentPage[type] * PAGE_SIZE[type], totalCount[type]);
}

function updateVisibility(type, containerSelector, itemSelector) {
    const container = document.querySelector(containerSelector);
    const items = container.querySelectorAll(itemSelector);
    const visible = getVisibleCount(type);
    items.forEach((el, idx) => {
        el.classList.toggle('hidden', idx >= visible);
    });
    const btn = document.querySelector(`.more-btn[data-target="${type}"]`);
    if (btn) {
        const span = btn.querySelector('span');
        if (visible >= totalCount[type]) {
            span.textContent = translations[currentLang].allLoaded;
            btn.style.opacity = '0.6';
            btn.style.cursor = 'default';
        } else {
            span.textContent = translations[currentLang].moreBtn;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }
    }
}

function loadMore(type) {
    if (currentPage[type] * PAGE_SIZE[type] >= totalCount[type]) return;
    currentPage[type] += 1;
    const map = {
        logs: { container: '#logContainer', item: '.log-item' },
        products: { container: '#productGrid', item: '.product-card' },
        articles: { container: '#articleContainer', item: '.article-item' }
    };
    const { container, item } = map[type];
    updateVisibility(type, container, item);
}

// ============================================================
// 5. 多语言切换
// ============================================================
function applyLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (t[key]) el.textContent = t[key];
    });
    document.getElementById('loginBtn').textContent = t.loginBtn;
    document.querySelector('.settings-bar .label').textContent = '⚡ ' + t.settingsLabel;
    document.getElementById('themeToggle').innerHTML = '🌙 ' + t.themeLabel;
    document.getElementById('notifToggle').innerHTML = '🔔 ' + t.notifLabel;
    document.getElementById('langToggle').innerHTML = '🌐 ' + t.langLabel + ' / ' + (lang === 'zh-CN' ? '简体' : 'English');
    document.getElementById('statsToggle').innerHTML = '📊 ' + t.statsLabel;
    document.getElementById('experimentToggle').innerHTML = '✨ ' + t.experimentLabel;
    document.querySelectorAll('.more-btn').forEach(btn => {
        const span = btn.querySelector('span');
        if (span) {
            const type = btn.dataset.target;
            const visible = getVisibleCount(type);
            if (visible >= totalCount[type]) {
                span.textContent = t.allLoaded;
                btn.style.opacity = '0.6';
                btn.style.cursor = 'default';
            } else {
                span.textContent = t.moreBtn;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            }
        }
    });
    document.querySelector('#contactPopup .popup-title').textContent = '📬 ' + t.contactPopupTitle;
    document.querySelector('#notifPopup .popup-title').textContent = '🔔 ' + t.notifPopupTitle;
    document.querySelector('#statsPopup .popup-title').textContent = '📊 ' + t.statsPopupTitle;
    const notifEmpty = document.querySelector('#notifPopup div:last-child');
    if (notifEmpty) notifEmpty.textContent = '— ' + t.notifEmpty + ' —';
    const statsItems = document.querySelectorAll('.stats-item');
    const keys = ['statsArticles', 'statsProducts', 'statsLogs', 'statsVisits'];
    statsItems.forEach((el, i) => {
        if (i < keys.length) {
            const label = t[keys[i]];
            const value = el.querySelector('strong')?.textContent || '';
            el.innerHTML = label + '：<strong>' + value + '</strong>';
        }
    });
    const statsFooter = document.querySelector('#statsPopup div:last-child');
    if (statsFooter) statsFooter.textContent = t.statsUpdate;
    localStorage.setItem('preferredLang', lang);
    document.getElementById('langToggle').dataset.lang = lang;
}

// ============================================================
// 6. 初始化
// ============================================================
renderLogs(logData, 'logContainer', PAGE_SIZE.logs);
renderProducts(productData, 'productGrid', PAGE_SIZE.products);
renderArticles(articleData, 'articleContainer', PAGE_SIZE.articles);

const savedLang = localStorage.getItem('preferredLang') || 'zh-CN';
applyLanguage(savedLang);

updateVisibility('logs', '#logContainer', '.log-item');
updateVisibility('products', '#productGrid', '.product-card');
updateVisibility('articles', '#articleContainer', '.article-item');

// ============================================================
// 7. 事件绑定：更多按钮
// ============================================================
document.querySelectorAll('.more-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        loadMore(this.dataset.target);
    });
});

// ============================================================
// 8. 轮播
// ============================================================
let currentSlide = 0;
const totalSlides = 5;
const track = document.getElementById('carouselTrack');
const dots = document.getElementById('carouselDots');

for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('span');
    dot.className = `dot ${i === 0 ? 'active' : ''}`;
    dot.dataset.index = i;
    dot.addEventListener('click', () => goToSlide(i));
    dots.appendChild(dot);
}

function goToSlide(index) {
    currentSlide = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    resetAutoSlide();
}

function nextSlide() { goToSlide((currentSlide + 1) % totalSlides); }
function prevSlide() { goToSlide((currentSlide - 1 + totalSlides) % totalSlides); }

document.getElementById('carouselNext').addEventListener('click', nextSlide);
document.getElementById('carouselPrev').addEventListener('click', prevSlide);

let autoTimer = setInterval(nextSlide, 5000);
function resetAutoSlide() {
    clearInterval(autoTimer);
    autoTimer = setInterval(nextSlide, 5000);
}

// ============================================================
// 9. 设置栏切换
// ============================================================
const settingsToggle = document.getElementById('settingsToggle');
const settingsBar = document.getElementById('settingsBar');

settingsToggle.addEventListener('click', function() {
    settingsBar.classList.toggle('open');
    this.style.transform = settingsBar.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
});

// ============================================================
// 10. 深色模式
// ============================================================
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const label = currentLang === 'zh-CN' ? '深色模式' : 'Dark Mode';
    themeToggle.innerHTML = (theme === 'dark' ? '☀️' : '🌙') + ' ' + label;
}

const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

themeToggle.addEventListener('click', function() {
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
});

// ============================================================
// 11. 通知
// ============================================================
const notifToggle = document.getElementById('notifToggle');
const notifPopup = document.getElementById('notifPopup');
const notifClose = document.getElementById('notifClose');
let notifOpen = false;

notifToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    notifOpen = !notifOpen;
    notifPopup.classList.toggle('open', notifOpen);
    if (notifOpen) {
        contactPopup.classList.remove('open');
        statsPopup.classList.remove('open');
        popupOpen = false;
        statsOpen = false;
    }
});

notifClose.addEventListener('click', function() {
    notifOpen = false;
    notifPopup.classList.remove('open');
});

// ============================================================
// 12. 数据统计
// ============================================================
const statsToggle = document.getElementById('statsToggle');
const statsPopup = document.getElementById('statsPopup');
const statsClose = document.getElementById('statsClose');
let statsOpen = false;

let visitCount = parseInt(sessionStorage.getItem('visitCount') || '0');
visitCount += 1;
sessionStorage.setItem('visitCount', visitCount);
document.getElementById('visitCount').textContent = visitCount;

statsToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    statsOpen = !statsOpen;
    statsPopup.classList.toggle('open', statsOpen);
    if (statsOpen) {
        contactPopup.classList.remove('open');
        notifPopup.classList.remove('open');
        popupOpen = false;
        notifOpen = false;
        const t = translations[currentLang];
        document.querySelectorAll('.stats-item strong')[0].textContent = articleData.length;
        document.querySelectorAll('.stats-item strong')[1].textContent = productData.length;
        document.querySelectorAll('.stats-item strong')[2].textContent = logData.length;
        document.getElementById('visitCount').textContent = visitCount;
        const statsItems = document.querySelectorAll('.stats-item');
        const keys = ['statsArticles', 'statsProducts', 'statsLogs', 'statsVisits'];
        statsItems.forEach((el, i) => {
            if (i < keys.length) {
                const label = t[keys[i]];
                const value = el.querySelector('strong')?.textContent || '';
                el.innerHTML = label + '：<strong>' + value + '</strong>';
            }
        });
        const footer = document.querySelector('#statsPopup div:last-child');
        if (footer) footer.textContent = t.statsUpdate;
    }
});

statsClose.addEventListener('click', function() {
    statsOpen = false;
    statsPopup.classList.remove('open');
});

// ============================================================
// 13. 实验功能
// ============================================================
document.getElementById('experimentToggle').addEventListener('click', function() {
    alert('✨ 实验功能开发中...\n敬请期待！');
});

// ============================================================
// 14. 语言切换
// ============================================================
document.getElementById('langToggle').addEventListener('click', function() {
    const nextLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
    applyLanguage(nextLang);
    if (notifOpen) {
        const t = translations[currentLang];
        const empty = document.querySelector('#notifPopup div:last-child');
        if (empty) empty.textContent = '— ' + t.notifEmpty + ' —';
    }
    if (statsOpen) {
        const t = translations[currentLang];
        const footer = document.querySelector('#statsPopup div:last-child');
        if (footer) footer.textContent = t.statsUpdate;
        const statsItems = document.querySelectorAll('.stats-item');
        const keys = ['statsArticles', 'statsProducts', 'statsLogs', 'statsVisits'];
        statsItems.forEach((el, i) => {
            if (i < keys.length) {
                const label = t[keys[i]];
                const value = el.querySelector('strong')?.textContent || '';
                el.innerHTML = label + '：<strong>' + value + '</strong>';
            }
        });
    }
});

// ============================================================
// 15. 登录按钮
// ============================================================
document.getElementById('loginBtn').addEventListener('click', function() {
    alert(translations[currentLang].loginAlert);
});

// ============================================================
// 16. 浮动导航
// ============================================================
document.getElementById('goTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.getElementById('goBottom').addEventListener('click', () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
});

// ============================================================
// 17. 联系方式弹出
// ============================================================
const contactToggle = document.getElementById('contactToggle');
const contactPopup = document.getElementById('contactPopup');
const popupClose = document.getElementById('popupClose');
let popupOpen = false;

contactToggle.addEventListener('click', function(e) {
    e.stopPropagation();
    popupOpen = !popupOpen;
    contactPopup.classList.toggle('open', popupOpen);
    if (popupOpen) {
        notifPopup.classList.remove('open');
        statsPopup.classList.remove('open');
        notifOpen = false;
        statsOpen = false;
    }
});

popupClose.addEventListener('click', function() {
    popupOpen = false;
    contactPopup.classList.remove('open');
});

document.addEventListener('click', function(e) {
    if (popupOpen && !contactPopup.contains(e.target) && e.target !== contactToggle) {
        popupOpen = false;
        contactPopup.classList.remove('open');
    }
    if (notifOpen && !notifPopup.contains(e.target) && e.target !== notifToggle) {
        notifOpen = false;
        notifPopup.classList.remove('open');
    }
    if (statsOpen && !statsPopup.contains(e.target) && e.target !== statsToggle) {
        statsOpen = false;
        statsPopup.classList.remove('open');
    }
});

// ============================================================
// 18. 顶栏滚动阴影