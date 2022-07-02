import Vue from 'vue'
import Vuex from 'vuex'
import L from "leaflet";

const position = {
    lng: 121.504603,
    lat: 24.993955,
    function: "xinbei_distance",
};

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
        STOPPULLUPLOAD(state) {
            state.stopPullUpLoad = [];
        },
        MAP(state) {
            state.map = L.map("map", {
                zoomControl: false,
                zoomSnap: 0.2,
                zoomDelta: 1,
                fullscreenControl: true,
                fullscreenControlOptions: {
                    position: "bottomright",
                },
            }).setView([position.lat, position.lng], 11);
        },
        MARKERS(state) {
            state.markers = L.featureGroup();
        },
        OPENSTREETMAP(state) {
            state.openStreetMap = L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    minZoom: 8,
                    maxZoom: 19,
                }
            ).addTo(state.map);
        },
        STADIAALIDADESMOOTHDARK(state) {
            state.stadiaAlidadeSmoothDark = L.tileLayer.provider(
                "Stadia.AlidadeSmoothDark",
                {
                    minZoom: 8,
                    maxZoom: 19,
                }
            );
        },
        STADIAALIDADESMOOTH(state) {
            state.stadiaAlidadeSmooth = L.tileLayer.provider(
                "Stadia.AlidadeSmooth",
                { minZoom: 8, maxZoom: 19 }
            );
        }
    },
    state: {
        isFirst: true,
        isLoading: false,
        pullDownMessage: "",
        pullUpMessage: "加載中...",
        errorMessage: "",
        hamburger: true,
        keyWord: "",

        stopPullUpLoad: [],

        map: null,
        markers: null,
        openStreetMap: null,
        stadiaAlidadeSmoothDark: null,
        stadiaAlidadeSmooth: null,
    },
    getters: {}
}

export default new Vuex.Store({
    modules: {
        cityAbout: cityOption
    }
})