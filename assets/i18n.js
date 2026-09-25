// Language + interface strings shared by every page.
// A data object's `uk` property overrides its English text on Ukrainian pages (<html lang="uk">).
window.LANG = document.documentElement.lang === "uk" ? "uk" : "en";
window.tr = (obj, key) => (obj[LANG] && obj[LANG][key] != null ? obj[LANG][key] : obj[key]);

window.UI = {
  en: {
    free: "Free", customize: "Customize →", getEtsy: "Get it on Etsy →", soon: "Coming soon", preview: "preview",
    copy: "Copy link", copied: "Link copied! Paste it into OBS.", save: "Save", saved: "Saved to My overlays",
    myOverlays: "My overlays", noneSaved: "Nothing saved yet. Press Save to keep this overlay for later.", del: "Delete",
    editLink: "Edit an existing link", pastePh: "Paste an overlay link from OBS…", open: "Open",
    badLink: "That doesn't look like an Overlay Studio link.", addObs: "Add it to OBS:",
  },
  uk: {
    free: "Безкоштовно", customize: "Налаштувати →", getEtsy: "Купити на Etsy →", soon: "Незабаром", preview: "прев'ю",
    copy: "Копіювати", copied: "Посилання скопійовано! Вставте його в OBS.", save: "Зберегти", saved: "Збережено в «Мої оверлеї»",
    myOverlays: "Мої оверлеї", noneSaved: "Поки нічого не збережено. Натисніть «Зберегти», щоб повернутися до оверлею пізніше.", del: "Видалити",
    editLink: "Редагувати наявне посилання", pastePh: "Вставте посилання на оверлей з OBS…", open: "Відкрити",
    badLink: "Це не схоже на посилання Overlay Studio.", addObs: "Як додати в OBS:",
  },
}[LANG];
