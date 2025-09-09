// --- Константы ---
const RATE_FREE   = 0.30; // без залога
const RATE_CAR    = 0.28; // под залог авто
const RATE_HOUSE  = 0.25; // под залог недвижимости

const MIN_PAY = 10000, MAX_PAY = 250000;
const MIN_SUM = 10000, MAX_SUM = 1700000;
const MIN_YEARS = 1, MAX_YEARS = 20;

// --- Состояние ---
let state = {
  payPerMonth: 16000,
  loanSum: 1700000,
  years: 7,
  hasCar: false,
  hasHouse: false,
  step: 0,
  offers: { best: [], maybe: [] }
};

// --- Формулы ---
function annuity(months, annualRate, principal) {
  const i = annualRate / 12;
  const coeff = i * Math.pow(1 + i, months) / (Math.pow(1 + i, months) - 1);
  return Math.round(principal * coeff);
}

function buildOffers(state) {
  const { payPerMonth, loanSum, years, hasCar, hasHouse } = state;
  const months = years * 12;
  const variants = [
    { type: 'Без залога',         rate: RATE_FREE,            collateral: 'без залога' },
    ...(hasCar   ? [{ type:'Под залог авто',  rate: RATE_CAR,   collateral:'под залог авто' }] : []),
    ...(hasHouse ? [{ type:'Под залог недвижимости', rate: RATE_HOUSE, collateral:'под залог недвижимости' }] : [])
  ];
  const exact = [], almost = [];
  variants.forEach(v => {
    const pay = annuity(months, v.rate, loanSum);
    const card = { pay, loanSum, years, collateral:v.collateral };
    const payMatch = pay <= payPerMonth;
    const otherMatch = true;
    if (payMatch && otherMatch) exact.push(card);
    if (years < 20) {
      const longPay = annuity((years+1)*12, v.rate, loanSum);
      almost.push({ pay: longPay, loanSum, years: years+1, collateral:v.collateral });
    }
    if (!hasCar && v.rate===RATE_CAR)   almost.push(card);
    if (!hasHouse && v.rate===RATE_HOUSE) almost.push(card);
  });
  exact.sort((a,b)=>a.pay-b.pay);
  almost.sort((a,b)=>a.pay-b.pay);
  return {
    best: exact.slice(0,5),
    maybe: almost
      .filter(c => !exact.some(e => e.pay===c.pay && e.collateral===c.collateral))
      .slice(0,5)
  };
}

// --- Рендеринг ---
function render() {
  state.offers = buildOffers(state);
  const app = document.getElementById('app');
  app.innerHTML = '';
  for (let i = 0; i < 5; ++i) {
    app.appendChild(renderScreen(i));
  }
  setTimeout(() => {
    app.children[state.step].scrollIntoView({behavior:'smooth'});
  }, 0);
}

function renderScreen(step) {
  const screen = document.createElement('div');
  screen.className = 'screen';
  if (step > 0) {
    const back = document.createElement('button');
    back.className = 'btn-back';
    back.innerHTML = '&lt;';
    back.onclick = () => { state.step = step-1; render(); };
    screen.appendChild(back);
  }
  if (step === 0) renderStep1(screen);
  if (step === 1) renderStep2(screen);
  if (step === 2) renderStep3(screen);
  if (step === 3) renderStep4(screen);
  if (step === 4) renderStep5(screen);
  if (step < 4) {
    const ind = document.createElement('div');
    ind.className = 'indicator';
    ind.innerHTML = `${step+1} <span class="active">из 4</span>`;
    screen.appendChild(ind);
  }
  return screen;
}

