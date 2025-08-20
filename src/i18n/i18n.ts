const dict = {
  fr: {
    dashboard: 'Tableau de bord',
  },
  en: {
    dashboard: 'Dashboard',
  },
}

export type Lang = keyof typeof dict
let lang: Lang = (localStorage.getItem('lang') as Lang) || 'fr'

export function setLang(l: Lang) {
  lang = l
  localStorage.setItem('lang', l)
}

export function t(key: keyof typeof dict['fr']) {
  return dict[lang][key] || key
}



