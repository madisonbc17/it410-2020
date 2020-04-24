/*!
 *
 * Angle - Bootstrap Admin Template
 *
 * Version: 4.7.1
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueI18Next from '@panter/vue-i18next';

import './vendor.js'

import App from './App.vue'
import router from './router'
import i18next from './i18n.js';
import store from './store'

Vue.config.productionTip = false

Vue.use(BootstrapVue);
Vue.use(VueI18Next);

const i18n = new VueI18Next(i18next);

new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
}).$mount('#app')
