<template>
  <div class="wrapper pt-42.5 pb-12.5 bg-[#F4F4F4] min-h-screen">
    <main class="track-content w-[593px] my-0 mx-auto">
    <section class="track-card track-search ">
        <div class="track-title text-xl p-5 leading-none font-bold border-b border-b-soild border-b-[#EEEEEE]">{{ t("header.track") }}</div>
        <div class="track-action p-5">
            <div class="main-field track-field mb-2.5">
                <input id="trackNumber" v-model="trackNumber" :placeholder="t('inputs.get_track_info')" autocomplete="off"/>
            </div>
            <button id="trackButton" class="button track-button w-full h-12.5" type="button" @click="handleTrack" :disabled="loading">{{ loading ? '...' : t("buttons.get_track_info") }}</button>
            <p v-if="error" class="mt-3 text-red-500 text-sm text-center font-medium">{{ error }}</p>
        </div>
    </section>
    <transition name="fade">
        <section v-if="data" class="track-card track-result" id="trackResult">
                <div class="track-result-header">
                    <div class="track-id" id="trackIdValue"></div>
                    <div class="track-routes">
                        <div class="track-route">
                            <div class="track-route-pin">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="orange" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                                </svg>
                            </div>
                            <div class="track-route-address" id="trackFromValue" i18n>
                                {{ t('track.from') }}: <strong>{{ data.route.from }}</strong>
                            </div>
                        </div>
                        <div class="track-route track-route-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-6">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"/>
                            </svg>
                        </div>
                        <div class="track-route">
                            <div class="track-route-pin">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="green" class="size-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
                                </svg>
                            </div>
                            <div class="track-route-address" id="trackToValue" i18n>
                                {{ t('track.to') }}: <strong>{{ data.route.to }}</strong>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="track-info">
                    <div class="track-status-title" i18n>{{ t('track.status_title') }}:</div>
                    <div class="track-status-list" id="trackStatusList">
                        <div class="track-status" v-for="(status, index) in data.statuses" :key="index">
                            <img class="track-status-icon" :src="`/src/assets/images/icons/${status.type}.svg`" :alt="status.label"/>
                            <div class="track-status-text">
                                <div class="track-status-text-state">{{ status.label }}</div>
                                <div class="track-status-text-date">{{ status.date }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </transition>
  </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDeliveryData } from '@/composables/useDeliveryData';
import { useI18n } from 'vue-i18n';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css'

const { t } = useI18n()
const trackNumber = ref('')
const { data, error, loading, fetchDeliveryInfo } = useDeliveryData();

watch(error, (newError) => {
    if (newError) {
        toast.error(t('track.toasts.server_failure'), {
            autoClose: 2000,
            transition: toast.TRANSITIONS.SLIDE
        });
    }
})

const handleTrack = async () => {
    const cleanId = trackNumber.value.trim();

    if (!cleanId) {
        toast.error(t('track.toasts.fill_number'), {
            autoClose: 2000,
            transition: toast.TRANSITIONS.SLIDE
        });
        return
    }

    const numericId = Number(cleanId)
    if (isNaN(numericId) || numericId <= 0) {
        toast.warn(t('track.toasts.input_error'), {
            autoClose: 2000,
            transition: toast.TRANSITIONS.SLIDE
        });
        return
    }
    await fetchDeliveryInfo(numericId)
    if (!error.value && data.value) {
        toast.success(t('track.toasts.success'), {
            autoClose: 1500,
            transition: toast.TRANSITIONS.SLIDE
        });
    }
}
</script>

<style scoped>
.wrapper {
    background: #F4F4F4 url("../assets/images/track-bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
}

.track-card {
    width: 100%;
    border-radius: 18px;
    box-shadow: 0 7px 20px 0 #0000002E;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid rgba(0, 0, 0, 0.08);
}

.track-title {
    font-size: 20px;
    line-height: 100%;
    font-weight: bold;
    border-bottom: 1px solid #EEEEEE;
    padding: 20px;
}

.track-action {
    padding: 20px;
}

.track-button {
    width: 100%;
    height: 50px;
}

.track-field {
    margin-bottom: 10px;
}

.track-result {
    margin-top: 5px;
    /* display: none; */
}

.track-result.is-visible {
    display: block;
}

.track-result-header {
    font-weight: bold;
    font-size: 14px;
    color: #111111;
    padding: 20px;
    border-bottom: 1px solid #EEEEEE;
}

.track-id {
    margin-bottom: 12px;
    font-size: 20px;
}

.track-routes {
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-weight: normal;
}

.track-route {
    display: flex;
    align-items: center;
    gap: 10px;
}

.track-route-pin {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
}

.track-route-arrow {
    padding: 15px 0;
    width: 24px;
    height: 24px;
}

.track-info {
    padding: 20px;
}

.track-status {
    display: flex;
    align-items: center;
    font-size: 12px;
    gap: 10px;
}

.track-status-title {
    font-size: 14px;
    color: #111111;
    margin-bottom: 20px;
}

.track-status-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.track-status-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(17, 17, 17, 0.08);
    display: grid;
    place-items: center;
    flex: 0 0 auto;
}

.track-status.created .track-status-icon {
    background-color: #F1CB00;
}

.track-status.in-way .track-status-icon {
    background-color: #F08A11;
}

.track-status.ready .track-status-icon {
    background-color: #A35D0A;
}

.track-status.done .track-status-icon {
    background-color: #37C93B;
}

.track-status-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #111111;
    font-size: 12px;
    flex: 1;
}

.track-status-date {
    color: rgba(17, 17, 17, 0.55);
}

@media (max-width: 767px) {
    .container {
        padding: 130px 0 50px 0;
    }

    .track-content {
        width: 100%;
        padding-left: 10px;
        padding-right: 10px;
    }

    .track-result-header {
        padding: 20px;
    }
}
</style>
