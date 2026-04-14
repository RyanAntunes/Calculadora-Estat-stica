const PROBLEM_SAMPLES = {
  1: {
    dados: '2.5, 3.0, 1.5, 4.0, 2.0, 3.5, 2.5, 5.0, 3.0, 2.5'
  },
  2: {
    dados: '2, 1, 3, 2, 0, 1, 2, 4, 2, 1, 3, 2, 1, 2, 0, 3, 2, 1, 3, 2'
  },
  3: {
    dados: '137, 141, 117, 156, 120, 114, 123, 147, 139, 152, 127, 127, 115, 133, 157, 122, 168, 116, 174, 157, 106, 138, 133, 134, 137, 132, 132, 128, 138, 121, 143, 136, 108, 158, 138, 123, 151, 128, 103, 145, 148, 124, 121, 138, 141, 149, 127, 119, 134, 149, 158, 144, 163, 124, 176, 170, 138, 164, 131, 128, 110, 160, 112, 131, 151, 156, 140, 161, 108, 127, 157, 124, 129, 111, 113, 146, 131, 134, 132, 120, 122, 158, 135, 132, 121, 137, 130, 127, 125, 165, 169, 135, 165, 118, 147, 156, 142, 143, 131, 127, 128, 115, 121, 142, 127, 129, 107, 156, 134, 133, 177, 121, 126, 141, 131, 109, 146, 167, 158, 147, 135, 150, 135, 161, 159, 149, 155, 170, 131, 121, 170, 133, 155, 125, 134, 153, 139, 171, 128, 118, 114, 151, 156, 180, 148, 161, 131, 122, 155, 128, 132, 131, 128, 137, 149, 125, 164, 122, 102, 124, 143, 141, 164, 138, 174, 147, 150, 109, 137, 153, 110, 136, 139, 150, 168, 107, 141, 119, 133, 125, 151, 124, 133, 126, 146, 118, 137, 167, 102, 133, 132, 102, 132, 141, 127, 110, 130, 109, 102, 145'
  }
};

const FORMULAS = {
  'nao-agrupados': [
    { titulo: 'Média Aritmética', formula: 'X̄ = Σxᵢ / n' },
    { titulo: 'Mediana', formula: 'Md = valor central da série ordenada' },
    { titulo: 'Moda', formula: 'Mo = valor de maior recorrência na amostra' },
    { titulo: 'Amplitude Total', formula: 'AT = xₘₐₓ − xₘᵢₙ' },
    { titulo: 'Variância', formula: 's² = Σ(xᵢ − X̄)² / n' },
    { titulo: 'Desvio Padrão', formula: 'S = √(Σ(xᵢ − X̄)² / n)' }
  ],
  'agrupados-sem-intervalo': [
    { titulo: 'Média Aritmética', formula: 'X̄ = Σxᵢfᵢ / n' },
    { titulo: 'Mediana', formula: 'Md = valor central da série ordenada' },
    { titulo: 'Moda', formula: 'Mo = valor da variável com maior frequência (fᵢ)' },
    { titulo: 'Amplitude Total', formula: 'AT = xₘₐₓ − xₘᵢₙ' },
    { titulo: 'Variância', formula: 's² = Σfᵢxᵢ² / n − [Σfᵢxᵢ / n]²' },
    { titulo: 'Desvio Padrão', formula: 'S = √(Σfᵢxᵢ² / n − [Σfᵢxᵢ / n]²)' }
  ],
  'agrupados-com-intervalo': [
    { titulo: 'Ponto Médio', formula: 'Xᵢ = (lᵢ + Lᵢ) / 2' },
    { titulo: 'Média Aritmética', formula: 'X̄ = Σxᵢfᵢ / n' },
    { titulo: 'Mediana', formula: 'Md = lcmd + [(Σfᵢ / 2 − Fcantmd) / fmd] · hcmd' },
    { titulo: 'Moda', formula: 'Mo = limo + [(fmo − fantmo) / (2fmo − fantmo − fpostmo)] · h' },
    { titulo: 'Amplitude Total', formula: 'AT = Lₘₐₓ − lₘᵢₙ' },
    { titulo: 'Variância', formula: 's² = Σfᵢxᵢ² / n − [Σfᵢxᵢ / n]²' },
    { titulo: 'Desvio Padrão', formula: 'S = √(Σfᵢxᵢ² / n − [Σfᵢxᵢ / n]²)' }
  ]
};

