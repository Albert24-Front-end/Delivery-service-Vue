<template>
  <div class="relative inline-block font-[sans-serif]" ref="dropdownRef">
    <button @click="toggleDropdown()" class="cursor-pointer flex items-center g-2 min-w-[120px] bg-white px-3 py-2 text-sm border border-solid border-[#ddd] rounded-lg transition-all duration-200 hover:border-[#bbb] hover:bg-[#f9f9f9]">
      <img :src=languages.src alt="flag" class="w-5 h-3 object-cover rounded-xs">
      {{ getActiveLang }}
      <span v-if="isOpen" class="">▼</span>
    </button>
    <div>
      <div v-for="lang in languages">
        <img :src="lang.src" class="flag-icon" alt="flag" @click="switchLanguage(lang.code)">
        {{ lang.label }}
      </div>
      <div v-if="!languages">Список языков пуст</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const isOpen = ref(false);
const currentLang = ref('ru')
const dropdownRef = ref<HTMLElement | null>(null);

const languages = [
    {
      code: 'ru',
      label: 'Русский',
      // flag: 'https://flagcdn.com/w40/ru.png'
      src: '/src/assets/images/flags/TwemojiFlagRussia.svg',
    },
    {
      code: 'uz',
      label: "O'zbekcha",
      // flag: 'https://flagcdn.com/w40/uz.png'
      src: '/src/assets/images/flags/TwemojiFlagUzbekistan.svg',
    },
    {
      code: 'en',
      label: 'English',
      // flag: 'https://flagcdn.com/w40/gb.png'
      src: '/src/assets/images/flags/TwemojiFlagUnitedStates.svg',
    },
    {
      code: 'de',
      label: 'Deutsch',
      // flag: 'https://flagcdn.com/w40/de.png'
      src: '/src/assets/images/flags/TwemojiFlagGermany.svg',
    },
  ];

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
}

const getLanguagePattern = () => {
    return languages.map(l => l.code).join('|');
  }

const getActiveLang = computed(() => {
  return languages.find(l => l.code === currentLang.value) || languages[0]?.code
})

const switchLanguage = (lang: string) => {
  if (currentLang.value === lang) {
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

// Получаем текущий язык приложения (ru или en)
  constructor(
    @Inject(LOCALE_ID) public currentLocale: string,
    private eRef: ElementRef,
  ) {
    this.currentLocale = this.currentLocale.substring(0, 2);
  }

  // Закрытие при клике вне компонента
  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  private getLanguagePattern(): string {
    return this.languages.map(l => l.code).join('|');
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  getActiveLang() {
    return this.languages.find((l) => l.code === this.currentLocale) || this.languages[0];
  }

  switchLanguage(langCode: string) {
    if (this.currentLocale === langCode) return;

    localStorage.setItem('userLanguage', langCode);

    const currentUrl = window.location.href;
    // Динамическая регулярка
    const pattern = new RegExp(`\/(${this.getLanguagePattern()})(\/|$)`);
    const newUrl = currentUrl.replace(pattern, `/${langCode}/`);

    window.location.href = newUrl;
  }

<div class="lang-dropdown">
    <button class="dropbtn" (click)="toggleDropdown()">
        <img [src]="getActiveLang().flag" class="flag-icon" alt="flag">
        {{ getActiveLang().label }}
        <span class="arrow" [class.open]="isOpen">▼</span>
    </button>

    @if (isOpen) {
        <div class="dropdown-content">
            @for (lang of languages; track lang.code) {
                <div class="lang-item" [class.active]="lang.code === currentLocale" (click)="switchLanguage(lang.code)">
                    <img [src]="lang.flag" class="flag-icon" alt="flag">
                    {{ lang.label }}
                </div>
            } @empty {
                <div class="lang-item" i18n>Список языков пуст</div>
            }
        </div>
    }
</div>