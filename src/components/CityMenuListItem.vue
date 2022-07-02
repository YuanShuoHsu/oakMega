<template>
    <li @click="stopLocation(stopObj.latitude, stopObj.longitude)">
        <div class="stopItemContainer">
            <div class="stopItem">
                <h4 class="stopResponse">都更地點</h4>
                <div class="stopResult">
                    {{ stopObj.stop_name }}
                </div>
            </div>
            <div class="stopItem">
                <h4 class="stopResponse">經緯度</h4>
                <div class="stopResult">
                    <p>{{ stopObj.latitude }}</p>
                    <p>{{ stopObj.longitude }}</p>
                </div>
            </div>
            <div class="stopItem">
                <h4 class="stopResponse">距離地點</h4>
                <div class="stopResult">
                    {{ stopObj.distance }}
                </div>
            </div>
            <div class="stopItem">
                <h4 class="stopResponse">地點ID</h4>
                <div class="stopResult">
                    {{ stopObj.id }}
                </div>
            </div>
        </div>
    </li>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "newTaipeiCityItem",
    props: ["stopObj"],
    computed: {
        ...mapState("cityAbout", ["map", "markers"]),
    },
    methods: {
        stopLocation(latitude, longitude) {
            this.map.setView([latitude, longitude], 19);
            for (var key in this.markers._layers) {
                if (
                    this.markers._layers[key]._latlng.lat === latitude &&
                    this.markers._layers[key]._latlng.lng === longitude
                ) {
                    this.markers._layers[key].openPopup();
                }
            }
        },
    },
};
</script>

<style scoped lang="scss">
li {
    height: 200px;
    border-bottom: 1px solid #e7d5c7;
    transition: 0.2s;
    .stopItemContainer {
        padding: 25px 10px 0px 10px;
        width: calc(100% - 20px);
        height: calc(100% - 25px);
        display: grid;
        gap: 0px 10px;
        grid-template-columns: repeat(2, 1fr);
        .stopItem {
            width: 135px;
            height: 87.5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            .stopResponse {
                margin: 0;
                width: 100px;
                line-height: 35px;
                border-radius: 4px;
                background: #e7d5c7;
                letter-spacing: 2px;
                color: #2d044d;
                user-select: none;
                transition: 0.2s;
            }
            .stopResponse:hover {
                letter-spacing: 4px;
            }
            .stopResult {
                line-height: 52.5px;
                color: #2d044d;
                opacity: 0.8;
                user-select: none;
                p {
                    margin: 0;
                    line-height: 26.25px;
                }
            }
        }
    }
}
li:hover {
    background: rgba(238, 238, 238, 0.8);
    cursor: pointer;
}
</style>
