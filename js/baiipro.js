/**
 * SIMULADOR DE CALCULADORA FINANCIERA BA II PLUS (HOJA TVM)
 * Replica interactiva de la hoja de cálculo del Valor Temporal del Dinero.
 */

class BAIIPlusCalculator {
  constructor() {
    this.resetTVM();
    this.currentInput = "0";
    this.is2ndActive = false;
    this.isCptActive = false;
    this.activeWorksheet = "TVM";
    this.displayMessage = "READY";
  }

  resetTVM() {
    this.N = 0;
    this.IY = 0;
    this.PV = 0;
    this.PMT = 0;
    this.FV = 0;
    this.PY = 1;
    this.CY = 1;
    this.currentInput = "0";
    this.is2ndActive = false;
    this.isCptActive = false;
    this.displayMessage = "CLR TVM";
  }

  inputDigit(digit) {
    if (this.currentInput === "0" || this.currentInput === "-0") {
      this.currentInput = digit;
    } else {
      this.currentInput += digit;
    }
  }

  inputDot() {
    if (!this.currentInput.includes(".")) {
      this.currentInput += ".";
    }
  }

  toggleSign() {
    if (this.currentInput.startsWith("-")) {
      this.currentInput = this.currentInput.substring(1);
    } else if (this.currentInput !== "0") {
      this.currentInput = "-" + this.currentInput;
    }
  }

  clearEntry() {
    this.currentInput = "0";
    this.is2ndActive = false;
    this.isCptActive = false;
  }

  press2ND() {
    this.is2ndActive = !this.is2ndActive;
  }

  pressCPT() {
    this.isCptActive = true;
  }

  // Asignar C/Y y P/Y
  setFrequency(val) {
    const freq = parseFloat(val) || 12;
    this.PY = freq;
    this.CY = freq;
    this.displayMessage = `P/Y=C/Y=${freq}`;
    this.currentInput = "0";
    this.is2ndActive = false;
  }

  // Asignar o Calcular variable TVM
  handleTVMKey(key) {
    const val = parseFloat(this.currentInput);

    if (this.is2ndActive) {
      if (key === 'FV') {
        // 2ND + FV = CLR TVM
        this.resetTVM();
        this.is2ndActive = false;
        return;
      }
      if (key === 'IY' || key === 'PY' || key === 'CY') {
        // 2ND + I/Y = P/Y y C/Y
        this.setFrequency(val || 12);
        return;
      }
      if (key === 'N') {
        // 2ND + N = XP/Y (Multiplicar años ingresados por P/Y para obtener N)
        const years = val || 0;
        this.N = years * this.CY;
        this.displayMessage = `N = ${this.N}`;
        this.currentInput = "0";
        this.is2ndActive = false;
        return;
      }
    }

    if (key === 'PY' || key === 'CY') {
      this.setFrequency(val || 12);
      return;
    }

    if (this.isCptActive) {
      // Modo CPT: Resolver variable solicitada
      this.computeVariable(key);
      this.isCptActive = false;
      return;
    }

    // Modo STORE/INPUT: Guardar valor en la variable
    switch (key) {
      case 'N':
        this.N = val;
        this.displayMessage = `N = ${this.N}`;
        break;
      case 'IY':
        this.IY = val;
        this.displayMessage = `I/Y = ${this.IY}`;
        break;
      case 'PV':
        this.PV = val;
        this.displayMessage = `PV = ${this.PV}`;
        break;
      case 'PMT':
        this.PMT = val;
        this.displayMessage = `PMT = ${this.PMT}`;
        break;
      case 'FV':
        this.FV = val;
        this.displayMessage = `FV = ${this.FV}`;
        break;
    }
    this.currentInput = "0";
  }

  computeVariable(key) {
    const i = (this.IY / 100) / (this.CY || 1);

    switch (key) {
      case 'FV': {
        // FV = -PV * (1 + i)^N
        // Con convención de signos: Inversión PV < 0 => FV > 0
        const absPv = Math.abs(this.PV);
        const fvCalc = absPv * Math.pow(1 + i, this.N);
        this.FV = fvCalc;
        this.currentInput = fvCalc.toFixed(4);
        this.displayMessage = `FV = ${fvCalc.toFixed(2)}`;
        break;
      }
      case 'PV': {
        // PV = -FV / (1 + i)^N
        const absFv = Math.abs(this.FV);
        const pvCalc = - (absFv / Math.pow(1 + i, this.N));
        this.PV = pvCalc;
        this.currentInput = pvCalc.toFixed(4);
        this.displayMessage = `PV = ${pvCalc.toFixed(2)}`;
        break;
      }
      case 'N': {
        // N = ln(|FV / PV|) / ln(1 + i)
        const ratio = Math.abs(this.FV / this.PV);
        const nCalc = Math.log(ratio) / Math.log(1 + i);
        this.N = nCalc;
        this.currentInput = nCalc.toFixed(4);
        this.displayMessage = `N = ${nCalc.toFixed(2)}`;
        break;
      }
      case 'IY': {
        // i = (|FV / PV|)^(1 / N) - 1
        const ratio = Math.abs(this.FV / this.PV);
        const iCalc = Math.pow(ratio, 1 / this.N) - 1;
        const iyCalc = iCalc * this.CY * 100;
        this.IY = iyCalc;
        this.currentInput = iyCalc.toFixed(4);
        this.displayMessage = `I/Y = ${iyCalc.toFixed(2)}`;
        break;
      }
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BAIIPlusCalculator;
}
