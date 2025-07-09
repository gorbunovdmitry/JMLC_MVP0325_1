const app = document.getElementById('app');

function renderLanding() {
  // Если уже была заглушка, не показываем лендинг
  if (localStorage.getItem('placeholderShown') === '1') {
    renderPlaceholder();
    return;
  }
  app.innerHTML = `
    <div class="landing">
      <img src="img/calendar.png" alt="Календарь" class="landing__img" />
      <div class="landing__content">
        <div class="landing__title">Зарплата каждый день</div>
        <div class="landing__desc">
          Получать заработанные деньги теперь можно хоть каждый день — не нужно ждать зарплату или аванс
        </div>
        <ul class="landing__list">
          <li><img src="img/rub-flag.svg" class="landing__list-icon" alt="Рубль" />Взять деньги можно в счёт будущей зарплаты</li>
          <li><img src="img/clock.svg" class="landing__list-icon" alt="Часы" />Получить заработанные деньги можно столько раз, сколько хотите</li>
          <li><img src="img/percent.svg" class="landing__list-icon" alt="0%" />Не нужно платить проценты — это не кредит и не заём</li>
          <li><img src="img/credit.svg" class="landing__list-icon" alt="Кредитная история" />Сервис не испортит кредитную историю</li>
        </ul>
        <div class="landing__params">
          <div class="landing__params-title">Параметры подключения</div>
          <div class="landing__params-list">
            <div>
              <div class="landing__param-label">Куда подключить сервис</div>
              <div class="landing__param-value">Зарплатный счет</div>
            </div>
            <div>
              <div class="landing__param-label">Стоимость подключения</div>
              <div class="landing__param-value">Бесплатно, если не пользоваться</div>
            </div>
            <div>
              <div class="landing__param-label">С каждого использования</div>
              <div class="landing__param-value">249 ₽ за каждый раз</div>
            </div>
          </div>
        </div>
        <div class="landing__docs">
          Нажимая «Отправить заявку» и вводя секретный код, вы даёте своё согласие с условиями и подписываете документы.<br>
          Услуга предоставляется партнёром ООО «ДВ».
        </div>
        <button class="landing__button" id="sendBtn">Отправить заявку</button>
      </div>
    </div>
  `;
  document.getElementById('sendBtn').onclick = renderPlaceholder;
}

function renderPlaceholder() {
  app.innerHTML = `
    <div class="placeholder">
      <img src="img/moai.png" alt="Moai" class="placeholder__img" />
      <div class="placeholder__title">Только тссс</div>
      <div class="placeholder__desc">
        Вы поучаствовали в очень важном исследовании, которое поможет улучшить продукт. Вы – наш герой!
      </div>
    </div>
  `;
  // Очищаем историю, чтобы нельзя было вернуться назад
  history.replaceState(null, '', location.href);
}

renderLanding(); 