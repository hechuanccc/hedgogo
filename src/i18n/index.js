import Vue from 'vue'
import VueI18n from 'vue-i18n'
import cn from './cn'
import en from './en'

Vue.use(VueI18n)

let navLang = navigator.language || navigator.userLanguage
if (navLang === 'zh-CN' || navLang === 'zh-cn') {
    Vue.config.lang = 'cn'
} else if (navLang === 'en-US' || navLang === 'en-us') {
    Vue.config.lang = 'en'
} else {
    Vue.config.lang = 'cn'
}

export default new VueI18n({
    locale: Vue.config.lang,
    fallbackLocale: 'en',
    messages: {
        cn,
        en
    }
})
