import Vue from 'vue'
import Vuex from 'vuex'
import L from "leaflet";
import BetterScroll from "better-scroll";

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
        BSCROLL(state) {
            state.bscroll = new BetterScroll(".betterList", {
                startX: 0,
                startY: 0,
                scrollX: false,
                scrollY: true,
                freeScroll: false,
                directionLockThreshold: 5,
                eventPassthrough: "",
                click: true,
                dblclick: {
                    delay: 300,
                },
                tap: "",
                bounce: {
                    top: true,
                    bottom: true,
                    left: true,
                    right: true,
                },
                bounceTime: 800,
                momentum: true,
                momentumLimitTime: 300,
                momentumLimitDistance: 15,
                swipeTime: 2500,
                swipeBounceTime: 500,
                deceleration: 0.0015,
                flickLimitTime: 200,
                flickLimitDistance: 100,
                resizePolling: 60,
                probeType: 1,
                preventDefault: true,
                preventDefaultException: {
                    tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|AUDIO)$/,
                },
                tagException: { tagName: /^TEXTAREA$/ },
                HWCompositing: true,
                useTransition: true,
                bindToWrapper: false,
                disableMouse: false,
                disableTouch: false,
                autoBlur: true,
                stopPropagation: false,
                bindToTarget: false,
                autoEndDistance: 5,
                outOfBoundaryDampingFactor: 1 / 3,
                specifiedIndexAsContent: 0,
                quadrant: 1,
                mouseWheel: true,
                pullDownRefresh: {
                    threshold: 20,
                    stop: 0,
                },
                pullUpLoad: {
                    threshold: 20,
                },
                scrollbar: {
                    fade: true,
                    interactive: false,
                    scrollbarTrackClickable: true,
                },
            });
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
        },
        CIRCLES(state) {
            state.circles = L.featureGroup();
        },
        MARKERCLUSTERGROUP(state) {
            state.markerClusterGroup = L.markerClusterGroup();
        }

        // GEOJSON(state) {
        //     state.geoJSON = L.geoJSON(this.states, {
        //         style() {
        //             return { color: "#2d044d" };
        //         },
        //         onEachFeature(feature, layer) {
        //             layer.bindPopup(
        //                 `<h2>${feature.properties["分區"]
        //                 }</h2><p>容積<strong>（${feature.properties.SHAPE_Area.toFixed(
        //                     6
        //                 ).toString()}）</strong></p>`
        //             );
        //             layer.bindTooltip(feature.properties.TxtMemo, {
        //                 direction: "center",
        //                 permanent: false,
        //                 sticky: true,
        //                 offset: [12, -12],
        //                 opacity: 0.8,
        //             });
        //         },
        //     });
        // }
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

        bscroll: null,
        map: null,
        markers: null,
        openStreetMap: null,
        stadiaAlidadeSmoothDark: null,
        stadiaAlidadeSmooth: null,
        // geoJSON: null,
        markerClusterGroup: null,
        circles: null,

    },
    getters: {}
}

export default new Vuex.Store({
    modules: {
        cityAbout: cityOption
    }
})