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
    apikey: 'f09838e5-4675-40eb-8870-1321cf9531f0',
    servicesApikeys: {
      router: '7d15e9f8-f47a-4c10-9858-0ca90597bca0',
    },
  }),
)

app.mount('#app')
