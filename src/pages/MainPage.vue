<template>
  <main class="relative flex pt-27.75 px-10 pb-10">
    <section class="main-info relative max-w-210 w-full">
      <h1 class="main-title relative -left-3.75 mt-24.5 text-[#111111] font-medium text-[150px] leading-none tracking-tighter">
        <span class="text-[#ffcc00]">D</span>elivery
      </h1>

      <div class="main-features mt-3.75 flex gap-2.5 flex-wrap">
        <MainLabel v-for="l in labels" :key="l.id" :text="l.text" class="main-feature"/>
      </div>

      <h2 class="main-description mt-12.5 max-w-125 text-xl text-black leading-[1.1]">{{ t("main_title") }}</h2>

      <div class="main-actions mt-12.5 flex flex-col gap-5">
        <LinkButton class="button h-20 w-[433px] grid place-items-center text-lg font-bold" v-for="b in buttons" :key="b.id" :class="b.styles" :link="b.link" :text="b.text"></LinkButton>
      </div>
    </section>

    <div class="main-title-ghost absolute -left-17.5 -bottom-22.5 -z-10 text-[#ECEDF04D] font-medium text-[278px] leading-none tracking-tighter">Delivery</div>

    <section class="main-image min-w-[788px] -z-20">
      <img src="/src/assets/images/main-image.png" alt="main-image" class="w-[98%] h-auto block max-w-5xl">
    </section>
  </main>
</template>

<script setup lang="ts">
import MainLabel from '@/components/UI/MainLabel.vue';
import LinkButton from '@/components/UI/LinkButton.vue';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

const { t } = useI18n();

const labels = computed(() => {
  return [
    {
      id: 1,
      text: t("labels.tracking"),
    },
    {
      id: 2,
      text: t("labels.routes"),
    },
    {
      id: 3,
      text: t("labels.insurance"),
    },
    {
      id: 4,
      text: t("labels.delivery"),
    },
    {
      id: 5,
      text: t("labels.tariffs"),
    },
  ];
})

const buttons = computed(() => {
  return [
    {
      id: 1,
      text: t("buttons.order"),
      link: "/order",
      styles: ""
    },
    {
      id: 2,
      text: t("buttons.track"),
      link: "/track",
      styles: "button-white"
    }
  ];
})
</script>

<style scoped>
@media (max-width: 1760px) {
    .main-title {
        font-size: 150px;
        left: -7px;
    }

    .main-info {
        max-width: 640px;
    }
}

@media (max-width: 1200px) {
    .main-info {
        max-width: 540px;
    }

    .main {
        padding: 111px 20px 20px;
    }

    .main-title {
        font-size: 120px;
        left: -4px;
    }

    .main-title-ghost {
        font-size: 220px;
    }
}

@media (max-width: 1024px) {
    .main-title {
        margin-top: 30px;
    }

    .main {
        flex-direction: column;
    }

    .main-features {
      max-width: 433px;
    }

    .main-image {
        max-width: 350px;
        position: absolute;
        left: 370px;
        top: 0;
    }

    .main-info {
        max-width: 100%;
    }

    .main-actions {
        gap: 10px;
    }

    .main-actions .button {
        height: 50px;
        font-size: 14px;
        width: auto;
        max-width: 300px;
    }

    .main-description {
        max-width: 350px;
    }
    .main-title-ghost {
      font-size: 158px;
    }
}

@media (max-width: 570px) {
    .main-title {
        font-size: 88px;
    }

    .main-description {
        max-width: 100%
    }

    .main-actions {
       width: 100%;
    }

    .main-description {
        max-width: 350px;
    }

    /* .main-actions .button {
        width: 100%;
        max-width: 100%
    } */

    .main-image {
        max-width: 650px;
        position: absolute;
        left: 170px;
        top: 70px;
        opacity: 0.2;
    }

    .main-title-ghost {
      font-size: 139px;
    }
}

@media (max-width: 400px) {
    .main-title {
        font-size: 70px;
    }
}
</style>