const el = {
  dados: document.getElementById('dados'),
  helperText: document.getElementById('helperText'),
  statusBox: document.getElementById('statusBox'),
  resultadoTipo: document.getElementById('resultadoTipo'),
  resumoDados: document.getElementById('resumoDados'),
  observacoes: document.getElementById('observacoes'),
  tableCard: document.getElementById('tableCard'),
  tableHeader: document.querySelector('.table-header'),
  tableWrapper: document.querySelector('.table-wrapper'),
  tableDescription: document.getElementById('tableDescription'),
  formulaSection: document.getElementById('formulaSection'),
  freqTable: document.getElementById('freqTable'),
  thead: document.querySelector('#freqTable thead'),
  tbody: document.querySelector('#freqTable tbody'),
  formulaGrid: document.getElementById('formulaGrid'),
  resMedia: document.getElementById('res-media'),
  resMediana: document.getElementById('res-mediana'),
  resModa: document.getElementById('res-moda'),
  resAmplitude: document.getElementById('res-amplitude'),
  resDesvio: document.getElementById('res-desvio'),
  resQuantidade: document.getElementById('res-quantidade')
};

function parseInputNumbers(text) {
  return text
    .split(',')
    .map(value => parseFloat(value.trim().replace(',', '.')))
    .filter(value => !Number.isNaN(value));
}

function formatNumber(value, decimals = 2) {
  if (typeof value === 'string') return value;
  if (!Number.isFinite(value)) return '-';
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function sum(values) {
  return values.reduce((acc, value) => acc + value, 0);
}

function getAmplitude(values) {
  return Math.max(...values) - Math.min(...values);
}

function buildRolText(values) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted.map(value => formatNumber(value)).join(', ');
}

function getMedianFromSorted(sortedValues) {
  const n = sortedValues.length;
  const middle = Math.floor(n / 2);
  return n % 2 === 0
    ? (sortedValues[middle - 1] + sortedValues[middle]) / 2
    : sortedValues[middle];
}

function getModesFromFrequencyMap(freqMap) {
  const entries = Object.entries(freqMap);
  const maxFrequency = Math.max(...entries.map(([, freq]) => freq));

  if (maxFrequency === 1) return 'Nenhuma';

  const modes = entries
    .filter(([, freq]) => freq === maxFrequency)
    .map(([value]) => Number(value));

  return modes.map(mode => formatNumber(mode)).join(', ');
}

function buildDiscreteFrequency(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const map = {};

  sorted.forEach(value => {
    map[value] = (map[value] || 0) + 1;
  });

  let cumulative = 0;
  return Object.entries(map).map(([value, fi]) => {
    cumulative += fi;
    const numericValue = Number(value);
    return {
      valor: numericValue,
      fi,
      fr: fi / sorted.length,
      fac: cumulative,
      xi: numericValue,
      fiXi: numericValue * fi,
      fiXi2: fi * (numericValue ** 2)
    };
  });
}

function detectCalculationType(values) {
  const n = values.length;
  const hasDecimal = values.some(value => !Number.isInteger(value));
  const uniqueCount = new Set(values).size;
  const uniqueRatio = uniqueCount / n;
  const repeatedCount = n - uniqueCount;
  const amplitude = getAmplitude(values);

  if (hasDecimal || n <= 10) return 'nao-agrupados';
  if (n >= 40) return 'agrupados-com-intervalo';
  if (repeatedCount >= n * 0.4 || uniqueRatio <= 0.6) return 'agrupados-sem-intervalo';
  if (amplitude >= 15) return 'agrupados-com-intervalo';
  return 'agrupados-sem-intervalo';
}

function calculateUngrouped(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const frequencyRows = buildDiscreteFrequency(sorted);
  const media = sum(sorted) / n;
  const mediana = getMedianFromSorted(sorted);
  const moda = getModesFromFrequencyMap(
    frequencyRows.reduce((acc, row) => {
      acc[row.valor] = row.fi;
      return acc;
    }, {})
  );
  const amplitude = getAmplitude(sorted);
  const variancia = sum(sorted.map(value => (value - media) ** 2)) / n;
  const desvio = Math.sqrt(variancia);

  return {
    type: 'nao-agrupados',
    tipoLabel: 'Dados Não Agrupados',
    media,
    mediana,
    moda,
    amplitude,
    desvio,
    quantidade: n,
    resumo: buildRolText(sorted),
    observacoes: 'Cálculo direto sobre os valores originais, sem geração de tabela.',
    tableDescription: '',
    table: null
  };
}

