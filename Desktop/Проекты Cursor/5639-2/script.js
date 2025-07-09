// --- Константы ---
const RATE = 0.20; // 20% годовых
const MIN_AMOUNT = 1000;
const MAX_AMOUNT = 300000;
const TERMS = [3, 6, 9, 12];
const STORAGE_KEY = 'installment-completed';

// --- Состояние ---
let state = {
  amount: 40000,
  term: 12,
  payment: null,
  serviceFee: null
};

// --- Утилиты ---
function formatMoney(num) {
  return num.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
}
function formatMoneyPrecise(num) {
  return num.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 2 });
}

function calcPayment(amount, term) {
  const monthlyRate = RATE / 12;
  const n = term;
  const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  return Math.round(payment);
}
function calcServiceFee(amount, term) {
  // Сумма всех процентов за год (если срок < 12 мес — пропорционально)
  const totalInterest = amount * RATE * (term / 12);
  return totalInterest;
}

// --- Рендеринг ---
function render() {
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    renderSuccess();
    return;
  }
  const hash = location.hash.replace('#', '');
  if (hash === 'confirm') {
    renderConfirm();
  } else if (hash === 'success') {
    renderSuccess();
  } else if (hash === 'info') {
    renderInfo();
  } else {
    renderCalculator();
  }
}

function renderCalculator() {
  // Сохраняем фокус и позицию курсора
  let selectionStart = null, selectionEnd = null, wasFocused = false;
  const amountInput = document.getElementById('amount');
  if (amountInput && document.activeElement === amountInput) {
    wasFocused = true;
    selectionStart = amountInput.selectionStart;
    selectionEnd = amountInput.selectionEnd;
  }
  state.payment = calcPayment(state.amount, state.term);
  state.serviceFee = calcServiceFee(state.amount, state.term);
  document.title = 'Рассрочка';
  // Проверка валидности суммы
  const amountNum = parseInt(state.amount, 10);
  const isAmountValid = amountNum >= MIN_AMOUNT && amountNum <= MAX_AMOUNT;
  document.getElementById('app').innerHTML = `
    <h2 class="screen-title">Получите до&nbsp;300&nbsp;000&nbsp;₽&nbsp;в&nbsp;рассрочку</h2>
    <p style="margin-bottom:24px;">Деньги придут на вашу карту. И не нужно идти в банк</p>
    <label for="amount" style="color:#888;font-size:1.1rem;">Введите сумму</label>
    <input id="amount" type="number" value="${state.amount}" autocomplete="off" class="${isAmountValid ? '' : 'input-error'}" />
    <div style="color:#888;font-size:1rem;margin-bottom:16px;">от 1 000 ₽ до 300 000 ₽</div>
    <div style="color:#888;font-size:1.1rem;">Выберите срок</div>
    <div class="term-btns">
      ${TERMS.map(term => `<button class="term-btn${state.term === term ? ' selected' : ''}" data-term="${term}">${term} мес</button>`).join('')}
    </div>
    <div class="card">
      <div class="card-title">${formatMoney(state.payment)} в месяц</div>
      <small>включая плату за услугу</small>
    </div>
    <button class="button" id="nextBtn" ${isAmountValid ? '' : 'disabled'}>Продолжить</button>
  `;
  // После рендера восстанавливаем фокус и позицию курсора
  const newAmountInput = document.getElementById('amount');
  if (wasFocused && newAmountInput) {
    newAmountInput.focus();
    if (selectionStart !== null && selectionEnd !== null) {
      newAmountInput.setSelectionRange(selectionStart, selectionEnd);
    }
  }
  document.getElementById('amount').addEventListener('input', e => {
    state.amount = e.target.value;
    renderCalculator();
  });
  document.querySelectorAll('.term-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      state.term = parseInt(btn.dataset.term);
      renderCalculator();
    });
  });
  if (isAmountValid) {
    document.getElementById('nextBtn').addEventListener('click', () => {
      location.hash = 'confirm';
    });
  }
}

