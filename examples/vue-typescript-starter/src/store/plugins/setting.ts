import { MutationPayload, Store } from 'vuex';
import { ApplicationState } from '../index';
import { SettingState } from '../modules/setting';

// Helpers to change class attribute
const updateElementClass = (el: HTMLElement|null, stat: boolean, name: string) => el && el.classList[stat ? 'add' : 'remove'](name)
const updateBodyClass = (stat: boolean, name: string) => updateElementClass(document.body, stat, name)

/*
    When a setting value is changed, detect its value and add/remove
    a classname related with that setting from the target element
*/
const updateClasses = (state: ApplicationState) => {
    updateBodyClass(state.setting.isFixed, 'layout-fixed')
    updateBodyClass(state.setting.isBoxed, 'layout-boxed')
    updateBodyClass(state.setting.isCollapsed, 'aside-collapsed')
    updateBodyClass(state.setting.isCollapsedText, 'aside-collapsed-text')
    updateBodyClass(state.setting.isFloat, 'aside-float')
    updateBodyClass(state.setting.asideHover, 'aside-hover')
    updateBodyClass(state.setting.offsidebarOpen, 'offsidebar-open')
    updateBodyClass(state.setting.asideToggled, 'aside-toggled')
    // layout horizontal
    updateBodyClass(state.setting.horizontal, 'layout-h')
    // apply change to the sidebar element
    updateElementClass(document.querySelector('.sidebar'), state.setting.asideScrollbar, 'show-scrollbar')
}

/*
    Hook into setting changes in order to change layout.
*/
const SettingPlugin = (store: Store<ApplicationState>) => {
    // wait for dom ready
    document.addEventListener('DOMContentLoaded', () => updateClasses(store.state));

    store.subscribe((mutation: MutationPayload, state: ApplicationState) => {
        if (mutation.type === 'changeSetting' || mutation.type === 'toggleSetting') {
            updateClasses(state)
        }
    })
}

export default SettingPlugin;