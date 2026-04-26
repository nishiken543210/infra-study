(function () {
  const css = `
:root { --sidebar-w: 240px; }
.sb-nav {
  width: var(--sidebar-w); min-height: 100vh;
  background: #161b22; border-right: 1px solid #2a3441;
  display: flex; flex-direction: column;
  position: fixed; top: 0; left: 0; overflow-y: auto; z-index: 100;
}
.sb-logo { padding: 20px 18px 16px; border-bottom: 1px solid #2a3441; }
.sb-logo-title { font-size: 13px; font-weight: 500; color: #e6edf3; line-height: 1.4; margin-bottom: 4px; font-family: 'Noto Sans JP', sans-serif; }
.sb-logo-sub { font-size: 11px; color: #9aacbc; font-family: 'Noto Sans JP', sans-serif; }
.sb-section { padding: 10px 0; border-bottom: 1px solid #2a3441; }
.sb-section-label { font-size: 10px; letter-spacing: 0.1em; color: #9aacbc; text-transform: uppercase; padding: 6px 18px 4px; font-family: 'Noto Sans JP', sans-serif; }
.sb-part-hd {
  display: flex; align-items: center; gap: 8px; padding: 8px 18px;
  cursor: pointer; user-select: none; transition: background 0.1s;
  font-size: 12px; font-weight: 500; color: #e2eaf3; font-family: 'Noto Sans JP', sans-serif;
}
.sb-part-hd:hover { background: #1c2230; }
.sb-badge { font-size: 9px; padding: 1px 6px; border-radius: 99px; white-space: nowrap; }
.sb-b-prep    { background: #1c2230; color: #9aacbc; border: 1px solid #2a3441; }
.sb-b-storage { background: #1c1830; color: #bc8cff; border: 1px solid #3a2860; }
.sb-b-network { background: #1c2d3d; color: #58a6ff; border: 1px solid #2a4060; }
.sb-b-ops     { background: #1c2616; color: #3fb950; border: 1px solid #2a4020; }
.sb-chev { font-size: 10px; color: #9aacbc; transition: transform 0.2s; margin-left: auto; }
.sb-chev.open { transform: rotate(90deg); }
.sb-lessons { display: none; }
.sb-lesson {
  display: flex; align-items: center; gap: 6px;
  padding: 5px 14px 5px 26px; font-size: 11px; color: #9aacbc;
  text-decoration: none; transition: background 0.1s;
  border-left: 2px solid transparent; font-family: 'Noto Sans JP', sans-serif;
}
.sb-lesson:hover { background: #1c2230; color: #e2eaf3; }
.sb-lesson.active { color: #58a6ff; border-left-color: #58a6ff; background: #1c2d3d; }
.sb-lesson-num { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #9aacbc; min-width: 22px; flex-shrink: 0; }
.sb-real { font-size: 9px; padding: 1px 5px; border-radius: 99px; background: #1c0e0a; color: #f78166; border: 1px solid #3a1a10; margin-left: auto; flex-shrink: 0; }
.sb-main-wrap { margin-left: var(--sidebar-w) !important; flex: 1; }
`;

  const html = `
<nav class="sb-nav">
  <div class="sb-logo">
    <div class="sb-logo-title">自宅サーバで学ぶ<br>実践インフラ入門</div>
    <div class="sb-logo-sub">infra-study.org</div>
  </div>
  <div class="sb-section">
    <div class="sb-section-label">はじめに</div>
    <a class="sb-lesson" href="index.html" data-id="index.html"><span class="sb-lesson-num">0-1</span>コース概要</a>
    <a class="sb-lesson" href="intro.html" data-id="intro.html"><span class="sb-lesson-num">0-2</span>ログインと基礎コマンド</a>
  </div>
  <div class="sb-section">
    <div class="sb-part-hd" onclick="sbToggle('s1')">
      <span class="sb-badge sb-b-storage">ストレージ</span>Part 1
      <span class="sb-chev" id="sb-sc-s1">›</span>
    </div>
    <div class="sb-lessons" id="sb-sl-s1">
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">1-1</span>ストレージの種類</a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">1-2</span>LUN を作る<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="lesson_iscsi_discovery.html" data-id="lesson_iscsi_discovery.html"><span class="sb-lesson-num">1-3</span>サーバを見つける<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">1-4</span>ログインして認識<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">1-5</span>フォーマット・マウント</a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">1-6</span>容量を拡張する<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">1-7</span>障害シミュレーション<span class="sb-real">実機</span></a>
    </div>
  </div>
  <div class="sb-section">
    <div class="sb-part-hd" onclick="sbToggle('s2')">
      <span class="sb-badge sb-b-network">ネットワーク</span>Part 2
      <span class="sb-chev" id="sb-sc-s2">›</span>
    </div>
    <div class="sb-lessons" id="sb-sl-s2">
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">2-1</span>ブリッジと VLAN</a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">2-2</span>L2 スイッチを作る<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">2-3</span>L3 ルータを作る<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">2-4</span>OSPF / BGP 入門<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">2-5</span>NAT と iptables</a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">2-6</span>パケットを読む<span class="sb-real">実機</span></a>
    </div>
  </div>
  <div class="sb-section">
    <div class="sb-part-hd" onclick="sbToggle('s3')">
      <span class="sb-badge sb-b-ops">統合・運用</span>Part 3
      <span class="sb-chev" id="sb-sc-s3">›</span>
    </div>
    <div class="sb-lessons" id="sb-sl-s3">
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">3-1</span>NW越しにストレージ<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">3-2</span>Proxmox 監視</a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">3-3</span>権限設計<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">3-4</span>I/O 計測<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">3-5</span>障害再現・切り分け<span class="sb-real">実機</span></a>
      <a class="sb-lesson" href="#" data-id=""><span class="sb-lesson-num">3-6</span>マイグレーション<span class="sb-real">実機</span></a>
    </div>
  </div>
</nav>`;

  // CSSを注入
  const styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  // サイドバーをbody先頭に注入
  const navWrap = document.createElement('div');
  navWrap.innerHTML = html;
  document.body.insertBefore(navWrap.firstElementChild, document.body.firstChild);

  // メインコンテンツにsb-main-wrapクラスを付与（bodyの直接の子で最初のmain/divを対象）
  const main = document.querySelector('main') || document.querySelector('body > div:not(.sb-nav)');
  if (main) main.classList.add('sb-main-wrap');

  // アクティブ判定
  const page = document.body.getAttribute('data-page') || '';
  document.querySelectorAll('.sb-lesson[data-id]').forEach(el => {
    if (el.getAttribute('data-id') && el.getAttribute('data-id') === page) {
      el.classList.add('active');
    }
  });

  // 現在ページに対応するPartを自動展開
  const partMap = { 'lesson_iscsi_discovery.html': 's1' };
  const autoOpen = partMap[page] || 's1';
  sbOpenPart(autoOpen);
}());

function sbToggle(id) {
  const el = document.getElementById('sb-sl-' + id);
  const ch = document.getElementById('sb-sc-' + id);
  if (!el) return;
  const open = el.style.display === 'block';
  el.style.display = open ? 'none' : 'block';
  if (ch) ch.classList.toggle('open', !open);
}
function sbOpenPart(id) {
  const el = document.getElementById('sb-sl-' + id);
  const ch = document.getElementById('sb-sc-' + id);
  if (!el) return;
  el.style.display = 'block';
  if (ch) ch.classList.add('open');
}
