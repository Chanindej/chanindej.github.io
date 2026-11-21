/* Tour player for the ArisAI site (บอส 21 พ.ย.): any element with data-tour="all|desk|phone" opens a pop-up that plays
   the real ArisAI screens in order — the 4D clip, then screenshots — with arrows, thumbnails and auto-advance.
   Pictures: clips/desk/*.jpg (desktop, sample data), clips/phone/*.jpg (iPhone app, sample answers), clips/cube4d.mp4. */
(function () {
  var V = function (src, th, en) { return { v: src, th: th, en: en }; };
  var D = function (n, th, en) { return { i: 'clips/desk/' + n + '.jpg', th: th, en: en }; };
  var P = function (n, th, en) { return { i: 'clips/phone/' + n + '.jpg', th: th, en: en, tall: true }; };
  var CUBE = V('cube4d', '4D Memory Explorer — รูปกิจกรรมจริงของผู้พัฒนาในลูกบาศก์ 4D หมุน ซูม และเปิดดูตามปี', '4D Memory Explorer — the developer\'s own activity photos in a 4D cube: turn, zoom, browse by year');
  /* บอส 21 พ.ย.: Mac = short screenshots first ("ให้เห็นว่าเรามีอะไรบ้าง"), then the 4D clip */
  var DESK = [
    D('1-home', 'ArisAI Desktop — ทุกอย่างอยู่ในหน้าเดียว', 'ArisAI Desktop — everything on one screen'),
    D('4-whoop', 'WHOOP Recovery Center — พื้นตัว การนอน หัวใจ (ค่าตัวอย่าง)', 'WHOOP Recovery Center — recovery, sleep, heart (sample values)'),
    D('5-radio', 'วิทยุ FM ออนไลน์', 'Online FM radio'),
    D('6-hifi', 'DAC Music Player — สั่งได้ทั้งเมาส์ เสียง และท่ามือ', 'DAC Music Player — by mouse, voice or hand gesture'),
    D('7-gesture', 'Gesture Center — สั่งงานด้วยท่ามือ สร้างท่าใหม่ได้เอง', 'Gesture Center — control by hand gestures, record your own'),
    D('2-cube', '4D Memory Explorer — รูป 3,482 รูปเรียงเป็นลูกบาศก์ตามเวลา', '4D Memory Explorer — 3,482 photos arranged in a cube by time'),
    D('3-card4d', 'การ์ด 4D — เลื่อนดูความทรงจำทีละปี', '4D cards — move through memories year by year'),
    CUBE];
  var PHONE = [
    P('1-home', 'แอป ArisAI บน iPhone — แตะหน้าจอแล้วคุยกับอลิสได้เลย', 'ArisAI on iPhone — tap the screen and talk to Aris'),
    P('2-menu', 'เมนู — Travel · Health · Library · Music · Game · Smart Home · Translator', 'Menu — Travel · Health · Library · Music · Game · Smart Home · Translator'),
    P('3-daily', 'ดูแลชีวิตประจำวัน — ตั้งเตือนด้วยคำพูดธรรมดา (คำตอบตัวอย่าง)', 'Daily life — set a reminder in plain words (sample answer)'),
    P('4-learn', 'การเรียนรู้ — ตอบสั้นก่อน รายละเอียดอยู่บนจอ (คำตอบตัวอย่าง)', 'Learning — a short answer first, details on screen (sample answer)'),
    P('5-translate', 'Aris Translator — แปลจากกล้อง พิมพ์หรือพูด และแปลบทสนทนาแบบเรียลไทม์', 'Aris Translator — translate from the camera, by typing or speaking, and live conversations')];
  var TOURS = { all: DESK.concat(PHONE), desk: DESK, phone: PHONE };

  var css = document.createElement('style');
  css.textContent =
    '.tour{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;background:rgba(2,6,16,.9);backdrop-filter:blur(6px);padding:18px}' +
    '.tour.on{display:flex}.tour .in{position:relative;width:min(1180px,100%);border-radius:18px;overflow:hidden;background:#06122a;border:1px solid rgba(90,200,255,.45);box-shadow:0 0 50px rgba(34,211,238,.3)}' +
    '.tour .stage{position:relative;height:min(66vh,640px);background:#000;display:flex;align-items:center;justify-content:center}' +
    '.tour .stage img,.tour .stage video{max-width:100%;max-height:100%;display:block}' +
    '.tour .nav{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.35);background:rgba(0,0,0,.5);color:#fff;font-size:20px;cursor:pointer;z-index:2}' +
    '.tour .prev{left:12px}.tour .next{right:12px}' +
    '.tour .cap{padding:10px 18px 4px;font:14px "IBM Plex Sans Thai",Inter,system-ui,sans-serif;color:#dbe6f8;display:flex;justify-content:space-between;gap:12px}' +
    '.tour .cap small{color:#8fa3c4;font-size:12px;white-space:nowrap}' +
    '.tour .thumbs{display:flex;gap:8px;overflow-x:auto;padding:8px 14px 14px}' +
    '.tour .thumbs button{flex:none;height:54px;border-radius:6px;border:2px solid transparent;padding:0;background:#000;cursor:pointer;opacity:.6;overflow:hidden}' +
    '.tour .thumbs button.on{border-color:#22d3ee;opacity:1}.tour .thumbs img{height:100%;display:block}' +
    '.tour .x{position:absolute;right:10px;top:10px;z-index:3;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.4);background:rgba(0,0,0,.55);color:#fff;font-size:18px;cursor:pointer}' +
    '[data-tour]{cursor:pointer}';
  document.head.appendChild(css);
  var box = document.createElement('div'); box.className = 'tour'; box.setAttribute('role', 'dialog');
  box.innerHTML = '<div class="in"><button class="x" aria-label="close">✕</button><div class="stage"><button class="nav prev" aria-label="previous">‹</button><button class="nav next" aria-label="next">›</button></div><div class="cap"><span class="t"></span><small class="n"></small></div><div class="thumbs"></div></div>';
  document.body.appendChild(box);
  var stage = box.querySelector('.stage'), capT = box.querySelector('.cap .t'), capN = box.querySelector('.cap .n'), thumbs = box.querySelector('.thumbs');
  var list = [], k = 0, timer = null, media = null;
  function en() { return (document.documentElement.lang || 'th').indexOf('en') === 0; }
  function note(it) { return it.v ? (en() ? 'Real screens' : 'หน้าจอจริง') : it.tall ? (en() ? 'iPhone app' : 'แอป iPhone') : 'ArisAI Desktop'; }
  function show(i) {
    clearTimeout(timer); k = (i + list.length) % list.length; var it = list[k];
    if (media) media.remove();
    if (it.v) { media = document.createElement('video'); media.src = 'clips/' + it.v + '.mp4'; media.poster = 'clips/' + it.v + '.jpg'; media.muted = true; media.autoplay = true; media.playsInline = true; media.controls = true;
      media.onended = function () { show(k + 1); }; }
    else { media = document.createElement('img'); media.src = it.i; media.alt = ''; timer = setTimeout(function () { show(k + 1); }, it.tall ? 3000 : 2400); }
    stage.insertBefore(media, stage.firstChild);
    capT.textContent = en() ? it.en : it.th; capN.textContent = note(it) + ' · ' + (k + 1) + '/' + list.length;
    [].forEach.call(thumbs.children, function (b, j) { b.classList.toggle('on', j === k); if (j === k) b.scrollIntoView({ block: 'nearest', inline: 'center' }); });
  }
  function open(name) {
    list = TOURS[name] || TOURS.all; thumbs.innerHTML = '';
    list.forEach(function (it, j) { var b = document.createElement('button'); b.innerHTML = '<img alt="" src="' + (it.v ? 'clips/' + it.v + '.jpg' : it.i) + '">'; b.onclick = function () { show(j); }; thumbs.appendChild(b); });
    box.classList.add('on'); show(0);
  }
  function close() { clearTimeout(timer); if (media) { media.remove(); media = null; } box.classList.remove('on'); }
  box.querySelector('.prev').onclick = function () { show(k - 1); };
  box.querySelector('.next').onclick = function () { show(k + 1); };
  box.addEventListener('click', function (e) { if (e.target === box || e.target.classList.contains('x')) close(); });
  document.addEventListener('keydown', function (e) { if (!box.classList.contains('on')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') show(k + 1); if (e.key === 'ArrowLeft') show(k - 1); });
  document.addEventListener('click', function (e) { var t = e.target.closest && e.target.closest('[data-tour]'); if (!t) return; e.preventDefault(); open(t.getAttribute('data-tour')); });
})();
