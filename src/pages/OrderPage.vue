<template>
  <div id="map">
    <yandex-map
      v-model="map"
      :settings="{
        location: {
          center: [69.164708, 41.184022], // [long, lat] - Tashkent
          zoom: 5,
        },
      }"
      width="100%"
      height="100%"
      theme
      showScaleInCopyrights: true
    >
        <yandex-map-default-scheme-layer/>
        <yandex-map-default-features-layer/>
        <!-- <yandex-map-default-marker :settings="{ coordinates: [69.164708, 41.184022] }"/> -->
        <yandex-map-feature
            v-if="route"
            :settings="{
                ...route,
                style: {
                    stroke: [{color: '#e100ff', width: 5}]
                },
            }"
        />
        <yandex-map-default-marker
            v-if="points.from"
            :settings="{coordinates: points.from, color: 'green'}"
        />
        <yandex-map-default-marker
            v-if="points.to"
            :settings="{coordinates: points.to, color: 'red'}"
        />
    </yandex-map>
  </div>
  <aside class="main" id="sidebar">
    <div class="main-header">
        <div class="main-title">{{ t('order.title') }}</div>
        <div class="main-text">{{ t('order.subtitle') }}</div>
    </div>
    <div class="main-content">
        <div class="main-route">
            <div class="main-block-title">{{ t('order.route') }}</div>
            <div class="main-fields">
                <div class="main-field" id="fromField" :class="{ 'error': v$.route.from.$error }">
                    <div class="main-pin"></div>
                    <v-select label="label" class="address-select" v-model="stateForm.route.from" :options="suggestions.from" :filterable="false" @search="(q) => onSearch(q, 'from')" @update:modelValue="onPointSelected" :disabled="!!orderStore.lastOrderId" :placeholder="t('order.from_placeholder')" @blur="v$.route.from.$touch()">
                        <template #no-options>{{ t('order.errors.no_suggest') }}</template>
                    </v-select>
                    <div class="main-ac" id="fromAc" role="listbox" aria-label="Подсказки адресов"></div>
                </div>

                <label for="from" v-if="v$.route.from.$error" class="input-error">{{ t('order.errors.from') }}</label>

                <div class="main-field" id="toField" :class="{ 'error': v$.route.to.$error }">
                    <div class="main-pin"></div>
                    <v-select label="label" class="address-select" v-model="stateForm.route.to" :options="suggestions.to" :filterable="false" @search="(q) => onSearch(q, 'to')" @update:modelValue="onPointSelected" :disabled="!!orderStore.lastOrderId" :placeholder="t('order.to_placeholder')"  @blur="v$.route.to.$touch()">
                        <template #no-options>{{ t('order.errors.no_suggest') }}</template>
                    </v-select>
                    <div class="main-ac" id="toAc" role="listbox" aria-label="Подсказки адресов"></div>
                </div>
                <label for="from" v-if="v$.route.to.$error" class="input-error">{{ t('order.errors.to') }}</label>
            </div>
        </div>

        <div class="main-package" v-if="!orderStore.lastOrderId">
            <div class="main-block-title">{{ t('order.package_size') }}</div>

            <div class="main-sizes">
                    <div v-for="size of DELIVERY_SIZES" :key="size.value" class="main-size-card" :class="{'is-active': stateForm.route.size === size.value}" @click="stateForm.route.size = size.value">
                        <div class="main-size-top">
                            <div class="main-size-label">{{ size.value.toUpperCase() }}</div>
                            <div class="main-size-rate">{{ size.rate }} {{ t('order.summary.price_per_km') }}</div>
                        </div>
                        <div class="main-size-media" :class="{ 'main-size-media-palleta': size.value === 'max' }">
                            <img :src="`/src/assets/images/sizes/${size.value}.png`" alt="size"/>
                        </div>
                        <div class="main-size-description" v-html="size.description()"></div>
                    </div>
            </div>
        </div>

        <div class="main-speed" v-if="!orderStore.lastOrderId">
            <div class="main-block-title">{{ t('order.delivery_speed') }}</div>

            <div class="main-speeds">
                    <div v-for="speed of DELIVERY_SPEEDS" :key="speed.value" class="main-speed-card" :class="{'is-active': stateForm.route.speed === speed.value}" @click="stateForm.route.speed = speed.value">
                        <img class="main-speed-media" :src="`/src/assets/images/icons/${speed.value}.svg`" alt="Speed"/>
                        <div class="main-speed-description">{{ speed.label() }}</div>
                    </div>
            </div>
        </div>

        <div class="main-calculate-block" v-if="!orderStore.lastOrderId">
            <button id="calc" class="button calculate-button" type="button" :disabled="v$.route.$invalid" @click="handleCalculate">{{ t('buttons.calculate') }}</button>
        </div>


        <div class="main-result" id="result" v-if="calculationResult">
            <div class="main-result-title">{{ t('order.summary.title') }}</div>
            <div class="main-result-lines">
                <div class="main-result-line"><span>{{ t('order.summary.distance') }}</span><span id="distanceValue">{{ calculationResult.distance }}</span></div>
                <div class="main-result-line"><span>{{ t('order.summary.delivery_time') }}</span><span id="durationValue">{{ calculationResult.duration }}</span></div>
                <div class="main-result-line"><span>{{ t('order.summary.tariff') }}</span><span id="rateValue">{{ calculationResult.rate }}</span></div>
                <div class="main-result-line"><span>{{ t('order.summary.speed') }}</span><span id="speedValue"></span>{{ calculationResult.speed }}</div>
            </div>
            <div class="main-price">
                <div class="main-price-label">{{ t('order.summary.total') }}</div>
                <div class="main-price-value" id="totalValue">{{ calculationResult.total }}</div>
            </div>
        </div>

        <div class="main-order-box" v-if="!orderStore.lastOrderId">
            <div class="main-order-form" id="orderForm">
                <div class="main-order-title">{{ t('order.contacts.title') }}</div>
                <div class="main-block-info-row">
                    <div class="main-block-title">{{ t('order.contacts.section') }}</div>
                    <div class="order-fields">
                        <div class="order-field">
                            <input :placeholder="t('order.contacts.name')" autocomplete="off" @blur="v$.order.name.$touch()" v-model="stateForm.order.name"/>
                        </div>
                        <div class="order-field">
                            <input :placeholder="t('order.contacts.phone')" autocomplete="off" inputmode="numeric" appOnlyNumbers @input="onPhoneInput" @blur="v$.order.phone.$touch()" v-model="stateForm.order.phone"/>
                        </div>
                        <label v-if="v$.order.name.$error" class="input-error error-label name-error">{{ t('order.errors.name') }}</label>
                        <div class="error-labels">
                            <label v-if="v$.order.phone.$error" class="input-error">{{ t('order.errors.phone') }}</label>
                            <label v-if="v$.order.phone.minLength.$error" class="input-error">{{ t('order.errors.phone_digit') }}</label>
                        </div>
                    </div>
                </div>
                <div class="main-block-info-row extra-info">
                    <div class="main-block-title">{{ t('order.comment.title') }}</div>
                    <div class="main-field textarea">
                        <textarea id="comment" :placeholder="t('order.comment.placeholder')" formControlName="comment" v-model="stateForm.order.comment"></textarea>
                    </div>
                </div>
                <button id="submit" class="button main-submit-request" type="button" :disabled="v$.order.$invalid" @click="handleSubmit">{{ t('buttons.send') }}</button>
            </div>
        </div>
        <div v-else class="main-order-success is-visible" id="orderSuccess" >
            <div class="main-success-icon">✓</div>
            <div class="main-success-title">{{ t('order.success.title') }}</div>
            <div class="main-success-title">{{ t('order.success.number') }}<span id="orderId">{{ orderStore.lastOrderId }}</span></div>
            <div class="main-success-subtitle">{{ t('order.success.message') }}</div>
            <button @click="orderStore.clear()" class="button" type="button">{{ t('buttons.build_new') }}</button>
        </div>
    </div>
