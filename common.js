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
   AIヒント機能
   使い方：
   1. <button class="hint-btn" onclick="toggleHint()">🤖 AIにヒントを聞く</button>
   2. <div class="hint-panel" id="hint-panel"> ... </div>
   3. data-lesson属性でレッスン名を指定
      <body data-page="..." data-lesson="Chapter 1-3 iSCSI Discovery">
════════════════════════════════ */
function toggleHint() {
  const panel = document.getElementById('hint-panel');
  if (panel) panel.classList.toggle('open');
}

async function sendHint() {
  const input    = document.getElementById('hint-input');
  const messages = document.getElementById('hint-messages');
  const sendBtn  = document.getElementById('hint-send');
  if (!input || !messages || !sendBtn) return;

  const question = input.value.trim();
  if (!question) return;

  // レッスン名をbody属性から取得
  const lesson = document.body.getAttribute('data-lesson') || '不明';

  // ユーザーメッセージを表示
  const userMsg = document.createElement('div');
  userMsg.className = 'hint-msg user';
  userMsg.textContent = question;
  messages.appendChild(userMsg);

  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'hint-msg loading';
  loadingMsg.id = 'hint-loading';
  loadingMsg.textContent = '考え中...';
  messages.appendChild(loadingMsg);

  messages.scrollTop = messages.scrollHeight;
  input.value = '';
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
    aiMsg.className = 'hint-msg ai';
    aiMsg.innerHTML = (data.answer || 'エラーが発生しました').replace(/\n/g, '<br>');
    messages.appendChild(aiMsg);
    messages.scrollTop = messages.scrollHeight;

  } catch (e) {
    loadingMsg.className = 'hint-msg ai';
    loadingMsg.textContent = 'エラーが発生しました。もう一度試してください。';
  } finally {
    sendBtn.disabled = false;
  }
}

// Enterキーで送信
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('hint-input');
  if (input) {
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') sendHint();
    });
  }
});
