<template>
  <nav
    class="container w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-2"
  >
    <div>
      <router-link to="/" aria-current="page" class="flex items-center">
        <div class="header-logo">D</div>
        <div class="header-title">Delivery</div>
      </router-link>
    </div>

      <div class="desktop-menu hidden md:flex">
        <ul class="w-full flex justify-between items-center gap-3 md:gap-5 lg:gap-7 text-base lg:text-lg">
          <li v-for="l in links" :key="l.name" class="py-1 px-2 hover:cursor-pointer hover:bg-sky-100 rounded-lg text-nowrap">
            <router-link class="header-link" :to="l.path">
              {{ l.text() }}
            </router-link>
          </li>
          <li class="hover:cursor-pointer hover:bg-sky-100 rounded-lg"><LanguageSwitcher/></li>
        </ul>
      </div>

      <div class="burger-menu-button md:hidden mt-2">
        <button @click="toggleMenu" aria-label="Open menu">
          <span
            ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="oklch(72.3% 0.219 149.579)" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
              </svg></span>
        </button>
      </div>

      <div v-if="isMenuOpen" class="mobile-menu flex-column md-hidden absolute top-3 right-3 px-3 py-3 bg-slate-50 z-10">
        <button class="flex justify-self-end" @click="closeMenu" aria-label="Close menu">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="oklch(72.3% 0.219 149.579)"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
              />
            </svg>
          </span>
        </button>

        <ul class="w-full flex-column justify-between items-center gap-3 md:gap-5 lg:gap-7 pt-6 text-base lg:text-lg">
          <li v-for="l in links" :key="l.name" class="py-4 px-2 hover:cursor-pointer hover:bg-sky-100 rounded-lg font-xl">
            <router-link v-if="!route.fullPath.endsWith('/')" class="header-link" :to="l.path"
              >{{ l.text() }}</router-link
            >
          </li>
          <li class="hover:cursor-pointer hover:bg-sky-100 rounded-lg py-4 px-2"><LanguageSwitcher/></li>
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
