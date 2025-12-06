const userLang = navigator.language || navigator.userLanguage;
const shortLang = userLang.split('-')[0];

i18n.init({
  resources,
  lng: resources[shortLang] ? shortLang : "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }
});
