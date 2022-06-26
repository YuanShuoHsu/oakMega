import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const cityOption = {
    namespaced: true,
    actions: {},
    mutations: {
        FIRSTFALSE(state) {
            state.isFirst = false;
        },
        LOADINGTRUE(state) {
            state.isLoading = true;
        },
        LOADINGFALSE(state) {
            state.isLoading = false;
        },
        REFRESHING(state) {
            state.pullDownMessage = "正在刷新中...";
        },
        NONEREFRESHING(state) {
            state.pullDownMessage = "";
        },
        REFRESHSUCCESSFULLY(state) {
            state.pullDownMessage = "刷新成功";
        },
        FINISHEDLOADING(state) {
            state.pullUpMessage = "全加載完";
        },
        LOADING(state) {
            state.pullUpMessage = "加載中...";
        },
        NONEMESSAGE(state) {
            state.errorMessage = "";
        },
        ERRORMESSAGE(state, value) {
            state.errorMessage = value;
        },
        ANTIHAMBURGER(state, value) {
            state.hamburger = !value;
        },
        NONEKEYWORD(state) {
            state.keyWord = "";
        },
        EDITKEYWORD(state, value) {
            state.keyWord = value;
        },
    },
    state: {
        isFirst: true,
        isLoading: false,
        pullDownMessage: "",
        pullUpMessage: "加載中...",
        errorMessage: "",
        hamburger: true,
        keyWord: "",
    },
    getters: {}
}

// const actions = {
// };

// const mutations = {
//     FIRSTFALSE(state) {
//         state.isFirst = false;
//     },
//     LOADINGTRUE(state) {
//         state.isLoading = true;
//     },
//     LOADINGFALSE(state) {
//         state.isLoading = false;
//     },
//     REFRESHING(state) {
//         state.pullDownMessage = "正在刷新中...";
//     },
//     NONEREFRESHING(state) {
//         state.pullDownMessage = "";
//     },
//     REFRESHSUCCESSFULLY(state) {
//         state.pullDownMessage = "刷新成功";
//     },
//     FINISHEDLOADING(state) {
//         state.pullUpMessage = "全加載完";
//     },
//     LOADING(state) {
//         state.pullUpMessage = "加載中...";
//     },
//     NONEMESSAGE(state) {
//         state.errorMessage = "";
//     },
//     ERRORMESSAGE(state, value) {
//         state.errorMessage = value;
//     },
//     ANTIHAMBURGER(state, value) {
//         state.hamburger = !value;
//     },
//     NONEKEYWORD(state) {
//         state.keyWord = "";
//     },
//     EDITKEYWORD(state, value) {
//         state.keyWord = value;
//     },
// };

// const state = {
//     isFirst: true,
//     isLoading: false,
//     pullDownMessage: "",
//     pullUpMessage: "加載中...",
//     errorMessage: "",
//     hamburger: true,
//     keyWord: "",
// };

// const getters = {
// };

export default new Vuex.Store({
    modules: {
        cityAbout: cityOption
    }
    // actions, mutations, state, getters
})