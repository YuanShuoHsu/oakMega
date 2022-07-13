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
            "isLoading",
            "pullDownMessage",
            "pullUpMessage",
            "hamburger",
            "keyWord",
            "stop",
            "stopOrigin",
            "filterStop",
            "stopPullUpLoad",
            "stopData",
            "bscroll",
            "map",
            "markers",
            "markerClusterGroup",
            "circles",
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
        this.$store.dispatch("cityAbout/initAxios", this.$refs.mapId.$el);
    }
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
