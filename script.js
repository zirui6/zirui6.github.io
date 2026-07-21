// ============================================================
// script.js - 核心交互（轮播、深色模式、设置、浮动导航等）
// 数据在 data.js 中管理
// ============================================================

// ============================================================
// 1. 多语言词库
// ============================================================
var translations = {
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
        loginAlert: '登录功能开发中，后续将对接用户认证系统。',
        allLoaded: '已全部加载',
        pluginTitle: '插件中心',
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
        loginAlert: 'Login feature coming soon. Will integrate with user authentication system.',
        allLoaded: 'All Loaded',
        pluginTitle: 'Plugins',
    }
};

var currentLang = 'zh-CN';

// ============================================================
// 2. 轮播渲染函数（从 data.js 读取数据）
// ============================================================
function renderCarousel(data) {
    var track = document.getElementById('carouselTrack');
    if (!track) return;

    track.innerHTML = data.map(function(item) {
        return [
            '<div class="carousel-slide" style="background-image: url(',
            "'" + item.image + "',",
            'background-size: cover; background-position: center; background-repeat: no-repeat;">',
            '<span class="slide-badge">' + item.badge + '</span>',
            '<h2>' + item.title + '</h2>',
            '<p>' + item.desc + '</p>',
            '<a href="' + item.link + '" class="btn-detail">查看详情 →</a>',
            '</div>'
        ].join('');
    }).join('');
}

// ============================================================
// 3. 渲染函数（日志、产品、文章）
// ============================================================
function renderLogs(data, containerId, initialCount) {
    var container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = data.map(function(item, idx) {
        var hiddenClass = idx >= initialCount ? 'hidden' : '';
        return [
            '<div class="log-item ' + hiddenClass + '" data-index="' + idx + '">',
            '<div class="log-meta">',
            '<span>' + item.date + '</span>',
            '<span>' + item.author + '</span>',
            '<span class="tag">' + item.tag + '</span>',
            '</div>',
            '<div class="log-title"><span class="prefix">›</span> ' + item.title + '</div>',
            '</div>'
        ].join('');
    }).join('');
}

function renderProducts(data, containerId, initialCount) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(function(item, idx) {
        var hiddenClass = idx >= initialCount ? 'hidden' : '';
        var imgContent = item.img;

        // 判断是图片链接还是 emoji
        if (item.img && typeof item.img === 'string' && (item.img.startsWith('http') || item.img.startsWith('/'))) {
            imgContent = '<img src="' + item.img + '" alt="' + item.name + '" loading="lazy" />';
        }

        return [
            '<div class="product-card ' + hiddenClass + '" data-index="' + idx + '">',
            '<div class="img-wrap">' + imgContent + '</div>',
            '<div class="info">',
            '<div class="name">' + item.name + '</div>',
            '<div class="desc">' + item.desc + '</div>',
            '<div class="actions">',
            '<a href="' + (item.viewUrl || '#') + '" target="_blank" class="view-btn">查看详情</a>',
            '<a href="' + (item.downloadUrl || '#') + '" target="_blank" class="download-btn">下载</a>',
            '</div>',
            '</div>',
            '</div>'
        ].join('');
    }).join('');
}

function renderArticles(data, containerId, initialCount) {
    var container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = data.map(function(item, idx) {
        var hiddenClass = idx >= initialCount ? 'hidden' : '';
        var url = item.url || '#';
        return [
            '<div class="article-item ' + hiddenClass + '" data-index="' + idx + '" data-url="' + url + '">',
            '<div class="art-meta">',
            '<span>' + item.date + '</span>',
            '<span>' + item.author + '</span>',
            '<span class="art-tag">' + item.tag + '</span>',
            '</div>',
            '<div class="art-title">' + item.title + '</div>',
            '<div class="art-sub">' + item.sub + '</div>',
            '</div>'
        ].join('');
    }).join('');

    container.querySelectorAll('.article-item').forEach(function(el) {
        var url = el.getAttribute('data-url');
        el.addEventListener('click', function() {
            if (url && url !== '#') {
                window.open(url, '_blank');
            }
        });
    });
}

// ============================================================
// 4. 分页逻辑
// ============================================================
var PAGE_SIZE = { logs: 5, products: 8, articles: 8 };
var currentPage = { logs: 1, products: 1, articles: 1 };
var totalCount = {
    logs: logData ? logData.length : 0,
    products: productData ? productData.length : 0,
    articles: articleData ? articleData.length : 0
};

