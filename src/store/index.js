import Vue from 'vue'
import Vuex from 'vuex'

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";

import axios from "axios";
import BetterScroll from "better-scroll";
import router from './../router/index.js'

// const url = "https://asia-east2-botfat.cloudfunctions.net/project_controller";
const position = {
    lng: 121.504603,
    lat: 24.993955,
    function: "xinbei_distance",
};
// const polygon = {
//     directory: "tucheng.json",
//     function: "xinbei_json",
// };

Vue.use(Vuex);

const cityOption = {
    namespaced: true,
    actions: {
        parseJwt() {
            let token = localStorage.getItem("token");
            let base64Url = token.split(".")[1];
            let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            let jsonPayload = decodeURIComponent(
                window
                    .atob(base64)
                    .split("")
                    .map(function (c) {
                        return (
                            "%" +
                            ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                        );
                    })
                    .join("")
            );
            return JSON.parse(jsonPayload);
        },
        async initLeaflet(context, value) {
            if (context.state.isFirst === true) {
                delete L.Icon.Default.prototype._getIconUrl;

                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
                    iconUrl: require("leaflet/dist/images/marker-icon.png"),
                    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
                });

                context.commit("MAP", value);
                context.commit("OPENSTREETMAP");

                L.control
                    .zoom({
                        position: "bottomright",
                    })
                    .addTo(context.state.map);

                await context.dispatch("parseJwt").then((response) => {
                    L.control
                        .locate({
                            position: "bottomright",
                            strings: {
                                popup: `<h2>${response.name}</h2>
                        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                            <img style="width: 80px; height: 80px; border-radius: 4px" src=${response.picture
                                    }></img>
                            <p>${response.email}</p>
                        </div>`,
                            },
                        })
                        .addTo(context.state.map);
                });

                await context.dispatch("parseJwt").then((response) => {
                    L.Control.Logout = L.Control.extend({
                        onAdd() {
                            let container = L.DomUtil.create("div");
                            let img = L.DomUtil.create("img");
                            let text = L.DomUtil.create("div");

                            container.style.width = "44px";
                            container.style.height = "44px";
                            container.style.display = "flex";
                            container.style.justifyContent = "center";
                            container.style.alignItems = "center";
                            container.style.pointerEvents = "none";

                            img.style.position = "absolute";
                            img.src = `${response.picture}`;
                            img.style.width = "36x";
                            img.style.height = "36px";
                            img.style.border = "2px solid rgba(0, 0, 0, 0.5)";
                            img.style.borderRadius = "50%";
                            img.style.background = "#fefefe";
                            img.style.cursor = "pointer";
                            img.style.pointerEvents = "auto";

                            text.innerHTML = "登出";
                            text.style.position = "absolute";
                            text.style.width = "36px";
                            text.style.lineHeight = "36px";
                            text.style.borderRadius = "50%";
                            text.style.background = "rgba(254, 254, 254, 0.8)";
                            text.style.fontSize = "16px";
                            text.style.fontWeight = "800";
                            text.style.textAlign = "center";
                            text.style.opacity = "0";
                            text.style.pointerEvents = "none";
                            text.style.transition = "0.2s";

                            img.onmouseenter = (e) => {
                                e.stopPropagation();
                                text.style.opacity = "1";
                            };
                            img.onmouseleave = (e) => {
                                e.stopPropagation();
                                text.style.opacity = "0";
                            };
                            img.ontouchstart = (e) => {
                                e.stopPropagation();
                                text.style.opacity = "1";
                            };

                            img.ontouchend = (e) => {
                                e.stopPropagation();
                                text.style.opacity = "0";
                            };
                            img.ondblclick = (e) => {
                                e.stopPropagation();
                            };
                            img.onclick = (e) => {
                                e.stopPropagation();

                                localStorage.removeItem("token");

                                context.commit("FIRSTTRUE");
                                context.commit("LOADINGFALSE");
                                context.commit("NONEREFRESHING");
                                context.commit("PULLUPMESSAGE");
                                context.commit("NONEMESSAGE");
                                context.commit("NONEKEYWORD");
                                context.commit("HAMBURGER");
                                context.commit("STOP");
                                context.commit("STOPORIGIN");
                                context.commit("STOPPULLUPLOAD");
                                context.commit("STATES");

                                router.push({ path: "/" });
                            };

                            container.appendChild(img);
                            container.appendChild(text);

                            return container;
                        },
                    });
                });

                L.control.Logout = (options) => {
                    return new L.Control.Logout(options);
                };
                L.control.Logout({ position: "topright" }).addTo(context.state.map);

                L.control
                    .scale({
                        position: "bottomleft",
                    })
                    .addTo(context.state.map);
            }

            let popup = L.popup();
            let LatLng = context.state.map;
            function onMapClick(e) {
                popup
                    .setLatLng(e.latlng)
                    .setContent(
                        `<span>經緯度<strong>（${e.latlng.lat
                            .toFixed(6)
                            .toString()}, ${e.latlng.lng
                                .toFixed(6)
                                .toString()}）</strong></sapn>`
                    )
                    .openOn(LatLng);
            }
            LatLng.on("click", onMapClick);
        },
        postPosition() {
            return axios.get("./json/position.json");
        },
        postPolygon() {
            return axios.get("./json/polygon.json");
        },
        async initAxios(context, value) {
            await context.dispatch("initLeaflet", value);
            if (context.state.isFirst === true) {
                context.commit("FIRSTFALSE");
                context.commit("LOADINGTRUE");
                context.commit("NONEMESSAGE");
                context.commit("STOP");
                context.commit("NONEMESSAGE");
                context.commit("STOPORIGIN");
                context.commit("STOPPULLUPLOAD");
                context.commit("STATES");
            }
            axios
                .all([context.dispatch("postPosition"), context.dispatch("postPolygon")])
                .then(
                    axios.spread((position, polygon) => {
                        // console.log(position.data, polygon.data);
                        context.commit("NONEKEYWORD");
                        context.commit("LOADINGFALSE");

                        const positionDataSortResult =
                            position.data.data.result.sort((a, b) => {
                                return a.id - b.id;
                            });

                        context.commit(
                            "STOPORIGINDATA",
                            JSON.parse(JSON.stringify(positionDataSortResult))
                        );
                        context.commit(
                            "FILTERSTOP",
                            context.state.stopOrigin
                        );
                        context.commit(
                            "STOPDATA",
                            JSON.parse(JSON.stringify(positionDataSortResult))
                        );
                        context.commit("STOPPULLUPLOAD");
                        context.commit(
                            "STATESDATA",
                            polygon.data.data.result.features
                        );

                        for (let index = 0; index < context.state.stopData; index++) {
                            if (context.state.stop.length === 0) {
                                context.commit(
                                    "FINISHEDPULLUPMESSAGE"
                                );
                                break;
                            } else if (
                                context.state.stop.length !== 0 &&
                                context.state.pullUpMessage !== "加載中..."
                            ) {
                                context.commit("PULLUPMESSAGE");
                            }
                            context.state.stopPullUpLoad.push(context.state.stop.shift());
                        }
                        Vue.nextTick(() => {
                            context.dispatch("initPosition");
                            context.dispatch("initPolygon");
                            context.dispatch("initLayer");
                            context.dispatch("initBscroll");
                        });
                    })
                )
                .catch((error) => {
                    context.commit("LOADINGTRUE");
                    context.commit("ERRORMESSAGE", error.message);
                    context.commit("STOP");
                    context.commit("STOPORIGIN");
                    context.commit("STOPPULLUPLOAD");
                    context.commit("STATES");
                });
        },
        initPosition(context) {
            context.commit("MARKERCLUSTERGROUP");
            context.commit("MARKERS");
            context.commit("CIRCLES");

            context.state.filterStop.forEach((currentValue) => {
                const { stop_name, latitude, longitude, distance, id, radius } =
                    currentValue;
                L.marker([latitude, longitude])
                    .bindPopup(
                        `<h2>${stop_name}</h2><p>經緯度<strong>（${latitude}, ${longitude}）</strong></p><p>距離地點<strong>（${distance}）</strong></p><p>地點 ID<strong>（${id}）</strong></p>`
                    )
                    .addTo(context.state.markers);
                L.circle([latitude, longitude], {
                    radius,
                    opacity: 0.2,
                }).addTo(context.state.circles);
            });
            context.state.markers.addTo(context.state.markerClusterGroup);
            context.state.map.addLayer(context.state.markerClusterGroup);
            context.state.map.addLayer(context.state.circles);
        },
        initPolygon(context) {
            context.commit(
                "GEOJSON",
                L.geoJSON(context.state.states, {
                    style() {
                        return { color: "#2d044d" };
                    },
                    onEachFeature(feature, layer) {
                        layer.bindPopup(
                            `<h2>${feature.properties["分區"]
                            }</h2><p>容積<strong>（${feature.properties.SHAPE_Area.toFixed(
                                6
                            ).toString()}）</strong></p>`
                        );
                        layer.bindTooltip(feature.properties.TxtMemo, {
                            direction: "center",
                            permanent: false,
                            sticky: true,
                            offset: [-30, 30],
                            opacity: 0.8,
                        });
                    },
                })
            );
            context.state.map.addLayer(context.state.geoJSON);
        },
        initLayer(context) {
            var baseMaps = {
                "Open Street Map": context.state.openStreetMap,
            };
            var overlayMaps = {
                Circles: context.state.circles,
                Polygon: context.state.geoJSON,
            };
            context.commit(
                "LAYERS",
                L.control.layers(baseMaps, overlayMaps).addTo(context.state.map)
            );
        },
        initBscroll(context) {
            context.commit("BSCROLL");

            context.state.bscroll.on("pullingDown", () => { context.dispatch("pullingDownHandler") });
            context.state.bscroll.on("pullingUp", () => { context.dispatch("pullingUpHandler") });
        },
        async pullingDownHandler(context) {
            context.commit("REFRESHING");
            await context.dispatch("requestDownData");
            context.dispatch("finishPullDown");
        },
        async finishPullDown(context) {
            context.state.bscroll.finishPullDown();
            setTimeout(() => {
                context.commit("NONEREFRESHING");
                context.state.bscroll.refresh();
            }, 1000);
        },
        async requestDownData(context) {
            try {
                context.state.bscroll.destroy();

                context.state.map.removeLayer(context.state.geoJSON);
                context.state.markerClusterGroup.removeLayer(context.state.markers);
                context.state.map.removeLayer(context.state.circles);
                context.state.layers.remove();
                context.commit("KEYWORDEMPTYTRUE");

                context.dispatch("initAxios");
                await context.dispatch("awaitDownSetTimeout");

                context.commit("REFRESHSUCCESSFULLY");
            } catch (error) {
                // console.log(error);
            }
        },
        awaitDownSetTimeout() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(20);
                }, 1000);
            });
        },
        async pullingUpHandler(context) {
            await context.dispatch("requestUpData");
            context.state.bscroll.finishPullUp();
            context.state.bscroll.refresh();
        },
        async requestUpData(context) {
            try {
                await context.dispatch("awaitUpSetTimeout");
                for (let index = 0; index < context.state.stopData; index++) {
                    if (context.state.stop.length === 0) {
                        context.commit("FINISHEDPULLUPMESSAGE");
                        break;
                    } else if (
                        context.state.stop.length !== 0 &&
                        context.state.pullUpMessage !== "加載中..."
                    ) {
                        context.commit("PULLUPMESSAGE");
                    }
                    context.state.stopPullUpLoad.push(context.state.stop.shift());
                }
            } catch (error) {
                // console.log(error);
            }
        },
        awaitUpSetTimeout() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(20);
                }, 1000);
            });
        },
    },
    mutations: {
        FIRSTTRUE(state) {
            state.isFirst = true;
        },
        FIRSTFALSE(state) {
            state.isFirst = false;
        },
        LOADINGTRUE(state) {
            state.isLoading = true;
        },
        LOADINGFALSE(state) {
            state.isLoading = false;
        },
        NONEREFRESHING(state) {
            state.pullDownMessage = "";
        },
        REFRESHING(state) {
            state.pullDownMessage = "正在刷新中...";
        },
        REFRESHSUCCESSFULLY(state) {
            state.pullDownMessage = "刷新成功";
        },
        PULLUPMESSAGE(state) {
            state.pullUpMessage = "加載中...";
        },
        FINISHEDPULLUPMESSAGE(state) {
            state.pullUpMessage = "全加載完";
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
        HAMBURGER(state) {
            state.hamburger = true;
        },
        NONEKEYWORD(state) {
            state.keyWord = "";
        },
        EDITKEYWORD(state, value) {
            state.keyWord = value;
        },
        KEYWORDEMPTYTRUE(state) {
            state.keyWordEmpty = true;
        },
        KEYWORDEMPTYFALSE(state) {
            state.keyWordEmpty = false;
        },
        STOP(state) {
            state.stop = [];
        },
        STOPDATA(state, value) {
            state.stop = value;
        },
        STOPORIGIN(state) {
            state.stopOrigin = [];
        },
        STOPORIGINDATA(state, value) {
            state.stopOrigin = value;
        },
        FILTERSTOP(state, value) {
            state.filterStop = value;
        },
        STOPPULLUPLOAD(state) {
            state.stopPullUpLoad = [];
        },
        STATES(state) {
            state.states = [];
        },
        STATESDATA(state, value) {
            state.states = value;
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
        MAP(state, value) {
            state.map = L.map(value, {
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
        CIRCLES(state) {
            state.circles = L.featureGroup();
        },
        MARKERCLUSTERGROUP(state) {
            state.markerClusterGroup = L.markerClusterGroup();
        },
        GEOJSON(state, value) {
            state.geoJSON = value
        },
        LAYERS(state, value) {
            state.layers = value;
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
        keyWordEmpty: false,

        stop: [],
        stopOrigin: [],
        filterStop: [],
        stopPullUpLoad: [],
        stopData: 20,
        states: [],

        bscroll: null,
        map: null,
        markers: null,
        openStreetMap: null,
        markerClusterGroup: null,
        circles: null,

        geoJSON: null,
        layers: null,
    },
    getters: {}
}

export default new Vuex.Store({
    modules: {
        cityAbout: cityOption
    }
})