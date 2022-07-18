<template>
    <div class="socialLogin">
        <transition
            name="animate__animated animate__bounce animate__slow"
            appear
            enter-active-class="animate__fadeIn"
            leave-active-class="animate__fadeOut"
        >
            <div class="socialButtonGroup">
                <img src="./../assets/oakMegaHome.png" alt="oakMega" />
                <LoginGoogle />
                <LoginMeta />
            </div>
        </transition>
    </div>
</template>
<script>
import "animate.css";
import LoginGoogle from "./../components/LoginGoogle";
import LoginMeta from "./../components/LoginMeta";
export default {
    name: "SocialLogin",
    components: { LoginGoogle, LoginMeta },
};
</script>

<style scoped lang="scss">
.socialLogin {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #e7d5c7;
    .socialButtonGroup {
        width: 300px;
        min-height: 400px;
        background: rgba(254, 254, 254, 0.2);
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        border-top: 1px solid #eeeeee;
        border-left: 1px solid #eeeeee;
        border-radius: 12px;
        img {
            width: 100px;
            height: 100px;
            border-radius: 8px;
        }
    }
}
</style>
