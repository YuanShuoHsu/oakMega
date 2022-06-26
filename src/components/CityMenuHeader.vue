<template>
    <div class="cityMenuHeader">
        <div class="oakMegaLogo">
            <img src="./../assets/oakMegaLogo.svg" alt="" />
            <div @click="toggleHamburger" class="hamburger">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path
                        d="M0 96C0 78.33 14.33 64 32 64H416C433.7 64 448 78.33 448 96C448 113.7 433.7 128 416 128H32C14.33 128 0 113.7 0 96zM0 256C0 238.3 14.33 224 32 224H416C433.7 224 448 238.3 448 256C448 273.7 433.7 288 416 288H32C14.33 288 0 273.7 0 256zM416 448H32C14.33 448 0 433.7 0 416C0 398.3 14.33 384 32 384H416C433.7 384 448 398.3 448 416C448 433.7 433.7 448 416 448z"
                    />
                </svg>
            </div>
        </div>
        <div class="cityAreaContainer">
            <div class="cityArea">
                <label for="selectCity">縣市</label>
                <select
                    name="selectCity"
                    id="selectCity"
                    class="selectCityArea"
                >
                    <option value="新北市">新北市</option>
                </select>
            </div>
            <div class="cityArea">
                <label for="selectArea">地點</label>
                <input
                    v-model.lazy.trim="changeKeyWord"
                    type="text"
                    name="selectArea"
                    id="selectArea"
                    class="selectCityArea"
                    placeholder="輸入都更地點名稱"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "CityMenuHeader",
    data() {
        return {
            changeKeyWord: "",
        };
    },
    computed: {
        ...mapState("cityAbout", ["hamburger"]),
    },
    watch: {
        changeKeyWord(value) {
            this.$store.commit("cityAbout/EDITKEYWORD", value);
        },
    },
    methods: {
        toggleHamburger() {
            this.$store.commit("cityAbout/ANTIHAMBURGER", this.hamburger);
        },
    },
};
</script>

<style scoped lang="scss">
.cityMenuHeader {
    .oakMegaLogo {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
            margin: 0 0 0 15px;
            height: 25px;
            user-select: none;
            cursor: pointer;
        }
        .hamburger {
            margin: 0 15px 0 0;
            width: 24px;
            height: 24px;
            border: 2px solid #e7d5c7;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            transition: 0.2s;
            svg {
                width: 20px;
                height: 20px;
                fill: #2d044d;
                pointer-events: none;
                path {
                    pointer-events: none;
                }
            }
        }
        .hamburger:hover {
            background: rgba(254, 254, 254, 0.8);
        }
    }
    .cityAreaContainer {
        width: 100%;
        border-bottom: 1px solid #e7d5c7;
        padding: 0 0 7.5px 0;
        .cityArea {
            height: 40px;
            display: flex;
            align-items: center;
            label {
                margin: 0 5px 0 15px;
                color: #2d044d;
                white-space: nowrap;
                user-select: none;
            }
            .selectCityArea {
                margin: 0 15px 0 5px;
                width: 100%;
                height: 25px;
                border: 1px solid #e7d5c7;
                border-radius: 4px;
                background: rgba(254, 254, 254, 0.8);
                color: #2d044d;
                text-align: center;
            }
        }
    }
}
</style>
