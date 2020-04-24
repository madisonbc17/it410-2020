import Vue from 'vue';
import Vuex, { StoreOptions } from 'vuex';
import createPersistedState from 'vuex-persistedstate';

import SettingModule, { SettingState } from './modules/setting';
import SettingPlugin from './plugins/setting';
import ThemeModule, { ThemeState } from './modules/theme';
import ThemePlugin from './plugins/theme';

Vue.use(Vuex);

export interface ApplicationState {
    setting: SettingState;
    theme: ThemeState;
}

const store: StoreOptions<ApplicationState> = {
    modules: {
        setting: SettingModule,
        theme: ThemeModule
    },
    plugins: [
        createPersistedState({
            reducer: persistedState => {
                const stateFilter = JSON.parse(JSON.stringify(persistedState)); // deep clone
                ['offsidebarOpen', 'asideToggled', 'horizontal'] // states which we don't want to persist.
                    .forEach(item => delete stateFilter.setting[item]);
                return stateFilter;
            }
        }),
        SettingPlugin,
        ThemePlugin
    ]
};

export default new Vuex.Store<ApplicationState>(store);