function getVisibleCount(type) {
    return Math.min(currentPage[type] * PAGE_SIZE[type], totalCount[type]);
}

function updateVisibility(type, containerSelector, itemSelector) {
    var container = document.querySelector(containerSelector);
    if (!container) return;
    var items = container.querySelectorAll(itemSelector);
    var visible = getVisibleCount(type);

    items.forEach(function(el, idx) {
        if (idx >= visible) {
            el.classList.add('hidden');
        } else {
            el.classList.remove('hidden');
        }
    });

    var btn = document.querySelector('.more-btn[data-target="' + type + '"]');
    if (btn) {
        var span = btn.querySelector('span');
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

    var map = {
        logs: { container: '#logContainer', item: '.log-item' },
        products: { container: '#productGrid', item: '.product-card' },
        articles: { container: '#articleContainer', item: '.article-item' }
    };
    var entry = map[type];
    updateVisibility(type, entry.container, entry.item);
}

// ============================================================
// 5. 多语言切换
// ============================================================
function applyLanguage(lang) {
    currentLang = lang;
    var t = translations[lang];

    document.querySelectorAll('[data-key]').forEach(function(el) {
        var key = el.getAttribute('data-key');
        if (t[key]) el.textContent = t[key];
    });

    var loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.textContent = t.loginBtn;

    var label = document.querySelector('.settings-bar .label');
    if (label) label.textContent = t.settingsLabel;

    var themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.textContent = t.themeLabel;

    var notifToggle = document.getElementById('notifToggle');
    if (notifToggle) notifToggle.textContent = t.notifLabel;

    var langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = t.langLabel + ' / ' + (lang === 'zh-CN' ? '简体' : 'English');
    }

    var statsToggle = document.getElementById('statsToggle');
    if (statsToggle) statsToggle.textContent = t.statsLabel;

    var experimentToggle = document.getElementById('experimentToggle');
    if (experimentToggle) experimentToggle.textContent = t.experimentLabel;

    document.querySelectorAll('.more-btn').forEach(function(btn) {
        var span = btn.querySelector('span');
        if (span) {
            var type = btn.getAttribute('data-target');
            var visible = getVisibleCount(type);
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

    var contactPopupTitle = document.querySelector('#contactPopup .popup-title');
    if (contactPopupTitle) contactPopupTitle.textContent = t.contactPopupTitle;

    var notifPopupTitle = document.querySelector('#notifPopup .popup-title');
    if (notifPopupTitle) notifPopupTitle.textContent = t.notifPopupTitle;

    var statsPopupTitle = document.querySelector('#statsPopup .popup-title');
    if (statsPopupTitle) statsPopupTitle.textContent = t.statsPopupTitle;

    var pluginPopupTitle = document.querySelector('#pluginPopup .popup-title');
    if (pluginPopupTitle) pluginPopupTitle.textContent = t.pluginTitle;

    var notifEmpty = document.querySelector('#notifPopup div:last-child');
    if (notifEmpty) notifEmpty.textContent = t.notifEmpty;

    var statsItems = document.querySelectorAll('.stats-item');
    var keys = ['statsArticles', 'statsProducts', 'statsLogs', 'statsVisits'];
    statsItems.forEach(function(el, i) {
        if (i < keys.length) {
            var label = t[keys[i]];
            var value = el.querySelector('strong') ? el.querySelector('strong').textContent : '';
            el.innerHTML = label + '：<strong>' + value + '</strong>';
        }
    });

    var statsFooter = document.querySelector('#statsPopup div:last-child');
    if (statsFooter) statsFooter.textContent = t.statsUpdate;

    localStorage.setItem('preferredLang', lang);
}

// ============================================================
// 6. 轮播控制
// ============================================================
function initCarouselControls() {
    var track = document.getElementById('carouselTrack');
    var dots = document.getElementById('carouselDots');
    if (!track || !dots) return;

    var slides = track.querySelectorAll('.carousel-slide');
    var totalSlides = slides.length;
    if (totalSlides === 0) return;

    var currentSlide = 0;

    // 清空并重新创建指示点
    dots.innerHTML = '';
    for (var i = 0; i < totalSlides; i++) {
        var dot = document.createElement('span');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.setAttribute('data-index', i);
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.getAttribute('data-index')));
        });
        dots.appendChild(dot);
    }

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        var allDots = dots.querySelectorAll('.dot');
        allDots.forEach(function(d, i) {
            d.classList.toggle('active', i === index);
        });
        resetAutoSlide();
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % totalSlides);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
    }

    var nextBtn = document.getElementById('carouselNext');
    var prevBtn = document.getElementById('carouselPrev');
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);

    var autoTimer = setInterval(nextSlide, 5000);

    function resetAutoSlide() {
        clearInterval(autoTimer);
        autoTimer = setInterval(nextSlide, 5000);
    }
}

