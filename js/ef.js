/* ============================================================
   EXHAUST FAN TAB — rendering
   ============================================================ */
function renderExhaustFanTab(){
  const el = document.getElementById('efGraphicContainer');
  if(!el || !sim.ef) return;
  const ef = sim.ef;

  const leadSelect = document.getElementById('efLeadSelect');
  if(leadSelect) leadSelect.value = ef.activeFan;

  const totalCfmVal = document.getElementById('efTotalCfm');
  if(totalCfmVal) totalCfmVal.textContent = fmt(ef.cfm, 0) + ' CFM';

  const systemStatusVal = document.getElementById('efSystemStatus');
  if(systemStatusVal){
    if(ef.fanA.fail && ef.fanB.fail){ systemStatusVal.textContent = 'FAULT'; systemStatusVal.style.color = 'var(--red)'; }
    else if(ef.fanA.run || ef.fanB.run){ systemStatusVal.textContent = 'RUNNING'; systemStatusVal.style.color = 'var(--green)'; }
    else if(ef.switching){ systemStatusVal.textContent = 'SWITCHING'; systemStatusVal.style.color = 'var(--amber)'; }
    else { systemStatusVal.textContent = 'OFF'; systemStatusVal.style.color = 'var(--text-faint)'; }
  }

  const dprA = document.getElementById('efDprA'); if(dprA) dprA.textContent = fmt(ef.fanA.damperPos, 0) + '%';
  const dprB = document.getElementById('efDprB'); if(dprB) dprB.textContent = fmt(ef.fanB.damperPos, 0) + '%';
  const swA = document.getElementById('efSwA'); if(swA) swA.textContent = ef.fanA.endSwitch ? 'YES' : 'NO';
  const swB = document.getElementById('efSwB'); if(swB) swB.textContent = ef.fanB.endSwitch ? 'YES' : 'NO';
  const runA = document.getElementById('efRunA'); if(runA) runA.textContent = ef.fanA.run ? 'RUN' : 'OFF';
  const runB = document.getElementById('efRunB'); if(runB) runB.textContent = ef.fanB.run ? 'RUN' : 'OFF';
  const fltA = document.getElementById('efFltA'); if(fltA) fltA.textContent = ef.fanA.fail ? 'FAULT' : 'OK';
  const fltB = document.getElementById('efFltB'); if(fltB) fltB.textContent = ef.fanB.fail ? 'FAULT' : 'OK';

  const ma = document.getElementById('btnToggleFltMotorA'); if(ma) ma.classList.toggle('danger', ef.fanA.fail);
  const mb = document.getElementById('btnToggleFltMotorB'); if(mb) mb.classList.toggle('danger', ef.fanB.fail);
  const da = document.getElementById('btnToggleFltDprA'); if(da) da.classList.toggle('danger', !!activeFaults.efDprAFail);
  const db = document.getElementById('btnToggleFltDprB'); if(db) db.classList.toggle('danger', !!activeFaults.efDprBFail);

  const activeColor = 'var(--green)';
  const flowColor = 'var(--cyan)';
  const angleA = 90 - (ef.fanA.damperPos / 100) * 90;
  const angleB = 90 - (ef.fanB.damperPos / 100) * 90;

  function fanStatus(fan){ return fan.fail ? 'in-alarm' : (fan.run ? 'active' : ''); }

  const fanAGfx = gfxWrap('fan', fanStatus(ef.fanA), 0.85);
  const fanBGfx = gfxWrap('fan', fanStatus(ef.fanB), 0.85);

  const svg = `<svg viewBox="0 0 360 220" width="100%">
    <defs>
      <style>${collectGfxCss(['fan'])}</style>
      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="${flowColor}"/>
      </marker>
    </defs>
    <text x="10" y="100" font-family="Arial" font-size="8" fill="var(--text-dim)" font-weight="bold">FROM EXHAUST VAVs</text>
    <rect x="10" y="110" width="70" height="20" fill="var(--duct)" stroke="var(--line)" stroke-width="1.3"/>
    <path d="M 80,110 L 110,70 L 140,70" fill="none" stroke="var(--line)" stroke-width="1.3"/>
    <path d="M 80,130 L 110,170 L 140,170" fill="none" stroke="var(--line)" stroke-width="1.3"/>
    <text x="110" y="44" font-family="Arial" font-size="8" fill="var(--text-dim)" font-weight="bold">FAN A PATH</text>
    <rect x="110" y="50" width="130" height="20" fill="var(--duct)" stroke="var(--line)" stroke-width="1.3"/>
    <g transform="translate(135, 60)">
      <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="var(--line)" stroke-dasharray="2 2" stroke-width="1"/>
      <line x1="-9" y1="0" x2="9" y2="0" stroke="${ef.fanA.damperPos > 5 ? activeColor : 'var(--text)'}" stroke-width="1.5" transform="rotate(${angleA})"/>
    </g>
    <text x="120" y="82" font-family="Arial" font-size="7.5" fill="var(--text-faint)">DMP A: ${fmt(ef.fanA.damperPos,0)}%</text>
    <g transform="translate(170, 48)">
      <circle cx="0" cy="5" r="2" fill="var(--text)"/><circle cx="15" cy="5" r="2" fill="var(--text)"/>
      <line x1="0" y1="5" x2="13" y2="${ef.fanA.endSwitch ? 5 : -2}" stroke="${ef.fanA.endSwitch ? activeColor : 'var(--text)'}" stroke-width="1.5"/>
      <text x="-5" y="-3" font-family="Arial" font-size="6.5" fill="var(--text-faint)">SW A</text>
    </g>
    <g transform="translate(215, 60)">${fanAGfx}</g>
    <text x="206" y="82" font-family="Arial" font-size="7.5" fill="var(--text-faint)" font-weight="bold">EF-A</text>
    ${ef.fanA.fail ? '<circle cx="215" cy="60" r="16" fill="none" stroke="var(--red)" stroke-width="2" stroke-dasharray="3 3"/>' : ''}
    <text x="110" y="196" font-family="Arial" font-size="8" fill="var(--text-dim)" font-weight="bold">FAN B PATH</text>
    <rect x="110" y="150" width="130" height="20" fill="var(--duct)" stroke="var(--line)" stroke-width="1.3"/>
    <g transform="translate(135, 160)">
      <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="var(--line)" stroke-dasharray="2 2" stroke-width="1"/>
      <line x1="-9" y1="0" x2="9" y2="0" stroke="${ef.fanB.damperPos > 5 ? activeColor : 'var(--text)'}" stroke-width="1.5" transform="rotate(${angleB})"/>
    </g>
    <text x="120" y="145" font-family="Arial" font-size="7.5" fill="var(--text-faint)">DMP B: ${fmt(ef.fanB.damperPos,0)}%</text>
    <g transform="translate(170, 148)">
      <circle cx="0" cy="5" r="2" fill="var(--text)"/><circle cx="15" cy="5" r="2" fill="var(--text)"/>
      <line x1="0" y1="5" x2="13" y2="${ef.fanB.endSwitch ? 5 : -2}" stroke="${ef.fanB.endSwitch ? activeColor : 'var(--text)'}" stroke-width="1.5"/>
      <text x="-5" y="-3" font-family="Arial" font-size="6.5" fill="var(--text-faint)">SW B</text>
    </g>
    <g transform="translate(215, 160)">${fanBGfx}</g>
    <text x="206" y="182" font-family="Arial" font-size="7.5" fill="var(--text-faint)" font-weight="bold">EF-B</text>
    ${ef.fanB.fail ? '<circle cx="215" cy="160" r="16" fill="none" stroke="var(--red)" stroke-width="2" stroke-dasharray="3 3"/>' : ''}
    <path d="M 240,60 L 270,60 L 290,40 L 320,40" fill="none" stroke="var(--line)" stroke-width="1.3"/>
    <path d="M 240,160 L 270,160 L 290,180 L 320,180" fill="none" stroke="var(--line)" stroke-width="1.3"/>
    <rect x="320" y="25" width="20" height="30" fill="var(--duct)" stroke="var(--line)" stroke-width="1.3"/>
    <rect x="320" y="165" width="20" height="30" fill="var(--duct)" stroke="var(--line)" stroke-width="1.3"/>
    <text x="312" y="20" font-family="Arial" font-size="7.5" fill="var(--text-faint)">EXHAUST A</text>
    <text x="312" y="205" font-family="Arial" font-size="7.5" fill="var(--text-faint)">EXHAUST B</text>
    ${ef.fanA.run ? '<path d="M 260,60 L 270,60 L 285,45" fill="none" stroke="'+flowColor+'" stroke-width="2" stroke-linecap="round"/><path d="M 330,40 L 330,28" fill="none" stroke="'+flowColor+'" stroke-width="2" marker-end="url(#arrow)" stroke-linecap="round"/>' : ''}
    ${ef.fanB.run ? '<path d="M 260,160 L 270,160 L 285,175" fill="none" stroke="'+flowColor+'" stroke-width="2" stroke-linecap="round"/><path d="M 330,180 L 330,168" fill="none" stroke="'+flowColor+'" stroke-width="2" marker-end="url(#arrow)" stroke-linecap="round"/>' : ''}
  </svg>`;
  el.innerHTML = svg;
}
