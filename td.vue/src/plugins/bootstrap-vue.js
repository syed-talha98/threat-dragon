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
    BNavText,
    BTooltip,
    BDropdownItem,
    BDropdown,
    BCol,
    BRow,
    BButton,
    BButtonGroup
} from "bootstrap-vue-next";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";

export default {
    install(app) {
        // Register BootstrapVueNext components globally
        app.component("BOverlay", BOverlay);
        app.component("BContainer", BContainer);
        app.component("BNavbarBrand", BNavbarBrand);
        app.component("BNavbarToggle", BNavbarToggle);
        app.component("BImg", BImg);
        app.component("BNavbarNav", BNavbarNav);
        app.component("BCollapse", BCollapse);
        app.component("BNavItem", BNavItem);
        app.component("BNavbar", BNavbar);
        app.component("BNavText", BNavText);
        app.component("BTooltip", BTooltip);
        app.component("BDropdownItem", BDropdownItem);
        app.component("BDropdown", BDropdown);
        app.component("BCol", BCol);
        app.component("BRow", BRow);
        app.component("BButton", BButton);
        app.component("BButtonGroup", BButtonGroup);
    },
};
