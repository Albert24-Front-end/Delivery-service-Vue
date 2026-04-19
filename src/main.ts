import "@/assets/main.css";
import "@/assets/fonts.css";

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { i18n } from "./i18n/i18n";
import { createPinia } from "pinia";

// const app = createApp(App);

// app.use(router);
// app.use(i18n);
// app.use(createPinia());

// app.mount("#app");

// main.ts
const langMap: Record<string, string> = {
  ru: "ru_RU",
  uz: "uz_UZ",
  en: "en_US",
  de: "de_DE",
};

const savedLang = localStorage.getItem("userLanguage") || "ru";
const ymapsLang = langMap[savedLang] ?? "ru_RU";

const ymapsScript = document.createElement("script");
ymapsScript.src = `https://api-maps.yandex.ru/2.1/?lang=${ymapsLang}&apikey=4e72d839-394a-4c9f-830f-592f62c600e6&suggest_apikey=50e1707b-b630-4f14-8dc6-d0304dbadbff`;
ymapsScript.type = "text/javascript";
document.head.appendChild(ymapsScript);

// Монтируем приложение только после загрузки скрипта
ymapsScript.onload = () => {
  const app = createApp(App);
  app.use(router);
  app.use(i18n);
  app.use(createPinia());
  app.mount("#app");
};