</aside>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, shallowRef, onMounted } from 'vue';
import getOrderData from '@/db/order.config';
import { useOrderStore } from '@/store/app'
import { useCreateDelivery } from '@/composables/useDeliveryData'
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify'
import type { YMap, RouteFeature, LngLat, YMapMarkerEventHandler, YMapLocationRequest, BaseRouteResponse } from '@yandex/ymaps3-types';
import {
  getLocationFromBounds,
  yandexMapLoadStatus,
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapFeature,
  YandexMapDefaultMarker
} from 'vue-yandex-maps';
import useVuelidate from '@vuelidate/core'
import { helpers, required, minLength } from '@vuelidate/validators'
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

const { t } = useI18n();
const orderStore = useOrderStore()
const { DELIVERY_SIZES, DELIVERY_SPEEDS } = getOrderData();
const { result, error, loading, createOrderDelivery } = useCreateDelivery();

const location = ref<YMapLocationRequest>({
    center: [69.164708, 41.184022],
    zoom: 5,
})
const map = shallowRef<null | YMap>(null);
const calculationResult = ref<any>(null)

const points = reactive({
  from: null as LngLat | null,
  to: null as LngLat | null,
});
const suggestions = reactive({ from: [], to: [] });

const stateForm = reactive({
    route: {
        from: null as any,
        to: null as any,
        size: 'xs',
        speed: 'regular'
    },
    order: {
        name: '',
        phone: '',
        comment: ''
    }
})

