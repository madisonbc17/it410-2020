
export interface ThemeState {
    path: string
}

/**
 * Store to handle app theme style
 */
const ThemeModule = {
    state: {
        path: null
    },
    getters: {
        getTheme(state: ThemeState) {
            return state.path;
        }
    },
    mutations: {
        /**
         * Change current theme path
         */
        changeTheme(state: ThemeState, value: string) {
            state.path = value;
        }
    },
    actions: {
    }
}

export default ThemeModule