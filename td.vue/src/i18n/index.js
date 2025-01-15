import { createI18n } from 'vue-i18n';

// Import your language files
import ara from './ar.js';
import deu from './de.js';
import ell from './el.js';
import eng from './en.js';
import fin from './fi.js';
import fra from './fr.js';
import hin from './hi.js';
import id from './id.js';
import jpn from './ja.js';
import ms from './ms.js';
import por from './pt.js';
import spa from './es.js';
import zho from './zh.js';

let i18n = null;

const get = () => {
    if (!i18n) {
        i18n = createI18n({
            locale: 'eng',
            messages: {
                ara, deu, ell, eng, spa, fin, fra, hin, id, jpn, ms, por, zho
            }
        });
    }
    return i18n;
};

// Export the get function
export default {
    get
};

// Export the tc function
export const tc = (key) => {
    const i18nInstance = get();
    return i18nInstance.global.t(key);
};