const rules = computed(() => ({
  route: {
    from: { required: helpers.withMessage(t('order.errors.from'), required) },
    to: { required: helpers.withMessage(t('order.errors.to'), required) },
  },
  order: {
    name: { required: helpers.withMessage(t('order.errors.name'), required) },
    // Для телефона обычно используют regex, но пока оставим как у тебя (с исправленным minLength)
    phone: {
      required: helpers.withMessage(t('order.errors.phone'), required),
      // Если используешь маску, minLength(18) для "+7 (999) 999-99-99"
      minLength: helpers.withMessage(t('order.errors.phone_digit'), minLength(5)),
      numeric: helpers.withMessage(t('order.errors.phone_digit'), helpers.regex(/^[0-9]+$/))
    }
  }
}))

// declare let ymaps: any;
const onPhoneInput = (e: Event) => {
    const target = e.target as HTMLInputElement
    target.value = target.value.replace(/\D/g, '')
    stateForm.order.phone = target.value
}

const v$ = useVuelidate(rules, stateForm)

onMounted(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const coords = [pos.coords.longitude, pos.coords.latitude];
            const res = await ymaps3.search({ text: coords.join(',') });

            if (res[0]) {
                stateForm.route.from = { label: res[0].properties.name, coords }
            }
        })
    }
})

const onSearch = async (query: string, field: 'from' | 'to') => {
    if (query.length < 3) return;
    const results = await ymaps3.search({text: query});
    suggestions[field] = results.map((item: any) => ({
        label: item.properties.name + (item.properties.description ? `, ${item.properties.description}` : ''),
        coords: item.geometry.coordinates
    }))
}

// const pointAName = shallowRef('');
// const pointBName = shallowRef('');
const route = shallowRef<RouteFeature | null>(null);

const onPointSelected = () => {
    if (stateForm.route.from?.coords) points.from = stateForm.route.from.coords;
    if (stateForm.route.to?.coords) points.to = stateForm.route.to.coords;
};

async function fetchRoute(startCoordinates: LngLat, endCoordinates: LngLat) {
    const result = await ymaps3.route({
        points: [startCoordinates, endCoordinates],
        type: 'driving',
        bounds: true,
    })
  console.log('routes response:', result)

  if (!result[0]) {
    toast.error(t('order.route_failure'))
    return
  }
  const firstRoute = result[0].toRoute();
  console.log('firstRoute:', firstRoute)
  console.log('firstRoute.properties:', firstRoute.properties)
  console.log('geometry coords length:', firstRoute.geometry.coordinates.length)
  if (firstRoute.geometry.coordinates.length === 0) return;

  return firstRoute;
}

// const routeHandler = async (newRoute?: RouteFeature) => {
//     if (!newRoute) {
//         alert('Маршрут не найден');
//         route.value = null;
//         return;
//     }

//     route.value = newRoute;

//     if(newRoute.properties.bounds) {
//         const newLocation = await getLocationFromBounds({
//             bounds: newRoute.properties.bounds,
//             map: map.value!,
//         })

//         location.value = {
//             center: newLocation.center,
//             zoom: Math.floor(newLocation.zoom) - 1,
//             duration: 300,
//         }
//     };
// }

// const onRouteResult = (result: BaseRouteResponse, type: AvailableTypes) => {
//     const mapPoints = result.toRoute();
//     console.log(mapPoints);
//     routeHandler(mapPoints);

//     const startCoords = mapPoints.geometry.coordinates[0];
//     const endCoords = mapPoints.geometry.coordinates[mapPoints.geometry.coordinates.length - 1];
//     points.from = startCoords;
//     points.to = endCoords;
// }

// watch(yandexMapLoadStatus, async status => {
//     if (status !== 'loaded') return;

//     const fetchedRoute = await fetchRoute(points.from, points.to);
//     await routeHandler(fetchedRoute);
// }, { immediate: true })


