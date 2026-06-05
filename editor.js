// ===== BEILARLY VISUAL EDITOR v3 =====
(function() {
  'use strict';

  const CSS = `
    .bly-panel{position:fixed;top:0;right:0;width:360px;height:100vh;background:#111;border-left:2px solid rgba(200,169,110,0.2);z-index:99999;overflow-y:auto;font-family:'Noto Sans SC',sans-serif;transform:translateX(100%);transition:transform .35s cubic-bezier(.4,0,.2,1);box-shadow:-6px 0 40px rgba(0,0,0,.6)}
    .bly-panel.open{transform:translateX(0)}.bly-panel *{box-sizing:border-box}
    .bly-panel-header{padding:18px 22px;background:#0a0a0a;border-bottom:1px solid rgba(200,169,110,.15);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:10}
    .bly-panel-header h3{font-size:.9rem;color:#C8A96E;letter-spacing:2px;margin:0;display:flex;align-items:center;gap:8px}
    .bly-panel-close{width:30px;height:30px;background:rgba(200,169,110,.1);border:none;color:#C8A96E;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center;transition:all .2s}
    .bly-panel-close:hover{background:rgba(200,169,110,.3)}
    .bly-sec{padding:16px 22px;border-bottom:1px solid rgba(200,169,110,.06)}
    .bly-sec-title{font-size:.65rem;letter-spacing:2px;color:#666;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px}
    .bly-sel-info{background:#1a1a1a;padding:12px 14px;margin-bottom:14px;border-radius:4px}
    .bly-sel-tag{font-size:.85rem;color:#C8A96E;font-weight:700}
    .bly-sel-text{font-size:.75rem;color:#666;margin-top:4px;word-break:break-all}
    .bly-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}
    .bly-lbl{font-size:.75rem;color:#aaa;min-width:55px;flex-shrink:0}
    .bly-input{flex:1;padding:7px 10px;background:#1a1a1a;border:1px solid rgba(200,169,110,.1);color:#F5F0EB;font-size:.8rem;font-family:inherit;transition:border-color .2s}
    .bly-input:focus{outline:none;border-color:#C8A96E}
    .bly-input[type="color"]{width:36px;height:32px;padding:2px;cursor:pointer}
    .bly-input[type="range"]{-webkit-appearance:none;height:4px;background:#333;border:none;padding:0;flex:1}
    .bly-input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:#C8A96E;cursor:pointer;box-shadow:0 0 6px rgba(200,169,110,.4)}
    .bly-val{font-size:.7rem;color:#C8A96E;min-width:38px;text-align:right;font-family:'Montserrat',monospace}
    .bly-btn{padding:10px 18px;background:#C8A96E;color:#0a0a0a;border:none;font-size:.78rem;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
    .bly-btn:hover{background:#E8D5B7;transform:translateY(-1px)}
    .bly-btn-sm{padding:7px 14px;font-size:.72rem}
    .bly-btn-outline{padding:10px 18px;background:transparent;color:#C8A96E;border:1px solid rgba(200,169,110,.3);font-size:.78rem;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
    .bly-btn-outline:hover{border-color:#C8A96E;background:rgba(200,169,110,.05)}
    .bly-btns{display:flex;gap:8px;flex-wrap:wrap}
    .bly-img-card{background:#1a1a1a;border:2px dashed rgba(200,169,110,.2);padding:20px;text-align:center;cursor:pointer;transition:all .3s;margin-bottom:14px;border-radius:4px}
    .bly-img-card:hover{border-color:#C8A96E;background:rgba(200,169,110,.05)}
    .bly-img-card i{font-size:2rem;color:#C8A96E;margin-bottom:10px;display:block}
    .bly-img-card p{font-size:.8rem;color:#aaa;margin:0}
    .bly-img-card .hint{font-size:.7rem;color:#666;margin-top:6px}
    .bly-quick-bar{position:fixed;background:#111;border:1px solid rgba(200,169,110,.3);padding:6px;display:flex;gap:4px;z-index:99998;box-shadow:0 4px 20px rgba(0,0,0,.5);border-radius:4px}
    .bly-quick-bar button{width:32px;height:32px;background:rgba(200,169,110,.1);border:none;color:#C8A96E;cursor:pointer;font-size:.85rem;display:flex;align-items:center;justify-content:center;transition:all .2s;border-radius:3px}
    .bly-quick-bar button:hover{background:#C8A96E;color:#0a0a0a}
    .bly-hover{outline:2px dashed rgba(200,169,110,.5)!important;outline-offset:3px;cursor:crosshair!important}
    .bly-selected{outline:2px solid #C8A96E!important;outline-offset:3px}
    .bly-trigger{position:fixed;bottom:30px;right:30px;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#C8A96E,#a8884e);color:#0a0a0a;border:none;font-size:1.5rem;cursor:pointer;z-index:99998;box-shadow:0 6px 30px rgba(200,169,110,.5);transition:all .3s;display:flex;align-items:center;justify-content:center}
    .bly-trigger:hover{transform:scale(1.1) rotate(15deg);box-shadow:0 8px 40px rgba(200,169,110,.7)}
    .bly-toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%) translateY(100px);background:#C8A96E;color:#0a0a0a;padding:14px 32px;font-size:.88rem;font-weight:700;z-index:999999;transition:transform .3s ease;pointer-events:none;border-radius:4px;box-shadow:0 4px 20px rgba(200,169,110,.4)}
    .bly-toast.show{transform:translateX(-50%) translateY(0)}
    .bly-tip{position:fixed;pointer-events:none;background:rgba(10,10,10,.95);color:#C8A96E;padding:5px 12px;font-size:.7rem;z-index:99999;display:none;font-family:'Montserrat',monospace;letter-spacing:1px;border:1px solid rgba(200,169,110,.2);border-radius:3px;white-space:nowrap}
    .bly-layer-picker{position:fixed;background:#111;border:1px solid rgba(200,169,110,.3);padding:8px;z-index:100000;box-shadow:0 8px 40px rgba(0,0,0,.6);border-radius:6px;min-width:260px;max-width:380px;max-height:360px;overflow-y:auto}
    .bly-layer-title{font-size:.7rem;color:#888;letter-spacing:2px;text-transform:uppercase;padding:6px 10px;margin-bottom:4px}
    .bly-layer-item{display:flex;align-items:center;gap:10px;padding:8px 10px;cursor:pointer;border-radius:4px;transition:all .15s;border:1px solid transparent}
    .bly-layer-item:hover{background:rgba(200,169,110,.1);border-color:rgba(200,169,110,.2)}
    .bly-layer-item .tag{font-family:'Montserrat',monospace;font-size:.72rem;color:#C8A96E;background:rgba(200,169,110,.1);padding:2px 8px;border-radius:3px;flex-shrink:0}
    .bly-layer-item .info{font-size:.75rem;color:#aaa;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1}
    .bly-layer-item .preview{width:32px;height:32px;flex-shrink:0;object-fit:cover;border-radius:3px;border:1px solid rgba(200,169,110,.1)}
    .bly-layer-item.is-img{background:rgba(200,169,110,.03)}
    .bly-layer-item.is-img .tag{background:rgba(200,169,110,.2)}
    .bly-step{display:flex;gap:14px;margin-bottom:16px;padding:12px;background:#1a1a1a;border-radius:4px;border-left:3px solid #C8A96E}
    .bly-step-num{width:28px;height:28px;flex-shrink:0;background:#C8A96E;color:#0a0a0a;border-radius:50%;font-size:.8rem;font-weight:700;display:flex;align-items:center;justify-content:center}
    .bly-step-text h5{font-size:.82rem;color:#F5F0EB;margin-bottom:2px}
    .bly-step-text p{font-size:.72rem;color:#888;line-height:1.5;margin:0}
    .bly-guide-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:99997;display:flex;align-items:center;justify-content:center}
    .bly-guide-box{background:#111;border:1px solid rgba(200,169,110,.2);padding:40px;max-width:500px;width:90%;text-align:center;border-radius:8px}
    .bly-guide-box h2{font-size:1.4rem;color:#C8A96E;margin-bottom:20px}
    .bly-guide-box p{font-size:.9rem;color:#aaa;line-height:1.8;margin-bottom:24px}
  `;
  document.head.appendChild(Object.assign(document.createElement('style'), {textContent: CSS}));

  // State
  let selectedEl = null, panelOpen = false, editMode = false;
  const history = [];

  // DOM elements
  const toast = Object.assign(document.createElement('div'), {className: 'bly-toast'});
  const tip = Object.assign(document.createElement('div'), {className: 'bly-tip'});
  const quickBar = Object.assign(document.createElement('div'), {className: 'bly-quick-bar'});
  const trigger = Object.assign(document.createElement('button'), {className: 'bly-trigger', innerHTML: '✏️', title: '打开编辑器 (Ctrl+E)'});
  const panel = Object.assign(document.createElement('div'), {className: 'bly-panel'});
  document.body.append(toast, tip, quickBar, trigger, panel);
  quickBar.style.display = 'none';
  quickBar.innerHTML = '<button id="qbEdit">✏️</button><button id="qbImg">🖼️</button><button id="qbColor">🎨</button><button id="qbSize">↕️</button><button id="qbUndo">↩️</button>';

  function showToast(msg) { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2500); }
  function isEditorEl(el) { return el.closest('.bly-panel,.bly-trigger,.bly-quick-bar,.bly-toast,.bly-tip,.bly-guide-overlay,.bly-layer-picker'); }
  function rgbToHex(rgb) { if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#000000'; if (rgb.startsWith('#')) return rgb.length === 7 ? rgb : '#000000'; const m = rgb.match(/\d+/g); return m && m.length >= 3 ? '#' + m.slice(0,3).map(x => (+x).toString(16).padStart(2,'0')).join('') : '#000000'; }
  function deselectAll() { if (selectedEl) { selectedEl.classList.remove('bly-selected'); selectedEl = null; } quickBar.style.display = 'none'; }

  // Toggle panel
  function togglePanel(open) {
    panelOpen = open !== undefined ? open : !panelOpen;
    panel.classList.toggle('open', panelOpen);
    editMode = panelOpen;
    if (!panelOpen) { deselectAll(); quickBar.style.display = 'none'; }
    if (panelOpen) { renderInspector(); if (!localStorage.getItem('bly_v3_seen')) showGuide(); }
  }
  trigger.addEventListener('click', () => togglePanel());
  document.addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'e') { e.preventDefault(); togglePanel(); } if (e.key === 'Escape' && panelOpen) togglePanel(false); });

  // Guide
  function showGuide() {
    const ov = document.createElement('div');
    ov.className = 'bly-guide-overlay';
    ov.innerHTML = `<div class="bly-guide-box">
      <h2>🎨 可视化编辑器</h2>
      <p>不用写代码，直接在页面上修改</p>
      <div style="text-align:left;margin-bottom:24px">
        <div class="bly-step"><div class="bly-step-num">左键</div><div class="bly-step-text"><h5>点击选中元素</h5><p>选中最上层元素，右侧面板调样式</p></div></div>
        <div class="bly-step"><div class="bly-step-num">右键</div><div class="bly-step-text"><h5>穿透选择底层元素</h5><p>弹出层级菜单，选被盖住的图片等</p></div></div>
        <div class="bly-step"><div class="bly-step-num">双击</div><div class="bly-step-text"><h5>直接编辑文字</h5><p>双击文字即可修改内容</p></div></div>
      </div>
      <button class="bly-btn" id="blyGuideOk">知道了，开始编辑</button>
    </div>`;
    document.body.appendChild(ov);
    ov.querySelector('#blyGuideOk').addEventListener('click', () => { ov.remove(); localStorage.setItem('bly_v3_seen', '1'); });
    ov.addEventListener('click', e => { if (e.target === ov) { ov.remove(); localStorage.setItem('bly_v3_seen', '1'); } });
  }

  // Live inspector (sidebar always shows info)
  function renderInspector(el, mode) {
    if (!panelOpen) return;
    const target = el || null;
    const tag = target ? target.tagName.toLowerCase() : null;
    const cls = target && typeof target.className === 'string' ? target.className.split(' ').filter(c => !c.startsWith('bly-')).slice(0,2).join('.') : '';
    const isImg = tag === 'img';
    const text = target ? target.textContent.trim().substring(0, 60) : '';
    const cs = target ? window.getComputedStyle(target) : null;

    if (!target) {
      // No element - show instructions
      panel.innerHTML = `
        <div class="bly-panel-header"><h3>🔍 元素探测</h3><button class="bly-panel-close" onclick="this.closest('.bly-panel').classList.remove('open')">✕</button></div>
        <div class="bly-sec">
          <div class="bly-sec-title">鼠标移到页面元素上</div>
          <p style="font-size:.82rem;color:#666;line-height:1.8;">侧边栏会实时显示悬停元素的信息。<br>选中后可调样式、换图片、改文字。</p>
        </div>
        <div class="bly-sec">
          <div class="bly-sec-title">操作方式</div>
          <div class="bly-step"><div class="bly-step-num">左键</div><div class="bly-step-text"><h5>选中元素</h5><p>右侧面板调字号、颜色、间距</p></div></div>
          <div class="bly-step"><div class="bly-step-num">右键</div><div class="bly-step-text"><h5>穿透选择</h5><p>选被盖住的图片等底层元素</p></div></div>
          <div class="bly-step"><div class="bly-step-num">双击</div><div class="bly-step-text"><h5>改文字</h5><p>双击文字直接编辑</p></div></div>
        </div>
        <div class="bly-sec">
          <div class="bly-btns">
            <button class="bly-btn" id="blyExportBtn">📦 导出修改</button>
            <button class="bly-btn-outline" id="blyResetBtn">🔄 重置全部</button>
          </div>
        </div>`;
      const eb = document.getElementById('blyExportBtn'); if (eb) eb.addEventListener('click', exportChanges);
      const rb = document.getElementById('blyResetBtn'); if (rb) rb.addEventListener('click', () => { if (confirm('确定重置？')) location.reload(); });
      return;
    }

    // Show element info + editor
    let previewHTML = isImg ? `<img src="${target.src}" style="width:100%;max-height:160px;object-fit:cover;border:1px solid rgba(200,169,110,.1);border-radius:4px;margin-bottom:12px;">` : '';

    panel.innerHTML = `
      <div class="bly-panel-header"><h3>${mode === 'selected' ? '🎨 编辑元素' : '🔍 悬停预览'}</h3><button class="bly-panel-close" onclick="this.closest('.bly-panel').classList.remove('open')">✕</button></div>
      <div class="bly-sec">
        <div class="bly-sel-info">
          <div class="bly-sel-tag">&lt;${tag}${cls ? '.' + cls : ''}&gt;</div>
          <div class="bly-sel-text">${isImg ? '🖼️ 图片' : (text || '空元素')}</div>
        </div>
        ${previewHTML}
        ${mode !== 'selected' ? `<div style="font-size:.75rem;color:#666;">字号: ${parseInt(cs.fontSize)}px · 宽: ${Math.round(target.getBoundingClientRect().width)}px · 高: ${Math.round(target.getBoundingClientRect().height)}px</div>` : ''}
      </div>
      ${mode === 'selected' ? renderEditorControls(target, cs, isImg) : `
      <div class="bly-sec">
        <div class="bly-sec-title">点击此元素进行编辑</div>
        <div class="bly-btns">
          <button class="bly-btn" id="blyExportBtn">📦 导出修改</button>
        </div>
      </div>`}
    `;

    if (mode === 'selected') bindEditorEvents(target, cs);
    const eb = document.getElementById('blyExportBtn'); if (eb) eb.addEventListener('click', exportChanges);
  }

  function renderEditorControls(el, cs, isImg) {
    return `
      ${isImg ? `<div class="bly-sec"><div class="bly-sec-title">🖼️ 替换图片</div>
        <div class="bly-img-card" id="edImgUrl"><i class="fas fa-link"></i><p><b>粘贴图片链接替换</b></p><p class="hint">或点击上传本地图片</p></div>
        <input type="file" id="edFileInput" accept="image/*" style="display:none;">
      </div>` : ''}
      <div class="bly-sec">
        <div class="bly-sec-title">字体</div>
        <div class="bly-row"><span class="bly-lbl">字号</span><input class="bly-input" type="range" id="edFS" min="8" max="80" value="${parseInt(cs.fontSize)}"><span class="bly-val" id="edFSV">${parseInt(cs.fontSize)}px</span></div>
        <div class="bly-row"><span class="bly-lbl">粗细</span><select class="bly-input" id="edFW">${[300,400,500,600,700,800,900].map(w => `<option value="${w}" ${parseInt(cs.fontWeight)===w?'selected':''}>${w}</option>`).join('')}</select></div>
        <div class="bly-row"><span class="bly-lbl">行高</span><input class="bly-input" type="range" id="edLH" min="0.8" max="3" step="0.1" value="${(parseFloat(cs.lineHeight)/parseFloat(cs.fontSize)||1.5).toFixed(1)}"><span class="bly-val" id="edLHV">${(parseFloat(cs.lineHeight)/parseFloat(cs.fontSize)||1.5).toFixed(1)}</span></div>
        <div class="bly-row"><span class="bly-lbl">字距</span><input class="bly-input" type="range" id="edLS" min="-2" max="12" step="0.5" value="${parseFloat(cs.letterSpacing)||0}"><span class="bly-val" id="edLSV">${parseFloat(cs.letterSpacing)||0}px</span></div>
        <div class="bly-row"><span class="bly-lbl">颜色</span><input class="bly-input" type="color" id="edClr" value="${rgbToHex(cs.color)}"></div>
      </div>
      <div class="bly-sec">
        <div class="bly-sec-title">背景</div>
        <div class="bly-row"><span class="bly-lbl">背景色</span><input class="bly-input" type="color" id="edBg" value="${rgbToHex(cs.backgroundColor)}"><button class="bly-btn-sm bly-btn-outline" id="edBgT" style="padding:5px 10px;">透明</button></div>
      </div>
      <div class="bly-sec">
        <div class="bly-sec-title">间距</div>
        <div class="bly-row"><span class="bly-lbl">内距</span><input class="bly-input" type="range" id="edPad" min="0" max="100" value="${parseInt(cs.padding)||0}"><span class="bly-val" id="edPadV">${parseInt(cs.padding)||0}px</span></div>
        <div class="bly-row"><span class="bly-lbl">外距</span><input class="bly-input" type="range" id="edMar" min="0" max="100" value="${parseInt(cs.margin)||0}"><span class="bly-val" id="edMarV">${parseInt(cs.margin)||0}px</span></div>
      </div>
      <div class="bly-sec">
        <div class="bly-sec-title">边框 & 圆角</div>
        <div class="bly-row"><span class="bly-lbl">圆角</span><input class="bly-input" type="range" id="edBR" min="0" max="50" value="${parseInt(cs.borderRadius)||0}"><span class="bly-val" id="edBRV">${parseInt(cs.borderRadius)||0}px</span></div>
        <div class="bly-row"><span class="bly-lbl">边框</span><input class="bly-input" type="range" id="edBW" min="0" max="10" value="${parseInt(cs.borderWidth)||0}"><span class="bly-val" id="edBWV">${parseInt(cs.borderWidth)||0}px</span></div>
        <div class="bly-row"><span class="bly-lbl">边框色</span><input class="bly-input" type="color" id="edBC" value="${rgbToHex(cs.borderColor||'#C8A96E')}"></div>
      </div>
      <div class="bly-sec">
        <div class="bly-sec-title">效果</div>
        <div class="bly-row"><span class="bly-lbl">透明度</span><input class="bly-input" type="range" id="edOp" min="0" max="1" step="0.05" value="${cs.opacity}"><span class="bly-val" id="edOpV">${cs.opacity}</span></div>
        <div class="bly-row"><span class="bly-lbl">阴影</span><input class="bly-input" type="range" id="edSh" min="0" max="50" value="0"><span class="bly-val" id="edShV">0px</span></div>
      </div>
      <div class="bly-sec">
        <div class="bly-btns">
          <button class="bly-btn" id="edEditTxt">✏️ 编辑文字</button>
          <button class="bly-btn-outline" id="edReset">🔄 重置</button>
          <button class="bly-btn-outline" id="edUndo">↩️ 撤销</button>
          <button class="bly-btn" id="edExport">📦 导出</button>
        </div>
      </div>`;
  }

  function bindEditorEvents(el, cs) {
    function bindR(id, vid, fn, s) { const i = document.getElementById(id), v = document.getElementById(vid); if (i) i.addEventListener('input', () => { v.textContent = i.value + s; fn(i.value); }); }
    function bindC(id, fn) { const i = document.getElementById(id); if (i) i.addEventListener('input', () => fn(i.value)); }

    // Text
    const et = document.getElementById('edEditTxt');
    if (et) et.addEventListener('click', () => {
      el.contentEditable = true; el.focus(); el.style.outline = '2px solid #C8A96E';
      showToast('正在编辑文字，点击其他地方完成');
      el.addEventListener('blur', function h() { el.contentEditable = false; el.style.outline = ''; el.removeEventListener('blur', h); showToast('文字已修改 ✓'); }, {once: true});
    });

    // Image replace
    const imgUrl = document.getElementById('edImgUrl');
    const fileInput = document.getElementById('edFileInput');
    if (imgUrl) imgUrl.addEventListener('click', () => {
      const url = prompt('粘贴新图片链接：', el.src);
      if (url && url !== el.src) { history.push({el, prop:'src', value:el.src}); el.src = url; showToast('图片已替换 ✓'); renderInspector(el, 'selected'); }
    });
    if (fileInput) {
      imgUrl.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) { const r = new FileReader(); r.onload = ev => { history.push({el, prop:'src', value:el.src}); el.src = ev.target.result; showToast('图片已替换 ✓'); renderInspector(el, 'selected'); }; r.readAsDataURL(file); }
      });
    }

    // Style bindings
    bindR('edFS','edFSV', v => el.style.fontSize = v+'px', 'px');
    const fw = document.getElementById('edFW'); if (fw) fw.addEventListener('change', () => el.style.fontWeight = fw.value);
    bindR('edLH','edLHV', v => el.style.lineHeight = v, '');
    bindR('edLS','edLSV', v => el.style.letterSpacing = v+'px', 'px');
    bindC('edClr', v => el.style.color = v);
    bindC('edBg', v => el.style.backgroundColor = v);
    const bgT = document.getElementById('edBgT'); if (bgT) bgT.addEventListener('click', () => el.style.backgroundColor = 'transparent');
    bindR('edPad','edPadV', v => el.style.padding = v+'px', 'px');
    bindR('edMar','edMarV', v => el.style.margin = v+'px', 'px');
    bindR('edBR','edBRV', v => el.style.borderRadius = v+'px', 'px');
    bindR('edBW','edBWV', v => { const c = document.getElementById('edBC'); el.style.border = v+'px solid '+(c?c.value:'#C8A96E'); }, 'px');
    bindC('edBC', v => { const w = document.getElementById('edBW'); el.style.border = (w?w.value:1)+'px solid '+v; });
    bindR('edOp','edOpV', v => el.style.opacity = v, '');
    const sh = document.getElementById('edSh'), shV = document.getElementById('edShV');
    if (sh) sh.addEventListener('input', () => { shV.textContent = sh.value+'px'; el.style.boxShadow = sh.value > 0 ? `0 ${sh.value}px ${sh.value*2}px rgba(0,0,0,${Math.min(sh.value/50,.5)})` : 'none'; });

    // Reset / Undo / Export
    const rst = document.getElementById('edReset'); if (rst) rst.addEventListener('click', () => { el.style.cssText = ''; showToast('已重置'); renderInspector(el, 'selected'); });
    const und = document.getElementById('edUndo'); if (und) und.addEventListener('click', () => { if (history.length) { const h = history.pop(); h.el.style[h.prop] = h.value; showToast('已撤销'); } });
    const exp = document.getElementById('edExport'); if (exp) exp.addEventListener('click', exportChanges);
  }

  // Hover → update sidebar
  document.addEventListener('mouseover', function(e) {
    if (!editMode || isEditorEl(e.target) || selectedEl) return;
    e.target.classList.add('bly-hover');
    const rect = e.target.getBoundingClientRect();
    tip.textContent = e.target.tagName.toLowerCase() + (typeof e.target.className === 'string' && e.target.className ? '.' + e.target.className.split(' ').filter(c => !c.startsWith('bly-'))[0] : '');
    tip.style.display = 'block'; tip.style.left = rect.left + 'px'; tip.style.top = (rect.top - 26) + 'px';
    renderInspector(e.target, 'hover');
  }, true);
  document.addEventListener('mouseout', function(e) { e.target.classList.remove('bly-hover'); tip.style.display = 'none'; }, true);

  // Left click → select directly
  document.addEventListener('click', function(e) {
    if (!editMode || isEditorEl(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    deselectAll();
    selectedEl = e.target;
    selectedEl.classList.add('bly-selected');
    const rect = selectedEl.getBoundingClientRect();
    quickBar.style.display = 'flex'; quickBar.style.left = rect.left + 'px'; quickBar.style.top = (rect.top - 44) + 'px';
    renderInspector(selectedEl, 'selected');
  }, true);

  // Right click → layer picker
  document.addEventListener('contextmenu', function(e) {
    if (!editMode || isEditorEl(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    const x = e.clientX, y = e.clientY;
    const els = document.elementsFromPoint(x, y).filter(el => !isEditorEl(el) && el !== document.body && el !== document.documentElement);
    if (els.length <= 1) { if (els.length === 1) { deselectAll(); selectedEl = els[0]; selectedEl.classList.add('bly-selected'); renderInspector(selectedEl, 'selected'); } return; }

    // Show layer picker
    const old = document.querySelector('.bly-layer-picker'); if (old) old.remove();
    const picker = document.createElement('div');
    picker.className = 'bly-layer-picker';
    picker.style.left = Math.min(x + 10, window.innerWidth - 400) + 'px';
    picker.style.top = Math.min(y + 10, window.innerHeight - 380) + 'px';

    let html = '<div class="bly-layer-title">🔍 右键穿透 — 点击选择</div>';
    els.forEach((el, i) => {
      const tag = el.tagName.toLowerCase();
      const cls = typeof el.className === 'string' ? el.className.split(' ').filter(c => !c.startsWith('bly-')).slice(0,2).join('.') : '';
      const isImg = tag === 'img';
      html += `<div class="bly-layer-item ${isImg?'is-img':''}" data-idx="${i}"><span class="tag">${tag}${cls?'.'+cls:''}</span><span class="info">${isImg?'🖼️ 图片':(el.textContent.trim().substring(0,30)||tag+cls)}</span>${isImg?`<img class="preview" src="${el.src}">`:''}</div>`;
    });
    picker.innerHTML = html;
    document.body.appendChild(picker);

    // Handle clicks inside picker - capture phase
    picker.addEventListener('click', function(ev) {
      ev.stopPropagation(); ev.stopImmediatePropagation();
      const item = ev.target.closest('.bly-layer-item');
      if (item) { const idx = parseInt(item.dataset.idx); picker.remove(); deselectAll(); selectedEl = els[idx]; selectedEl.classList.add('bly-selected'); renderInspector(selectedEl, 'selected'); }
    }, true);

    // Close on outside
    setTimeout(() => {
      function close(ev) { if (!picker.contains(ev.target)) { picker.remove(); document.removeEventListener('click', close, true); document.removeEventListener('contextmenu', close, true); } }
      document.addEventListener('click', close, true);
      document.addEventListener('contextmenu', close, true);
    }, 50);
  }, true);

  // Double click → edit text
  document.addEventListener('dblclick', function(e) {
    if (!editMode || isEditorEl(e.target)) return;
    e.preventDefault(); e.stopPropagation();
    e.target.contentEditable = true; e.target.focus(); e.target.style.outline = '2px solid #C8A96E';
    showToast('正在编辑文字，点击其他地方完成');
    e.target.addEventListener('blur', function h() { e.target.contentEditable = false; e.target.style.outline = ''; e.target.removeEventListener('blur', h); showToast('文字已修改 ✓'); }, {once: true});
  }, true);

  // Quick bar buttons
  quickBar.querySelector('#qbEdit').addEventListener('click', () => { if (!selectedEl) return; selectedEl.contentEditable = true; selectedEl.focus(); showToast('正在编辑文字'); selectedEl.addEventListener('blur', function h() { selectedEl.contentEditable = false; selectedEl.removeEventListener('blur', h); showToast('已修改 ✓'); }, {once: true}); });
  quickBar.querySelector('#qbImg').addEventListener('click', () => { if (!selectedEl) return; if (selectedEl.tagName === 'IMG') { const url = prompt('粘贴新图片链接：', selectedEl.src); if (url && url !== selectedEl.src) { history.push({el:selectedEl, prop:'src', value:selectedEl.src}); selectedEl.src = url; showToast('图片已替换 ✓'); } } else { showToast('请右键选择一张图片'); } });
  quickBar.querySelector('#qbColor').addEventListener('click', () => { if (!selectedEl) return; const c = prompt('输入颜色（如 #C8A96E）：', rgbToHex(getComputedStyle(selectedEl).color)); if (c) selectedEl.style.color = c; });
  quickBar.querySelector('#qbSize').addEventListener('click', () => { if (!selectedEl) return; const s = prompt('输入字号（如 18px）：', getComputedStyle(selectedEl).fontSize); if (s) selectedEl.style.fontSize = s; });
  quickBar.querySelector('#qbUndo').addEventListener('click', () => { if (history.length) { const h = history.pop(); h.el.style[h.prop] = h.value; showToast('已撤销'); } });

  // Export
  function exportChanges() {
    let css = '/* ===== 可视化编辑器导出 ===== */\n\n'; let count = 0;
    document.querySelectorAll('*').forEach(el => {
      if (isEditorEl(el) || !el.style.cssText) return;
      let path = ''; let cur = el;
      while (cur && cur !== document.body && cur !== document.documentElement) {
        let sel = cur.tagName.toLowerCase();
        if (cur.id) { path = '#' + cur.id + (path ? ' > ' + path : ''); break; }
        if (typeof cur.className === 'string') { const c = cur.className.split(' ').filter(x => x && !x.startsWith('bly-')).slice(0,2).join('.'); if (c) sel += '.' + c; }
        path = sel + (path ? ' > ' + path : ''); cur = cur.parentElement;
      }
      css += (path || el.tagName.toLowerCase()) + ' {\n';
      el.style.cssText.split(';').filter(Boolean).forEach(r => { css += '  ' + r.trim() + ';\n'; });
      css += '}\n\n'; count++;
    });
    if (!count) { showToast('暂无修改'); return; }
    navigator.clipboard.writeText(css).then(() => showToast('已复制 ' + count + ' 条修改到剪贴板！发给我即可保存')).catch(() => { const ta = document.createElement('textarea'); ta.value = css; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast('已复制到剪贴板！'); });
  }

  console.log('%c🎨 贝拉利可视化编辑器 v3', 'color:#C8A96E;font-size:14px;font-weight:bold;');
  console.log('%c左键选中 | 右键穿透 | 双击改字 | Ctrl+E 开关', 'color:#888;font-size:12px;');
})();