function calculateGroupedWithoutInterval(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const frequencyRows = buildDiscreteFrequency(sorted);
  const n = sorted.length;
  const totalFiXi = sum(frequencyRows.map(row => row.fiXi));
  const media = totalFiXi / n;

  const middleA = n / 2;
  const middleB = n % 2 === 0 ? middleA + 1 : middleA;
  let medianaA = null;
  let medianaB = null;

  for (const row of frequencyRows) {
    if (medianaA === null && row.fac >= middleA) medianaA = row.valor;
    if (medianaB === null && row.fac >= middleB) {
      medianaB = row.valor;
      break;
    }
  }

  const mediana = (medianaA + medianaB) / 2;
  const moda = getModesFromFrequencyMap(
    frequencyRows.reduce((acc, row) => {
      acc[row.valor] = row.fi;
      return acc;
    }, {})
  );
  const amplitude = getAmplitude(sorted);
  const totalFiXi2 = sum(frequencyRows.map(row => row.fiXi2));
  const variancia = (totalFiXi2 / n) - ((totalFiXi / n) ** 2);
  const desvio = Math.sqrt(variancia);

  return {
    type: 'agrupados-sem-intervalo',
    tipoLabel: 'Dados Agrupados sem Intervalo de Classe',
    media,
    mediana,
    moda,
    amplitude,
    desvio,
    quantidade: n,
    resumo: buildRolText(sorted),
    observacoes: 'A tabela de frequências foi montada automaticamente a partir dos valores digitados.',
    tableDescription: 'Tabela de frequências para dados agrupados sem intervalo de classe.',
    table: {
      headers: ['Valor (xi)', 'fi', 'fr (%)', 'Fac', 'xi · fi'],
      rows: frequencyRows.map(row => [
        formatNumber(row.valor),
        row.fi,
        formatNumber(row.fr * 100),
        row.fac,
        formatNumber(row.fiXi)
      ])
    }
  };
}

function buildClassIntervals(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const amplitude = max - min;
  const n = sorted.length;
  const k = Math.round(1 + 3.3 * Math.log10(n));
  const width = Math.ceil((amplitude + 1) / k);
  const intervals = [];
  let start = min;

  for (let i = 0; i < k; i += 1) {
    const end = start + width - 1;
    intervals.push({
      lower: start,
      upper: end,
      lowerBoundary: start,
      upperBoundary: end,
      midpoint: (start + end) / 2,
      fi: 0,
      fr: 0,
      fac: 0,
      fiXi: 0,
      fiXi2: 0
    });
    start = end + 1;
  }

  sorted.forEach(value => {
    const index = Math.min(Math.floor((value - min) / width), intervals.length - 1);
    intervals[index].fi += 1;
  });

  let cumulative = 0;
  intervals.forEach(interval => {
    cumulative += interval.fi;
    interval.fac = cumulative;
    interval.fr = interval.fi / n;
    interval.fiXi = interval.fi * interval.midpoint;
    interval.fiXi2 = interval.fi * (interval.midpoint ** 2);
  });

  return {
    intervals,
    amplitude,
    k,
    width,
    min,
    max,
    n
  };
}

function calculateGroupedWithInterval(values) {
  const grouped = buildClassIntervals(values);
  const { intervals, amplitude, k, width, min, max, n } = grouped;
  const totalFiXi = sum(intervals.map(interval => interval.fiXi));
  const totalFiXi2 = sum(intervals.map(interval => interval.fiXi2));
  const media = totalFiXi / n;
  const variancia = (totalFiXi2 / n) - ((totalFiXi / n) ** 2);
  const desvio = Math.sqrt(variancia);

  const medianIndex = intervals.findIndex(interval => interval.fac >= n / 2);
  const medianClass = intervals[medianIndex];
  const facBeforeMedian = medianIndex > 0 ? intervals[medianIndex - 1].fac : 0;
  const mediana = medianClass.lowerBoundary + (((n / 2) - facBeforeMedian) / medianClass.fi) * width;

  let modalIndex = 0;
  intervals.forEach((interval, index) => {
    if (interval.fi > intervals[modalIndex].fi) modalIndex = index;
  });

  const modalClass = intervals[modalIndex];
  const previousFi = modalIndex > 0 ? intervals[modalIndex - 1].fi : 0;
  const nextFi = modalIndex < intervals.length - 1 ? intervals[modalIndex + 1].fi : 0;
  const d1 = modalClass.fi - previousFi;
  const d2 = modalClass.fi - nextFi;
  const moda = (d1 + d2) === 0
    ? modalClass.midpoint
    : modalClass.lowerBoundary + (d1 / (d1 + d2)) * width;

  return {
    type: 'agrupados-com-intervalo',
    tipoLabel: 'Dados Agrupados com Intervalo de Classe',
    media,
    mediana,
    moda,
    amplitude,
    desvio,
    quantidade: n,
    resumo: buildRolText(values),
    observacoes: 'Os intervalos de classe foram montados automaticamente com base nos dados informados.',
    tableDescription: 'Tabela de distribuição com intervalos de classe, ponto médio, frequência simples e acumulada.',
    table: {
      headers: ['Classe', 'Limites Reais', 'xi', 'fi', 'fr (%)', 'Fac', 'xi · fi'],
      rows: intervals.map(interval => [
        `${formatNumber(interval.lower, 0)} - ${formatNumber(interval.upper, 0)}`,
        `${formatNumber(interval.lowerBoundary, 0)} |-- ${formatNumber(interval.upperBoundary, 0)}`,
        formatNumber(interval.midpoint),
        interval.fi,
        formatNumber(interval.fr * 100),
        interval.fac,
        formatNumber(interval.fiXi)
      ])
    }
  };
}

