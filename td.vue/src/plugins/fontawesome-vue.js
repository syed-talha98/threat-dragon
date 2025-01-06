import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// Import specific icons
import {
    faSignOutAlt,
    faQuestionCircle,
    faGift,
    faPlus,
    faCloudDownloadAlt,
    faEdit,
    faFileAlt,
    faTimes,
    faUndo,
    faRedo,
    faSave,
    faSearchPlus,
    faSearchMinus,
    faTrash,
    faTh,
    faKeyboard,
    faFileImport,
    faChevronDown,
    faChevronRight,
    faCheck,
    faExclamationTriangle,
    faCircle,
    faFilePdf,
    faFolderOpen,
    faPrint,
    faProjectDiagram,
    faDiagramProject,
} from '@fortawesome/free-solid-svg-icons';

import { faBitbucket, faGithub, faGitlab, faVuejs, faGoogle, faGoogleDrive } from '@fortawesome/free-brands-svg-icons';

// Add icons to the library
library.add(
    faSignOutAlt,
    faQuestionCircle,
    faGift,
    faGithub,
    faGitlab,
    faBitbucket,
    faVuejs,
    faPlus,
    faCloudDownloadAlt,
    faEdit,
    faFileAlt,
    faTimes,
    faUndo,
    faRedo,
    faSave,
    faSearchPlus,
    faSearchMinus,
    faTrash,
    faTh,
    faKeyboard,
    faFileImport,
    faChevronDown,
    faChevronRight,
    faCheck,
    faExclamationTriangle,
    faCircle,
    faFilePdf,
    faFolderOpen,
    faPrint,
    faProjectDiagram,
    faDiagramProject,
    faGoogle,
    faGoogleDrive
);

export default {
    install(app) {
        // Register the FontAwesomeIcon component globally
        app.component('font-awesome-icon', FontAwesomeIcon);
    },
};