const handleCalculate = async () => {
  console.log('ymaps3 status:', typeof ymaps3)
  console.log('map value:', map.value)
  const isRouteValid = await v$.value.route.$validate()
  if (!isRouteValid) return

  const fromCoords = stateForm.route.from?.coords;
  const toCoords = stateForm.route.to?.coords;
  console.log('coords:', fromCoords, toCoords)


  if (!fromCoords[0] || !toCoords[0]) {
    toast.error(t('order.route_failure'))
    return
  }

  points.from = fromCoords;
  points.to = toCoords;

  try {
//   const routes = await ymaps3.route({
//     points: [fromCoords, toCoords],
//     type: 'driving',
//     bounds: true,
//   })
//   console.log('routes response:', routes)

//   if (!routes[0]) {
//     toast.error(t('order.route_failure'))
//     return
//   }

//   const firstRoute = routes[0].toRoute();
//   console.log('firstRoute:', firstRoute)
//     console.log('firstRoute.properties:', firstRoute.properties)
//     console.log('geometry coords length:', firstRoute.geometry.coordinates.length)
//   if (firstRoute.geometry.coordinates.length === 0) return;

//   route.value = firstRoute;
//   console.log('Route object:', route.value)
  const firstRoute = await fetchRoute(fromCoords, toCoords);
  if (!firstRoute || firstRoute.geometry.coordinates.length === 0) {
    toast.error(t('order.route_failure'));
    return;
  }
  route.value = firstRoute;
  const distanceInMeters = firstRoute.properties.length;
  const km = distanceInMeters / 1000;
  const config = DELIVERY_SIZES.value.find(s => s.value === stateForm.route.size);


  if (config) {
      let total = Math.max(config.min, Math.ceil(km * config.rate));
      let duration = Math.min(30, 1 + Math.ceil(km / 80));

      if (stateForm.route.speed === 'fast') {
        total = Math.ceil(total * 1.15);
        duration = Math.ceil(duration * 0.7);
      }

      calculationResult.value = {
        distance: `${km.toFixed(1)} ${t('order.summary.km')}`,
        duration: `${duration} ${t('order.summary.day')}`,
        rate: `${config.rate} ${t('order.summary.price_per_km')}`,
        total,
        speed: stateForm.route.speed === 'fast' ? `${t('speeds.fast')}` : `${t('speeds.regular')}`
      };
  }

  if (map.value && firstRoute.properties.bounds) {
    const newLocation = await getLocationFromBounds({
        bounds: firstRoute.properties.bounds,
        map: map.value,
    });

    location.value = {
        ...newLocation,
        duration: 500
    };
  }
  toast.success(t('order.route_success'));
  } catch (e) {
    console.error('route error:', e)
  }
}

const handleSubmit = async () => {
    const isFormValid = await v$.value.$validate()
    if (!isFormValid || !calculationResult.value) {
      toast.warn('Заполните все поля и рассчитайте доставку')
      return
    }

    const payload = {
        customer: {
            name: stateForm.order.name,
            phone: stateForm.order.phone,
            comment: stateForm.order.comment,
        },
        calculation: {
            from: stateForm.route.from.label,
            to: stateForm.route.to.label,
            ...calculationResult.value
        },
        createdAt: new Date().toISOString(),
    }

    await createOrderDelivery(payload)

    if (error.value) {
      toast.error(error.value)
    } else if (result.value) {
      // Сохраняем реальный ID из ответа сервера
      orderStore.saveOrder(result.value.id, calculationResult.value)
      toast.success(t('order.success.title'))
      resetForm()
    }
}

const resetForm = () => {
  stateForm.route.from = null
  stateForm.route.to = null
  stateForm.order.name = ''
  stateForm.order.phone = ''
  stateForm.order.comment = ''
  calculationResult.value = null
  points.from = null
  points.to = null
  v$.value.$reset()
}
</script>

<style scoped>
#map {
    /* background-image: url("../images/order-bg.png"); */
    /* background-size: cover; */
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
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

.calculate-button, .main-submit-request {
    width: 100%;
    height: 44px;
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
    grid-template-areas:
        "name phone"
        "nameError phoneError";
}

.main-field:nth-child(1) {
    grid-area: name;
}

.main-field:nth-child(2) {
    grid-area: phone;
}

.input-error {
    grid-area: nameError;
}

.error-labels {
    grid-area: phoneError;
}

.main-block-info-row.extra-info {
    display: block;
    margin-top: 13px;
}

.main-submit-request {
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

.error-labels {
    width: 100%;
    display: flex;
    flex-direction: column;
}

.address-select {
  width: 100%;
  --vs-border-color: transparent;
  --vs-dropdown-bg: #fff;
}
:deep(.vs__dropdown-toggle) {
  border: none;
  padding: 0;
}
:deep(.vs__selected) {
  padding: 0;
  margin: 0;
  color: #333;
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
        grid-template-areas:
            "name"
            "nameError"
            "phone"
            "phoneError";
    }
}
</style>
