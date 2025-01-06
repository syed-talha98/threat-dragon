import { createApp } from 'vue'; // Vue 3 syntax
import App from './App.vue';
import i18nFactory from './i18n/index.js';
import router from './router/index.js';
import store from './store/index.js'; // Assuming this is compatible with Vue 3

import './plugins/bootstrap-vue.js'; // Updated for bootstrap-vue-next
import './plugins/fontawesome-vue.js';
import './plugins/toastification.js';

const app = createApp(App);

// Attach plugins and dependencies
app.use(router);
app.use(store);
app.use(i18nFactory.get());

// Mount the app
app.mount('#app');