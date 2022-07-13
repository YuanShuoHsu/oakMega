<template>
    <div class="newTaipeiCity">
        <CityMapLoading />
        <transition-group name="hamburger" appear>
            <CityMenuToggle v-show="!hamburger" key="1" />
            <CityMenu v-show="hamburger && !isLoading" key="2" />
        </transition-group>
        <CityMap ref="mapId" />
    </div>
</template>

<script>
import axios from "axios";
import "animate.css";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet.fullscreen";
import "leaflet.fullscreen/Control.FullScreen.css";

import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import "leaflet-control-geocoder/dist/Control.Geocoder.min.js";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";

import "leaflet.locatecontrol/dist/L.Control.Locate.min.js";
import "leaflet.locatecontrol/dist/L.Control.Locate.min.css";

import CityMapLoading from "./../components/CityMapLoading";
import CityMenuToggle from "./../components/CityMenuToggle";
import CityMenu from "./../components/CityMenu";
import CityMap from "./../components/CityMap";

import { mapState } from "vuex";

export default {
    name: "NewTaipeiCity",
    components: {
        CityMapLoading,
        CityMenuToggle,
        CityMenu,
        CityMap,
    },
    data() {
        return {};
    },
    computed: {
        ...mapState("cityAbout", [
            "isFirst",
            "isLoading",
            "pullDownMessage",
            "pullUpMessage",
            "errorMessage",
            "hamburger",
            "keyWord",
            "stop",
            "stopOrigin",
            "filterStop",
            "stopPullUpLoad",
            "stopData",
            "states",
            "bscroll",
            "map",
            "markers",
            "openStreetMap",
            // "stadiaAlidadeSmoothDark",
            // "stadiaAlidadeSmooth",
            "markerClusterGroup",
            "circles",
            "geoJSON",
            "layers",
        ]),
    },
    watch: {
        keyWord(value) {
            if (this.pullDownMessage !== "正在刷新中...") {
                this.bscroll.scrollTo(0, 0, 0);
                setTimeout(() => {
                    this.bscroll.refresh();
                }, 0);
                this.$store.commit(
                    "cityAbout/FILTERSTOP",
                    this.stopOrigin.filter((stop) => {
                        return stop.stop_name.indexOf(value) !== -1;
                    })
                );
                this.$store.commit(
                    "cityAbout/STOPDATA",
                    JSON.parse(JSON.stringify(this.filterStop))
                );
                this.$store.commit("cityAbout/STOPPULLUPLOAD");
                for (let index = 0; index < this.stopData; index++) {
                    if (this.stop.length === 0) {
                        this.$store.commit("cityAbout/FINISHEDPULLUPMESSAGE");
                        break;
                    } else if (
                        this.stop.length !== 0 &&
                        this.pullUpMessage !== "加載中..."
                    ) {
                        this.$store.commit("cityAbout/PULLUPMESSAGE");
                    }
                    this.stopPullUpLoad.push(this.stop.shift());
                }
                this.markerClusterGroup.removeLayer(this.markers);
                this.map.removeLayer(this.circles);
                this.initPosition();
                this.layers.remove();
                this.initLayer();
            }
        },
    },
    mounted() {
        this.initAxios();
    },
    methods: {
        initLeaflet() {
            if (this.isFirst === true) {
                delete L.Icon.Default.prototype._getIconUrl;

                L.Icon.Default.mergeOptions({
                    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
                    iconUrl: require("leaflet/dist/images/marker-icon.png"),
                    shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
                });

                this.$store.commit("cityAbout/MAP", this.$refs.mapId.$el);
                this.$store.commit("cityAbout/OPENSTREETMAP");
                // this.$store.commit("cityAbout/STADIAALIDADESMOOTHDARK");
                // this.$store.commit("cityAbout/STADIAALIDADESMOOTH");

                L.control
                    .zoom({
                        position: "bottomright",
                    })
                    .addTo(this.map);

                L.control
                    .locate({
                        position: "bottomright",
                        strings: {
                            popup: `<h2>${this.parseJwt().name}</h2>
                        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center">
                            <img style="width: 80px; height: 80px; border-radius: 4px" src=${
                                this.parseJwt().picture
                            }></img>
                            <p>${this.parseJwt().email}</p>
                        </div>`,
                        },
                    })
                    .addTo(this.map);

                L.Control.geocoder({
                    position: "bottomright",
                }).addTo(this.map);

                const vm = this;
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
                        img.src = `${vm.parseJwt().picture}`;
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

                            vm.$store.commit("cityAbout/FIRSTTRUE");
                            vm.$store.commit("cityAbout/LOADINGFALSE");
                            vm.$store.commit("cityAbout/NONEREFRESHING");
                            vm.$store.commit("cityAbout/PULLUPMESSAGE");
                            vm.$store.commit("cityAbout/NONEMESSAGE");
                            vm.$store.commit("cityAbout/NONEKEYWORD");
                            vm.$store.commit("cityAbout/HAMBURGER");
                            vm.$store.commit("cityAbout/STOP");
                            vm.$store.commit("cityAbout/STOPORIGIN");
                            vm.$store.commit("cityAbout/STOPPULLUPLOAD");
                            vm.$store.commit("cityAbout/STATES");

                            vm.$router.push({ path: "/" });
                        };

                        container.appendChild(img);
                        container.appendChild(text);

                        return container;
                    },
                });
                L.control.Logout = (options) => {
                    return new L.Control.Logout(options);
                };
                L.control.Logout({ position: "topright" }).addTo(this.map);

                L.control
                    .scale({
                        position: "bottomleft",
                    })
                    .addTo(this.map);
            }

            let popup = L.popup();
            let LatLng = this.map;
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
        async initAxios() {
            await this.initLeaflet();
            if (this.isFirst === true) {
                this.$store.commit("cityAbout/FIRSTFALSE");
                this.$store.commit("cityAbout/LOADINGTRUE");
                this.$store.commit("cityAbout/NONEMESSAGE");
                this.$store.commit("cityAbout/STOP");
                this.$store.commit("cityAbout/NONEMESSAGE");
                this.$store.commit("cityAbout/STOPORIGIN");
                this.$store.commit("cityAbout/STOPPULLUPLOAD");
                this.$store.commit("cityAbout/STATES");
            }
            axios
                .all([this.postPosition(), this.postPolygon()])
                .then(
                    axios.spread((position, polygon) => {
                        // console.log(position.data, polygon.data);
                        this.$store.commit("cityAbout/NONEKEYWORD");
                        this.$store.commit("cityAbout/LOADINGFALSE");

                        const positionDataSortResult =
                            position.data.data.result.sort((a, b) => {
                                return a.id - b.id;
                            });

                        this.$store.commit(
                            "cityAbout/STOPORIGINDATA",
                            JSON.parse(JSON.stringify(positionDataSortResult))
                        );
                        this.$store.commit(
                            "cityAbout/FILTERSTOP",
                            this.stopOrigin
                        );
                        this.$store.commit(
                            "cityAbout/STOPDATA",
                            JSON.parse(JSON.stringify(positionDataSortResult))
                        );
                        this.$store.commit("cityAbout/STOPPULLUPLOAD");
                        this.$store.commit(
                            "cityAbout/STATESDATA",
                            polygon.data.data.result.features
                        );

                        for (let index = 0; index < this.stopData; index++) {
                            if (this.stop.length === 0) {
                                this.$store.commit(
                                    "cityAbout/FINISHEDPULLUPMESSAGE"
                                );
                                break;
                            } else if (
                                this.stop.length !== 0 &&
                                this.pullUpMessage !== "加載中..."
                            ) {
                                this.$store.commit("cityAbout/PULLUPMESSAGE");
                            }
                            this.stopPullUpLoad.push(this.stop.shift());
                        }
                        this.$nextTick(() => {
                            this.initBscroll();
                            this.initPosition();
                            this.initPolygon();
                            this.initLayer();
                        });
                    })
                )
                .catch((error) => {
                    this.$store.commit("cityAbout/LOADINGTRUE");
                    this.$store.commit("cityAbout/ERRORMESSAGE", error.message);
                    this.$store.commit("cityAbout/STOP");
                    this.$store.commit("cityAbout/STOPORIGIN");
                    this.$store.commit("cityAbout/STOPPULLUPLOAD");
                    this.status = [];
                });
        },
        initPosition() {
            this.$store.commit("cityAbout/MARKERCLUSTERGROUP");
            this.$store.commit("cityAbout/MARKERS");
            this.$store.commit("cityAbout/CIRCLES");

            this.filterStop.forEach((currentValue) => {
                const { stop_name, latitude, longitude, distance, id, radius } =
                    currentValue;
                L.marker([latitude, longitude])
                    .bindPopup(
                        `<h2>${stop_name}</h2><p>經緯度<strong>（${latitude}, ${longitude}）</strong></p><p>距離地點<strong>（${distance}）</strong></p><p>地點 ID<strong>（${id}）</strong></p>`
                    )
                    .addTo(this.markers);
                L.circle([latitude, longitude], {
                    radius,
                    opacity: 0.2,
                }).addTo(this.circles);
            });
            this.markers.addTo(this.markerClusterGroup);
            this.map.addLayer(this.markerClusterGroup);
            this.map.addLayer(this.circles);
        },
        initPolygon() {
            this.$store.commit(
                "cityAbout/GEOJSON",
                L.geoJSON(this.states, {
                    style() {
                        return { color: "#2d044d" };
                    },
                    onEachFeature(feature, layer) {
                        layer.bindPopup(
                            `<h2>${
                                feature.properties["分區"]
                            }</h2><p>容積<strong>（${feature.properties.SHAPE_Area.toFixed(
                                6
                            ).toString()}）</strong></p>`
                        );
                        layer.bindTooltip(feature.properties.TxtMemo, {
                            direction: "center",
                            permanent: false,
                            sticky: true,
                            offset: [12, -12],
                            opacity: 0.8,
                        });
                    },
                })
            );
            this.map.addLayer(this.geoJSON);
        },
        initLayer() {
            var baseMaps = {
                "Open Street Map": this.openStreetMap,
                // "Stadia.AlidadeSmoothDark": this.stadiaAlidadeSmoothDark,
                // "Stadia Alidade Smooth": this.stadiaAlidadeSmooth,
            };
            var overlayMaps = {
                Circles: this.circles,
                Polygon: this.geoJSON,
            };
            this.$store.commit(
                "cityAbout/LAYERS",
                L.control.layers(baseMaps, overlayMaps).addTo(this.map)
            );
        },
        initBscroll() {
            this.$store.commit("cityAbout/BSCROLL");

            this.bscroll.on("pullingUp", this.pullingUpHandler);
            this.bscroll.on("pullingDown", this.pullingDownHandler);
        },
        async pullingDownHandler() {
            this.$store.commit("cityAbout/REFRESHING");
            await this.requestDownData();
            this.finishPullDown();
        },
        async finishPullDown() {
            this.bscroll.finishPullDown();
            setTimeout(() => {
                this.$store.commit("cityAbout/NONEREFRESHING");
                this.bscroll.refresh();
            }, 1000);
        },
        async requestDownData() {
            try {
                this.bscroll.destroy();

                this.map.removeLayer(this.geoJSON);
                this.markerClusterGroup.removeLayer(this.markers);
                this.map.removeLayer(this.circles);
                this.layers.remove();

                this.initAxios();
                await this.awaitDownSetTimeout();

                this.$store.commit("cityAbout/REFRESHSUCCESSFULLY");
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
        async pullingUpHandler() {
            await this.requestUpData();
            this.bscroll.finishPullUp();
            this.bscroll.refresh();
        },
        async requestUpData() {
            try {
                await this.awaitUpSetTimeout();
                for (let index = 0; index < this.stopData; index++) {
                    if (this.stop.length === 0) {
                        this.$store.commit("cityAbout/FINISHEDPULLUPMESSAGE");
                        break;
                    } else if (
                        this.stop.length !== 0 &&
                        this.pullUpMessage !== "加載中..."
                    ) {
                        this.$store.commit("cityAbout/PULLUPMESSAGE");
                    }
                    this.stopPullUpLoad.push(this.stop.shift());
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
    },
};
</script>

<style scoped lang="scss">
.newTaipeiCity {
    position: relative;
    width: 100%;
    height: 100%;
    .mapLoading {
        position: relative;
        width: 100%;
        height: 100vh;
        background: #e7d5c7;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        .loadingItem {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            img {
                width: 100px;
                height: 100px;
                border-radius: 8px;
                margin: 16px 0;
            }
            ul {
                padding: 0;
                display: flex;
                flex-direction: row;
                list-style-type: none;
                li {
                    margin: 0 5px;
                    min-width: 20px;
                    min-height: 20px;
                    border-radius: 50%;
                    background: #7c171d;
                    animation: loadingEffect 1s linear infinite;
                }
                li:nth-child(1) {
                    animation-delay: 0s;
                }
                li:nth-child(2) {
                    animation-delay: -1.2s;
                }
                li:nth-child(3) {
                    animation-delay: -1s;
                }
                li:nth-child(4) {
                    animation-delay: -0.8s;
                }
                li:nth-child(5) {
                    animation-delay: -0.6s;
                }
                @keyframes loadingEffect {
                    0% {
                        transform: translateY(0);
                    }
                    60% {
                        transform: translateY(0);
                    }
                    80% {
                        transform: translateY(-100%);
                    }
                    100% {
                        transform: translateY(0);
                    }
                }
            }
            p {
                letter-spacing: 2px;
                user-select: none;
            }
        }
        p {
            letter-spacing: 2px;
            user-select: none;
        }
    }
    .hamburger-enter-active,
    .hamburger-leave-active {
        transition: 0.2s;
    }
    .hamburger-enter,
    .hamburger-leave-to {
        transform: translateX(-120%);
    }
    .hamburger-enter-to,
    .hamburger-leave {
        transform: translateX(0px);
    }
}

.leaflet-popup-close-button {
    display: none;
}

.leaflet-label-overlay {
    line-height: 0px;
    margin-top: 9px;
    position: absolute;
}
</style>
