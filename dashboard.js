// ============================================================
// dashboard.js —— 仪表盘新功能（不改 script.js 原有逻辑）
// ============================================================

// ---- 两个 Airtable 令牌 ----
var READ_ONLY_TOKEN = 'patdZcEB92LMLW3bQ.44a613d94083deff3df9f4fda69a7b7a6c851c56faf900b16c72c6ddff7021ea';
var READ_ONLY_BASE = 'app9G6YeDcFq7g09r';

var WRITE_TOKEN = 'patKZBmAE100rrp5H.f27826ccf260634239b6b93a9b9bcf8221f3fbbf74e5911115ccf805dccf6314';
var WRITE_BASE = 'appFSBs4szXKsDTx9';
var COUNTDOWN_TABLE = 'tbloFWToFeaEEMnuU';

// ---- 全局 ----
var countdownData = [];

// ============================================================
// 1. Airtable 通用请求
// ============================================================
function atFetch(base, table, token) {
    var url = 'https://api.airtable.com/v0/' + base + '/' + encodeURIComponent(table);
    return fetch(url, { headers: { 'Authorization': 'Bearer ' + token } })
        .then(function(r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
        })
        .then(function(d) {
            return d.records.map(function(rec) {
                var f = rec.fields, out = { id: rec.id };
                for (var k in f) {
                    var v = f[k];
                    out[k] = (Array.isArray(v) && v.length === 1) ? v[0] : v;
                }
                return out;
            });
        });
}

// ============================================================
// 2. 日历渲染
// ============================================================
(function initCalendar() {
    var today = new Date();
    var viewYear = today.getFullYear();
    var viewMonth = today.getMonth();

    function render() {
        var title = document.getElementById('calTitle');
        var daysEl = document.getElementById('calendarDays');
        if (!title || !daysEl) return;

        title.textContent = viewYear + '年' + (viewMonth + 1) + '月';

        var firstDay = new Date(viewYear, viewMonth, 1).getDay();
        var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

        var eventDays = countdownData.map(function(d) {
            var s = String(d['日子'] || '');
            if (s.length === 8) {
                var y = +s.slice(0, 4), m = +s.slice(4, 6), dd = +s.slice(6, 8);
                if (y === viewYear && m === viewMonth + 1) return dd;
            }
            return null;
        }).filter(Boolean);

        var html = '';
        for (var i = 0; i < firstDay; i++) html += '<span class="day empty">·</span>';
        for (var d = 1; d <= daysInMonth; d++) {
            var cls = 'day';
            if (d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()) cls += ' today';
            if (eventDays.indexOf(d) !== -1) cls += ' has-event';
            html += '<span class="' + cls + '">' + d + '</span>';
        }
        daysEl.innerHTML = html;
    }

    var prevBtn = document.getElementById('calPrev');
    var nextBtn = document.getElementById('calNext');
    if (prevBtn) prevBtn.addEventListener('click', function() {
        viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } render();
    });
    if (nextBtn) nextBtn.addEventListener('click', function() {
        viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } render();
    });

    window.__renderCalendar = render;
    render();
})();

// ============================================================
// 3. 倒数日
// ============================================================
function calcDays(dateStr) {
    var s = String(dateStr || '');
    if (s.length !== 8) return null;
    var target = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
    var now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.ceil((target - now) / 86400000);
}

function isExpired(item) {
    var e = String(item['有效期'] || '');
    if (e.length !== 8) return false;
    var exp = new Date(+e.slice(0, 4), +e.slice(4, 6) - 1, +e.slice(6, 8));
    return new Date() > exp;
}

function renderCountdowns() {
    var list = document.getElementById('countdownList');
    if (!list) return;

    var active = countdownData.filter(function(d) { return !isExpired(d); });
    if (active.length === 0) {
        list.innerHTML = '<div class="countdown-empty">暂无倒数日，点上面「新建」加一个</div>';
        return;
    }
    list.innerHTML = active.map(function(item) {
        var days = calcDays(item['日子']);
        var daysText = days === null ? '日期格式错误'
            : (days > 0 ? '还有 ' + days + ' 天' : (days === 0 ? '就是今天！' : '已过去 ' + Math.abs(days) + ' 天'));
        return '<div class="countdown-item">' +
            '<div class="cd-name">' + (item['名称'] || '未命名') + '</div>' +
            '<div class="cd-days">' + daysText + '</div>' +
            '<div class="cd-meta">' + (item['创建人'] || '') + ' · ' + (item['日子'] || '') + '</div>' +
            '</div>';
    }).join('');
    if (window.__renderCalendar) window.__renderCalendar();
}