function renderConfirm() {
  state.payment = calcPayment(state.amount, state.term);
  state.serviceFee = calcServiceFee(state.amount, state.term);
  document.title = 'Подтверждение';
  const amountNum = parseInt(state.amount, 10);
  let infoBlockHtml = '';
  if (amountNum >= 50000 && amountNum <= 199999) {
    infoBlockHtml = `
      <div class="info-block" id="infoBlock">
        <span class="info-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1362 17.3359V10.6745H10.8741V17.3359H13.1362Z" fill="#212124"/>
            <path d="M13.4541 7.88802C13.4541 8.69056 12.8035 9.34115 12.001 9.34115C11.1984 9.34115 10.5479 8.69056 10.5479 7.88802C10.5479 7.08548 11.1984 6.4349 12.001 6.4349C12.8035 6.4349 13.4541 7.08548 13.4541 7.88802Z" fill="#212124"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.001 12.0078C22.001 17.5307 17.5238 22.0078 12.001 22.0078C6.47813 22.0078 2.00098 17.5307 2.00098 12.0078C2.00098 6.48496 6.47813 2.00781 12.001 2.00781C17.5238 2.00781 22.001 6.48496 22.001 12.0078ZM20.001 12.0078C20.001 16.4261 16.4193 20.0078 12.001 20.0078C7.5827 20.0078 4.00098 16.4261 4.00098 12.0078C4.00098 7.58953 7.5827 4.00781 12.001 4.00781C16.4193 4.00781 20.001 7.58953 20.001 12.0078Z" fill="#212124"/>
          </svg>
        </span>
        <span class="info-text">Зачислим через 4 часа<br>или чуть позже</span>
        <span class="info-arrow" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_7502_6226)">
              <path d="M20.999 12.0078L15.499 17.5078L16.999 19.0078C20.3185 15.8836 23.999 12.0078 23.999 12.0078C23.999 12.0078 20.3185 8.13201 16.999 5.00781L15.499 6.50781L20.999 12.0078Z" fill="#BABBC2"/>
            </g>
            <defs>
              <clipPath id="clip0_7502_6226">
                <rect width="24" height="24" fill="white" transform="translate(-0.000976562 0.0078125)"/>
              </clipPath>
            </defs>
          </svg>
        </span>
      </div>
    `;
  } else if (amountNum >= 200000 && amountNum <= 300000) {
    infoBlockHtml = `
      <div class="info-block" id="infoBlock">
        <span class="info-icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.1362 17.3359V10.6745H10.8741V17.3359H13.1362Z" fill="#212124"/>
            <path d="M13.4541 7.88802C13.4541 8.69056 12.8035 9.34115 12.001 9.34115C11.1984 9.34115 10.5479 8.69056 10.5479 7.88802C10.5479 7.08548 11.1984 6.4349 12.001 6.4349C12.8035 6.4349 13.4541 7.08548 13.4541 7.88802Z" fill="#212124"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M22.001 12.0078C22.001 17.5307 17.5238 22.0078 12.001 22.0078C6.47813 22.0078 2.00098 17.5307 2.00098 12.0078C2.00098 6.48496 6.47813 2.00781 12.001 2.00781C17.5238 2.00781 22.001 6.48496 22.001 12.0078ZM20.001 12.0078C20.001 16.4261 16.4193 20.0078 12.001 20.0078C7.5827 20.0078 4.00098 16.4261 4.00098 12.0078C4.00098 7.58953 7.5827 4.00781 12.001 4.00781C16.4193 4.00781 20.001 7.58953 20.001 12.0078Z" fill="#212124"/>
          </svg>
        </span>
        <span class="info-text">Зачислим через 48 часов<br>или чуть позже</span>
        <span class="info-arrow" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_7502_6226)">
              <path d="M20.999 12.0078L15.499 17.5078L16.999 19.0078C20.3185 15.8836 23.999 12.0078 23.999 12.0078C23.999 12.0078 20.3185 8.13201 16.999 5.00781L15.499 6.50781L20.999 12.0078Z" fill="#BABBC2"/>
            </g>
            <defs>
              <clipPath id="clip0_7502_6226">
                <rect width="24" height="24" fill="white" transform="translate(-0.000976562 0.0078125)"/>
              </clipPath>
            </defs>
          </svg>
        </span>
      </div>
    `;
  }
  document.getElementById('app').innerHTML = `
    <div class="header-row">
      <button id="backBtn" aria-label="Назад">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6799 11H7.96795L13.3439 5.4L11.9999 4L4.31995 12L11.9999 20L13.3439 18.6L7.96795 13H19.6799V11Z" fill="#030306" fill-opacity="0.88"/>
        </svg>
      </button>
    </div>
    <h1 class="screen-title-confirm">Всё проверьте, и можно оформлять</h1>
    <ul class="confirm-list">
      <li><span class="label">Всего в рассрочку</span><span class="value">${formatMoney(state.amount)}</span></li>
      <li><span class="label">Плата за услугу</span><span class="value">${formatMoneyPrecise(state.serviceFee)} за период</span></li>
      <li><span class="label">Платёж в месяц</span><span class="value">${formatMoney(state.payment)}</span></li>
      <li><span class="label">Срок</span><span class="value">${state.term} месяцев</span></li>
    </ul>
    <div style="color:#888;font-size:1.1rem;margin-bottom:8px;">Куда зачислить деньги</div>
    <div class="account-box"><span><span class="ruble">₽</span></span>Текущий счет</div>
    ${infoBlockHtml}
    <button class="button" id="submitBtn">Оформить рассрочку</button>
  `;
  document.getElementById('backBtn').addEventListener('click', () => {
    location.hash = '';
  });
  document.getElementById('submitBtn').addEventListener('click', () => {
    location.hash = 'success';
  });
  if (infoBlockHtml) {
    document.getElementById('infoBlock').addEventListener('click', () => {
      location.hash = 'info';
    });
  }
}

