<template>
  <header
    class="container w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 btrack-b border-gray-200 flex justify-between items-center gap-2"
  >
    <div class="flex items-center">
      <router-link to="/" aria-current="page">
        <div class="header-logo">D</div>
        <div class="header-title">Delivery</div>
      </router-link>
    </div>

    <nav>
      <div>
        <ul>
          <li>
            <router-link v-if="!route.fullPath.endsWith('/')" class="header-link" to="/"
              >Главная</router-link
            >
          </li>
          <li>
            <router-link v-if="!route.fullPath.includes('order')" class="header-link" to="/order"
              >Оформить доставку</router-link
            >
          </li>
          <li>
            <router-link v-if="!route.fullPath.includes('track')" class="header-link" to="/track"
              >Отследить посылку</router-link
            >
          </li>
          <li><LanguageSwitcher /></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onBeforeMount, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './LanguageSwitcher.vue'

const route = useRoute()
const router = useRouter()

const { t } = useI18n()

const links = ref([
  { name: 'Vacancies', href: '/vacancies', text: () => t('buttons.vacancies') },
  { name: 'Contacts', href: '#contacts', text: () => t('buttons.contacts') },
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
