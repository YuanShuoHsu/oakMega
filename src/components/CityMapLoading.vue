<template>
    <div class="cityMapLoading" v-show="isLoading">
        <transition
            name="animate__animated animate__bounce animate__slow"
            appear
            enter-active-class="animate__fadeIn"
            leave-active-class="animate__fadeOut"
        >
            <div class="loadingItem">
                <img src="./../assets/oakMegaHome.png" alt="" />
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
                <p v-show="!errorMessage.length">{{ pullUpMessage }}</p>
            </div>
        </transition>
        <transition
            name="animate__animated animate__bounce animate__slow"
            appear
            enter-active-class="animate__hinge"
            leave-active-class="animate__fadeOut"
        >
            <p v-show="errorMessage.length">{{ errorMessage }}...</p>
        </transition>
    </div>
</template>

<script>
import "animate.css";

import { mapState } from "vuex";

export default {
    name: "CityMapLoading",
    computed: {
        ...mapState("cityAbout", [
            "isLoading",
            "pullUpMessage",
            "errorMessage",
        ]),
    },
};
</script>

<style scoped lang="scss">
.cityMapLoading {
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
</style>