// ============================================================
// 7. 初始化
// ============================================================
// 渲染轮播
if (typeof carouselData !== 'undefined' && carouselData && carouselData.length > 0) {
    renderCarousel(carouselData);
    initCarouselControls();
} else {
    console.warn('carouselData 未定义或为空，轮播跳过');
}

// 渲染日志、产品、文章
if (typeof logData !== 'undefined') {
    renderLogs(logData, 'logContainer', PAGE_SIZE.logs);
}
if (typeof productData !== 'undefined') {
    renderProducts(productData, 'productGrid', PAGE_SIZE.products);
}
if (typeof articleData !== 'undefined') {
    renderArticles(articleData, 'articleContainer', PAGE_SIZE.articles);
}

// 应用语言
var savedLang = localStorage.getItem('preferredLang') || 'zh-CN';
applyLanguage(savedLang);

// 更新可见性
if (typeof logData !== 'undefined') {
    updateVisibility('logs', '#logContainer', '.log-item');
}
if (typeof productData !== 'undefined') {
    updateVisibility('products', '#productGrid', '.product-card');
}
if (typeof articleData !== 'undefined') {
    updateVisibility('articles', '#articleContainer', '.article-item');
}

// ============================================================
// 8. 事件绑定：更多按钮
// ============================================================
document.querySelectorAll('.more-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        loadMore(this.getAttribute('data-target'));
    });
});

// ============================================================
// 9. 设置栏切换
// ============================================================
var settingsToggle = document.getElementById('settingsToggle');
var settingsBar = document.getElementById('settingsBar');

if (settingsToggle && settingsBar) {
    settingsToggle.addEventListener('click', function() {
        settingsBar.classList.toggle('open');
        if (settingsBar.classList.contains('open')) {
            this.style.transform = 'rotate(90deg)';
        } else {
            this.style.transform = 'rotate(0deg)';
        }
    });
}

// ============================================================
// 10. 深色模式
// ============================================================
var themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

var savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// ============================================================
// 11. 通知
// ============================================================
var notifToggle = document.getElementById('notifToggle');
var notifPopup = document.getElementById('notifPopup');
var notifClose = document.getElementById('notifClose');
var notifOpen = false;

if (notifToggle && notifPopup) {
    notifToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        notifOpen = !notifOpen;
        if (notifOpen) {
            notifPopup.classList.add('open');
            closeOtherPopups('notif');
        } else {
            notifPopup.classList.remove('open');
        }
    });
}

if (notifClose) {
    notifClose.addEventListener('click', function() {
        notifOpen = false;
        notifPopup.classList.remove('open');
    });
}

// ============================================================
// 12. 数据统计
// ============================================================
var statsToggle = document.getElementById('statsToggle');
var statsPopup = document.getElementById('statsPopup');
var statsClose = document.getElementById('statsClose');
var statsOpen = false;

var visitCount = parseInt(sessionStorage.getItem('visitCount') || '0');
visitCount += 1;
sessionStorage.setItem('visitCount', visitCount);
var visitCountEl = document.getElementById('visitCount');
if (visitCountEl) visitCountEl.textContent = visitCount;

if (statsToggle && statsPopup) {
    statsToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        statsOpen = !statsOpen;
        if (statsOpen) {
            statsPopup.classList.add('open');
            closeOtherPopups('stats');

            var t = translations[currentLang];
            var strongs = document.querySelectorAll('.stats-item strong');
            if (strongs.length >= 4) {
                if (typeof articleData !== 'undefined') strongs[0].textContent = articleData.length;
                if (typeof productData !== 'undefined') strongs[1].textContent = productData.length;
                if (typeof logData !== 'undefined') strongs[2].textContent = logData.length;
            }
            if (visitCountEl) visitCountEl.textContent = visitCount;

            var statsItems = document.querySelectorAll('.stats-item');
            var keys = ['statsArticles', 'statsProducts', 'statsLogs', 'statsVisits'];
            statsItems.forEach(function(el, i) {
                if (i < keys.length) {
                    var label = t[keys[i]];
                    var value = el.querySelector('strong') ? el.querySelector('strong').textContent : '';
                    el.innerHTML = label + '：<strong>' + value + '</strong>';
                }
            });

            var footer = document.querySelector('#statsPopup div:last-child');
            if (footer) footer.textContent = t.statsUpdate;
        } else {
            statsPopup.classList.remove('open');
        }
    });
}

