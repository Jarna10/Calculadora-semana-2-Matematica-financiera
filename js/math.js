/**
 * MÓDULO DE FÓRMULAS Y CÁLCULOS DE MATEMÁTICA FINANCIERA
 * Rojas Nuñez Jefry Aldair - FCM UNMSM - EP matemática pura
 */

const FinMath = {
  // Frecuencias de capitalización comunes (C/Y)
  FREQUENCIES: {
    ANNUAL: { val: 1, name: 'Anual (C/Y = 1)' },
    SEMIANNUAL: { val: 2, name: 'Semestral (C/Y = 2)' },
    QUARTERLY: { val: 4, name: 'Trimestral (C/Y = 4)' },
    MONTHLY: { val: 12, name: 'Mensual (C/Y = 12)' },
    DAILY: { val: 365, name: 'Diario (C/Y = 365)' }
  },

  /**
   * Tasa de interés periódica i = (I/Y) / C/Y
   * @param {number} nominalRatePct Tasa nominal anual I/Y en porcentaje (ej: 7.23 para 7.23%)
   * @param {number} cy Frecuencia de capitalización anual C/Y (ej: 12)
   * @returns {number} i en porcentaje (ej: 0.60%)
   */
  getPeriodicRatePct(nominalRatePct, cy) {
    if (!cy || cy <= 0) return 0;
    return nominalRatePct / cy;
  },

  /**
   * Número de períodos de capitalización N = C/Y * t
   * @param {number} cy Frecuencia de capitalización
   * @param {number} years Plazo en años (t)
   * @returns {number} N
   */
  getPeriodsN(cy, years) {
    return cy * years;
  },

  /**
   * Valor Futuro (VF) = VP * (1 + i)^N
   */
  calculateFV(pv, iyPct, cy, years) {
    const i = (iyPct / 100) / cy;
    const N = cy * years;
    const fv = pv * Math.pow(1 + i, N);
    const interest = fv - pv;

    return {
      pv,
      iyPct,
      cy,
      years,
      iPct: i * 100,
      N,
      fv,
      interest
    };
  },

  /**
   * Valor Presente (VP) = VF / (1 + i)^N
   */
  calculatePV(fv, iyPct, cy, years) {
    const i = (iyPct / 100) / cy;
    const N = cy * years;
    const pv = fv / Math.pow(1 + i, N);
    const discount = fv - pv;

    return {
      fv,
      iyPct,
      cy,
      years,
      iPct: i * 100,
      N,
      pv,
      discount
    };
  },

  /**
   * Tasa Nominal I/Y = C/Y * [(VF/VP)^(1/N) - 1] * 100
   */
  calculateNominalRate(pv, fv, cy, years) {
    const N = cy * years;
    const ratio = Math.abs(fv / pv);
    const i = Math.pow(ratio, 1 / N) - 1;
    const iyPct = i * cy * 100;
    const iPct = i * 100;

    return {
      pv,
      fv,
      cy,
      years,
      N,
      iPct,
      iyPct
    };
  },

  /**
   * Número de Períodos N = ln(VF / VP) / ln(1 + i)
   * y cálculo de tiempo t = N / C/Y
   */
  calculateNandTime(pv, fv, iyPct, cy) {
    const i = (iyPct / 100) / cy;
    const absPv = Math.abs(pv);
    const absFv = Math.abs(fv);
    
    const N = Math.log(absFv / absPv) / Math.log(1 + i);
    const yearsDecimal = N / cy;

    // Desglose en años y meses
    const yearsM = Math.floor(yearsDecimal);
    const remMonths = (yearsDecimal - yearsM) * 12;
    const monthsInt = Math.round(remMonths);

    // Desglose en años y días
    const yearsD = Math.floor(yearsDecimal);
    const remDays = (yearsDecimal - yearsD) * 365;
    const daysInt = Math.round(remDays);

    return {
      pv: absPv,
      fv: absFv,
      iyPct,
      cy,
      iPct: i * 100,
      N,
      yearsDecimal,
      yearsAndMonths: { years: yearsM, months: monthsInt },
      yearsAndDays: { years: yearsD, days: daysInt }
    };
  },

  /**
   * Tasa Efectiva Anual (EFF / TIE) = (1 + NOM / C/Y)^(C/Y) - 1
   */
  calculateEffectiveRate(nomPct, cy) {
    const i = (nomPct / 100) / cy;
    const effPct = (Math.pow(1 + i, cy) - 1) * 100;

    return {
      nomPct,
      cy,
      effPct
    };
  },

  /**
   * Tasas de Interés Equivalentes (NOM1 @ C/Y1 -> EFF -> NOM2 @ C/Y2)
   */
  calculateEquivalentRate(nom1Pct, cy1, cy2) {
    // Paso 1: Tasa Efectiva
    const effResult = this.calculateEffectiveRate(nom1Pct, cy1);
    const eff = effResult.effPct / 100;

    // Paso 2: Tasa Nominal equivalente para C/Y2
    const i2 = Math.pow(1 + eff, 1 / cy2) - 1;
    const nom2Pct = i2 * cy2 * 100;

    return {
      nom1Pct,
      cy1,
      effPct: effResult.effPct,
      cy2,
      nom2Pct
    };
  },

  /**
   * Cálculo de Días Entre Fechas (DBD - Days Between Dates)
   */
  calculateDBD(startDateStr, endDateStr) {
    const d1 = new Date(startDateStr);
    const d2 = new Date(endDateStr);

    const diffTime = d2.getTime() - d1.getTime();
    const dbd = Math.round(diffTime / (1000 * 3600 * 24));
    const yearsDecimal = dbd / 365;

    return {
      startDate: startDateStr,
      endDate: endDateStr,
      dbd,
      yearsDecimal
    };
  },

  /**
   * Valor Futuro con Fechas Específicas
   */
  calculateFVWithDates(pv, iyPct, cy, startDateStr, endDateStr) {
    const dbdRes = this.calculateDBD(startDateStr, endDateStr);
    const fvRes = this.calculateFV(pv, iyPct, cy, dbdRes.yearsDecimal);

    return {
      ...dbdRes,
      ...fvRes
    };
  },

  /**
   * Valor Futuro con Cambio en la Tasa de Interés (Multi-Etapa)
   */
  calculateFVMultiRate(pv, stage1) {
    // stage1: { iyPct, cy, years }
    // stage2: { iyPct, cy, years }
    const fv1Res = this.calculateFV(pv, stage1.iyPct, stage1.cy, stage1.years);
    const pv2 = fv1Res.fv;

    return {
      pv1: pv,
      stage1Res: fv1Res,
      pv2: pv2
    };
  },

  /**
   * Formateador de moneda y porcentajes
   */
  formatMoney(num) {
    if (isNaN(num)) return "$0.00";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  },

  formatPct(num) {
    if (isNaN(num)) return "0.00%";
    return `${Number(num).toFixed(2)}%`;
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = FinMath;
}