// --- Экраны ---
function renderStep1(screen) {
  screen.innerHTML += `
    <img src="assets/money_stack.png" style="width:120px;align-self:center;margin-bottom:24px;">
    <h2 style="font-size:20px;font-weight:700;margin:0 0 8px 0;">Сколько вы готовы платить в месяц?</h2>
    <div style="color:var(--mid);font-size:14px;margin-bottom:24px;">Укажите максимальную сумму, которую готовы вносить за кредит</div>
  `;
  const sliderWrap = document.createElement('div');
  sliderWrap.className = 'slider';
  sliderWrap.innerHTML = `
    <input type="range" min="${MIN_PAY}" max="${MAX_PAY}" step="1000" value="${state.payPerMonth}" id="payRange">
    <input type="number" min="${MIN_PAY}" max="${MAX_PAY}" step="1000" value="${state.payPerMonth}" id="payInput" style="margin-top:8px;">
    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray);margin-top:4px;">
      <span>10 000 ₽</span><span>250 000 ₽</span>
    </div>
  `;
  screen.appendChild(sliderWrap);
  let error = document.createElement('span');
  error.className = 'error';
  error.style.display = 'none';
  error.innerText = 'Выберите доступное значение';
  screen.appendChild(error);

  const payRange = sliderWrap.querySelector('#payRange');
  const payInput = sliderWrap.querySelector('#payInput');
  payRange.oninput = e => {
    payInput.value = payRange.value;
    error.style.display = 'none';
    state.payPerMonth = +payRange.value;
    render();
  };
  payInput.oninput = e => {
    let val = +payInput.value;
    if (val < MIN_PAY || val > MAX_PAY) {
      error.style.display = '';
    } else {
      error.style.display = 'none';
      payRange.value = val;
      state.payPerMonth = val;
      render();
    }
  };

  const next = document.createElement('button');
  next.className = 'btn-next';
  next.innerText = 'Следующий шаг';
  next.disabled = (state.payPerMonth < MIN_PAY || state.payPerMonth > MAX_PAY);
  next.onclick = () => { state.step = 1; render(); };
  screen.appendChild(next);
}

function renderStep2(screen) {
  screen.innerHTML += `
    <img src="assets/house.png" style="width:120px;align-self:center;margin-bottom:24px;">
    <h2 style="font-size:20px;font-weight:700;margin:0 0 8px 0;">Есть ли у вас собственность?</h2>
    <div style="color:var(--mid);font-size:14px;margin-bottom:24px;">Важнo чтобы авто или недвижимость были в вашей собственности.</div>
  `;
  const switches = document.createElement('div');
  switches.className = 'switch-row';
  switches.innerHTML = `
    <div class="switch">
      <input type="checkbox" id="car" ${state.hasCar ? 'checked' : ''}>
      <label for="car">Автомобиль есть</label>
    </div>
    <div class="switch">
      <input type="checkbox" id="house" ${state.hasHouse ? 'checked' : ''}>
      <label for="house">Недвижимость есть</label>
    </div>
  `;
  screen.appendChild(switches);
  switches.querySelector('#car').onchange = e => { state.hasCar = e.target.checked; render(); };
  switches.querySelector('#house').onchange = e => { state.hasHouse = e.target.checked; render(); };

  const next = document.createElement('button');
  next.className = 'btn-next';
  next.innerText = 'Следующий шаг';
  next.disabled = false;
  next.onclick = () => { state.step = 2; render(); };
  screen.appendChild(next);
}

function renderStep3(screen) {
  screen.innerHTML += `
    <img src="assets/money_bag.png" style="width:120px;align-self:center;margin-bottom:24px;">
    <h2 style="font-size:20px;font-weight:700;margin:0 0 8px 0;">На какую сумму вы хотите взять кредит?</h2>
    <div style="color:var(--mid);font-size:14px;margin-bottom:24px;">Главное уложиться в доступный диапазон</div>
  `;
  const sliderWrap = document.createElement('div');
  sliderWrap.className = 'slider';
  sliderWrap.innerHTML = `
    <input type="range" min="${MIN_SUM}" max="${MAX_SUM}" step="10000" value="${state.loanSum}" id="sumRange">
    <input type="number" min="${MIN_SUM}" max="${MAX_SUM}" step="10000" value="${state.loanSum}" id="sumInput" style="margin-top:8px;">
    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray);margin-top:4px;">
      <span>10 000 ₽</span><span>1 700 000 ₽</span>
    </div>
  `;
  screen.appendChild(sliderWrap);
  let error = document.createElement('span');
  error.className = 'error';
  error.style.display = 'none';
  error.innerText = 'Выберите доступное значение';
  screen.appendChild(error);

  const sumRange = sliderWrap.querySelector('#sumRange');
  const sumInput = sliderWrap.querySelector('#sumInput');
  sumRange.oninput = e => {
    sumInput.value = sumRange.value;
    error.style.display = 'none';
    state.loanSum = +sumRange.value;
    render();
  };
  sumInput.oninput = e => {
    let val = +sumInput.value;
    if (val < MIN_SUM || val > MAX_SUM) {
      error.style.display = '';
    } else {
      error.style.display = 'none';
      sumRange.value = val;
      state.loanSum = val;
      render();
    }
  };

  const next = document.createElement('button');
  next.className = 'btn-next';
  next.innerText = 'Следующий шаг';
  next.disabled = (state.loanSum < MIN_SUM || state.loanSum > MAX_SUM);
  next.onclick = () => { state.step = 3; render(); };
  screen.appendChild(next);
}