if (statsClose) {
    statsClose.addEventListener('click', function() {
        statsOpen = false;
        statsPopup.classList.remove('open');
    });
}

// ============================================================
// 13. 实验功能
// ============================================================
var experimentToggle = document.getElementById('experimentToggle');
if (experimentToggle) {
    experimentToggle.addEventListener('click', function() {
        alert('实验功能开发中，敬请期待！');
    });
}

// ============================================================
// 14. 语言切换
// ============================================================
var langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', function() {
        var nextLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
        applyLanguage(nextLang);

        if (notifOpen) {
            var t = translations[currentLang];
            var empty = document.querySelector('#notifPopup div:last-child');
            if (empty) empty.textContent = t.notifEmpty;
        }

        if (statsOpen) {
            var t = translations[currentLang];
            var footer = document.querySelector('#statsPopup div:last-child');
            if (footer) footer.textContent = t.statsUpdate;
            var statsItems = document.querySelectorAll('.stats-item');
            var keys = ['statsArticles', 'statsProducts', 'statsLogs', 'statsVisits'];
            statsItems.forEach(function(el, i) {
                if (i < keys.length) {
                    var label = t[keys[i]];
                    var value = el.querySelector('strong') ? el.querySelector('strong').textContent : '';
                    el.innerHTML = label + '：<strong>' + value + '</strong>';
                }
            });
        }

        if (pluginOpen) {
            var t = translations[currentLang];
            var title = document.querySelector('#pluginPopup .popup-title');
            if (title) title.textContent = t.pluginTitle;
        }
    });
}

// ============================================================
// 15. 登录按钮
// ============================================================
var loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        alert(translations[currentLang].loginAlert);
    });
}

// ============================================================
// 16. 浮动导航 - 回到顶部 / 跳转底部
// ============================================================
var goTopBtn = document.getElementById('goTop');
var goBottomBtn = document.getElementById('goBottom');

function updateNavButtons() {
    var scrollY = window.scrollY;
    var windowHeight = window.innerHeight;
    var documentHeight = document.documentElement.scrollHeight;

    if (goTopBtn) {
        if (scrollY > 100) {
            goTopBtn.classList.remove('hidden');
        } else {
            goTopBtn.classList.add('hidden');
        }
    }

    if (goBottomBtn) {
        if (scrollY + windowHeight < documentHeight - 200) {
            goBottomBtn.classList.remove('hidden');
        } else {
            goBottomBtn.classList.add('hidden');
        }
    }
}

if (goTopBtn) {
    goTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

if (goBottomBtn) {
    goBottomBtn.addEventListener('click', function() {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
    });
}

window.addEventListener('scroll', updateNavButtons, { passive: true });
window.addEventListener('resize', updateNavButtons, { passive: true });
setTimeout(updateNavButtons, 100);

// ============================================================
// 17. 插件按钮弹出
// ============================================================
var pluginToggle = document.getElementById('pluginToggle');
var pluginPopup = document.getElementById('pluginPopup');
var pluginClose = document.getElementById('pluginClose');
var pluginOpen = false;

if (pluginToggle && pluginPopup) {
    pluginToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        pluginOpen = !pluginOpen;
        if (pluginOpen) {
            pluginPopup.classList.add('open');
            closeOtherPopups('plugin');
        } else {
            pluginPopup.classList.remove('open');
        }
    });
}

if (pluginClose) {
    pluginClose.addEventListener('click', function() {
        pluginOpen = false;
        pluginPopup.classList.remove('open');
    });
}

// ============================================================
// 18. 联系方式弹出
// ============================================================
var contactToggle = document.getElementById('contactToggle');
var contactPopup = document.getElementById('contactPopup');
var popupClose = document.getElementById('popupClose');
var popupOpen = false;

if (contactToggle && contactPopup) {
    contactToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        popupOpen = !popupOpen;
        if (popupOpen) {
            contactPopup.classList.add('open');
            closeOtherPopups('contact');
        } else {
            contactPopup.classList.remove('open');
        }
    });
}

if (popupClose) {
    popupClose.addEventListener('click', function() {
        popupOpen = false;
        contactPopup.classList.remove('open');
    });
}

