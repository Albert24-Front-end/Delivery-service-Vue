<template>
  <div id="map"></div>
  <aside class="main" id="sidebar">
    <div class="main-header">
        <div class="main-title">Оформление доставки</div>
        <div class="main-text">Выберите параметры для расчета отправления</div>
    </div>
    <div class="main-content">
        <div class="main-route">
            <div class="main-block-title">Маршрут</div>
            <div class="main-fields">
                <div class="main-field" id="fromField">
                    <div class="main-pin"></div>
                    <input id="from" placeholder="Откуда: начните вводить адрес" formControlName="from" autocomplete="off"/>
                    <div class="main-ac" id="fromAc" role="listbox" aria-label="Подсказки адресов"></div>
                </div>
                <!-- @if (this.routeForm.get('from')?.invalid && (this.routeForm.get('from')?.dirty || this.routeForm.get('from')?.touched)) { -->
                    <label for="from" class="input-error">Заполните поле Откуда</label>
                <!-- } -->

                <div class="main-field" id="toField">
                    <div class="main-pin"></div>
                    <input id="to" placeholder="Куда: начните вводить адрес" formControlName="to" autocomplete="off"/>
                    <div class="main-ac" id="toAc" role="listbox" aria-label="Подсказки адресов"></div>
                </div>
                <!-- @if (this.routeForm.get('to')?.invalid && (this.routeForm.get('to')?.dirty || this.routeForm.get('to')?.touched)) { -->
                    <label for="from" class="input-error">Заполните поле Куда</label>
                <!-- } -->
            </div>
        </div>

        <div class="main-package">
            <div class="main-block-title">Размер посылки</div>

            <div class="main-sizes">
                    <div v-for="size of sizes" :key="size.value" class="main-size-card">
                        <div class="main-size-top">
                            <div class="main-size-label">{{ size.value }}</div>
                            <div class="main-size-rate">{{ size.rate }} ₽/км</div>
                        </div>
                        <div class="main-size-media">
                            <img src="" alt=""/>
                        </div>
                        <div class="main-size-description"></div>
                    </div>
            </div>
        </div>

        <div class="main-speed">
            <div class="main-block-title">Скорость доставки</div>

            <div class="main-speeds">
                    <div v-for="speed of speeds" :key="speed.value" class="main-speed-card">
                        <img class="main-speed-media" :src="`images/icons/${speed.value}.svg`" alt="Speed"/>
                        <div class="main-speed-description">{{ speed.label }}</div>
                    </div>
            </div>
        </div>

        <div class="main-calculate-block" >
            <button id="calc" class="button calculate-button" type="button" >Рассчитать</button>
        </div>


        <div class="main-result" id="result">
            <div class="main-result-title">Расчеты вашего заказа</div>
            <div class="main-result-lines">
                <div class="main-result-line"><span>Расстояние</span><span id="distanceValue"></span></div>
                <div class="main-result-line"><span>Доставим через</span><span id="durationValue"></span></div>
                <div class="main-result-line"><span>Тариф</span><span id="rateValue"></span></div>
                <div class="main-result-line"><span>Скорость доставки</span><span id="speedValue"></span></div>
            </div>
            <div class="main-price">
                <div class="main-price-label">Итого</div>
                <div class="main-price-value" id="totalValue"></div>
            </div>
        </div>

        <div class="main-order-box">
            <div class="main-order-form" id="orderForm">
                <div class="main-order-title">Оформление доставки</div>
                <div class="main-block-info-row">
                    <div class="main-block-title">Контакты</div>
                    <div class="order-fields">
                        <div class="main-field">
                            <input id="customerName" placeholder="Ваше имя" formControlName="name" autocomplete="off"/>
                        </div>
                        <div class="main-field">
                            <input id="customerPhone" placeholder="Ваш телефон" formControlName="phone" autocomplete="off" inputmode="tel" appOnlyNumbers/>
                        </div>
                        <div>
                            <!-- @if(this.orderForm.get('phone')?.errors?.['pattern']) { -->
                                <label for="customerPhone" class="input-error">Телефон должен состоять только из цифр</label>
                            <!-- } -->
                        </div>
                        <div>
                            <!-- @if (this.orderForm.get('name')?.invalid && (this.orderForm.get('name')?.dirty || this.orderForm.get('name')?.touched)) { -->
                                <label for="customerName" class="input-error">Заполните имя</label>
                            <!-- } -->
                        </div>
                        <div>
                            <!-- @if (this.orderForm.get('phone')?.invalid && (this.orderForm.get('phone')?.dirty || this.orderForm.get('phone')?.touched)) { -->
                                <label for="customerName" class="input-error">Заполните телефон</label>
                            <!-- } -->
                        </div>
                    </div>
                </div>
                <div class="main-block-info-row extra-info">
                    <div class="main-block-title">Дополнительная информация</div>
                    <div class="main-field textarea">
                        <textarea id="comment" placeholder="Детали доставки и комментарии" formControlName="comment"></textarea>
                    </div>
                </div>
                <button id="submit" class="button main-submit-request" type="button">Отправить
                    заявку
                </button>
            </div>

            <div class="main-order-success" id="orderSuccess">
                <div class="main-success-icon">✓</div>
                <div class="main-success-title">Заявка отправлена!</div>
                <div class="main-success-title">Номер отправления – <span id="orderId"></span></div>
                <div class="main-success-subtitle">Мы скоро свяжемся с вами</div>
            </div>
        </div>
    </div>
