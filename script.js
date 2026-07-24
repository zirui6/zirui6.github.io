// ============================================================
// script.js - 加载动画 + Airtable 数据源
// ============================================================

// ============================================================
// 0. Airtable 配置
// ============================================================
var AIRTABLE_TOKEN = 'patdZcEB92LMLW3bQ.44a613d94083deff3df9f4fda69a7b7a6c851c56faf900b16c72c6ddff7021ea';
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
// 0.1 显示/隐藏加载动画
// ============================================================
function showLoading() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        overlay.style.opacity = '1';
    }
}

function hideLoading() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 400);
    }
}

function updateLoadingStatus(text) {
    var el = document.getElementById('loadingStatus');
    if (el) el.textContent = text;
}

// ============================================================
// 0.2 Airtable 请求函数
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
    });
}

// ============================================================
// 0.3 加载数据（失败跳转 404.html）
// ============================================================
function loadAllData() {
    console.log('🔄 正在加载数据...');
    showLoading();
    updateLoadingStatus('正在连接服务器...');
    
    var startTime = Date.now();
    
    // 先尝试 Airtable
    Promise.all([
        fetchAirtable(TABLE_LOGS),
        fetchAirtable(TABLE_PRODUCTS),
        fetchAirtable(TABLE_ARTICLES),
        fetchAirtable(TABLE_CAROUSEL)
    ])
    .then(function(results) {
        var airtableTime = Date.now() - startTime;
        var hasData = results.some(function(r) { return r && r.length > 0; });
        
        if (hasData) {
            logData = results[0] || [];
            productData = results[1] || [];
            articleData = results[2] || [];
            carouselData = results[3] || [];
            
            console.log('✅ Airtable 数据加载完成');
            console.log('📰 动态:', logData.length, '条');
            console.log('📦 产品:', productData.length, '条');
            console.log('📖 文章:', articleData.length, '条');
            console.log('🔄 轮播:', carouselData.length, '条');
            console.log('⏱ 响应时间:', airtableTime, 'ms');
            
            hideLoading();
            initApp();
        } else {
            // Airtable 返回空数据 → 跳转 404
            console.warn('Airtable 数据为空');
            var airtableTime2 = Date.now() - startTime;
            window.location.href = '404.html?airtable=❌ 数据为空&airtableTime=' + airtableTime2 + 'ms';
        }
    })
    .catch(function(error) {
        console.error('❌ Airtable 连接失败:', error);
        var failTime = Date.now() - startTime;
        // 跳转到 404.html 并显示两个服务器的状态
        window.location.href = '404.html?airtable=❌ 连接失败&airtableTime=' + failTime + 'ms';
    });
}

// ============================================================
// 0.4 错误状态显示
// ============================================================
function showErrorState(title, message) {
    // 清空所有内容区域
    var containers = ['logContainer', 'productGrid', 'articleContainer'];
    containers.forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });
    
    // 轮播显示错误
    var track = document.getElementById('carouselTrack');
    if (track) {
        track.innerHTML = '<div class="carousel-slide" style="padding:56px 64px;min-height:400px;background:#1a4b8c;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;">' +
            '<div style="font-size:48px;">🔴</div>' +
            '<div style="font-size:22px;font-weight:700;">' + title + '</div>' +
            '<div style="font-size:15px;color:rgba(255,255,255,0.7);">' + message + '</div>' +
            '<button onclick="location.reload()" style="margin-top:16px;padding:10px 32px;background:#fff;color:#1a4b8c;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;">重新加载</button>' +
            '</div>';
    }
    
    // 日志区域显示错误
    var logContainer = document.getElementById('logContainer');
    if (logContainer) {
        logContainer.innerHTML = '<div style="padding:40px;text-align:center;color:#cf222e;font-size:16px;">❌ ' + title + '<br><span style="font-size:14px;color:#8b949e;">' + message + '</span></div>';
    }
    
    console.log('✅ 错误状态已显示');
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
        track.innerHTML = '<div class="carousel-slide" style="padding:56px 64px;min-height:400px;background:#1a4b8c;color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;">📭 暂无轮播数据</div>';
        return;
    }
    // 按排序字段排序
    var sortedData = data.slice().sort(function(a, b) {
        return (a['排序'] || 0) - (b['排序'] || 0);
    });
    track.innerHTML = sortedData.map(function(item) {
        var badge = item['标签'] || '';
        var title = item['标题'] || '';
        var desc = item['描述'] || '';
        var image = item['图片链接'] || '';
        var link = item['链接'] || '#';
        var imgStyle = image && typeof image === 'string' && image.startsWith('http')
            ? 'background-image: url(' + image + '); background-size: cover; background-position: center; background-repeat: no-repeat;'
            : 'background: linear-gradient(135deg, #1a4b8c, #2c6ba8);';
        return [
            '<div class="carousel-slide" style="' + imgStyle + 'padding:56px 64px;min-height:600px;display:flex;flex-direction:column;justify-content:center;gap:8px;">',
            '<span class="slide-badge" style="margin-bottom:4px;">' + badge + '</span>',
            '<h2 style="font-size:38px;font-weight:800;color:#0b1a2e;letter-spacing:-0.5px;line-height:1.2;max-width:680px;margin-bottom:4px;">' + title + '</h2>',
            '<p style="font-size:17px;color:#2c3e5a;max-width:500px;line-height:1.6;margin-top:0;margin-bottom:6px;">' + desc + '</p>',
            '<a href="' + link + '" class="btn-detail" style="margin-top:4px;display:inline-flex;align-items:center;gap:8px;padding:12px 32px;background:linear-gradient(135deg,#1a4b8c,#2c6ba8);color:#fff;font-size:15px;font-weight:600;width:fit-content;border-radius:8px;text-decoration:none;transition:all 0.3s;">查看详情 →</a>',
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
        // 👇 改成中文字段名
        var date = item['日期'] || '';
        var author = item['作者'] || '';
        var tag = item['标签'] || '';
        var title = item['标题'] || '';
        var sub = item['摘要'] || '';
        return [
            '<div class="log-item ' + hiddenClass + '" data-index="' + idx + '">',
            '<div class="log-meta">',
            '<span>' + date + '</span>',
            '<span>' + author + '</span>',
            '<span class="tag">' + tag + '</span>',
            '</div>',
            '<div class="log-title"><span class="prefix">›</span> ' + title + '</div>',
            (sub ? '<div style="font-size:14px;color:#57606a;padding-left:24px;">' + sub + '</div>' : ''),
            '</div>'
        ].join('');
    }).join('');
}