function buildFilterOptions() {
    var sel = document.getElementById('countdownFilter');
    if (!sel) return;
    var dates = {};
    countdownData.forEach(function(d) { if (d['日子']) dates[d['日子']] = true; });
    var opts = '<option value="all">全部日期</option>';
    Object.keys(dates).sort().forEach(function(dt) {
        opts += '<option value="' + dt + '">' + dt + '</option>';
    });
    sel.innerHTML = opts;
    sel.onchange = function() {
        var v = this.value;
        var list = document.getElementById('countdownList');
        if (v === 'all') { renderCountdowns(); return; }
        var filtered = countdownData.filter(function(d) { return String(d['日子']) === v && !isExpired(d); });
        if (filtered.length === 0) {
            list.innerHTML = '<div class="countdown-empty">该日期无倒数日</div>';
            return;
        }
        list.innerHTML = filtered.map(function(item) {
            var days = calcDays(item['日子']);
            var daysText = days > 0 ? '还有 ' + days + ' 天'
                : (days === 0 ? '就是今天！' : '已过去 ' + Math.abs(days) + ' 天');
            return '<div class="countdown-item">' +
                '<div class="cd-name">' + (item['名称'] || '') + '</div>' +
                '<div class="cd-days">' + daysText + '</div>' +
                '<div class="cd-meta">' + (item['创建人'] || '') + '</div>' +
                '</div>';
        }).join('');
    };
}

function loadCountdowns() {
    atFetch(WRITE_BASE, COUNTDOWN_TABLE, WRITE_TOKEN)
        .then(function(data) {
            countdownData = data;
            renderCountdowns();
            buildFilterOptions();
        })
        .catch(function(err) {
            console.error('倒数日加载失败:', err);
            var list = document.getElementById('countdownList');
            if (list) list.innerHTML = '<div class="countdown-empty">加载失败</div>';
        });
}

// 新建倒数日弹窗
(function initCountdownModal() {
    var overlay = document.getElementById('countdownModalOverlay');
    var openBtn = document.getElementById('newCountdownBtn');
    var closeBtn = document.getElementById('countdownModalClose');
    var cancelBtn = document.getElementById('countdownCancel');
    var saveBtn = document.getElementById('countdownSave');
    var msg = document.getElementById('cdMsg');
    if (!overlay || !openBtn) return;

    function openModal() { overlay.classList.add('show'); if (msg) msg.textContent = ''; }
    function closeModal() { overlay.classList.remove('show'); }

    openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', function() {
        var name = document.getElementById('cdName').value.trim();
        var date = document.getElementById('cdDate').value.trim();
        var creator = document.getElementById('cdCreator').value.trim();
        var expire = document.getElementById('cdExpire').value.trim();

        if (!name || !date || !creator) { msg.textContent = '名称、日子、创建人不能为空'; return; }
        if (!/^\d{8}$/.test(date)) { msg.textContent = '日子格式应为 8 位数字，如 20260925'; return; }
        if (expire && !/^\d{8}$/.test(expire)) { msg.textContent = '有效期格式应为 8 位数字'; return; }

        saveBtn.disabled = true;
        saveBtn.textContent = '保存中...';

        fetch('https://api.airtable.com/v0/' + WRITE_BASE + '/' + COUNTDOWN_TABLE, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + WRITE_TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    '名称': name,
                    '日子': Number(date),
                    '创建人': creator,
                    '有效期': expire ? Number(expire) : null
                }
            })
        })
        .then(function(r) {
            if (!r.ok) {
                return r.text().then(function(t) {
                    throw new Error('HTTP ' + r.status + ' — ' + t);
                });
            }
            return r.json();
        })
        .then(function() {
            saveBtn.disabled = false;
            saveBtn.textContent = '保存';
            closeModal();
            document.getElementById('cdName').value = '';
            document.getElementById('cdDate').value = '';
            document.getElementById('cdCreator').value = '';
            document.getElementById('cdExpire').value = '';
            loadCountdowns();
        })
        .catch(function(err) {
            saveBtn.disabled = false;
            saveBtn.textContent = '保存';
            msg.textContent = '保存失败：' + err.message;
        });
    });
})();

// ============================================================
// 4. 最新通知（拉只读 Base 的「最新通知」表，倒序）
// ============================================================
function loadNotices() {
    atFetch(READ_ONLY_BASE, '最新通知', READ_ONLY_TOKEN)
        .then(function(data) {
            var list = document.getElementById('noticesList');
            if (!list) return;
            if (data.length === 0) {
                list.innerHTML = '<div class="panel-empty">暂无通知</div>';
                return;
            }
            var reversed = data.slice().reverse();
            list.innerHTML = reversed.map(function(item) {
                var text = item['通知消息'] || item['消息'] || item['内容'] || JSON.stringify(item);
                return '<div class="notice-item">' + text + '</div>';
            }).join('');
        })
        .catch(function(err) {
            console.error('通知加载失败:', err);
            var list = document.getElementById('noticesList');
            if (list) list.innerHTML = '<div class="panel-empty">加载失败</div>';
        });
}

