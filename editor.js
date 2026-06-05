// ===== BEILARLY VISUAL EDITOR =====
(function() {
  'use strict';

  // Inject editor styles
  const editorCSS = document.createElement('style');
  editorCSS.textContent = `
    /* Editor overlay */
    .bly-editor-panel {
      position: fixed; top: 0; right: 0;
      width: 340px; height: 100vh;
      background: #1a1a1a;
      border-left: 1px solid rgba(200,169,110,0.2);
      z-index: 99999;
      overflow-y: auto;
      font-family: 'Noto Sans SC', sans-serif;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      box-shadow: -4px 0 30px rgba(0,0,0,0.5);
    }
    .bly-editor-panel.open { transform: translateX(0); }
    .bly-editor-panel * { box-sizing: border-box; }
    .bly-editor-header {
      padding: 16px 20px;
      background: #111;
      border-bottom: 1px solid rgba(200,169,110,0.15);
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 10;
    }
    .bly-editor-header h3 {
      font-size: 0.85rem; color: #C8A96E;
      letter-spacing: 2px; margin: 0;
    }
    .bly-editor-close {
      width: 28px; height: 28px;
      background: rgba(200,169,110,0.1);
      border: none; color: #C8A96E;
      cursor: pointer; font-size: 1rem;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s;
    }
    .bly-editor-close:hover { background: rgba(200,169,110,0.25); }
    .bly-section {
      padding: 16px 20px;
      border-bottom: 1px solid rgba(200,169,110,0.08);
    }
    .bly-section-title {
      font-size: 0.7rem; letter-spacing: 2px;
      color: #888; text-transform: uppercase;
      margin-bottom: 12px;
    }
    .bly-row {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 10px;
    }
    .bly-label {
      font-size: 0.75rem; color: #aaa;
      min-width: 60px; flex-shrink: 0;
    }
    .bly-input {
      flex: 1; padding: 6px 10px;
      background: #222; border: 1px solid rgba(200,169,110,0.1);
      color: #F5F0EB; font-size: 0.8rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .bly-input:focus { outline: none; border-color: #C8A96E; }
    .bly-input[type="color"] {
      width: 36px; height: 30px; padding: 2px;
      cursor: pointer;
    }
    .bly-input[type="range"] {
      -webkit-appearance: none; height: 4px;
      background: #333; border: none; padding: 0;
    }
    .bly-input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px; height: 14px; border-radius: 50%;
      background: #C8A96E; cursor: pointer;
    }
    .bly-btn {
      padding: 8px 16px;
      background: #C8A96E; color: #0A0A0A;
      border: none; font-size: 0.75rem;
      font-weight: 700; letter-spacing: 1px;
      cursor: pointer; transition: all 0.2s;
    }
    .bly-btn:hover { background: #E8D5B7; }
    .bly-btn-outline {
      padding: 8px 16px;
      background: transparent; color: #C8A96E;
      border: 1px solid rgba(200,169,110,0.3);
      font-size: 0.75rem; cursor: pointer;
      transition: all 0.2s;
    }
    .bly-btn-outline:hover { border-color: #C8A96E; }
    .bly-btn-danger {
      padding: 6px 12px; background: #c0392b; color: white;
      border: none; font-size: 0.7rem; cursor: pointer;
    }
    .bly-selected-info {
      font-size: 0.8rem; color: #F5F0EB;
      padding: 10px 14px; background: #222;
      margin-bottom: 12px; word-break: break-all;
    }
    .bly-selected-info .tag { color: #C8A96E; font-weight: 700; }
    .bly-selected-info .text { color: #888; font-size: 0.7rem; }
    .bly-toast {
      position: fixed; bottom: 30px; left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #C8A96E; color: #0A0A0A;
      padding: 12px 28px; font-size: 0.85rem;
      font-weight: 700; z-index: 999999;
      transition: transform 0.3s ease;
      pointer-events: none;
    }
    .bly-toast.show { transform: translateX(-50%) translateY(0); }

    /* Hover highlight */
    .bly-hover-outline {
      outline: 2px dashed rgba(200,169,110,0.5) !important;
      outline-offset: 2px;
    }
    .bly-selected-outline {
      outline: 2px solid #C8A96E !important;
      outline-offset: 2px;
    }

    /* Floating trigger */
    .bly-trigger {
      position: fixed; bottom: 30px; right: 30px;
      width: 50px; height: 50px; border-radius: 50%;
      background: #C8A96E; color: #0A0A0A;
      border: none; font-size: 1.3rem;
      cursor: pointer; z-index: 99998;
      box-shadow: 0 4px 20px rgba(200,169,110,0.4);
      transition: all 0.3s;
      display: flex; align-items: center; justify-content: center;
    }
    .bly-trigger:hover { transform: scale(1.1); box-shadow: 0 6px 30px rgba(200,169,110,0.6); }

    /* Position badge */
    .bly-pos-badge {
      position: fixed; pointer-events: none;
      background: rgba(10,10,10,0.9); color: #C8A96E;
      padding: 4px 10px; font-size: 0.65rem;
      z-index: 99999; display: none;
      font-family: 'Montserrat', monospace;
      letter-spacing: 1px;
      border: 1px solid rgba(200,169,110,0.2);
    }
  `;
  document.head.appendChild(editorCSS);

  // State
  let selectedEl = null;
  let editorOpen = false;
  let editMode = false;

  // Create trigger button
  const trigger = document.createElement('button');
  trigger.className = 'bly-trigger';
  trigger.innerHTML = '✏️';
  trigger.title = '打开编辑器';
  document.body.appendChild(trigger);

  // Create position badge
  const posBadge = document.createElement('div');
  posBadge.className = 'bly-pos-badge';
  document.body.appendChild(posBadge);

  // Create toast
  const toast = document.createElement('div');
  toast.className = 'bly-toast';
  document.body.appendChild(toast);

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  // Create editor panel
  const panel = document.createElement('div');
  panel.className = 'bly-editor-panel';
  panel.innerHTML = `
    <div class="bly-editor-header">
      <h3>🎨 可视化编辑器</h3>
      <button class="bly-editor-close" id="blyClose">✕</button>
    </div>
    <div id="blyContent">
      <div class="bly-section">
        <div class="bly-section-title">👆 点击页面任意元素开始编辑</div>
        <p style="font-size:0.8rem;color:#666;line-height:1.6;">
          点击页面上的文字、图片、按钮等元素，即可在此面板中调整样式。
        </p>
      </div>
      <div class="bly-section">
        <div class="bly-section-title">快捷操作</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="bly-btn-outline" onclick="document.body.contentEditable=false;showToast('已退出编辑')">退出文字编辑</button>
          <button class="bly-btn" id="blyExport">导出修改</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // Toggle panel
  function togglePanel(open) {
    editorOpen = open !== undefined ? open : !editorOpen;
    panel.classList.toggle('open', editorOpen);
    editMode = editorOpen;
  }

  trigger.addEventListener('click', () => togglePanel());
  document.getElementById('blyClose').addEventListener('click', () => togglePanel(false));

  // Hover highlight
  document.addEventListener('mouseover', function(e) {
    if (!editMode) return;
    if (e.target.closest('.bly-editor-panel') || e.target.closest('.bly-trigger')) return;
    e.target.classList.add('bly-hover-outline');
    // Show position badge
    const rect = e.target.getBoundingClientRect();
    const tag = e.target.tagName.toLowerCase();
    posBadge.textContent = tag + (e.target.className ? '.' + e.target.className.split(' ')[0] : '');
    posBadge.style.display = 'block';
    posBadge.style.left = rect.left + 'px';
    posBadge.style.top = (rect.top - 24) + 'px';
  });
  document.addEventListener('mouseout', function(e) {
    e.target.classList.remove('bly-hover-outline');
    posBadge.style.display = 'none';
  });

  // Select element
  document.addEventListener('click', function(e) {
    if (!editMode) return;
    if (e.target.closest('.bly-editor-panel') || e.target.closest('.bly-trigger')) return;
    e.preventDefault();
    e.stopPropagation();

    // Deselect previous
    if (selectedEl) selectedEl.classList.remove('bly-selected-outline');

    selectedEl = e.target;
    selectedEl.classList.add('bly-selected-outline');

    const cs = window.getComputedStyle(selectedEl);
    const tag = selectedEl.tagName.toLowerCase();
    const text = selectedEl.textContent.trim().substring(0, 50);
    const isText = ['h1','h2','h3','h4','h5','h6','p','span','a','li','div','td','th','label','button'].includes(tag) && selectedEl.children.length === 0;

    const content = document.getElementById('blyContent');
    content.innerHTML = `
      <div class="bly-section">
        <div class="bly-section-title">当前选中</div>
        <div class="bly-selected-info">
          <span class="tag">&lt;${tag}&gt;</span>
          ${selectedEl.className ? ' <span class="text">.' + selectedEl.className.split(' ').slice(0,2).join('.') + '</span>' : ''}
          <br><span class="text">${text || '(空元素)'}</span>
        </div>
        ${isText ? `
        <div class="bly-row">
          <span class="bly-label">文字</span>
          <input class="bly-input" type="text" id="blyText" value="${selectedEl.textContent.replace(/"/g,'&quot;')}">
        </div>
        ` : ''}
      </div>

      <div class="bly-section">
        <div class="bly-section-title">字体</div>
        <div class="bly-row">
          <span class="bly-label">大小</span>
          <input class="bly-input" type="range" id="blyFontSize" min="8" max="80" value="${parseInt(cs.fontSize)}">
          <span class="bly-label" id="blyFontSizeVal" style="min-width:35px;text-align:right;">${parseInt(cs.fontSize)}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-label">粗细</span>
          <select class="bly-input" id="blyFontWeight">
            ${[300,400,500,600,700,800,900].map(w => `<option value="${w}" ${parseInt(cs.fontWeight)===w?'selected':''}>${w}</option>`).join('')}
          </select>
        </div>
        <div class="bly-row">
          <span class="bly-label">行高</span>
          <input class="bly-input" type="range" id="blyLineHeight" min="0.8" max="3" step="0.1" value="${parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) || 1.5}">
          <span class="bly-label" id="blyLineHeightVal" style="min-width:30px;text-align:right;">${(parseFloat(cs.lineHeight) / parseFloat(cs.fontSize) || 1.5).toFixed(1)}</span>
        </div>
        <div class="bly-row">
          <span class="bly-label">字距</span>
          <input class="bly-input" type="range" id="blyLetterSpacing" min="-2" max="12" step="0.5" value="${parseFloat(cs.letterSpacing) || 0}">
          <span class="bly-label" id="blyLetterSpacingVal" style="min-width:35px;text-align:right;">${parseFloat(cs.letterSpacing) || 0}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-label">颜色</span>
          <input class="bly-input" type="color" id="blyColor" value="${rgbToHex(cs.color)}">
          <span class="bly-label" style="font-size:0.7rem;">${rgbToHex(cs.color)}</span>
        </div>
      </div>

      <div class="bly-section">
        <div class="bly-section-title">背景</div>
        <div class="bly-row">
          <span class="bly-label">颜色</span>
          <input class="bly-input" type="color" id="blyBgColor" value="${rgbToHex(cs.backgroundColor === 'rgba(0, 0, 0, 0)' ? '#000000' : cs.backgroundColor)}">
          <button class="bly-btn-outline" id="blyBgTransparent" style="padding:4px 8px;font-size:0.65rem;">透明</button>
        </div>
      </div>

      <div class="bly-section">
        <div class="bly-section-title">间距</div>
        <div class="bly-row">
          <span class="bly-label">内距</span>
          <input class="bly-input" type="range" id="blyPadding" min="0" max="100" value="${parseInt(cs.padding) || 0}">
          <span class="bly-label" id="blyPaddingVal" style="min-width:35px;text-align:right;">${parseInt(cs.padding) || 0}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-label">外距</span>
          <input class="bly-input" type="range" id="blyMargin" min="0" max="100" value="${parseInt(cs.margin) || 0}">
          <span class="bly-label" id="blyMarginVal" style="min-width:35px;text-align:right;">${parseInt(cs.margin) || 0}px</span>
        </div>
      </div>

      <div class="bly-section">
        <div class="bly-section-title">边框</div>
        <div class="bly-row">
          <span class="bly-label">圆角</span>
          <input class="bly-input" type="range" id="blyBorderRadius" min="0" max="50" value="${parseInt(cs.borderRadius) || 0}">
          <span class="bly-label" id="blyBorderRadiusVal" style="min-width:35px;text-align:right;">${parseInt(cs.borderRadius) || 0}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-label">宽度</span>
          <input class="bly-input" type="range" id="blyBorderWidth" min="0" max="10" value="${parseInt(cs.borderWidth) || 0}">
          <span class="bly-label" id="blyBorderWidthVal" style="min-width:35px;text-align:right;">${parseInt(cs.borderWidth) || 0}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-label">颜色</span>
          <input class="bly-input" type="color" id="blyBorderColor" value="${rgbToHex(cs.borderColor || '#C8A96E')}">
        </div>
      </div>

      <div class="bly-section">
        <div class="bly-section-title">效果</div>
        <div class="bly-row">
          <span class="bly-label">透明度</span>
          <input class="bly-input" type="range" id="blyOpacity" min="0" max="1" step="0.05" value="${cs.opacity}">
          <span class="bly-label" id="blyOpacityVal" style="min-width:30px;text-align:right;">${cs.opacity}</span>
        </div>
        <div class="bly-row">
          <span class="bly-label">阴影</span>
          <input class="bly-input" type="range" id="blyBoxShadow" min="0" max="50" value="0">
          <span class="bly-label" id="blyBoxShadowVal" style="min-width:35px;text-align:right;">0px</span>
        </div>
      </div>

      <div class="bly-section">
        <div class="bly-section-title">文字编辑</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="bly-btn" id="blyEditText">编辑文字</button>
          <button class="bly-btn-outline" id="blyResetEl">重置元素</button>
          <button class="bly-btn-outline" id="blyUndo">撤销</button>
        </div>
      </div>

      <div class="bly-section">
        <div class="bly-section-title">操作</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="bly-btn" id="blyExport">导出修改</button>
          <button class="bly-btn-danger" id="blyResetAll">重置全部</button>
        </div>
      </div>
    `;

    // Bind events
    bindEditorEvents();
  }, true);

  // RGB to HEX
  function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent') return '#000000';
    if (rgb.startsWith('#')) return rgb;
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return '#000000';
    return '#' + match.slice(0,3).map(x => parseInt(x).toString(16).padStart(2,'0')).join('');
  }

  // History for undo
  const history = [];

  function applyStyle(prop, value) {
    if (!selectedEl) return;
    history.push({ el: selectedEl, prop, value: selectedEl.style[prop] });
    selectedEl.style[prop] = value;
  }

  function bindEditorEvents() {
    // Text edit
    const textInput = document.getElementById('blyText');
    if (textInput) {
      textInput.addEventListener('input', () => {
        if (selectedEl) selectedEl.textContent = textInput.value;
      });
    }

    // Font size
    bindRange('blyFontSize', 'blyFontSizeVal', v => applyStyle('fontSize', v + 'px'), 'px');
    // Font weight
    bindSelect('blyFontWeight', v => applyStyle('fontWeight', v));
    // Line height
    bindRange('blyLineHeight', 'blyLineHeightVal', v => applyStyle('lineHeight', v), '');
    // Letter spacing
    bindRange('blyLetterSpacing', 'blyLetterSpacingVal', v => applyStyle('letterSpacing', v + 'px'), 'px');
    // Color
    bindColor('blyColor', v => applyStyle('color', v));
    // BG color
    bindColor('blyBgColor', v => applyStyle('backgroundColor', v));
    // BG transparent
    const bgTransp = document.getElementById('blyBgTransparent');
    if (bgTransp) bgTransp.addEventListener('click', () => applyStyle('backgroundColor', 'transparent'));
    // Padding
    bindRange('blyPadding', 'blyPaddingVal', v => applyStyle('padding', v + 'px'), 'px');
    // Margin
    bindRange('blyMargin', 'blyMarginVal', v => applyStyle('margin', v + 'px'), 'px');
    // Border radius
    bindRange('blyBorderRadius', 'blyBorderRadiusVal', v => applyStyle('borderRadius', v + 'px'), 'px');
    // Border width
    bindRange('blyBorderWidth', 'blyBorderWidthVal', v => {
      const c = document.getElementById('blyBorderColor');
      applyStyle('border', v + 'px solid ' + (c ? c.value : '#C8A96E'));
    }, 'px');
    // Border color
    bindColor('blyBorderColor', v => {
      const w = document.getElementById('blyBorderWidth');
      applyStyle('border', (w ? w.value : 1) + 'px solid ' + v);
    });
    // Opacity
    bindRange('blyOpacity', 'blyOpacityVal', v => applyStyle('opacity', v), '');
    // Box shadow
    const shadowInput = document.getElementById('blyBoxShadow');
    const shadowVal = document.getElementById('blyBoxShadowVal');
    if (shadowInput) {
      shadowInput.addEventListener('input', () => {
        const v = shadowInput.value;
        shadowVal.textContent = v + 'px';
        applyStyle('boxShadow', v > 0 ? `0 ${v}px ${v*2}px rgba(0,0,0,${Math.min(v/50, 0.5)})` : 'none');
      });
    }

    // Edit text button
    const editBtn = document.getElementById('blyEditText');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        if (selectedEl) {
          selectedEl.contentEditable = true;
          selectedEl.focus();
          showToast('可直接编辑文字，点击其他地方完成');
        }
      });
    }

    // Reset element
    const resetBtn = document.getElementById('blyResetEl');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (selectedEl) {
          selectedEl.style.cssText = '';
          selectedEl.classList.remove('bly-selected-outline');
          showToast('元素样式已重置');
        }
      });
    }

    // Undo
    const undoBtn = document.getElementById('blyUndo');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        if (history.length > 0) {
          const last = history.pop();
          last.el.style[last.prop] = last.value;
          showToast('已撤销');
        }
      });
    }

    // Export
    const exportBtn = document.getElementById('blyExport');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportChanges);
    }

    // Reset all
    const resetAllBtn = document.getElementById('blyResetAll');
    if (resetAllBtn) {
      resetAllBtn.addEventListener('click', () => {
        if (confirm('确定要重置所有修改吗？')) {
          location.reload();
        }
      });
    }
  }

  function bindRange(inputId, valId, fn, suffix) {
    const input = document.getElementById(inputId);
    const val = document.getElementById(valId);
    if (input) {
      input.addEventListener('input', () => {
        val.textContent = input.value + suffix;
        fn(input.value);
      });
    }
  }
  function bindSelect(inputId, fn) {
    const input = document.getElementById(inputId);
    if (input) input.addEventListener('change', () => fn(input.value));
  }
  function bindColor(inputId, fn) {
    const input = document.getElementById(inputId);
    if (input) input.addEventListener('input', () => fn(input.value));
  }

  // Export changes
  function exportChanges() {
    const changes = [];
    document.querySelectorAll('*').forEach(el => {
      if (el.closest('.bly-editor-panel') || el.closest('.bly-trigger') || el.closest('.bly-pos-badge') || el.closest('.bly-toast')) return;
      if (el.style.cssText) {
        const path = getCssPath(el);
        changes.push(`${el.style.cssText}`);
      }
    });
    if (changes.length === 0) {
      showToast('暂无修改');
      return;
    }
    // Build CSS string
    let css = '/* ===== 编辑器导出的样式修改 ===== */\n';
    document.querySelectorAll('*').forEach(el => {
      if (el.closest('.bly-editor-panel') || el.closest('.bly-trigger')) return;
      if (el.style.cssText) {
        const path = getCssPath(el);
        css += `${path} {\n`;
        el.style.cssText.split(';').filter(Boolean).forEach(rule => {
          css += `  ${rule.trim()};\n`;
        });
        css += `}\n\n`;
      }
    });

    // Copy to clipboard
    navigator.clipboard.writeText(css).then(() => {
      showToast('CSS 已复制到剪贴板！粘贴到 style.css 中即可保存');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = css;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('CSS 已复制到剪贴板！');
    });
  }

  function getCssPath(el) {
    if (el.id) return '#' + el.id;
    let path = '';
    let current = el;
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) { path = '#' + current.id + (path ? ' > ' + path : ''); break; }
      if (current.className && typeof current.className === 'string') {
        const cls = current.className.split(' ').filter(c => c && !c.startsWith('bly-')).slice(0,2).join('.');
        if (cls) selector += '.' + cls;
      }
      path = selector + (path ? ' > ' + path : '');
      current = current.parentElement;
    }
    return path || el.tagName.toLowerCase();
  }

  // Keyboard shortcut: Ctrl+E to toggle
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      togglePanel();
    }
    if (e.key === 'Escape' && editorOpen) {
      togglePanel(false);
      if (selectedEl) {
        selectedEl.classList.remove('bly-selected-outline');
        selectedEl = null;
      }
    }
  });

  console.log('%c🎨 贝拉利可视化编辑器已加载', 'color:#C8A96E;font-size:14px;font-weight:bold;');
  console.log('%c按 Ctrl+E 或点击右下角按钮打开编辑器', 'color:#888;font-size:12px;');
})();