function renderTable(table) {
  if (!table || !table.rows.length) {
    el.thead.innerHTML = '';
    el.tbody.innerHTML = '';
    return;
  }

  el.thead.innerHTML = `<tr>${table.headers.map(header => `<th>${header}</th>`).join('')}</tr>`;
  el.tbody.innerHTML = table.rows
    .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');
}

function renderFormulas(type) {
  const formulas = FORMULAS[type] || [];
  el.formulaGrid.innerHTML = formulas
    .map(item => `
      <div class="formula-box">
        <h4>${item.titulo}</h4>
        <code>${item.formula}</code>
      </div>
    `)
    .join('');
}

function showTableSection(result) {
  el.tableCard.classList.remove('is-hidden');
  el.tableHeader.classList.remove('is-hidden');
  el.tableWrapper.classList.remove('is-hidden');
  el.formulaSection.classList.remove('is-hidden');
  el.tableDescription.textContent = result.tableDescription;
  renderTable(result.table);
  renderFormulas(result.type);
}

function showFormulaOnlySection(type) {
  el.tableCard.classList.remove('is-hidden');
  el.tableHeader.classList.add('is-hidden');
  el.tableWrapper.classList.add('is-hidden');
  el.formulaSection.classList.remove('is-hidden');
  el.thead.innerHTML = '';
  el.tbody.innerHTML = '';
  renderFormulas(type);
}

function hideTableSection() {
  el.tableCard.classList.add('is-hidden');
  el.tableHeader.classList.remove('is-hidden');
  el.tableWrapper.classList.remove('is-hidden');
  el.formulaSection.classList.remove('is-hidden');
  el.tableDescription.textContent = 'A distribuição será exibida após o cálculo.';
  el.thead.innerHTML = '';
  el.tbody.innerHTML = '';
  el.formulaGrid.innerHTML = '';
}

function fillResults(result) {
  el.resMedia.textContent = formatNumber(result.media);
  el.resMediana.textContent = formatNumber(result.mediana);
  el.resModa.textContent = typeof result.moda === 'number' ? formatNumber(result.moda) : result.moda;
  el.resAmplitude.textContent = formatNumber(result.amplitude);
  el.resDesvio.textContent = formatNumber(result.desvio);
  el.resQuantidade.textContent = result.quantidade;
  el.resultadoTipo.textContent = result.tipoLabel;
  el.resumoDados.textContent = result.resumo;
  el.observacoes.textContent = result.observacoes;
  el.statusBox.textContent = 'Calculado';
  el.statusBox.style.background = 'rgba(34, 197, 94, 0.12)';
  el.statusBox.style.color = '#92f1ab';

  if (result.type === 'nao-agrupados') {
    showFormulaOnlySection(result.type);
    return;
  }

  showTableSection(result);
}

function handleCalculation() {
  const values = parseInputNumbers(el.dados.value);

  if (!values.length) {
    el.statusBox.textContent = 'Erro';
    el.statusBox.style.background = 'rgba(251, 113, 133, 0.12)';
    el.statusBox.style.color = '#fda4af';
    alert('Digite valores válidos separados por vírgula.');
    return;
  }

  const type = detectCalculationType(values);
  let result;

  if (type === 'nao-agrupados') {
    result = calculateUngrouped(values);
  } else if (type === 'agrupados-sem-intervalo') {
    result = calculateGroupedWithoutInterval(values);
  } else {
    result = calculateGroupedWithInterval(values);
  }

  fillResults(result);
}

function clearAll() {
  el.dados.value = '';
  el.resultadoTipo.textContent = 'Aguardando cálculo...';
  el.resumoDados.textContent = 'Nenhum cálculo realizado.';
  el.observacoes.textContent = 'Passe o mouse no ícone para visualizar a observação.';
  el.statusBox.textContent = 'Pronto';
  el.statusBox.style.background = 'rgba(34, 197, 94, 0.12)';
  el.statusBox.style.color = '#92f1ab';
  [el.resMedia, el.resMediana, el.resModa, el.resAmplitude, el.resDesvio, el.resQuantidade].forEach(node => {
    node.textContent = '-';
  });
  hideTableSection();
}

function loadSample(sampleId) {
  const sample = PROBLEM_SAMPLES[sampleId];
  el.dados.value = sample.dados;
  handleCalculation();
}

document.getElementById('btnCalcular').addEventListener('click', handleCalculation);
document.getElementById('btnLimpar').addEventListener('click', clearAll);
document.querySelectorAll('.sample').forEach(button => {
  button.addEventListener('click', () => loadSample(button.dataset.sample));
});

clearAll();