function renderStep4(screen) {
  screen.innerHTML += `
    <img src="assets/calendar.png" style="width:120px;align-self:center;margin-bottom:24px;">
    <h2 style="font-size:20px;font-weight:700;margin:0 0 8px 0;">На какой срок?</h2>
    <div style="color:var(--mid);font-size:14px;margin-bottom:24px;">Укажите максимальную сумму, которую готовы вносить за кредит</div>
  `;
  const sliderWrap = document.createElement('div');
  sliderWrap.className = 'slider';
  sliderWrap.innerHTML = `
    <input type="range" min="${MIN_YEARS}" max="${MAX_YEARS}" step="1" value="${state.years}" id="yearsRange">
    <input type="number" min="${MIN_YEARS}" max="${MAX_YEARS}" step="1" value="${state.years}" id="yearsInput" style="margin-top:8px;">
    <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--gray);margin-top:4px;">
      <span>1 год</span><span>20 лет</span>
    </div>
  `;
  screen.appendChild(sliderWrap);
  let error = document.createElement('span');
  error.className = 'error';
  error.style.display = 'none';
  error.innerText = 'Выберите доступное значение';
  screen.appendChild(error);

  const yearsRange = sliderWrap.querySelector('#yearsRange');
  const yearsInput = sliderWrap.querySelector('#yearsInput');
  yearsRange.oninput = e => {
    yearsInput.value = yearsRange.value;
    error.style.display = 'none';
    state.years = +yearsRange.value;
    render();
  };
  yearsInput.oninput = e => {
    let val = +yearsInput.value;
    if (val < MIN_YEARS || val > MAX_YEARS) {
      error.style.display = '';
    } else {
      error.style.display = 'none';
      yearsRange.value = val;
      state.years = val;
      render();
    }
  };

  const next = document.createElement('button');
  next.className = 'btn-next';
  next.innerText = 'Следующий шаг';
  next.disabled = (state.years < MIN_YEARS || state.years > MAX_YEARS);
  next.onclick = () => { state.step = 4; render(); };
  screen.appendChild(next);
}

function renderStep5(screen) {
  screen.innerHTML += `
    <div style="color:var(--mid);font-size:14px;font-weight:500;">Кредит наличными</div>
    <h2 style="font-size:20px;font-weight:700;margin:0 0 8px 0;">На своих условиях</h2>
    <div class="offer-logo"><img src="assets/logo.png" style="width:64px;"></div>
    <div class="offer-columns">
      <div class="offer-col">
        <div class="offer-col-title">На своих условиях</div>
        ${state.offers.best.length === 0 ? '<div style="color:var(--gray3);font-size:14px;">Нет подходящих вариантов</div>' : state.offers.best.map((o,i)=>offerCard(o,true,i===0)).join('')}
      </div>
      <div class="offer-col">
        <div class="offer-col-title">Может подойти</div>
        ${state.offers.maybe.length === 0 ? '<div style="color:var(--gray3);font-size:14px;">Нет вариантов</div>' : state.offers.maybe.map(o=>offerCard(o,false,false)).join('')}
      </div>
    </div>
  `;
}

function offerCard(o, isBest, isBadge) {
  return `
    <div class="offer-card">
      <div style="display:flex;align-items:center;">
        <span class="pay">${o.pay.toLocaleString('ru-RU')} ₽/мес</span>
        ${isBadge ? '<span class="offer-badge">Лучше всех</span>' : ''}
      </div>
      <div class="desc">${o.loanSum.toLocaleString('ru-RU')} ₽</div>
      <div class="desc">${o.years} лет</div>
      <div class="desc">${o.collateral}</div>
      <button class="btn" disabled>Выбрать</button>
    </div>
  `;
}

// --- Init ---
document.addEventListener('DOMContentLoaded', render);