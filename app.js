const staticRates = {
  USD: 1,
  EUR: 0.92,
  INR: 83.00,
  GBP: 0.79,
  JPY: 150.0,
  AUD: 1.50,
  CAD: 1.35,
  CNY: 7.20,
  SGD: 1.35,
  HKD: 7.80,
  NZD: 1.60,
  CHF: 0.91,
  BRL: 5.00,
  ZAR: 18.50,
  AED: 3.67,
  SAR: 3.75,
  RUB: 95.0,
  PKR: 280.0,
  MXN: 17.0,
  KRW: 1400.0,
  IDR: 15000.0,
  THB: 35.0,
  VND: 24000.0,
  TRY: 30.0,
  EGP: 30.0,
  NGN: 770.0,
  ILS: 3.60,
  DKK: 6.80,
  SEK: 11.0,
  NOK: 11.0,
  PLN: 4.00,
  HUF: 360.0,
  CZK: 23.0,
  RON: 4.30,
  BGN: 1.80,
  HRK: 7.00,
  ISK: 140.0,
  ARS: 900.0,
  CLP: 800.0,
  COP: 3800.0,
  PEN: 3.50,
  UAH: 38.0,
  KZT: 450.0,
  MAD: 10.0,
  TWD: 30.0,
  PHP: 56.0,
  LKR: 300.0,
  BDT: 110.0,
  NPR: 130.0,
  KES: 150.0,
  GHS: 12.0,
  RSD: 110.0,
  BYN: 2.60,
  JOD: 0.71,
  LBP: 1500.0,
  MZN: 64.0,
  MUR: 45.0,
  MNT: 3450.0,
  GIP: 0.79,
  BHD: 0.38,
  OMR: 0.39,
  QAR: 3.64,
  KWD: 0.31,
  XOF: 610.0,
  XAF: 610.0,
};

const form = document.getElementById('converterForm');
const fromSelect = document.querySelector('select[name="from"]');
const toSelect = document.querySelector('select[name="to"]');
const amountInput = document.getElementById('amount');
const msg = document.querySelector('.msg');
const swapBtn = document.getElementById('swap');
const calculateBtn = document.getElementById('calculate');

function populateSelects() {
  const codes = Object.keys(countryList).sort();
  for (const sel of [fromSelect, toSelect]) {
    sel.innerHTML = '';
    for (const code of codes) {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = code;
      sel.appendChild(opt);
    }
  }
  fromSelect.value = 'USD';
  toSelect.value = 'INR';
  updateFlag(fromSelect);
  updateFlag(toSelect);
}

function updateFlag(selectElem) {
  const curr = selectElem.value;
  const countryCode = countryList[curr] || 'UN';
  const img = selectElem.parentElement.querySelector('img');
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  img.alt = countryCode;
}

function fmtNumber(v) {
  if (v === null || v === undefined || Number.isNaN(v)) return '—';
  if (Math.abs(v) >= 1) return Number(v).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  return Number(v).toPrecision(6);
}

function computeConversion() {
  const amt = parseFloat(amountInput.value);
  if (Number.isNaN(amt)) {
    msg.textContent = 'Enter a valid amount.';
    return;
  }

  const from = fromSelect.value;
  const to = toSelect.value;

  const fromRate = staticRates[from];
  const toRate = staticRates[to];

  if (fromRate === undefined || toRate === undefined) {
    const missing = [];
    if (fromRate === undefined) missing.push(from);
    if (toRate === undefined) missing.push(to);

    msg.innerHTML = `<strong>Static rate not available for: ${missing.join(', ')}</strong>.<br/>Please choose a supported currency pair.`;
    return;
  }

  const ratio = toRate / fromRate;
  const converted = amt * ratio;
  msg.innerHTML = `${amt} <strong>${from}</strong> = <strong>${fmtNumber(converted)} ${to}</strong> <br /><small>(1 ${from} = ${fmtNumber(ratio)} ${to})</small>`;
}

function swapCurrencies() {
  const old = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value = old;
  updateFlag(fromSelect);
  updateFlag(toSelect);
  msg.textContent = 'Swapped — click Calculate to compute with current rates.';
}

function attachEvents() {
  fromSelect.addEventListener('change', (e) => updateFlag(e.target));
  toSelect.addEventListener('change', (e) => updateFlag(e.target));

  swapBtn.addEventListener('click', (e) => {
    e.preventDefault();
    swapCurrencies();
  });

  calculateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    computeConversion();
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    computeConversion();
  });

  document.querySelectorAll('.select-inner img').forEach(img => {
    img.addEventListener('click', () => {
      msg.textContent = 'Select a currency and click Calculate.';
    });
  });
}

function init() {
  populateSelects();
  attachEvents();
  msg.textContent = 'Ready — choose amount/currencies and click Calculate';
}

window.addEventListener('load', init);
