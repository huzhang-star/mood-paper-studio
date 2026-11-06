(function () {
  'use strict';

  var canvas = document.getElementById('wallpaperCanvas');
  var ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
  var themeGrid = document.getElementById('themeGrid');
  var themeName = document.getElementById('themeName');
  var railMood = document.getElementById('railMood');
  var quoteInput = document.getElementById('quoteInput');
  var quoteCount = document.getElementById('quoteCount');
  var timeToggle = document.getElementById('timeToggle');
  var positionControl = document.getElementById('positionControl');
  var saveButton = document.getElementById('saveButton');
  var shuffleButton = document.getElementById('shuffleButton');
  var quoteButton = document.getElementById('quoteButton');
  var resetButton = document.getElementById('resetButton');
  var toast = document.getElementById('toast');
  var imageModal = document.getElementById('imageModal');
  var resultImage = document.getElementById('resultImage');
  var closeModal = document.getElementById('closeModal');
  var colorInputs = [document.getElementById('colorStart'), document.getElementById('colorEnd'), document.getElementById('colorText')];
  var colorValues = [document.getElementById('colorStartValue'), document.getElementById('colorEndValue'), document.getElementById('colorTextValue')];
  var themes = {
    sunrise: { name: '晨光', mood: '晴朗', start: '#f3a56f', end: '#f6d3a8', text: '#29414a', motif: 'sun', quotes: ['慢慢来，光会找到你。', '今天适合相信一点好事。', '迎着光，去做自己的太阳。'] },
    forest: { name: '松间', mood: '平静', start: '#315a4a', end: '#a9c5a2', text: '#eff1df', motif: 'leaves', quotes: ['风停下来，我也慢下来。', '不必赶路，感受路。', '心有静处，便有归途。'] },
    ocean: { name: '潮汐', mood: '自在', start: '#236c83', end: '#7fc6cf', text: '#f2eee5', motif: 'waves', quotes: ['把烦恼交给远方的潮汐。', '松弛一点，也很好。', '向海风借一点自由。'] },
    berry: { name: '晚霞', mood: '温柔', start: '#9b4665', end: '#df9aa7', text: '#fff4e9', motif: 'petals', quotes: ['愿今天的你，被温柔接住。', '日落之后，也有灯亮着。', '爱具体的生活，也爱自己。'] },
    night: { name: '夜航', mood: '沉静', start: '#111926', end: '#6878aa', text: '#e9e6d8', motif: 'stars', quotes: ['夜色很深，心可以很轻。', '允许自己，暂时没有答案。', '在安静里，听见自己。'] },
    lemon: { name: '柠光', mood: '明亮', start: '#efcf4c', end: '#fbf2aa', text: '#30382f', motif: 'bubbles', quotes: ['给普通日子加一点闪光。', '好心情，正在加载。', '今天也要元气满格。'] }
  };
  var themeOrder = ['sunrise', 'forest', 'ocean', 'berry', 'night', 'lemon'];
  var state = { theme: 'sunrise', showTime: true, position: 'middle', start: '#f3a56f', end: '#f6d3a8', text: '#29414a' };
  var toastTimer = 0;

  function pad(number) { return number < 10 ? '0' + number : String(number); }

  function getDateParts() {
    var now = new Date();
    var week = ['日', '一', '二', '三', '四', '五', '六'];
    return { time: pad(now.getHours()) + ':' + pad(now.getMinutes()), date: pad(now.getMonth() + 1) + '月' + pad(now.getDate()) + '日  星期' + week[now.getDay()] };
  }

  function hexToRgba(hex, alpha) {
    var clean = hex.replace('#', '');
    return 'rgba(' + parseInt(clean.substring(0, 2), 16) + ',' + parseInt(clean.substring(2, 4), 16) + ',' + parseInt(clean.substring(4, 6), 16) + ',' + alpha + ')';
  }

  function roundRect(context, x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + width - radius, y);
    context.quadraticCurveTo(x + width, y, x + width, y + radius);
    context.lineTo(x + width, y + height - radius);
    context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    context.lineTo(x + radius, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();
  }

  function drawMotif(theme) {
    var i;
    var x;
    var y;
    ctx.save();
    ctx.strokeStyle = hexToRgba(state.text, 0.16);
    ctx.fillStyle = hexToRgba(state.text, 0.12);
    ctx.lineWidth = 3;
    if (theme.motif === 'sun') {
      ctx.beginPath(); ctx.arc(900, 450, 290, 0, Math.PI * 2); ctx.fill();
      for (i = 0; i < 5; i += 1) { ctx.beginPath(); ctx.arc(900, 450, 350 + i * 76, 0, Math.PI * 2); ctx.stroke(); }
    } else if (theme.motif === 'waves') {
      for (i = 0; i < 8; i += 1) {
        y = 250 + i * 260;
        ctx.beginPath(); ctx.moveTo(-80, y); ctx.bezierCurveTo(220, y - 170, 420, y + 170, 710, y); ctx.bezierCurveTo(930, y - 130, 1110, y - 30, 1260, y - 100); ctx.stroke();
      }
    } else if (theme.motif === 'leaves') {
      for (i = 0; i < 13; i += 1) {
        x = 100 + (i % 4) * 330; y = 220 + Math.floor(i / 4) * 650;
        ctx.save(); ctx.translate(x, y); ctx.rotate((i % 3 - 1) * 0.35); ctx.beginPath(); ctx.moveTo(0, 0); ctx.bezierCurveTo(120, -120, 230, -55, 210, 70); ctx.bezierCurveTo(90, 100, 25, 80, 0, 0); ctx.fill(); ctx.restore();
      }
    } else if (theme.motif === 'petals') {
      for (i = 0; i < 22; i += 1) {
        x = 80 + ((i * 271) % 1030); y = 110 + ((i * 389) % 2250);
        ctx.save(); ctx.translate(x, y); ctx.rotate(i * 0.71); ctx.beginPath(); ctx.ellipse(0, 0, 18, 55, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      }
    } else if (theme.motif === 'stars') {
      for (i = 0; i < 42; i += 1) { x = 45 + ((i * 211) % 1080); y = 120 + ((i * 317) % 2250); ctx.beginPath(); ctx.arc(x, y, i % 7 === 0 ? 5 : 2.5, 0, Math.PI * 2); ctx.fill(); }
      ctx.beginPath(); ctx.arc(900, 430, 220, 0.25, Math.PI * 1.75); ctx.stroke();
    } else {
      for (i = 0; i < 18; i += 1) { x = 70 + ((i * 239) % 1030); y = 130 + ((i * 353) % 2180); ctx.beginPath(); ctx.arc(x, y, 22 + (i % 4) * 17, 0, Math.PI * 2); ctx.stroke(); }
    }
    ctx.restore();
  }

  function splitLines(context, text, maxWidth) {
    var chars = String(text || '').split('');
    var lines = [];
    var current = '';
    var i;
    for (i = 0; i < chars.length; i += 1) {
      if (chars[i] === '\n') { if (current) lines.push(current); current = ''; }
      else if (context.measureText(current + chars[i]).width > maxWidth && current) { lines.push(current); current = chars[i]; }
      else current += chars[i];
    }
    if (current) lines.push(current);
    return lines.slice(0, 4);
  }

  function renderWallpaper() {
    if (!ctx) return;
    var theme = themes[state.theme];
    var gradient = ctx.createLinearGradient(0, 0, 1170, 2532);
    var date = getDateParts();
    var contentY = state.position === 'top' ? 740 : (state.position === 'bottom' ? 1780 : 1270);
    var quote = quoteInput.value.trim() || '此刻，刚刚好。';
    var lines;
    var i;
    gradient.addColorStop(0, state.start); gradient.addColorStop(1, state.end);
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, 1170, 2532);
    drawMotif(theme);
    ctx.fillStyle = state.text; ctx.textAlign = 'center';
    if (state.showTime) {
      ctx.globalAlpha = 0.96; ctx.font = '300 180px -apple-system, BlinkMacSystemFont, sans-serif'; ctx.fillText(date.time, 585, 310);
      ctx.globalAlpha = 0.72; ctx.font = '500 28px -apple-system, BlinkMacSystemFont, sans-serif'; ctx.fillText(date.date, 585, 370);
    }
    ctx.globalAlpha = 0.72; ctx.font = '600 25px -apple-system, BlinkMacSystemFont, sans-serif';
    roundRect(ctx, 475, contentY - 106, 220, 58, 29); ctx.strokeStyle = hexToRgba(state.text, 0.48); ctx.lineWidth = 2; ctx.stroke(); ctx.fillText('此刻 · ' + theme.mood, 585, contentY - 68);
    ctx.globalAlpha = 1; ctx.font = '700 68px "Songti SC", STSong, serif';
    lines = splitLines(ctx, quote, 840);
    for (i = 0; i < lines.length; i += 1) ctx.fillText(lines[i], 585, contentY + i * 100);
    ctx.globalAlpha = 0.5; ctx.fillRect(540, contentY + lines.length * 100 + 38, 90, 3);
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, sans-serif'; ctx.fillText('MOOD PAPER · ' + theme.name, 585, 2400); ctx.globalAlpha = 1;
  }

  function updateThemeButtons() {
    var buttons = themeGrid.querySelectorAll('[data-theme]');
    var i;
    for (i = 0; i < buttons.length; i += 1) {
      var active = buttons[i].getAttribute('data-theme') === state.theme;
      buttons[i].classList.toggle('is-active', active); buttons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function updateColors() {
    colorInputs[0].value = state.start; colorInputs[1].value = state.end; colorInputs[2].value = state.text;
    colorValues[0].textContent = state.start.toUpperCase(); colorValues[1].textContent = state.end.toUpperCase(); colorValues[2].textContent = state.text.toUpperCase();
    document.documentElement.style.setProperty('--mood-accent', state.start); document.documentElement.style.setProperty('--mood-ink', state.text);
  }

  function updateQuoteCount() { quoteCount.textContent = String(quoteInput.value.length); }

  function persist() {
    try { window.localStorage.setItem('moodPaperState', JSON.stringify({ theme: state.theme, showTime: state.showTime, position: state.position, start: state.start, end: state.end, text: state.text, quote: quoteInput.value })); } catch (error) {}
  }

  function chooseTheme(key, changeQuote) {
    var theme = themes[key];
    if (!theme) return;
    state.theme = key; state.start = theme.start; state.end = theme.end; state.text = theme.text;
    themeName.textContent = theme.name + ' · ' + theme.mood; railMood.textContent = theme.mood;
    if (changeQuote) quoteInput.value = theme.quotes[0];
    updateThemeButtons(); updateColors(); updateQuoteCount(); renderWallpaper(); persist();
  }

  function showToast(message) {
    window.clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('is-visible');
    toastTimer = window.setTimeout(function () { toast.classList.remove('is-visible'); }, 2200);
  }

  function restore() {
    var saved;
    try { saved = JSON.parse(window.localStorage.getItem('moodPaperState') || 'null'); } catch (error) { saved = null; }
    if (!saved || !themes[saved.theme]) return;
    state.theme = saved.theme; state.showTime = saved.showTime !== false; state.position = saved.position === 'top' || saved.position === 'bottom' ? saved.position : 'middle';
    state.start = /^#[0-9a-f]{6}$/i.test(saved.start) ? saved.start : themes[state.theme].start;
    state.end = /^#[0-9a-f]{6}$/i.test(saved.end) ? saved.end : themes[state.theme].end;
    state.text = /^#[0-9a-f]{6}$/i.test(saved.text) ? saved.text : themes[state.theme].text;
    quoteInput.value = String(saved.quote || themes[state.theme].quotes[0]).substring(0, 42);
  }

  function updateControls() {
    var buttons = positionControl.querySelectorAll('[data-position]');
    var i;
    var theme = themes[state.theme];
    themeName.textContent = theme.name + ' · ' + theme.mood; railMood.textContent = theme.mood;
    timeToggle.classList.toggle('is-on', state.showTime); timeToggle.setAttribute('aria-checked', state.showTime ? 'true' : 'false');
    for (i = 0; i < buttons.length; i += 1) buttons[i].classList.toggle('is-active', buttons[i].getAttribute('data-position') === state.position);
    updateThemeButtons(); updateColors(); updateQuoteCount();
  }

  function randomQuote() {
    var quotes = themes[state.theme].quotes;
    var next = quotes[Math.floor(Math.random() * quotes.length)];
    if (quotes.length > 1 && next === quoteInput.value) next = quotes[(quotes.indexOf(next) + 1) % quotes.length];
    quoteInput.value = next; updateQuoteCount(); renderWallpaper(); persist();
  }

  function randomize() {
    var current = themeOrder.indexOf(state.theme);
    var nextIndex = Math.floor(Math.random() * themeOrder.length);
    if (nextIndex === current) nextIndex = (nextIndex + 1) % themeOrder.length;
    chooseTheme(themeOrder[nextIndex], false); randomQuote(); showToast('换了一种心情');
  }

  function openImagePreview(dataUrl) { resultImage.src = dataUrl; imageModal.hidden = false; document.body.classList.add('modal-open'); }
  function closeImagePreview() { imageModal.hidden = true; resultImage.removeAttribute('src'); document.body.classList.remove('modal-open'); }

  function saveWallpaper() {
    if (!ctx) { showToast('当前设备无法生成壁纸'); return; }
    renderWallpaper();
    var dataUrl = canvas.toDataURL('image/jpeg', 0.94);
    var bridge = window.xhs && window.xhs.miniTool;
    saveButton.disabled = true; saveButton.classList.add('is-saving');
    if (bridge && typeof bridge.writeTempFile === 'function' && typeof bridge.saveImageToPhotosAlbum === 'function') {
      bridge.writeTempFile({ data: dataUrl }).then(function (result) { return bridge.saveImageToPhotosAlbum({ filePath: result.filePath }); }).then(function () {
        showToast('壁纸已保存到相册');
      }).catch(function () {
        showToast('保存失败，请检查相册权限');
      }).then(function () {
        saveButton.disabled = false; saveButton.classList.remove('is-saving');
      });
    } else {
      openImagePreview(dataUrl); saveButton.disabled = false; saveButton.classList.remove('is-saving');
    }
  }

  if (!ctx) { document.body.classList.add('canvas-unavailable'); saveButton.disabled = true; showToast('当前设备不支持壁纸预览'); return; }
  restore(); updateControls(); renderWallpaper();
  themeGrid.addEventListener('click', function (event) { var button = event.target.closest ? event.target.closest('[data-theme]') : null; if (button) chooseTheme(button.getAttribute('data-theme'), true); });
  colorInputs.forEach(function (input, index) { input.addEventListener('input', function () { var keys = ['start', 'end', 'text']; state[keys[index]] = input.value; colorValues[index].textContent = input.value.toUpperCase(); if (index === 0) document.documentElement.style.setProperty('--mood-accent', input.value); if (index === 2) document.documentElement.style.setProperty('--mood-ink', input.value); renderWallpaper(); persist(); }); });
  quoteInput.addEventListener('input', function () { updateQuoteCount(); renderWallpaper(); persist(); });
  quoteButton.addEventListener('click', randomQuote); shuffleButton.addEventListener('click', randomize);
  timeToggle.addEventListener('click', function () { state.showTime = !state.showTime; updateControls(); renderWallpaper(); persist(); });
  positionControl.addEventListener('click', function (event) { var button = event.target.closest ? event.target.closest('[data-position]') : null; if (!button) return; state.position = button.getAttribute('data-position'); updateControls(); renderWallpaper(); persist(); });
  resetButton.addEventListener('click', function () { state.showTime = true; state.position = 'middle'; quoteInput.value = themes.sunrise.quotes[0]; chooseTheme('sunrise', false); updateControls(); showToast('已恢复默认样式'); });
  saveButton.addEventListener('click', saveWallpaper); closeModal.addEventListener('click', closeImagePreview);
  imageModal.addEventListener('click', function (event) { if (event.target === imageModal) closeImagePreview(); });
  document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !imageModal.hidden) closeImagePreview(); });
  window.setInterval(function () { if (state.showTime && !document.hidden) renderWallpaper(); }, 30000);
}());
