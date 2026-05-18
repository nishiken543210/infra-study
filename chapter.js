document.querySelectorAll('.copy-btn').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const text=btn.dataset.copy.replace(/&#10;/g,'\n');
    try{
      await navigator.clipboard.writeText(text);
      const orig=btn.textContent;
      btn.textContent='✓ コピー済み — 右ターミナルで Cmd+V / Ctrl+V';
      btn.classList.add('copied');
      setTimeout(()=>{btn.textContent=orig;btn.classList.remove('copied');},2000);
    }catch(e){console.error(e);}
  });
});

document.querySelectorAll('[data-copy-ssh]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
    const cmd=document.getElementById('sshCmd');
    if(!cmd)return;
    try{
      await navigator.clipboard.writeText(cmd.textContent.trim());
      btn.textContent='✓';
      btn.classList.add('copied');
      setTimeout(()=>{btn.textContent='📋';btn.classList.remove('copied');},1500);
    }catch(e){console.error(e);}
  });
});

document.querySelectorAll('[data-modal]').forEach(b=>{
  b.addEventListener('click',()=>{
    const m=document.getElementById('modal-'+b.dataset.modal);
    if(m)m.classList.add('open');
  });
});
document.querySelectorAll('[data-close]').forEach(b=>{
  b.addEventListener('click',()=>b.closest('.modal-backdrop').classList.remove('open'));
});
document.querySelectorAll('.modal-backdrop').forEach(m=>{
  m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open');});
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape')document.querySelectorAll('.modal-backdrop.open').forEach(m=>m.classList.remove('open'));
});

const checklistItems=document.querySelectorAll('.checklist-item input');
const checklistProgress=document.getElementById('checklistProgress');
const progressFill=document.getElementById('progressFill');
const progressText=document.getElementById('progressText');
function updateProgress(){
  const done=Array.from(checklistItems).filter(c=>c.checked).length;
  const total=checklistItems.length;
  const pct=Math.round((done/total)*100);
  if(checklistProgress){checklistProgress.textContent=done+' / '+total;checklistProgress.classList.toggle('done',done===total);}
  if(progressFill)progressFill.style.width=pct+'%';
  if(progressText){progressText.textContent=done+' / '+total;progressText.style.color=done===total?'var(--green-text)':'var(--muted)';}
}
checklistItems.forEach(c=>{
  c.addEventListener('change',()=>{c.closest('.checklist-item').classList.toggle('done',c.checked);updateProgress();});
});