// ============================================================
// 19. 关闭其他弹出框辅助函数
// ============================================================
function closeOtherPopups(keep) {
    var allPopups = [
        { name: 'contact', el: contactPopup, openVar: 'popupOpen' },
        { name: 'notif', el: notifPopup, openVar: 'notifOpen' },
        { name: 'stats', el: statsPopup, openVar: 'statsOpen' },
        { name: 'plugin', el: pluginPopup, openVar: 'pluginOpen' }
    ];

    allPopups.forEach(function(p) {
        if (p.name !== keep && p.el) {
            p.el.classList.remove('open');
            // 更新对应的变量
            if (p.name === 'contact') popupOpen = false;
            if (p.name === 'notif') notifOpen = false;
            if (p.name === 'stats') statsOpen = false;
            if (p.name === 'plugin') pluginOpen = false;
        }
    });
}

// ============================================================
// 20. 点击外部关闭弹出框
// ============================================================
document.addEventListener('click', function(e) {
    if (popupOpen && contactPopup && !contactPopup.contains(e.target) && e.target !== contactToggle) {
        popupOpen = false;
        contactPopup.classList.remove('open');
    }
    if (notifOpen && notifPopup && !notifPopup.contains(e.target) && e.target !== notifToggle) {
        notifOpen = false;
        notifPopup.classList.remove('open');
    }
    if (statsOpen && statsPopup && !statsPopup.contains(e.target) && e.target !== statsToggle) {
        statsOpen = false;
        statsPopup.classList.remove('open');
    }
    if (pluginOpen && pluginPopup && !pluginPopup.contains(e.target) && e.target !== pluginToggle) {
        pluginOpen = false;
        pluginPopup.classList.remove('open');
    }
});

// ============================================================
// 21. 顶栏滚动阴影
// ============================================================
var topbar = document.getElementById('topbar');
window.addEventListener('scroll', function() {
    if (topbar) {
        if (window.scrollY > 20) {
            topbar.classList.add('scrolled');
        } else {
            topbar.classList.remove('scrolled');
        }
    }
}, { passive: true });

// ============================================================
// 22. 导航平滑滚动
// ============================================================
document.querySelectorAll('.nav-func a').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================================
// 23. 控制台欢迎
// ============================================================
console.log('梓睿官网 v1.3.0 - 直角全宽主题');
console.log('深色模式 | 通知 | 双语切换 | 数据统计 | 插件中心');
console.log('数据文件: data.js - 更新内容只需修改该文件');

// ============================================================
// 大胶囊点击事件（AI + 网盘 + 联系 + 上下翻页）
// ============================================================

// 所有大胶囊的展开/收起逻辑
document.querySelectorAll('.big-capsule').forEach(function(capsule) {
    capsule.addEventListener('click', function(e) {
        e.stopPropagation();
        // 如果已经展开，执行对应操作
        if (this.classList.contains('expanded')) {
            var id = this.id;
            switch (id) {
                case 'aiEntry':
                    alert('🤖 AI 智能助手功能开发中...');
                    break;
                case 'driveEntry':
                    alert('📁 我的网盘功能开发中...');
                    break;
                case 'goTopCapsule':
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    // 滚动后自动收起
                    setTimeout(function() { capsule.classList.remove('expanded'); }, 500);
                    break;
                case 'goBottomCapsule':
                    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                    setTimeout(function() { capsule.classList.remove('expanded'); }, 500);
                    break;
                case 'contactCapsule':
                    var popup = document.getElementById('contactPopup');
                    if (popup) {
                        popup.classList.toggle('open');
                        // 关闭其他弹出框
                        closeOtherPopups('contact');
                    }
                    break;
                default:
                    break;
            }
            return;
        }
        // 否则展开
        this.classList.add('expanded');
    });
});

// 点击页面其他地方，收起所有展开的胶囊
document.addEventListener('click', function(e) {
    if (!e.target.closest('.big-capsule')) {
        document.querySelectorAll('.big-capsule.expanded').forEach(function(c) {
            c.classList.remove('expanded');
        });
    }
});

// 滚动时自动收起上下翻页胶囊（如果展开）
var scrollTimeout2;
window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout2);
    scrollTimeout2 = setTimeout(function() {
        document.querySelectorAll('#goTopCapsule.expanded, #goBottomCapsule.expanded').forEach(function(c) {
            c.classList.remove('expanded');
        });
    }, 300);
}, { passive: true });