<template>
  <div class="relative inline-block font-[sans-serif]" ref="dropdownRef">
    <button @click="toggleDropdown()" class="cursor-pointer flex items-center gap-2 min-w-30 bg-white px-3 py-2 text-sm border border-solid border-[#ddd] rounded-lg transition-all duration-200 hover:border-[#bbb] hover:bg-[#f9f9f9]">
      <img :src=getActiveLang?.src alt="flag" class="flag-icon">
      {{ getActiveLang?.label }}
      <span v-if="isOpen" class="text-[10px] text-[#888] ml-auto transition-transform duration-200 " :class="{ 'rotate-180': isOpen }">▼</span>
    </button>
    <div v-if="isOpen" class="absolute bg-white min-w-full z-1000 rounded-lg mt-1 overflow-hidden border border-solid border-[#eee] shadow-drop" :class="{ 'block': isOpen }">
      <div v-for="lang in languages" :key="lang.code" @click="switchLanguage(lang.code)" class="cursor-pointer flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-[#f1f1f1] duration-200 active:bg-[#eef5ff] active:text-[#007bff] active:font-medium">
        <img :src="lang.src" class="flag-icon" alt="flag">
        {{ lang.label }}
      </div>
      <div v-if="!languages.length">{{ t('header.no_lang') }}</div>
    </div>
  </div>
</template>

<style scoped>
.flag-icon {
    width: 20px;
    height: 15px;
    object-fit: cover;
    border-radius: 2px;
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const languages = [
    {
      code: "ru",
      label: "Русский",
      // flag: "https://flagcdn.com/w40/ru.png"
      src: "/src/assets/images/flags/TwemojiFlagRussia.svg",
    },
    {
      code: "uz",
      label: "O'zbekcha",
      // flag: "https://flagcdn.com/w40/uz.png"
      src: "/src/assets/images/flags/TwemojiFlagUzbekistan.svg",
    },
    {
      code: "en",
      label: "English",
      // flag: "https://flagcdn.com/w40/gb.png"
      src: "/src/assets/images/flags/TwemojiFlagUnitedStates.svg",
    },
    {
      code: "de",
      label: "Deutsch",
      // flag: "https://flagcdn.com/w40/de.png"
      src: "/src/assets/images/flags/TwemojiFlagGermany.svg",
    },
  ];
onMounted(() => {
  const pathLang = window.location.pathname.split("/");
  const foundLang = languages.find(l => pathLang.includes(l.code));
  if (foundLang) {
    locale.value = foundLang.code;
  }

  window.addEventListener('click', handleOutsideClick);
})

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
}

const handleOutsideClick = (event: MouseEvent) => {
  if(dropdownRef.value && !dropdownRef.value.contains(event.target as Node)){
    isOpen.value = false;
  }
}

const getLanguagePattern = () => {
    return languages.map(l => l.code).join('|');
  }

const getActiveLang = computed(() => {
  return languages.find(l => l.code === locale.value) || languages[0]
})

const switchLanguage = (lang: string) => {
  if (locale.value === lang) {
    isOpen.value = false;
    return;
  }

    localStorage.setItem('userLanguage', lang as string);

    const currentUrl = window.location.href;
    // Динамическая регулярка
    const pattern = new RegExp(`\/(${getLanguagePattern()})(\/|$)`);
    const newUrl = currentUrl.replace(pattern, `/${lang}/`);

    return window.location.href = newUrl;
}
</script>