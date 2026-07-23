// ============================================================
// script.js - 核心交互（从 Airtable 加载数据）
// ============================================================

// ============================================================
// 0. Airtable 配置
// ============================================================
var AIRTABLE_TOKEN = 'patL3fbalVoN1424L.ea0d2daca60c07f611ac70eb0da0d95ccbc37a1f53c7552f568c79b890e93c53';
var AIRTABLE_BASE_ID = 'app9G6YeDcFq7g09r';

var TABLE_LOGS = '动态';
var TABLE_PRODUCTS = '产品';
var TABLE_ARTICLES = '文章';
var TABLE_CAROUSEL = '轮播';

// 全局数据变量
var logData = [];
var productData = [];
var articleData = [];
var carouselData = [];

// ============================================================
// 0.1 Airtable 请求函数
// ============================================================
function fetchAirtable(tableName) {
    var url = 'https://api.airtable.com/v0/' + AIRTABLE_BASE_ID + '/' + encodeURIComponent(tableName);
    return fetch(url, {
        headers: {
            'Authorization': 'Bearer ' + AIRTABLE_TOKEN
        }
    })
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Airtable 请求失败: ' + response.status);
        }
        return response.json();
    })
    .then(function(data) {
        return data.records.map(function(record) {
            var fields = record.fields;
            var result = {};
            for (var key in fields) {
                var val = fields[key];
                if (Array.isArray(val) && val.length === 1 && typeof val[0] === 'string') {
                    result[key] = val[0];
                } else if (Array.isArray(val) && val.length > 1 && typeof val[0] === 'string') {
                    result[key] = val.join(', ');
                } else if (Array.isArray(val) && val.length === 1 && typeof val[0] === 'object' && val[0].url) {
                    result[key] = val[0].url;
                } else {
                    result[key] = val;
                }
            }
            return result;
        });
    })
    .catch(function(error) {
        console.warn('加载 ' + tableName + ' 失败:', error);
        return [];
    });
}

// ============================================================
// 0.2 加载数据（备用数据优先，确保页面不空）
// ============================================================
function loadAllData() {
    console.log('🔄 正在加载数据...');
    
    // 1. 先用备用数据填充（保证页面不空）
    logData = getFallbackLogs();
    productData = getFallbackProducts();
    articleData = getFallbackArticles();
    carouselData = getFallbackCarousel();
    
    // 2. 立即渲染（显示备用数据）
    initApp();
    
    // 3. 然后尝试从 Airtable 加载
    Promise.all([
        fetchAirtable(TABLE_LOGS),
        fetchAirtable(TABLE_PRODUCTS),
        fetchAirtable(TABLE_ARTICLES),
        fetchAirtable(TABLE_CAROUSEL)
    ])
    .then(function(results) {
        // 如果 Airtable 有数据，用 Airtable 数据覆盖
        if (results[0] && results[0].length > 0) {
            logData = results[0];
            productData = results[1];
            articleData = results[2];
            carouselData = results[3];
            
            console.log('✅ Airtable 数据加载完成');
            console.log('📰 动态:', logData.length, '条');
            console.log('📦 产品:', productData.length, '条');
            console.log('📖 文章:', articleData.length, '条');
            console.log('🔄 轮播:', carouselData.length, '条');
            
            // 重新渲染
            initApp();
        } else {
            console.log('Airtable 数据为空，使用备用数据');
        }
    })
    .catch(function(error) {
        console.log('Airtable 连接失败，使用备用数据:', error);
    });
}

// ============================================================
// 0.3 备用数据（Airtable 加载失败时使用）
// ============================================================
function getFallbackLogs() {
    return [
        { date: '2026-07-23', author: 'admin', tag: '更新', title: '已接入Airtable数据源' },
        { date: '2026-07-21', author: 'admin', tag: '更新', title: 'UI适配全面升级' },
    ];
}
function getFallbackProducts() {
    return [
        { name: '品牌官网', desc: '专业级展示方案', img: '🏢', viewUrl: '#', downloadUrl: '#' },
    ];
}
function getFallbackArticles() {
    return [
        { date: '2026-07-23', author: '梓睿', tag: '更新', title: 'Airtable接入完成', sub: '数据在线管理', url: '#' },
    ];
}
function getFallbackCarousel() {
    return [
        { badge: '新品首发', title: '下一代数字体验平台', desc: '无缝连接，重新定义交互', image: 'https://picsum.photos/1920/600?random=1', link: '#' },
    ];
}

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
// 2. 渲染函数
// ============================================================
function renderCarousel(data) {
    var track = document.getElementById('carouselTrack');
    if (!track) return;
    if (!data || data.length === 0) {
        track.innerHTML = '<div class="carousel-slide" style="padding:56px 64px;min-height:400px;background:#1a4b8c;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;">暂无轮播数据，请添加</div>';
        return;
    }
    track.innerHTML = data.map(function(item) {
        var imgStyle = item.image ? 'background-image: url(' + item.image + '); background-size: cover; background-position: center; background-repeat: no-repeat;' : 'background: #1a4b8c;';
        return [
            '<div class="carousel-slide" style="' + imgStyle + 'padding:56px 64px;min-height:500px;display:flex;flex-direction:column;justify-content:center;">',
            '<span class="slide-badge">' + (item.badge || '') + '</span>',
            '<h2>' + (item.title || '') + '</h2>',
            '<p>' + (item.desc || '') + '</p>',
            '<a href="' + (item.link || '#') + '" class="btn-detail">查看详情 →</a>',
            '</div>'
        ].join('');
    }).join('');
}

