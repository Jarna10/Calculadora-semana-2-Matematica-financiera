/**
 * BASE DE DATOS DE EJERCICIOS RESUELTOS DEL PDF - MATEMÁTICA FINANCIERA UNMSM
 */

const UNMSMExercises = [
  {
    id: "ex_2_1_1",
    section: "2.1 Introducción al Interés Compuesto",
    title: "Ejercicio 1: Parámetros del Interés Compuesto",
    question: "Una inversión genera intereses al 7.23% con capitalización mensual durante 8 años y 6 meses. Determine: a) Tasa nominal (I/Y), b) Frecuencia C/Y, c) Plazo t en años, d) Tasa periódica i, e) Número de períodos N.",
    data: { iy: 7.23, cy: 12, years: 8.5 },
    type: "INTRO",
    solution: {
      a: "I/Y = 7.23%",
      b: "C/Y = 12 (Mensual)",
      c: "t = 8.50 años",
      d: "i = 7.23% / 12 = 0.60% mensual",
      e: "N = 12 * 8.50 = 102 períodos"
    }
  },
  {
    id: "ex_2_2_3",
    section: "2.2 Valor Futuro con Fechas",
    title: "Ejemplo 2.2.3: Inversión con Fechas Específicas (DBD)",
    question: "El 30 de junio de 2020 se depositaron $36,200.00 en una cuenta. ¿Cuál será el valor futuro el 9 de octubre de 2025 al 2.22% anual compuesto (C/Y=1)?",
    data: { pv: 36200, iy: 2.22, cy: 1, dt1: "2020-06-30", dt2: "2025-10-09" },
    type: "FV_DATES",
    solution: {
      dbd: "DBD = 1,927 días",
      t: "t = 1927 / 365 = 5.279452 años",
      N: "N = 1 * 5.279452 = 5.279452",
      fv: "VF = $36,200 * (1 + 0.0222)^5.279452 = $40,649.27"
    }
  },
  {
    id: "ex_2_2_4",
    section: "2.2 Valor Futuro Multi-Tasa",
    title: "Ejemplo 2.2.4: Inversión Santiaguito con Cambio de Tasa",
    question: "Santiaguito invirtió $84,000 al 6.5% semestral por 4 años. Luego la tasa cambió al 4.44% trimestral por 3 años más. a) Valor del fondo a los 7 años, b) Interés total ganado.",
    data: { pv: 84000, stage1: { iy: 6.5, cy: 2, t: 4 }, stage2: { iy: 4.44, cy: 4, t: 3 } },
    type: "FV_MULTI_RATE",
    solution: {
      fv1: "Paso 1: VF1 (Año 4) = $84,000 * (1 + 0.065/2)^8 = $108,492.51",
      fv2: "Paso 2: VF2 (Año 7) = $108,492.51 * (1 + 0.0444/4)^12 = $123,859.43",
      interest: "Interés Total = $123,859.43 - $84,000 = $39,859.43"
    }
  },
  {
    id: "ex_2_2_5",
    section: "2.2 Variación de Capital",
    title: "Ejemplo 2.2.5: Préstamo Latasha con Amortización Parcial",
    question: "Latasha pidió prestados $8,700 al 3.59% mensual. A los 2 años pagó $3,045. ¿Cuánto pagará para liquidar la deuda 9 años después de pedirla?",
    data: { pv: 8700, iy: 3.59, cy: 12, t1: 2, pay: 3045, t2: 7 },
    type: "CAPITAL_CHANGE",
    solution: {
      fv1: "VF a los 2 años (N=24) = $8,700 * (1 + 0.0359/12)^24 = $9,346.63",
      pv2: "Nuevo Capital VP2 = $9,346.63 - $3,045 = $6,301.63",
      fv2: "VF final (7 años más, N=84) = $6,301.63 * (1 + 0.0359/12)^84 = $8,098.94"
    }
  },
  {
    id: "ex_2_3_1",
    section: "2.3 Valor Presente",
    title: "Ejercicio 2.3.1: Wyatt Meta de Jubilación",
    question: "Wyatt desea acumular $197,100 para su jubilación en 16 años al 4.16% compuesto trimestralmente. ¿Cuánto debe invertir hoy?",
    data: { fv: 197100, iy: 4.16, cy: 4, years: 16 },
    type: "PV",
    solution: {
      N: "N = 4 * 16 = 64 períodos",
      i: "i = 4.16% / 4 = 1.04% trimestral",
      pv: "VP = $197,100 / (1 + 0.0104)^64 = $101,651.32"
    }
  },
  {
    id: "ex_2_4_2",
    section: "2.4 Tasa Efectiva",
    title: "Ejemplo 2.4.2: Tasa de Interés Efectiva Anual (EFF)",
    question: "Calcule la tasa de interés efectiva de una inversión que genera un 6.4% de interés compuesto trimestralmente (C/Y=4).",
    data: { iy: 6.4, cy: 4 },
    type: "EFF",
    solution: {
      formula: "EFF = (1 + 0.064/4)^4 - 1",
      effPct: "EFF = (1 + 0.016)^4 - 1 = 6.56% anual"
    }
  },
  {
    id: "ex_2_4_3",
    section: "2.4 Tasas Equivalentes",
    title: "Ejemplo 2.4.3: Conversión a Tasa Equivalente",
    question: "Convierta la tasa de interés del 7.42% capitalizable trimestralmente (C/Y=4) a una tasa equivalente capitalizable mensualmente (C/Y=12).",
    data: { iy1: 7.42, cy1: 4, cy2: 12 },
    type: "EQUIV_RATE",
    solution: {
      step1: "Paso 1: Tasa Efectiva EFF = (1 + 0.0742/4)^4 - 1 = 7.629% anual",
      step2: "Paso 2: Tasa Nominal 2 = 12 * [(1 + 0.07629)^(1/12) - 1] = 7.37% mensual"
    }
  },
  {
    id: "ex_2_5_1",
    section: "2.5 Número de Períodos y Tiempo",
    title: "Ejercicio 2.5.1: Duración de Inversión",
    question: "Inversión de $13,000 crece hasta $28,541.83 al 7.97% mensual. Determine N y el tiempo en años y meses.",
    data: { pv: 13000, fv: 28541.83, iy: 7.97, cy: 12 },
    type: "PERIODS_N",
    solution: {
      N: "N = ln(28541.83 / 13000) / ln(1 + 0.0797/12) = 118.80 períodos",
      time: "t = 118.80 / 12 = 9.90 años -> 9 años y 11 meses"
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = UNMSMExercises;
}
