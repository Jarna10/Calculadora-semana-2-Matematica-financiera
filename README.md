# Calculadora de Matemática Financiera - Interés Compuesto

**Autor:** Rojas Nuñez Jefry Aldair - FCM UNMSM - EP matemática pura  
**Universidad Nacional Mayor de San Marcos** (Decana de América)  
**Escuela Profesional de Matemática Pura**

---

## 📌 Descripción del Proyecto

Aplicación web interactiva y responsiva de **Matemática Financiera: Interés Compuesto**, desarrollada para la visualización, simulación y resolución paso a paso de problemas financieros de interés compuesto basados en el silabo académico de la FCM UNMSM.

---

## 🚀 Funcionalidades Principales

1. **Simulador de Calculadora Financiera BA II Plus (TVM Worksheet)**:
   - Réplica interactiva de la hoja de trabajo TVM ($N, I/Y, PV, PMT, FV, P/Y, C/Y$).
   - Botón **CPT** para calcular cualquier variable incógnita.
   - Manejo de convención de signos de flujo de caja (+ entrada de efectivo, - salida/inversión).
   - Función **CLR TVM** (`2ND` + `FV`).

2. **Calculadoras Especializadas de Interés Compuesto**:
   - **Valor Futuro ($VF$)**: $VF = VP \times (1 + i)^N$.
   - **Valor Presente ($VP$)**: $VP = \frac{VF}{(1 + i)^N}$.
   - **Conversión de Tasas (ICONV)**: Tasa Efectiva Anual ($EFF$) y Tasas Equivalentes entre distintas frecuencias.
   - **Períodos ($N$) y Tiempo ($t$)**: Desglose automático en Años decimales, Años y Meses, Años y Días.
   - **Días Entre Fechas ($DBD$)**: Cálculo exacto de días entre $DT1$ y $DT2$.

3. **Comparador Gráfico Dinámico (Chart.js)**:
   - Crecimiento comparativo entre Interés Simple (Lineal) e Interés Compuesto a distintas frecuencias de capitalización (Anual, Semestral, Trimestral, Mensual, Diario) a lo largo de 20 años.

4. **Ejercicios Académicos Resueltos UNMSM**:
   - Banco de ejercicios solucionados del material didáctico con botón "Cargar en Calculadora TVM" para experimentación directa.

5. **Glosario y Formulario**:
   - Compendio de símbolos ($I/Y, C/Y, P/Y, PMT, i, t, N, PV, FV, EFF, DBD$) y definiciones académicas.

---

## 🌐 Despliegue en GitHub Pages

Para ver la aplicación en vivo desde tu repositorio:
1. Ve a **Settings** > **Pages** en GitHub.
2. Selecciona **GitHub Actions** o la rama `main` (directorio `/root`).
3. La URL estará disponible en:  
   `https://Jarna10.github.io/Calculadora-semana-2-Matematica-financiera/`