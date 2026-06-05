// ===== BEILARLY VISUAL EDITOR v2 - 拖拉拽版 =====
(function() {
  'use strict';

  const editorCSS = document.createElement('style');
  editorCSS.textContent = `
    /* ===== EDITOR PANEL ===== */
    .bly-panel {
      position: fixed; top: 0; right: 0;
      width: 360px; height: 100vh;
      background: #111;
      border-left: 2px solid rgba(200,169,110,0.2);
      z-index: 99999;
      overflow-y: auto;
      font-family: 'Noto Sans SC', sans-serif;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
      box-shadow: -6px 0 40px rgba(0,0,0,0.6);
    }
    .bly-panel.open { transform: translateX(0); }
    .bly-panel * { box-sizing: border-box; }
    .bly-panel-header {
      padding: 18px 22px;
      background: #0a0a0a;
      border-bottom: 1px solid rgba(200,169,110,0.15);
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 10;
    }
    .bly-panel-header h3 {
      font-size: 0.9rem; color: #C8A96E;
      letter-spacing: 2px; margin: 0;
      display: flex; align-items: center; gap: 8px;
    }
    .bly-panel-close {
      width: 30px; height: 30px;
      background: rgba(200,169,110,0.1);
      border: none; color: #C8A96E;
      cursor: pointer; font-size: 1.1rem;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
    }
    .bly-panel-close:hover { background: rgba(200,169,110,0.3); }

    /* Welcome screen */
    .bly-welcome {
      padding: 30px 22px;
    }
    .bly-welcome h4 {
      font-size: 1.1rem; color: #F5F0EB;
      margin-bottom: 16px;
    }
    .bly-step {
      display: flex; gap: 14px; margin-bottom: 20px;
      padding: 14px; background: #1a1a1a;
      border-radius: 4px;
      border-left: 3px solid #C8A96E;
    }
    .bly-step-num {
      width: 28px; height: 28px; flex-shrink: 0;
      background: #C8A96E; color: #0a0a0a;
      border-radius: 50%; font-size: 0.8rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .bly-step-text h5 {
      font-size: 0.85rem; color: #F5F0EB;
      margin-bottom: 4px;
    }
    .bly-step-text p {
      font-size: 0.75rem; color: #888;
      line-height: 1.5; margin: 0;
    }

    /* Sections */
    .bly-sec {
      padding: 16px 22px;
      border-bottom: 1px solid rgba(200,169,110,0.06);
    }
    .bly-sec-title {
      font-size: 0.65rem; letter-spacing: 2px;
      color: #666; text-transform: uppercase;
      margin-bottom: 14px;
      display: flex; align-items: center; gap: 6px;
    }

    /* Selected info */
    .bly-sel-info {
      background: #1a1a1a; padding: 12px 14px;
      margin-bottom: 14px; border-radius: 4px;
    }
    .bly-sel-tag {
      font-size: 0.85rem; color: #C8A96E; font-weight: 700;
    }
    .bly-sel-text {
      font-size: 0.75rem; color: #666;
      margin-top: 4px; word-break: break-all;
    }

    /* Form controls */
    .bly-row {
      display: flex; align-items: center; gap: 10px;
      margin-bottom: 10px;
    }
    .bly-lbl {
      font-size: 0.75rem; color: #aaa;
      min-width: 55px; flex-shrink: 0;
    }
    .bly-input {
      flex: 1; padding: 7px 10px;
      background: #1a1a1a; border: 1px solid rgba(200,169,110,0.1);
      color: #F5F0EB; font-size: 0.8rem;
      font-family: inherit;
      transition: border-color 0.2s;
    }
    .bly-input:focus { outline: none; border-color: #C8A96E; }
    .bly-input[type="color"] {
      width: 36px; height: 32px; padding: 2px;
      cursor: pointer;
    }
    .bly-input[type="range"] {
      -webkit-appearance: none; height: 4px;
      background: #333; border: none; padding: 0;
      flex: 1;
    }
    .bly-input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px; height: 16px; border-radius: 50%;
      background: #C8A96E; cursor: pointer;
      box-shadow: 0 0 6px rgba(200,169,110,0.4);
    }
    .bly-val {
      font-size: 0.7rem; color: #C8A96E;
      min-width: 38px; text-align: right;
      font-family: 'Montserrat', monospace;
    }

    /* Buttons */
    .bly-btn {
      padding: 10px 18px;
      background: #C8A96E; color: #0a0a0a;
      border: none; font-size: 0.78rem;
      font-weight: 700; letter-spacing: 1px;
      cursor: pointer; transition: all 0.2s;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .bly-btn:hover { background: #E8D5B7; transform: translateY(-1px); }
    .bly-btn-sm {
      padding: 7px 14px; font-size: 0.72rem;
    }
    .bly-btn-outline {
      padding: 10px 18px;
      background: transparent; color: #C8A96E;
      border: 1px solid rgba(200,169,110,0.3);
      font-size: 0.78rem; cursor: pointer;
      transition: all 0.2s;
      display: inline-flex; align-items: center; gap: 6px;
    }
    .bly-btn-outline:hover { border-color: #C8A96E; background: rgba(200,169,110,0.05); }
    .bly-btn-danger {
      padding: 7px 14px; background: #c0392b; color: white;
      border: none; font-size: 0.72rem; cursor: pointer;
      transition: all 0.2s;
    }
    .bly-btn-danger:hover { background: #e74c3c; }
    .bly-btns { display: flex; gap: 8px; flex-wrap: wrap; }

    /* Image replace card */
    .bly-img-card {
      background: #1a1a1a; border: 2px dashed rgba(200,169,110,0.2);
      padding: 20px; text-align: center; cursor: pointer;
      transition: all 0.3s; margin-bottom: 14px;
      border-radius: 4px;
    }
    .bly-img-card:hover {
      border-color: #C8A96E;
      background: rgba(200,169,110,0.05);
    }
    .bly-img-card i {
      font-size: 2rem; color: #C8A96E; margin-bottom: 10px; display: block;
    }
    .bly-img-card p {
      font-size: 0.8rem; color: #aaa; margin: 0;
    }
    .bly-img-card .hint {
      font-size: 0.7rem; color: #666; margin-top: 6px;
    }

    /* Quick action buttons near element */
    .bly-quick-bar {
      position: fixed;
      background: #111;
      border: 1px solid rgba(200,169,110,0.3);
      padding: 6px;
      display: flex; gap: 4px;
      z-index: 99998;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      border-radius: 4px;
      transition: opacity 0.2s;
    }
    .bly-quick-bar button {
      width: 32px; height: 32px;
      background: rgba(200,169,110,0.1);
      border: none; color: #C8A96E;
      cursor: pointer; font-size: 0.85rem;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s;
      border-radius: 3px;
    }
    .bly-quick-bar button:hover {
      background: #C8A96E; color: #0a0a0a;
    }
    .bly-quick-bar button[title]::after {
      content: attr(title);
    }

    /* Hover / Selected */
    .bly-hover {
      outline: 2px dashed rgba(200,169,110,0.5) !important;
      outline-offset: 3px;
      cursor: crosshair !important;
    }
    .bly-selected {
      outline: 2px solid #C8A96E !important;
      outline-offset: 3px;
    }

    /* Floating trigger */
    .bly-trigger {
      position: fixed; bottom: 30px; right: 30px;
      width: 56px; height: 56px; border-radius: 50%;
      background: linear-gradient(135deg, #C8A96E, #a8884e);
      color: #0a0a0a;
      border: none; font-size: 1.5rem;
      cursor: pointer; z-index: 99998;
      box-shadow: 0 6px 30px rgba(200,169,110,0.5);
      transition: all 0.3s;
      display: flex; align-items: center; justify-content: center;
    }
    .bly-trigger:hover {
      transform: scale(1.1) rotate(15deg);
      box-shadow: 0 8px 40px rgba(200,169,110,0.7);
    }

    /* Toast */
    .bly-toast {
      position: fixed; bottom: 30px; left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #C8A96E; color: #0a0a0a;
      padding: 14px 32px; font-size: 0.88rem;
      font-weight: 700; z-index: 999999;
      transition: transform 0.3s ease;
      pointer-events: none; border-radius: 4px;
      box-shadow: 0 4px 20px rgba(200,169,110,0.4);
    }
    .bly-toast.show { transform: translateX(-50%) translateY(0); }

    /* Tooltip */
    .bly-tip {
      position: fixed; pointer-events: none;
      background: rgba(10,10,10,0.95); color: #C8A96E;
      padding: 5px 12px; font-size: 0.7rem;
      z-index: 99999; display: none;
      font-family: 'Montserrat', monospace;
      letter-spacing: 1px;
      border: 1px solid rgba(200,169,110,0.2);
      border-radius: 3px;
      white-space: nowrap;
    }

    /* Guide overlay */
    .bly-guide-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      z-index: 99997;
      display: flex; align-items: center; justify-content: center;
    }
    .bly-guide-box {
      background: #111; border: 1px solid rgba(200,169,110,0.2);
      padding: 40px; max-width: 500px; width: 90%;
      text-align: center; border-radius: 8px;
    }
    .bly-guide-box h2 {
      font-size: 1.4rem; color: #C8A96E;
      margin-bottom: 20px;
    }
    .bly-guide-box p {
      font-size: 0.9rem; color: #aaa;
      line-height: 1.8; margin-bottom: 24px;
    }
    .bly-guide-box .bly-guide-steps {
      text-align: left; margin-bottom: 30px;
    }
    .bly-guide-box .bly-guide-steps div {
      display: flex; align-items: center; gap: 12px;
      padding: 10px 0; border-bottom: 1px solid rgba(200,169,110,0.06);
    }
    .bly-guide-box .bly-guide-steps span {
      width: 24px; height: 24px; flex-shrink: 0;
      background: #C8A96E; color: #0a0a0a;
      border-radius: 50%; font-size: 0.75rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .bly-guide-box .bly-guide-steps p {
      font-size: 0.82rem; margin: 0; color: #ccc;
    }
  `;
  document.head.appendChild(editorCSS);

  // State
  let selectedEl = null;
  let panelOpen = false;
  let editMode = false;
  const history = [];

  // Toast
  const toast = document.createElement('div');
  toast.className = 'bly-toast';
  document.body.appendChild(toast);
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  // Tip
  const tip = document.createElement('div');
  tip.className = 'bly-tip';
  document.body.appendChild(tip);

  // Quick bar
  const quickBar = document.createElement('div');
  quickBar.className = 'bly-quick-bar';
  quickBar.style.display = 'none';
  quickBar.innerHTML = `
    <button id="qbEdit" title="编辑文字">✏️</button>
    <button id="qbImg" title="换图片">🖼️</button>
    <button id="qbColor" title="换颜色">🎨</button>
    <button id="qbSize" title="调大小">↕️</button>
    <button id="qbUndo" title="撤销">↩️</button>
  `;
  document.body.appendChild(quickBar);

  // Trigger button
  const trigger = document.createElement('button');
  trigger.className = 'bly-trigger';
  trigger.innerHTML = '✏️';
  trigger.title = '打开可视化编辑器 (Ctrl+E)';
  document.body.appendChild(trigger);

  // Panel
  const panel = document.createElement('div');
  panel.className = 'bly-panel';
  document.body.appendChild(panel);

  // Guide overlay (first time)
  function showGuide() {
    const overlay = document.createElement('div');
    overlay.className = 'bly-guide-overlay';
    overlay.innerHTML = `
      <div class="bly-guide-box">
        <h2>🎨 可视化编辑器</h2>
        <p>不用写代码，点击页面元素即可修改</p>
        <div class="bly-guide-steps">
          <div><span>1</span><p><b>点击</b> 任意文字、图片、按钮 → 选中它</p></div>
          <div><span>2</span><p><b>双击</b> 文字 → 直接修改文字内容</p></div>
          <div><span>3</span><p><b>点击图片</b> → 弹出换图窗口，粘贴新图片链接</p></div>
          <div><span>4</span><p>右侧面板 → 拖动滑块调整 <b>字号、颜色、间距</b></p></div>
          <div><span>5</span><p>调好后点 <b>「导出修改」</b> → 告诉我，我帮你保存</p></div>
        </div>
        <button class="bly-btn" id="blyGuideOk">知道了，开始编辑</button>
      </div>
    `;
    document.body.appendChild(overlay);
    document.getElementById('blyGuideOk').addEventListener('click', () => {
      overlay.remove();
      localStorage.setItem('bly_editor_seen', '1');
    });
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        localStorage.setItem('bly_editor_seen', '1');
      }
    });
  }

  // Toggle panel
  function togglePanel(open) {
    panelOpen = open !== undefined ? open : !panelOpen;
    panel.classList.toggle('open', panelOpen);
    editMode = panelOpen;
    if (!panelOpen) {
      deselectAll();
      quickBar.style.display = 'none';
    }
    if (panelOpen && !localStorage.getItem('bly_editor_seen')) {
      showGuide();
    }
    if (panelOpen) renderWelcome();
  }

  function renderWelcome() {
    panel.innerHTML = `
      <div class="bly-panel-header">
        <h3>🎨 可视化编辑器</h3>
        <button class="bly-panel-close" id="blyClose">✕</button>
      </div>
      <div class="bly-welcome">
        <h4>点击页面元素开始编辑</h4>
        <div class="bly-step">
          <div class="bly-step-num">1</div>
          <div class="bly-step-text">
            <h5>点击 → 选中元素</h5>
            <p>鼠标移到页面上，看到黄色虚线框后点击选中</p>
          </div>
        </div>
        <div class="bly-step">
          <div class="bly-step-num">2</div>
          <div class="bly-step-text">
            <h5>双击 → 改文字</h5>
            <p>双击文字可以直接修改内容</p>
          </div>
        </div>
        <div class="bly-step">
          <div class="bly-step-num">3</div>
          <div class="bly-step-text">
            <h5>点击图片 → 换图片</h5>
            <p>点击图片会弹出窗口，粘贴新图片链接即可替换</p>
          </div>
        </div>
        <div class="bly-step">
          <div class="bly-step-num">4</div>
          <div class="bly-step-text">
            <h5>拖滑块 → 调样式</h5>
            <p>选中元素后，右侧面板可调字号、颜色、间距等</p>
          </div>
        </div>
      </div>
      <div class="bly-sec">
        <div class="bly-sec-title">快捷操作</div>
        <div class="bly-btns">
          <button class="bly-btn" id="blyExportBtn">📦 导出修改</button>
          <button class="bly-btn-outline" id="blyResetBtn">🔄 重置全部</button>
        </div>
      </div>
    `;
    document.getElementById('blyClose').addEventListener('click', () => togglePanel(false));
    document.getElementById('blyExportBtn').addEventListener('click', exportChanges);
    document.getElementById('blyResetBtn').addEventListener('click', () => {
      if (confirm('确定要重置所有修改吗？页面会刷新。')) location.reload();
    });
  }

  trigger.addEventListener('click', () => togglePanel());
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'e') { e.preventDefault(); togglePanel(); }
    if (e.key === 'Escape' && panelOpen) { togglePanel(false); }
  });

  // Helpers
  function isEditorEl(el) {
    return el.closest('.bly-panel') || el.closest('.bly-trigger') ||
           el.closest('.bly-quick-bar') || el.closest('.bly-toast') ||
           el.closest('.bly-tip') || el.closest('.bly-guide-overlay');
  }
  function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#000000';
    if (rgb.startsWith('#')) return rgb.length === 7 ? rgb : '#000000';
    const m = rgb.match(/\d+/g);
    if (!m || m.length < 3) return '#000000';
    return '#' + m.slice(0,3).map(x => (+x).toString(16).padStart(2,'0')).join('');
  }
  function deselectAll() {
    if (selectedEl) { selectedEl.classList.remove('bly-selected'); selectedEl = null; }
    quickBar.style.display = 'none';
  }

  // Hover
  document.addEventListener('mouseover', function(e) {
    if (!editMode || isEditorEl(e.target)) return;
    e.target.classList.add('bly-hover');
    const rect = e.target.getBoundingClientRect();
    const tag = e.target.tagName.toLowerCase();
    const cls = e.target.className && typeof e.target.className === 'string'
      ? '.' + e.target.className.split(' ').filter(c => !c.startsWith('bly-')).slice(0,2).join('.') : '';
    tip.textContent = tag + cls;
    tip.style.display = 'block';
    tip.style.left = rect.left + 'px';
    tip.style.top = (rect.top - 26) + 'px';
  }, true);
  document.addEventListener('mouseout', function(e) {
    e.target.classList.remove('bly-hover');
    tip.style.display = 'none';
  }, true);

  // Click to select
  document.addEventListener('click', function(e) {
    if (!editMode || isEditorEl(e.target)) return;

    // If clicking on an image, prompt to replace
    if (e.target.tagName === 'IMG') {
      e.preventDefault();
      e.stopPropagation();
      deselectAll();
      selectedEl = e.target;
      selectedEl.classList.add('bly-selected');
      promptImageReplace(e.target);
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    deselectAll();
    selectedEl = e.target;
    selectedEl.classList.add('bly-selected');

    // Position quick bar
    const rect = selectedEl.getBoundingClientRect();
    quickBar.style.display = 'flex';
    quickBar.style.left = rect.left + 'px';
    quickBar.style.top = (rect.top - 44) + 'px';

    // Render editor panel
    renderElementEditor(selectedEl);
  }, true);

  // Double click to edit text
  document.addEventListener('dblclick', function(e) {
    if (!editMode || isEditorEl(e.target)) return;
    const tag = e.target.tagName.toLowerCase();
    const textTags = ['h1','h2','h3','h4','h5','h6','p','span','a','li','button','label','td','th','div'];
    if (textTags.includes(tag)) {
      e.preventDefault();
      e.stopPropagation();
      e.target.contentEditable = true;
      e.target.focus();
      e.target.style.outline = '2px solid #C8A96E';
      e.target.style.outlineOffset = '2px';
      showToast('正在编辑文字，点击其他地方完成');
      e.target.addEventListener('blur', function handler() {
        e.target.contentEditable = false;
        e.target.style.outline = '';
        e.target.style.outlineOffset = '';
        e.target.removeEventListener('blur', handler);
        showToast('文字已修改 ✓');
      }, { once: true });
    }
  }, true);

  // Image replace prompt
  function promptImageReplace(img) {
    const currentSrc = img.src;
    const shortSrc = currentSrc.length > 60 ? currentSrc.substring(0, 60) + '...' : currentSrc;

    panel.innerHTML = `
      <div class="bly-panel-header">
        <h3>🖼️ 替换图片</h3>
        <button class="bly-panel-close" id="blyClose">✕</button>
      </div>
      <div class="bly-sec">
        <div class="bly-sel-info">
          <div class="bly-sel-tag">&lt;img&gt;</div>
          <div class="bly-sel-text">${shortSrc}</div>
        </div>
      </div>
      <div class="bly-sec">
        <div class="bly-sec-title">当前图片预览</div>
        <div style="margin-bottom:16px;">
          <img src="${currentSrc}" style="width:100%;max-height:200px;object-fit:cover;border:1px solid rgba(200,169,110,0.1);">
        </div>
      </div>
      <div class="bly-sec">
        <div class="bly-sec-title">替换方式</div>
        <div class="bly-img-card" id="blyUrlReplace">
          <i class="fas fa-link"></i>
          <p><b>粘贴图片链接</b></p>
          <p class="hint">从图床复制链接粘贴进来</p>
        </div>
        <div class="bly-img-card" id="blyLocalReplace">
          <i class="fas fa-upload"></i>
          <p><b>上传本地图片</b></p>
          <p class="hint">从电脑选择图片文件</p>
        </div>
        <input type="file" id="blyFileInput" accept="image/*" style="display:none;">
      </div>
      <div class="bly-sec">
        <div class="bly-sec-title">图片尺寸</div>
        <div class="bly-row">
          <span class="bly-lbl">宽度</span>
          <input class="bly-input" type="text" id="blyImgW" value="${img.style.width || 'auto'}" placeholder="auto / 100% / 300px">
        </div>
        <div class="bly-row">
          <span class="bly-lbl">高度</span>
          <input class="bly-input" type="text" id="blyImgH" value="${img.style.height || 'auto'}" placeholder="auto / 200px">
        </div>
        <div class="bly-row">
          <span class="bly-lbl">适应</span>
          <select class="bly-input" id="blyImgFit">
            <option value="cover" ${img.style.objectFit==='cover'?'selected':''}>裁剪填充 (cover)</option>
            <option value="contain" ${img.style.objectFit==='contain'?'selected':''}>完整显示 (contain)</option>
            <option value="fill" ${img.style.objectFit==='fill'?'selected':''}>拉伸填充 (fill)</option>
          </select>
        </div>
      </div>
      <div class="bly-sec">
        <div class="bly-btns">
          <button class="bly-btn" id="blyUndoImg">↩️ 撤销</button>
          <button class="bly-btn-outline" id="blyBackBtn">← 返回</button>
        </div>
      </div>
    `;
    document.getElementById('blyClose').addEventListener('click', () => togglePanel(false));
    document.getElementById('blyBackBtn').addEventListener('click', () => { deselectAll(); renderWelcome(); });

    // URL replace
    document.getElementById('blyUrlReplace').addEventListener('click', () => {
      const url = prompt('粘贴新图片链接：', img.src);
      if (url && url !== img.src) {
        history.push({ el: img, prop: 'src', value: img.src });
        img.src = url;
        showToast('图片已替换 ✓');
        promptImageReplace(img); // refresh
      }
    });

    // Local file replace
    const fileInput = document.getElementById('blyFileInput');
    document.getElementById('blyLocalReplace').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          history.push({ el: img, prop: 'src', value: img.src });
          img.src = ev.target.result;
          showToast('图片已替换 ✓');
          promptImageReplace(img);
        };
        reader.readAsDataURL(file);
      }
    });

    // Image size controls
    const imgW = document.getElementById('blyImgW');
    const imgH = document.getElementById('blyImgH');
    const imgFit = document.getElementById('blyImgFit');
    imgW.addEventListener('change', () => { img.style.width = imgW.value; });
    imgH.addEventListener('change', () => { img.style.height = imgH.value; });
    imgFit.addEventListener('change', () => { img.style.objectFit = imgFit.value; });

    // Undo
    document.getElementById('blyUndoImg').addEventListener('click', () => {
      if (history.length > 0) {
        const last = history.pop();
        last.el[last.prop] = last.value;
        showToast('已撤销');
        promptImageReplace(img);
      }
    });
  }

  // Element editor panel
  function renderElementEditor(el) {
    const cs = window.getComputedStyle(el);
    const tag = el.tagName.toLowerCase();
    const text = el.textContent.trim().substring(0, 40);
    const isText = el.children.length === 0 || ['h1','h2','h3','h4','h5','h6','p','span'].includes(tag);
    const isImg = tag === 'img';

    panel.innerHTML = `
      <div class="bly-panel-header">
        <h3>🎨 编辑元素</h3>
        <button class="bly-panel-close" id="blyClose">✕</button>
      </div>

      <div class="bly-sec">
        <div class="bly-sel-info">
          <div class="bly-sel-tag">&lt;${tag}&gt;</div>
          <div class="bly-sel-text">${text || '(空元素)'}</div>
        </div>
        ${isText ? `
        <div class="bly-row">
          <span class="bly-lbl">文字</span>
          <input class="bly-input" type="text" id="edText" value="${el.textContent.replace(/"/g,'&quot;')}">
        </div>` : ''}
      </div>

      ${isImg ? `
      <div class="bly-sec">
        <div class="bly-sec-title">🖼️ 替换图片</div>
        <div class="bly-img-card" id="edImgUrl">
          <i class="fas fa-link"></i>
          <p><b>粘贴图片链接替换</b></p>
        </div>
      </div>` : ''}

      <div class="bly-sec">
        <div class="bly-sec-title">字体样式</div>
        <div class="bly-row">
          <span class="bly-lbl">字号</span>
          <input class="bly-input" type="range" id="edFS" min="8" max="80" value="${parseInt(cs.fontSize)}">
          <span class="bly-val" id="edFSV">${parseInt(cs.fontSize)}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-lbl">粗细</span>
          <select class="bly-input" id="edFW">
            ${[300,400,500,600,700,800,900].map(w => `<option value="${w}" ${parseInt(cs.fontWeight)===w?'selected':''}>${w}</option>`).join('')}
          </select>
        </div>
        <div class="bly-row">
          <span class="bly-lbl">行高</span>
          <input class="bly-input" type="range" id="edLH" min="0.8" max="3" step="0.1" value="${(parseFloat(cs.lineHeight)/parseFloat(cs.fontSize)||1.5).toFixed(1)}">
          <span class="bly-val" id="edLHV">${(parseFloat(cs.lineHeight)/parseFloat(cs.fontSize)||1.5).toFixed(1)}</span>
        </div>
        <div class="bly-row">
          <span class="bly-lbl">字距</span>
          <input class="bly-input" type="range" id="edLS" min="-2" max="12" step="0.5" value="${parseFloat(cs.letterSpacing)||0}">
          <span class="bly-val" id="edLSV">${parseFloat(cs.letterSpacing)||0}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-lbl">颜色</span>
          <input class="bly-input" type="color" id="edClr" value="${rgbToHex(cs.color)}">
        </div>
      </div>

      <div class="bly-sec">
        <div class="bly-sec-title">背景</div>
        <div class="bly-row">
          <span class="bly-lbl">背景色</span>
          <input class="bly-input" type="color" id="edBg" value="${rgbToHex(cs.backgroundColor)}">
          <button class="bly-btn-sm bly-btn-outline" id="edBgT" style="padding:5px 10px;">透明</button>
        </div>
      </div>

      <div class="bly-sec">
        <div class="bly-sec-title">间距</div>
        <div class="bly-row">
          <span class="bly-lbl">内距</span>
          <input class="bly-input" type="range" id="edPad" min="0" max="100" value="${parseInt(cs.padding)||0}">
          <span class="bly-val" id="edPadV">${parseInt(cs.padding)||0}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-lbl">外距</span>
          <input class="bly-input" type="range" id="edMar" min="0" max="100" value="${parseInt(cs.margin)||0}">
          <span class="bly-val" id="edMarV">${parseInt(cs.margin)||0}px</span>
        </div>
      </div>

      <div class="bly-sec">
        <div class="bly-sec-title">边框 & 圆角</div>
        <div class="bly-row">
          <span class="bly-lbl">圆角</span>
          <input class="bly-input" type="range" id="edBR" min="0" max="50" value="${parseInt(cs.borderRadius)||0}">
          <span class="bly-val" id="edBRV">${parseInt(cs.borderRadius)||0}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-lbl">边框</span>
          <input class="bly-input" type="range" id="edBW" min="0" max="10" value="${parseInt(cs.borderWidth)||0}">
          <span class="bly-val" id="edBWV">${parseInt(cs.borderWidth)||0}px</span>
        </div>
        <div class="bly-row">
          <span class="bly-lbl">边框色</span>
          <input class="bly-input" type="color" id="edBC" value="${rgbToHex(cs.borderColor||'#C8A96E')}">
        </div>
      </div>

      <div class="bly-sec">
        <div class="bly-sec-title">效果</div>
        <div class="bly-row">
          <span class="bly-lbl">透明度</span>
          <input class="bly-input" type="range" id="edOp" min="0" max="1" step="0.05" value="${cs.opacity}">
          <span class="bly-val" id="edOpV">${cs.opacity}</span>
        </div>
        <div class="bly-row">
          <span class="bly-lbl">阴影</span>
          <input class="bly-input" type="range" id="edSh" min="0" max="50" value="0">
          <span class="bly-val" id="edShV">0px</span>
        </div>
      </div>

      <div class="bly-sec">
        <div class="bly-btns">
          <button class="bly-btn" id="edEditTxt">✏️ 编辑文字</button>
          <button class="bly-btn-outline" id="edReset">🔄 重置</button>
          <button class="bly-btn-outline" id="edUndo">↩️ 撤销</button>
          <button class="bly-btn" id="edExport">📦 导出</button>
          <button class="bly-btn-outline" id="edBack">← 返回</button>
        </div>
      </div>
    `;

    // Close
    document.getElementById('blyClose').addEventListener('click', () => togglePanel(false));
    document.getElementById('edBack').addEventListener('click', () => { deselectAll(); renderWelcome(); });

    // Text
    const textInput = document.getElementById('edText');
    if (textInput) textInput.addEventListener('input', () => { el.textContent = textInput.value; });

    // Style bindings
    function bindR(id, vid, fn, s) {
      const i = document.getElementById(id), v = document.getElementById(vid);
      if (i) i.addEventListener('input', () => { v.textContent = i.value + s; fn(i.value); });
    }
    function bindC(id, fn) { const i = document.getElementById(id); if (i) i.addEventListener('input', () => fn(i.value)); }

    bindR('edFS','edFSV', v => el.style.fontSize = v+'px', 'px');
    const fw = document.getElementById('edFW');
    if (fw) fw.addEventListener('change', () => el.style.fontWeight = fw.value);
    bindR('edLH','edLHV', v => el.style.lineHeight = v, '');
    bindR('edLS','edLSV', v => el.style.letterSpacing = v+'px', 'px');
    bindC('edClr', v => el.style.color = v);
    bindC('edBg', v => el.style.backgroundColor = v);
    const bgT = document.getElementById('edBgT');
    if (bgT) bgT.addEventListener('click', () => el.style.backgroundColor = 'transparent');
    bindR('edPad','edPadV', v => el.style.padding = v+'px', 'px');
    bindR('edMar','edMarV', v => el.style.margin = v+'px', 'px');
    bindR('edBR','edBRV', v => el.style.borderRadius = v+'px', 'px');
    bindR('edBW','edBWV', v => {
      const c = document.getElementById('edBC');
      el.style.border = v+'px solid '+(c?c.value:'#C8A96E');
    }, 'px');
    bindC('edBC', v => {
      const w = document.getElementById('edBW');
      el.style.border = (w?w.value:1)+'px solid '+v;
    });
    bindR('edOp','edOpV', v => el.style.opacity = v, '');
    const sh = document.getElementById('edSh');
    const shV = document.getElementById('edShV');
    if (sh) sh.addEventListener('input', () => {
      shV.textContent = sh.value+'px';
      el.style.boxShadow = sh.value > 0 ? '0 '+sh.value+'px '+(sh.value*2)+'px rgba(0,0,0,'+Math.min(sh.value/50,0.5)+')' : 'none';
    });

    // Image replace from panel
    const imgUrl = document.getElementById('edImgUrl');
    if (imgUrl) {
      imgUrl.addEventListener('click', () => {
        const url = prompt('粘贴新图片链接：', el.src);
        if (url && url !== el.src) {
          history.push({ el, prop: 'src', value: el.src });
          el.src = url;
          showToast('图片已替换 ✓');
          renderElementEditor(el);
        }
      });
    }

    // Edit text button
    const editTxtBtn = document.getElementById('edEditTxt');
    if (editTxtBtn) {
      editTxtBtn.addEventListener('click', () => {
        el.contentEditable = true;
        el.focus();
        el.style.outline = '2px solid #C8A96E';
        showToast('正在编辑文字，点击其他地方完成');
        el.addEventListener('blur', function h() {
          el.contentEditable = false;
          el.style.outline = '';
          el.removeEventListener('blur', h);
          showToast('文字已修改 ✓');
        }, { once: true });
      });
    }

    // Reset
    document.getElementById('edReset').addEventListener('click', () => {
      el.style.cssText = '';
      showToast('元素样式已重置');
      renderElementEditor(el);
    });

    // Undo
    document.getElementById('edUndo').addEventListener('click', () => {
      if (history.length > 0) {
        const last = history.pop();
        last.el.style[last.prop] = last.value;
        showToast('已撤销');
      }
    });

    // Export
    document.getElementById('edExport').addEventListener('click', exportChanges);
  }

  // Quick bar buttons
  document.getElementById('qbEdit').addEventListener('click', () => {
    if (!selectedEl) return;
    selectedEl.contentEditable = true;
    selectedEl.focus();
    showToast('正在编辑文字');
    selectedEl.addEventListener('blur', function h() {
      selectedEl.contentEditable = false;
      selectedEl.removeEventListener('blur', h);
      showToast('文字已修改 ✓');
    }, { once: true });
  });
  document.getElementById('qbImg').addEventListener('click', () => {
    if (!selectedEl) return;
    if (selectedEl.tagName === 'IMG') {
      promptImageReplace(selectedEl);
    } else {
      showToast('请选择一张图片');
    }
  });
  document.getElementById('qbColor').addEventListener('click', () => {
    if (!selectedEl) return;
    const c = prompt('输入颜色（如 #C8A96E 或 red）：', rgbToHex(window.getComputedStyle(selectedEl).color));
    if (c) selectedEl.style.color = c;
  });
  document.getElementById('qbSize').addEventListener('click', () => {
    if (!selectedEl) return;
    const s = prompt('输入字号（如 18px）：', window.getComputedStyle(selectedEl).fontSize);
    if (s) selectedEl.style.fontSize = s;
  });
  document.getElementById('qbUndo').addEventListener('click', () => {
    if (history.length > 0) {
      const last = history.pop();
      last.el.style[last.prop] = last.value;
      showToast('已撤销');
    }
  });

  // Export
  function exportChanges() {
    let css = '/* ===== 可视化编辑器导出 ===== */\n\n';
    let count = 0;
    document.querySelectorAll('*').forEach(el => {
      if (isEditorEl(el)) return;
      if (el.style.cssText) {
        const path = getCssPath(el);
        css += path + ' {\n';
        el.style.cssText.split(';').filter(Boolean).forEach(rule => {
          css += '  ' + rule.trim() + ';\n';
        });
        css += '}\n\n';
        count++;
      }
    });
    if (count === 0) { showToast('暂无修改'); return; }

    navigator.clipboard.writeText(css).then(() => {
      showToast('已复制 ' + count + ' 条修改到剪贴板！发给我即可保存');
    }).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = css; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('已复制 ' + count + ' 条修改到剪贴板！');
    });
  }

  function getCssPath(el) {
    if (el.id) return '#' + el.id;
    let path = '', cur = el;
    while (cur && cur !== document.body && cur !== document.documentElement) {
      let sel = cur.tagName.toLowerCase();
      if (cur.id) { path = '#' + cur.id + (path ? ' > ' + path : ''); break; }
      if (cur.className && typeof cur.className === 'string') {
        const cls = cur.className.split(' ').filter(c => c && !c.startsWith('bly-')).slice(0,2).join('.');
        if (cls) sel += '.' + cls;
      }
      path = sel + (path ? ' > ' + path : '');
      cur = cur.parentElement;
    }
    return path || el.tagName.toLowerCase();
  }

  console.log('%c🎨 贝拉利可视化编辑器 v2 已加载', 'color:#C8A96E;font-size:14px;font-weight:bold;');
  console.log('%c点击右下角 ✏️ 按钮 或按 Ctrl+E 打开', 'color:#888;font-size:12px;');
})();
