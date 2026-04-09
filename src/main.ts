import '@/assets/main.css'
import '@/assets/fonts.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n/i18n'
import { createYmaps } from 'vue-yandex-maps'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(router)
app.use(i18n)
app.use(createPinia())
app.use(
  createYmaps({
    apikey: '4e72d839-394a-4c9f-830f-592f62c600e6',
  }),
)

app.mount('#app')
