import { MutationPayload, Store } from 'vuex';
import { ApplicationState } from '../index';
import { ThemeState } from '../modules/theme';

const LINK_ID = 'theme-stylesheet';

const createLink = () => {
    let link = document.getElementById(LINK_ID) as HTMLLinkElement;
    if(!link) {
        const head  = document.getElementsByTagName('head')[0];
        link  = document.createElement('link') as HTMLLinkElement;
        link.id  = LINK_ID;
        link.rel = 'stylesheet';
        head.appendChild(link);
    }
    return link;
}

const injectStylesheet = (stylesheet: string) => {
    const linkTag = createLink();
    if(stylesheet)
        linkTag.href = stylesheet;
}

const updateTheme = (state: ApplicationState) => {
    injectStylesheet(state.theme.path)
}

/*
    Hook into theme change to set a inject a selected theme
*/
const ThemePlugin = (store: Store<ApplicationState>) => {
    // wait for dom ready
    document.addEventListener('DOMContentLoaded', () => updateTheme(store.state));

    store.subscribe((mutation: MutationPayload, state: ApplicationState) => {
        if (mutation.type === 'changeTheme') {
            updateTheme(state)
        }
    })
}

export default ThemePlugin;