<template>
    <td-selection-page
        :items="folders"
        :page="page"
        :pageNext="pageNext"
        :pagePrev="pagePrev"
        @item-click="onFolderClick"
        @back-click="navigateBack"
        @paginate="paginate"
        :showBackItem="!!parentId"
        isGoogleProvider
        :emptyStateText="$t('folder.noneFound')">
        {{ $t('folder.select') }} {{ $t(`providers.${provider}.displayName`) }} {{ $t('folder.from') }}
        {{ $t('threatmodelSelect.or') }}
        <a href="#" id="new-threat-model" @click="newThreatModel(selected)">{{ $t('threatmodelSelect.newThreatModel') }}</a>
    </td-selection-page>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRoute, useRouter } from 'vue-router';
import { getProviderType } from '@/service/provider/providers.js';
import TdSelectionPage from '@/components/SelectionPage.vue';

export default {
    name: 'DriveAccess',
    components: { TdSelectionPage },
    setup() {
        const store = useStore();
        const route = useRoute();
        const router = useRouter();

        const provider = computed(() => store.state.provider.selected);
        const providerType = computed(() => getProviderType(store.state.provider.selected));
        const folders = computed(() => store.state.folder.all);
        const selected = computed(() => store.state.folder.selected);
        const page = computed(() => store.state.folder.page);
        const pageNext = computed(() => store.state.folder.pageNext);
        const pagePrev = computed(() => store.state.folder.pagePrev);
        const parentId = computed(() => store.state.folder.parentId);

        onMounted(() => {
            if (provider.value !== route.params.provider) {
                store.dispatch('provider/selected', route.params.provider);
            }

            const page = route.query.page || 1;
            store.dispatch('folder/FOLDER_FETCH', { page, folderId: 'root' })
                .catch(error => console.error('Error fetching folders:', error));
        });

        const onFolderClick = async (folder) => {
            if (!folder) {
                console.error('onFolderClick: folder is undefined');
                return;
            }
            // FOLDER_SELECTED is a mutation, so commit it.
            store.commit('folder/FOLDER_SELECTED', folder.id);
        };

        const paginate = (page) => {
            store.dispatch('folder/FOLDER_FETCH', { page });
        };

        const navigateBack = () => {
            store.dispatch('folder/FOLDER_NAVIGATE_BACK');
        };

        const newThreatModel = (folderId) => {
            if (!folderId) {
                console.error('newThreatModel: folderId is undefined');
                return;
            }
            const params = { ...route.params, folder: folderId };
            // Compute route name based on providerType and action query parameter.
            const routeName = `${providerType.value}${route.query.action === 'create' ? 'NewThreatModel' : 'ThreatModelSelect'}`;
            
            // Check if the route exists.
            const routes = router.getRoutes();
            if (!routes.some(r => r.name === routeName)) {
                console.error(`Route not found: ${routeName}`);
                return;
            }
            router.push({ name: routeName, params });
        };

        return {
            provider,
            providerType,
            folders,
            selected,
            page,
            pageNext,
            pagePrev,
            parentId,
            onFolderClick,
            paginate,
            navigateBack,
            newThreatModel
        };
    }
};
</script>