</aside>
</template>

<script setup lang="ts">
import { DELIVERY_SIZES as sizes } from '@/db/order.config';
import { DELIVERY_SPEEDS as speeds } from '@/db/order.config';

</script>

<style scoped>
#map {
    /* background-image: url("../images/order-bg.png"); */
    /* background-size: cover; */
    position: fixed;
    inset: 0;
}

.main {
    border-radius: 18px;
    box-shadow: 0 7px 20px 0 #0000002E;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.96);
    left: 20px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    position: fixed;
    top: 110px;
    bottom: 20px;
    width: 380px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    z-index: 5;
}

.main-header {
    padding: 18px 18px 12px 18px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
}

.main-title {
    font-size: 20px;
    line-height: 100%;
    font-weight: bold;
}

.main-text {
    font-size: 12px;
    margin-top: 5px;
    color: #7C7C7C;
}

.main-content {
    padding: 14px 18px 18px 18px;
    overflow: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;
    gap: 18px;
    flex: 1;
}

.main-block-title {
    font-size: 12px;
    color: #7C7C7C;
}

.main-route .main-block-title,
.main-package .main-block-title {
    margin-bottom: 6px;
}

.main-sizes {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(3, 1fr);
}

.main-size-card {
    border: 1px solid #E8E8E7;
    background: #FFFFFF;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    user-select: none;
    transition: transform .08s ease, border-color .12s ease, background .12s ease;
    min-height: 139px;
}

.main-size-card:hover {
    transform: translateY(-1px);
}

.main-size-card.is-active {
    background-color: #F8F2D6;
    border-color: #B7B196;
}

.main-size-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.main-size-label {
    font-weight: bold;
    font-size: 14px;
    color: #111111;
    line-height: 100%;
}

.main-size-rate {
    font-size: 12px;
    color: #7C7C7C;
    line-height: 100%;
}

.main-size-media {
    margin-top: 8px;
    height: 57px;
}

.main-size-description {
    margin-top: 8px;
    font-size: 12px;
    color: #7C7C7C;
    line-height: 1.2;
}

.calculate-button {
    width: 100%;
}

.main-result {
    border: 1px solid rgba(0, 0, 0, 0.08);
    background: rgba(255, 255, 255, 0.75);
    border-radius: 16px;
    padding: 12px;
    line-height: 1.25;
}

.main-result-title {
    font-weight: bold;
    font-size: 13px;
    color: #111111;
    margin-bottom: 13px;
}

.main-result-lines {
    gap: 8px;
    display: flex;
    flex-direction: column;
}

.main-result-line {
    font-size: 13px;
    color: rgba(17, 17, 17, 0.85);
    display: flex;
    justify-content: space-between;
}

.main-price {
    margin-top: 18px;
    padding-top: 10px;
    border-top: 1px dashed rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
}

.main-price-label {
    font-size: 12px;
    color: rgba(17, 17, 17, 0.55);
}

.main-price-value {
    font-size: 20px;
    font-weight: bold;
    color: #111111;
    letter-spacing: -0.3px;
}

.main-order-box {
    background: #ffffff;
    border: 1px solid #E8E8E7;
    border-radius: 10px;
    padding: 12px;
}

.main-order-title {
    margin-bottom: 8px;
    font-weight: bold;
    font-size: 14px;
    color: #111111;
}

.main-block-info {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.order-fields {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 10px;
    margin-top: 6px;
}

.main-block-info-row.extra-info {
    display: block;
    margin-top: 13px;
}

.main-submit-request {
    width: 100%;
    margin-top: 6px;
}

.main-order-success {
    display: none;
    text-align: center;
    padding: 22px 12px;
    gap: 12px;
}

.main-order-success.is-visible {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.main-success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: #16a34a;
    color: #ffffff;
    display: grid;
    place-items: center;
    font-size: 30px;
}

.main-success-title {
    font-size: 14px;
    font-weight: bold;
    color: #111111;
}

.main-success-subtitle {
    font-size: 12px;
    color: rgba(17, 17, 17, 0.55);
    line-height: 1.3;
}

.main-speed .main-block-title {
    margin-bottom: 6px;
}

.main-speeds {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(2, 1fr);
}

.main-speed-card {
    border: 1px solid #E8E8E7;
    background: #FFFFFF;
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    user-select: none;
    transition: transform .08s ease, border-color .12s ease, background .12s ease;
    display: flex;
    align-items: center;
    gap: 10px;
}

.main-speed-card:hover {
    transform: translateY(-1px);
}

.main-speed-card.is-active {
    background-color: #F8F2D6;
    border-color: #B7B196;
}

.main-speed-description {
    font-size: 12px;
    color: #7C7C7C;
    line-height: 1.2;
}

@media (max-width: 767px) {
    .main {
        left: 10px;
        right: 10px;
        top: 50%;
        bottom: 12px;
        width: auto;
        max-width: none;
    }
}

@media (max-width: 420px) {
    .main-sizes {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 280px) {
    .main-sizes {
        grid-template-columns: repeat(1, 1fr);
    }
}

@media (max-width: 305px) {
    .main-speeds {
        grid-template-columns: repeat(1, 1fr);
    }
}

@media (max-width: 380px) {
    .order-fields {
        grid-template-columns: repeat(1, 1fr);
    }
}
</style>