function renderProducts(data, containerId, initialCount) {
    var container = document.getElementById(containerId);
    if (!container) return;
    if (!data || data.length === 0) {
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#8b949e;">📭 暂无产品</div>';
        return;
    }
    container.innerHTML = data.map(function(item, idx) {
        var hiddenClass = idx >= initialCount ? 'hidden' : '';
        // 👇 改成中文字段名
        var name = item['名称'] || '';
        var desc = item['描述'] || '';
        var img = item['图片网址'] || '';
        var viewUrl = item['查看链接'] || '#';
        var downloadUrl = item['下载链接'] || '#';
        var imgContent = img && typeof img === 'string' && (img.startsWith('http') || img.startsWith('/'))
            ? '<img src="' + img + '" alt="' + name + '" loading="lazy" />'
            : (img || '📦');
        return [
            '<div class="product-card ' + hiddenClass + '" data-index="' + idx + '">',
            '<div class="img-wrap">' + imgContent + '</div>',
            '<div class="info">',
            '<div class="name">' + name + '</div>',
            '<div class="desc">' + desc + '</div>',
            '<div class="actions">',
            '<a href="' + viewUrl + '" target="_blank" class="view-btn">查看详情</a>',
            '<a href="' + downloadUrl + '" target="_blank" class="download-btn">下载</a>',
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
        container.innerHTML = '<div style="padding:40px;text-align:center;color:#8b949e;">📭 暂无文章</div>';
        return;
    }
    container.innerHTML = data.map(function(item, idx) {
        var hiddenClass = idx >= initialCount ? 'hidden' : '';
        var date = item['日期'] || '';
        var author = item['作者'] || '';
        var tag = item['标签'] || '';
        var title = item['标题'] || '';
        var sub = item['摘要'] || '';
        var url = item['URL'] || '#';
        return [
            '<div class="article-item ' + hiddenClass + '" data-index="' + idx + '" data-url="' + url + '">',
            '<div class="art-meta">',
            '<span>' + date + '</span>',
            '<span>' + author + '</span>',
            '<span class="art-tag">' + tag + '</span>',
            '</div>',
            '<div class="art-title">' + title + '</div>',
            '<div class="art-sub">' + sub + '</div>',
            '</div>'
        ].join('');
    }).join('');
    container.querySelectorAll('.article-item').forEach(function(el) {
        var url = el.getAttribute('data-url');
        el.addEventListener('click', function() {
            if (url && url !== '#') window.open(url, '_blank');
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
    // ⚠️ 关键：先更新 totalCount
    totalCount.logs = logData.length;
    totalCount.products = productData.length;
    totalCount.articles = articleData.length;

    // 然后渲染
    renderLogs(logData, 'logContainer', PAGE_SIZE.logs);
    renderLogs(logData, 'logContainer');  // 去掉 initialCount 参数
    renderProducts(productData, 'productGrid', PAGE_SIZE.products);
    renderArticles(articleData, 'articleContainer', PAGE_SIZE.articles);
    renderCarousel(carouselData);

    // 最后更新可见性
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

// 深色模式（默认深色）
var themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    // 更新按钮文字
    if (themeToggle) {
        var isDark = theme === 'dark';
        var label = isDark ? '☀️ 浅色模式' : '🌙 深色模式';
        themeToggle.innerHTML = label;
    }
}

// 默认深色
var savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        applyTheme(current === 'dark' ? 'light' : 'dark');
    });
}

// ============================================================
// 8. 大胶囊点击事件
// ============================================================
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
                alert('AI 助手功能开发中...');
            } else if (id === 'driveEntry') {
                alert('我的网盘功能开发中...');
            }
            return;
        }
        this.classList.add('expanded');
    });
});

document.addEventListener('click', function(e) {
    if (!e.target.closest('.big-capsule')) {
        document.querySelectorAll('.big-capsule.expanded').forEach(function(c) {
            c.classList.remove('expanded');
        });
    }
});

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

var topbar = document.getElementById('topbar');
window.addEventListener('scroll', function() {
    if (topbar) {
        topbar.classList.toggle('scrolled', window.scrollY > 20);
    }
}, { passive: true });

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
// 9. 启动应用
// ============================================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAllData);
} else {
    loadAllData();
}

console.log('梓睿官网 v1.5.0 - 加载动画');
console.log('数据来源: Airtable');