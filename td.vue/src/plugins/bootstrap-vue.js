import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';
import { BootstrapVueNext } from 'bootstrap-vue-next';
import { createApp } from 'vue';

export default {
    install(app) {
        app.use(BootstrapVueNext);
    },
};