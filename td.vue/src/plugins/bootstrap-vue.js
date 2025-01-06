import {
    BOverlay,
    BContainer,
    BNavbarToggle,
    BImg,
    BNavbarBrand,
    BCollapse,
    BNavbarNav,
    BNavItem,
    BNavbar,
} from 'bootstrap-vue-next';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

export default {
    install(app) {
        // Register BootstrapVueNext components globally
        app.component('BOverlay', BOverlay);
        app.component('BContainer', BContainer);
        app.component('BNavbarBrand', BNavbarBrand);
        app.component('BNavbarToggle', BNavbarToggle);
        app.component('BImg', BImg);
        app.component('BNavbarNav', BNavbarNav);
        app.component('BCollapse', BCollapse);
        app.component('BNavItem', BNavItem);
        app.component('BNavbar', BNavbar);
    },
};