// ============================================================
// 5. 搜索框
// ============================================================
(function initSearch() {
    var sel = document.getElementById('searchEngineSelect');
    var input = document.getElementById('searchQueryInput');
    var btn = document.getElementById('searchGoBtn');
    if (!sel || !input || !btn) return;

    function doSearch() {
        var q = input.value.trim();
        if (!q) return;
        var engine = sel.value;
        if (engine === '__PAGE__') {
            var found = window.find(q, false, false, true);
            if (!found) alert('未找到：' + q);
            return;
        }
        window.open(engine + encodeURIComponent(q), '_blank');
    }

    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') doSearch();
    });
})();

// ============================================================
// 6. 账户中心
// ============================================================
var DEMO_LINKS = [
    { icon: '📁', label: '网盘', url: 'cloud.html' },
    { icon: '💬', label: '聊天', url: 'chat/index.html' },
    { icon: '👤', label: '用户中心', url: 'user.html' },
    { icon: '📊', label: '管理', url: 'dashboard.html' },
    { icon: '🏠', label: '首页', url: 'index.html' }
];

function renderQuickLinks() {
    var box = document.getElementById('quickLinksPanel');
    if (!box) return;
    box.innerHTML = DEMO_LINKS.map(function(l, i) {
        return '<a class="quick-link-icon" data-idx="' + i + '">' +
            '<span class="ico">' + l.icon + '</span>' + l.label +
            '</a>';
    }).join('');
    box.querySelectorAll('.quick-link-icon').forEach(function(el) {
        el.addEventListener('click', function() {
            var rnd = Math.floor(Math.random() * DEMO_LINKS.length);
            window.open(DEMO_LINKS[rnd].url, '_blank');
        });
    });
}

function updateAccountWidget() {
    var token = sessionStorage.getItem('auth_token') ||
        (document.cookie.match(/auth_token=([^;]+)/) || [])[1];
    var userData = sessionStorage.getItem('user_data') ||
        (document.cookie.match(/user_data=([^;]+)/) || [])[1];
    var guest = document.getElementById('accountGuest');
    var userBox = document.getElementById('accountUser');
    if (!guest || !userBox) return;

    if (token && userData) {
        try {
            var u = JSON.parse(decodeURIComponent(userData));
            if (u) {
                guest.style.display = 'none';
                userBox.style.display = 'flex';
                document.getElementById('panelUserName').textContent =
                    u.username || u.displayName || '用户';
                document.getElementById('panelUserEmail').textContent = u.email || '';
                if (u.avatar_url) {
                    document.getElementById('panelUserAvatar').src = u.avatar_url;
                }
                renderQuickLinks();
                return;
            }
        } catch (e) {}
    }
    guest.style.display = 'flex';
    userBox.style.display = 'none';
}

// ============================================================
// 7. 设置弹窗
// ============================================================
(function initSettingsModal() {
    var overlay = document.getElementById('settingsModalOverlay');
    var toggle = document.getElementById('settingsToggle');
    var close = document.getElementById('settingsModalClose');
    var save = document.getElementById('settingsSaveBtn');
    if (!overlay || !toggle) return;

    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        overlay.classList.add('show');
    });
    if (close) close.addEventListener('click', function() {
        overlay.classList.remove('show');
    });
    if (save) save.addEventListener('click', function() {
        overlay.classList.remove('show');
    });
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) overlay.classList.remove('show');
    });
})();

// ============================================================
// 8. 上/下页切换
// ============================================================
(function initPageScroll() {
    var indicator = document.getElementById('scrollDownIndicator');
    var pageContent = document.getElementById('pageContent');
    var lockUntil = 0;

    function showContent() {
        if (Date.now() < lockUntil) return;
        document.body.classList.add('show-content');
        if (pageContent) pageContent.scrollTop = 0;
        lockUntil = Date.now() + 900;
    }
    function showDashboard() {
        if (Date.now() < lockUntil) return;
        document.body.classList.remove('show-content');
        lockUntil = Date.now() + 900;
    }

    if (indicator) indicator.addEventListener('click', showContent);

    window.addEventListener('wheel', function(e) {
        if (Math.abs(e.deltaY) < 8) return;
        var isContent = document.body.classList.contains('show-content');

        if (!isContent) {
            if (e.deltaY > 0) showContent();
        } else {
            if (pageContent && pageContent.scrollTop <= 0 && e.deltaY < 0) {
                showDashboard();
            }
        }
    }, { passive: true });

    var touchStartY = 0;
    window.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', function(e) {
        var dy = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(dy) < 40) return;
        var isContent = document.body.classList.contains('show-content');
        if (!isContent && dy > 0) {
            showContent();
        } else if (isContent && pageContent && pageContent.scrollTop <= 0 && dy < 0) {
            showDashboard();
        }
    }, { passive: true });
})();

// ============================================================
// 9. setup 更多框
// ============================================================
(function initSetupBox() {
    var box = document.getElementById('setupMoreBox');
    if (box) box.addEventListener('click', function() {
        window.open('setup.html', '_blank');
    });
})();

// ============================================================
// 10. 页面启动
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    loadCountdowns();
    loadNotices();
    updateAccountWidget();

    window.addEventListener('storage', updateAccountWidget);
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) updateAccountWidget();
    });
});

console.log('✅ dashboard.js 已加载');