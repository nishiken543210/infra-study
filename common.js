/* common.js — 全ページ共通の機能
   読み込み方：<script src="common.js"></script>
   sidebar.js より前に読み込むこと */

/* ════════════════════════════════
   設定（ここを変えれば全ページに反映）
════════════════════════════════ */
const INFRA_CONFIG = {
  // CloudflareワーカーのURL（変更時はここだけ直す）
  workerUrl: 'https://infra-study-ai.nishiken543210.workers.dev',
  // Guacamole URL
  guacamoleUrl: 'https://infra-study.org/guacamole/',
};

/* ════════════════════════════════
   タブ切り替え
   使い方：onclick="switchTab('content')" / onclick="switchTab('terminal')"
════════════════════════════════ */
function switchTab(name) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById('tab-' + name);
  if (btn) btn.classList.add('active');

  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + name);
  if (panel) panel.classList.add('active');
}

/* ════════════════════════════════
   AIオーバーレイ機能
   使い方：
   - タブバーに <button id="ai-overlay-btn" onclick="toggleAI()"> を追加
   - body直下に ai-overlay-backdrop と ai-overlay-panel を追加
   - <body data-lesson="Chapter 1-3 ..."> でレッスン名を指定
════════════════════════════════ */
function toggleAI() {
  const panel    = document.getElementById('ai-overlay-panel');
  const backdrop = document.getElementById('ai-overlay-backdrop');
  const btn      = document.getElementById('ai-overlay-btn');
  if (!panel) return;
  const isOpen = panel.classList.contains('open');
  panel.classList.toggle('open', !isOpen);
  backdrop.classList.toggle('open', !isOpen);
  if (btn) btn.classList.toggle('active', !isOpen);
  if (!isOpen) {
    setTimeout(() => {
      const input = document.getElementById('ai-input');
      if (input) input.focus();
    }, 300);
  }
}

function closeAI() {
  document.getElementById('ai-overlay-panel')?.classList.remove('open');
  document.getElementById('ai-overlay-backdrop')?.classList.remove('open');
  document.getElementById('ai-overlay-btn')?.classList.remove('active');
}

async function sendAI() {
  const input    = document.getElementById('ai-input');
  const messages = document.getElementById('ai-messages');
  const sendBtn  = document.getElementById('ai-send');
  if (!input || !messages || !sendBtn) return;

  const question = input.value.trim();
  if (!question) return;

  const lesson = document.body.getAttribute('data-lesson') || '不明';

  const userMsg = document.createElement('div');
  userMsg.className = 'ai-msg user';
  userMsg.textContent = question;
  messages.appendChild(userMsg);

  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'ai-msg loading';
  loadingMsg.id = 'ai-loading';
  loadingMsg.textContent = '考え中...';
  messages.appendChild(loadingMsg);

  messages.scrollTop = messages.scrollHeight;
  input.value = '';
  input.style.height = 'auto';
  sendBtn.disabled = true;

  try {
    const res = await fetch(INFRA_CONFIG.workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, lesson })
    });
    const data = await res.json();
    loadingMsg.remove();
    const aiMsg = document.createElement('div');
    aiMsg.className = 'ai-msg ai';
    aiMsg.innerHTML = (data.answer || 'エラーが発生しました').replace(/\n/g, '<br>');
    messages.appendChild(aiMsg);
    messages.scrollTop = messages.scrollHeight;
  } catch (e) {
    loadingMsg.className = 'ai-msg ai';
    loadingMsg.textContent = 'エラーが発生しました。もう一度試してください。';
  } finally {
    sendBtn.disabled = false;
    input.focus();
  }
}

// 後方互換
function toggleHint() { toggleAI(); }
function sendHint()   { sendAI(); }

// Enterキーで送信（ai-input対応）
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('ai-input');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAI(); }
    });
    // テキストエリアの自動高さ調整
    input.addEventListener('input', () => {
      input.style.height = 'auto';
      input.style.height = Math.min(input.scrollHeight, 100) + 'px';
    });
  }
});

/* ════════════════════════════════
   アコーディオン（ステップ形式）
   使い方：toggleStep(this) を step-header の onclick に指定
════════════════════════════════ */
function toggleStep(header) {
  const section = header.closest('.step-section');
  if (!section) return;
  const isOpen = section.classList.contains('open');

  // 同じ親の中の全ステップを閉じる（1つだけ開く場合はこちら）
  // 複数同時に開きたい場合は以下の3行をコメントアウト
  const parent = section.parentElement;
  parent.querySelectorAll('.step-section').forEach(s => s.classList.remove('open'));

  // クリックしたものをトグル
  if (!isOpen) section.classList.add('open');
}