function renderInfo() {
  document.title = 'Порядок зачисления суммы рассрочки';
  document.getElementById('app').innerHTML = `
    <h2 class="screen-title" style="margin-top:32px;">Порядок зачисления<br>суммы рассрочки</h2>
    <p style="font-size:1.15rem;margin-bottom:18px;">По закону о защите от мошенничества, кредитные деньги зачислим<br>через некоторое время.</p>
    <p style="font-size:1.15rem;margin-bottom:18px;">Срок зачисления зависит от суммы долга по действующим рассрочкам и суммы новой рассрочки</p>
    <h3 style="font-size:1.2rem;margin-top:32px;margin-bottom:16px;">Как быстро поступят деньги</h3>
    <ul class="info-list">
      <li>до 49 999 ₽ — сразу на карту</li>
      <li>от 50 000 до 199 999 ₽ — перечислим деньги через 4 часа или чуть позже</li>
      <li>свыше 200 000 ₽ — перечислим деньги через 48 часов или чуть позже</li>
    </ul>
    <h3 style="font-size:1.2rem;margin-top:32px;margin-bottom:16px;">Пример</h3>
    <p style="font-size:1.15rem;margin-bottom:32px;">У Саши есть действующая рассрочка 35 000 ₽ и он оформляет новую рассрочку на сумму 25 000 ₽. Поскольку общая сумма составляет 60 000 рублей — новую рассрочку сможем перечислить только через 4 часа.</p>
    <button class="info-ok-btn" id="infoOkBtn">Понятно</button>
  `;
  document.getElementById('infoOkBtn').addEventListener('click', () => {
    location.hash = 'confirm';
  });
}

function renderSuccess() {
  document.title = 'Спасибо!';
  document.getElementById('app').innerHTML = `
    <img src="img/success.png" alt="Успех" class="success-img" style="display:block;margin:48px auto 32px auto;width:160px;height:160px;object-fit:contain;" />
    <h2 style="text-align:center;">Только тссс</h2>
    <p style="text-align:center;font-size:1.2rem;">Вы поучаствовали в очень важном исследовании, которое поможет улучшить продукт. Вы – наш герой!</p>
  `;
  // Ставим флаг, чтобы при обновлении всегда показывалась заглушка
  localStorage.setItem(STORAGE_KEY, 'true');
  // Блокируем возврат назад
  window.history.pushState(null, '', window.location.href);
  window.onpopstate = function() {
    window.history.go(1);
  };
}

// --- Инициализация ---
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  // Если уже завершено — сразу показываем заглушку
  if (localStorage.getItem(STORAGE_KEY) === 'true') {
    location.hash = 'success';
  }
  render();
}); 