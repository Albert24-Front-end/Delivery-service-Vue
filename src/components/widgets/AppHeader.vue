<template>
  <nav
    class="fixed z-6 left-5 right-5 top-5 mx-auto h-17.5 px-4.5 py-3.5 flex justify-between items-center border border-black/10 bg-white rounded-[18px] shadow-header backdrop-blur-[10px]"
  >
      <router-link to="/" aria-current="page" class="flex items-center gap-2.5 decoration-none">
        <div class="grid place-items-center w-10.5 h-10.5 rounded-[10px] bg-[#FFCC00] font-bold text-[#111]">D</div>
        <div class="text-lg font-bold text-[#111111] decoration-none">Delivery</div>
      </router-link>

      <div class="desktop-menu hidden md:flex text-sm lg:text-base">
        <ul class="w-full pl-10 md:pl-25 lg:pl-40 xl:pl-50 flex justify-between items-center gap-2.5 md:gap-5 lg:gap-5.5">
          <li v-for="l in links" :key="l.name" class="py-1 px-2 hover:cursor-pointer hover:duration-500 hover:bg-[#FFCC00] rounded-lg text-wrap text-center">
            <router-link class="header-link" :to="l.path">
              {{ l.text() }}
            </router-link>
          </li>
          <li class="py-1 px-2 hover:cursor-pointer rounded-lg"><LanguageSwitcher/></li>
        </ul>
      </div>

      <div class="burger-menu-button md:hidden mt-2 text-sm lg:text-base">
       <button @click="toggleMenu" aria-label="Open menu" class="transition-transform duration-300" :class="isMenuOpen ? 'rotate-90' : 'rotate-0'">
          <span
            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#FFCC00" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              </svg></span>
        </button>
      </div>

      <div v-if="isMenuOpen" class="mobile-menu absolute top-3 right-3 px-3 py-3 flex-column md-hidden bg-slate-50 z-10 transition-all duration-300 animate-[fadeIn_0.3s_ease] rounded-[18px] text-sm lg:text-base">
        <button class="flex justify-self-end transition-transform duration-300 hover:rotate-90" @click="closeMenu" aria-label="Close menu">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#FFCC00"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
              />
            </svg>
          </span>
        </button>

        <ul class="w-full flex-column justify-between items-center gap-3 md:gap-5 lg:gap-7 pt-6">
          <li v-for="l in links" :key="l.name" class="py-4 px-2 hover:cursor-pointer hover:duration-500 hover:bg-[#FFCC00] rounded-lg text-wrap">
            <router-link class="header-link" :to="l.path"
              >{{ l.text() }}</router-link
            >
          </li>
          <li class="hover:cursor-pointer rounded-lg py-4 px-2"><LanguageSwitcher/></li>
        </ul>
      </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount, ref } from 'vue'
import { RouterLink, useRoute} from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const route = useRoute()
const { t } = useI18n()

const links = ref([
  { name: 'Main', path: '/', text: () => t('header.main') },
  { name: 'Order', path: '/order', text: () => t('header.order') },
  { name: 'Track', path: '/track', text: () => t('header.track') },
])

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleWidth = () => {
  if (window.innerWidth >= 768) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWidth)
})
onBeforeMount(() => {
  window.removeEventListener('resize', handleWidth)
})
</script>

<style scoped></style>
