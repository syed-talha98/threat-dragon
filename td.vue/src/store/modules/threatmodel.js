import Vue from 'vue';

import demo from '@/service/demo/index.js';
import { getProviderType } from '../../service/provider/providers.js';
import { providerTypes } from '../../service/provider/providerTypes.js';
import {
    THREATMODEL_CLEAR,
    THREATMODEL_DIAGRAM_SELECTED,
    THREATMODEL_FETCH,
    THREATMODEL_FETCH_ALL,
    THREATMODEL_SELECTED
} from '../actions/threatmodel.js';
import threatmodelApi from '../../service/threatmodelApi.js';

export const clearState = (state) => {
    state.all.length = 0;
    state.selected = '';
    state.data = {};
    state.selectedDiagram = {};
};

const state = {
    all: [],
    data: {},
    selected: '',
    selectedDiagram: {}
};

const actions = {
    [THREATMODEL_CLEAR]: ({ commit }) => commit(THREATMODEL_CLEAR),
    [THREATMODEL_DIAGRAM_SELECTED]: ({ commit }, diagram) => commit(THREATMODEL_DIAGRAM_SELECTED, diagram),
    [THREATMODEL_FETCH]: async ({ commit, dispatch, rootState }, threatModel) => {
        dispatch(THREATMODEL_CLEAR);
        if (getProviderType(rootState.provider.selected) !== providerTypes.local) {
            const resp = await threatmodelApi.modelAsync(
                rootState.repo.selected,
                rootState.branch.selected,
                threatModel
            );
            commit(THREATMODEL_FETCH, resp.data);
        } else {
            commit(THREATMODEL_FETCH, threatModel);
        }
    },
    [THREATMODEL_FETCH_ALL]: async ({ commit, rootState }) => {
        if (getProviderType(rootState.provider.selected) !== providerTypes.local) {
            const resp = await threatmodelApi.modelsAsync(
                rootState.repo.selected,
                rootState.branch.selected
            );
            commit(THREATMODEL_FETCH_ALL, resp.data);
        } else {
            commit(THREATMODEL_FETCH_ALL, demo.models);
        }
    },
    [THREATMODEL_SELECTED]: ({ commit, dispatch, rootState }, threatModel) => {
        if (getProviderType(rootState.provider.selected) !== providerTypes.local) {
            commit(THREATMODEL_SELECTED, threatModel);
            dispatch(THREATMODEL_FETCH, threatModel);
        } else {
            commit(THREATMODEL_FETCH, threatModel);
        }
    }
};

const mutations = {
    [THREATMODEL_CLEAR]: (state) => clearState(state),
    [THREATMODEL_DIAGRAM_SELECTED]: (state, diagram) => {
        state.selectedDiagram = diagram;
    },
    [THREATMODEL_FETCH]: (state, model) => {
        state.data = model;
    },
    [THREATMODEL_FETCH_ALL]: (state, models) => {
        state.all.length = 0;
        models.forEach((model, idx) => Vue.set(state.all, idx, model));
    },
    [THREATMODEL_SELECTED]: (state, threatModel) => {
        state.selected = threatModel;
    }
};

const getters = {};

export default {
    state,
    actions,
    mutations,
    getters
};
