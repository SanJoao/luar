async function setLanguage(lang) {
  const response = await fetch(`/translations/${lang}.json`);
  const translations = await response.json();

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (translations[key]) {
      element.innerHTML = translations[key];
    }
  });

  // Update iframe content
  const iframes = document.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    if (doc) {
      doc.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");
        if (translations[key]) {
          element.innerHTML = translations[key];
        }
      });
    }
  });
}

function getInitialLanguage() {
  const savedLang = localStorage.getItem("language");
  if (savedLang) {
    return savedLang;
  }
  const browserLang = navigator.language.split("-")[0];
  if (["en", "es", "pt"].includes(browserLang)) {
    return browserLang;
  }
  return "en"; // Default language
}

document.addEventListener("DOMContentLoaded", () => {
  const languageSelect = document.getElementById("language-select");
  const initialLang = getInitialLanguage();

  if (languageSelect) {
    languageSelect.value = initialLang;
    setLanguage(initialLang);

    languageSelect.addEventListener("change", (event) => {
      const selectedLang = event.target.value;
      localStorage.setItem("language", selectedLang);
      setLanguage(selectedLang);
    });
  }
});
