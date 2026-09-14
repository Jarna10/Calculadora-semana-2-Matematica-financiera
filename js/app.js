/**
 * CONTROLADOR PRINCIPAL DE LA APLICACIÓN SPA
 * Vincula la UI, navegaciones, eventos de formularios y simulador BA II Plus.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. INICIALIZAR SIMULADOR BA II PLUS
  const baiiCalc = new BAIIPlusCalculator();

  function updateBaiiUI(stepReason = null) {
    const lcdDisplay = document.getElementById('lcd-display');
    const lcd2nd = document.getElementById('lcd-2nd');
    const lcdCpt = document.getElementById('lcd-cpt');

    lcdDisplay.innerText = baiiCalc.currentInput !== "0" ? baiiCalc.currentInput : baiiCalc.displayMessage;
    lcd2nd.style.opacity = baiiCalc.is2ndActive ? "1" : "0.2";
    lcdCpt.style.opacity = baiiCalc.isCptActive ? "1" : "0.2";

    // Actualizar campos del panel rápido (sin sobrescribir si el usuario está escribiendo)
    const activeEl = document.activeElement;
    if (activeEl?.id !== 'quick-n') document.getElementById('quick-n').value = baiiCalc.N ? baiiCalc.N.toFixed(4) : '';
    if (activeEl?.id !== 'quick-t') document.getElementById('quick-t').value = (baiiCalc.CY && baiiCalc.N) ? (baiiCalc.N / baiiCalc.CY).toFixed(4) : '';
    if (activeEl?.id !== 'quick-iy') document.getElementById('quick-iy').value = baiiCalc.IY ? baiiCalc.IY.toFixed(4) : '';
    if (activeEl?.id !== 'quick-pv') document.getElementById('quick-pv').value = baiiCalc.PV ? Math.abs(baiiCalc.PV).toFixed(2) : '';
    if (activeEl?.id !== 'quick-fv') document.getElementById('quick-fv').value = baiiCalc.FV ? Math.abs(baiiCalc.FV).toFixed(2) : '';
    if (activeEl?.id !== 'quick-cy' && baiiCalc.CY) document.getElementById('quick-cy').value = baiiCalc.CY;

    // Calcular valores secundarios para el resumen
    const cy = baiiCalc.CY || 1;
    const iPct = (baiiCalc.IY / cy);
    const iDec = iPct / 100;
    const interest = Math.abs(baiiCalc.FV) - Math.abs(baiiCalc.PV);

    document.getElementById('tvm-val-i').innerText = `${iPct.toFixed(4)}% ${cy === 12 ? 'mensual' : cy === 4 ? 'trimestral' : cy === 2 ? 'semestral' : 'periódica'}`;
    document.getElementById('tvm-val-interest').innerText = FinMath.formatMoney(interest > 0 ? interest : 0);

    // Generar explicación matemática paso a paso si hay datos
    renderTvmSteps(stepReason);
  }

  function renderTvmSteps(targetVar = null) {
    const stepsContainer = document.getElementById('tvm-steps-detail');
    if (!stepsContainer) return;

    const cy = baiiCalc.CY || 12;
    const iy = baiiCalc.IY || 0;
    const t = (baiiCalc.N && cy) ? (baiiCalc.N / cy) : 0;
    const N = baiiCalc.N || 0;
    const pv = Math.abs(baiiCalc.PV || 0);
    const fv = Math.abs(baiiCalc.FV || 0);
    const iPct = iy / cy;
    const iDec = iPct / 100;

    let html = `
      <div style="font-family: var(--font-mono); margin-bottom: 8px;">
        <strong>Fórmula de Valor Futuro:</strong><br>
        <span style="color:#38bdf8;">VF = VP × (1 + I/Y / C/Y)^(C/Y × t)</span>
      </div>
      <div class="step-item">
        <div class="step-title">Paso 1: Tasa de Interés por Período (i):</div>
        <div class="step-formula">i = (I/Y) / C/Y = ${iy}% / ${cy} = ${iPct.toFixed(4)}% = ${iDec.toFixed(6)}</div>
      </div>
      <div class="step-item">
        <div class="step-title">Paso 2: Número Total de Períodos (N):</div>
        <div class="step-formula">N = C/Y × t = ${cy} × ${t.toFixed(2)} años = ${N.toFixed(2)} períodos</div>
      </div>
    `;

    if (targetVar === 'FV' || fv > 0) {
      html += `
        <div class="step-item">
          <div class="step-title">Paso 3: Calcular el Valor Futuro (VF):</div>
          <div class="step-formula">VF = ${FinMath.formatMoney(pv)} × (1 + ${iDec.toFixed(6)})^${N.toFixed(2)} = <strong>${FinMath.formatMoney(fv)}</strong></div>
        </div>
      `;
    } else if (targetVar === 'PV') {
      html += `
        <div class="step-item">
          <div class="step-title">Paso 3: Calcular el Valor Presente (VP):</div>
          <div class="step-formula">VP = ${FinMath.formatMoney(fv)} / (1 + ${iDec.toFixed(6)})^${N.toFixed(2)} = <strong>${FinMath.formatMoney(pv)}</strong></div>
        </div>
      `;
    } else if (targetVar === 'N') {
      html += `
        <div class="step-item">
          <div class="step-title">Paso 3: Calcular el Número de Períodos (N):</div>
          <div class="step-formula">N = ln(${FinMath.formatMoney(fv)} / ${FinMath.formatMoney(pv)}) / ln(1 + ${iDec.toFixed(6)}) = <strong>${N.toFixed(4)}</strong> (${t.toFixed(2)} años)</div>
        </div>
      `;
    } else if (targetVar === 'IY') {
      html += `
        <div class="step-item">
          <div class="step-title">Paso 3: Calcular Tasa Nominal (I/Y):</div>
          <div class="step-formula">I/Y = C/Y × [(${FinMath.formatMoney(fv)} / ${FinMath.formatMoney(pv)})^(1/${N.toFixed(2)}) - 1] = <strong>${iy.toFixed(4)}%</strong></div>
        </div>
      `;
    }

    stepsContainer.innerHTML = html;
  }

  // Event Listeners para Inputs Rápidos
  document.getElementById('quick-cy')?.addEventListener('change', (e) => {
    baiiCalc.setFrequency(e.target.value);
    updateBaiiUI();
  });

  document.getElementById('quick-t')?.addEventListener('input', (e) => {
    const years = parseFloat(e.target.value) || 0;
    baiiCalc.N = years * (baiiCalc.CY || 12);
    updateBaiiUI();
  });

  document.getElementById('quick-n')?.addEventListener('input', (e) => {
    baiiCalc.N = parseFloat(e.target.value) || 0;
    updateBaiiUI();
  });

  document.getElementById('quick-iy')?.addEventListener('input', (e) => {
    baiiCalc.IY = parseFloat(e.target.value) || 0;
    updateBaiiUI();
  });

  document.getElementById('quick-pv')?.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value) || 0;
    baiiCalc.PV = -Math.abs(val);
    updateBaiiUI();
  });

  document.getElementById('quick-fv')?.addEventListener('input', (e) => {
    baiiCalc.FV = parseFloat(e.target.value) || 0;
    updateBaiiUI();
  });

  // Botones de CPT Rápidos
  document.getElementById('btn-quick-cpt-fv')?.addEventListener('click', () => {
    baiiCalc.computeVariable('FV');
    updateBaiiUI('FV');
  });

  document.getElementById('btn-quick-cpt-pv')?.addEventListener('click', () => {
    baiiCalc.computeVariable('PV');
    updateBaiiUI('PV');
  });

  document.getElementById('btn-quick-cpt-iy')?.addEventListener('click', () => {
    baiiCalc.computeVariable('IY');
    updateBaiiUI('IY');
  });

  document.getElementById('btn-quick-cpt-n')?.addEventListener('click', () => {
    baiiCalc.computeVariable('N');
    updateBaiiUI('N');
  });


  // Teclado BA II Plus
  document.querySelectorAll('.num-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      baiiCalc.inputDigit(btn.getAttribute('data-val'));
      updateBaiiUI();
    });
  });

  document.getElementById('btn-dot')?.addEventListener('click', () => {
    baiiCalc.inputDot();
    updateBaiiUI();
  });

  document.getElementById('btn-sign')?.addEventListener('click', () => {
    baiiCalc.toggleSign();
    updateBaiiUI();
  });

  document.getElementById('btn-ce')?.addEventListener('click', () => {
    baiiCalc.clearEntry();
    updateBaiiUI();
  });

  document.getElementById('btn-2nd')?.addEventListener('click', () => {
    baiiCalc.press2ND();
    updateBaiiUI();
  });

  document.getElementById('btn-cpt')?.addEventListener('click', () => {
    baiiCalc.pressCPT();
    updateBaiiUI();
  });

  ['N', 'IY', 'PV', 'PMT', 'FV'].forEach(key => {
    const btnId = `btn-${key.toLowerCase()}`;
    document.getElementById(btnId)?.addEventListener('click', () => {
      baiiCalc.handleTVMKey(key);
      updateBaiiUI();
    });
  });

  updateBaiiUI();

  // 2. NAVEGACIÓN ENTRE PESTAÑAS PRINCIPALES
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      document.getElementById(targetId)?.classList.add('active');

      if (targetId === 'tab-chart') {
        renderGrowthChart();
      }
    });
  });

  // NAVEGACIÓN ENTRE SUB-PESTAÑAS
  const subTabs = document.querySelectorAll('.sub-tab');
  const subTabContents = document.querySelectorAll('.sub-tab-content');

  subTabs.forEach(st => {
    st.addEventListener('click', () => {
      subTabs.forEach(t => t.classList.remove('active'));
      subTabContents.forEach(c => c.style.display = 'none');

      st.classList.add('active');
      const subTargetId = st.getAttribute('data-subtab');
      document.getElementById(subTargetId).style.display = 'block';
    });
  });

  // 3. FORMULARIOS DE CALCULADORAS ESPECIALIZADAS

  // VALOR FUTURO (VF)
  document.getElementById('form-fv')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pv = parseFloat(document.getElementById('fv-pv').value);
    const iy = parseFloat(document.getElementById('fv-iy').value);
    const cy = parseFloat(document.getElementById('fv-cy').value);
    const years = parseFloat(document.getElementById('fv-years').value);

    const res = FinMath.calculateFV(pv, iy, cy, years);

    document.getElementById('res-fv-val').innerText = FinMath.formatMoney(res.fv);
    document.getElementById('res-fv-interest').innerText = FinMath.formatMoney(res.interest);
    document.getElementById('res-fv-ipct').innerText = `${res.iPct.toFixed(4)}%`;
    document.getElementById('res-fv-n').innerText = res.N.toFixed(2);

    document.getElementById('fv-steps-content').innerHTML = `
      <div class="step-item">
        <div class="step-title">1. Calcular Tasa Periódica (i):</div>
        <div class="step-formula">i = (I/Y) / C/Y = ${iy}% / ${cy} = ${res.iPct.toFixed(6)}% = ${(res.iPct/100).toFixed(6)}</div>
      </div>
      <div class="step-item">
        <div class="step-title">2. Calcular Número de Períodos (N):</div>
        <div class="step-formula">N = C/Y * t = ${cy} * ${years} = ${res.N} períodos</div>
      </div>
      <div class="step-item">
        <div class="step-title">3. Aplicar Fórmula de Valor Futuro:</div>
        <div class="step-formula">VF = ${FinMath.formatMoney(pv)} * (1 + ${(res.iPct/100).toFixed(6)})^${res.N} = ${FinMath.formatMoney(res.fv)}</div>
      </div>
    `;
  });

  // VALOR PRESENTE (VP)
  document.getElementById('form-pv')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const fv = parseFloat(document.getElementById('pv-fv').value);
    const iy = parseFloat(document.getElementById('pv-iy').value);
    const cy = parseFloat(document.getElementById('pv-cy').value);
    const years = parseFloat(document.getElementById('pv-years').value);

    const res = FinMath.calculatePV(fv, iy, cy, years);

    document.getElementById('res-pv-val').innerText = FinMath.formatMoney(res.pv);
    document.getElementById('res-pv-discount').innerText = FinMath.formatMoney(res.discount);
    document.getElementById('res-pv-ipct').innerText = `${res.iPct.toFixed(4)}%`;
    document.getElementById('res-pv-n').innerText = res.N.toFixed(2);

    document.getElementById('pv-steps-content').innerHTML = `
      <div class="step-item">
        <div class="step-title">1. Tasa Periódica i:</div>
        <div class="step-formula">i = ${iy}% / ${cy} = ${(res.iPct/100).toFixed(6)}</div>
      </div>
      <div class="step-item">
        <div class="step-title">2. Número de Períodos N:</div>
        <div class="step-formula">N = ${cy} * ${years} = ${res.N}</div>
      </div>
      <div class="step-item">
        <div class="step-title">3. Aplicar Descuento Compuesto:</div>
        <div class="step-formula">VP = ${FinMath.formatMoney(fv)} / (1 + ${(res.iPct/100).toFixed(6)})^${res.N} = ${FinMath.formatMoney(res.pv)}</div>
      </div>
    `;
  });

  // ICONV (TASA EFECTIVA Y EQUIVALENTE)
  document.getElementById('form-iconv')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nom1 = parseFloat(document.getElementById('iconv-nom').value);
    const cy1 = parseFloat(document.getElementById('iconv-cy1').value);
    const cy2 = parseFloat(document.getElementById('iconv-cy2').value);

    const res = FinMath.calculateEquivalentRate(nom1, cy1, cy2);

    document.getElementById('res-iconv-eff').innerText = `${res.effPct.toFixed(4)}%`;
    document.getElementById('res-iconv-nom2').innerText = `${res.nom2Pct.toFixed(4)}%`;
  });

  // TIEMPO Y PERÍODOS
  document.getElementById('form-time')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const pv = parseFloat(document.getElementById('time-pv').value);
    const fv = parseFloat(document.getElementById('time-fv').value);
    const iy = parseFloat(document.getElementById('time-iy').value);
    const cy = parseFloat(document.getElementById('time-cy').value);

    const res = FinMath.calculateNandTime(pv, fv, iy, cy);

    document.getElementById('res-time-n').innerText = res.N.toFixed(4);
    document.getElementById('res-time-years').innerText = `${res.yearsDecimal.toFixed(4)} años`;
    document.getElementById('res-time-ym').innerText = `${res.yearsAndMonths.years} años y ${res.yearsAndMonths.months} meses`;
    document.getElementById('res-time-yd').innerText = `${res.yearsAndDays.years} años y ${res.yearsAndDays.days} días`;
  });

  // DBD (DÍAS ENTRE FECHAS)
  document.getElementById('form-dbd')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const dt1 = document.getElementById('dbd-dt1').value;
    const dt2 = document.getElementById('dbd-dt2').value;

    const res = FinMath.calculateDBD(dt1, dt2);

    document.getElementById('res-dbd-val').innerText = `${res.dbd} días`;
    document.getElementById('res-dbd-years').innerText = `${res.yearsDecimal.toFixed(6)} años`;
  });

  // 4. GRÁFICO COMPARATIVO CHART.JS (INTERÉS SIMPLE VS COMPUESTO)
  let growthChartInstance = null;

  function renderGrowthChart() {
    const ctx = document.getElementById('growthChart')?.getContext('2d');
    if (!ctx) return;

    if (growthChartInstance) {
      growthChartInstance.destroy();
    }

    const yearsLabels = Array.from({ length: 21 }, (_, i) => `Año ${i}`);
    const P = 1000;
    const r = 0.10; // 10% anual

    // Interés Simple: F(t) = P * (1 + r*t)
    const simpleData = yearsLabels.map((_, t) => P * (1 + r * t));

    // Compuesto Anual (C/Y = 1)
    const compAnnual = yearsLabels.map((_, t) => P * Math.pow(1 + r, t));

    // Compuesto Semestral (C/Y = 2)
    const compSemi = yearsLabels.map((_, t) => P * Math.pow(1 + r/2, 2 * t));

    // Compuesto Trimestral (C/Y = 4)
    const compQuarterly = yearsLabels.map((_, t) => P * Math.pow(1 + r/4, 4 * t));

    // Compuesto Mensual (C/Y = 12)
    const compMonthly = yearsLabels.map((_, t) => P * Math.pow(1 + r/12, 12 * t));

    // Compuesto Diario (C/Y = 365)
    const compDaily = yearsLabels.map((_, t) => P * Math.pow(1 + r/365, 365 * t));

    growthChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: yearsLabels,
        datasets: [
          { label: 'Interés Simple (Lineal)', data: simpleData, borderColor: '#ef4444', borderWidth: 2, fill: false },
          { label: 'Compuesto Anual (C/Y=1)', data: compAnnual, borderColor: '#f59e0b', borderWidth: 2, fill: false },
          { label: 'Compuesto Semestral (C/Y=2)', data: compSemi, borderColor: '#3b82f6', borderWidth: 2, fill: false },
          { label: 'Compuesto Trimestral (C/Y=4)', data: compQuarterly, borderColor: '#06b6d4', borderWidth: 2, fill: false },
          { label: 'Compuesto Mensual (C/Y=12)', data: compMonthly, borderColor: '#10b981', borderWidth: 2.5, fill: false },
          { label: 'Compuesto Diario (C/Y=365)', data: compDaily, borderColor: '#a855f7', borderWidth: 2.5, fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#f8fafc', font: { family: 'Outfit', size: 12 } } },
          tooltip: {
            callbacks: {
              label: (item) => `${item.dataset.label}: ${FinMath.formatMoney(item.raw)}`
            }
          }
        },
        scales: {
          x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.08)' } }
        }
      }
    });
  }

  // 5. RENDERIZADO DE EJERCICIOS DE LA UNMSM
  function renderExercises() {
    const container = document.getElementById('exercises-list');
    if (!container || typeof UNMSMExercises === 'undefined') return;

    container.innerHTML = UNMSMExercises.map((ex) => `
      <div class="exercise-card">
        <div class="exercise-header">
          <div class="exercise-title">${ex.title}</div>
          <span class="tag tag-gold">${ex.section}</span>
        </div>
        <div class="exercise-question">${ex.question}</div>
        <div class="exercise-answers">
          ${Object.values(ex.solution).map(s => `<div>• ${s}</div>`).join('')}
        </div>
        <button class="btn btn-secondary load-ex-btn" data-ex-id="${ex.id}" style="margin-top: 14px;">
          <i class="fa-solid fa-upload"></i> Cargar datos en Calculadora TVM
        </button>
      </div>
    `).join('');

    // Event listener para botones de cargar ejercicio
    document.querySelectorAll('.load-ex-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-ex-id');
        const ex = UNMSMExercises.find(e => e.id === id);
        if (!ex) return;

        // Cargar datos en la calculadora BA II Plus
        baiiCalc.resetTVM();
        if (ex.data.pv) baiiCalc.PV = -Math.abs(ex.data.pv);
        if (ex.data.fv) baiiCalc.FV = Math.abs(ex.data.fv);
        if (ex.data.iy) baiiCalc.IY = ex.data.iy;
        if (ex.data.cy) baiiCalc.CY = ex.data.cy;
        if (ex.data.years) baiiCalc.N = ex.data.years * (ex.data.cy || 1);

        updateBaiiUI();

        // Cambiar a la pestaña de BA II Plus
        document.querySelector('[data-tab="tab-baii"]')?.click();
      });
    });
  }

  renderExercises();
});