function renderLogs(data, containerId, initialCount) {
    var container = document.getElementById(containerId);
    if (!container) return;
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="padding:20px;color:#8b949e;text-align:center;">暂无动态</div>';
        return;
    }
    container.innerHTML = data.map(function(item, idx) {
        var hiddenClass = idx >= initialCount ? 'hidden' : '';
        return [
            '<div class="log-item ' + hiddenClass + '" data-index="' + idx + '">',
            '<div class="log-meta">',
            '<span>' + (item.date || '') + '</span>',
            '<span>' + (item.author || '') + '</span>',
            '<span class="tag">' + (item.tag || '') + '</span>',
            '</div>',
            '<div class="log-title"><span class="prefix">›</span> ' + (item.title || '') + '</div>',
            '</div>'
        ].join('');
    }).join('');
}

function renderProducts(data, containerId, initialCount) {
    var container = document.getElementById(containerId);
    if (!container) return;
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="padding:20px;color:#8b949e;text-align:center;">暂无产品</div>';
        return;
    }
    container.innerHTML = data.map(function(item, idx) {
        var hiddenClass = idx >= initialCount ? 'hidden' : '';
        var imgContent = item.img || '';
        if (imgContent && typeof imgContent === 'string' && (imgContent.startsWith('http') || imgContent.startsWith('/'))) {
            imgContent = '<img src="' + imgContent + '" alt="' + (item.name || '') + '" loading="lazy" />';
        }
        return [
            '<div class="product-card ' + hiddenClass + '" data-index="' + idx + '">',
            '<div class="img-wrap">' + imgContent + '</div>',
            '<div class="info">',
            '<div class="name">' + (item.name || '') + '</div>',
            '<div class="desc">' + (item.desc || '') + '</div>',
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
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="padding:20px;color:#8b949e;text-align:center;">暂无文章</div>';
        return;
    }
    container.innerHTML = data.map(function(item, idx) {
        var hiddenClass = idx >= initialCount ? 'hidden' : '';
        var url = item.url || '#';
        return [
            '<div class="article-item ' + hiddenClass + '" data-index="' + idx + '" data-url="' + url + '">',
            '<div class="art-meta">',
            '<span>' + (item.date || '') + '</span>',
            '<span>' + (item.author || '') + '</span>',
            '<span class="art-tag">' + (item.tag || '') + '</span>',
            '</div>',
            '<div class="art-title">' + (item.title || '') + '</div>',
            '<div class="art-sub">' + (item.sub || '') + '</div>',
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
// 3. 分页逻辑
// ============================================================
var PAGE_SIZE = { logs: 5, products: 8, articles: 8 };
var currentPage = { logs: 1, products: 1, articles: 1 };
var totalCount = { logs: 0, products: 0, articles: 0 };

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
// 4. 初始化应用
// ============================================================
function initApp() {
    totalCount.logs = logData.length;
    totalCount.products = productData.length;
    totalCount.articles = articleData.length;

    renderLogs(logData, 'logContainer', PAGE_SIZE.logs);
    renderProducts(productData, 'productGrid', PAGE_SIZE.products);
    renderArticles(articleData, 'articleContainer', PAGE_SIZE.articles);
    renderCarousel(carouselData);

    updateVisibility('logs', '#logContainer', '.log-item');
    updateVisibility('products', '#productGrid', '.product-card');
    updateVisibility('articles', '#articleContainer', '.article-item');

    // 轮播控制
    var track = document.getElementById('carouselTrack');
    var dots = document.getElementById('carouselDots');
    if (track && dots && carouselData.length > 0) {
        initCarouselControls();
    }

    console.log('✅ 页面渲染完成');
}

// ============================================================
// 5. 轮播控制
// ============================================================
function initCarouselControls() {
    var track = document.getElementById('carouselTrack');
    var dots = document.getElementById('carouselDots');
    if (!track || !dots) return;
    var slides = track.querySelectorAll('.carousel-slide');
    var totalSlides = slides.length;
    if (totalSlides === 0) return;

    var currentSlide = 0;
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
// 6. 多语言切换
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
    if (langToggle) langToggle.textContent = t.langLabel + ' / ' + (lang === 'zh-CN' ? '简体' : 'English');
    var statsToggle = document.getElementById('statsToggle');
    if (statsToggle) statsToggle.textContent = t.statsLabel;
    var experimentToggle = document.getElementById('experimentToggle');
    if (experimentToggle) experimentToggle.textContent = t.experimentLabel;
    // 更新更多按钮
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
// 7. 事件绑定
// ============================================================
document.querySelectorAll('.more-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
        loadMore(this.getAttribute('data-target'));
    });
});

// 设置栏切换
var settingsToggle = document.getElementById('settingsToggle');
var settingsBar = document.getElementById('settingsBar');
if (settingsToggle && settingsBar) {
    settingsToggle.addEventListener('click', function() {
        settingsBar.classList.toggle('open');
        this.style.transform = settingsBar.classList.contains('open') ? 'rotate(90deg)' : 'rotate(0deg)';
    });
}

// 深色模式
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

// 通知
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

// 数据统计
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
            var t = translations[currentLang];
            var strongs = document.querySelectorAll('.stats-item strong');
            if (strongs.length >= 4) {
                strongs[0].textContent = articleData.length;
                strongs[1].textContent = productData.length;
                strongs[2].textContent = logData.length;
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

// 实验功能
var experimentToggle = document.getElementById('experimentToggle');
if (experimentToggle) {
    experimentToggle.addEventListener('click', function() {
        alert('实验功能开发中，敬请期待！');
    });
}

// 语言切换
var langToggle = document.getElementById('langToggle');
if (langToggle) {
    langToggle.addEventListener('click', function() {
        var nextLang = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
        applyLanguage(nextLang);
    });
}

// 登录按钮
var loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        alert(translations[currentLang].loginAlert);
    });
}

// 回到顶部 / 跳转底部
var goTopBtn = document.getElementById('goTop');
var goBottomBtn = document.getElementById('goBottom');
function updateNavButtons() {
    var scrollY = window.scrollY;
    var windowHeight = window.innerHeight;
    var documentHeight = document.documentElement.scrollHeight;
    if (goTopBtn) {
        goTopBtn.classList.toggle('hidden', scrollY <= 100);
    }
    if (goBottomBtn) {
        goBottomBtn.classList.toggle('hidden', scrollY + windowHeight >= documentHeight - 200);
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

// 大胶囊点击事件
document.querySelectorAll('.big-capsule').forEach(function(capsule) {
    capsule.addEventListener('click', function(e) {
        e.stopPropagation();
        if (this.classList.contains('expanded')) {
            var id = this.id;
            if (id === 'goTopCapsule') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setTimeout(function() { capsule.classList.remove('expanded'); }, 500);
            } else if (id === 'goBottomCapsule') {
                window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
                setTimeout(function() { capsule.classList.remove('expanded'); }, 500);
            } else if (id === 'contactCapsule') {
                var popup = document.getElementById('contactPopup');
                if (popup) popup.classList.toggle('open');
            } else if (id === 'aiEntry') {
                alert('AI 智能助手功能开发中...');
            } else if (id === 'driveEntry') {
                alert('我的网盘功能开发中...');
            }
            return;
        }
        this.classList.add('expanded');
    });
});

// 点击外部关闭胶囊
document.addEventListener('click', function(e) {
    if (!e.target.closest('.big-capsule')) {
        document.querySelectorAll('.big-capsule.expanded').forEach(function(c) {
            c.classList.remove('expanded');
        });
    }
});

// 点击外部关闭弹出框
document.addEventListener('click', function(e) {
    if (notifOpen && notifPopup && !notifPopup.contains(e.target) && e.target !== notifToggle) {
        notifOpen = false;
        notifPopup.classList.remove('open');
    }
    if (statsOpen && statsPopup && !statsPopup.contains(e.target) && e.target !== statsToggle) {
        statsOpen = false;
        statsPopup.classList.remove('open');
    }
    var popup = document.getElementById('contactPopup');
    if (popup && popup.classList.contains('open')) {
        var contactToggle = document.getElementById('contactToggle');
        if (!popup.contains(e.target) && e.target !== contactToggle) {
            popup.classList.remove('open');
        }
    }
});

// 顶栏滚动阴影
var topbar = document.getElementById('topbar');
window.addEventListener('scroll', function() {
    if (topbar) {
        topbar.classList.toggle('scrolled', window.scrollY > 20);
    }
}, { passive: true });

// 导航平滑滚动
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
// 8. 启动应用
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllData);
} else {
    loadAllData();
}

console.log('梓睿官网 v1.4.0 - Airtable 数据源');
console.log('数据来源: Airtable | 在线更新');